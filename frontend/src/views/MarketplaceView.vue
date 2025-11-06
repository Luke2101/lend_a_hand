<script setup lang="ts">
import CarouselOrganism from "@/components/organisms/CarouselOrganism.vue";
import TextAtom from "@/components/atoms/TextAtom.vue";
import Divider from "primevue/divider";
import Button from "primevue/button";
import RequestDialogOrganism from "@/components/organisms/RequestDialogOrganism.vue";
import { ViewType } from '@/types/ViewType.enum';
import {ref, watch} from "vue";

const visible = ref(false);

const ownRequestsRef = ref<InstanceType<typeof CarouselOrganism> | null>(null);
const nearbyRequestsRef = ref<InstanceType<typeof CarouselOrganism> | null>(null);

const refreshCarousels = () => {
  ownRequestsRef.value?.fetchRequests();
  nearbyRequestsRef.value?.fetchRequests();
};

watch(visible, (newVal, oldVal) => {
  if (oldVal === true && newVal === false) {
    refreshCarousels();
  }
});
</script>

<template>
  <RequestDialogOrganism v-model:visible="visible"/>
  <div class="flex flex-row justify-between mt-4 mb-4">
    <TextAtom tag="h2" class="text-xl font-bold">Eigene Anfragen</TextAtom>
    <Button label="Anfrage Erstellen" icon="pi pi-plus" @click="visible = true"/>
  </div>
  <CarouselOrganism :view-type="ViewType.own" ref="ownRequestsRef" @request-updated="refreshCarousels"/>

  <Divider align="left" type="horizontal"/>
  <TextAtom tag="h2" class="text-xl font-bold mt-4 mb-4">Anfragen deiner Nachbarn</TextAtom>
  <CarouselOrganism :view-type="ViewType.nearby" ref="nearbyRequestsRef" @request-updated="refreshCarousels"/>
</template>