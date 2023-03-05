<script setup lang="ts">
import { ref } from 'vue'
import { interactiveRecords } from '@/fakeData'

const isTeaching = ref(false)

// get hh:mm:ss from time, zero fill
const formatTime = (time: number) => {
  const date = new Date(time)
  const hh = date.getHours().toString().padStart(2, '0')
  const mm = date.getMinutes().toString().padStart(2, '0')
  const ss = date.getSeconds().toString().padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

const renderEventType = (type: string) => {
  /*
   * type:
   * classbegin: 课程开始
   * attendance: 签到
   * taketheroll: 点名
   * classend: 课程结束
   */
  switch (type) {
    case 'classbegin':
      return '课程开始'
    case 'attendance':
      return '签到'
    case 'taketheroll':
      return '点名'
    case 'classend':
      return '课程结束'
    default:
      return '其他事件'
  }
}

const renderEventDesc = (data: { type: string; data: unknown }) => {
  let str = ''
  switch (data.type) {
    case 'classbegin':
      str = '现在开始上课，请认真听讲。'
      break
    case 'attendance': {
      const { late, order } = data.data as { late: boolean; order: number }
      str = 'Wi-Fi签到成功'
      if (late) {
        str += '，签到状态为迟到'
      } else {
        str += '，签到状态为正常'
      }
      str += `，您是第${order}个完成签到的同学。`
      break
    }
    case 'taketheroll': {
      const { multi, isTarget, question } = data.data as {
        multi: boolean
        isTarget: boolean
        question: string
      }
      str = '老师发起了点名'
      if (multi) {
        str += '，点名方式为多选'
      } else {
        str += '，点名方式为单选'
      }
      if (isTarget) {
        str += '，您是点名的目标，请听从老师指示回答问题。'
      } else {
        str += '，您不是点名的目标，可以继续听讲。'
      }
      if (question.length > 0) {
        str += `，点名问题为：${question}`
      }
      break
    }
    case 'classend':
      str = '现在下课，请听从老师的安排，有序离开教室。'
      break
    default: {
      const { desc } = data.data as { desc: string }
      str = desc
      break
    }
  }
  return str
}

const wsConnecting = ref(true)
</script>

<template>
  <div class="p-[16px]">
    <div class="text-[14px] border-b border-[#eaeaea] pb-[8px] mb-[16px]">
      （调试按钮）是否开始上课：
      <el-switch v-model="isTeaching" />
    </div>
    <div>
      <p class="text-[14px] mb-[16px]">
        <span v-if="isTeaching"> 现在正在上课，请认真听讲。 </span>
        <span v-else>现在为下课时间，请认真回顾上课知识，检查作业完成情况。</span>
      </p>
      <div class="">
        <div class="flex flex-row items-center mb-[8px]">
          <h3 class="font-bold mr-[16px]">课堂互动记录</h3>
          <el-icon :size="16" class="animate-spin" v-if="wsConnecting">
            <Loading />
          </el-icon>
          <el-icon :size="16" v-else>
            <Warning />
          </el-icon>
        </div>
        <el-table :data="isTeaching ? interactiveRecords : []">
          <el-table-column label="时间" width="180">
            <template #default="{ row }">
              <el-icon><Timer /></el-icon>
              {{ formatTime(row.time) }}
            </template>
          </el-table-column>
          <el-table-column label="事件" width="180">
            <template #default="{ row }">
              {{ renderEventType(row.type) }}
            </template>
          </el-table-column>
          <el-table-column label="描述">
            <template #default="{ row }">
              {{ renderEventDesc(row) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
