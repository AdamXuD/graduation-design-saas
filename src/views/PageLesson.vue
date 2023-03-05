<script setup lang="ts">
import { computed, ref } from 'vue'
import banner from '@/assets/picture/banner.png'
import { allLesson, semester } from '@/fakeData'

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

const lessonList = computed(() => {
  if (filterActive.value === 'notOver') {
    return allLesson.filter((item) => !item.isOver)
  } else if (filterActive.value === 'nowSemester') {
    return allLesson.filter(
      (item) => item.during.year === semester.year && item.during.semester === semester.semester
    )
  } else {
    return allLesson
  }
})
</script>

<template>
  <div class="p-[16px] h-full flex flex-col">
    <div class="filter-btn flex flex-row border-b border-[#eaeaea] pb-[16px] mb-[16px]">
      <div
        v-for="item in filterItems"
        :key="item.value"
        class="flex flex-row items-center h-[24px] px-[8px] mr-[8px] text-[14px] rounded-full cursor-pointer"
        :class="filterActive === item.value ? 'bg-theme text-[#fff]' : 'bg-[#eaeaea]'"
        @click="onFilterItemClicked(item.value)"
      >
        {{ item.label }}
      </div>
    </div>
    <ul class="flex-1 overflow-auto flex flex-row flex-wrap scroll">
      <li v-for="item in lessonList" :key="item.lesson_id" class="w-1/4 mb-[16px] pr-[16px]">
        <router-link :to="`${$route.path}/${item.lesson_id}`">
          <div class="banner rounded-lg overflow-hidden mb-[8px]">
            <img :src="banner" alt="" />
          </div>
          <div class="detail px-[8px]">
            <h3 class="text-[16px] font-bold truncate">
              {{ item.name }}
            </h3>
            <p class="text-[14px] opacity-75">教师：{{ item.teacher.name }}</p>
            <p class="text-[14px] opacity-75">
              学期：{{ item.during.year }}-{{ item.during.year + 1 }}年度第{{
                item.during.semester
              }}学期
            </p>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
