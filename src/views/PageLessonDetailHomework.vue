<script setup lang="ts">
import { tasks } from '@/fakeData'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'

const filterItems = [
  {
    label: '全部',
    value: 'all'
  },
  {
    label: '未完成',
    value: 'uncompleted'
  },
  {
    label: '已完成',
    value: 'completed'
  },
  {
    label: '已批改',
    value: 'checked'
  },
  {
    label: '已逾期',
    value: 'expired'
  }
]
const filterActive = ref('all')

const homeworkList = computed(() => {
  if (filterActive.value === 'uncompleted') {
    return tasks.filter((item) => item.status === 0)
  } else if (filterActive.value === 'completed') {
    return tasks.filter((item) => item.status === 1)
  } else if (filterActive.value === 'checked') {
    return tasks.filter((item) => item.status === 2)
  } else if (filterActive.value === 'expired') {
    return tasks.filter((item) => item.status === 3)
  } else {
    return tasks
  }
})

const onFilterItemClicked = (value: string) => {
  filterActive.value = value
}

const judgeImage = (filename: string) => {
  const suffix = `(bmp|jpg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|WMF|webp|jpeg)`
  const regular = new RegExp(`.*.${suffix}`)
  return regular.test(filename)
}

const timeFormat = (time: number) => {
  const date = new Date(time * 1000)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

const judgeStatus = (status: number) => {
  if (status === 0) {
    return '未完成'
  } else if (status === 1) {
    return '已完成'
  } else if (status === 2) {
    return '已批改'
  } else if (status === 3) {
    return '已逾期'
  }
}

const judgeStatusColor = (status: number) => {
  if (status === 0) {
    return 'bg-[#E6A23C]'
  } else if (status === 1) {
    return 'bg-[#409EFF]'
  } else if (status === 2) {
    return 'bg-[#67C23A]'
  } else if (status === 3) {
    return 'bg-[#F56C6C]'
  }
}

const expandedStatus = reactive<{ [key: string]: boolean }>({})
const toggleExpandedStatus = (id: string) => {
  expandedStatus[id] = !expandedStatus[id]
}

const editing = ref('')
const textEdit = ref('')
const attachment = ref<string[]>([])
const onEditBtnClicked = (event: { stopPropagation: () => void }, id: string) => {
  editing.value = id
  expandedStatus[id] = true
  textEdit.value = tasks.find((item) => item.task_id === id)?.text || ''
  attachment.value = tasks.find((item) => item.task_id === id)?.files || []
  event.stopPropagation()
}
const onAddAttachmentBtnClicked = () => {}
const onSubmitBtnClicked = (id: string) => {
  id
  ElMessage.success('提交成功')
  editing.value = ''
}
const onCancelBtnClicked = (id: string) => {
  id
  editing.value = ''
}
</script>

<template>
  <div class="p-[16px]">
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
    <ul>
      <li
        v-for="item in homeworkList"
        :key="item.task_id"
        class="flex flex-col px-[8px] border-b border-[#eaeaea]"
      >
        <div
          class="py-[16px] flex flex-row justify-between cursor-pointer"
          @click="toggleExpandedStatus(item.task_id)"
        >
          <div class="flex flex-row items-center">
            <h5 class="font-bold mr-[8px]">{{ item.title }}</h5>
            <div class="flex flex-row items-center text-[12px]">
              <div class="type py-[2px] px-[8px] mr-[8px] rounded-full overflow-hidden bg-[#ddd]">
                作业
              </div>
              <div
                class="status py-[2px] px-[8px] mr-[8px] rounded-full overflow-hidden text-[#fff]"
                :class="judgeStatusColor(item.status)"
              >
                {{ judgeStatus(item.status) }}
              </div>
              <div
                class="score py-[2px] px-[8px] mr-[8px] rounded-full overflow-hidden bg-[#409eff] text-[#fff]"
                v-if="item.status === 2"
              >
                得分：{{ item.score }}
              </div>
            </div>
            <p class="text-[12px] opacity-75">
              <span class="mr-[8px]">截止时间：{{ timeFormat(item.deadline) }}</span>
            </p>
          </div>
          <div class="flex flex-row items-center">
            <div
              class="w-[24px] h-[24px] mr-[16px] bg-[#409Eff] text-[#fff] rounded-full overflow-hidden flex flex-row justify-center items-center cursor-pointer"
              v-if="new Date(item.deadline * 1000).getTime() > new Date().getTime()"
              @click="onEditBtnClicked($event, item.task_id)"
            >
              <el-icon :size="16">
                <Edit />
              </el-icon>
            </div>

            <el-icon :size="20" class="opacity-75">
              <ArrowRight v-if="!expandedStatus[item.task_id]" />
              <ArrowDown v-else />
            </el-icon>
          </div>
        </div>
        <div class="detail" v-if="expandedStatus[item.task_id]">
          <div class="requirement mb-[16px] text-[14px]">
            <p>作业要求：</p>
            <p>（作业要求略）</p>
          </div>
          <div
            class="finish-detail mb-[16px]"
            v-if="!(item.status === 0 || item.task_id === editing)"
          >
            <p class="text-[14px]">文字描述：</p>
            <p class="whitespace-pre-wrap mb-[8px] text-[14px]">
              <span v-if="item.text && item.text.length">
                {{ item.text }}
              </span>
              <span v-else> （无文字描述） </span>
            </p>
            <ul class="attachment mb-[16px] flex flex-row items-center">
              <li class="text-[14px]">附件：</li>
              <li v-if="item.files.length === 0" class="text-[14px]">（无附件）</li>
              <li
                v-else
                v-for="it in item.files"
                :key="it"
                class="w-[96px] h-[96px] mr-[8px] border border-[#eaeaea] rounded-md overflow-hidden"
              >
                <el-image
                  v-if="judgeImage(it)"
                  :src="it"
                  :preview-src-list="[it]"
                  fit="cover"
                  class="w-full h-full"
                ></el-image>
                <a
                  v-else
                  :href="it"
                  target="_blank"
                  class="h-full w-full flex items-center justify-center"
                >
                  <el-icon :size="48" class="opacity-50">
                    <Document />
                  </el-icon>
                </a>
              </li>
            </ul>
          </div>
          <div class="edit-detail" v-if="editing === item.task_id">
            <p class="text-[14px]">文字描述：</p>
            <el-input
              v-if="editing === item.task_id"
              type="textarea"
              :rows="4"
              v-model="textEdit"
              class="mb-[16px]"
            ></el-input>
            <ul class="attachment mb-[16px] flex flex-row items-center">
              <li class="text-[14px]">附件：</li>
              <li v-if="item.files.length === 0" class="text-[14px]">（无附件）</li>
              <li
                v-else
                v-for="it in item.files"
                :key="it"
                class="w-[96px] h-[96px] mr-[8px] border border-[#eaeaea] rounded-md overflow-hidden"
              >
                <el-image
                  v-if="judgeImage(it)"
                  :src="it"
                  fit="cover"
                  class="w-full h-full"
                ></el-image>
                <div v-else class="h-full w-full flex items-center justify-center">
                  <el-icon :size="48" class="opacity-50">
                    <Document />
                  </el-icon>
                </div>
              </li>
              <li
                class="w-[96px] h-[96px] mr-[8px] border border-[#eaeaea] rounded-md overflow-hidden flex justify-center items-center cursor-pointer"
                @click="onAddAttachmentBtnClicked"
              >
                <el-icon :size="48" class="opacity-50">
                  <Plus />
                </el-icon>
              </li>
            </ul>
            <div class="btn-group mb-[16px] flex flex-row justify-end">
              <el-button type="primary" class="mr-[8px]" @click="onSubmitBtnClicked(item.task_id)">
                提交
              </el-button>
              <el-button @click="onCancelBtnClicked(item.task_id)">取消</el-button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
