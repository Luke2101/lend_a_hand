<script setup lang="ts">
import Menubar from 'primevue/menubar';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import Toast from 'primevue/toast';

import { ref, computed } from "vue";
import { useAuth } from '@/composables/useAuth';
import router from "@/router/index.js";
import {useToast} from "primevue/usetoast";
import {useUserStore} from "@/stores/user";

const toast = useToast();
const userStore = useUserStore();
const { isLoggedIn, setLoggedIn } = useAuth();

const avatarLabel = computed(() => {
  if (userStore.userInfo && userStore.userInfo.prename && userStore.userInfo.surname) {
    const firstInitial = userStore.userInfo.prename.charAt(0).toUpperCase();
    const lastInitial = userStore.userInfo.surname.charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  }
  return null;
});

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

const op = ref();

const toggle = (event) => {
  op.value.toggle(event);
}

async function logout() {
  try {
    const response = await fetch('http://localhost:8080/user/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (response.ok) {
      setLoggedIn(false);
      await router.push('/login');
    } else {
      let errorMessage = 'Ihre Sitzung konnte auf dem Server nicht beendet werden. Bitte löschen Sie Ihren Browser-Cache und alle Cookies, um sicherzustellen, dass Sie abgemeldet sind.';
      toast.add({severity: 'error', summary: 'Abmeldung war nicht erfolgreich', detail: errorMessage, life: 5000});
    }
  } catch (error) {
    console.error("Abmeldefehler:", error);
    toast.add({
      severity: 'error',
      summary: 'Verbindungsfehler',
      detail: 'Server nicht erreichbar oder unerwarteter Fehler.',
      life: 5000
    });
  }
}
</script>

<template>
  <Toast/>
  <div class="card mt-4">
    <Menubar :model="items">
      <template #start>
        <div class="app-logo"></div>
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
            <template v-if="avatarLabel">
              <Avatar :label="avatarLabel" shape="circle" class="avatar" @click="toggle" />
            </template>
            <template v-else>
              <Avatar icon="pi pi-user" shape="circle" class="avatar" @click="toggle" />
            </template>
            <Popover ref="op">
              <div class="flex flex-col gap-4">
                <div v-if="userStore.userInfo" class="font-semibold text-lg pb-2 border-b border-surface-200 dark:border-surface-700">
                  {{ userStore.userInfo.prename }} {{ userStore.userInfo.surname }}
                </div>
                <router-link to="/user" custom v-slot="{ navigate }">
                  <Button label="Bearbeiten" icon="pi pi-pen-to-square" severity="secondary" @click="navigate" />
                </router-link>
                <Button label="Abmelden" icon="pi pi-sign-out" severity="danger" @click="logout" />
              </div>
            </Popover>
          </div>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<style scoped>
.app-logo {
  width: 40px;
  height: 40px;
  margin-right: 20px;

  background-image: var(--app-logo-url);
  background-size: contain;
  background-repeat: no-repeat;
}
.avatar:hover{
  cursor: pointer;
}
</style>