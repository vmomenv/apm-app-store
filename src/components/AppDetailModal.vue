<template>
  <Transition
    enter-active-class="duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="show"
      v-bind="attrs"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-900/70 p-4"
      @click.self="closeModal"
    >
      <div
        class="modal-panel relative w-full max-w-4xl max-h-[85vh] overflow-y-auto scrollbar-nowidth rounded-3xl border border-white/10 bg-white/95 p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div class="flex flex-1 items-center gap-4">
            <div
              class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-slate-100 to-slate-200 shadow-inner dark:from-slate-800 dark:to-slate-700"
            >
              <img
                v-if="app"
                :src="iconPath"
                alt="icon"
                class="h-full w-full object-cover transition-opacity duration-300"
                :class="isIconLoaded ? 'opacity-100' : 'opacity-0'"
                loading="lazy"
                @load="isIconLoaded = true"
              />
            </div>
            <div class="space-y-1">
              <div class="flex items-center gap-3">
                <p class="text-2xl font-bold text-slate-900 dark:text-white">
                  {{ displayApp?.name || "" }}
                </p>
                <div
                  v-if="app?.isMerged"
                  class="flex gap-1 overflow-hidden rounded-md shadow-sm border border-slate-200 dark:border-slate-700 font-medium ml-1"
                >
                  <button
                    v-if="app.sparkApp"
                    type="button"
                    class="px-2 py-0.5 text-[10px] uppercase tracking-wider transition-colors"
                    :class="
                      viewingOrigin === 'spark'
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-100/50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    "
                    @click="viewingOrigin = 'spark'"
                  >
                    Spark
                  </button>
                  <button
                    v-if="app.apmApp"
                    type="button"
                    class="px-2 py-0.5 text-[10px] uppercase tracking-wider transition-colors"
                    :class="
                      viewingOrigin === 'apm'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100/50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    "
                    @click="viewingOrigin = 'apm'"
                  >
                    APM
                  </button>
                </div>
                <span
                  v-else-if="displayApp"
                  :class="[
                    'rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm',
                    displayApp.origin === 'spark'
                      ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                  ]"
                >
                  {{ displayApp.origin === "spark" ? "Spark" : "APM" }}
                </span>
              </div>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                {{ displayApp?.pkgname || "" }} ·
                {{ displayApp?.version || "" }}
                <span v-if="downloadCount"> · 下载量：{{ downloadCount }}</span>
              </p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 lg:ml-auto">
            <button
              v-if="!isinstalled"
              type="button"
              class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r px-4 py-2 text-sm font-semibold text-white shadow-lg disabled:opacity-40 transition hover:-translate-y-0.5"
              :class="
                installFeedback
                  ? 'from-emerald-500 to-emerald-600'
                  : 'from-brand to-brand-dark'
              "
              @click="handleInstall"
              :disabled="installFeedback || isCompleted"
            >
              <i
                class="fas"
                :class="installFeedback ? 'fa-check' : 'fa-download'"
              ></i>
              <span>{{ installBtnText }}</span>
            </button>
            <template v-else>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand to-brand-dark px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
                @click="emit('open-app', displayApp?.pkgname || '')"
              >
                <i class="fas fa-external-link-alt"></i>
                <span>打开</span>
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 disabled:opacity-40 transition hover:-translate-y-0.5"
                @click="handleRemove"
              >
                <i class="fas fa-trash"></i>
                <span>卸载</span>
              </button>
            </template>
            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/70 text-slate-500 transition hover:text-slate-900 dark:border-slate-700"
              @click="closeModal"
              aria-label="关闭"
            >
              <i class="fas fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- <div
          class="mt-4 rounded-2xl border border-slate-200/60 bg-slate-50/70 px-4 py-3 text-sm text-slate-600 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-slate-300"
        >
          首次安装 APM 后需要重启系统以在启动器中看到应用入口。可前往
          <a
            href="https://gitee.com/amber-ce/amber-pm/releases"
            target="_blank"
            class="font-semibold text-brand hover:underline"
            >APM Releases</a
          >
          获取 APM。
        </div> -->

        <div v-if="screenshots.length" class="mt-6 grid gap-3 sm:grid-cols-2">
          <img
            v-for="(screen, index) in screenshots"
            :key="index"
            :src="screen"
            alt="screenshot"
            class="h-40 w-full cursor-pointer rounded-2xl border border-slate-200/60 object-cover shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800/60"
            loading="lazy"
            @click="openPreview(index)"
            @error="hideImage"
          />
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <div
            v-if="displayApp?.author"
            class="rounded-2xl border border-slate-200/60 p-4 dark:border-slate-800/60"
          >
            <p class="text-xs uppercase tracking-wide text-slate-400">作者</p>
            <p class="text-sm font-medium text-slate-800 dark:text-slate-200">
              {{ displayApp.author }}
            </p>
          </div>
          <div
            v-if="displayApp?.contributor"
            class="rounded-2xl border border-slate-200/60 p-4 dark:border-slate-800/60"
          >
            <p class="text-xs uppercase tracking-wide text-slate-400">贡献者</p>
            <p class="text-sm font-medium text-slate-800 dark:text-slate-200">
              {{ displayApp.contributor }}
            </p>
          </div>
          <div
            v-if="displayApp?.size"
            class="rounded-2xl border border-slate-200/60 p-4 dark:border-slate-800/60"
          >
            <p class="text-xs uppercase tracking-wide text-slate-400">大小</p>
            <p class="text-sm font-medium text-slate-800 dark:text-slate-200">
              {{ displayApp.size }}
            </p>
          </div>
          <div
            v-if="displayApp?.update"
            class="rounded-2xl border border-slate-200/60 p-4 dark:border-slate-800/60"
          >
            <p class="text-xs uppercase tracking-wide text-slate-400">
              更新时间
            </p>
            <p class="text-sm font-medium text-slate-800 dark:text-slate-200">
              {{ displayApp.update }}
            </p>
          </div>
          <div
            v-if="displayApp?.website"
            class="rounded-2xl border border-slate-200/60 p-4 dark:border-slate-800/60"
          >
            <p class="text-xs uppercase tracking-wide text-slate-400">网站</p>
            <a
              :href="displayApp.website"
              target="_blank"
              class="text-sm font-medium text-brand hover:underline"
              >{{ displayApp.website }}</a
            >
          </div>
          <div
            v-if="displayApp?.version"
            class="rounded-2xl border border-slate-200/60 p-4 dark:border-slate-800/60"
          >
            <p class="text-xs uppercase tracking-wide text-slate-400">版本</p>
            <p class="text-sm font-medium text-slate-800 dark:text-slate-200">
              {{ displayApp.version }}
            </p>
          </div>
          <div
            v-if="displayApp?.tags"
            class="rounded-2xl border border-slate-200/60 p-4 dark:border-slate-800/60"
          >
            <p class="text-xs uppercase tracking-wide text-slate-400">标签</p>
            <p class="text-sm font-medium text-slate-800 dark:text-slate-200">
              {{ displayApp.tags }}
            </p>
          </div>
        </div>

        <div
          v-if="displayApp?.more && displayApp.more.trim() !== ''"
          class="mt-6 space-y-3"
        >
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
            应用详情
          </h3>
          <div
            class="max-h-60 space-y-2 overflow-y-auto rounded-2xl border border-slate-200/60 bg-slate-50/80 p-4 text-sm leading-relaxed text-slate-600 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-slate-300"
            v-html="displayApp.more.replace(/\n/g, '<br>')"
          ></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, useAttrs, ref, watch } from "vue";
import axios from "axios";
import {
  useDownloadItemStatus,
  useInstallFeedback,
  downloads,
} from "../global/downloadStatus";
import { APM_STORE_BASE_URL } from "../global/storeConfig";
import type { App } from "../global/typedefinition";

const attrs = useAttrs();

const props = defineProps<{
  show: boolean;
  app: App | null;
  screenshots: string[];
  isinstalled: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "install", app: App): void;
  (e: "remove", app: App): void;
  (e: "open-preview", index: number): void;
  (e: "open-app", pkgname: string): void;
  (e: "check-install", app: App): void;
}>();

const appPkgname = computed(() => props.app?.pkgname);

const isIconLoaded = ref(false);

const viewingOrigin = ref<"spark" | "apm">("spark");

watch(
  () => props.app,
  (newApp) => {
    isIconLoaded.value = false;
    if (newApp) {
      if (newApp.isMerged) {
        viewingOrigin.value = newApp.sparkApp ? "spark" : "apm";
      } else {
        viewingOrigin.value = newApp.origin;
      }
    }
  },
  { immediate: true },
);

const displayApp = computed(() => {
  if (!props.app) return null;
  if (!props.app.isMerged) return props.app;
  return viewingOrigin.value === "spark"
    ? props.app.sparkApp || props.app
    : props.app.apmApp || props.app;
});

watch(
  () => displayApp.value,
  (newApp) => {
    if (newApp) {
      emit("check-install", newApp);
    }
  },
  { immediate: false },
);

const activeDownload = computed(() => {
  return downloads.value.find((d) => d.pkgname === displayApp.value?.pkgname);
});

const { installFeedback } = useInstallFeedback(appPkgname);
const { isCompleted } = useDownloadItemStatus(appPkgname);
const installBtnText = computed(() => {
  if (props.isinstalled) {
    return "已安装";
  }
  if (isCompleted.value) {
    return "已安装";
  }
  if (installFeedback.value) {
    const status = activeDownload.value?.status;
    if (status === "downloading") {
      return `下载中 ${Math.floor((activeDownload.value?.progress || 0) * 100)}%`;
    }
    if (status === "installing") {
      return "安装中...";
    }
    return "已加入队列";
  }
  return "安装";
});
const iconPath = computed(() => {
  if (!displayApp.value) return "";
  const arch = window.apm_store.arch || "amd64-apm";
  const finalArch =
    displayApp.value.origin === "spark"
      ? arch.replace("-apm", "-store")
      : arch.replace("-store", "-apm");
  return `${APM_STORE_BASE_URL}/${finalArch}/${displayApp.value.category}/${displayApp.value.pkgname}/icon.png`;
});

const downloadCount = ref<string>("");

// 监听 app 变化，获取新app的下载量
watch(
  () => displayApp.value,
  async (newApp) => {
    if (newApp) {
      downloadCount.value = "";
      try {
        const arch = window.apm_store.arch || "amd64-apm";
        const finalArch =
          newApp.origin === "spark"
            ? arch.replace("-apm", "-store")
            : arch.replace("-store", "-apm");
        const url = `${APM_STORE_BASE_URL}/${finalArch}/${newApp.category}/${newApp.pkgname}/download-times.txt`;
        const resp = await axios.get(url, { responseType: "text" });
        if (resp.status === 200) {
          downloadCount.value = String(resp.data).trim();
        } else {
          downloadCount.value = "N/A";
          throw new Error(`Unexpected response status: ${resp.status}`);
        }
      } catch (e) {
        console.error("Failed to fetch download count", e);
      }
    }
  },
  { immediate: true },
);

const closeModal = () => {
  emit("close");
};

const handleInstall = () => {
  if (displayApp.value) {
    emit("install", displayApp.value);
  }
};

const handleRemove = () => {
  if (displayApp.value) {
    emit("remove", displayApp.value);
  }
};

const openPreview = (index: number) => {
  emit("open-preview", index);
};

const hideImage = (e: Event) => {
  (e.target as HTMLElement).style.display = "none";
};
</script>
