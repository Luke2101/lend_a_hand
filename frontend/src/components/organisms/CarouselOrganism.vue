<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {useConfirm} from "primevue";
import { useToast } from "primevue/usetoast";

import Carousel from 'primevue/carousel';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import ConfirmPopup from 'primevue/confirmpopup';
import ProgressSpinner from 'primevue/progressspinner';

import rent from '@/assets/rent.jpeg';
import help from '@/assets/help.jpg';
import giveaway from '@/assets/giveaway.jpeg';

interface Request {
  id: number;
  title: string;
  category: string;
  credits: number;
  description: string | null;
  image?: string;
  status: 'pending' | 'accepted' | 'closed';
}

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

const images = { rent, help, giveaway }
const confirm = useConfirm();
const toast = useToast();

const AUTOPLAY_INTERVAL = props.ownRequests ? 0 : 3000;

const requests = ref<Request[]>([]);
const requestsLoading = ref(true);

const fetchRequests = async () => {
  requestsLoading.value = true;
  const endpoint = props.ownRequests
      ? 'http://localhost:8080/request/self'
      : 'http://localhost:8080/request/nearby';

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const data = await response.json();

    if (response.ok) {
      requests.value = data;
    } else if (response.status === 401) {
      requests.value = [];
    } else {
      console.error('API-Fehler beim Laden der Anfragen:', data);
      toast.add({ severity: 'error', summary: 'Fehler', detail: 'Anfragen konnten nicht geladen werden.', life: 5000 });
      requests.value = [];
    }
  } catch (error) {
    console.error('Netzwerkfehler beim Laden der Anfragen:', error);
    toast.add({ severity: 'error', summary: 'Netzwerkfehler', detail: 'Verbindung zum Anfrageserver fehlgeschlagen.', life: 5000 });
  } finally {
    requestsLoading.value = false;
  }
};

onMounted(fetchRequests);
watch(() => props.ownRequests, fetchRequests);

const toggleFavorite = (event: MouseEvent) => {
  // TODO api request
  toast.add({ severity: 'success', summary: 'Favorit', detail: 'Status simuliert umgeschaltet.', life: 3000 });
}

const confirmDelete = (event: MouseEvent, requestId: number) => {
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
    accept: async() => {
      try {
        const response = await fetch(`http://localhost:8080/request?id=${requestId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (response.ok) {
          toast.add({ severity: 'info', summary: 'Bestätigt', detail: 'Anfrage gelöscht', life: 3000 });
          requests.value = requests.value.filter(r => r.id !== requestId);
        } else if (response.status === 403) {
          const data = await response.json();
          toast.add({ severity: 'error', summary: 'Fehler', detail: data.message || 'Du hast keine Berechtigung, diese Anfrage zu löschen.', life: 5000 });
        } else {
          const data = await response.json();
          toast.add({ severity: 'error', summary: 'Fehler', detail: data.message || 'Löschen fehlgeschlagen.', life: 5000 });
        }
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Netzwerkfehler', detail: 'Verbindung zum Server fehlgeschlagen.', life: 5000 });
      }
    }
  });
};

const getSeverity = (category: string): 'info' | 'success' | 'warn' | null => {
  switch (category) {
    case 'rent':
      return 'info';
    case 'help':
      return 'warn';
    case 'giveaway':
      return 'success';
    default:
      return null;
  }
};

const getCategoryName = (category: string) => {
  switch (category) {
    case 'rent':
      return 'Ausleihen';
    case 'help':
      return 'Hilfe';
    case 'giveaway':
      return 'zu verschencken';
    default:
      return null;
  }
};

const responsiveOptions: ResponsiveOption[] = [
  { breakpoint: '1400px', numVisible: 3, numScroll: 1 },
  { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
  { breakpoint: '767px', numVisible: 2, numScroll: 1 },
  { breakpoint: '575px', numVisible: 1, numScroll: 1 }
];
</script>

<template>
  <ConfirmPopup/>
  <div class="card">
    <div v-if="requestsLoading" class="flex justify-center items-center h-40">
      <ProgressSpinner/>
    </div>

    <div v-else-if="requests.length > 0">
      <Carousel :value="requests" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions" circular :autoplay-interval="AUTOPLAY_INTERVAL">
        <template #item="slotProps">
          <div class="border border-surface-200 dark:border-surface-700 rounded m-2  p-4">
            <div class="mb-4">
              <div class="relative mx-auto">
                <img :src="images[slotProps.data.category]" :alt="slotProps.data.category" class="w-full rounded" />
                <Tag :value="getCategoryName(slotProps.data.category)" :severity="getSeverity(slotProps.data.category)" class="absolute" style="left:5px; top: 5px"/>
              </div>
            </div>

            <div class="mb-2 font-bold">{{ slotProps.data.title }}</div>
            <p class="text-sm text-surface-600 dark:text-surface-300 line-clamp-2 mb-4">{{ slotProps.data.description || 'Keine Beschreibung vorhanden.' }}</p>

            <div class="flex justify-between items-center">
              <div class="mt-0 font-semibold text-xl flex items-center">
                <i class="pi pi-crown mr-2 text-primary"></i> {{ slotProps.data.credits }}
              </div>
              <span>
                  <Button v-if="props.ownRequests" icon="pi pi-trash" severity="danger" variant="outlined" @click="confirmDelete($event, slotProps.data.id)"/>
                  <Button v-else icon="pi pi-heart" severity="secondary" variant="outlined" @click="toggleFavorite($event)"/>
                  <Button v-if="props.ownRequests" icon="pi pi-pen-to-square" class="ml-2"/>
                  <Button v-else icon="pi pi-arrow-up-right-and-arrow-down-left-from-center" class="ml-2"/>
                </span>
            </div>
          </div>
        </template>
      </Carousel>
    </div>

    <div v-else class="text-center text-surface-500 dark:text-surface-400 p-8">
      <p v-if="props.ownRequests">Du hast noch keine Anfragen erstellt.</p>
      <p v-else>Aktuell gibt es keine Anfragen in deiner Nähe.</p>
    </div>
  </div>
</template>