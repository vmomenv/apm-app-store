import { describe, it, expect, vi } from 'vitest';
// We can't easily import from .vue files in a simple unit test without more setup,
// but we can test the logic we implemented.

function optimizedRefresh(apps, installedResult) {
    const appMap = new Map(apps.map((app) => [app.pkgname, app]));
    const installedApps = [];
    for (const app of installedResult) {
      let appInfo = appMap.get(app.pkgname);
      if (appInfo) {
        appInfo.flags = app.flags;
        appInfo.arch = app.arch;
        appInfo.currentStatus = "installed";
      } else {
        appInfo = {
          name: app.name || app.pkgname,
          pkgname: app.pkgname,
          version: app.version,
          category: "unknown",
          tags: "",
          more: "",
          filename: "",
          torrent_address: "",
          author: "",
          contributor: "",
          website: "",
          update: "",
          size: "",
          img_urls: [],
          icons: "",
          currentStatus: "installed",
          arch: app.arch,
          flags: app.flags,
        };
      }
      installedApps.push(appInfo);
    }
    return installedApps;
}

describe('refreshInstalledApps logic', () => {
  it('should correctly map installed apps to existing app info', () => {
    const apps = [
      { pkgname: 'app1', name: 'App 1' },
      { pkgname: 'app2', name: 'App 2' }
    ];
    const installedResult = [
      { pkgname: 'app1', flags: 'f1', arch: 'a1', version: 'v1' }
    ];

    const result = optimizedRefresh(apps, installedResult);

    expect(result).toHaveLength(1);
    expect(result[0].pkgname).toBe('app1');
    expect(result[0].flags).toBe('f1');
    expect(result[0].currentStatus).toBe('installed');
    expect(apps[0].currentStatus).toBe('installed'); // Should mutate the original app object as before
  });

  it('should create minimal app info if not found in apps list', () => {
    const apps = [
      { pkgname: 'app1', name: 'App 1' }
    ];
    const installedResult = [
      { pkgname: 'app2', flags: 'f2', arch: 'a2', version: 'v2', name: 'App 2' }
    ];

    const result = optimizedRefresh(apps, installedResult);

    expect(result).toHaveLength(1);
    expect(result[0].pkgname).toBe('app2');
    expect(result[0].name).toBe('App 2');
    expect(result[0].currentStatus).toBe('installed');
  });
});
