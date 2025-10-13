<script setup lang="ts">
import CarouselOrganism from "@/components/organisms/CarouselOrganism.vue";
import SubtitelAtom from "@/components/atoms/SubtitelAtom.vue";
</script>

<template>
  <SubtitelAtom text="Meine Anfragen"/>
  <CarouselOrganism/>
  <SubtitelAtom text="Anfragen anderer"/>
  <CarouselOrganism/>
  <div class="h-[5rem]"></div>
</template>

<style scoped>

</style>