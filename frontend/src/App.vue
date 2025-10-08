<script setup>
import NavbarOrganism from "@/components/organisms/NavbarOrganism.vue";
</script>

<template>
  <NavbarOrganism/>

  <main>
    <router-view />
  </main>
</template>

<style>
#app{
  width: 100%;
}
</style>