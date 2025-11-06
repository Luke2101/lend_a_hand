<script setup lang="ts">
import CarouselOrganism from "@/components/organisms/CarouselOrganism.vue";
import TextAtom from "@/components/atoms/TextAtom.vue";
import {ViewType} from "@/types/ViewType.enum";
import {ref} from "vue";

const favoriteRequestsRef = ref<InstanceType<typeof CarouselOrganism> | null>(null);

const refreshCarousel = () => {
  favoriteRequestsRef.value?.fetchRequests();
};
</script>

<template>
  <TextAtom tag="h2" class="text-xl font-bold mt-4 mb-4">Meine Favoriten</TextAtom>
  <CarouselOrganism :view-type="ViewType.favorite" ref="favoriteRequestsRef" @request-updated="refreshCarousel"/>
</template>