<template>
  <div class="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70">
    <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">商店模式</span>
    <div class="grid grid-cols-3 gap-1 p-1 bg-slate-200/50 dark:bg-slate-900/50 rounded-xl">
      <button
        v-for="mode in modes"
        :key="mode.id"
        type="button"
        class="flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[10px] font-medium transition-all duration-200"
        :class="currentStoreMode === mode.id 
          ? 'bg-white dark:bg-slate-700 text-brand shadow-sm scale-105 z-10' 
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
        @click="setMode(mode.id as StoreMode)"
      >
        <i :class="mode.icon" class="mb-1 text-xs"></i>
        {{ mode.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { currentStoreMode } from "../global/storeConfig";
import type { StoreMode } from "../global/typedefinition";

const modes = [
  { id: "spark", label: "星火", icon: "fas fa-fire" },
  { id: "apm", label: "APM", icon: "fas fa-box-open" },
  { id: "hybrid", label: "混合", icon: "fas fa-layer-group" },
];

const setMode = (mode: StoreMode) => {
  currentStoreMode.value = mode;
  localStorage.setItem("store_mode", mode);
};
</script>
