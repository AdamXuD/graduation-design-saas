<script setup lang="ts">
import icon from '@/assets/picture/icon.png'
import TheSidebarItem from '@/components/children/TheSidebarItem.vue'
</script>

<template>
  <aside class="aside w-[96px] flex flex-col items-stretch bg-theme">
    <div class="school-icon flex justify-center items-center p-[8px]">
      <img :src="icon" alt="" />
    </div>
    <div class="menu flex-1">
      <the-sidebar-item name="dashboard" path="/dashboard" label="仪表盘">
        <Odometer />
      </the-sidebar-item>
      <the-sidebar-item name="lesson" path="/lesson" label="课程">
        <Notebook />
      </the-sidebar-item>
      <the-sidebar-item name="cloud" path="/cloud" label="云盘">
        <MostlyCloudy />
      </the-sidebar-item>
    </div>
  </aside>
</template>

<style scoped></style>
