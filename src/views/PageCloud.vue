<script setup lang="ts">
import {
  Upload,
  FolderAdd,
  Share,
  Download,
  Delete,
  EditPen,
  CopyDocument,
  TopRight
} from '@element-plus/icons-vue'
import { cloudFileList } from '@/fakeData'
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox, ElTable } from 'element-plus'

const refTable = ref<InstanceType<typeof ElTable>>()

const props = defineProps<{
  shareid?: string
}>()

const data = reactive(cloudFileList)

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

const selectedBtnGroup = [
  {
    label: '分享',
    icon: Share,
    onClicked: (filelist: Array<any>) => {
      refTable.value!.clearSelection()
      if (filelist.length > 1) {
        ElMessage.error('只能分享一个文件')
        return
      }
      shareDialogVisible.value = true
    }
  },
  {
    label: '下载',
    icon: Download,
    onClicked: (filelist: Array<any>) => {
      refTable.value!.clearSelection()
      const a = document.createElement('a')
      a.href = filelist[0].src
      a.download = 'download.pdf'
      a.click()
      ElMessage.success('正在开始下载')
    }
  },
  {
    label: '删除',
    icon: Delete,
    onClicked: (filelist: Array<any>) => {
      ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          refTable.value!.clearSelection()
          filelist.forEach((item) => {
            data.splice(data.indexOf(item), 1)
          })
          ElMessage.success('删除成功')
        })
        .catch(() => {})
    }
  },
  {
    label: '重命名',
    icon: EditPen,
    onClicked: (filelist: Array<any>) => {
      refTable.value!.clearSelection()
      filelist.forEach((item) => {
        renameStatus[item.id] = true
        renameModel[item.id] = item.name
      })
    }
  },
  {
    label: '复制',
    icon: CopyDocument,
    onClicked: (filelist: Array<any>) => {
      refTable.value!.clearSelection()
      filelist
      ElMessage.success('复制成功')
    }
  },
  {
    label: '移动',
    icon: TopRight,
    onClicked: (filelist: Array<any>) => {
      refTable.value!.clearSelection()
      filelist
      ElMessage.success('移动成功')
    }
  }
]

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

const dir = ref('/')

const renameStatus = reactive<{ [key: string]: boolean }>({})
const renameModel = reactive<{ [key: string]: string }>({})
const onRenameSubmitBtnClicked = (id: string) => {
  data.forEach((item) => {
    if (item.id === id) {
      item.name = renameModel[id]
    }
  })
  renameStatus[id] = false
  ElMessage.success('重命名成功')
}
const onRenameCancelBtnClicked = (id: string) => {
  renameStatus[id] = false
}

const shareDialogVisible = ref(false)
const shareDialogModel = reactive({
  shareid: '1234567890',
  sharetime: 86400
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
  data.push({
    id: String(new Date().getTime()),
    name: newFolderName.value,
    type: 'folder',
    size: 0,
    src: '',
    modified_time: Math.floor(new Date().getTime() / 1000)
  })
  newFolderDialogVisible.value = false
  ElMessage.success('新建文件夹成功')
}

const uploadDialogVisible = ref(false)
const onUploadSubmitBtnClicked = () => {
  uploadDialogVisible.value = false
  ElMessage.success('上传成功')
}

const getShareDialogVisible = ref(!!props.shareid)
const onGetShareSubmitBtnClicked = () => {
  getShareDialogVisible.value = false
  ElMessage.success('获取分享成功')
}
</script>

<template>
  <div class="flex flex-col p-[16px]">
    <div class="btn-group pb-[16px] border-b border-[#eaeaea] mb-[16px]">
      <el-button-group class="mr-[48px]">
        <el-button
          type="primary"
          round
          v-for="btn in btnGroup"
          :key="btn.label"
          @click="btn.onClicked"
        >
          <span class="mr-[8px]">
            {{ btn.label }}
          </span>
          <el-icon>
            <component :is="btn.icon" />
          </el-icon>
        </el-button>
      </el-button-group>
      <el-button-group v-if="multipleSelection.length !== 0">
        <el-button
          round
          v-for="btn in selectedBtnGroup"
          :key="btn.label"
          @click="btn.onClicked(multipleSelection)"
        >
          <span class="mr-[8px]">
            {{ btn.label }}
          </span>
          <el-icon>
            <component :is="btn.icon" />
          </el-icon>
        </el-button>
      </el-button-group>
    </div>
    <div class="ml-[16px] mb-[16px] flex flex-row items-center">
      <p class="whitespace-nowrap">当前路径：</p>
      <el-input v-model="dir" disabled></el-input>
    </div>
    <el-table
      :data="data"
      @selection-change="onSelectionChanged"
      row-class-name="cursor-pointer group"
      ref="refTable"
    >
      <el-table-column type="selection" />
      <el-table-column label="名称">
        <template #default="{ row }">
          <div class="flex flex-row items-center justify-between">
            <div class="name flex flex-row items-center">
              <el-icon :size="20" class="mr-[8px]">
                <Folder v-if="row.type === 'folder'" />
                <Document v-else />
              </el-icon>
              <p v-if="!renameStatus[row.id]">{{ row.name }}</p>
              <div v-else class="flex flex-row items-center">
                <el-input v-model="renameModel[row.id]" class="mr-[8px]"></el-input>
                <el-button type="primary" size="small" @click="onRenameSubmitBtnClicked(row.id)">
                  确定
                </el-button>
                <el-button size="small" @click="onRenameCancelBtnClicked(row.id)"> 取消 </el-button>
              </div>
            </div>
            <ul class="flex-row items-center hidden group-hover:flex">
              <li
                v-for="item in selectedBtnGroup"
                :key="item.label"
                class="mr-[8px] cursor-pointer"
              >
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
          <span>{{ timeFormat(row.modified_time) }}</span>
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
  <el-dialog v-model="shareDialogVisible" title="分享成功" width="50%">
    <div>
      <div class="flex flex-row items-center mb-[8px]">
        <p class="whitespace-nowrap">分享链接：</p>
        <el-input :model-value="shareUrl" disabled class="mr-[8px]"></el-input>
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
  <el-dialog v-model="newFolderDialogVisible" title="新建文件夹" width="50%">
    <div class="flex flex-row items-center mb-[8px]">
      <p class="whitespace-nowrap">文件夹名称：</p>
      <el-input v-model="newFolderName" class="mr-[8px]"></el-input>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onNewFolderSubmitBtnClicked">确定</el-button>
        <el-button @click="newFolderDialogVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="uploadDialogVisible" title="上传文件" width="50%">
    <el-upload class="upload-demo" drag action="https://www.baidu.com" multiple>
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
  <el-dialog v-model="getShareDialogVisible" title="分享文件" width="50%">
    <div>
      <h3 class="mb-[16px]">有用户向您分享了文件：</h3>
      <div class="flex flex-row items-center bg-[#efefef] rounded-md overflow-hidden">
        <div class="w-[64px] h-[64px] flex items-center justify-center mr-[32px]">
          <el-icon size="48">
            <Document></Document>
          </el-icon>
        </div>
        <p>第9章 信号的调制与解调.ppt</p>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onGetShareSubmitBtnClicked">存入网盘</el-button>
        <el-button @click="getShareDialogVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
