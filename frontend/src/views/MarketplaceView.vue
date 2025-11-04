<script setup lang="ts">
import CarouselOrganism from "@/components/organisms/CarouselOrganism.vue";
import TextAtom from "@/components/atoms/TextAtom.vue";
import Divider from "primevue/divider";
import Button from "primevue/button";
import RequestDialogOrganism from "@/components/organisms/RequestDialogOrganism.vue";
import {ref} from "vue";

const visible = ref(false);
</script>

<template>
  <RequestDialogOrganism v-model:visible="visible"/>
  <div class="flex flex-row justify-between mt-4 mb-4">
    <TextAtom tag="h2" class="text-xl font-bold">Eigene Anfragen</TextAtom>
    <Button label="Anfrage Erstellen" icon="pi pi-plus" @click="visible = true"/>
  </div>
  <CarouselOrganism ownRequests/>
  <Divider align="left" type="horizontal"/>
  <TextAtom tag="h2" class="text-xl font-bold mt-4 mb-4">Anfragen deiner Nachbarn</TextAtom>
  <CarouselOrganism :ownRequests="false"/>
</template>