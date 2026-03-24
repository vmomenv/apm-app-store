<template>
  <div :class="['flex flex-wrap gap-3', $attrs.class]">
    <button
      v-if="apmAvailable"
      type="button"
      class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand to-brand-dark px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      @click="handleList"
      title="已安装应用"
    ></button>
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand to-brand-dark px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      @click="handleUpdate"
      title="检查可更新的软件包列表"
    >
      <i class="fas fa-sync-alt"></i>
      <span>软件更新</span>
    </button>
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand to-brand-dark px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      @click="handleSettings"
      title="安装设置"
    >
      <i class="fas fa-cog"></i>
      <span>安装设置</span>
    </button>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  apmAvailable: boolean;
}>();

defineOptions({
  inheritAttrs: false,
});

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

const handleList = () => {
  emit("list");
};
</script>
