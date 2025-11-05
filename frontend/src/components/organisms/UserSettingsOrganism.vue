<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import {useConfirm} from "primevue";

import Form from '@primevue/forms/form';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Divider from 'primevue/divider';
import ProgressBar from 'primevue/progressbar';
import Message from "primevue/message";
import InputTextMolecule from "@/components/molecules/InputTextMolecule.vue";
import TextAtom from "@/components/atoms/TextAtom.vue";
import {useRouter} from "vue-router";

const toast = useToast();
const userStore = useUserStore();
const confirm = useConfirm();
const router = useRouter();

const initialValues = computed(() => {
  if (!userStore.userInfo) return {};

  return {
    firstName: userStore.userInfo.prename,
    surname: userStore.userInfo.surname,
    street: userStore.userInfo.street,
    houseNumber: userStore.userInfo.houseNumber,
    zipCode: String(userStore.userInfo.plz),
    city: userStore.userInfo.city,
  };
});

const resolver = zodResolver(
    z.object({
      firstName: z.string().min(1, { message: 'Vorname wird benötigt.' }),
      surname: z.string().min(1, { message: 'Nachname wird benötigt.' }),
      street: z.string().min(3, { message: 'Straße ist erforderlich.' }),
      houseNumber: z.string().min(1, { message: 'Hausnummer ist erforderlich.' }),
      zipCode: z.string().regex(/^\d{5}$/, { message: 'PLZ muss 5 Ziffern haben.' }),
      city: z.string().min(2, { message: 'Ort ist erforderlich.' }),
    })
);

const confirmDeleteUser = () => {
  confirm.require({
    group: 'dialog',
    message: 'Möchtest du dein Konto wirklich löschen?',
    header: 'Konto löschen',
    icon: 'pi pi-exclamation-circle',
    rejectProps: {
      label: 'Abbrechen',
      severity: 'secondary',
      outlined: true,
      size: 'small'
    },
    acceptProps: {
      label: 'Löschen',
      severity: 'danger',
      size: 'small'
    },
    accept: async() => {
      try {
        const response = await fetch(`http://localhost:8080/user`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (response.ok) {
          toast.add({ severity: 'info', summary: 'Bestätigt', detail: 'Konto gelöscht', life: 3000 });
          await router.push('/login');
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

const onSubmit = async (e) => {
  if (!e.valid) return;

  const payload = {
    prename: e.values.firstName,
    surname: e.values.surname,
    street: e.values.street,
    houseNumber: e.values.houseNumber,
    plz: Number.parseInt(e.values.zipCode),
    city: e.values.city,
  };

  try {
    const response = await fetch('http://localhost:8080/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    if (response.ok) {
      toast.add({ severity: 'success', summary: 'Erfolg', detail: 'Daten erfolgreich geändert.', life: 3000 });
      userStore.updateUserInfoLocally({
        firstName: e.values.firstName,
        surname: e.values.surname,
        street: e.values.street,
        houseNumber: e.values.houseNumber,
        plz: Number.parseInt(e.values.zipCode),
        city: e.values.city
      });
    } else {
      const errorMessage = await response.text() || 'Änderung fehlgeschlagen.';
      toast.add({ severity: 'error', summary: 'Fehler', detail: errorMessage, life: 5000 });
    }
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Verbindungsfehler', detail: 'Server nicht erreichbar.', life: 5000 });
  }
};
</script>

<template>
  <div class="card flex flex-col items-center justify-center">
    <Toast/>
    <TextAtom tag="h1" class="text-xl font-bold mt-4 mb-4">Benutzer-Einstellungen</TextAtom>

    <div v-if="userStore.isLoading" class="flex justify-center items-center h-40">
      <ProgressBar mode="indeterminate" class="mt-4 h-2!"/>
    </div>

    <div v-else-if="userStore.userInfo">
      <Form
          v-slot="$form"
          :initialValues="initialValues"
          :resolver="resolver"
          @submit="onSubmit"
          validate-on="submit"
          novalidate
          class="flex flex-col gap-4 w-full sm:w-96"
      >
        <div class="flex gap-4">
          <InputTextMolecule :form="$form" name="firstName" label="Vorname" type="text" icon="pi pi-user" class="flex-1" autofocus/>
          <InputTextMolecule :form="$form" name="surname" label="Nachname" type="text" icon="pi pi-user" class="flex-1"/>
        </div>

        <Divider align="center" type="horizontal" class="my-5"/>

        <InputTextMolecule :form="$form" name="street" label="Straße" type="text" icon="pi pi-map"/>
        <div class="flex gap-4">
          <InputTextMolecule :form="$form" name="houseNumber" label="Haus-Nr." type="text" icon="pi pi-home" class="flex-1"/>
          <InputTextMolecule :form="$form" name="zipCode" label="PLZ" type="text" icon="pi pi-box" class="flex-1"/>
        </div>
        <InputTextMolecule :form="$form" name="city" label="Ort" type="text" icon="pi pi-globe"/>
        <Button type="submit" label="Daten ändern" />
      </Form>

      <Divider align="center" type="horizontal" class="my-5"/>

      <Button icon="pi pi-trash" label="Konto löschen" severity="danger" class="w-full"  @click="confirmDeleteUser()"/>
    </div>

    <div v-else-if="userStore.hasError" class="mt-4">
      <Message severity="error">Die Benutzerdaten konnten nicht geladen werden. Bitte versuchen Sie es später erneut.</Message>
    </div>
    <div v-else class="mt-4">
      <Message severity="error">Sie sind nicht angemeldet.</Message>
    </div>
  </div>
</template>