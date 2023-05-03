<script setup lang="ts">
import { useTokenStore } from '@/stores/token'
import type { Admin } from '@/types/admin'
import type { Student } from '@/types/student'
import type { Teacher } from '@/types/teacher'
import type { Class } from '@/types/class'
import type { Profession } from '@/types/profession'
import { getPersonalInfo, putPersonalInfo, putPassword } from '@/api/public'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const personalInfo = reactive<{
  personal: Student | Teacher | Admin
  class?: Class
  profession?: Profession
}>({
  personal: {
    id: '',
    name: '',
    email: '',
    phone: '',
    introduction: '',
    avatar: ''
  }
})

const updatePersonalInfo = () => {
  getPersonalInfo().then((res) => {
    personalInfo.personal = res.personal
    if (res.class_) personalInfo.class = res.class_
    if (res.profession) personalInfo.profession = res.profession
  })
}
updatePersonalInfo()

const router = useRouter()
const tokenStore = useTokenStore()

const personalInfoDialogVisible = ref(false)

const isPersonalInfoEditing = ref(false)
const isPasswordEditing = ref(false)

const onPersonalInfoDialogBtnClicked = () => {
  personalInfoDialogVisible.value = true
}
const onPersonalInfoDialogClosed = () => {
  isPersonalInfoEditing.value = false
  isPasswordEditing.value = false
}

const personalInfoModel = reactive({
  email: '',
  phone: '',
  introduction: '',
  avatar: ''
})
const onPersonalInfoEditBtnClicked = () => {
  personalInfoModel.email = personalInfo.personal.email
  personalInfoModel.phone = personalInfo.personal.phone
  personalInfoModel.introduction = personalInfo.personal.introduction
  personalInfoModel.avatar = personalInfo.personal.avatar
  isPersonalInfoEditing.value = true
}
const onPersonalInfoSubmitBtnClicked = () => {
  putPersonalInfo(personalInfoModel)
    .then(() => {
      ElMessage.success('修改成功')
      updatePersonalInfo()
      isPersonalInfoEditing.value = false
    })
    .catch(() => {
      ElMessage.error('修改失败')
    })
}
const onPersonalInfoCancelBtnClicked = () => {
  isPersonalInfoEditing.value = false
}

const passwordModel = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const onPasswordEditBtnClicked = () => {
  passwordModel.oldPassword = ''
  passwordModel.newPassword = ''
  passwordModel.confirmPassword = ''
  isPasswordEditing.value = true
}
const onPasswordSubmitBtnClicked = () => {
  if (passwordModel.newPassword !== passwordModel.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  if (passwordModel.newPassword.length < 6) {
    ElMessage.error('密码长度不能小于6位')
    return
  }
  putPassword({
    old_password: passwordModel.oldPassword,
    new_password: passwordModel.newPassword
  })
    .then(() => {
      ElMessage.success('修改成功，请重新登录。')
      tokenStore.token = ''
      isPasswordEditing.value = false
      personalInfoDialogVisible.value = false
      router.push({ path: '/login' })
    })
    .catch(() => {
      ElMessage.error('修改失败')
    })
}
const onPasswordCancelBtnClicked = () => {
  isPasswordEditing.value = false
}

const onLogoutBtnClicked = () => {
  tokenStore.token = ''
  ElMessage.success('退出登录成功。')
  router.push({ path: '/login' })
}
</script>

<template>
  <el-popover :width="240" placement="bottom" :teleported="false">
    <template #reference>
      <div class="account w-8 h-8 rounded-full overflow-hidden cursor-pointer" title="个人信息">
        <img
          v-if="personalInfo.personal.avatar.length !== 0"
          class="w-full h-full object-cover"
          :src="personalInfo.personal.avatar"
          alt=""
        />
        <div v-else class="w-full h-full bg-fill flex items-center justify-center">
          {{ personalInfo.personal.name[0] }}
        </div>
      </div>
    </template>
    <template #default>
      <div class="flex flex-col items-center">
        <div class="w-16 h-16 rounded-full overflow-hidden mb-4">
          <img
            v-if="personalInfo.personal.avatar.length !== 0"
            :src="personalInfo.personal.avatar"
            alt=""
          />
          <div v-else class="w-full h-full bg-fill flex items-center justify-center text-3xl">
            {{ personalInfo.personal.name[0] }}
          </div>
        </div>
        <div class="main flex flex-col items-center mb-2">
          <h3 class="font-bold mb-2">{{ personalInfo.personal.name }}</h3>
          <p>{{ personalInfo.personal.id }}</p>
        </div>
        <div class="pb-2 mb-2 border-b border-border">
          <p v-if="personalInfo.class">年级：{{ personalInfo.class.grade }}</p>
          <p v-if="personalInfo.profession">专业：{{ personalInfo.profession.name }}</p>
          <p>邮箱：{{ personalInfo.personal.email }}</p>
          <p>手机：{{ personalInfo.personal.phone }}</p>
          <p>简介：{{ personalInfo.personal.introduction }}</p>
        </div>
        <div class="flex w-full">
          <div
            class="cursor-pointer w-1/2 text-center border-r border-border"
            @click="onPersonalInfoDialogBtnClicked"
          >
            编辑资料
          </div>
          <div class="cursor-pointer w-1/2 text-center" @click="onLogoutBtnClicked">退出登录</div>
        </div>
      </div>
    </template>
  </el-popover>
  <el-dialog
    v-model="personalInfoDialogVisible"
    title="编辑个人资料"
    @closed="onPersonalInfoDialogClosed"
    class="w-5/6 sm:w-1/2 z-20"
  >
    <div>
      <div class="main flex flex-col items-center mb-4">
        <div class="avatar w-24 h-24 rounded-full overflow-hidden mb-4">
          <img
            v-if="personalInfo.personal.avatar.length !== 0"
            :src="personalInfo.personal.avatar"
            alt=""
          />
          <div v-else class="w-full h-full bg-fill flex items-center justify-center text-3xl">
            {{ personalInfo.personal.name[0] }}
          </div>
        </div>
        <div class="main flex flex-col items-center mb-2">
          <h3 class="font-bold mb-2">{{ personalInfo.personal.name }}</h3>
          <p>{{ personalInfo.personal.id }}</p>
        </div>
        <p v-if="personalInfo.class">年级：{{ personalInfo.class.grade }}</p>
        <p v-if="personalInfo.profession">专业：{{ personalInfo.profession.name }}</p>
      </div>
      <div class="editable mb-4">
        <div class="flex flex-row">
          <h3 class="font-bold pb-2 mb-4 border-b border-border mr-4">可编辑资料</h3>
          <el-button type="primary" size="small" @click="onPersonalInfoEditBtnClicked">
            编辑
          </el-button>
        </div>
        <div class="flex flex-col" v-if="isPersonalInfoEditing">
          <el-form :model="personalInfoModel" label-width="48px">
            <el-form-item label="邮箱">
              <el-input v-model="personalInfoModel.email"></el-input>
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="personalInfoModel.phone"></el-input>
            </el-form-item>
            <el-form-item label="简介">
              <el-input v-model="personalInfoModel.introduction"></el-input>
            </el-form-item>
          </el-form>
          <div class="flex flex-row items-center self-end" v-if="isPersonalInfoEditing">
            <el-button type="primary" @click="onPersonalInfoSubmitBtnClicked"> 提交 </el-button>
            <el-button @click="onPersonalInfoCancelBtnClicked"> 取消 </el-button>
          </div>
        </div>
      </div>
      <div class="password">
        <div class="flex flex-row">
          <h3 class="font-bold pb-2 mb-4 border-b border-border mr-4">修改密码</h3>
          <el-button type="primary" size="small" @click="onPasswordEditBtnClicked">
            编辑
          </el-button>
        </div>
        <div class="flex flex-col" v-if="isPasswordEditing">
          <el-form :model="passwordModel" label-width="72px">
            <el-form-item label="原密码">
              <el-input v-model="passwordModel.oldPassword" show-password></el-input>
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="passwordModel.newPassword" show-password></el-input>
            </el-form-item>
            <el-form-item label="再次输入">
              <el-input v-model="passwordModel.confirmPassword" show-password></el-input>
            </el-form-item>
          </el-form>
          <div class="flex flex-row items-center self-end">
            <el-button type="primary" @click="onPasswordSubmitBtnClicked"> 提交 </el-button>
            <el-button @click="onPasswordCancelBtnClicked"> 取消 </el-button>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="personalInfoDialogVisible = false">完成</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
