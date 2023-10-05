<!-- src/App.vue -->
<template>
  <div id="app">
    <LoginComponent v-if="!isLoggedIn" @login-success="handleLoginSuccess" />
    <div v-else>
      <TestComponent @logout="handleLogout" />
    </div>
  </div>
</template>

<script>
import TestComponent from '@/components/TestComponent.vue';
import LoginComponent from '@/components/LoginComponent.vue';

export default {
  components: {
    TestComponent,
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
