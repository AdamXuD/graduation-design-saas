<script setup lang="ts">
import icon from '@/assets/image/icon.png'
import TheSidebarItem from '@/components/children/TheSidebarItem.vue'
import { useTokenStore } from '@/stores/token'

const { isAdmin } = useTokenStore()
</script>

<template>
  <aside class="flex flex-row sm:flex-col items-stretch bg-theme">
    <div class="p-2 hidden sm:block">
      <img :src="icon" alt="" />
    </div>
    <div class="menu flex-1 flex flex-row sm:flex-col" v-if="isAdmin()">
      <the-sidebar-item path="/option" label="设置" class="h-24 w-1/6 sm:h-24 sm:w-24">
        <Odometer />
      </the-sidebar-item>
      <the-sidebar-item path="/profession" label="专业" class="h-24 w-1/6 sm:h-24 sm:w-24">
        <Key />
      </the-sidebar-item>
      <the-sidebar-item path="/class" label="班级" class="h-24 w-1/6 sm:h-24 sm:w-24">
        <School />
      </the-sidebar-item>
      <the-sidebar-item path="/teacher" label="教师" class="h-24 w-1/6 sm:h-24 sm:w-24">
        <UserFilled />
      </the-sidebar-item>
      <the-sidebar-item path="/student" label="学生" class="h-24 w-1/6 sm:h-24 sm:w-24">
        <User />
      </the-sidebar-item>
      <the-sidebar-item path="/lesson" label="课程" class="h-24 w-1/6 sm:h-24 sm:w-24">
        <Notebook />
      </the-sidebar-item>
    </div>
    <div class="menu flex-1 flex flex-row sm:flex-col" v-else>
      <the-sidebar-item path="/dashboard" label="仪表盘" class="h-20 w-1/3 sm:h-24 sm:w-24">
        <Odometer />
      </the-sidebar-item>
      <the-sidebar-item
        path="/lesson"
        label="课程"
        class="h-20 w-1/3 sm:h-24 sm:w-24 aspect-square"
      >
        <Notebook />
      </the-sidebar-item>
      <the-sidebar-item path="/cloud" label="云盘" class="h-20 w-1/3 sm:h-24 sm:w-24">
        <MostlyCloudy />
      </the-sidebar-item>
    </div>
  </aside>
</template>

<style scoped></style>
