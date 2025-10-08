<script setup lang="ts">
import Password from 'primevue/password';
import Form from '@primevue/forms/form';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';
import Toast from 'primevue/toast';
import Divider from 'primevue/divider';
import FloatLabel from 'primevue/floatlabel';

import { ref } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const initialValues = ref({
  username: '',
  password: ''
});

const resolver = zodResolver(
    z.object({
      username: z.string().min(1, { message: 'Username is required.' }),
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
          })
    })
);

const onFormSubmit = (e) => {
  if (e.valid) {
    // TODO: send to server

    toast.add({ severity: 'success', summary: 'Erfolgreich Registriert', detail: `Willkommen ${e.values.username}`, life: 3000 });
  }
};
</script>

<template>
  <div class="card flex justify-center">
    <Toast/>

    <Form v-slot="$form" :initialValues :resolver validate-on="submit" @submit="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-60">
      <div class="flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputText inputId="username_input" name="username" type="text" fluid />
          <label for="username_input">Name</label>
        </FloatLabel>
        <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{ $form.username.error.message }}</Message>
      </div>

      <div class="flex flex-col gap-1">
        <!--        <Password name="password" placeholder="Password" :feedback="false" toggleMask fluid />-->
        <!--        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">-->
        <!--          <ul class="my-0 px-4 flex flex-col gap-1">-->
        <!--            <li v-for="(error, index) of $form.password.errors" :key="index">{{ error.message }}</li>-->
        <!--          </ul>-->
        <!--        </Message>-->

        <FloatLabel variant="on">
          <Password
              inputId="password_input"
              name="password"
              toggleMask
              fluid
              promptLabel="Bitte gib dein Passwort ein"
              weakLabel="Das geht besser.."
              mediumLabel="Joa, ganz okay"
              strongLabel="Wow, Glückwunsch!"
          >
            <template #footer>
              <Divider />
              <ul class="pl-2 my-0 leading-normal text-sm">
                <li>Mindestens 4 Zeichen</li>
                <li>Mindestens ein Kleinbuchstabe</li>
                <li>Mindestens ein Großbuchstabe</li>
                <li>Mindestens eine Ziffer</li>
              </ul>
            </template>
          </Password>
          <label for="password_input">Passwort</label>
        </FloatLabel>
        <Message
            v-if="$form.password?.invalid"
            severity="error"
            size="small"
            variant="simple"
        >
          <ul class="my-0 px-4 flex flex-col gap-1">
            <li v-for="(error, index) of $form.password.errors" :key="index">{{ error.message }}</li>
          </ul>
        </Message>

      </div>
      <Button type="submit" label="Registrieren" />
    </Form>
  </div>
</template>

<style scoped>

</style>