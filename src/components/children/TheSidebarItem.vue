<script setup lang="ts">
const props = defineProps<{
  path: string
  label: string
}>()
</script>

<template>
  <div class="item group" :class="new RegExp(`^${props.path}`).test($route.path) ? 'focus' : ''">
    <router-link
      class="h-[96px] flex flex-col items-center justify-center group-[.focus]:bg-[#efefef]"
      :to="path"
    >
      <el-icon :size="28" class="icon text-[#efefef] group-[.focus]:text-[#003264]">
        <slot></slot>
      </el-icon>
      <div class="label text-[#efefef] group-[.focus]:text-[#003264]">{{ props.label }}</div>
    </router-link>
  </div>
</template>

<style scoped></style>
