<script setup lang="ts">
import TheCard from '@/components/TheCard.vue'
import banner from '@/assets/image/banner.png'
import { reactive, ref } from 'vue'
import { getLessonDetail } from '@/api/lesson'
import type { Lesson } from '@/types/lesson'
import type { Teacher } from '@/types/teacher'

const props = defineProps<{
  lessonId: string
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

const lesson = reactive<Lesson>({
  id: -1,
  title: '',
  thumbnail: '',
  teacher_id: '',
  year: 0,
  term: 0,
  is_over: false,
  courseware: '',
  notice: ''
})

const teacher = reactive<Teacher>({
  id: '',
  name: '',
  email: '',
  phone: '',
  avatar: '',
  introduction: ''
})

getLessonDetail(Number(props.lessonId)).then((res) => {
  Object.assign(lesson, res.lesson)
  Object.assign(teacher, res.teacher)
})

const lessonMenuElem = ref<HTMLElement>()
const scrollToMenu = () => {
  if (!lessonMenuElem.value) return
  const ElementTop = lessonMenuElem.value.getBoundingClientRect().top
  window.scrollTo({
    top: ElementTop + window.pageYOffset - 80,
    behavior: 'smooth'
  })
}
</script>

<template>
  <div class="flex sm:flex-row flex-col p-2 sm:p-4 sm:h-full">
    <the-card class="lesson-sidebar sm:w-1/4 md:w-1/5 lg:w-1/6 mb-2 sm:mb-0 w-full mr-2">
      <template #header>
        <div class="border-b border-border">
          <div class="banner overflow-hidden rounded-t-md mb-2">
            <img :src="banner" alt="banner" class="w-full h-full object-cover" />
          </div>
          <div class="detail px-2 mb-2 text-sm text-regular">
            <h3 class="text-base mb-2 text-primary font-bold truncate">
              {{ lesson.title }}
            </h3>
            <p class="flex items-center">
              教师：{{ teacher.name }}
              <el-popover :width="240" placement="bottom" :teleported="false">
                <template #reference>
                  <div
                    class="cursor-pointer w-8 h-8 rounded-full overflow-hidden hover:bg-fill flex items-center justify-center transition-all"
                    title="信息"
                  >
                    <el-icon><User /></el-icon>
                  </div>
                </template>
                <template #default>
                  <div class="flex flex-col items-center">
                    <div class="w-16 h-16 rounded-full overflow-hidden mb-4">
                      <img v-if="teacher.avatar.length !== 0" :src="teacher.avatar" alt="" />
                      <div
                        v-else
                        class="w-full h-full bg-fill flex items-center justify-center text-3xl"
                      >
                        {{ teacher.name[0] }}
                      </div>
                    </div>
                    <div class="main flex flex-col items-center mb-2">
                      <h3 class="font-bold mb-2">{{ teacher.name }}</h3>
                      <p>{{ teacher.id }}</p>
                    </div>
                    <div class="pb-2 mb-2">
                      <p>
                        邮箱：
                        <a :href="`mailto:${teacher.email}`"> {{ teacher.email }}</a>
                      </p>
                      <p>
                        手机：
                        <a :href="`tel:${teacher.phone}`"> {{ teacher.phone }}</a>
                      </p>
                      <p>简介：{{ teacher.introduction }}</p>
                    </div>
                  </div>
                </template>
              </el-popover>
            </p>
            <p>{{ Number(lesson.year) }}-{{ Number(lesson.year) + 1 }}年度</p>
            <p>第{{ lesson.term }}学期</p>
            <p>状态：{{ lesson.is_over ? '已结课' : '未结课' }}</p>
          </div>
        </div>
      </template>
      <ul class="flex flex-row sm:flex-col" ref="lessonMenuElem">
        <li v-for="item in menuList" :key="item.path" class="w-1/5 sm:w-full">
          <router-link
            :to="`/lesson/${lessonId}${item.path}`"
            @click="scrollToMenu"
            class="h-12 flex flex-col items-center justify-center"
            :class="`/lesson/${lessonId}${item.path}` === $route.path ? 'bg-theme text-white' : ''"
          >
            {{ item.label }}
          </router-link>
        </li>
      </ul>
    </the-card>
    <the-card class="lesson-content sm:w-3/4 md:w-4/5 lg:w-5/6 w-full min-h-[calc(100vh-228px)]">
      <template #header>
        <div class="h-16 flex flex-row items-center px-4 border-b border-border">
          <h2 class="text-lg">{{ $route.meta.subtitle }}</h2>
        </div>
      </template>
      <router-view :lesson="lesson"></router-view>
    </the-card>
  </div>
</template>

<style scoped></style>
