<script setup lang="ts">
defineProps<{
  icon?: string;
  numberText?: string;
  title: string;
  text: string;
  isPrimary?: boolean;
  enterClass: string;
}>();
</script>

<template>
  <div
      v-animateonscroll="{ enterClass: enterClass}"
      :class="{
      'bg-primary text-primary-contrast': isPrimary,
      'border border-surface shadow-lg': !isPrimary
    }"
      class="flex flex-col justify-center items-center max-w-80 rounded-2xl p-8 gap-4"
  >
    <div v-if="icon" class="rounded-full w-12 h-12 flex items-center justify-center">
      <i :class="icon" class="!text-2xl"></i>
    </div>
    <span v-else-if="numberText" class="bg-white/20 text-xl font-medium rounded-xl px-4 py-2">
      {{ numberText }}
    </span>

    <span class="text-2xl font-bold">{{ title }}</span>
    <span class="text-muted-color text-center" :class="{ 'text-primary-contrast/90': isPrimary }">{{ text }}</span>
  </div>
</template>