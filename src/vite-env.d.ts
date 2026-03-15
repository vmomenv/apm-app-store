/* eslint-disable */
/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface Window {
  // expose in the `electron/preload/index.ts`
  ipcRenderer: import("electron").IpcRenderer;
  apm_store: {
    arch: string;
    [k: string]: any;
  };
}

declare const __APP_VERSION__: string;
