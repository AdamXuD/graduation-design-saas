<script setup lang="ts">
import { randomString, timeFormat } from '@/hooks'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref, watchEffect } from 'vue'
import { useTokenStore } from '@/stores/token'
import type { Lesson } from '@/types/lesson'
import { putLessonNotice } from '@/api/lesson'

const props = defineProps<{
  lesson: Lesson
}>()

const { isTeacher } = useTokenStore()

interface NoticeItem {
  notice_id: string
  title: string
  content: string
  timestamp: number
}

const isEditDialogVisible = ref(false)

const editModel = reactive<NoticeItem>({
  notice_id: '',
  title: '',
  content: '',
  timestamp: 0
})

const notices = reactive<NoticeItem[]>([])

watchEffect(() => {
  let parsedData: NoticeItem[] = []
  try {
    parsedData = JSON.parse(props.lesson.notice)
  } catch (error) {
    parsedData = []
  }
  notices.length = 0
  notices.push(...parsedData.reverse())
})

const onNewBtnClicked = () => {
  isEditDialogVisible.value = true
  editModel.notice_id = ''
  editModel.title = ''
  editModel.content = ''
  editModel.timestamp = Math.floor(Date.now() / 1000)
}

const onEditBtnClicked = (index: number) => {
  isEditDialogVisible.value = true
  editModel.notice_id = notices[index].notice_id
  editModel.title = notices[index].title
  editModel.content = notices[index].content
  editModel.timestamp = notices[index].timestamp
}

const onDeleteBtnClicked = (index: number) => {
  ElMessageBox.confirm('该公告将会被永久删除，是否继续？', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const copy = [...notices]
      copy.splice(index, 1)
      putLessonNotice(props.lesson.id, JSON.stringify([...copy].reverse()))
        .then(() => {
          notices.length = 0
          notices.push(...copy)
          ElMessage.success('删除成功')
        })
        .catch(() => {
          ElMessage.error('删除失败')
        })
    })
    .catch(() => {})
}

const onCommitBtnClicked = () => {
  if (editModel.notice_id === '') {
    editModel.notice_id = `${Date.now()}-${randomString(6)}`
    const copy = [{ ...editModel }, ...notices].reverse()
    putLessonNotice(props.lesson.id, JSON.stringify(copy))
      .then(() => {
        notices.length = 0
        notices.push(...copy.reverse())
        ElMessage.success('添加成功')
      })
      .catch(() => {
        ElMessage.error('添加失败')
      })
  } else {
    const copy = [...notices].reverse()
    const index = copy.findIndex((item) => item.notice_id === editModel.notice_id)
    copy[index].title = editModel.title
    copy[index].content = editModel.content
    putLessonNotice(props.lesson.id, JSON.stringify(copy))
      .then(() => {
        notices.length = 0
        notices.push(...copy.reverse())
        ElMessage.success('修改成功')
      })
      .catch(() => {
        ElMessage.error('修改失败')
      })
  }
  isEditDialogVisible.value = false
}

const onCancelBtnClicked = () => {
  isEditDialogVisible.value = false
}
</script>

<template>
  <div class="p-4">
    <div class="pb-4 border-b border-border" v-if="isTeacher()">
      <el-button type="primary" :icon="Plus" @click="onNewBtnClicked" class="w-full">
        新建
      </el-button>
    </div>
    <ul>
      <li
        v-for="(item, index) in notices"
        :key="index"
        class="flex flex-col py-4 px-2 border-b border-border"
      >
        <div class="flex justify-between items-center mb-2">
          <h4 class="font-bold text-lg">{{ item.title }}</h4>
          <div class="flex" v-if="isTeacher()">
            <el-button
              type="primary"
              :icon="Edit"
              circle
              size="small"
              @click="onEditBtnClicked(index)"
            />
            <el-button
              type="danger"
              :icon="Delete"
              circle
              size="small"
              @click="onDeleteBtnClicked(index)"
            />
          </div>
        </div>
        <p class="whitespace-pre-wrap mb-2 text-regular">{{ item.content }}</p>
        <p class="self-end text-sm text-secondary">{{ timeFormat(item.timestamp) }}</p>
      </li>
    </ul>
  </div>
  <el-dialog
    v-model="isEditDialogVisible"
    :title="editModel.notice_id.length > 0 ? '编辑' : '新建'"
    class="w-5/6 sm:w-1/2"
  >
    <el-form>
      <el-form-item label="标题">
        <el-input v-model="editModel.title"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="editModel.content" type="textarea" :autosize="{ minRows: 8 }"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onCommitBtnClicked">保存</el-button>
      <el-button @click="onCancelBtnClicked">取消</el-button>
    </template>
  </el-dialog>
</template>

<style scoped></style>
