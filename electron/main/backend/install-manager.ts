import { BrowserWindow, dialog, ipcMain, WebContents } from "electron";
import { spawn, ChildProcess, exec } from "node:child_process";
import { promisify } from "node:util";
import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import pino from "pino";

import { ChannelPayload, InstalledAppInfo } from "../../typedefinition";
import axios from "axios";

const logger = pino({ name: "install-manager" });

type InstallTask = {
  id: number;
  pkgname: string;
  execCommand: string;
  execParams: string[];
  download_process: ChildProcess | null;
  install_process: ChildProcess | null;
  webContents: WebContents | null;
  downloadDir?: string;
  metalinkUrl?: string;
  filename?: string;
  origin: "spark" | "apm";
};

const SHELL_CALLER_PATH = "/opt/spark-store/extras/shell-caller.sh";

export const tasks = new Map<number, InstallTask>();

let idle = true; // Indicates if the installation manager is idle

const checkSuperUserCommand = async (): Promise<string> => {
  let superUserCmd = "";
  const execAsync = promisify(exec);
  if (process.getuid && process.getuid() !== 0) {
    const { stdout, stderr } = await execAsync("which /usr/bin/pkexec");
    if (stderr) {
      logger.error("没有找到 pkexec 命令");
      return;
    }
    logger.info(`找到提升权限命令: ${stdout.trim()}`);
    superUserCmd = stdout.trim();

    if (superUserCmd.length === 0) {
      logger.error("没有找到提升权限的命令 pkexec!");
    }
  }
  return superUserCmd;
};

const runCommandCapture = async (execCommand: string, execParams: string[]) => {
  return await new Promise<{ code: number; stdout: string; stderr: string }>(
    (resolve) => {
      const child = spawn(execCommand, execParams, {
        shell: false,
        env: process.env,
      });

      let stdout = "";
      let stderr = "";

      child.stdout?.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr?.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("error", (err) => {
        resolve({ code: -1, stdout, stderr: err.message });
      });

      child.on("close", (code) => {
        resolve({ code: typeof code === "number" ? code : -1, stdout, stderr });
      });
    },
  );
};

const parseInstalledList = (output: string) => {
  const apps: Array<InstalledAppInfo> = [];
  const lines = output.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("Listing")) continue;
    if (trimmed.startsWith("[INFO]")) continue;

    const match = trimmed.match(/^(\S+)\/\S+,\S+\s+(\S+)\s+(\S+)\s+\[(.+)\]$/);
    if (!match) continue;
    apps.push({
      pkgname: match[1],
      version: match[2],
      arch: match[3],
      flags: match[4],
      raw: trimmed,
    });
  }
  return apps;
};

/** 检测本机是否已安装 apm 命令 */
const checkApmAvailable = async (): Promise<boolean> => {
  const { code, stdout } = await runCommandCapture("which", ["apm"]);
  const found = code === 0 && stdout.trim().length > 0;
  if (!found) logger.info("未检测到 apm 命令");
  return found;
};

/** 提权执行 shell-caller aptss install apm 安装 APM，安装后需用户重启电脑 */
const runInstallApm = async (superUserCmd: string): Promise<boolean> => {
  const execCommand = superUserCmd || SHELL_CALLER_PATH;
  const execParams = superUserCmd
    ? [SHELL_CALLER_PATH, "aptss", "install", "apm"]
    : [SHELL_CALLER_PATH, "aptss", "install", "apm"];
  logger.info(`执行安装 APM: ${execCommand} ${execParams.join(" ")}`);
  const { code, stdout, stderr } = await runCommandCapture(
    execCommand,
    execParams,
  );
  if (code !== 0) {
    logger.error({ code, stdout, stderr }, "安装 APM 失败");
    return false;
  }
  logger.info("安装 APM 完成");
  return true;
};

const compareVersions = async (
  ver1: string,
  op: string,
  ver2: string,
): Promise<boolean> => {
  try {
    const cmd = "dpkg";
    const args = ["--compare-versions", ver1, op, ver2];
    let { code } = await runCommandCapture(cmd, args);

    if (code !== 0 && code !== 1) {
      // Fallback to amber-pm-debug dpkg if dpkg is not available or errors out unexpectedly
      const fallbackCode = await runCommandCapture("amber-pm-debug", [
        "dpkg",
        ...args,
      ]);
      code = fallbackCode.code;
    }

    return code === 0;
  } catch (err) {
    logger.error(`Version comparison failed: ${err}`);
    return false;
  }
};

const parseAptssUpgradableList = (output: string) => {
  const apps: Array<{
    pkgname: string;
    newVersion: string;
    currentVersion: string;
    origin: "spark" | "apm";
  }> = [];
  const lines = output.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("Listing")) continue;
    if (trimmed.startsWith("[INFO]")) continue;
    if (trimmed.includes("=") && !trimmed.includes("/")) continue;

    if (!trimmed.includes("/")) continue;

    const tokens = trimmed.split(/\s+/);
    if (tokens.length < 2) continue;
    const pkgToken = tokens[0];
    const pkgname = pkgToken.split("/")[0];
    const newVersion = tokens[1] || "";
    const currentMatch = trimmed.match(
      /\[(?:upgradable from|from):\s*([^\]\s]+)\]/i,
    );
    const currentToken = tokens[5] || "";
    const currentVersion =
      currentMatch?.[1] || currentToken.replace("[", "").replace("]", "");

    if (!pkgname) continue;
    apps.push({ pkgname, newVersion, currentVersion, origin: "spark" });
  }
  return apps;
};

const parseApmUpgradableList = (output: string) => {
  const apps: Array<{
    pkgname: string;
    newVersion: string;
    currentVersion: string;
    origin: "spark" | "apm";
  }> = [];
  const lines = output.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("Listing")) continue;
    if (trimmed.startsWith("[INFO]")) continue;
    if (trimmed.startsWith("警告")) continue;

    // Remove ANSI escape codes
    // eslint-disable-next-line no-control-regex
    const cleanLine = trimmed.replace(/\x1b\[[0-9;]*m/g, "");

    if (cleanLine.includes("=") && !cleanLine.includes("/")) continue;
    if (!cleanLine.includes("/")) continue;

    const tokens = cleanLine.split(/\s+/);
    if (tokens.length < 2) continue;
    const pkgToken = tokens[0];
    const pkgname = pkgToken.split("/")[0];
    const newVersion = tokens[1] || "";
    const currentMatch = cleanLine.match(
      /\[(?:upgradable from|from):\s*([^\]\s]+)\]/i,
    );
    const currentToken = tokens[5] || "";
    const currentVersion =
      currentMatch?.[1] || currentToken.replace("[", "").replace("]", "");

    if (!pkgname) continue;
    apps.push({ pkgname, newVersion, currentVersion, origin: "apm" });
  }
  return apps;
};

const getIgnoredUpdates = (): string[] => {
  try {
    const ignoredPath = path.join(
      os.homedir(),
      ".config",
      "spark-store",
      "ignored_updates.json",
    );
    if (fs.existsSync(ignoredPath)) {
      const data = fs.readFileSync(ignoredPath, "utf8");
      return JSON.parse(data) as string[];
    }
  } catch (err) {
    logger.error(`Failed to read ignored updates: ${err}`);
  }
  return [];
};

// Listen for download requests from renderer process
ipcMain.on("queue-install", async (event, download_json) => {
  const download =
    typeof download_json === "string"
      ? JSON.parse(download_json)
      : download_json;
  const { id, pkgname, metalinkUrl, filename, upgradeOnly, origin } =
    download || {};

  if (!id || !pkgname) {
    logger.warn("passed arguments missing id or pkgname");
    return;
  }

  logger.info(`收到下载任务: ${id}, 软件包名称: ${pkgname}, 来源: ${origin}`);

  // 避免重复添加同一任务，但允许重试下载
  if (tasks.has(id) && !download.retry) {
    tasks.get(id)?.webContents?.send("install-log", {
      id,
      time: Date.now(),
      message: `任务id： ${id} 已在列表中，忽略重复添加`,
    });
    tasks.get(id)?.webContents?.send("install-complete", {
      id: id,
      success: false,
      time: Date.now(),
      exitCode: -1,
      message: `{"message":"任务id： ${id} 已在列表中，忽略重复添加","stdout":"","stderr":""}`,
    });
    return;
  }

  const webContents = event.sender;
  const superUserCmd = await checkSuperUserCommand();
  let execCommand = "";
  const execParams = [];
  const downloadDir = `/tmp/spark-store/download/${pkgname}`;

  // APM 应用：若本机没有 apm 命令，弹窗提示并可选提权安装 APM（安装后需重启电脑）
  if (origin === "apm") {
    const hasApm = await checkApmAvailable();
    if (!hasApm) {
      const win = BrowserWindow.fromWebContents(webContents);
      const { response } = await dialog.showMessageBox(win ?? undefined, {
        type: "question",
        title: "需要安装 APM",
        message: "此应用需要使用 APM 安装。",
        detail:
          "APM是星火应用商店的容器包管理器，安装APM后方可安装此应用，是否确认安装？",
        buttons: ["确认", "取消"],
        defaultId: 0,
        cancelId: 1,
      });
      if (response !== 0) {
        webContents.send("install-complete", {
          id,
          success: false,
          time: Date.now(),
          exitCode: -1,
          message: JSON.stringify({
            message: "用户取消安装 APM，无法继续安装此应用",
            stdout: "",
            stderr: "",
          }),
        });
        return;
      }
      const installApmOk = await runInstallApm(superUserCmd);
      if (!installApmOk) {
        webContents.send("install-complete", {
          id,
          success: false,
          time: Date.now(),
          exitCode: -1,
          message: JSON.stringify({
            message: "安装 APM 失败，请检查网络或权限后重试",
            stdout: "",
            stderr: "",
          }),
        });
        return;
      } else {
        // 安装APM成功，提示用户已安装成功，需要重启后方可展示应用
        await dialog.showMessageBox(win ?? undefined, {
          type: "info",
          title: "APM 安装成功",
          message: "恭喜您，APM 已成功安装",
          detail:
            "APM 应用需重启后方可展示和使用，若完成安装后无法在应用列表中展示，请重启电脑后继续。",
          buttons: ["确定"],
          defaultId: 0,
        });
      }
    }
  }

  if (origin === "spark") {
    // Spark Store logic
    execCommand = superUserCmd || SHELL_CALLER_PATH;
    if (superUserCmd) execParams.push(SHELL_CALLER_PATH);

    if (metalinkUrl && filename) {
      execParams.push(
        "ssinstall",
        `${downloadDir}/${filename}`,
        "--delete-after-install",
      );
    } else {
      execParams.push("aptss", "install", "-y", pkgname);
    }
  } else {
    // APM Store logic
    execCommand = superUserCmd || SHELL_CALLER_PATH;
    if (superUserCmd) {
      execParams.push(SHELL_CALLER_PATH);
    }
    execParams.push("apm");

    if (metalinkUrl && filename) {
      execParams.push("ssaudit", `${downloadDir}/${filename}`);
    } else {
      execParams.push("install", "-y", pkgname);
    }
  }

  const task: InstallTask = {
    id,
    pkgname,
    execCommand,
    execParams,
    download_process: null,
    install_process: null,
    webContents,
    downloadDir,
    metalinkUrl,
    filename,
    origin: origin || "apm",
  };

  // If it's a cross-upgrade (APM version > Spark version), we must remove Spark app first.
  // We can inject a remove command before the install phase in processNextInQueue,
  // or simply execute the remove synchronously/asynchronously before launching the install child.
  if (download.isCrossUpgrade && origin === "apm") {
    const removeCommand = superUserCmd || SHELL_CALLER_PATH;
    const removeParams = superUserCmd ? [SHELL_CALLER_PATH, "aptss", "remove", "-y", pkgname] : ["aptss", "remove", "-y", pkgname];

    // To cleanly integrate, we can wrap the install process to first spawn the remove process
    // This will be handled in `processNextInQueue` by checking `download.isCrossUpgrade`
    (task as any).isCrossUpgrade = true;
    (task as any).removeCommand = removeCommand;
    (task as any).removeParams = removeParams;
  }

  tasks.set(id, task);
  if (idle) processNextInQueue();
});

// Cancel Handler
ipcMain.on("cancel-install", (event, id) => {
  if (tasks.has(id)) {
    const task = tasks.get(id);
    if (task) {
      task.download_process?.kill(); // Kill the download process
      task.install_process?.kill(); // Kill the install process
      logger.info(`已取消任务: ${id}`);
    }
    // Note: 'close' handler usually handles cleanup
  }
});

async function processNextInQueue() {
  if (!idle) return;

  // Always take the first task to ensure sequence
  const task = Array.from(tasks.values())[0];
  if (!task) {
    idle = true;
    return;
  }

  idle = false;
  const { webContents, id, downloadDir } = task;

  const sendLog = (msg: string) => {
    webContents?.send("install-log", { id, time: Date.now(), message: msg });
  };
  const sendStatus = (status: string) => {
    webContents?.send("install-status", {
      id,
      time: Date.now(),
      message: status,
    });
  };

  try {
    // 1. Metalink & Aria2c Phase
    if (task.metalinkUrl) {
      try {
        if (!fs.existsSync(downloadDir)) {
          fs.mkdirSync(downloadDir, { recursive: true });
        }
      } catch (err) {
        logger.error(`无法创建目录 ${downloadDir}: ${err}`);
        throw err;
      }

      const metalinkPath = path.join(downloadDir, `${task.filename}.metalink`);

      sendLog(`正在获取 Metalink 文件: ${task.metalinkUrl}`);

      const response = await axios.get(task.metalinkUrl, {
        baseURL: "https://erotica.spark-app.store",
        responseType: "stream",
      });

      const writer = fs.createWriteStream(metalinkPath);
      response.data.pipe(writer);

      await new Promise<void>((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      sendLog("Metalink 文件下载完成");

      // Aria2c
      const aria2Args = [
        `--dir=${downloadDir}`,
        "--allow-overwrite=true",
        "--summary-interval=1",
        "-M",
        metalinkPath,
      ];

      sendStatus("downloading");
      sendLog(`启动下载: aria2c ${aria2Args.join(" ")}`);

      await new Promise<void>((resolve, reject) => {
        const child = spawn("aria2c", aria2Args);
        task.download_process = child;

        child.stdout.on("data", (data) => {
          const str = data.toString();
          // Match ( 12%) or (12%)
          const match = str.match(/[0-9]+(\.[0-9]+)?%/g);
          if (match) {
            const p = parseFloat(match.at(-1)) / 100;
            webContents?.send("install-progress", { id, progress: p });
          }
        });
        child.stderr.on("data", (d) => sendLog(`aria2c: ${d}`));

        child.on("close", (code) => {
          if (code === 0) {
            webContents?.send("install-progress", { id, progress: 1 });
            resolve();
          } else {
            reject(new Error(`Aria2c exited with code ${code}`));
          }
        });
        child.on("error", reject);
      });
    }

    // 2. Install Phase
    sendStatus("installing");

    // Optional: Cross Upgrade Remove Phase
    if ((task as any).isCrossUpgrade) {
      const rmCmdString = `${(task as any).removeCommand} ${(task as any).removeParams.join(" ")}`;
      sendLog(`执行卸载旧版: ${rmCmdString}`);
      logger.info(`跨平台更新：启动卸载: ${rmCmdString}`);

      await new Promise<{ code: number; stdout: string; stderr: string }>((resolve, reject) => {
        const child = spawn((task as any).removeCommand, (task as any).removeParams, {
          shell: false,
          env: process.env,
        });

        // Use the same install_process ref so we can cancel it if needed
        task.install_process = child;

        let stdout = "";
        let stderr = "";

        child.stdout.on("data", (d) => {
          const s = d.toString();
          stdout += s;
          sendLog(s);
        });

        child.stderr.on("data", (d) => {
          const s = d.toString();
          stderr += s;
          sendLog(s);
        });

        child.on("close", (code) => {
          resolve({ code: code ?? -1, stdout, stderr });
        });
        child.on("error", (err) => {
          reject(err);
        });
      });
    }

    const cmdString = `${task.execCommand} ${task.execParams.join(" ")}`;
    sendLog(`执行安装: ${cmdString}`);
    logger.info(`启动安装: ${cmdString}`);

    const result = await new Promise<{
      code: number;
      stdout: string;
      stderr: string;
    }>((resolve, reject) => {
      const child = spawn(task.execCommand, task.execParams, {
        shell: false,
        env: process.env,
      });
      task.install_process = child;

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (d) => {
        const s = d.toString();
        stdout += s;
        sendLog(s);
      });

      child.stderr.on("data", (d) => {
        const s = d.toString();
        stderr += s;
        sendLog(s);
      });

      child.on("close", (code) => {
        resolve({ code: code ?? -1, stdout, stderr });
      });
      child.on("error", (err) => {
        reject(err);
      });
    });

    // Completion
    const success = result.code === 0;
    const msgObj = {
      message: success ? "安装完成" : `安装失败，退出码 ${result.code}`,
      stdout: result.stdout,
      stderr: result.stderr,
    };

    if (success) logger.info(msgObj);
    else logger.error(msgObj);

    webContents?.send("install-complete", {
      id,
      success,
      time: Date.now(),
      exitCode: result.code,
      message: JSON.stringify(msgObj),
    });
  } catch (error) {
    logger.error(`Task ${id} failed: ${error}`);
    webContents?.send("install-complete", {
      id,
      success: false,
      time: Date.now(),
      exitCode: -1,
      message: JSON.stringify({
        message: error instanceof Error ? error.message : String(error),
        stdout: "",
        stderr: "",
      }),
    });
  } finally {
    tasks.delete(id);
    idle = true;
    // Trigger next
    if (tasks.size > 0) {
      processNextInQueue();
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
ipcMain.handle("check-installed", async (_event, payload: any) => {
  const pkgname = typeof payload === "string" ? payload : payload.pkgname;
  const origin = typeof payload === "string" ? "spark" : payload.origin;

  if (!pkgname) {
    logger.warn("check-installed missing pkgname");
    return false;
  }

  logger.info(`检查应用是否已安装: ${pkgname} (来源: ${origin})`);

  let isInstalled = false;

  if (origin === "apm") {
    const { code, stdout } = await runCommandCapture("apm", [
      "list",
      "--installed",
    ]);
    if (code === 0) {
      // eslint-disable-next-line no-control-regex
      const cleanStdout = stdout.replace(/\x1b\[[0-9;]*m/g, "");
      const lines = cleanStdout.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (
          !trimmed ||
          trimmed.startsWith("Listing") ||
          trimmed.startsWith("[INFO]") ||
          trimmed.startsWith("警告")
        )
          continue;
        if (trimmed.includes("/")) {
          const installedPkg = trimmed.split("/")[0].trim();
          if (installedPkg === pkgname) {
            isInstalled = true;
            logger.info(`应用已安装 (APM检测): ${pkgname}`);
            break;
          }
        }
      }
    }
    return isInstalled;
  }

  const checkScript = "/opt/spark-store/extras/check-is-installed";

  // 首先尝试使用内置脚本
  if (fs.existsSync(checkScript)) {
    const child = spawn(checkScript, [pkgname], {
      shell: false,
      env: process.env,
    });

    await new Promise<void>((resolve) => {
      child.on("error", (err) => {
        logger.error(`check-installed 脚本执行失败: ${err?.message || err}`);
        resolve();
      });

      child.on("close", (code) => {
        if (code === 0) {
          isInstalled = true;
          logger.info(`应用已安装 (脚本检测): ${pkgname}`);
        }
        resolve();
      });
    });

    if (isInstalled) return true;
  }

  // 如果脚本不存在或检测不到，使用 dpkg-query 作为后备
  logger.info(`尝试使用 dpkg-query 检测: ${pkgname}`);
  const { code, stdout } = await runCommandCapture("dpkg-query", [
    "-W",
    "-f=${Status}",
    pkgname,
  ]);

  if (code === 0 && stdout.includes("install ok installed")) {
    isInstalled = true;
    logger.info(`应用已安装 (dpkg-query 检测): ${pkgname}`);
  } else {
    logger.info(`应用未安装 (dpkg-query 检测): ${pkgname}`);
  }

  return isInstalled;
});

ipcMain.on("remove-installed", async (_event, payload) => {
  const webContents = _event.sender;
  const pkgname = typeof payload === "string" ? payload : payload.pkgname;
  const origin = typeof payload === "string" ? "spark" : payload.origin;

  if (!pkgname) {
    logger.warn("remove-installed missing pkgname");
    return;
  }
  logger.info(`卸载已安装应用: ${pkgname} (来源: ${origin})`);

  let execCommand = "";
  const execParams = [];

  const superUserCmd = await checkSuperUserCommand();
  execCommand = superUserCmd || SHELL_CALLER_PATH;
  if (superUserCmd) execParams.push(SHELL_CALLER_PATH);

  if (origin === "spark") {
    execParams.push("aptss", "remove", pkgname);
  } else {
    execParams.push("apm", "remove", "-y", pkgname);
  }

  const child = spawn(execCommand, execParams, {
    shell: false,
    env: process.env,
  });
  let output = "";

  child.stdout.on("data", (data) => {
    const chunk = data.toString();
    output += chunk;
    webContents.send("remove-progress", chunk);
  });

  child.on("close", (code) => {
    const success = code === 0;
    // 拼接json消息
    const messageJSONObj = {
      message: success ? "卸载完成" : `卸载失败，退出码 ${code}`,
      stdout: output,
      stderr: "",
    };

    if (success) {
      logger.info(messageJSONObj);
    } else {
      logger.error(messageJSONObj);
    }

    webContents.send("remove-complete", {
      id: 0,
      success: success,
      time: Date.now(),
      exitCode: code,
      message: JSON.stringify(messageJSONObj),
      origin: origin,
    } satisfies ChannelPayload);
  });
});

ipcMain.handle("list-upgradable", async () => {
  logger.info("Listing upgradable apps...");

  const [aptssRes, apmRes] = await Promise.all([
    runCommandCapture(SHELL_CALLER_PATH, ["aptss", "list", "--upgradable"]),
    runCommandCapture("apm", ["list", "--upgradable"])
  ]);

  if (aptssRes.code !== 0) {
    logger.error(`aptss list-upgradable failed: ${aptssRes.stderr || aptssRes.stdout}`);
  }

  const aptssApps = aptssRes.code === 0 ? parseAptssUpgradableList(aptssRes.stdout) : [];
  const apmApps = apmRes.code === 0 ? parseApmUpgradableList(apmRes.stdout) : [];

  const ignoredUpdates = getIgnoredUpdates();
  const mergedAppsMap = new Map<string, any>();

  for (const app of aptssApps) {
    mergedAppsMap.set(app.pkgname, {
      ...app,
      isIgnored: ignoredUpdates.includes(app.pkgname),
      isCrossUpgrade: false,
      type: "spark"
    });
  }

  for (const app of apmApps) {
    const existing = mergedAppsMap.get(app.pkgname);
    if (existing) {
      // Compare versions
      const apmIsGreater = await compareVersions(app.newVersion, "gt", existing.newVersion);
      if (apmIsGreater) {
        // APM version is strictly higher, transition to APM
        mergedAppsMap.set(app.pkgname, {
          ...app,
          isIgnored: ignoredUpdates.includes(app.pkgname),
          isCrossUpgrade: true, // Needs remove then install
          type: "apm"
        });
      } else {
        // Spark version is higher or equal, keep them separate or let user choose.
        // For simplicity, if APM <= Spark, we keep both in the list. To do this we need to alter the key.
        mergedAppsMap.set(`${app.pkgname}-apm`, {
          ...app,
          isIgnored: ignoredUpdates.includes(app.pkgname),
          isCrossUpgrade: false,
          type: "apm"
        });
      }
    } else {
      mergedAppsMap.set(app.pkgname, {
        ...app,
        isIgnored: ignoredUpdates.includes(app.pkgname),
        isCrossUpgrade: false,
        type: "apm"
      });
    }
  }

  return { success: true, apps: Array.from(mergedAppsMap.values()) };
});

ipcMain.handle("toggle-ignore-update", async (_event, pkgname: string, ignore: boolean) => {
  try {
    const configDir = path.join(os.homedir(), ".config", "spark-store");
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    const ignoredPath = path.join(configDir, "ignored_updates.json");

    let ignored: string[] = [];
    if (fs.existsSync(ignoredPath)) {
      const data = fs.readFileSync(ignoredPath, "utf8");
      ignored = JSON.parse(data) as string[];
    }

    if (ignore) {
      if (!ignored.includes(pkgname)) ignored.push(pkgname);
    } else {
      ignored = ignored.filter((p) => p !== pkgname);
    }

    fs.writeFileSync(ignoredPath, JSON.stringify(ignored), "utf8");
    return { success: true };
  } catch (err) {
    logger.error(`Failed to toggle ignore update: ${err}`);
    return { success: false, message: String(err) };
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
ipcMain.handle("uninstall-installed", async (_event, payload: any) => {
  const pkgname = typeof payload === "string" ? payload : payload.pkgname;
  const origin = typeof payload === "string" ? "spark" : payload.origin;

  if (!pkgname) {
    logger.warn("uninstall-installed missing pkgname");
    return { success: false, message: "missing pkgname" };
  }

  const superUserCmd = await checkSuperUserCommand();
  const execCommand = superUserCmd || SHELL_CALLER_PATH;
  const execParams = superUserCmd ? [SHELL_CALLER_PATH] : [];

  if (origin === "apm") {
    execParams.push("apm", "remove", "-y", pkgname);
  } else {
    execParams.push("aptss", "remove", "-y", pkgname);
  }

  const { code, stdout, stderr } = await runCommandCapture(
    execCommand,
    execParams,
  );
  const success = code === 0;

  if (success) {
    logger.info(`卸载完成: ${pkgname}`);
  } else {
    logger.error(`卸载失败: ${pkgname} ${stderr || stdout}`);
  }

  return {
    success,
    message: success
      ? "卸载完成"
      : stderr || stdout || `卸载失败，退出码 ${code}`,
  };
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
ipcMain.handle("launch-app", async (_event, payload: any) => {
  const pkgname = typeof payload === "string" ? payload : payload.pkgname;
  const origin = typeof payload === "string" ? "spark" : payload.origin;

  if (!pkgname) {
    logger.warn("No pkgname provided for launch-app");
  }

  let execCommand = "/opt/spark-store/extras/app-launcher";
  let execParams = ["start", pkgname];

  if (origin === "apm") {
    execCommand = "/opt/spark-store/extras/apm-launcher";
    execParams = ["launch", pkgname];
  }

  logger.info(
    `Launching app: ${pkgname} with command: ${execCommand} ${execParams.join(" ")}`,
  );

  spawn(execCommand, execParams, {
    shell: false,
    env: process.env,
    detached: true,
    stdio: "ignore",
  }).unref();
});
