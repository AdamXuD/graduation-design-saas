<script setup lang="ts">
import { reactive, ref, watch, watchEffect } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { Lesson } from '@/types/lesson'
import {
  getLessonList,
  postLesson,
  putLesson,
  deleteLesson,
  getTeacherList,
  getLessonClassList,
  putLessonClassList,
  getClassList
} from '@/api/admin'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MoreFilled } from '@element-plus/icons-vue'

const pageSize = ref(10)
const currentPage = ref(1)
const keyword = ref('')

const lessonList = reactive<Lesson[]>([])
const total = ref(1)

const fetchData = () => {
  getLessonList({
    page_size: pageSize.value,
    page: currentPage.value,
    keyword: keyword.value
  }).then((res) => {
    lessonList.length = 0
    lessonList.push(...res.data)
    total.value = Number(res.total)
  })
}

watch(
  () => [keyword, currentPage],
  () => (pageSize.value = 1)
)
watchEffect(fetchData)
const isLessonEditDialogVisible = ref(false)
const lessonModel = reactive({
  id: -1,
  thumbnail: '',
  title: '',
  teacher_id: '',
  year: -1,
  term: -1,
  is_over: false,
  notice: '[]',
  courseware: '[]'
})
const onNewBtnClicked = () => {
  const date = new Date()
  Object.assign(lessonModel, {
    id: -1,
    thumbnail: '',
    title: '',
    teacher_id: '',
    year: date.getFullYear(),
    term: date.getMonth() < 6 ? 1 : 2,
    is_over: false,
    notice: '[]',
    courseware: '[]'
  })
  isLessonEditDialogVisible.value = true
}
const onEditBtnClicked = (data: Lesson) => {
  Object.assign(lessonModel, data)
  isLessonEditDialogVisible.value = true
}
const onDeleteBtnClicked = (id: number) => {
  ElMessageBox.confirm('确认删除该课程吗，该操作无法恢复？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() =>
      deleteLesson(id)
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
const onLessonEditDialogCommitBtnClicked = () => {
  if (lessonModel.title.length === 0) {
    ElMessage.error('课程标题不允许为空')
    return
  }
  try {
    JSON.parse(lessonModel.notice)
    JSON.parse(lessonModel.courseware)
  } catch (e) {
    ElMessage.error('课件或公告非法，强烈不建议在此修改课件或公告元数据。')
    return
  }
  if (lessonModel.id === -1) {
    postLesson({
      thumbnail: lessonModel.thumbnail,
      title: lessonModel.title,
      teacher_id: lessonModel.teacher_id,
      year: lessonModel.year,
      term: lessonModel.term,
      is_over: lessonModel.is_over,
      notice: lessonModel.notice,
      courseware: lessonModel.courseware
    }).then(() => {
      ElMessage.success('新建成功')
      isLessonEditDialogVisible.value = false
      return fetchData()
    })
  } else {
    putLesson(lessonModel).then(() => {
      ElMessage.success('修改成功')
      isLessonEditDialogVisible.value = false
      return fetchData()
    })
  }
}
const onLessonEditDialogCancelBtnClicked = () => {
  isLessonEditDialogVisible.value = false
}

const teacherSelectorLoading = ref(false)
const teacherSelectorOptions = reactive<{ value: string; label: string }[]>([])
const teacherSelectorRemoteMethod = (keyword: string) => {
  teacherSelectorLoading.value = true
  getTeacherList({
    page_size: 10,
    page: 1,
    keyword
  }).then((res) => {
    teacherSelectorOptions.length = 0
    teacherSelectorOptions.push(
      ...res.data.map((item) => ({
        value: item.id,
        label: `${item.id}:${item.name}`
      }))
    )
    teacherSelectorLoading.value = false
  })
}

const islessonClassEditDialogVisible = ref(false)
const lessonClassEditModel = reactive({
  lesson_id: -1,
  class_ids: [] as number[]
})
const onClassEditBtnClicked = (data: Lesson) => {
  lessonClassEditModel.class_ids.length = 0
  getLessonClassList(data.id).then((res) => {
    lessonClassEditModel.class_ids.push(...res.map((item) => item.id))
    lessonClassEditModel.lesson_id = data.id
    islessonClassEditDialogVisible.value = true
  })
}
const onLessonClassEditDialogCommitBtnClicked = () => {
  putLessonClassList(lessonClassEditModel.lesson_id, lessonClassEditModel.class_ids).then(() => {
    ElMessage.success('修改成功')
    islessonClassEditDialogVisible.value = false
  })
}
const onLessonClassEditDialogCancelBtnClicked = () => {
  islessonClassEditDialogVisible.value = false
}
const classSelectorLoading = ref(false)
const classSelectorOptions = reactive<{ value: number; label: string }[]>([])
const classSelectorRemoteMethod = (keyword: string) => {
  classSelectorLoading.value = true
  getClassList({
    page_size: 10,
    page: 1,
    keyword
  }).then((res) => {
    classSelectorOptions.length = 0
    classSelectorOptions.push(
      ...res.data.map((item) => ({
        value: item.id,
        label: `${item.id}:${item.name}`
      }))
    )
    classSelectorLoading.value = false
  })
}
</script>

<template>
  <div class="p-4 h-full flex flex-col">
    <div class="mb-4 flex items-center">
      <el-button type="primary" :icon="Plus" class="mr-2" @click="onNewBtnClicked">
        新建
      </el-button>
      <el-input placeholder="关键词检索" v-model="keyword"></el-input>
    </div>
    <el-table :data="lessonList" stripe class="flex-1 mb-4">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="title" label="Title" min-width="180" />
      <el-table-column prop="teacher_id" label="TeaID" min-width="120" />
      <el-table-column prop="year" label="Year" />
      <el-table-column prop="term" label="Term" />
      <el-table-column label="isOver">
        <template #default="{ row }">
          <span>{{ row.is_over ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Thumbnail" width="72">
        <template #default="{ row }">
          <el-popover placement="top" trigger="hover">
            <template #reference>
              <el-button size="small" :icon="MoreFilled" round></el-button>
            </template>
            <el-image
              :src="row.thumbnail"
              v-if="row.thumbnail && row.thumbnail.length > 0"
            ></el-image>
            <p v-else>（空）</p>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="Action" width="200">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="onEditBtnClicked(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="onDeleteBtnClicked(row.id)">删除</el-button>
          <el-button type="primary" size="small" @click="onClassEditBtnClicked(row)"
            >班级</el-button
          >
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
    v-model="isLessonEditDialogVisible"
    :title="lessonModel.id === -1 ? '新建' : '编辑'"
    class="w-5/6 sm:w-1/2"
  >
    <el-form :model="lessonModel" label-width="80">
      <el-form-item label="标题">
        <el-input v-model="lessonModel.title"></el-input>
      </el-form-item>
      <el-form-item label="缩略图">
        <el-input v-model="lessonModel.thumbnail"></el-input>
      </el-form-item>
      <el-form-item label="教师">
        <el-select
          v-model="lessonModel.teacher_id"
          filterable
          clearable
          remote
          placeholder="请输入关键词"
          remote-show-suffix
          :remote-method="teacherSelectorRemoteMethod"
          :loading="teacherSelectorLoading"
        >
          <el-option
            v-for="item in teacherSelectorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="年度">
        <el-input-number
          v-model="lessonModel.year"
          :min="1900"
          :max="2100"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="学期">
        <el-input-number v-model="lessonModel.term" :min="1" :max="2" controls-position="right" />
      </el-form-item>
      <el-form-item label="是否结课">
        <el-switch v-model="lessonModel.is_over"></el-switch>
      </el-form-item>
      <el-form-item label="公告（元数据）" error="若您不了解该项则不建议修改">
        <el-input v-model="lessonModel.notice" :rows="2" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="课件（元数据）" error="若您不了解该项则不建议修改">
        <el-input v-model="lessonModel.notice" :rows="2" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onLessonEditDialogCommitBtnClicked">提交</el-button>
      <el-button @click="onLessonEditDialogCancelBtnClicked">取消</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="islessonClassEditDialogVisible" title="班级绑定" class="w-5/6 sm:w-1/2">
    <el-form>
      <el-form-item label="班级">
        <el-select
          v-model="lessonClassEditModel.class_ids"
          filterable
          multiple
          clearable
          remote
          placeholder="请输入关键词"
          remote-show-suffix
          :remote-method="classSelectorRemoteMethod"
          :loading="classSelectorLoading"
        >
          <el-option
            v-for="item in classSelectorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onLessonClassEditDialogCommitBtnClicked">提交</el-button>
      <el-button @click="onLessonClassEditDialogCancelBtnClicked">取消</el-button>
    </template>
  </el-dialog>
</template>

<style scoped></style>
