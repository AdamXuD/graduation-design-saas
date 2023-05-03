<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from 'vue'
import { timeFormat } from '@/hooks'
import { useTokenStore } from '@/stores/token'
import { Plus } from '@element-plus/icons-vue'
import DialogEditHomeworkStudent from '@/components/dialogs/DialogEditHomeworkStudent.vue'
import DialogEditHomeworkTeacher from '@/components/dialogs/DialogEditHomeworkTeacher.vue'
import DialogCheckHomework from '@/components/dialogs/DialogCheckHomework.vue'
import type { Lesson } from '@/types/lesson'
import type { Task } from '@/types/task'
import type { TaskStatus } from '@/types/task_status'
import { deleteHomework, getLessonTasks, putHomeworkEnd } from '@/api/lesson'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps<{
  lesson: Lesson
}>()

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

const { isStudent, isTeacher } = useTokenStore()

const filterActive = ref('all')

const taskList = reactive<Task[]>([])
const taskStatusList = reactive<TaskStatus[]>([])

const updateData = () => {
  getLessonTasks(props.lesson.id).then((res) => {
    taskList.length = 0
    taskList.push(...res.tasks)
    taskStatusList.length = 0
    if (res.statuses) {
      taskStatusList.push(...res.statuses)
    }
  })
}
watchEffect(() => {
  if (props.lesson.id < 0) return
  updateData()
})

const filterList = computed(() => {
  if (filterActive.value === 'all') {
    return taskList
  } else {
    const resTaskId = taskStatusList
      .filter((item) => item.status === filterActive.value)
      .map((item) => item.task_id)
    return taskList.filter((item) => resTaskId.includes(item.id))
  }
})

const onFilterItemClicked = (value: string) => {
  filterActive.value = value
}

const judgeStatus = (status: string) => {
  switch (status) {
    case 'uncompleted':
      return '未完成'
    case 'completed':
      return '已完成'
    case 'checked':
      return '已批改'
    case 'expired':
      return '已截止'
    default:
      return ''
  }
}

const judgeStatusColor = (status: string) => {
  switch (status) {
    case 'uncompleted':
      return 'bg-warning'
    case 'completed':
      return 'bg-normal'
    case 'checked':
      return 'bg-success'
    case 'expired':
      return 'bg-danger'
    default:
      return ''
  }
}

const getStatus = (taskId: number) => {
  return taskStatusList.find((item) => item.task_id === taskId)
}

const expandedStatus = reactive<{ [key: number]: boolean }>({})
const toggleExpandedStatus = (id: number) => {
  expandedStatus[id] = !expandedStatus[id]
}

const isEditHomeworkStudentDialogVisible = ref(false)
const editHomeworkStudentModel = reactive({
  task_id: -1,
  detail: {
    status: '',
    text: '',
    files: [] as {
      filename: string
      url: string
    }[]
  }
})
const onEditHomeworkStudentBtnClicked = (taskId: number) => {
  const task = taskList.find((item) => item.id === taskId)
  if (!task) return
  const status = taskStatusList.find((item) => item.task_id === taskId)
  if (!status) return
  editHomeworkStudentModel.task_id = task.id
  editHomeworkStudentModel.detail.status = status.status || 'uncompleted'
  editHomeworkStudentModel.detail.text = status.text || ''
  editHomeworkStudentModel.detail.files = JSON.parse(status.files) || []
  isEditHomeworkStudentDialogVisible.value = true
}

const isEditHomeworkTeacherDialogVisible = ref(false)
const editHomeworkTeacherModel = reactive({
  id: -1,
  title: '',
  description: '',
  deadline: 0
})
const onEditHomeworkTeacherBtnClicked = (id?: number) => {
  const task = taskList.find((item) => item.id === id)
  if (!task) return
  editHomeworkTeacherModel.id = task.id || -1
  editHomeworkTeacherModel.title = task.title || ''
  editHomeworkTeacherModel.description = task.description || ''
  editHomeworkTeacherModel.deadline = task.deadline * 1000 || new Date().getTime()
  isEditHomeworkTeacherDialogVisible.value = true
}
const onNewHomeworkTeacherBtnClicked = () => {
  editHomeworkTeacherModel.id = -1
  editHomeworkTeacherModel.title = ''
  editHomeworkTeacherModel.description = ''
  editHomeworkTeacherModel.deadline = new Date().getTime()
  isEditHomeworkTeacherDialogVisible.value = true
}

const isCheckHomeWorkDialogVisible = ref(false)
const checkingTaskId = ref(-1)
const onCheckHomeWorkBtnClicked = (task_id: number) => {
  checkingTaskId.value = task_id
  isCheckHomeWorkDialogVisible.value = true
}

const onDeleteHomeworkBtnClicked = (task_id: number) => {
  ElMessageBox.confirm('确认删除该作业吗，该操作无法恢复？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => deleteHomework(props.lesson.id, task_id))
    .then(() => {
      ElMessage.success('删除成功')
      updateData()
    })
    .catch(() => {})
}

const onEndHomeworkBtnClicked = (task_id: number) => {
  ElMessageBox.confirm('确认结束该作业吗，该操作后所有学生将无法提交作业？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => putHomeworkEnd(props.lesson.id, task_id))
    .then(() => {
      ElMessage.success('结束成功')
      updateData()
    })
    .catch(() => {})
}
</script>

<template>
  <div class="p-4">
    <div class="filter-btn flex flex-row border-b border-border pb-4 mb-4" v-if="isStudent()">
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
    <div class="filter-btn flex flex-row border-b border-border pb-4 mb-4" v-if="isTeacher()">
      <el-button type="primary" :icon="Plus" @click="onNewHomeworkTeacherBtnClicked" class="w-full">
        新建
      </el-button>
    </div>
    <ul>
      <li
        v-for="item in filterList"
        :key="item.id"
        class="flex flex-col px-2 border-b border-border"
      >
        <div
          class="py-4 flex flex-row justify-between cursor-pointer"
          @click="toggleExpandedStatus(item.id)"
        >
          <div class="flex flex-row">
            <h5 class="font-bold mr-4">{{ item.title }}</h5>
            <div class="flex flex-row items-center text-xs" v-if="isStudent()">
              <div
                class="status py-0.5 px-2 mr-2 rounded-full overflow-hidden text-white"
                :class="judgeStatusColor(getStatus(item.id)?.status || 'uncompleted')"
              >
                {{ judgeStatus(getStatus(item.id)?.status || 'uncompleted') }}
              </div>
              <div
                class="score py-0.5 px-2 mr-2 rounded-full overflow-hidden bg-normal text-white"
                v-if="getStatus(item.id)?.status === 'checked'"
              >
                得分：{{ getStatus(item.id)?.score }}
              </div>
            </div>
          </div>
          <div class="flex flex-row items-center">
            <el-icon :size="20" class="text-regular">
              <ArrowRight v-if="!expandedStatus[item.id]" />
              <ArrowDown v-else />
            </el-icon>
          </div>
        </div>
        <div class="detail" v-if="expandedStatus[item.id]">
          <div class="flex mb-4">
            <p class="text-xs text-primary mr-4">
              创建时间：
              <span>{{ timeFormat(item.created_time) }}</span>
            </p>
            <p class="text-xs text-primary">
              截止时间：
              <span>{{ timeFormat(item.deadline) }}</span>
            </p>
          </div>
          <div class="requirement mb-4 text-sm">
            <p class="text-sm text-primary mb-1">作业要求：</p>
            <p>{{ item.description }}</p>
          </div>
          <div class="mb-4">
            <el-button
              type="primary"
              size="small"
              @click="onEditHomeworkStudentBtnClicked(item.id)"
              v-if="isStudent()"
            >
              完成详情
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="onEditHomeworkTeacherBtnClicked(item.id)"
              v-if="isTeacher()"
            >
              编辑作业
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="onCheckHomeWorkBtnClicked(item.id)"
              v-if="isTeacher()"
            >
              批改作业
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="onDeleteHomeworkBtnClicked(item.id)"
              v-if="isTeacher()"
            >
              删除
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="onEndHomeworkBtnClicked(item.id)"
              v-if="isTeacher()"
            >
              截止提交
            </el-button>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <dialog-edit-homework-student
    :lesson-id="lesson.id"
    v-model="isEditHomeworkStudentDialogVisible"
    :data="editHomeworkStudentModel"
    @update-data="updateData"
  ></dialog-edit-homework-student>
  <dialog-edit-homework-teacher
    :lesson-id="lesson.id"
    v-model="isEditHomeworkTeacherDialogVisible"
    :data="editHomeworkTeacherModel"
    @update-data="updateData"
  ></dialog-edit-homework-teacher>
  <dialog-check-homework
    :lesson-id="lesson.id"
    v-model="isCheckHomeWorkDialogVisible"
    :task-id="checkingTaskId"
  ></dialog-check-homework>
</template>

<style scoped></style>
