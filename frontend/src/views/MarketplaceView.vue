<script setup lang="ts">
import CarouselOrganism from "@/components/organisms/CarouselOrganism.vue";
import TextAtom from "@/components/atoms/TextAtom.vue";
import Divider from "primevue/divider";
</script>

<template>
  <TextAtom tag="h2" class="text-xl font-bold mt-4 mb-4">Meine Anfragen</TextAtom>
  <CarouselOrganism/>
  <Divider align="left" type="horizontal"/>
  <TextAtom tag="h2" class="text-xl font-bold mt-4 mb-4">Anfragen anderer</TextAtom>
  <CarouselOrganism/>
  <div class="h-[5rem]"></div>
</template>

<style scoped>

</style>