<script setup lang="ts">
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import {useRouter} from 'vue-router';

import Form from '@primevue/forms/form';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import PasswordMolecule from "@/components/molecules/PasswordMolecule.vue";
import Checkbox from "primevue/checkbox";
import InputTextMolecule from "@/components/molecules/InputTextMolecule.vue";
import Divider from "primevue/divider";
import AuthToggleMolecule from "@/components/molecules/AuthToggleMolecule.vue";
import TextAtom from "@/components/atoms/TextAtom.vue";

const router = useRouter();

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

const onFormSubmit = async (e) => {
  if (e.valid) {
    try {
      const response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prename: e.values.firstName,
          surname: e.values.surname,
          email: e.values.email,
          password: e.values.password,
          street: e.values.street,
          houseNumber: e.values.houseNumber,
          plz:  Number.parseInt(e.values.zipCode),
          city: e.values.city,
        }),
      });

      if (response.ok) {
        toast.add({ severity: 'success', summary: 'Erfolgreich Registriert', detail: `Willkommen ${e.values.firstName}`, life: 3000 });
        await router.push('/login');
      } else {
        const errorData = await response.text();
        console.log(errorData);
        const errorMessage0 = errorData || 'Registrierung fehlgeschlagen.';
        toast.add({ severity: 'error', summary: 'Fehler', detail: errorMessage0, life: 5000 });
      }
    } catch (error) {
      console.error("Registrierungsfehler:", error);
      toast.add({ severity: 'error', summary: 'Verbindungsfehler', detail: 'Server nicht erreichbar oder unerwarteter Fehler.', life: 5000 });
    }
  }
};
</script>

<template>
  <div class="card flex flex-col items-center justify-center">
    <TextAtom tag="h1" class="text-xl font-bold mt-4 mb-4">Registrieren</TextAtom>
    <Toast/>

    <Form
        v-slot="form"
        :initialValues
        :resolver
        @submit="onFormSubmit"
        :validateOnValueUpdate="false"
        :validateOnBlur="true"
        class="flex flex-col gap-4 w-full sm:w-96"
    >
      <div class="flex gap-4">
        <InputTextMolecule :form="form" name="firstName" label="Vorname" type="text" icon="pi pi-user" class="flex-1" autofocus/>

        <InputTextMolecule :form="form" name="surname" label="Nachname" type="text" icon="pi pi-user" class="flex-1"/>
      </div>

      <InputTextMolecule :form="form" name="email" label="E-Mail" type="email" icon="pi pi-envelope"/>

      <PasswordMolecule :form="form" :feedback="true"/>


      <Divider align="left" type="horizontal"/>

      <InputTextMolecule :form="form" name="street" label="Straße" type="text" icon="pi pi-map"/>

      <div class="flex gap-4">
        <InputTextMolecule :form="form" name="houseNumber" label="Haus-Nr." type="text" icon="pi pi-home" class="flex-1"/>
        <InputTextMolecule :form="form" name="zipCode" label="PLZ" type="text" icon="pi pi-box" class="flex-1"/>
      </div>

      <InputTextMolecule :form="form" name="city" label="Ort" type="text" icon="pi pi-globe"/>

      <div class="flex gap-2">
        <Checkbox id="accept" name="accept" :binary="true" class="mt-1" />
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