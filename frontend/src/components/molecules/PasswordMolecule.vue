<script setup lang="ts">
import Divider from "primevue/divider";
import Password from "primevue/password";
import Message from "primevue/message";
import FloatLabel from "primevue/floatlabel";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";

defineProps<{
  form: any;
  feedback: boolean;
}>();
</script>

<template>
  <div class="flex flex-col gap-1">
    <FloatLabel variant="on">
      <IconField iconPosition="left">
        <InputIcon>
          <i class="pi pi-lock" />
        </InputIcon>

        <Password
            inputId="password_input"
            name="password"
            toggleMask
            fluid
            promptLabel="Bitte gib dein Passwort ein"
            weakLabel="Das geht besser.."
            mediumLabel="Joa, ganz okay"
            strongLabel="Wow, Glückwunsch!"
            :feedback="feedback"
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
      </IconField>
    </FloatLabel>
    <Message
        v-if="form.password?.invalid"
        severity="error"
        size="small"
        variant="simple"
    >
      <ul class="my-0 px-4 flex flex-col gap-1">
        <li v-for="(error, index) of form.password.errors" :key="index">{{ error.message }}</li>
      </ul>
    </Message>
  </div>
</template>