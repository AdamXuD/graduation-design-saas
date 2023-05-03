<script setup lang="ts">
import PopoverAvatarPersonalInfo from './popovers/PopoverAvatarPersonalInfo.vue'
import PopoverDynamic from './popovers/PopoverDynamic.vue'
</script>

<template>
  <header class="bg-white border-b border-border flex flex-row items-center justify-between px-8">
    <h1 class="page-title text-2xl">
      {{ $route.meta.title }}
    </h1>
    <div class="btn-group flex flex-row items-center justify-between w-20">
      <popover-dynamic></popover-dynamic>
      <popover-avatar-personal-info></popover-avatar-personal-info>
    </div>
  </header>
</template>
<style scoped></style>
