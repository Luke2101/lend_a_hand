<script setup lang="ts">
import Tag from 'primevue/tag';
import Button from 'primevue/button';

import type { Request } from '@/types/Request.interface';
import { ref, onMounted } from 'vue';

import rent from '@/assets/rent.jpeg';
import help from '@/assets/help.jpg';
import giveaway from '@/assets/giveaway.jpeg';

interface UserInfo {
  prename: string;
  email: string;
}

const props = defineProps<{
  request: Request;
  ownRequests: boolean;
  formatDate: (iso: string | undefined) => string;
  getSeverity: (category: string) => 'info' | 'success' | 'warn' | null;
  getCategoryName: (category: string) => string | null;
  isFavorite: (requestId: number) => boolean;
  toggleFavorite: (requestId: number) => Promise<void>;
  confirmDelete: (event: MouseEvent, requestId: number) => void;
  confirmAccept: (requestId: number) => void;
  confirmFinish: (requestId: number) => void;
}>();

const images = { rent, help, giveaway };

const acceptedByUser = ref<UserInfo | null>(null);

const fetchAcceptedBy = async (userId: string) => {
  try {
    const response = await fetch(`http://localhost:8080/user?id=${userId}`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      acceptedByUser.value = await response.json() as UserInfo;
    } else {
      console.error('Fehler beim Laden der User-Daten für accepted_by:', await response.json());
    }
  } catch (error) {
    console.error('Netzwerkfehler beim Laden der User-Daten:', error);
  }
};

onMounted(() => {
  if (props.request.accepted_by) {
    fetchAcceptedBy(props.request.accepted_by);
  }
});
</script>

<template>
  <div class="border border-surface-200 dark:border-surface-700 rounded m-2 p-4 min-h-[28rem] flex flex-col justify-between">
    <div class="mb-2">
      <div class="relative mx-auto">
        <img :src="images[request.category]" :alt="request.category" class="w-full h-48 rounded object-cover"/>
        <Tag :value="getCategoryName(request.category)" :severity="getSeverity(request.category)" class="absolute" style="left:5px; top: 5px"/>
      </div>
    </div>

    <Button
        v-if="request.accepted_by && acceptedByUser"
        icon="pi pi-check" :label="acceptedByUser.prename"
        v-tooltip.bottom="'Anfrage wurde von ' + acceptedByUser.prename + ' (' + acceptedByUser.email +') angenommen.'"
        severity="success"
        variant="outlined"
        size="small"
        @click="confirmFinish(request.id)"
    />
    <div class="mb-1 mt-2 font-bold flex justify-between">
      {{ request.title }}
      <Tag v-if="!props.ownRequests" icon="pi pi-map-marker" v-tooltip.bottom="request.city" :value="request.plz" class="ml-2"/>
    </div>
    <div v-if="!props.ownRequests">
      <i class="pi pi-user mr-2 mb-2"/>
      {{ request.prename }}
    </div>
    <div v-if="request.from && request.to" class="text-sm text-surface-500 dark:text-surface-400 mb-1">
      {{ formatDate(request.from) }} – {{ formatDate(request.to) }}
    </div>
    <p class="text-sm text-surface-600 dark:text-surface-300 max-w-[22rem] line-clamp-2 mb-2 break-words">{{ request.description || 'Keine Beschreibung vorhanden.' }}</p>

    <div class="flex justify-between items-center mt-auto">
      <div class="mt-0 font-semibold text-xl flex items-center" v-tooltip.bottom="'Für diesen Auftrag bekommen Sie ' + request.credits + ' Punkte'">
        <i class="pi pi-crown mr-2 text-primary"></i> {{ request.credits }}
      </div>
      <span>
          <Button
              v-if="props.ownRequests"
              icon="pi pi-trash"
              severity="danger"
              variant="text"
              v-tooltip="'Auftrag löschen'"
              @click="confirmDelete($event, request.id)"
          />
          <Button
              v-else
              :icon="isFavorite(request.id) ? 'pi pi-heart-fill' : 'pi pi-heart'"
              :severity="isFavorite(request.id) ? 'danger' : 'secondary'"
              variant="text"
              v-tooltip="isFavorite(request.id) ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'"
              @click="toggleFavorite(request.id)"
          />
          <!-- TODO: add click event -->
          <Button
              v-if="props.ownRequests"
              icon="pi pi-pen-to-square"
              variant="text"
              v-tooltip="'Auftrag bearbeiten'"
              class="ml-2"
          />
          <Button
              v-else
              icon="pi pi-check"
              variant="text"
              severity="success"
              v-tooltip="request.category === 'giveaway' ? 'Geschenk annehmen' : 'Auftrag annehmen'"
              class="ml-2"
              @click="confirmAccept(request.id)"
          />
        </span>
    </div>
  </div>
</template>