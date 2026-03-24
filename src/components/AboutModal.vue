<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        @click.self="close"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            v-if="show"
            class="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div class="p-8 text-center">
              <div class="mb-6 flex justify-center">
                <img
                  :src="amberLogo"
                  alt="Spark Store"
                  class="h-24 w-24 rounded-3xl bg-white p-4 shadow-lg ring-1 ring-slate-900/5 dark:bg-slate-800"
                />
              </div>
              <h2
                class="mb-2 text-2xl font-bold text-slate-900 dark:text-white"
              >
                星火应用商店
              </h2>
              <p class="mb-4 text-sm text-slate-500 dark:text-slate-400">
                Spark Store
              </p>
              <div
                class="mb-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 dark:bg-slate-800"
              >
                <span class="text-sm text-slate-600 dark:text-slate-300"
                  >版本号</span
                >
                <span
                  class="font-mono text-sm font-semibold text-brand dark:text-brand"
                  >{{ version }}</span
                >
              </div>
              <p
                class="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400"
              >
                星火应用商店是专为 Linux
                设计的应用商店，提供丰富的应用资源和便捷的安装体验。
              </p>
              <div
                class="flex justify-center gap-4 text-sm text-slate-500 dark:text-slate-400"
              >
                <a
                  href="https://gitee.com/spark-store-project/spark-store"
                  target="_blank"
                  class="flex items-center gap-1 transition hover:text-brand"
                >
                  <i class="fab fa-git-alt"></i>
                  Gitee
                </a>
                <a
                  href="https://github.com/spark-store-project/spark-store"
                  target="_blank"
                  class="flex items-center gap-1 transition hover:text-brand"
                >
                  <i class="fab fa-github"></i>
                  GitHub
                </a>
              </div>
            </div>
            <div
              class="border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50"
            >
              <button
                type="button"
                class="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                @click="close"
              >
                确定
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import amberLogo from "../assets/imgs/spark-store.svg";

defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const version = ref("unknown");

onMounted(() => {
  // 从预加载脚本获取版本号
  const apmStore = (window as any).apm_store;
  if (apmStore?.version) {
    version.value = apmStore.version;
  }
});

const close = () => {
  emit("close");
};
</script>
