<script setup lang="ts">
import Tag from 'primevue/tag';
import Button from 'primevue/button';

import type { Request } from '@/types/Request.interface';

import rent from '@/assets/rent.jpeg';
import help from '@/assets/help.jpg';
import giveaway from '@/assets/giveaway.jpeg';

const props = defineProps<{
  request: Request;
  ownRequests: boolean;
  formatDate: (iso: string | undefined) => string;
  getSeverity: (category: string) => 'info' | 'success' | 'warn' | null;
  getCategoryName: (category: string) => string | null;
  isFavorite: (requestId: number) => boolean;
  toggleFavorite: (requestId: number) => Promise<void>;
  confirmDelete: (event: MouseEvent, requestId: number) => void;
}>();

const images = { rent, help, giveaway };
</script>

<template>
  <div class="border border-surface-200 dark:border-surface-700 rounded m-2 p-4 min-h-[26rem] flex flex-col justify-between">
    <div class="mb-4">
      <div class="relative mx-auto">
        <img :src="images[request.category]" :alt="request.category" class="w-full h-48 rounded object-cover"/>
        <Tag :value="getCategoryName(request.category)" :severity="getSeverity(request.category)" class="absolute" style="left:5px; top: 5px"/>
      </div>
    </div>

    <div class="mb-2 font-bold">{{ request.title }}</div>
    <div v-if="request.from && request.to" class="text-sm text-surface-500 dark:text-surface-400 mb-2">
      {{ formatDate(request.from) }} – {{ formatDate(request.to) }}
    </div>
    <p class="text-sm text-surface-600 dark:text-surface-300 max-w-[22rem] line-clamp-2 mb-4 break-words">{{ request.description || 'Keine Beschreibung vorhanden.' }}</p>

    <div class="flex justify-between items-center mt-auto">
      <div class="mt-0 font-semibold text-xl flex items-center">
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
          />
        </span>
    </div>
  </div>
</template>