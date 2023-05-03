<script setup lang="ts">
import { getOptions, putOption } from '@/api/admin'
import { reactive, ref, watchEffect } from 'vue'
import { ElMessage } from 'element-plus'

const data = reactive<{ [key: string]: unknown }>({})

const semesterModel = reactive({
  year: -1,
  term: -1
})
const isSemesterEditDialogShow = ref(false)
const onSemesterEditBtnClicked = () => {
  Object.assign(semesterModel, data.semester)
  isSemesterEditDialogShow.value = true
}
const onSemesterDialogCommitBtnClicked = () => {
  putOption({
    key: 'semester',
    value: JSON.stringify(semesterModel)
  }).then(() => {
    ElMessage.success('修改成功')
    isSemesterEditDialogShow.value = false
    fetchData()
  })
}
const onSemesterDialogCancelBtnClicked = () => {
  isSemesterEditDialogShow.value = false
}

const fetchData = () => {
  getOptions().then((res) => {
    res.forEach((item) => {
      data[item.key] = JSON.parse(item.value)
    })
  })
}

watchEffect(fetchData)
</script>

<template>
  <div class="p-2 sm:p-4 sm:h-full">
    <ul>
      <li class="px-4 py-4 border-b border-b-border">
        <div class="mb-2 flex items-end">
          <h4 class="text-lg mr-4">当前学期</h4>
          <p class="text-xs mr-4">
            年度：{{ (data.semester as any)?.year }}；学期：{{ (data.semester as any)?.term }}
          </p>
          <el-button type="primary" @click="onSemesterEditBtnClicked">编辑</el-button>
        </div>
      </li>
    </ul>
    <el-dialog v-model="isSemesterEditDialogShow" title="当前学期" class="w-5/6 sm:w-1/2">
      <el-form>
        <el-form-item label="年度">
          <el-input-number
            v-model="semesterModel.year"
            :min="1900"
            :max="2100"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="学期">
          <el-input-number
            v-model="semesterModel.term"
            :min="1"
            :max="2"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="onSemesterDialogCommitBtnClicked">提交</el-button>
        <el-button @click="onSemesterDialogCancelBtnClicked">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
