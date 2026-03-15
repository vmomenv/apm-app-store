<template>
  <div
    class="fixed inset-x-4 bottom-4 z-40 rounded-2xl border border-slate-200/60 bg-white/95 shadow-xl shadow-slate-200/30 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/95 dark:shadow-none sm:left-auto sm:right-6 sm:w-[22rem]"
  >
    <div
      class="flex cursor-pointer items-center justify-between px-4 py-3.5 transition hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
      @click="toggleExpand"
    >
      <div class="flex items-center gap-2.5">
        <span
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand dark:bg-brand/20"
        >
          <i class="fas fa-download text-sm"></i>
        </span>
        <span class="text-sm font-semibold text-slate-800 dark:text-slate-100"
          >下载队列</span
        >
        <span
          v-if="downloads.length"
          class="rounded-full bg-slate-200/80 px-2 py-0.5 text-xs font-semibold tabular-nums text-slate-600 dark:bg-slate-700/80 dark:text-slate-300"
        >
          {{ activeDownloads }}/{{ downloads.length }}
        </span>
      </div>
      <div class="flex items-center gap-1">
        <button
          v-if="downloads.length"
          type="button"
          class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          title="清除已完成"
          @click.stop="clearCompleted"
        >
          <i class="fas fa-broom text-sm"></i>
        </button>
        <button
          type="button"
          class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          @click.stop="toggleExpand"
          :aria-expanded="isExpanded"
        >
          <i
            class="fas text-sm transition-transform"
            :class="isExpanded ? 'fa-chevron-down' : 'fa-chevron-up'"
          ></i>
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-show="isExpanded"
        class="max-h-80 overflow-y-auto border-t border-slate-200/60 px-3 py-3 scrollbar-muted dark:border-slate-700/50"
      >
        <div
          v-if="downloads.length === 0"
          class="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200/80 py-10 text-slate-500 dark:border-slate-700/80 dark:text-slate-400"
        >
          <i class="fas fa-inbox text-2xl opacity-60"></i>
          <p class="mt-2 text-sm font-medium">暂无下载任务</p>
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="download in downloads"
            :key="download.id"
            class="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/60 bg-white/95 p-3 transition hover:border-brand/30 hover:bg-slate-50/80 dark:border-slate-700/50 dark:bg-slate-800/80 dark:hover:border-brand/40 dark:hover:bg-slate-800/90"
            :class="
              download.status === 'failed'
                ? 'border-rose-300/70 dark:border-rose-500/40'
                : ''
            "
            @click="showDownloadDetail(download)"
          >
            <div
              class="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-700/80 ring-1 ring-slate-200/50 dark:ring-slate-600/50"
            >
              <img
                :src="download.icon"
                :alt="download.name"
                class="h-full w-full object-cover"
              />
            </div>
            <div class="flex-1">
              <p
                class="truncate text-sm font-semibold text-slate-800 dark:text-slate-100"
              >
                {{ download.name }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                <span v-if="download.status === 'downloading'"
                  >下载中 {{ Math.floor(download.progress * 100) }}%</span
                >
                <span v-else-if="download.status === 'installing'"
                  >安装中...</span
                >
                <span v-else-if="download.status === 'completed'">已完成</span>
                <span v-else-if="download.status === 'failed'"
                  >失败: {{ download.error }}</span
                >
                <span v-else-if="download.status === 'paused'">已暂停</span>
                <span v-else>等待中...</span>
              </p>
              <div
                v-if="download.status === 'downloading'"
                class="mt-2 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800"
              >
                <div
                  class="h-full rounded-full bg-brand"
                  :style="{ width: `${download.progress * 100}%` }"
                ></div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-if="download.status === 'failed'"
                type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-200/60 text-rose-500 transition hover:bg-rose-50"
                title="重试"
                @click.stop="retryDownload(download)"
              >
                <i class="fas fa-redo"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { DownloadItem } from "../global/typedefinition";

const props = defineProps<{
  downloads: DownloadItem[];
}>();

const emit = defineEmits<{
  (e: "pause", download: DownloadItem): void;
  (e: "resume", download: DownloadItem): void;
  (e: "cancel", download: DownloadItem): void;
  (e: "retry", download: DownloadItem): void;
  (e: "clear-completed"): void;
  (e: "show-detail", download: DownloadItem): void;
}>();

const isExpanded = ref(false);

const activeDownloads = computed(() => {
  return props.downloads.filter(
    (d) => d.status === "downloading" || d.status === "installing",
  ).length;
});

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const retryDownload = (download: DownloadItem) => {
  emit("retry", download);
};

const clearCompleted = () => {
  emit("clear-completed");
};

const showDownloadDetail = (download: DownloadItem) => {
  emit("show-detail", download);
};
</script>
