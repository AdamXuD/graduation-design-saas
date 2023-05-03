<script setup lang="ts">
import { reactive, ref, watch, watchEffect } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { Class } from '@/types/class'
import { getClassList, postClass, putClass, deleteClass, getProfessionList } from '@/api/admin'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'

const pageSize = ref(10)
const currentPage = ref(1)
const keyword = ref('')

const classList = reactive<Class[]>([])
const total = ref(1)

const fetchData = () => {
  getClassList({
    page: currentPage.value,
    page_size: pageSize.value,
    keyword: keyword.value
  }).then((res) => {
    classList.length = 0
    classList.push(...res.data)
    total.value = Number(res.total)
  })
}

watch(
  () => [keyword, currentPage],
  () => (pageSize.value = 1)
)
watchEffect(fetchData)

const isClassEditDialogVisible = ref(false)
const classModel = reactive({
  id: -1,
  grade: -1,
  profession_id: -1,
  name: ''
})
const onNewBtnClicked = () => {
  Object.assign(classModel, {
    id: -1,
    grade: new Date().getFullYear(),
    profession_id: undefined,
    name: ''
  })
  isClassEditDialogVisible.value = true
}
const onEditBtnClicked = (data: Class) => {
  Object.assign(classModel, data)
  isClassEditDialogVisible.value = true
}
const onDeleteBtnClicked = (id: number) => {
  ElMessageBox.confirm('确认删除该班级吗，该操作无法恢复？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() =>
      deleteClass(id)
        .then(() => {
          ElMessage.success('删除成功')
          return fetchData()
        })
        .catch(() => {
          ElMessage.error('删除失败，其下包含学生无法删除。')
        })
    )
    .catch(() => {})
}
const formRef = ref<FormInstance>()
const formRules = reactive<FormRules>({
  grade: [{ required: true, message: '年级不允许为空', trigger: 'blur' }],
  name: [
    { required: true, message: '班级名称不允许为空', trigger: 'blur' },
    { max: 32, message: '班级名称不允许超过32个字符', trigger: 'blur' }
  ],
  profession_id: [{ required: true, message: '请选择所属专业', trigger: 'change' }]
})
const onClassEditDialogCommitBtnClicked = () => {
  formRef.value?.validate((valid) => {
    if (!valid) return
    if (classModel.id === -1) {
      postClass({
        grade: classModel.grade,
        profession_id: classModel.profession_id,
        name: classModel.name
      }).then(() => {
        ElMessage.success('新建成功')
        isClassEditDialogVisible.value = false
        return fetchData()
      })
    } else {
      putClass(classModel).then(() => {
        ElMessage.success('修改成功')
        isClassEditDialogVisible.value = false
        return fetchData()
      })
    }
  })
}
const onClassEditDialogCancelBtnClicked = () => {
  isClassEditDialogVisible.value = false
}

const professionSelectorLoading = ref(false)
const professionSelectorOptions = reactive<{ value: number; label: string }[]>([])
const professionSelectorRemoteMethod = (keyword: string) => {
  professionSelectorLoading.value = true
  getProfessionList({
    page: 1,
    page_size: 10,
    keyword
  }).then((res) => {
    professionSelectorOptions.length = 0
    professionSelectorOptions.push(
      ...res.data.map((item) => ({
        value: item.id,
        label: `${item.id}:${item.name}`
      }))
    )
    professionSelectorLoading.value = false
  })
}
</script>

<template>
  <div class="flex flex-col p-2 sm:p-4 sm:h-full">
    <div class="mb-4 flex items-center">
      <el-button type="primary" :icon="Plus" class="mr-2" @click="onNewBtnClicked">新建</el-button>
      <el-input placeholder="关键词检索" v-model="keyword"></el-input>
    </div>
    <el-table :data="classList" stripe class="flex-1 mb-4">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="grade" label="Grade" width="80"></el-table-column>
      <el-table-column prop="profession_id" label="ProID" width="80"></el-table-column>
      <el-table-column prop="name" label="Name" min-width="120" />
      <el-table-column label="Action" width="160">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="onEditBtnClicked(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="onDeleteBtnClicked(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:page-size="pageSize"
      v-model:current-page="currentPage"
      layout="prev, pager, next"
      :total="total"
    />
  </div>
  <el-dialog
    v-model="isClassEditDialogVisible"
    :title="classModel.id === -1 ? '新建' : '编辑'"
    class="w-5/6 sm:w-1/2"
  >
    <el-form :model="classModel" ref="formRef" :rules="formRules">
      <el-form-item label="年级" prop="grade">
        <el-input-number
          v-model="classModel.grade"
          :min="1900"
          :max="2100"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="专业" prop="profession_id">
        <el-select
          v-model="classModel.profession_id"
          filterable
          clearable
          remote
          placeholder="请输入关键词"
          remote-show-suffix
          :remote-method="professionSelectorRemoteMethod"
          :loading="professionSelectorLoading"
        >
          <el-option
            v-for="item in professionSelectorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="classModel.name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onClassEditDialogCommitBtnClicked">提交</el-button>
      <el-button @click="onClassEditDialogCancelBtnClicked">取消</el-button>
    </template>
  </el-dialog>
</template>

<style scoped></style>
