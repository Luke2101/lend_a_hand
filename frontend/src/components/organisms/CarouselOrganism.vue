<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {useConfirm} from "primevue";
import { useToast } from "primevue/usetoast";

import Carousel from 'primevue/carousel';
import ConfirmPopup from 'primevue/confirmpopup';
import ProgressSpinner from 'primevue/progressspinner';

import type { Request } from '@/types/Request.interface';
import RequestCardMolecule from '@/components/molecules/RequestCardMolecule.vue';

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

const AUTOPLAY_INTERVAL = props.ownRequests ? 0 : 5000;

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
      return 'zu verschenken';
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
          <RequestCardMolecule
              :request="slotProps.data"
              :own-requests="props.ownRequests"
              :format-date="formatDate"
              :get-severity="getSeverity"
              :get-category-name="getCategoryName"
              :is-favorite="isFavorite"
              :toggle-favorite="toggleFavorite"
              :confirm-delete="confirmDelete"
          />
        </template>
      </Carousel>
    </div>

    <div v-else class="text-center text-surface-500 dark:text-surface-400 p-8">
      <p v-if="props.ownRequests">Du hast noch keine Anfragen erstellt.</p>
      <p v-else>Aktuell gibt es keine Anfragen in deiner Nähe.</p>
    </div>
  </div>
</template>