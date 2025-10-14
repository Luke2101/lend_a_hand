<script setup lang="ts">
import Form from '@primevue/forms/form';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Divider from 'primevue/divider';

import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useToast } from 'primevue/usetoast';
import InputTextMolecule from "@/components/molecules/InputTextMolecule.vue";
import TextAtom from "@/components/atoms/TextAtom.vue";

const toast = useToast();

// TODO: load via API call
const initialValuesName = {
  firstName: 'Max',
  surname: 'Mustermann',
};

const initialValuesAddress = {
  street: 'Musterstraße',
  houseNumber: '1A',
  zipCode: '12345',
  city: 'Musterstadt',
};


const resolverName = zodResolver(
    z.object({
      firstName: z.string().min(1, { message: 'Vorname wird benötigt.' }),
      surname: z.string().min(1, { message: 'Nachname wird benötigt.' }),
    })
);

const resolverAddress = zodResolver(
    z.object({
      street: z.string().min(3, { message: 'Straße ist erforderlich.' }),
      houseNumber: z.string().min(1, { message: 'Hausnummer ist erforderlich.' }),
      zipCode: z.string().regex(/^\d{5}$/, { message: 'PLZ muss 5 Ziffern haben.' }),
      city: z.string().min(2, { message: 'Ort ist erforderlich.' }),
    })
);


const onNameSubmit = async (e) => {
  if (!e.valid) return;

  const payload = {
    prename: e.values.firstName, // Umbenennung für Backend-Kompatibilität
    surname: e.values.surname,
  };

  try {
    const response = await fetch('http://localhost:8080/users/update/name', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    if (response.ok) {
      toast.add({ severity: 'success', summary: 'Erfolg', detail: 'Name erfolgreich geändert.', life: 3000 });
      // TODO: update local data or global state
    } else {
      const errorMessage = await response.text() || 'Namensänderung fehlgeschlagen.';
      toast.add({ severity: 'error', summary: 'Fehler', detail: errorMessage, life: 5000 });
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Verbindungsfehler', detail: 'Server nicht erreichbar.', life: 5000 });
  }
};


const onAddressSubmit = async (e) => {
  if (!e.valid) return;

  const payload = {
    street: e.values.street,
    houseNumber: e.values.houseNumber,
    plz: Number.parseInt(e.values.zipCode), // Konvertierung von String zu Number
    city: e.values.city,
  };

  try {
    const response = await fetch('http://localhost:8080/users/update/address', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    if (response.ok) {
      toast.add({ severity: 'success', summary: 'Erfolg', detail: 'Adresse erfolgreich geändert.', life: 3000 });
      // TODO: update local data or global state
    } else {
      const errorMessage = await response.text() || 'Adressänderung fehlgeschlagen.';
      toast.add({ severity: 'error', summary: 'Fehler', detail: errorMessage, life: 5000 });
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Verbindungsfehler', detail: 'Server nicht erreichbar.', life: 5000 });
  }
};
</script>

<template>
  <div class="card flex flex-col items-center justify-center">
    <Toast/>
    <div class="w-full sm:w-96">
      <TextAtom tag="h1" class="text-xl font-semibold mt-4">Benutzer-Einstellungen</TextAtom>
      <Form
          v-slot="$form"
          :initialValues="initialValuesName"
          :resolver="resolverName"
          @submit="onNameSubmit"
          validate-on="submit"
          novalidate
          class="flex flex-col gap-4 w-full"
      >
        <TextAtom tag="h2" class="text-base font-medium">Name</TextAtom>
        <div class="flex gap-4">
          <InputTextMolecule :form="$form" name="firstName" label="Vorname" type="text" icon="pi pi-user" class="flex-1" autofocus/>
          <InputTextMolecule :form="$form" name="surname" label="Nachname" type="text" icon="pi pi-user" class="flex-1"/>
        </div>
        <Button type="submit" label="Name ändern" />
      </Form>

      <Divider align="center" type="horizontal" class="my-5"/>

      <Form
          v-slot="$form"
          :initialValues="initialValuesAddress"
          :resolver="resolverAddress"
          @submit="onAddressSubmit"
          validate-on="submit"
          novalidate
          class="flex flex-col gap-4 w-full"
      >
        <TextAtom tag="h2" class="text-base font-medium">Adresse</TextAtom>
        <InputTextMolecule :form="$form" name="street" label="Straße" type="text" icon="pi pi-map"/>
        <div class="flex gap-4">
          <InputTextMolecule :form="$form" name="houseNumber" label="Haus-Nr." type="text" icon="pi pi-home" class="flex-1"/>
          <InputTextMolecule :form="$form" name="zipCode" label="PLZ" type="text" icon="pi pi-box" class="flex-1"/>
        </div>
        <InputTextMolecule :form="$form" name="city" label="Ort" type="text" icon="pi pi-globe"/>
        <Button type="submit" label="Adresse ändern" />
      </Form>
    </div>
  </div>
</template>

<style scoped>

</style>