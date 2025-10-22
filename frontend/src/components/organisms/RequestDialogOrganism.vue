<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import type { ZodType } from "zod";
import type { FormSubmitEvent } from "@primevue/forms";

import Dialog from 'primevue/dialog';
import Form from "@primevue/forms/form";
import InputTextMolecule from "@/components/molecules/InputTextMolecule.vue";
import Button from "primevue/button";
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import SelectButton from 'primevue/selectbutton';
import FloatLabel from "primevue/floatlabel";
import DatePicker from "primevue/datepicker"
import {useToast} from "primevue/usetoast";
import Message from "primevue/message";

interface Category {
  name: string;
  code: string;
}

interface FormValues {
  title: string;
  category: Category | undefined;
  description: string;
  credits: number;
  startDate: Date | null;
  endDate: Date | null;
}

const categories = ref<Category[]>([
  { name: 'Ausleihen', code: 'rent' },
  { name: 'Hilfe', code: 'help' },
  { name: 'zu\xa0verschenken', code: 'giveaway' },
]);

const initialValues: FormValues = {
  title: '',
  category: categories.value[0],
  description: '',
  credits: 0,
  startDate: null,
  endDate: null,
};

const formSchema = z.object({
  title: z.string().min(3, { message: 'Der Titel muss mindestens 3 Zeichen lang sein.' }),
  category: z.object({
    name: z.string(),
    code: z.string(),
  }, {
    message: 'Bitte wähle eine Kategorie.'
  }),
  credits: z.number({
    message: 'Belohnungspunkte werden benötigt.'
  }).min(1, {message: 'Die Belohnung muss mindestens 1 Punkt betragen.' }),
  startDate: z.date({
    message: 'Ungültiges Startdatum.',
  }).nullable(),
  endDate: z.date({
    message: 'Ungültiges Enddatum.'
  }).nullable(),
  description: z.string().optional(),
})
    .superRefine((data, ctx) => {
  const startDate = data.startDate;
  const endDate = data.endDate;

      // Prüfen, ob die Kategorie 'rent' (Ausleihen) oder 'help' (Hilfe) ist.
      const isDateRequired = data.category && (data.category.code === 'rent' || data.category.code === 'help');

      if (isDateRequired) {
        if (!data.startDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Ein Startdatum ist bei dieser Kategorie zwingend erforderlich.',
            path: ['startDate'],
          });
        }
        if (!data.endDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Ein Enddatum ist bei dieser Kategorie zwingend erforderlich.',
            path: ['endDate'],
          });
        }
        if (data.startDate && data.endDate && data.endDate < data.startDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Das Enddatum darf nicht vor dem Startdatum liegen.',
            path: ['endDate'],
          });
        }
      }
});

const resolver = zodResolver(formSchema as ZodType<FormValues>);

const toast = useToast();

const toIsoString = (date: Date): string => {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
};

const onSubmit = async (event: FormSubmitEvent<FormValues>) => {
  const values = event.values;
  console.log('Formular erfolgreich übermittelt. Daten:');
  console.log(values);

  if (!values.startDate || !values.endDate || !values.category) {
    toast.add({ severity: 'error', summary: 'Fehler', detail: 'Formulardaten unvollständig.', life: 3000 });
    return;
  }

  const payload = {
    title: values.title,
    category: values.category.code,
    credits: values.credits,
    description: values.description,
    from: toIsoString(values.startDate),
    to: toIsoString(values.endDate),
  };

  try {
    const response = await fetch('http://localhost:8080/request/create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    const data = await response.json();

    if (response.ok) {
      toast.add({severity: 'success', summary: 'Erfolg', detail: data.message || 'Anfrage erfolgreich erstellt.', life: 3000});
      // TODO: Dialog schließen oder Zustand zurücksetzen
      console.log('API-Antwort (201):', data);
    } else if (response.status === 403) {
      toast.add({
        severity: 'warn',
        summary: 'Limit erreicht',
        detail: 'Sie haben das maximale Limit an ausstehenden Anfragen (5) erreicht.',
        life: 5000
      });
      console.error('API-Fehler (403):', data.message);
    } else {
      toast.add({
        severity: 'error',
        summary: 'Fehler',
        detail: data.message || 'Beim Erstellen der Anfrage ist ein unerwarteter Fehler aufgetreten.',
        life: 5000
      });
      console.error(`API-Fehler (${response.status}):`, data);
    }
  } catch (error) {
    console.error('Netzwerkfehler beim API-Aufruf:', error);
    toast.add({
      severity: 'error',
      summary: 'Netzwerkfehler',
      detail: 'Die Verbindung zur API konnte nicht hergestellt werden.',
      life: 5000
    });
  }
}
</script>

<template>
  <Dialog modal header="Anfrage erstellen" :style="{ width: '36rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Erstelle eine neue Anfrage.</span>
    <Form
        v-slot="form"
        :initialValues="initialValues"
        :resolver="resolver"
        @submit="onSubmit"
        :validateOnValueUpdate="false"
        :validateOnBlur="true"
    >
      <InputTextMolecule :form="form" name="title" label="Titel" type="text" class="flex-1 mb-4" autofocus/>

      <div class="flex gap-4 mb-4 w-full">
        <SelectButton
            :form="form"
            name="category"
            optionLabel="name"
            :options="categories"
            :allowEmpty="false"
            class="flex-1"
        /><Message v-if="form.category?.invalid" severity="error" size="small" variant="simple">{{ form.category.error.message }}</Message>
        <div>
          <FloatLabel variant="on" class="flex-1">
            <IconField iconPosition="left">
              <InputIcon>
                <i class="pi pi-dollar" />
              </InputIcon>
              <InputNumber
                  :form="form"
                  name="credits"
                  inputId="credits"
                  showButtons
                  :min="1"
                  :max="20"
                  fluid
              />
              <label for="credits">Belohnungspunkte</label>
            </IconField>
          </FloatLabel>
          <Message
              v-if="form.credits?.invalid"
              severity="error"
              size="small"
              variant="simple"
          >
            {{ form.credits.error.message }}
          </Message>
        </div>
      </div>

      <div v-if="form.category?.value?.code === 'rent' || form.category?.value?.code === 'help'" class="flex items-center gap-4 mb-4">
        <div>
          <FloatLabel variant="on" class="flex-1">
            <DatePicker
                :form="form"
                name="startDate"
                dateFormat="dd.mm.yy"
                inputId="startDate"
                showButtonBar
                showIcon
                iconDisplay="input"
                showTime
                hourFormat="24"
                fluid
            />
            <label for="startDate">Startdatum</label>
          </FloatLabel>
          <Message
              v-if="form.startDate?.invalid"
              severity="error"
              size="small"
              variant="simple"
              class="mt-1"
          >
            {{ form.startDate.error.message }}
          </Message>
        </div>
        <p class="text-surface-500 dark:text-surface-400">bis</p>
        <div>
          <FloatLabel variant="on" class="flex-1">
            <DatePicker
                :form="form"
                name="endDate"
                dateFormat="dd.mm.yy"
                inputId="endDate"
                showButtonBar
                showIcon
                iconDisplay="input"
                showTime
                hourFormat="24"
                fluid
            />
            <label for="endDate">Enddatum</label>
          </FloatLabel>
          <Message
              v-if="form.endDate?.invalid"
              severity="error"
              size="small"
              variant="simple"
              class="mt-1"
          >
            {{ form.endDate.error.message }}
          </Message>
        </div>
      </div>

      <FloatLabel variant="on">
          <Textarea
              name="description"
              rows="5"
              class="mb-4"
              fluid
          />
          <label for="description">Beschreibung</label>
      </FloatLabel>

      <div class="flex justify-end gap-2">
        <Button type="button" label="Abbrechen" severity="secondary"/>
        <Button type="submit" label="Anfrage erstellen" />
      </div>
    </Form>
  </Dialog>
</template>

<style scoped>

</style>