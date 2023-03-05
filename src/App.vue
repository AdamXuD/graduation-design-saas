<script setup lang="ts">
import TheSidebar from '@/components/TheSidebar.vue'
import TheHeader from '@/components/TheHeader.vue'
</script>

<template>
  <the-sidebar></the-sidebar>
  <div class="flex-1 flex flex-col items-stretch h-full">
    <the-header></the-header>
    <main class="main flex-1 h-0">
      <router-view />
    </main>
  </div>
</template>

<style>
#app {
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: stretch;
}
</style>
