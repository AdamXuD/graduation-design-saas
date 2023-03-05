<script setup lang="ts">
import TheCard from '@/components/TheCard.vue'
import { allLesson, semester, tasks, dynamics } from '@/fakeData'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const nowSemesterLesson = computed(() => {
  return allLesson.filter(
    (item) => item.during.year === semester.year && item.during.semester === semester.semester
  )
})

const timeFormat = (time: number) => {
  const date = new Date(time * 1000)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

const onTasksRowClicked = (row: { lesson_id: string }) => {
  router.push(`/lesson/${row.lesson_id}/homework`)
}
</script>

<template>
  <div class="p-[16px] flex flex-row h-full">
    <the-card class="left w-2/3 mr-[8px]">
      <template v-slot:header>
        <div class="h-[64px] flex flex-row items-center px-[16px] border-b border-[#eaeaea]">
          <h2 class="text-[18px]">工作项</h2>
        </div>
      </template>
      <div class="p-[8px]">
        <el-table :data="tasks" @row-click="onTasksRowClicked" row-class-name="cursor-pointer">
          <el-table-column prop="lesson" label="科目" width="180" />
          <el-table-column prop="title" label="任务" width="180" />
          <el-table-column prop="deadline" label="截止时间">
            <template #default="{ row }">
              <span>{{ timeFormat(row.deadline) }}</span>
            </template>
          </el-table-column>
          <el-table-column>
            <template #default>
              <div class="flex flex-row justify-end">
                <el-icon>
                  <ArrowRight />
                </el-icon>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </the-card>
    <div class="right w-1/3">
      <the-card class="mb-[8px] h-1/3">
        <template v-slot:header>
          <div class="h-[64px] flex flex-row items-center px-[16px] border-b border-[#eaeaea]">
            <h2 class="text-[18px]">本学期课程</h2>
          </div>
        </template>
        <ul class="px-[16px] py-[8px]">
          <li
            v-for="(item, index) in nowSemesterLesson"
            :key="index"
            class="py-[8px] border-b border-[#eaeaea] last:border-0 group"
          >
            <router-link
              :to="`/lesson/${item.lesson_id}`"
              class="flex flex-row items-center justify-between"
            >
              {{ item.name }}
              <div
                class="bg-[#409eff] text-[#fff] text-[12px] w-[24px] h-[24px] rounded-full overflow-hidden flex items-center justify-center"
              >
                8
              </div>
            </router-link>
          </li>
        </ul>
      </the-card>
      <the-card class="h-2/3">
        <template v-slot:header>
          <div class="h-[64px] flex flex-row items-center px-[16px] border-b border-[#eaeaea]">
            <h2 class="text-[18px]">动态</h2>
          </div>
        </template>
        <ul class="px-[16px] py-[8px]">
          <li
            v-for="(item, index) in dynamics"
            :key="index"
            class="py-[8px] border-b border-[#eaeaea] last:border-0 group"
          >
            <a :href="`/lesson/${item.lesson_id}`" class="flex flex-col items-stretch">
              <div class="flex flex-row">
                <p class="flex-1">
                  {{ item.lesson }}
                </p>
                <p class="flex-1">
                  {{ item.teacher }}
                </p>
              </div>
              <p class="text-[#666] text-[12px]">
                {{ item.content }}
              </p>
            </a>
          </li>
        </ul>
      </the-card>
    </div>
  </div>
</template>

<style scoped></style>
