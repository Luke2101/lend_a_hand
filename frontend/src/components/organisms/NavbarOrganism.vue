<script setup lang="ts">
import Menubar from 'primevue/menubar';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import Toast from 'primevue/toast';
import ProgressBar from 'primevue/progressbar';
import Menu from 'primevue/menu';

import { ref, computed } from "vue";
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';
import {useToast} from "primevue/usetoast";
import {useUserStore} from "@/stores/user";

const toast = useToast();
const userStore = useUserStore();
const router = useRouter();
const { isLoggedIn, setLoggedIn } = useAuth();

const userPopUp = ref();
const balancePopUp = ref();

const avatarLabel = computed(() => {
  if (userStore.userInfo && userStore.userInfo.prename && userStore.userInfo.surname) {
    const firstInitial = userStore.userInfo.prename.charAt(0).toUpperCase();
    const lastInitial = userStore.userInfo.surname.charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  }
  return null;
});

const menuBarItems = ref([
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

const userMenuItems = ref([
  {
    label: 'Anfragen',
    items: [
      {
        label: 'Eigene Anfragen',
        icon: 'pi pi-user',
        route: '/marketplace/my'
      },
      {
        label: 'Favoriten',
        icon: 'pi pi-heart',
        route: '/marketplace/favorites'
      },
    ]
  },
  {
    label: 'Profil',
    items: [
      {
        label: 'Profil bearbeiten',
        icon: 'pi pi-cog',
        route: '/user'
      },
      {
        label: 'Abmelden',
        icon: 'pi pi-sign-out',
        command: () => {
          logout();
          userPopUp.value.hide();
        }
      }
    ]
  },
  {
    separator: true
  }
]);

const avatarToggle = (event: MouseEvent) => {
  userPopUp.value.toggle(event);
}

const balanceToggle = (event: MouseEvent) => {
  balancePopUp.value.toggle(event);
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
    <Menubar :model="menuBarItems">
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
              <Button
                  :label="userStore.userInfo.balance ? userStore.userInfo.balance.toString() : '–'"
                  size="small"
                  severity="secondary"
                  variant="outlined"
                  icon="pi pi-crown"
                  rounded
                  class="mr-2"
                  @click="balanceToggle"
              />
              <Popover ref="balancePopUp">
                <div class="flex flex-col gap-4 w-50">
                  <div v-if="userStore.userInfo" class="font-semibold">
                    <i class="pi pi-crown mr-2"/>{{ userStore.userInfo.balance }} ({{ userStore.userInfo.availableBalance }} verfügbar)
                  </div>
                  <ProgressBar :value="userStore.userInfo.availableBalance/userStore.userInfo.balance*100"> {{ userStore.userInfo.availableBalance }}/{{ userStore.userInfo.balance }}</ProgressBar>
                </div>
              </Popover>
              <Avatar :label="avatarLabel" shape="circle" class="avatar" @click="avatarToggle" />
            </template>
            <template v-else>
              <Avatar icon="pi pi-user" shape="circle" class="avatar" @click="avatarToggle" />
            </template>
            <Menu ref="userPopUp" id="user_menu_overlay" :model="userMenuItems" :popup="true" class="w-full md:w-60">
              <template #submenuheader="{ item }">
                <span class="text-primary font-bold">{{ item.label }}</span>
              </template>

              <template #item="{ item, props }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                  <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                    <span :class="item.icon"/>
                    <span>{{ item.label }}</span>
                  </a>
                </router-link>
                <a v-else v-ripple v-bind="props.action">
                  <span :class="item.icon"/>
                  <span>{{ item.label }}</span>
                </a>
              </template>

              <template #end>
                <div v-ripple class="relative overflow-hidden w-full border-0 bg-transparent ml-1 flex items-center p-2 rounded-none">
                  <Avatar :label="avatarLabel" class="mr-2" shape="circle" />
                  <span class="inline-flex flex-col items-start">
                        <span class="font-bold">{{ userStore.userInfo.prename }} {{ userStore.userInfo.surname }}</span>
                        <span class="text-sm">{{ userStore.userInfo.email }}</span>
                    </span>
                </div>
              </template>
            </Menu>
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