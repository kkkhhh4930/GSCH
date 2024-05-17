<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Nav from '@/components/Nav.vue'
import { useArticleStore } from "./stores/articles";

const store = useArticleStore();

</script>

<template>
  <header>
    <div class="wrapper">
        <Nav></Nav>
    </div>
  </header>

  <RouterView />

</template>

<style scoped>

</style>
