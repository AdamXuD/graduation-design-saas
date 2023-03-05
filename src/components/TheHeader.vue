<script setup lang="ts">
import { personalInfo, dynamics, message } from '@/fakeData'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'

const dynamicOutline = computed(() => {
  return dynamics
    .map((item) => {
      return {
        lesson: item.lesson,
        lesson_id: item.lesson_id,
        teacher: item.teacher,
        outline: item.content.slice(0, 10) + '...',
        time: item.time
      }
    })
    .slice(0, 3)
})

const messageOutline = computed(() => {
  return message
    .map((item) => {
      return {
        id: item.id,
        from: item.from,
        outline: item.content.slice(0, 10) + '...',
        time: item.time,
        isRead: item.isRead
      }
    })
    .slice(0, 3)
})

const timeFormat = (time: number) => {
  const date = new Date(time * 1000)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

const onEditPersonalInfoBtnClicked = () => {
  personalInfoDialogVisible.value = true
}
const personalInfoDialogVisible = ref(false)
const personalInfoEditStatus = reactive({
  info: false,
  password: false
})
const personalInfoModel = reactive({
  email: '',
  phone: '',
  introduction: ''
})
const passwordModel = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const onPersonalInfoEditBtnClicked = () => {
  personalInfoModel.email = personalInfo.email
  personalInfoModel.phone = personalInfo.phone
  personalInfoModel.introduction = personalInfo.introduction
  personalInfoEditStatus.info = true
}
const onPasswordEditBtnClicked = () => {
  passwordModel.oldPassword = ''
  passwordModel.newPassword = ''
  passwordModel.confirmPassword = ''
  personalInfoEditStatus.password = true
}
const onPersonalInfoSubmitBtnClicked = () => {
  personalInfo.email = personalInfoModel.email
  personalInfo.phone = personalInfoModel.phone
  personalInfo.introduction = personalInfoModel.introduction
  ElMessage.success('修改成功')
  personalInfoEditStatus.info = false
}
const onPersonalInfoCancelBtnClicked = () => {
  personalInfoEditStatus.info = false
}
const onPasswordSubmitBtnClicked = () => {
  if (passwordModel.newPassword !== passwordModel.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
  } else {
    ElMessage.success('修改成功')
    personalInfoEditStatus.password = false
  }
}
const onPasswordCancelBtnClicked = () => {
  personalInfoEditStatus.password = false
}
const onPersonalInfoDialogClosed = () => {
  personalInfoEditStatus.info = false
  personalInfoEditStatus.password = false
}
</script>

<template>
  <header
    class="header h-[96px] border-b border-[#eaeaea] flex flex-row items-center justify-between px-[32px]"
  >
    <h1 class="page-title text-[24px]">
      {{ $route.meta.title }}
    </h1>
    <div class="btn-group flex flex-row items-center justify-between w-[128px]">
      <el-popover :width="240" placement="bottom" :teleported="false">
        <template #reference>
          <div
            class="btn cursor-pointer w-[32px] h-[32px] rounded-full overflow-hidden hover:bg-[#efefef] flex items-center justify-center transition-all"
            title="动态"
          >
            <el-icon :size="20">
              <WindPower />
            </el-icon>
          </div>
        </template>
        <template #default>
          <div class="text-[16px] font-bold pb-[10px] border-b border-[#eaeaea]">动态</div>
          <ul>
            <li v-for="(item, index) in dynamicOutline" :key="index">
              <router-link
                :to="`/lesson/${item.lesson_id}`"
                class="py-[8px] border-b border-[#eaeaea] flex flex-col"
              >
                <div class="title flex flex-row items-center mb-[8px]">
                  <h3 class="mr-[8px]">{{ item.lesson }}</h3>
                  <p>{{ item.teacher }}</p>
                </div>
                <p class="text-[#000] text-[16px] mb-[8px]">{{ item.outline }}</p>
                <p>{{ timeFormat(item.time) }}</p>
              </router-link>
            </li>
            <li class="text-center">...</li>
          </ul>
        </template>
      </el-popover>
      <el-popover :width="240" placement="bottom" :teleported="false">
        <template #reference>
          <div
            class="btn cursor-pointer w-[32px] h-[32px] rounded-full overflow-hidden hover:bg-[#efefef] flex items-center justify-center transition-all"
            title="信息"
          >
            <el-icon :size="20">
              <Message />
            </el-icon>
          </div>
        </template>
        <template #default>
          <div class="text-[16px] font-bold pb-[10px] border-b border-[#eaeaea]">信息</div>
          <ul>
            <li v-for="(item, index) in messageOutline" :key="index">
              <router-link :to="''" class="py-[8px] border-b border-[#eaeaea] flex flex-col">
                <div class="flex flex-row justify-between">
                  <div class="title flex flex-row items-end mb-[8px]">
                    <h3 class="mr-[8px] text-[16px] text-[#000] font-bold">{{ item.from }}</h3>
                    <p>{{ timeFormat(item.time) }}</p>
                  </div>
                  <div
                    v-if="!item.isRead"
                    class="w-[8px] h-[8px] rounded-full overflow-hidden bg-[red]"
                  ></div>
                </div>
                <p class="text-[16px] mb-[8px]">{{ item.outline }}</p>
              </router-link>
            </li>
            <li class="text-center">...</li>
          </ul>
        </template>
      </el-popover>

      <el-popover :width="240" placement="bottom" :teleported="false">
        <template #reference>
          <div
            class="account w-[32px] h-[32px] rounded-full overflow-hidden cursor-pointer"
            title="个人信息"
          >
            <img class="w-full h-full object-cover" :src="personalInfo.avatar" alt="" />
          </div>
        </template>
        <template #default>
          <div class="flex flex-col items-center">
            <div class="w-[64px] h-[64px] rounded-full overflow-hidden mb-[16px]">
              <img :src="personalInfo.avatar" alt="" />
            </div>
            <div class="main flex flex-col items-center mb-[8px]">
              <h3 class="text-[16px] font-bold mb-[8px]">{{ personalInfo.name }}</h3>
              <p>{{ personalInfo.student_id }}</p>
            </div>
            <div class="pb-[8px] mb-[8px] border-b border-[#eaeaea]">
              <p>年级：{{ personalInfo.grade }}</p>
              <p>专业：{{ personalInfo.perfession }}</p>
              <p>邮箱：{{ personalInfo.email }}</p>
              <p>手机：{{ personalInfo.phone }}</p>
              <p>简介：{{ personalInfo.introduction }}</p>
            </div>
            <div class="cursor-pointer" @click="onEditPersonalInfoBtnClicked">编辑资料</div>
          </div>
        </template>
      </el-popover>
    </div>
  </header>
  <el-dialog
    v-model="personalInfoDialogVisible"
    title="编辑个人资料"
    width="50%"
    @closed="onPersonalInfoDialogClosed"
  >
    <div>
      <div class="main flex flex-col items-center mb-[16px]">
        <div class="avatar w-[96px] h-[96px] rounded-full overflow-hidden mb-[16px]">
          <img :src="personalInfo.avatar" alt="" />
        </div>
        <div class="main flex flex-col items-center mb-[8px]">
          <h3 class="text-[16px] font-bold mb-[8px]">{{ personalInfo.name }}</h3>
          <p>{{ personalInfo.student_id }}</p>
        </div>
        <p>年级：{{ personalInfo.grade }}</p>
        <p>专业：{{ personalInfo.perfession }}</p>
      </div>
      <div class="editable text-[16px] mb-[16px]">
        <div class="flex flex-row">
          <h3 class="font-bold pb-[8px] mb-[8px] border-b border-[#eaeaea] mr-[16px]">
            可编辑资料
          </h3>
          <el-button type="primary" size="small" @click="onPersonalInfoEditBtnClicked">
            编辑
          </el-button>
        </div>
        <div v-if="!personalInfoEditStatus.info">
          <p>邮箱：{{ personalInfo.email }}</p>
          <p>手机：{{ personalInfo.phone }}</p>
          <p>简介：{{ personalInfo.introduction }}</p>
        </div>
        <div class="flex flex-col" v-else>
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
          <div class="flex flex-row items-center self-end">
            <el-button type="primary" @click="onPersonalInfoSubmitBtnClicked"> 提交 </el-button>
            <el-button @click="onPersonalInfoCancelBtnClicked"> 取消 </el-button>
          </div>
        </div>
      </div>
      <div class="password text-[16px]">
        <div class="flex flex-row">
          <h3 class="font-bold pb-[8px] mb-[8px] border-b border-[#eaeaea] mr-[16px]">修改密码</h3>
          <el-button type="primary" size="small" @click="onPasswordEditBtnClicked">
            编辑
          </el-button>
        </div>
        <div class="flex flex-col" v-if="personalInfoEditStatus.password">
          <el-form :model="passwordModel" label-width="72px">
            <el-form-item label="原密码">
              <el-input v-model="passwordModel.oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="passwordModel.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="再次输入">
              <el-input v-model="passwordModel.confirmPassword"></el-input>
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
