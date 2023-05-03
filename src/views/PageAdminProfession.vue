<script setup lang="ts">
import { reactive, ref, watch, watchEffect } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { Profession } from '@/types/profession'
import { getProfessionList, postProfession, putProfession, deleteProfession } from '@/api/admin'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'

const pageSize = ref(10)
const currentPage = ref(1)
const keyword = ref('')

const professionList = reactive<Profession[]>([])
const total = ref(1)

const fetchData = () => {
  getProfessionList({
    page: currentPage.value,
    page_size: pageSize.value,
    keyword: keyword.value
  }).then((res) => {
    professionList.length = 0
    professionList.push(...res.data)
    total.value = Number(res.total)
  })
}

watch(
  () => [keyword, currentPage],
  () => (pageSize.value = 1)
)
watchEffect(fetchData)

const isProfessionEditDialogVisible = ref(false)
const professionModel = reactive({
  id: -1,
  name: ''
})
const onNewBtnClicked = () => {
  Object.assign(professionModel, { id: -1, name: '' })
  isProfessionEditDialogVisible.value = true
}
const onEditBtnClicked = (data: Profession) => {
  Object.assign(professionModel, data)
  isProfessionEditDialogVisible.value = true
}
const onDeleteBtnClicked = (id: number) => {
  ElMessageBox.confirm('确认删除该专业吗，该操作无法恢复？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() =>
      deleteProfession(id)
        .then(() => {
          ElMessage.success('删除成功')
          return fetchData()
        })
        .catch(() => {
          ElMessage.error('删除失败，其下有班级无法删除。')
        })
    )
    .catch(() => {})
}
const formRef = ref<FormInstance>()
const formRules = reactive<FormRules>({
  name: [
    { required: true, message: '专业名称不允许为空', trigger: 'blur' },
    { min: 1, max: 20, message: '专业名称长度在 1 到 20 个字符', trigger: 'blur' }
  ]
})
const onProfessionEditDialogCommitBtnClicked = () => {
  formRef.value?.validate((valid) => {
    if (!valid) return
    if (professionModel.id === -1) {
      postProfession({ name: professionModel.name }).then(() => {
        ElMessage.success('新建成功')
        isProfessionEditDialogVisible.value = false
        return fetchData()
      })
    } else {
      putProfession(professionModel).then(() => {
        ElMessage.success('修改成功')
        isProfessionEditDialogVisible.value = false
        return fetchData()
      })
    }
  })
}
const onProfessionEditDialogCancelBtnClicked = () => {
  isProfessionEditDialogVisible.value = false
}
</script>

<template>
  <div class="flex flex-col p-2 sm:p-4 sm:h-full">
    <div class="mb-4 flex items-center">
      <el-button type="primary" :icon="Plus" class="mr-2" @click="onNewBtnClicked">新建</el-button>
      <el-input placeholder="关键词检索" v-model="keyword"></el-input>
    </div>
    <el-table :data="professionList" stripe class="flex-1 mb-4">
      <el-table-column prop="id" label="ID" width="60" />
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
    v-model="isProfessionEditDialogVisible"
    :title="professionModel.id === -1 ? '新建' : '编辑'"
    class="w-5/6 sm:w-1/2"
  >
    <el-form :model="professionModel" ref="formRef" :rules="formRules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="professionModel.name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onProfessionEditDialogCommitBtnClicked">提交</el-button>
      <el-button @click="onProfessionEditDialogCancelBtnClicked">取消</el-button>
    </template>
  </el-dialog>
</template>

<style scoped></style>
