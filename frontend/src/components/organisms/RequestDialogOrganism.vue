<script setup>
import Dialog from 'primevue/dialog';
import Form from "@primevue/forms/form";
import InputTextMolecule from "@/components/molecules/InputTextMolecule.vue";
import Button from "primevue/button";
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
import {ref} from "vue";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import SelectButton from 'primevue/selectbutton';
import FloatLabel from "primevue/floatlabel";

const categories = ref([
  { name: 'Ausleihen', code: 'rent' },
  { name: 'Hilfe', code: 'help' },
  { name: 'zu\xa0verschenken', code: 'giveaway' },
]);
</script>

<template>
  <Dialog modal header="Anfrage erstellen" :style="{ width: '36rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Erstelle eine Anfrage.</span>
    <Form
        v-slot="$form"
        :initialValues="initialValues"
        :resolver="resolver"
        @submit="onSubmit"
        validate-on="submit"
        novalidate
    >
      <InputTextMolecule :form="$form" name="firstName" label="Titel" type="text" class="flex-1 mb-4" autofocus/>

      <div class="flex gap-4 mb-4 w-full">
        <SelectButton name="categories.name" optionLabel="name" :options="categories"/>
        <FloatLabel variant="on">
          <IconField iconPosition="left">
            <InputIcon>
              <i class="pi pi-dollar" />
            </InputIcon>
            <InputNumber
                name="coins2"
                inputId="coins2"
                showButtons
                :min="0"
                :max="20"
                fluid
            />
            <label for="coins2">{{ "Belohnungspunkte" }}</label>
          </IconField>
        </FloatLabel>
      </div>

      <FloatLabel variant="on">
          <Textarea
              name="describtion"
              rows="5"
              label="Beschreibung"
              class="mb-4"
              fluid
          />
          <label for="describtion">{{ "Beschreibung" }}</label>
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