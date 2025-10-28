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
  from?: string;
  to?: string;
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

const favoriteIds = ref<number[]>([]);
const favouritesLoading = ref(false);

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

const fetchFavorites = async () => {
  favouritesLoading.value = true;
  try {
    const response = await fetch('http://localhost:8080/favourites', { // GET /favourites
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      // Die API gibt direkt ein Array von IDs zurück
      favoriteIds.value = Array.isArray(data) ? data : [];
    } else {
      console.error('Fehler beim Laden der Favoriten-IDs');
      favoriteIds.value = [];
    }
  } catch (error) {
    console.error('Netzwerkfehler beim Laden der Favoriten-IDs:', error);
    favoriteIds.value = [];
  } finally {
    favouritesLoading.value = false;
  }
};

const loadData = async () => {
  await fetchRequests();
  if (!props.ownRequests) {
    await fetchFavorites();
  }
};

onMounted(loadData);
watch(() => props.ownRequests, loadData);

const isFavorite = (requestId: number): boolean => {
  return favoriteIds.value.includes(requestId);
};

const toggleFavorite = async (requestId: number) => {
  const isCurrentlyFavorite = isFavorite(requestId);
  const method = isCurrentlyFavorite ? 'DELETE' : 'POST';

  if (isCurrentlyFavorite) {
    favoriteIds.value = favoriteIds.value.filter(id => id !== requestId);
  } else {
    favoriteIds.value.push(requestId);
  }

  try {
    const response = await fetch(`http://localhost:8080/favourites?id=${requestId}`, {
      method: method,
      credentials: 'include'
    });

    if (response.ok || response.status === 201) {
      console.log(`Favorite ${isCurrentlyFavorite ? 'removed' : 'added'}: ID ${requestId}`);
    } else if (response.status === 409 && !isCurrentlyFavorite) { // ALREADY_IN_FAVOURITES (POST)
      console.error('Request was already in favorites');
      if (!favoriteIds.value.includes(requestId)) {
        favoriteIds.value.push(requestId);
      }
    } else {
      const data = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error(`Error during ${method} favorite status for ID ${requestId}. Status: ${response.status}. Message: ${data.message}`);
      await fetchFavorites();
    }
  } catch (error) {
    console.error('Network error when toggling favorites:', error);
    await fetchFavorites();
  }
};

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

const formatDate = (iso: string | undefined) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
          <div class="border border-surface-200 dark:border-surface-700 rounded m-2 p-4 min-h-[26rem] flex flex-col justify-between">
            <div class="mb-4">
              <div class="relative mx-auto">
                <img :src="images[slotProps.data.category]" :alt="slotProps.data.category" class="w-full h-48 rounded object-cover"/>
                <Tag :value="getCategoryName(slotProps.data.category)" :severity="getSeverity(slotProps.data.category)" class="absolute" style="left:5px; top: 5px"/>
              </div>
            </div>

            <div class="mb-2 font-bold">{{ slotProps.data.title }}</div>
            <div v-if="slotProps.data.from && slotProps.data.to" class="text-sm text-surface-500 dark:text-surface-400 mb-2">
              {{ formatDate(slotProps.data.from) }} – {{ formatDate(slotProps.data.to) }}
            </div>
            <p class="text-sm text-surface-600 dark:text-surface-300 max-w-[22rem] line-clamp-2 mb-4 break-words">{{ slotProps.data.description || 'Keine Beschreibung vorhanden.' }}</p>

            <div class="flex justify-between items-center mt-auto">
              <div class="mt-0 font-semibold text-xl flex items-center">
                <i class="pi pi-crown mr-2 text-primary"></i> {{ slotProps.data.credits }}
              </div>
              <span>
                  <Button
                      v-if="props.ownRequests"
                      icon="pi pi-trash"
                      severity="danger"
                      variant="outlined"
                      @click="confirmDelete($event, slotProps.data.id)"
                  />
                  <Button
                      v-else
                      :icon="isFavorite(slotProps.data.id) ? 'pi pi-heart-fill' : 'pi pi-heart'"
                      :severity="isFavorite(slotProps.data.id) ? 'danger' : 'secondary'"
                      variant="outlined"
                      @click="toggleFavorite(slotProps.data.id)"
                  />
                  <Button
                      v-if="props.ownRequests"
                      icon="pi pi-pen-to-square"
                      class="ml-2"
                  />
                  <!-- TODO add accept btn -->
                  <Button
                      v-else
                      icon="pi pi-arrow-up-right-and-arrow-down-left-from-center"
                      class="ml-2"
                  />
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