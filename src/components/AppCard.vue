<template>
  <article
    role="button"
    tabindex="0"
    @click="openDetail"
    @keydown.enter="openDetail"
    @keydown.space.prevent="openDetail"
    class="group flex h-full cursor-pointer gap-4 rounded-2xl border border-slate-200/60 bg-white/95 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md hover:shadow-slate-200/50 dark:border-slate-700/50 dark:bg-slate-800/70 dark:hover:border-brand/40 dark:hover:shadow-slate-900/50"
  >
    <div
      class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200/80 shadow-inner ring-1 ring-slate-200/50 dark:from-slate-700 dark:to-slate-800 dark:ring-slate-600/30"
    >
      <img
        ref="iconImg"
        :src="loadedIcon"
        alt=""
        :class="[
          'h-full w-full object-cover transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
        ]"
      />
    </div>
    <div class="flex min-w-0 flex-1 flex-col gap-1.5">
      <div class="flex flex-wrap items-center gap-2">
        <h3
          class="truncate text-base font-semibold text-slate-900 dark:text-white"
        >
          {{ app.name || "" }}
        </h3>
        <span
          :class="[
            'shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
            app.isMerged
              ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300'
              : app.origin === 'spark'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                : 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300',
          ]"
        >
          {{
            app.isMerged
              ? "Spark/APM"
              : app.origin === "spark"
                ? "Spark"
                : "APM"
          }}
        </span>
      </div>
      <p
        class="truncate text-xs font-medium text-slate-500 dark:text-slate-400"
      >
        {{ app.pkgname || "" }} · {{ app.version || "" }}
      </p>
      <p
        class="line-clamp-2 text-sm leading-snug text-slate-500 dark:text-slate-400"
      >
        {{ description }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { APM_STORE_BASE_URL } from "../global/storeConfig";
import type { App } from "../global/typedefinition";

const props = defineProps<{
  app: App;
}>();

const emit = defineEmits<{
  (e: "open-detail", app: App): void;
}>();

const iconImg = ref<HTMLImageElement | null>(null);
const isLoaded = ref(false);
const loadedIcon = ref(
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E',
);

const iconPath = computed(() => {
  const arch = window.apm_store.arch || "amd64";
  const finalArch =
    props.app.origin === "spark" ? `${arch}-store` : `${arch}-apm`;
  return `${APM_STORE_BASE_URL}/${finalArch}/${props.app.category}/${props.app.pkgname}/icon.png`;
});

const description = computed(() => {
  const more = props.app.more || "";
  return more.substring(0, 80) + (more.length > 80 ? "..." : "");
});

const openDetail = () => {
  emit("open-detail", props.app);
};

let observer: IntersectionObserver | null = null;

onMounted(() => {
  // 创建 Intersection Observer
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoaded.value) {
          // 图片进入视口，开始加载
          const img = new Image();
          img.onload = () => {
            loadedIcon.value = iconPath.value;
            isLoaded.value = true;
            if (observer) observer.unobserve(entry.target);
          };
          img.onerror = () => {
            // 加载失败时使用默认图标
            loadedIcon.value =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23e0e0e0" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3ENo Icon%3C/text%3E%3C/svg%3E';
            isLoaded.value = true;
            if (observer) observer.unobserve(entry.target);
          };
          img.src = iconPath.value;
        }
      });
    },
    {
      rootMargin: "50px", // 提前50px开始加载
      threshold: 0.01,
    },
  );

  // 观察图标元素
  if (iconImg.value) {
    observer.observe(iconImg.value);
  }
});

// 当 app 变更时重置懒加载状态并重新观察
watch(iconPath, () => {
  loadedIcon.value =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E';
  isLoaded.value = false;
  if (observer && iconImg.value) {
    observer.unobserve(iconImg.value);
    observer.observe(iconImg.value);
  }
});

onBeforeUnmount(() => {
  // 清理 observer
  if (observer && iconImg.value) {
    observer.unobserve(iconImg.value);
  }
});
</script>
