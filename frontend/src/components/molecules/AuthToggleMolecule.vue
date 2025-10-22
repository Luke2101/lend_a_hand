<script setup lang="ts">
import { RouterLink } from 'vue-router';

defineProps<{
  question: string;
  linkText: string;
  to: string;
}>();
</script>

<template>
  <p class="text-center text-xs mt-4">
    {{ question }}

    <RouterLink :to="to" class="text-primary font-medium hover:underline">
      {{ linkText }}
    </RouterLink>
  </p>
</template>