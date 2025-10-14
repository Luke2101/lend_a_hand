<script setup lang="ts">
import Form from '@primevue/forms/form';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useToast } from 'primevue/usetoast';
import PasswordMolecule from "@/components/molecules/PasswordMolecule.vue";
import Checkbox from "primevue/checkbox";
import InputTextMolecule from "@/components/molecules/InputTextMolecule.vue";
import Divider from "primevue/divider";
import AuthToggleMolecule from "@/components/molecules/AuthToggleMolecule.vue";
import SubtitelAtom from "@/components/atoms/SubtitelAtom.vue";


const toast = useToast();

const initialValues = {
  firstName: '',
  surname: '',
  email: '',
  password: '',
  street: '',
  houseNumber: '',
  zipCode: '',
  city: ''
};

const resolver = zodResolver(
    z.object({
      firstName: z.string().min(1, { message: 'Vorname wird benötigt.' }),
      surname: z.string().min(1, { message: 'Nachname wird benötigt.' }),
      email: z.string().email({ message: 'Ungültiges E-Mail-Format.' }).min(1, { message: 'E-Mail wird benötigt.' }),
      password: z
          .string()
          .min(4, { message: 'Muss mindestens 4 Zeichen lang sein.' })
          .max(20, { message: 'Darf maximal 20 Zeichen lang sein.' })
          .refine((value) => /[a-z]/.test(value), {
            message: 'Muss mindestens einen Kleinbuchstaben enthalten.'
          })
          .refine((value) => /[A-Z]/.test(value), {
            message: 'Muss mindestens einen Großbuchstaben enthalten.'
          })
          .refine((value) => /\d/.test(value), {
            message: 'Muss mindestens eine Ziffer enthalten.'
          }),
      street: z.string().min(3, { message: 'Straße ist erforderlich.' }),
      houseNumber: z.string().min(1, { message: 'Hausnummer ist erforderlich.' }),
      zipCode: z.string().regex(/^\d{5}$/, { message: 'Postleitzahl muss 5 Ziffern haben.' }),
      city: z.string().min(2, { message: 'Ort ist erforderlich.' }),
      accept: z.boolean().refine(val => val === true, {
        message: 'Sie müssen den AGBs zustimmen.',
      })
    })
);

const onFormSubmit = (e) => {
  if (e.valid) {
    // TODO: send to server

    toast.add({ severity: 'success', summary: 'Erfolgreich Registriert', detail: `Willkommen ${e.values.firstName}`, life: 3000 });
  }
};
</script>

<template>
  <div class="card flex flex-col items-center justify-center">
    <SubtitelAtom text="Registrieren"/>
    <Toast/>

    <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit" validate-on="submit" novalidate class="flex flex-col gap-4 w-full sm:w-96">

      <div class="flex gap-4">
        <InputTextMolecule :form="$form" name="firstName" label="Vorname" type="text" icon="pi pi-user" class="flex-1" autofocus/>

        <InputTextMolecule :form="$form" name="surname" label="Nachname" type="text" icon="pi pi-user" class="flex-1"/>
      </div>

      <InputTextMolecule :form="$form" name="email" label="E-Mail" type="email" icon="pi pi-envelope"/>

      <PasswordMolecule :form="$form" :feedback="true"/>


      <Divider align="left" type="horizontal"/>

      <InputTextMolecule :form="$form" name="street" label="Straße" type="text" icon="pi pi-map"/>

      <div class="flex gap-4">
        <InputTextMolecule :form="$form" name="houseNumber" label="Haus-Nr." type="text" icon="pi pi-home" class="flex-1"/>
        <InputTextMolecule :form="$form" name="zipCode" label="PLZ" type="text" icon="pi pi-box" class="flex-1"/>
      </div>

      <InputTextMolecule :form="$form" name="city" label="Ort" type="text" icon="pi pi-globe"/>




      <div class="flex items-center gap-2">
        <Checkbox id="accept" name="accept" :binary="true" />
        <label for="accept">Ich stimme den Allgemeinen Geschäftsbedingungen zu.</label>
      </div>

      <Button type="submit" label="Registrieren" />
    </Form>

    <AuthToggleMolecule
        question="Du hast bereits ein Konto?"
        link-text="Anmelden"
        to="/login"
    />
  </div>
</template>

<style scoped>

</style>