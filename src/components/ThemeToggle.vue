<template>
  <button
    type="button"
    class="flex w-full items-center justify-between rounded-xl border border-slate-200/60 bg-white/80 px-3.5 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
    :aria-pressed="themeMode === 'dark'"
    @click="toggle"
  >
    <span class="flex items-center gap-2.5">
      <span
        class="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100/80 dark:bg-slate-700/80"
      >
        <i class="fas text-sm" :class="iconClass"></i>
      </span>
      <span>{{ label }}</span>
    </span>
    <span
      class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-slate-200/90 transition dark:bg-slate-600/80"
    >
      <span
        :class="[
          'absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-md ring-2 ring-slate-200/50 transition-all duration-200 dark:ring-slate-600/50',
          togglePosition,
        ]"
      />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  themeMode: "light" | "dark" | "auto";
}>();

const emit = defineEmits<{
  (e: "toggle"): void;
}>();

const toggle = () => {
  emit("toggle");
};

const label = computed(() => {
  if (props.themeMode === "auto") return "跟随系统";
  if (props.themeMode === "dark") return "深色主题";
  return "浅色主题";
});

const iconClass = computed(() => {
  if (props.themeMode === "auto") return "fa-adjust text-slate-500";
  if (props.themeMode === "dark") return "fa-moon text-amber-200";
  return "fa-sun text-amber-400";
});

const togglePosition = computed(() => {
  if (props.themeMode === "auto") return "left-1/2 -translate-x-1/2";
  if (props.themeMode === "dark") return "left-6";
  return "left-0.5";
});
</script>
