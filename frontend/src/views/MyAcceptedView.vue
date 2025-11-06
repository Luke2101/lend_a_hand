<script setup lang="ts">
import CarouselOrganism from "@/components/organisms/CarouselOrganism.vue";
import TextAtom from "@/components/atoms/TextAtom.vue";
import {ViewType} from "@/types/ViewType.enum";
import {ref} from "vue";

const acceptedRequestsRef = ref<InstanceType<typeof CarouselOrganism> | null>(null);

const refreshCarousel = () => {
  acceptedRequestsRef.value?.fetchRequests();
};
</script>

<template>
  <TextAtom tag="h2" class="text-xl font-bold mt-4 mb-4">Angenommene Anfragen</TextAtom>
  <CarouselOrganism :view-type="ViewType.accepted" ref="acceptedRequestsRef" @request-updated="refreshCarousel"/>
</template>