<script setup lang="ts">
import TheCard from '@/components/TheCard.vue'
import banner from '@/assets/picture/banner.png'
import { allLesson } from '@/fakeData'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  lessonId: string
  active?: string
}>()

const menuList = [
  {
    label: '公告',
    path: '/notice'
  },
  {
    label: '课堂',
    path: '/classroom'
  },
  {
    label: '课件',
    path: '/courseware'
  },
  {
    label: '作业',
    path: '/homework'
  },
  {
    label: '云',
    path: '/cloud'
  }
]
// const active = computed

const lesson = computed(() => {
  return allLesson.find((item) => item.lesson_id === props.lessonId)
})

console.log(useRoute().path)
</script>

<template>
  <div class="flex flex-row h-full p-[16px]">
    <the-card class="lesson-sidebar w-1/6 mr-[8px]">
      <template #header>
        <div class="border-b border-[#eaeaea]">
          <div class="banner overflow-hidden rounded-t-md mb-[8px]">
            <img :src="banner" alt="banner" class="w-full h-full object-cover" />
          </div>
          <div class="detail px-[8px] mb-[8px] text-[14px] opacity-75">
            <h3 class="text-[16px] opacity-100 font-bold truncate">
              {{ lesson?.name }}
            </h3>
            <p>教师：{{ lesson?.teacher.name }}</p>
            <p>{{ Number(lesson?.during?.year) }}-{{ Number(lesson?.during?.year) + 1 }}年度</p>
            <p>第{{ lesson?.during.semester }}学期</p>
            <p>状态：{{ lesson?.isOver ? '已结课' : '未结课' }}</p>
          </div>
        </div>
      </template>
      <ul>
        <li v-for="item in menuList" :key="item.path">
          <router-link
            :to="`/lesson/${lessonId}${item.path}`"
            class="h-[48px] flex flex-col items-center justify-center"
            :class="
              `/lesson/${lessonId}${item.path}` === $route.path ? 'bg-theme text-[#eaeaea]' : ''
            "
          >
            {{ item.label }}
          </router-link>
        </li>
      </ul>
    </the-card>
    <the-card class="lesson-content w-5/6">
      <template #header>
        <div class="h-[64px] flex flex-row items-center px-[16px] border-b border-[#eaeaea]">
          <h2 class="text-[18px]">{{ $route.meta.subtitle }}</h2>
        </div>
      </template>
      <router-view></router-view>
    </the-card>
  </div>
</template>

<style scoped></style>
