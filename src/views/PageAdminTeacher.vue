<script setup lang="ts">
import { reactive, ref, watch, watchEffect } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { Teacher } from '@/types/teacher'
import { deleteTeacher, getTeacherList, postTeacher, putTeacher } from '@/api/admin'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { MoreFilled } from '@element-plus/icons-vue'

const pageSize = ref(10)
const currentPage = ref(1)
const keyword = ref('')

const teacherList = reactive<Teacher[]>([])
const total = ref(1)

const fetchData = () => {
  getTeacherList({
    page_size: pageSize.value,
    page: currentPage.value,
    keyword: keyword.value
  }).then((res) => {
    teacherList.length = 0
    teacherList.push(...res.data)
    total.value = Number(res.total)
  })
}

watch(
  () => [keyword, currentPage],
  () => (pageSize.value = 1)
)
watchEffect(fetchData)

const isTeacherEditDialogVisible = ref(false)
const teacherModel = reactive({
  old_id: '',
  new_id: '',
  name: '',
  email: '',
  phone: '',
  introduction: '',
  avatar: '',
  password_reset: false
})
const onNewBtnClicked = () => {
  Object.assign(teacherModel, {
    old_id: '',
    new_id: '',
    name: '',
    email: '',
    phone: '',
    introduction: '',
    avatar: '',
    password_reset: true
  })
  isTeacherEditDialogVisible.value = true
}
const onEditBtnClicked = (data: Teacher) => {
  Object.assign(teacherModel, {
    ...data,
    old_id: data.id,
    new_id: data.id,
    password_reset: false
  })
  isTeacherEditDialogVisible.value = true
}
const onDeleteBtnClicked = (id: string) => {
  ElMessageBox.confirm('确认删除该教师吗，该操作无法恢复？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() =>
      deleteTeacher(id)
        .then(() => {
          ElMessage.success('删除成功')
          return fetchData()
        })
        .catch(() => {
          ElMessage.error('删除失败')
        })
    )
    .catch(() => {})
}
const formRef = ref<FormInstance>()
const formRules = reactive<FormRules>({
  name: [
    { required: true, message: '姓名不允许为空', trigger: 'blur' },
    { max: 16, message: '姓名长度不允许超过16个字符', trigger: 'blur' }
  ],
  new_id: [
    { required: true, message: '工号不允许为空', trigger: 'blur' },
    { min: 10, max: 10, message: '工号长度必须为10位', trigger: 'blur' }
  ],
  email: [
    { max: 255, message: '邮箱长度不允许超过255个字符', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  phone: [{ min: 11, max: 11, message: '手机号长度必须为11位', trigger: 'blur' }]
})
const onTeacherEditDialogCommitBtnClicked = () => {
  formRef.value?.validate((valid) => {
    if (!valid) return
    if (teacherModel.old_id === '') {
      postTeacher({
        id: teacherModel.new_id,
        name: teacherModel.name,
        email: teacherModel.email,
        phone: teacherModel.phone,
        introduction: teacherModel.introduction,
        avatar: teacherModel.avatar
      }).then(() => {
        ElMessage.success('新建成功')
        isTeacherEditDialogVisible.value = false
        return fetchData()
      })
    } else {
      putTeacher(teacherModel.old_id, {
        id: teacherModel.new_id,
        name: teacherModel.name,
        email: teacherModel.email,
        phone: teacherModel.phone,
        introduction: teacherModel.introduction,
        avatar: teacherModel.avatar,
        reset_password: teacherModel.password_reset
      }).then(() => {
        ElMessage.success('修改成功')
        isTeacherEditDialogVisible.value = false
        return fetchData()
      })
    }
  })
}
const onTeacherEditDialogCancelBtnClicked = () => {
  isTeacherEditDialogVisible.value = false
}
</script>

<template>
  <div class="flex flex-col p-2 sm:p-4 sm:h-full">
    <div class="mb-4 flex items-center">
      <el-button type="primary" :icon="Plus" class="mr-2" @click="onNewBtnClicked">
        新建
      </el-button>
      <el-input placeholder="关键词检索" v-model="keyword"></el-input>
    </div>
    <el-table :data="teacherList" stripe class="flex-1 mb-4">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="name" label="Name" min-width="120" />
      <el-table-column label="Email" width="72">
        <template #default="{ row }">
          <el-popover placement="top" trigger="hover" :content="row.email">
            <template #reference>
              <el-button size="small" :icon="MoreFilled" round></el-button>
            </template>
            <p v-if="row.email && row.email.length > 0">{{ row.email }}</p>
            <p v-else>（空）</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="Phone" width="72">
        <template #default="{ row }">
          <el-popover placement="top" trigger="hover">
            <template #reference>
              <el-button size="small" :icon="MoreFilled" round></el-button>
            </template>
            <p v-if="row.phone && row.phone.length > 0">{{ row.phone }}</p>
            <p v-else>（空）</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="Intro" width="72">
        <template #default="{ row }">
          <el-popover placement="top" trigger="hover">
            <template #reference>
              <el-button size="small" :icon="MoreFilled" round></el-button>
            </template>
            <p v-if="row.introduction && row.introduction.length > 0">{{ row.introduction }}</p>
            <p v-else>（空）</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="Avatar" width="72">
        <template #default="{ row }">
          <el-popover placement="top" trigger="hover">
            <template #reference>
              <el-button size="small" :icon="MoreFilled" round></el-button>
            </template>
            <el-image :src="row.avatar" v-if="row.avatar && row.avatar.length > 0"></el-image>
            <p v-else>（空）</p>
          </el-popover>
        </template>
      </el-table-column>
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
    v-model="isTeacherEditDialogVisible"
    :title="teacherModel.old_id === '' ? '新建' : '编辑'"
    class="w-5/6 sm:w-1/2"
  >
    <el-form :model="teacherModel" label-width="80" :rules="formRules" ref="formRef">
      <el-form-item label="ID" prop="new_id">
        <el-input v-model="teacherModel.new_id" :maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="teacherModel.name"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="teacherModel.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="teacherModel.phone"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-input v-model="teacherModel.avatar"></el-input>
      </el-form-item>
      <el-form-item label="自我介绍" prop="introduction">
        <el-input v-model="teacherModel.introduction" :rows="2" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="重置密码" prop="password_reset">
        <el-switch v-model="teacherModel.password_reset"></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onTeacherEditDialogCommitBtnClicked">提交</el-button>
      <el-button @click="onTeacherEditDialogCancelBtnClicked">取消</el-button>
    </template>
  </el-dialog>
</template>

<style scoped></style>
