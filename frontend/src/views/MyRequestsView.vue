<script setup lang="ts">
import CarouselOrganism from "@/components/organisms/CarouselOrganism.vue";
import TextAtom from "@/components/atoms/TextAtom.vue";
import Button from "primevue/button";
import RequestDialogOrganism from "@/components/organisms/RequestDialogOrganism.vue";
import {ref, watch} from "vue";
import {ViewType} from "@/types/ViewType.enum";

const visible = ref();

const ownRequestsRef = ref<InstanceType<typeof CarouselOrganism> | null>(null);

const refreshCarousel = () => {
  ownRequestsRef.value?.fetchRequests();
};

watch(visible, (newVal, oldVal) => {
  if (oldVal === true && newVal === false) {
    refreshCarousel();
  }
});
</script>

<template>
  <RequestDialogOrganism v-model:visible="visible"/>
  <div class="flex flex-row justify-between mt-4 mb-4">
    <TextAtom tag="h2" class="text-xl font-bold">Eigene Anfragen</TextAtom>
    <Button label="Anfrage Erstellen" icon="pi pi-plus" @click="visible = true"/>
  </div>
  <CarouselOrganism :view-type="ViewType.own" ref="ownRequestsRef" @request-updated="refreshCarousel"/>
</template>