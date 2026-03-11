import { ref } from "vue";
import type { App, StoreMode } from "./typedefinition";

export const APM_STORE_BASE_URL: string =
  import.meta.env.VITE_APM_STORE_BASE_URL || "";

export const APM_STORE_STATS_BASE_URL: string =
  import.meta.env.VITE_APM_STORE_STATS_BASE_URL || "";

// 下面的变量用于存储当前应用的信息，其实用在多个组件中
export const currentApp = ref<App | null>(null);
export const currentAppIsInstalled = ref(false);

const initialMode = (localStorage.getItem("store_mode") as StoreMode) || "hybrid";
export const currentStoreMode = ref<StoreMode>(initialMode);

declare global {
  interface Window {
    apm_store: any;
  }
}
