<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import { getDashboard } from '@/api/public'
import { timeFormat } from '@/hooks'
import type { Dynamic } from '@/types/dynamic'
import type { LessonBrief } from '@/types/lesson'
import type { Task } from '@/types/task'

import TheCard from '@/components/TheCard.vue'

const router = useRouter()

const uncompletedTasks = reactive<Task[]>([])
const uncompletedLessons = reactive<LessonBrief[]>([])
const dynamics = reactive<Dynamic[]>([])

getDashboard().then((res) => {
  uncompletedTasks.push(...res.uncompleted_tasks)
  uncompletedLessons.push(...res.uncompleted_lessons)
  dynamics.push(...res.dynamics)
})

const onTasksRowClicked = (row: { lesson_id: string }) => {
  router.push(`/lesson/${row.lesson_id}/homework`)
}
</script>

<template>
  <div class="flex flex-col sm:flex-row items-stretch p-2 sm:p-4 sm:h-full">
    <the-card class="left w-full sm:w-2/3 mr-0 sm:mr-2 mb-2 sm:mb-0">
      <template v-slot:header>
        <div class="h-16 flex flex-row items-center px-4 border-b border-border">
          <h2 class="text-lg">工作项</h2>
        </div>
      </template>
      <div class="p-2 h-full">
        <el-table
          :data="uncompletedTasks"
          @row-click="onTasksRowClicked"
          row-class-name="cursor-pointer"
          class="h-full"
        >
          <el-table-column prop="lesson_title" label="科目" width="180" />
          <el-table-column prop="title" label="任务" width="180" />
          <el-table-column prop="deadline" label="截止时间" width="100">
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
    <div class="right w-full sm:w-1/3">
      <the-card class="mb-2 sm:h-1/3">
        <template v-slot:header>
          <div class="h-16 flex flex-row items-center px-4 border-b border-border">
            <h2 class="text-lg">本学期课程</h2>
          </div>
        </template>
        <ul class="px-4 py-2" v-if="uncompletedLessons.length !== 0">
          <li
            v-for="(item, index) in uncompletedLessons"
            :key="index"
            class="py-2 border-b border-border last:border-0 group"
          >
            <router-link
              :to="`/lesson/${item.id}`"
              class="flex flex-row items-center justify-between"
            >
              {{ item.title }}
            </router-link>
          </li>
        </ul>
        <p v-else class="text-secondary text-sm text-center my-4">( No data )</p>
      </the-card>
      <the-card class="sm:h-2/3">
        <template v-slot:header>
          <div class="h-16 flex flex-row items-center px-4 border-b border-border">
            <h2 class="text-lg">动态</h2>
          </div>
        </template>
        <ul class="px-4" v-if="dynamics.length !== 0">
          <li
            v-for="(item, index) in dynamics"
            :key="index"
            class="py-4 border-b border-border last:border-0 group"
          >
            <router-link :to="`/lesson/${item.lesson_id}`" class="flex flex-col items-stretch">
              <div class="my-2 flex flex-row items-end justify-between flex-wrap">
                <p class="text-base text-primary">{{ item.lesson_title }}</p>
                <p class="text-regular text-xs">{{ timeFormat(item.created_time) }}</p>
              </div>
              <p class="text-regular text-xs">
                {{ item.content }}
              </p>
            </router-link>
          </li>
        </ul>
        <p v-else class="text-secondary text-xs text-center my-4">( No data )</p>
      </the-card>
    </div>
  </div>
</template>

<style scoped></style>
