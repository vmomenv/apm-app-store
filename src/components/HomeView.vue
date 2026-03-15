<template>
   <div class="space-y-8">
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400"
    >
      <i class="fas fa-spinner fa-spin text-2xl mb-3"></i>
      <span class="text-sm">正在加载首页内容…</span>
    </div>
    <div
      v-else-if="error"
      class="rounded-2xl border border-rose-200/70 bg-rose-50/60 px-6 py-4 text-center text-sm text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300"
    >
      {{ error }}
    </div>
    <div v-else-if="error" class="text-center text-rose-600">{{ error }}</div>
    <div v-else>
      <div class="grid gap-4 auto-fit-grid">
        <a
          v-for="link in links"
          :key="link.url + link.name"
          :href="link.type === '_blank' ? undefined : link.url"
          @click.prevent="onLinkClick(link)"
          class="flex flex-col items-start gap-2 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm hover:shadow-lg transition"
          :title="link.more as string"
        >
          <img
            :src="computedImgUrl(link)"
            class="h-20 w-full object-contain"
            loading="lazy"
          />
          <div class="text-base font-semibold text-slate-900">
            {{ link.name }}
          </div>
          <div class="text-sm text-slate-500">{{ link.more }}</div>
        </a>
      </div>

      <div class="space-y-6 mt-6">
        <section v-for="section in lists" :key="section.title">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-900">
              {{ section.title }}
            </h3>
          </div>
          <div class="mt-3 grid gap-4 auto-fit-grid">
            <AppCard
              v-for="app in section.apps"
              :key="app.pkgname"
              :app="app"
              @open-detail="$emit('open-detail', $event)"
            />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppCard from "./AppCard.vue";
import { APM_STORE_BASE_URL } from "../global/storeConfig";
import type { HomeLink, HomeList, App } from "../global/typedefinition";

defineProps<{
  links: HomeLink[];
  lists: HomeList[];
  loading: boolean;
  error: string;
}>();

defineEmits<{
  (e: "open-detail", app: App | Record<string, unknown>): void;
}>();

const computedImgUrl = (link: HomeLink) => {
  if (!link.imgUrl) return "";
  const arch = window.apm_store.arch || "amd64";
  const finalArch = link.origin === "spark" ? `${arch}-store` : `${arch}-apm`;
  return `${APM_STORE_BASE_URL}/${finalArch}${link.imgUrl}`;
};

const onLinkClick = (link: HomeLink) => {
  if (link.type === "_blank") {
    window.open(link.url, "_blank");
  } else {
    // open in same page: navigate to url
    window.location.href = link.url;
  }
};
</script>

<style scoped></style>

<style scoped>
.auto-fit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

/* slight gap tuning for small screens */
@media (max-width: 640px) {
  .auto-fit-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
}
</style>
