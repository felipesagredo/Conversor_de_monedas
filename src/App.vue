<!-- src/App.vue -->
<template>
  <div id="app">
    <LoginComponent v-if="!isLoggedIn" @login-success="handleLoginSuccess" />
    <div v-else>
      <ConversorComponent @logout="handleLogout" />
    </div>
  </div>
</template>

<script>
import ConversorComponent from '@/components/ConversorComponent.vue';
import LoginComponent from '@/components/LoginComponent.vue';

export default {
  components: {
    ConversorComponent,
    LoginComponent,
  },
  data() {
    return {
      isLoggedIn: false,
    };
  },
  methods: {
    handleLoginSuccess() {
      this.isLoggedIn = true;
    },
    handleLogout() {
      this.isLoggedIn = false;
    },
  },
};
</script>

<style>
/* Estilos globales si es necesario */
</style>
