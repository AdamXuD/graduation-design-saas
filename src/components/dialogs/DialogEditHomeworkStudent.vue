<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import { judgeImage, file2URL } from '@/hooks'
import { ElMessage, ElMessageBox } from 'element-plus'
import { putHomeworkStatus } from '@/api/lesson'
import { deleteHomeworkObject, putHomeworkObject } from '@/api/oss'

const props = defineProps<{
  modelValue: boolean
  lessonId: number
  data: {
    task_id: number
    detail: {
      text: string
      files: {
        filename: string
        url: string
      }[]
      status: string
    }
  }
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'updateData'): void
}>()

const fileInputElem = ref<HTMLInputElement>()
const fileUploadList = reactive<File[]>([])

const model = reactive({
  task_id: '',
  detail: {
    status: '',
    text: '',
    files: [] as {
      filename: string
      url: string
    }[]
  }
})

watchEffect(() => Object.assign(model, props.data))

const judgeEditable = (status: string) => {
  switch (status) {
    case 'uncompleted':
      return true
    case 'completed':
      return true
    case 'checked':
      return false
    case 'expired':
      return false
    default:
      return false
  }
}

const onSubmitBtnClicked = async () => {
  if (judgeEditable(model.detail.status) === false) {
    ElMessage.warning('该作业已经被检查或截止，无法修改。')
    return
  }
  let request: Promise<
    {
      filename: string
      url: string
    }[]
  > | null = null
  if (fileUploadList.length > 0) {
    request = putHomeworkObject(props.data.task_id, fileUploadList)
  } else {
    request = Promise.resolve([] as { filename: string; url: string }[])
  }
  request
    .then((res) => {
      fileUploadList.length = 0
      model.detail.files.push(...res)
    })
    .then(() => {
      return putHomeworkStatus(props.lessonId, props.data.task_id, {
        files: JSON.stringify(model.detail.files),
        text: model.detail.text
      })
    })
    .then(() => {
      ElMessage.success('提交成功。')
      emits('updateData')
      emits('update:modelValue', false)
    })
    .catch(() => {
      ElMessage.error('提交失败。')
    })
}

const onFileUploadChanged = () => {
  if (!fileInputElem.value || !fileInputElem.value.files) return
  if (judgeEditable(model.detail.status) === false) {
    fileInputElem.value.value = ''
    ElMessage.warning('该作业已经被检查或截止，无法修改。')
    return
  }
  const files = fileInputElem.value.files
  const filesArr: File[] = []
  for (let i = 0; i < files.length; i++) {
    filesArr.push(files[i])
  }
  fileUploadList.push(...filesArr)
  fileInputElem.value.value = ''
}

const onCancelBtnClicked = () => {
  emits('update:modelValue', false)
}

const onFileDeleteBtnClicked = (file: unknown) => {
  if (judgeEditable(model.detail.status) === false) {
    ElMessage.warning('该作业已经被检查或截止，无法修改。')
    return
  }
  if (file instanceof File) {
    const index = fileUploadList.indexOf(file)
    fileUploadList.splice(index, 1)
  } else if (file instanceof Object) {
    ElMessageBox.confirm('确定要删除该文件吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const { filename } = file as { filename: string }
        const index = model.detail.files.findIndex((item) => item.filename === filename)
        return deleteHomeworkObject(props.data.task_id, [filename]).then(() => {
          model.detail.files.splice(index, 1)
        })
      })
      .then(() => {
        return putHomeworkStatus(props.lessonId, props.data.task_id, {
          files: JSON.stringify(model.detail.files),
          text: model.detail.text
        })
      })
      .then(() => {
        ElMessage.success('删除成功。')
        emits('updateData')
      })
      .catch(() => {})
  }
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :destroy-on-close="true"
    class="w-5/6 sm:w-4/5"
    title="编辑"
  >
    <el-form :model="model" label-width="48px">
      <el-form-item label="文本">
        <el-input
          type="textarea"
          :autosize="{ minRows: 8 }"
          v-model="model.detail.text"
          :disabled="!judgeEditable(model.detail.status)"
          class="mb-4"
        ></el-input>
      </el-form-item>
      <el-form-item label="附件">
        <ul class="flex flex-wrap">
          <li
            v-for="item in model.detail.files"
            :key="item.url"
            class="w-36 h-36 mb-2 flex flex-col items-center"
          >
            <div
              class="w-28 h-28 mb-2 rounded-md border border-border border-solid overflow-hidden"
              :title="item.filename"
            >
              <el-image
                v-if="judgeImage(item.url)"
                :src="item.url"
                fit="cover"
                :preview-src-list="[item.url]"
                class="w-full h-full"
              ></el-image>
              <a
                v-else
                class="h-full w-full flex flex-col items-center justify-center"
                :href="item.url"
                target="_blank"
              >
                <el-icon :size="48" class="text-border">
                  <Document />
                </el-icon>
              </a>
            </div>
            <div
              class="h-6 w-20 flex flex-row items-center text-white text-xs bg-success rounded-full overflow-hidden"
            >
              <div class="w-2/3 pl-2">已上传</div>
              <div
                class="w-1/3 h-full flex items-center justify-center pr-0.5 hover:bg-danger cursor-pointer"
                title="删除"
                @click="onFileDeleteBtnClicked(item)"
              >
                <el-icon>
                  <Delete />
                </el-icon>
              </div>
            </div>
          </li>
          <li
            v-for="(item, index) in fileUploadList"
            :key="index"
            class="w-36 h-36 mb-2 flex flex-col items-center mr-2"
          >
            <div
              class="w-28 h-28 mb-2 rounded-md border border-border border-solid overflow-hidden"
              :title="item.name"
            >
              <el-image
                v-if="judgeImage(item.name)"
                :src="file2URL(item)"
                fit="cover"
                :preview-src-list="[file2URL(item)]"
                class="w-full h-full"
              ></el-image>
              <a
                v-else
                class="h-full w-full flex flex-col items-center justify-center"
                :href="file2URL(item)"
                target="_blank"
              >
                <el-icon :size="48" class="text-border">
                  <Document />
                </el-icon>
              </a>
            </div>
            <div
              class="h-6 w-20 flex flex-row items-center text-white text-xs bg-danger rounded-full overflow-hidden"
            >
              <div class="w-2/3 pl-2">未上传</div>
              <div
                class="w-1/3 h-full flex items-center justify-center pr-0.5 cursor-pointer"
                title="删除"
                @click="onFileDeleteBtnClicked(item)"
              >
                <el-icon>
                  <Delete />
                </el-icon>
              </div>
            </div>
          </li>
          <li class="w-36 h-36 flex justify-center">
            <div
              class="relative w-28 h-28 text-border flex items-center justify-center rounded-md border border-border border-solid overflow-hidden"
            >
              <el-icon size="32"><Plus /></el-icon>
              <input
                type="file"
                ref="fileInputElem"
                multiple
                class="block w-full h-full absolute opacity-0 cursor-pointer"
                title="点击上传"
                @change="onFileUploadChanged"
              />
            </div>
          </li>
        </ul>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onSubmitBtnClicked">提交</el-button>
      <el-button @click="onCancelBtnClicked">取消</el-button>
    </template>
  </el-dialog>
</template>

<style scoped></style>
