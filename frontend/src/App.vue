<script setup lang="ts">
import NavbarOrganism from "@/components/organisms/NavbarOrganism.vue";
import FooterAtom from "@/components/atoms/FooterAtom.vue";
</script>

<template>
  <NavbarOrganism/>
  <main class="flex-grow">
    <router-view />
  </main>
  <FooterAtom/>
</template>