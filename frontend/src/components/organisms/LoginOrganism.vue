<script setup lang="ts">
import Form from '@primevue/forms/form';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

import { useToast } from 'primevue/usetoast';
import PasswordMolecule from "@/components/molecules/PasswordMolecule.vue";
import InputTextMolecule from "@/components/molecules/InputTextMolecule.vue";
import AuthToggleMolecule from "@/components/molecules/AuthToggleMolecule.vue";
import SubtitelAtom from "@/components/atoms/SubtitelAtom.vue";
import {zodResolver} from "@primevue/forms/resolvers/zod";
import {z} from "zod";

const toast = useToast();

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

const onFormSubmit = (e) => {
  // TODO: send to server

  toast.add({ severity: 'success', summary: 'Erfolgreich Angemeldet', detail: `Willkommen ${e.values.username}`, life: 3000 });
};
</script>

<template>
  <div class="card flex flex-col items-center justify-center">
    <SubtitelAtom text="Anmelden"/>
    <Toast/>

    <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit" validate-on="submit" novalidate class="flex flex-col gap-4 w-full sm:w-96">
      <InputTextMolecule :form="$form" name="email" label="E-Mail" type="email" icon="pi pi-envelope" autofocus/>

      <PasswordMolecule :form="$form" :feedback="false"/>

      <Button type="submit" label="Anmelden" />
    </Form>

    <AuthToggleMolecule
        question="Noch kein Konto?"
        link-text="Registrieren"
        to="/signup"
    />
  </div>
</template>

<style scoped>

</style>