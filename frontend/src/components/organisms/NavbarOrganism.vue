<script setup>
import Menubar from 'primevue/menubar';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Popover from 'primevue/popover';

import { ref } from "vue";
import { useAuth } from '@/composables/useAuth.ts';

const { isLoggedIn, setLoggedIn } = useAuth();

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

function logout() {
  console.log('logout'); // TODO
  setLoggedIn(false);
}
</script>

<template>
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
            <Avatar label="LD" shape="circle" class="avatar" @click="toggle" />
            <Popover ref="op">
              <div class="flex flex-col gap-4">
                <router-link to="/user" custom v-slot="{ navigate }">
                  <Button label="Bearbeieten" icon="pi pi-pen-to-square" severity="secondary" @click="navigate" />
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

<style>
#app {
  display: flex;
  flex-direction: column;
}
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