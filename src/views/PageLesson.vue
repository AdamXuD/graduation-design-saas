<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import banner from '@/assets/image/banner.png'
import type { LessonBrief } from '@/types/lesson'
import { getLessons } from '@/api/lesson'

const filterItems = [
  {
    label: '未结课',
    value: 'notOver'
  },
  {
    label: '本学期',
    value: 'nowSemester'
  },
  {
    label: '全部',
    value: 'all'
  }
]

const filterActive = ref('notOver')
const onFilterItemClicked = (value: string) => {
  filterActive.value = value
}

const lessons = reactive<LessonBrief[]>([])
const semester = reactive({
  year: 2022,
  term: 1
})
getLessons().then((res) => {
  lessons.push(...res.lessons)
  Object.assign(semester, res.semester)
})

const lessonList = computed(() => {
  if (filterActive.value === 'notOver') {
    return lessons.filter((item) => !item.is_over)
  } else if (filterActive.value === 'nowSemester') {
    return lessons.filter((item) => item.year === semester.year && item.term === semester.term)
  } else {
    return lessons
  }
})
</script>

<template>
  <div class="flex flex-col p-2 sm:p-4 sm:h-full">
    <div class="filter-btn flex flex-row border-b border-border pb-2 sm:pb-4 mb-4">
      <div
        v-for="item in filterItems"
        :key="item.value"
        class="flex flex-row items-center h-6 px-2 mr-2 text-sm rounded-full cursor-pointer"
        :class="filterActive === item.value ? 'bg-theme text-white' : 'bg-fill'"
        @click="onFilterItemClicked(item.value)"
      >
        {{ item.label }}
      </div>
    </div>
    <ul class="flex-1 overflow-auto flex flex-row flex-wrap scroll">
      <li v-for="item in lessonList" :key="item.id" class="sm:w-1/3 lg:w-1/4 w-1/2 mb-4 pr-4">
        <router-link :to="`lesson/${item.id}`">
          <div class="banner rounded-lg overflow-hidden mb-1">
            <img :src="item.thumbnail || banner" alt="" />
          </div>
          <div class="detail px-1">
            <h3 class="mb-2 font-bold truncate">
              {{ item.title }}
            </h3>
            <p class="text-sm text-regular">
              学期：{{ item.year }}-{{ item.year + 1 }}年度第{{ item.term }}学期
            </p>
            <p class="text-sm text-regular">状态：{{ item.is_over ? '已结课' : '未结课' }}</p>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
