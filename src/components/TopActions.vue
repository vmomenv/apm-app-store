<template>
  <div class="flex flex-wrap gap-2">
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-dark px-3.5 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
      @click="handleUpdate"
      title="检查可更新的软件包列表"
    >
      <i class="fas fa-sync-alt text-xs"></i>
      <span>软件更新</span>
    </button>
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white/90 px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700/80"
      @click="handleSettings"
      title="安装设置"
    >
      <i class="fas fa-cog text-xs"></i>
      <span>安装设置</span>
    </button>
    <!-- <button
      type="button"
      class="inline-flex items-center gap-2 rounded-2xl bg-slate-900/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/40 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/40 dark:bg-white/90 dark:text-slate-900"
      @click="handleList"
      title="启动 apm-installer --list"
    >
      <i class="fas fa-download"></i>
      <span>应用管理</span>
    </button> -->
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "update"): void;
  (e: "list"): void;
  (e: "open-install-settings"): void;
}>();

const handleUpdate = () => {
  emit("update");
};

const handleSettings = () => {
  emit("open-install-settings");
};
</script>
