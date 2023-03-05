<script setup lang="ts">
import { cloudFileList } from '@/fakeData'
import { reactive, ref } from 'vue'
import { Download, Switch } from '@element-plus/icons-vue'
import { ElMessage, type ElTable } from 'element-plus'

const data = reactive(cloudFileList)
const refTable = ref<InstanceType<typeof ElTable>>()

const multipleSelection = ref([])
const onSelectionChanged = (selection: any) => {
  multipleSelection.value = selection
}

const selectedBtnGroup = [
  {
    label: '转存',
    icon: Switch,
    onClicked: (filelist: Array<any>) => {
      filelist
      ElMessage.success('转存成功')
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

const dir = ref('/')
</script>

<template>
  <div class="p-[16px]">
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
              <p>{{ row.name }}</p>
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
</template>

<style scoped></style>
