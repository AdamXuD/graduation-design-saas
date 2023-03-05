<script setup lang="ts">
import { notices } from '@/fakeData'

const timeFormat = (time: number) => {
  const date = new Date(time)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
</script>

<template>
  <ul class="p-[16px]">
    <li
      v-for="(item, index) in notices"
      :key="index"
      class="flex flex-col py-[16px] px-[8px] border-b border-[#eaeaea]"
    >
      <h4 class="font-bold text-[18px] mb-[8px]">{{ item.title }}</h4>
      <p class="whitespace-pre-wrap mb-[8px] opacity-60">{{ item.content }}</p>
      <p class="self-end text-[14px] opacity-50">{{ timeFormat(item.time) }}</p>
    </li>
  </ul>
</template>

<style scoped></style>
