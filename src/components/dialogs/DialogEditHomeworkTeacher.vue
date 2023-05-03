<script setup lang="ts">
import { postHomework, putHomework } from '@/api/lesson'
import { ElMessage } from 'element-plus'
import { reactive, watchEffect } from 'vue'

const props = defineProps<{
  modelValue: boolean
  lessonId: number
  data: {
    id: number
    title: string
    description: string
    deadline: number
  }
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'updateData'): void
}>()

const model = reactive({
  id: 0,
  title: '',
  description: '',
  deadline: 0
})

watchEffect(() => Object.assign(model, props.data))

const onEditHomeworkTeacherSubmitBtnClicked = () => {
  const data = {
    title: model.title,
    description: model.description,
    deadline: Math.floor(model.deadline / 1000)
  }
  if (model.id === -1) {
    postHomework(props.lessonId, data)
      .then(() => {
        ElMessage.success('作业已上传')
        emits('update:modelValue', false)
        emits('updateData')
      })
      .catch(() => {
        ElMessage.error('作业上传失败')
      })
  } else {
    putHomework(props.lessonId, model.id, data)
      .then(() => {
        ElMessage.success('作业已更新')
        emits('update:modelValue', false)
        emits('updateData')
      })
      .catch(() => {
        ElMessage.error('作业更新失败')
      })
  }
}
const onEditHomeworkTeacherCancelBtnClicked = () => {
  emits('update:modelValue', false)
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="编辑作业"
    class="w-5/6 sm:w-1/2"
  >
    <el-form :model="model" label-width="48px">
      <el-form-item label="标题">
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="要求">
        <el-input v-model="model.description" type="textarea" :autosize="{ minRows: 4 }"></el-input>
      </el-form-item>
      <el-form-item label="DDL">
        <el-date-picker v-model="model.deadline" type="date" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onEditHomeworkTeacherSubmitBtnClicked">提交</el-button>
      <el-button @click="onEditHomeworkTeacherCancelBtnClicked">取消</el-button>
    </template>
  </el-dialog>
</template>

<style scoped></style>
