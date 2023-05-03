<script setup lang="ts">
const props = defineProps<{
  path: string
  label: string
}>()
</script>

<template>
  <div class="group" :class="new RegExp(`^${props.path}`).test($route.path) ? 'focus' : ''">
    <router-link
      class="h-full w-full flex flex-col items-center justify-center group-[.focus]:bg-white"
      :to="path"
    >
      <el-icon :size="28" class="icon text-white group-[.focus]:text-theme">
        <slot></slot>
      </el-icon>
      <div class="label text-white group-[.focus]:text-theme">{{ props.label }}</div>
    </router-link>
  </div>
</template>

<style scoped></style>
