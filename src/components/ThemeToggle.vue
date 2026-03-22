<template>
  <button
    type="button"
    class="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-slate-500 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 dark:text-slate-400 dark:hover:bg-slate-800"
    :title="title"
    tabindex="-1"
    @click="toggle"
  >
    <i class="fas" :class="iconClass"></i>
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

const title = computed(() => {
  if (props.themeMode === "auto") return "自动模式";
  if (props.themeMode === "dark") return "深色模式";
  return "浅色模式";
});

const iconClass = computed(() => {
  if (props.themeMode === "auto") return "fa-adjust";
  if (props.themeMode === "dark") return "fa-moon";
  return "fa-sun";
});
</script>
