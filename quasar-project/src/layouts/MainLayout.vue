<template>
  <q-layout class="layout-com-logo" view="hHh lpR fFf">

    <q-header elevated class="cabecalho text-white" height-hint="98">
      
      <q-toolbar>

        <q-toolbar-title>
          <q-avatar>
            <img alt="Logo All Game Come" src="/icons/LogoAVSF.png">
          </q-avatar>
          Avaliação de Jogos All Game Come
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/Index" label="Início" />
        <q-route-tab to="/jogos" label="Jogo" />
        <q-route-tab to="/cadastrar-jogos" label="Cadastrar Jogo" />
      </q-tabs>
    </q-header>


    <q-page-container>
      <router-view />
    </q-page-container>

   

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>
<style>
.layout-com-logo::before {
  position: fixed;
  z-index: 1;
  inset: 98px 0 0;
  background-image: url('/icons/LogoAVSF.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: min(45vw, 520px);
  content: '';
  opacity: 0.07;
  pointer-events: none;
}

.cabecalho {
  background-color: #171f2b;
}
</style>