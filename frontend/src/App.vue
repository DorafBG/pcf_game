<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- RouterView affiche la page active (par exemple LoginView) -->
  <RouterView />
</template>

<style>
/* Réinitialisation CSS globale */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f4f1ea;
}
</style>