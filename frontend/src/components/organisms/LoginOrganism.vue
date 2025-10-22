<script setup lang="ts">
import Form from '@primevue/forms/form';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

import { useToast } from 'primevue/usetoast';
import PasswordMolecule from "@/components/molecules/PasswordMolecule.vue";
import InputTextMolecule from "@/components/molecules/InputTextMolecule.vue";
import AuthToggleMolecule from "@/components/molecules/AuthToggleMolecule.vue";
import TextAtom from "@/components/atoms/TextAtom.vue";
import {zodResolver} from "@primevue/forms/resolvers/zod";
import {z} from "zod";
import {useRouter} from 'vue-router';
import {useAuth} from "@/composables/useAuth";

const router = useRouter();

const toast = useToast();

const { setLoggedIn } = useAuth();

const initialValues = {
  email: '',
  password: ''
};

const resolver = zodResolver(
    z.object({
      email: z.string().email({ message: 'Ungültiges E-Mail-Format.' }).min(1, { message: 'E-Mail wird benötigt.' }),
      password: z.string().min(1, { message: 'Bitte gib ein Passwort ein.' })
    })
);

const onFormSubmit = async (e) => {
  if (e.valid) {
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: e.values.email,
          password: e.values.password,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        setLoggedIn(true);
        toast.add({ severity: 'success', summary: 'Erfolgreich Angemeldet', detail: `Anmeldung erfolgreich.`, life: 3000 });
        await router.push('/marketplace');
      } else {
        const errorData = await response.text();
        let errorMessage = errorData || 'Überprüfe E-Mail und Passwort.';
        if (errorData == "INVALID_EMAIL_OR_PASSWORD") errorMessage = "Überprüfe E-Mail und Passwort.";
        toast.add({ severity: 'error', summary: 'Anmeldung fehlgeschlagen', detail: errorMessage, life: 5000 });
      }
    } catch (error) {
      console.error("Anmeldefehler:", error);
      toast.add({ severity: 'error', summary: 'Verbindungsfehler', detail: 'Server nicht erreichbar oder unerwarteter Fehler.', life: 5000 });
    }
  }
};
</script>

<template>
  <div class="card flex flex-col items-center justify-center">
    <TextAtom tag="h1" class="text-xl font-bold mt-4 mb-4">Anmelden</TextAtom>
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
      <InputTextMolecule :form="form" name="email" label="E-Mail" type="email" icon="pi pi-envelope" autofocus/>

      <PasswordMolecule :form="form" :feedback="false"/>

      <Button type="submit" label="Anmelden" />
    </Form>

    <AuthToggleMolecule
        question="Noch kein Konto?"
        link-text="Registrieren"
        to="/signup"
    />
  </div>
</template>