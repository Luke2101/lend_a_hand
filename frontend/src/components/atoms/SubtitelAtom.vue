<script setup lang="ts">
defineProps({
  text: String
})
</script>

<template>
  <h2>{{ text }}</h2>
</template>

<style scoped>
h2{
  font-size: large;
  font-weight: bold;
  margin: 20px;
}
</style>