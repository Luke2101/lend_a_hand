<script setup lang="ts">
import { ref, onMounted } from "vue";
import {useConfirm} from "primevue";
import { useToast } from "primevue/usetoast";

import Carousel from 'primevue/carousel';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import ConfirmPopup from 'primevue/confirmpopup';

import { ProductService } from '@/service/ProductService';

interface ResponsiveOption {
  breakpoint: string;
  numVisible: number;
  numScroll: number;
}

const props = withDefaults(defineProps<{
  ownRequests: boolean;
}>(), {
  ownRequests: false
});

const confirm = useConfirm();
const toast = useToast();

const AUTOPLAY_INTERVAL = props.ownRequests ? 0 : 3000;

onMounted(() => {
  ProductService.getProductsSmall().then((data) => (products.value = data.slice(0, 9)));
})

const toggleFavorite = (event: MouseEvent) => {
  // TODO api request
  toast.add({ severity: 'success', summary: 'Favorit', detail: 'Status simuliert umgeschaltet.', life: 3000 });
}

const confirmDelete = (event: MouseEvent) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Möchtest du die Anfrage löschen?',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Abbrechen',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Löschen',
      severity: 'danger'
    },
    accept: () => {
      // TODO send request
      toast.add({ severity: 'info', summary: 'Bestätigt', detail: 'Anfrage gelöscht', life: 3000 });
    }
  });
};

const products = ref();

const getSeverity = (status: string): 'success' | 'warn' | 'danger' | null => {
  switch (status) {
    case 'INSTOCK':
      return 'success';
    case 'LOWSTOCK':
      return 'warn';
    case 'OUTOFSTOCK':
      return 'danger';
    default:
      return null;
  }
};

const responsiveOptions: ResponsiveOption[] = [
  { breakpoint: '1400px', numVisible: 3, numScroll: 1 }, // Geändert von 2 auf 3, da numVisible=3 Standard ist.
  { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
  { breakpoint: '767px', numVisible: 2, numScroll: 1 },
  { breakpoint: '575px', numVisible: 1, numScroll: 1 }
];
</script>

<template>
  <ConfirmPopup/>
  <div class="card">
    <Carousel :value="products" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions" circular :autoplay-interval="AUTOPLAY_INTERVAL">
      <template #item="slotProps">
        <div class="border border-surface-200 dark:border-surface-700 rounded m-2  p-4">
          <div class="mb-4">
            <div class="relative mx-auto">
              <img :src="'https://primefaces.org/cdn/primevue/images/product/' + slotProps.data.image" :alt="slotProps.data.name" class="w-full rounded" />
              <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data.inventoryStatus)" class="absolute" style="left:5px; top: 5px"/>
            </div>
          </div>
          <div class="mb-4 font-medium">{{ slotProps.data.name }}</div>
          <div class="flex justify-between items-center">
            <div class="mt-0 font-semibold text-xl">${{ slotProps.data.price }}</div>
            <span>
              <Button v-if="props.ownRequests" icon="pi pi-trash" severity="danger" variant="outlined" @click="confirmDelete($event)"/>
              <Button v-else icon="pi pi-heart" severity="secondary" variant="outlined" @click="toggleFavorite($event)"/>
              <Button icon="pi pi-arrow-up-right-and-arrow-down-left-from-center" class="ml-2"/>
            </span>
          </div>
        </div>
      </template>
    </Carousel>
  </div>
</template>