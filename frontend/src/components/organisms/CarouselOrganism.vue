<script setup lang="ts">
import { ref, onMounted, watch, defineExpose, defineEmits } from "vue";
import { useConfirm } from "primevue";
import { useToast } from "primevue/usetoast";

import Carousel from 'primevue/carousel';
import ProgressSpinner from 'primevue/progressspinner';

import type { Request } from '@/types/Request.interface';
import { ViewType } from '@/types/ViewType.enum';
import RequestCardMolecule from '@/components/molecules/RequestCardMolecule.vue';
import RequestDialogOrganism from "@/components/organisms/RequestDialogOrganism.vue";

interface ResponsiveOption {
  breakpoint: string;
  numVisible: number;
  numScroll: number;
}

interface CarouselProps {
  viewType: ViewType;
}

const props = withDefaults(defineProps<CarouselProps>(), {
  viewType: ViewType.nearby
});

const confirm = useConfirm();
const toast = useToast();

const AUTOPLAY_INTERVAL = props.viewType === ViewType.nearby ? 5000 : 0;

const requests = ref<Request[]>([]);
const requestsLoading = ref(true);

const favoriteIds = ref<number[]>([]);
const favouritesLoading = ref(false);

const emit = defineEmits(['requestUpdated']);

const isEditDialogVisible = ref(false);
const requestToEdit = ref<Request | undefined>(undefined);

const fetchRequests = async () => {
  requestsLoading.value = true;
  let endpoint = '';

  switch (props.viewType) {
    case ViewType.own:
      endpoint = 'http://localhost:8080/request/self';
      break;
    case ViewType.nearby:
      endpoint = 'http://localhost:8080/request/nearby';
      break;
    case ViewType.accepted:
      endpoint = 'http://localhost:8080/request/accepted';
      break;
    case ViewType.favorite:
    {
      await fetchFavorites();

      if (favoriteIds.value.length === 0) {
        requests.value = [];
        requestsLoading.value = false;
        return;
      }

      const idsQuery = favoriteIds.value.join(',');
      endpoint = `http://localhost:8080/request?ids=${idsQuery}`;

      break;
    }
    default:
      console.error('Unbekannter ViewType:', props.viewType);
      requestsLoading.value = false;
      return;
  }

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
  if (props.viewType !== ViewType.own) {
    await fetchFavorites();
  }
  await fetchRequests();
};

onMounted(loadData);
watch(() => props.viewType, loadData);

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

const confirmEdit = (request: Request) => {
  requestToEdit.value = request;
  isEditDialogVisible.value = true;
};

const confirmDelete = (event: MouseEvent, requestId: number) => {
  confirm.require({
    group: 'popup',
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
          emit('requestUpdated');
        } else if (response.status === 403) {
          toast.add({ severity: 'error', summary: 'Fehler', detail: 'Du hast keine Berechtigung, diese Anfrage zu löschen.', life: 5000 });
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

const confirmAccept = (requestId: number, successCallback: () => void) => {
  confirm.require({
    group: 'dialog',
    header: 'Anfrage annehmen',
    message: 'Durch das Annehmen der Anfrage wird dein Vorname und deine Email mit dem Ersteller geteilt.',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Abbrechen',
      severity: 'secondary',
      icon: 'pi pi-times',
      outlined: true,
      size: 'small',
    },
    acceptProps: {
      label: 'Annehmen',
      icon: 'pi pi-check',
      size: 'small',
    },
    accept: async() => {
      try {
        const response = await fetch(`http://localhost:8080/request/accept?id=${requestId}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Anfrage erfolgreich angenommen:', result);
          successCallback();
          setTimeout(() => {
            emit('requestUpdated');
          }, 1500); // delay for confetti
        }
        else if (response.status === 403) {
          toast.add({ severity: 'error', summary: 'Fehler', detail: 'Diese Anfrage wurde bereits angenommen oder Sie sind nicht dazu berechtigt.', life: 5000});
        } else {
          const errorData = await response.json();
          console.error('Fehler beim Annehmen der Anfrage:', errorData.message);
          toast.add({ severity: 'error', summary: 'Fehler', detail: errorData.message || 'Annehmen fehlgeschlagen.', life: 5000 });
        }
      } catch (error) {
        console.error('Netzwerkfehler beim Annehmen der Anfrage:', error);
      }
    }
  });
};

const confirmFinish = (requestId: number) => {
  confirm.require({
    group: 'dialog',
    header: 'Auftrag abschließen',
    message: 'Durch das abschließen der Anfrage bekommt der Helfer seine Kronen und die Anfrage wird gelöscht.',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Abbrechen',
      severity: 'secondary',
      icon: 'pi pi-times',
      outlined: true,
      size: 'small',
    },
    acceptProps: {
      label: 'Abschließen',
      icon: 'pi pi-check',
      size: 'small',
    },
    accept: async() => {
      try {
        const response = await fetch(`http://localhost:8080/request/finish?id=${requestId}`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Anfrage erfolgreich abgeschlossen:', result);
          emit('requestUpdated');
        } else {
          const errorData = await response.json();
          console.error('Fehler beim Abschliessen der Anfrage:', errorData.message);
          toast.add({ severity: 'error', summary: 'Fehler', detail: errorData.message || 'Abschließen fehlgeschlagen.', life: 5000 });
        }
      } catch (error) {
        console.error('Netzwerkfehler beim Abschließen der Anfrage:', error);
      }
    }
  });
};

const formatDateTime = (iso: string | undefined) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' '
      + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
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

defineExpose({
  fetchRequests
});
</script>

<template>
  <RequestDialogOrganism
      v-model:visible="isEditDialogVisible"
      :request-to-edit="requestToEdit"
      @update:visible="(value) => {
        isEditDialogVisible = value;
        if (!value) {
            fetchRequests();
        }
      }"
  />
  <div class="card">
    <div v-if="requestsLoading" class="flex justify-center items-center h-40">
      <ProgressSpinner/>
    </div>

    <div v-else-if="requests.length > 0">
      <Carousel :value="requests" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions" circular :autoplay-interval="AUTOPLAY_INTERVAL">
        <template #item="slotProps">
          <RequestCardMolecule
              :request="slotProps.data"
              :is-own-request="props.viewType === ViewType.own"
              :format-date-time="formatDateTime"
              :get-severity="getSeverity"
              :get-category-name="getCategoryName"
              :is-favorite="isFavorite"
              :toggle-favorite="toggleFavorite"
              :confirm-edit="confirmEdit"
              :confirm-delete="confirmDelete"
              :confirm-accept="confirmAccept"
              :confirm-finish="confirmFinish"
          />
        </template>
      </Carousel>
    </div>

    <div v-else class="text-center text-surface-500 dark:text-surface-400 p-8">
      <p v-if="props.viewType === ViewType.own">Du hast noch keine Anfragen erstellt.</p>
      <p v-else-if="props.viewType === ViewType.nearby">Aktuell gibt es keine Anfragen in deiner Nähe.</p>
      <p v-else-if="props.viewType === ViewType.favorite">Du hast noch keine Anfragen favorisiert.</p>
      <p v-else-if="props.viewType === ViewType.accepted">Du hast noch keine Anfragen angenommen.</p>
      <p v-else>Keine Anfragen gefunden.</p>
    </div>
  </div>
</template>