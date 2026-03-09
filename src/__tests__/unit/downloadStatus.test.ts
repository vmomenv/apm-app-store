import { describe, it, expect, beforeEach } from "vitest";
import { downloads, removeDownloadItem } from "@/global/downloadStatus";
import type { DownloadItem } from "@/global/typedefinition";

describe("downloadStatus", () => {
  beforeEach(() => {
    downloads.value = [];
  });

  describe("addDownload", () => {
    it("should add a new download item", () => {
      const mockDownload: DownloadItem = {
        id: 1,
        name: "Test App",
        pkgname: "test-app",
        version: "1.0.0",
        icon: "",
        status: "queued",
        progress: 0,
        downloadedSize: 0,
        totalSize: 1000000,
        speed: 0,
        timeRemaining: 0,
        startTime: Date.now(),
        logs: [],
        source: "Test",
        retry: false,
      };

      downloads.value.push(mockDownload);

      expect(downloads.value).toHaveLength(1);
      expect(downloads.value[0].pkgname).toBe("test-app");
    });
  });

  describe("removeDownloadItem", () => {
    it("should remove download by pkgname", () => {
      const mockDownload: DownloadItem = {
        id: 1,
        name: "Test App",
        pkgname: "test-app",
        version: "1.0.0",
        icon: "",
        status: "queued",
        progress: 0,
        downloadedSize: 0,
        totalSize: 1000000,
        speed: 0,
        timeRemaining: 0,
        startTime: Date.now(),
        logs: [],
        source: "Test",
        retry: false,
      };

      downloads.value.push(mockDownload);
      removeDownloadItem("test-app");

      expect(downloads.value).toHaveLength(0);
    });
  });
});
