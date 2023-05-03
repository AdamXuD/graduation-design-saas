<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { reactive, watchEffect } from 'vue'
import { judgeImage } from '@/hooks'
import type { TaskStatus } from '@/types/task_status'
import { getHomeworkChecking, putHomeworkChecking } from '@/api/lesson'

const props = defineProps<{
  modelValue: boolean
  lessonId: number
  taskId: number
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const data = reactive<TaskStatus[]>([])
watchEffect(() => {
  if (props.lessonId < 0 || props.taskId < 0) return

  getHomeworkChecking(props.lessonId, props.taskId).then((res) => {
    data.length = 0
    data.push(...res)
  })
})

const model = reactive({
  id: -1,
  task_id: -1,
  status: '',
  student_id: '',
  text: '',
  files: [] as {
    url: string
    filename: string
  }[],
  score: 0
})

const onUncheckedTasksListItemClicked = (row: TaskStatus) => {
  Object.assign(model, {
    ...row,
    files: JSON.parse(row.files) as {
      filename: string
      url: string
    }[]
  })
}

const onCheckHomeWorkDialogSubmitBtnClicked = () => {
  if (model.task_id < 0) {
    ElMessage.error('请先选择作业')
    return
  }
  putHomeworkChecking(props.lessonId, model.task_id, {
    student_id: model.student_id,
    score: model.score
  })
    .then(() => {
      data.splice(
        data.findIndex((item) => item.id === model.id),
        1,
        { ...model, status: 'checked', files: JSON.stringify(model.files) }
      )
      ElMessage.success('批改完成')
    })
    .catch(() => {
      ElMessage.error('批改失败')
    })
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="作业批改"
    class="w-5/6 sm:w-4/5"
  >
    <div class="flex flex-col sm:flex-row">
      <div
        class="w-full sm:w-1/4 mb-4 sm:mb-0 mr-0 sm:mr-4 border border-border rounded-lg overflow-hidden"
      >
        <el-table
          :data="data"
          width="100%"
          height="100%"
          @row-click="onUncheckedTasksListItemClicked"
        >
          <el-table-column label="学生">
            <template #default="{ row }">
              {{ row.student_id }}
            </template>
          </el-table-column>
          <el-table-column label="分数" width="128">
            <template #default="{ row }">
              {{ row.score >= 0 ? row.score : '未批改' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="flex-1">
        <el-form>
          <el-form-item label="学号">
            <el-input :model-value="model.student_id" disabled></el-input>
          </el-form-item>
          <el-form-item label="文本">
            <el-input
              type="textarea"
              :autosize="{ minRows: 8 }"
              :model-value="model.text"
            ></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <ul class="attachment mb-4 flex flex-row items-center flex-wrap">
              <li v-if="model.files.length === 0">（无附件）</li>
              <li
                v-else
                v-for="item in model.files"
                :key="item.filename"
                class="w-24 h-24 mr-2 mb-2 border border-border rounded-md overflow-hidden"
              >
                <el-image
                  v-if="judgeImage(item.filename)"
                  :src="item.url"
                  fit="cover"
                  :preview-src-list="[item.url]"
                  class="w-full h-full"
                ></el-image>
                <a
                  v-else
                  class="h-full w-full flex items-center justify-center"
                  :href="item.url"
                  target="_blank"
                >
                  <el-icon :size="48" class="text-border">
                    <Document />
                  </el-icon>
                </a>
              </li>
            </ul>
          </el-form-item>
          <el-form-item>
            <div class="h-px w-full bg-border"></div>
          </el-form-item>
          <el-form-item label="分数">
            <div class="w-full pr-2 flex justify-between">
              <el-input-number
                v-model="model.score"
                :min="0"
                :max="100"
                controls-position="right"
              ></el-input-number>
              <el-button type="primary" @click="onCheckHomeWorkDialogSubmitBtnClicked">
                提交
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped></style>
