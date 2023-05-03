<script setup lang="ts">
import TheSidebar from '@/components/TheSidebar.vue'
import TheHeader from '@/components/TheHeader.vue'
</script>

<template>
  <div class="sm:h-full w-full flex flex-row items-stretch">
    <the-sidebar class="w-24 flex-shrink-0 sm:block hidden"></the-sidebar>
    <div class="flex-1 flex flex-col items-stretch overflow-hidden">
      <the-header class="h-20 sm:h-24 fixed sm:relative top-0 left-0 w-full z-20"></the-header>
      <main class="sm:flex-1 sm:h-0 py-20 sm:py-0">
        <router-view />
      </main>
      <the-sidebar class="fixed bottom-0 left-0 w-full h-20 z-10 sm:hidden"></the-sidebar>
      <el-backtop :right="20" :bottom="100" class="sm:hidden" />
    </div>
  </div>
</template>

<style scoped></style>
