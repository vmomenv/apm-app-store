/**
 * 启动时遥测：收集系统与商店版本信息并上报至 status.deepinos.org.cn
 * 仅在 Linux 下执行一次，不阻塞启动，失败静默记录日志。
 */
import fs from "node:fs";
import os from "node:os";
import pino from "pino";

const logger = pino({ name: "telemetry" });
const TELEMETRY_URL = "https://status.spark-app.store/upload";

interface TelemetryPayload {
  "Distributor ID": string;
  Release: string;
  Architecture: string;
  Store_Version: string;
  UUID: string;
  TIME: string;
}

function readFileSafe(path: string): string {
  try {
    return fs.readFileSync(path, "utf8").trim();
  } catch {
    return "";
  }
}

/** 解析 /etc/os-release 的 KEY="value" 行 */
function parseOsRelease(content: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(?:")?([^"]*)(?:")?$/);
    if (m) out[m[1]] = m[2].replace(/\\"/g, '"');
  }
  return out;
}

function getDistroInfo(): { distributorId: string; release: string } {
  const osReleasePath = "/etc/os-release";
  const redhatPath = "/etc/redhat-release";
  const debianPath = "/etc/debian_version";

  if (fs.existsSync(osReleasePath)) {
    const content = readFileSafe(osReleasePath);
    const parsed = parseOsRelease(content);
    const name = parsed.NAME ?? "Unknown";
    const versionId = parsed.VERSION_ID ?? "Unknown";
    return { distributorId: name, release: versionId };
  }

  if (fs.existsSync(redhatPath)) {
    const content = readFileSafe(redhatPath);
    const distributorId = content.split(/\s+/)[0] ?? "Unknown";
    const releaseMatch = content.match(/release\s+([0-9][0-9.]*)/i);
    const release = releaseMatch ? releaseMatch[1] : "Unknown";
    return { distributorId, release };
  }

  if (fs.existsSync(debianPath)) {
    const release = readFileSafe(debianPath) || "Unknown";
    return { distributorId: "Debian", release };
  }

  return { distributorId: "Unknown", release: "Unknown" };
}

function getUuid(): string {
  const content = readFileSafe("/etc/machine-id");
  return content || "unknown";
}

/** 架构：与 uname -m 一致，使用 Node 的 os.machine() */
function getArchitecture(): string {
  if (typeof os.machine === "function") {
    return os.machine();
  }
  const arch = process.arch;
  if (arch === "x64") return "x86_64";
  if (arch === "arm64") return "aarch64";
  return arch;
}

function buildPayload(storeVersion: string): TelemetryPayload {
  const { distributorId, release } = getDistroInfo();
  const time = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

  return {
    "Distributor ID": distributorId,
    Release: release,
    Architecture: getArchitecture(),
    Store_Version: storeVersion,
    UUID: getUuid(),
    TIME: time,
  };
}

/**
 * 发送遥测数据。仅在 Linux 下执行；非 Linux 直接返回。
 * 不抛出异常，错误仅写日志。
 */
export function sendTelemetryOnce(storeVersion: string): void {
  if (process.platform !== "linux") {
    logger.debug("Telemetry skipped: not Linux");
    return;
  }

  const payload = buildPayload(storeVersion);
  const body = JSON.stringify(payload);

  fetch(TELEMETRY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  })
    .then((res) => {
      const code = res.status;
      if (code === 200) {
        logger.debug("Telemetry sent successfully");
        return;
      }
      if (code === 400) {
        logger.warn("Telemetry: 客户端请求错误，请检查 JSON 或接口逻辑");
        return;
      }
      if (code === 422) {
        logger.warn("Telemetry: 请求数据无效，请检查字段值");
        return;
      }
      if (code === 500) {
        logger.warn("Telemetry: 服务器内部错误");
        return;
      }
      logger.warn(`Telemetry: 未处理的响应码 ${code}`);
    })
    .catch((err) => {
      logger.warn({ err }, "Telemetry request failed");
    });
}
