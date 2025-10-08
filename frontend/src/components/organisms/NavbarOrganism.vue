<script setup>
import Menubar from 'primevue/menubar';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';


import { ref } from "vue";

const isLoggedIn = ref(false)

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    route: '/home'
  },
  {
    label: 'Marketplace',
    icon: 'pi pi-th-large',
    route: '/marketplace'
  }
]);
</script>

<template>
  <div class="card">
    <Menubar :model="items">
      <template #start>
        <img style="height: 40px; margin-right: 20px;" class="h-10" src="/frontend/src/assets/logo.png" alt="Logo"/>
      </template>

      <template #item="{ item, props, hasSubmenu }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
          <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
        </a>
      </template>

      <template #end>
        <div class="flex items-center gap-2">
          <div v-if="!isLoggedIn" class="flex items-center gap-2">
            <router-link to="/signup" custom v-slot="{ navigate }">
              <Button
                  label="Registrieren"
                  @click="navigate"
              />
            </router-link>

            <router-link to="/login" custom v-slot="{ navigate }">
              <Button
                  label="Anmelden"
                  severity="secondary"
                  @click="navigate"
              />
            </router-link>
          </div>
          <div v-else>
            <Avatar icon="pi pi-user" shape="circle" />
          </div>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
}
</style>