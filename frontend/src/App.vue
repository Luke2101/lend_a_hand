<script setup lang="ts">
import NavbarOrganism from "@/components/organisms/NavbarOrganism.vue";
import FooterAtom from "@/components/atoms/FooterAtom.vue";
import ConfirmDialog from "primevue/confirmdialog";
import ConfirmPopup from "primevue/confirmpopup";
</script>

<template>
  <ConfirmPopup group="popup"/>
  <ConfirmDialog group="dialog" class="max-w-[28rem]"/>
  <NavbarOrganism/>
  <main class="flex-grow">
    <router-view />
  </main>
  <FooterAtom/>
</template>