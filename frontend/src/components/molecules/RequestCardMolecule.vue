<script setup lang="ts">
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import ConfettiExplosion from "vue-confetti-explosion";

import type { Request } from '@/types/Request.interface';
import { nextTick, ref, onMounted } from 'vue';

import rent from '@/assets/rent.jpeg';
import help from '@/assets/help.jpg';
import giveaway from '@/assets/giveaway.jpeg';

interface UserInfo {
  prename: string;
  email: string;
}

const props = defineProps<{
  request: Request;
  isOwnRequest: boolean;
  formatDateTime : (iso: string | undefined) => string;
  getSeverity: (category: string) => 'info' | 'success' | 'warn' | null;
  getCategoryName: (category: string) => string | null;
  isFavorite: (requestId: number) => boolean;
  toggleFavorite: (requestId: number) => Promise<void>;
  confirmEdit: (request: Request) => void;
  confirmDelete: (event: MouseEvent, requestId: number) => void;
  confirmAccept: (requestId: number, successCallback: () => void) => void;
  confirmFinish: (requestId: number) => void;
}>();

const images = { rent, help, giveaway };

const acceptedByUser = ref<UserInfo | null>(null);
const showConfetti = ref(false);

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

const triggerAccept = () => {
  props.confirmAccept(props.request.id, () => {
    showConfetti.value = false;
    nextTick(() => {
      showConfetti.value = true;
    });
  });
};
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
        v-if="request.accepted_by && acceptedByUser && isOwnRequest"
        icon="pi pi-check" :label="acceptedByUser.prename"
        v-tooltip.bottom="'Anfrage wurde von ' + acceptedByUser.prename + ' (' + acceptedByUser.email +') angenommen.'"
        severity="success"
        variant="outlined"
        size="small"
        @click="confirmFinish(request.id)"
    />
    <div class="mb-1 mt-2 text-lg font-semibold flex justify-between">
      {{ request.title }}
      <Tag
          v-if="!props.isOwnRequest"
          icon="pi pi-map-marker"
          v-tooltip.bottom="request.city"
          :value="request.plz"
          class="ml-2"
      />
    </div>
    <div v-if="!props.isOwnRequest">
      <i class="pi pi-user mr-2 mb-2"/>
      {{ request.prename }}
    </div>
    <div v-if="request.from && request.to" class="text-sm text-surface-500 dark:text-surface-400 mb-1">
      {{ formatDateTime(request.from) }} – {{ formatDateTime(request.to)}}
    </div>
    <p
        class="text-sm text-surface-600 dark:text-surface-300 max-w-[22rem] line-clamp-2 mb-4 break-words"
        v-tooltip.bottom="{
      value: request.description,
      pt:{root:{style:{maxWidth: '24rem'}}},
      autoHide: false,
      showDelay: 500,
      hideDelay: 200
    }"
    >
      {{ request.description || 'Keine Beschreibung vorhanden.' }}
    </p>

    <div class="flex justify-between items-center mt-auto">
      <div
          class="mt-0 font-semibold text-xl flex items-center"
          v-tooltip.bottom="request.category === 'giveaway' ? 'Dies ist ein Geschenk' : 'Für diesen Auftrag bekommen Sie ' + request.credits + ' Punkte.'"
      >
        <i class="pi pi-crown mr-2 text-primary"></i> {{ request.credits }}
      </div>
      <span>
          <Button
              v-if="props.isOwnRequest"
              icon="pi pi-trash"
              severity="danger"
              variant="text"
              v-tooltip.bottom="'Auftrag löschen'"
              @click="confirmDelete($event, request.id)"
          />
          <Button
              v-else
              :icon="isFavorite(request.id) ? 'pi pi-heart-fill' : 'pi pi-heart'"
              :severity="isFavorite(request.id) ? 'danger' : 'secondary'"
              variant="text"
              v-tooltip.bottom="isFavorite(request.id) ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'"
              @click="toggleFavorite(request.id)"
          />
          <Button
              v-if="props.isOwnRequest"
              icon="pi pi-pen-to-square"
              variant="text"
              v-tooltip.bottom="'Auftrag bearbeiten'"
              class="ml-2"
              @click="confirmEdit(request)"
          />
          <Button
              v-else
              :disabled="!!request.accepted_by"
              icon="pi pi-check"
              variant="text"
              :severity="!request.accepted_by ? 'success' : 'secondary'"
              v-tooltip.bottom="!request.accepted_by ? (request.category === 'giveaway' ? 'Geschenk annehmen' : 'Auftrag annehmen') : 'Auftrag wurde bereits angenommen'"
              class="ml-2"
              @click="triggerAccept()"
          />
          <ConfettiExplosion
              v-if="showConfetti"
              :particleCount="250"
              :force="0.7"
              :stageHeight="1700"
              :colors="['#000000', '#4e4e4e', '#aaaaaa', '#ffffff']"
          />
        </span>
    </div>
  </div>
</template>