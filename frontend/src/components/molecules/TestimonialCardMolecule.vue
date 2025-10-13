<script setup lang="ts">
import Avatar from 'primevue/avatar';

defineProps<{
  avatarUrl: string;
  name: string;
  quote: string;
  enterClass: string;
}>();
</script>

<template>
  <div
      v-animateonscroll="{ enterClass: enterClass }"
      class="flex flex-col border border-surface shadow-lg justify-center items-center max-w-80 rounded-2xl p-8 gap-4"
  >
    <Avatar :image="avatarUrl" shape="circle" size="xlarge" />
    <span class="text-2xl font-medium">{{ name }}</span>
    <span class="text-muted-color text-center">"{{ quote }}"</span>
  </div>
</template>