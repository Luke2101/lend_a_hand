<script setup lang="ts">
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import FloatLabel from 'primevue/floatlabel';

const props = defineProps<{
  form: any;
  name: string;
  label: string;
  type: string;
  icon?: string;
  autofocus?: boolean;
}>();

// Erzeugt eine eindeutige ID für die Verknüpfung von Input und Label
const inputId = `input-${props.name}-${Math.random().toString(36).substring(7)}`;
</script>

<template>
  <div class="flex flex-col gap-1">
    <FloatLabel variant="on">
      <IconField :iconPosition="icon ? 'left' : undefined">

        <InputIcon v-if="icon">
          <i :class="icon" />
        </InputIcon>

        <InputText
            :inputId="inputId"
            :name="name"
            :type="type"
            :autofocus="autofocus"
            fluid
        />
        <label :for="inputId">{{ label }}</label>
      </IconField>
    </FloatLabel>

    <Message
        v-if="form[name]?.invalid"
        severity="error"
        size="small"
        variant="simple"
    >
      {{ form[name]?.error?.message }}
    </Message>
  </div>
</template>