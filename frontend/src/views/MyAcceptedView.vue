<script setup lang="ts">
import CarouselOrganism from "@/components/organisms/CarouselOrganism.vue";
import TextAtom from "@/components/atoms/TextAtom.vue";
import {ViewType} from "@/types/ViewType.enum";
import Divider from "primevue/divider";
</script>

<template>
  <Divider align="left" type="horizontal"/>
  <TextAtom tag="h2" class="text-xl font-bold mt-4 mb-4">Angenommene Anfragen</TextAtom>
  <CarouselOrganism :view-type="ViewType.accepted"/>
</template>