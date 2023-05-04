<script setup lang="ts">
import {
  Upload,
  FolderAdd,
  Share,
  Download,
  Delete,
  EditPen,
  CopyDocument,
  TopRight,
  DocumentCopy,
  Close
} from '@element-plus/icons-vue'
import { ref, reactive, computed, watchEffect } from 'vue'
import { ElMessage, ElMessageBox, ElTable } from 'element-plus'
import {
  deleteCloudObjects,
  getCloudList,
  getCloudObject,
  putCloudName,
  putCloudObjects,
  copyCloudObjects,
  moveCloudObjects,
  postCloudShare,
  getCloudShare,
  putCloudShareRecv
} from '@/api/oss'
import type { CloudListItem, CloudShare } from '@/types/cloud'
import { useRouter } from 'vue-router'

const refTable = ref<InstanceType<typeof ElTable>>()
const router = useRouter()

const props = defineProps<{
  small?: boolean
  area: string
  userId: number | string
  showControl: boolean
  shareid?: string
}>()

const btnGroup = [
  {
    label: '上传',
    icon: Upload,
    onClicked: () => {
      uploadDialogVisible.value = true
    }
  },
  {
    label: '新建文件夹',
    icon: FolderAdd,
    onClicked: () => {
      newFolderDialogVisible.value = true
      newFolderName.value = '新建文件夹'
    }
  }
]

const selectedBtnGroup = computed(() => {
  const btns = [
    {
      label: '分享',
      icon: Share,
      isControl: true,
      onClicked: (filelist: Array<CloudListItem>) => {
        refTable.value!.clearSelection()
        if (filelist.length > 1) {
          ElMessage.error('只能分享一个文件')
          return
        }
        if (filelist.length === 0) {
          ElMessage.error('请选择一个文件')
          return
        }
        const name = filelist[0].name
        postCloudShare(props.area, props.userId, `${dir.value}/${name}`, 86400).then((res) => {
          shareDialogModel.sharetime = 86400
          shareDialogModel.shareid = res.key
          shareDialogVisible.value = true
        })
      }
    },
    {
      label: '下载',
      icon: Download,
      isControl: false,
      onClicked: (filelist: Array<CloudListItem>) => {
        refTable.value!.clearSelection()
        filelist.forEach((item) => {
          if (item.type === 'folder') {
            ElMessage.error('文件夹不支持下载')
            return
          }
          ElMessage.success('正在开始下载')
          getCloudObject(props.area, props.userId, item.src).then((res) => {
            let url = window.URL.createObjectURL(new Blob([res]))
            let a = document.createElement('a')
            a.href = url
            a.download = item.name
            a.click()
            window.URL.revokeObjectURL(a.href)
          })
        })
      }
    },
    {
      label: '删除',
      icon: Delete,
      isControl: true,
      onClicked: (filelist: Array<CloudListItem>) => {
        ElMessageBox.confirm('此操作将永久删除选定项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            refTable.value!.clearSelection()
            deleteCloudObjects(
              props.area,
              props.userId,
              dir.value,
              filelist.map((item) => item.name)
            ).then(() => {
              ElMessage.success('删除成功')
              updateData()
            })
          })
          .catch(() => {})
      }
    },
    {
      label: '重命名',
      icon: EditPen,
      isControl: true,
      onClicked: (filelist: Array<CloudListItem>) => {
        refTable.value!.clearSelection()
        if (filelist.length === 0) {
          ElMessage.error('请选择一个文件')
          return
        }
        if (filelist.length > 1) {
          ElMessage.error('一次性仅能对一个文件重命名')
          return
        }
        renameDialogModel.old_name = filelist[0].name
        renameDialogModel.new_name = filelist[0].name
        isRenameDialogShow.value = true
      }
    },
    {
      label: '复制',
      icon: CopyDocument,
      isControl: true,
      onClicked: (filelist: Array<CloudListItem>) => {
        refTable.value!.clearSelection()
        copyOrMoveSrc.type = 'copy'
        copyOrMoveSrc.dir = dir.value
        copyOrMoveSrc.names = filelist.map((item) => item.name)
        ElMessage.success('选定文件已添加到剪贴板')
      }
    },
    {
      label: '移动',
      icon: TopRight,
      isControl: true,
      onClicked: (filelist: Array<any>) => {
        refTable.value!.clearSelection()
        copyOrMoveSrc.type = 'move'
        copyOrMoveSrc.dir = dir.value
        copyOrMoveSrc.names = filelist.map((item) => item.name)
        ElMessage.success('选定文件已添加到剪贴板')
      }
    }
  ]
  return props.showControl ? btns : btns.filter((item) => !item.isControl)
})

const data = reactive<CloudListItem[]>([])
const dir = ref('')

const updateData = () => {
  if (!props.area || props.userId == -1 || !props.userId) return
  getCloudList(props.area, props.userId, dir.value).then((res) => {
    data.length = 0
    data.push(...res)
  })
}
watchEffect(() => updateData())

const timeFormat = (time: number) => {
  const date = new Date(time * 1000)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

const sizeFormat = (size: number) => {
  if (size < 1024) {
    return `${size}B`
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)}KB`
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)}MB`
  } else {
    return `${(size / 1024 / 1024 / 1024).toFixed(2)}GB`
  }
}

const multipleSelection = ref([])
const onSelectionChanged = (selection: any) => {
  multipleSelection.value = selection
}

const isRenameDialogShow = ref(false)
const renameDialogModel = reactive({
  old_name: '',
  new_name: ''
})
const onRenameSubmitBtnClicked = () => {
  if (renameDialogModel.old_name === renameDialogModel.new_name) {
    return
  }
  putCloudName(
    props.area,
    props.userId,
    dir.value,
    renameDialogModel.old_name,
    renameDialogModel.new_name
  ).then(() => {
    ElMessage.success('重命名成功')
    isRenameDialogShow.value = false
    updateData()
  })
}
const onRenameCancelBtnClicked = () => {
  isRenameDialogShow.value = false
}

const shareDialogVisible = ref(false)
const shareDialogModel = reactive({
  shareid: '',
  sharetime: 0
})
const shareUrl = computed(() => {
  return `http://${window.location.host}/cloud?shareid=${shareDialogModel.shareid}`
})
const onShareCopyBtnClicked = () => {
  const input = document.createElement('input')
  input.value = shareUrl.value
  document.body.appendChild(input)
  input.select()
  if (document.execCommand('copy')) {
    document.execCommand('copy')
    ElMessage.success('复制成功')
  }
  document.body.removeChild(input)
}

const newFolderDialogVisible = ref(false)
const newFolderName = ref('')
const onNewFolderSubmitBtnClicked = () => {
  const file = new File([], '__dir__')
  if (newFolderName.value === '') {
    ElMessage.error('文件夹名称不能为空')
    return
  }
  if (data.some((item) => item.name === newFolderName.value)) {
    ElMessage.error('同名文件夹或文件夹已存在')
    return
  }
  putCloudObjects(props.area, props.userId, dir.value + `/${newFolderName.value}`, [file]).then(
    () => {
      ElMessage.success('新建文件夹成功')
      newFolderDialogVisible.value = false
      updateData()
    }
  )
}

const uploadDialogVisible = ref(false)
const fileUploadRequest = (option: { file: File }) => {
  if (data.some((item) => item.name === option.file.name)) {
    ElMessage.error('同名文件或文件夹已存在')
    return Promise.reject()
  }
  ElMessage.info('正在上传，请稍后。')
  return putCloudObjects(props.area, props.userId, dir.value, [option.file]).then((res) => {
    ElMessage.success('上传成功')
    updateData()
    return Promise.resolve(res)
  })
}
const onUploadSubmitBtnClicked = () => {
  uploadDialogVisible.value = false
}
const onListItemClicked = (row: CloudListItem) => {
  if (row.type === 'folder') {
    dir.value += `/${row.name}`
  }
}

const getShareDialogVisible = ref(false)
watchEffect(() => {
  if (props.shareid) {
    getCloudShare(props.shareid).then((res) => {
      Object.assign(getShareModel, res)
      getShareDialogVisible.value = true
    })
  }
})
const getShareModel = reactive<CloudShare>({
  id: -1,
  key: '',
  path: '',
  expire: 0,
  type: 'file',
  name: ''
})
const onGetShareSubmitBtnClicked = () => {
  putCloudShareRecv(props.area, props.userId, getShareModel.key, dir.value).then(() => {
    ElMessage.success('获取分享成功')
    getShareDialogVisible.value = false
    router.replace({ query: { shareid: undefined } })
    updateData()
  })
}
const onGetSharecancelBtnClicked = () => {
  getShareDialogVisible.value = false
  router.replace({ query: { shareid: undefined } })
}

const onBackBtnClicked = () => {
  dir.value = dir.value.substring(0, dir.value.lastIndexOf('/'))
}

const copyOrMoveSrc = reactive({
  type: undefined as 'copy' | 'move' | undefined,
  dir: '',
  names: [] as string[]
})
const onCopyOrMoveActionBtnClicked = () => {
  if (data.some((item) => copyOrMoveSrc.names.includes(item.name))) {
    ElMessage.error('同名文件或文件夹已存在')
    return
  }
  if (copyOrMoveSrc.type === 'copy') {
    copyCloudObjects(
      props.area,
      props.userId,
      copyOrMoveSrc.dir,
      dir.value,
      copyOrMoveSrc.names
    ).then(() => {
      ElMessage.success('复制成功')
      onCopyOrMoveCancelBtnClicked()
      updateData()
    })
  } else if (copyOrMoveSrc.type === 'move') {
    moveCloudObjects(
      props.area,
      props.userId,
      copyOrMoveSrc.dir,
      dir.value,
      copyOrMoveSrc.names
    ).then(() => {
      ElMessage.success('移动成功')
      onCopyOrMoveCancelBtnClicked()
      updateData()
    })
  }
}
const onCopyOrMoveCancelBtnClicked = () => {
  copyOrMoveSrc.type = undefined
  copyOrMoveSrc.dir = ''
  copyOrMoveSrc.names = []
}
</script>

<template>
  <div class="flex flex-col">
    <div class="btn-group sm:pb-4 pb-2 border-b border-border sm:mb-4 mb-2" v-if="showControl">
      <el-button-group class="pb-2 mr-2">
        <el-button
          type="primary"
          round
          v-for="btn in btnGroup"
          :key="btn.label"
          :size="small ? 'small' : undefined"
          @click="btn.onClicked"
        >
          <span class="mr-2">
            {{ btn.label }}
          </span>
          <el-icon>
            <component :is="btn.icon" />
          </el-icon>
        </el-button>
      </el-button-group>
      <el-button-group v-if="multipleSelection.length !== 0" class="mr-2 pb-2">
        <el-button
          round
          v-for="btn in selectedBtnGroup.slice(0, 4)"
          :key="btn.label"
          @click="btn.onClicked(multipleSelection)"
          :size="small ? 'small' : undefined"
        >
          <span class="mr-2">
            {{ btn.label }}
          </span>
          <el-icon>
            <component :is="btn.icon" />
          </el-icon>
        </el-button>
      </el-button-group>
      <el-button-group v-if="multipleSelection.length !== 0" class="mr-2 pb-2">
        <el-button
          round
          v-for="btn in selectedBtnGroup.slice(4, 6)"
          :key="btn.label"
          @click="btn.onClicked(multipleSelection)"
          :size="small ? 'small' : undefined"
        >
          <span class="mr-2">
            {{ btn.label }}
          </span>
          <el-icon>
            <component :is="btn.icon" />
          </el-icon>
        </el-button>
      </el-button-group>
      <el-button-group v-if="copyOrMoveSrc.names.length !== 0" class="mr-2 pb-2">
        <el-button round :size="small ? 'small' : undefined" @click="onCopyOrMoveActionBtnClicked">
          <span class="mr-2"> 粘贴 </span>
          <el-icon><DocumentCopy /></el-icon>
        </el-button>
        <el-button round :size="small ? 'small' : undefined" @click="onCopyOrMoveCancelBtnClicked">
          <span class="mr-2"> 清空剪贴板 </span>
          <el-icon><Close /></el-icon>
        </el-button>
      </el-button-group>
    </div>
    <div class="flex flex-row items-center">
      <p
        class="flex items-center justify-center px-4 py-2 whitespace-nowrap cursor-pointer select-none hover:bg-fill"
        :class="small ? 'text-xs' : ''"
        @click="onBackBtnClicked"
      >
        <el-icon>
          <ArrowLeft />
        </el-icon>
        后退
      </p>
      <div class="flex-1 flex flex-row items-center px-4 border-l border-l-border">
        <p class="whitespace-nowrap" :class="small ? 'text-xs' : ''">当前路径：</p>
        <el-input v-model="dir" disabled :size="small ? 'small' : undefined"></el-input>
      </div>
    </div>
    <el-table
      :data="data"
      @selection-change="onSelectionChanged"
      row-class-name="group"
      ref="refTable"
      class="flex-1"
    >
      <el-table-column type="selection" />
      <el-table-column label="名称" min-width="300">
        <template #default="{ row }">
          <div class="flex flex-row items-center justify-between w-full">
            <div class="name flex flex-row items-center w-1/2" @click="onListItemClicked(row)">
              <el-icon :size="20" class="mr-2">
                <Folder v-if="row.type === 'folder'" />
                <Document v-else />
              </el-icon>
              <p class="whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
                {{ row.name }}
              </p>
            </div>
            <ul
              class="flex flex-row justify-end items-center opacity-100 sm:opacity-0 group-hover:opacity-100 min-w-fit"
            >
              <li v-for="item in selectedBtnGroup" :key="item.label" class="mr-2 cursor-pointer">
                <el-icon :size="16" :title="item.label" @click="item.onClicked([row])">
                  <component :is="item.icon" />
                </el-icon>
              </li>
            </ul>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="120">
        <template #default="{ row }">
          <span v-if="row.type === 'folder'"> - </span>
          <span v-else>{{ timeFormat(row.modified_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="120">
        <template #default="{ row }">
          <span v-if="row.type === 'folder'"> - </span>
          <span v-else>{{ sizeFormat(row.size) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="shareDialogVisible" title="分享成功" class="w-5/6 sm:w-1/2">
    <div>
      <div class="flex flex-row items-center mb-2">
        <p class="whitespace-nowrap">分享链接：</p>
        <el-input :model-value="shareUrl" disabled class="mr-2"></el-input>
        <el-button type="primary" @click="onShareCopyBtnClicked">复制</el-button>
      </div>
      <div class="flex flex-row items-center">
        <p class="whitespace-nowrap">分享有效期：</p>
        <el-input v-model="shareDialogModel.sharetime" disabled></el-input>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="shareDialogVisible = false">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="newFolderDialogVisible" title="新建文件夹" class="w-5/6 sm:w-1/2">
    <div class="flex flex-row items-center mb-2">
      <p class="whitespace-nowrap">文件夹名称：</p>
      <el-input v-model="newFolderName" class="mr-2"></el-input>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onNewFolderSubmitBtnClicked" type="primary">确定</el-button>
        <el-button @click="newFolderDialogVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="uploadDialogVisible" title="上传文件" class="w-5/6 sm:w-1/2">
    <el-upload class="upload-demo" drag multiple :http-request="fileUploadRequest">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">将文件拖动到此或<em>点击上传文件</em></div>
      <template #tip>
        <div class="el-upload__tip">文件上传速度取决于您的网速</div>
      </template>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onUploadSubmitBtnClicked">确定</el-button>
        <el-button @click="uploadDialogVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="getShareDialogVisible" title="分享文件" class="w-5/6 sm:w-1/2">
    <div>
      <h3 class="mb-4">有用户向您分享了文件：</h3>
      <div class="flex flex-row items-center bg-fill rounded-md overflow-hidden">
        <div class="w-16 h-16 flex items-center justify-center mr-8">
          <el-icon size="48">
            <Document v-if="getShareModel.type === 'file'"></Document>
            <Folder v-else-if="getShareModel.type === 'folder'"></Folder>
          </el-icon>
        </div>
        <p>{{ getShareModel.name }}</p>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onGetShareSubmitBtnClicked">存入网盘</el-button>
        <el-button @click="onGetSharecancelBtnClicked">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="isRenameDialogShow" title="重命名文件" class="w-5/6 sm:w-1/2">
    <div class="flex flex-row items-center mb-2">
      <p class="whitespace-nowrap">新名称：</p>
      <el-input v-model="renameDialogModel.new_name" class="mr-2"></el-input>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onRenameSubmitBtnClicked" type="primary">确定</el-button>
        <el-button @click="onRenameCancelBtnClicked">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
