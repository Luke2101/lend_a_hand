<script setup lang="ts">
const props = defineProps<{
  tag?: 'h1' | 'h2' | 'p' | 'span' | 'div'
  class?: string
}>();

const componentTag = props.tag || 'p';
</script>

<template>
  <component
      :is="componentTag"
      :class="props.class"
  >
    <slot />
  </component>
</template>