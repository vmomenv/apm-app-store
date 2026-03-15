<template>
  <div class="flex h-full flex-col gap-5">
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div
          class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand/20 to-brand/5 ring-1 ring-slate-200/60 dark:ring-slate-700/50"
        >
          <img :src="amberLogo" alt="Amber PM" class="h-8 w-8 object-contain" />
        </div>
        <div class="flex flex-col min-w-0">
          <span
            class="text-[10px] font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500"
            >Spark Store</span
          >
          <span
            class="truncate text-base font-bold tracking-tight text-slate-800 dark:text-white"
            >星火应用商店</span
          >
        </div>
      </div>
      <button
        type="button"
        class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 lg:hidden dark:hover:bg-slate-800 dark:hover:text-slate-300"
        @click="$emit('close')"
        title="关闭侧边栏"
        aria-label="关闭侧边栏"
      >
        <i class="fas fa-times text-sm"></i>
      </button>
    </div>

    <ThemeToggle :theme-mode="themeMode" @toggle="toggleTheme" />
    <StoreModeSwitcher />

    <nav
      class="flex-1 space-y-1 overflow-y-auto scrollbar-muted pr-1"
      aria-label="分类导航"
    >
      <button
        type="button"
        class="nav-item flex w-full items-center gap-3 rounded-xl border border-transparent px-3.5 py-2.5 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        :class="
          activeCategory === 'home'
            ? 'nav-item-active border-brand/20 bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-soft'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
        "
        @click="selectCategory('home')"
      >
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
          :class="
            activeCategory === 'home'
              ? 'bg-brand/15 text-brand dark:bg-brand/25 dark:text-brand-soft'
              : 'bg-slate-100/80 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400'
          "
        >
          <i class="fas fa-home"></i>
        </span>
        <span class="flex-1 truncate">主页</span>
      </button>

      <button
        type="button"
        class="nav-item flex w-full items-center gap-3 rounded-xl border border-transparent px-3.5 py-2.5 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        :class="
          activeCategory === 'all'
            ? 'nav-item-active border-brand/20 bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-soft'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
        "
        @click="selectCategory('all')"
      >
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
          :class="
            activeCategory === 'all'
              ? 'bg-brand/15 text-brand dark:bg-brand/25 dark:text-brand-soft'
              : 'bg-slate-100/80 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400'
          "
        >
          <i class="fas fa-th-large"></i>
        </span>
        <span class="flex-1 truncate">全部应用</span>
        <span
          class="rounded-full bg-slate-200/80 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-slate-600 dark:bg-slate-700/80 dark:text-slate-300"
          >{{ categoryCounts.all || 0 }}</span
        >
      </button>

      <button
        v-for="(category, key) in categories"
        :key="key"
        type="button"
        class="nav-item flex w-full items-center gap-3 rounded-xl border border-transparent px-3.5 py-2.5 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        :class="
          activeCategory === key
            ? 'nav-item-active border-brand/20 bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-soft'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
        "
        @click="selectCategory(key)"
      >
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
          :class="
            activeCategory === key
              ? 'bg-brand/15 text-brand dark:bg-brand/25 dark:text-brand-soft'
              : 'bg-slate-100/80 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400'
          "
        >
          <i class="fas fa-folder"></i>
        </span>
        <span class="flex-1 truncate text-left">{{ category.zh }}</span>
        <span
          class="rounded-full bg-slate-200/80 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-slate-600 dark:bg-slate-700/80 dark:text-slate-300"
          >{{ categoryCounts[key] || 0 }}</span
        >
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from "./ThemeToggle.vue";
import amberLogo from "../assets/imgs/spark-store.svg";

defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: Record<string, any>;
  activeCategory: string;
  categoryCounts: Record<string, number>;
  themeMode: "light" | "dark" | "auto";
}>();

const emit = defineEmits<{
  (e: "toggle-theme"): void;
  (e: "select-category", category: string): void;
  (e: "close"): void;
}>();

const toggleTheme = () => {
  emit("toggle-theme");
};

const selectCategory = (category: string) => {
  emit("select-category", category);
};
</script>
