<script setup lang="ts">
import { postLogin } from '@/api/auth'
import { useTokenStore } from '@/stores/token'
import { ElMessage } from 'element-plus'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  redirect?: string
}>()

const tokenStore = useTokenStore()
const router = useRouter()

const scopeList = [
  {
    label: '学生',
    value: 'student'
  },
  {
    label: '教师',
    value: 'teacher'
  },
  {
    label: '管理员',
    value: 'admin'
  }
]

const loginModel = reactive({
  scope: 'student',
  username: '',
  password: ''
})

const onLoginBtnClicked = () => {
  if (loginModel.username === '' || loginModel.password === '') {
    ElMessage.error('账号或密码不允许为空。')
    return
  }
  ElMessage.info('正在登录...')
  postLogin(loginModel)
    .then((res) => {
      tokenStore.token = res.access_token
      ElMessage.success('登录成功')
      router.push(props.redirect || '/')
    })
    .catch(() => {
      ElMessage.error('账号或密码错误。')
    })
}
</script>

<template>
  <div class="absolute w-full h-full flex items-center justify-center">
    <div class="sm:w-1/4 w-2/3 flex-col items-stretch">
      <h3 class="mb-6 text-2xl">登录</h3>
      <el-form class="mb-4">
        <el-form-item label="身份">
          <el-select v-model="loginModel.scope" placeholder="请选择身份" class="w-full">
            <el-option
              v-for="item in scopeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="loginModel.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginModel.password" show-password placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="onLoginBtnClicked" class="w-full">登录</el-button>
    </div>
  </div>
</template>

<style scoped></style>
