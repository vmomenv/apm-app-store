<template>
  <header class="flex flex-col gap-4">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-5">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/60 bg-white/90 text-slate-500 shadow-sm backdrop-blur-sm transition hover:border-slate-300 hover:bg-white hover:text-slate-700 lg:hidden dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          @click="$emit('toggle-sidebar')"
          title="切换侧边栏"
          aria-label="切换侧边栏"
        >
          <i class="fas fa-bars"></i>
        </button>
        <TopActions
          @update="$emit('update')"
          @list="$emit('list')"
          @open-install-settings="$emit('open-install-settings')"
        />
      </div>
      <div class="w-full flex-1 min-w-0">
        <label for="searchBox" class="sr-only">搜索应用</label>
        <div class="relative">
          <span
            class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100/80 text-slate-400 dark:bg-slate-800/80 dark:text-slate-500"
            aria-hidden="true"
          >
            <i class="fas fa-search text-sm"></i>
          </span>
          <input
            id="searchBox"
            v-model="localSearchQuery"
            class="w-full rounded-xl border border-slate-200/70 bg-white/95 py-3 pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand/60 focus:ring-2 focus:ring-brand/20 dark:border-slate-700/70 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand/50 dark:focus:ring-brand/20"
            placeholder="搜索应用名 / 包名 / 标签，按回车键搜索"
            @keydown.enter="handleSearch"
            @focus="handleSearchFocus"
          />
        </div>
      </div>
    </div>
    <div
      v-if="activeCategory !== 'home'"
      id="currentCount"
      class="text-sm font-medium text-slate-500 dark:text-slate-400"
    >
      共
      <span class="tabular-nums text-slate-700 dark:text-slate-300">{{
        appsCount
      }}</span>
      个应用
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import TopActions from "./TopActions.vue";

const props = defineProps<{
  searchQuery: string;
  activeCategory: string;
  appsCount: number;
}>();

const emit = defineEmits<{
  (e: "update-search", query: string): void;
  (e: "update"): void;
  (e: "list"): void;
  (e: "search-focus"): void;
  (e: "open-install-settings"): void;
  (e: "toggle-sidebar"): void;
}>();

const localSearchQuery = ref(props.searchQuery || "");

const handleSearch = () => {
  emit("update-search", localSearchQuery.value);
};

const handleSearchFocus = () => {
  emit("search-focus");
};

watch(
  () => props.searchQuery,
  (newVal) => {
    localSearchQuery.value = newVal || "";
  },
);
</script>
