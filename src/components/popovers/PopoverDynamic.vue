<script setup lang="ts">
import { getDynamicList } from '@/api/public'
import type { Dynamic } from '@/types/dynamic'
import { computed, reactive, ref } from 'vue'
import { timeFormat } from '@/hooks'

const dynamics = reactive<Dynamic[]>([])

getDynamicList().then((res) => {
  dynamics.length = 0
  dynamics.push(...res)
})

const dynamicOutline = computed(() => {
  return dynamics
    .map((item) => {
      return {
        lesson_title: item.lesson_title,
        lesson_id: item.lesson_id,
        outline: item.content.slice(0, 10) + (item.content.length > 10 ? '...' : ''),
        created_time: item.created_time
      }
    })
    .slice(0, 3)
})

const isDynamicDialogShow = ref(false)
const onMoreBtnClicked = () => {
  isDynamicDialogShow.value = true
}
</script>

<template>
  <el-popover :width="240" placement="bottom" :teleported="false">
    <template #reference>
      <div
        class="btn cursor-pointer w-8 h-8 rounded-full overflow-hidden hover:bg-fill flex items-center justify-center transition-all"
        title="动态"
      >
        <el-icon :size="20">
          <WindPower />
        </el-icon>
      </div>
    </template>
    <template #default>
      <div class="font-bold pb-2.5 border-b border-border">动态</div>
      <ul>
        <li v-for="(item, index) in dynamicOutline" :key="index">
          <router-link
            :to="`/lesson/${item.lesson_id}`"
            class="py-2 border-b border-border flex flex-col"
          >
            <div class="title flex flex-row items-center mb-2">
              <h3 class="mr-2">{{ item.lesson_title }}</h3>
            </div>
            <p class="text-primary mb-2">{{ item.outline }}</p>
            <p>{{ timeFormat(item.created_time) }}</p>
          </router-link>
        </li>
        <li class="h-8 flex items-center justify-center cursor-pointer" @click="onMoreBtnClicked">
          ...
        </li>
      </ul>
    </template>
  </el-popover>
  <el-dialog v-model="isDynamicDialogShow" title="动态" class="w-5/6 sm:w-1/2">
    <ul class="px-4 py-2 h-72 overflow-auto scroll" v-if="dynamics.length !== 0">
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
    <p v-else class="text-secondary text-sm text-center my-4">( No data )</p>
    <template #footer>
      <el-button type="primary" @click="isDynamicDialogShow = false">关闭</el-button>
    </template>
  </el-dialog>
</template>
