<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import type { Lesson } from '@/types/lesson'
import { Edit, Delete, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTokenStore } from '@/stores/token'
import { file2URL } from '@/hooks'
import { putLessonCourseware } from '@/api/lesson'
import { deleteCoursewareObject, putCoursewareObject } from '@/api/oss'
import VuePdfEmbed from 'vue-pdf-embed'

interface ThirdLevel {
  title: string
  type: string
  src: {
    filename: string
    url: string
  }
  downloadable: boolean
}

interface SecondLevel {
  title: string
  children: ThirdLevel[]
}

interface FirstLevel {
  title: string
  children: SecondLevel[]
}

type Courseware = FirstLevel[]

const props = defineProps<{
  lesson: Lesson
}>()

const { isTeacher, isStudent } = useTokenStore()

const courseware = reactive<Courseware>([])

watchEffect(() => {
  let parsedData: Courseware = []
  try {
    parsedData = JSON.parse(props.lesson.courseware)
  } catch (error) {
    parsedData = []
  }
  courseware.length = 0
  courseware.push(...parsedData)
})

const expandedStatus = reactive<{ [key: number]: boolean }>({})
const toggleExpandedStatus = (index: number) => {
  expandedStatus[index] = !expandedStatus[index]
}

const activeItem = ref<{
  title: string
  type: string
  src: {
    filename: string
    url: string
  }
  downloadable: boolean
} | null>(null)

type Node = { title: string; children: unknown[] }
type Leaf = {
  title: string
  type: string
  src: { filename: string; url: string }
  downloadable: boolean
}

const isNodeEditDialogVisible = ref(false)
const nodeEditModel = reactive({
  parent: [] as unknown[],
  node: null as Node | null,
  title: ''
})
const onNodeEditCommitBtnClicked = () => {
  if (nodeEditModel.node) {
    nodeEditModel.node.title = nodeEditModel.title
  } else {
    const newNode: Node = {
      title: nodeEditModel.title,
      children: []
    }
    nodeEditModel.parent.push(newNode)
  }
  putLessonCourseware(props.lesson.id, JSON.stringify(courseware)).then(() => {
    ElMessage.success('添加成功。')
    isNodeEditDialogVisible.value = false
  })
}
const onNodeEditCancelBtnClicked = () => {
  isNodeEditDialogVisible.value = false
}

const isLeafEditDialogVisible = ref(false)
const leafEditModel = reactive({
  parent: [] as unknown[],
  leaf: null as Leaf | null,
  title: '',
  type: 'video',
  downloadable: false
})
const fileUpdateModel = reactive({
  old: null as { filename: string; url: string } | null,
  new: null as File | null
})
const onLeafEditCommitBtnClicked = () => {
  const { title, type, downloadable } = leafEditModel
  if (!title) {
    ElMessage.error('标题不能为空。')
    return
  }
  ElMessage.info('正在提交，请稍后。')
  if (leafEditModel.leaf && fileUpdateModel.old) {
    const src = {
      filename: fileUpdateModel.old.filename,
      url: fileUpdateModel.old.url
    }
    let request: Promise<unknown> | null = null
    if (fileUpdateModel.new) {
      request = deleteCoursewareObject(props.lesson.id, [fileUpdateModel.old.filename])
        .then(() => putCoursewareObject(props.lesson.id, [fileUpdateModel.new as File]))
        .then((res) => Object.assign(src, res[0]))
    } else {
      request = Promise.resolve()
    }
    request
      .then(() => {
        const { leaf } = leafEditModel as { leaf: Leaf }
        leaf.title = title
        leaf.type = type
        leaf.src = src
        leaf.downloadable = downloadable
        return putLessonCourseware(props.lesson.id, JSON.stringify(courseware))
      })
      .then(() => {
        ElMessage.success('修改成功。')
        isLeafEditDialogVisible.value = false
      })
  } else {
    if (!fileUpdateModel.new) {
      ElMessage.error('资源不能为空。')
      return
    }
    putCoursewareObject(props.lesson.id, [fileUpdateModel.new])
      .then((res) => {
        const newLeaf: Leaf = {
          title: title,
          type: type,
          src: {
            filename: res[0].filename,
            url: res[0].url
          },
          downloadable: downloadable
        }
        leafEditModel.parent.push(newLeaf)
        return putLessonCourseware(props.lesson.id, JSON.stringify(courseware))
      })
      .then(() => {
        ElMessage.success('添加成功。')
        isLeafEditDialogVisible.value = false
      })
  }
}
const onLeafEditCancelBtnClicked = () => {
  isLeafEditDialogVisible.value = false
}

const onNodeEditBtnClicked = (e: Event, parent: unknown[], node: Node) => {
  e.stopPropagation()
  nodeEditModel.parent = parent
  nodeEditModel.node = node
  nodeEditModel.title = node.title
  isNodeEditDialogVisible.value = true
}
const onNodeAddBtnClicked = (e: Event, parent: unknown[]) => {
  e.stopPropagation()
  nodeEditModel.parent = parent
  nodeEditModel.node = null
  nodeEditModel.title = ''
  isNodeEditDialogVisible.value = true
}
const onNodeDeleteBtnClicked = (e: Event, parent: unknown[], node: unknown) => {
  e.stopPropagation()
  ElMessageBox.confirm('确认删除该节点吗，其下所有内容都会被删除，且无法恢复？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const index = parent.indexOf(node)
      parent.splice(index, 1)
      putLessonCourseware(props.lesson.id, JSON.stringify(courseware)).then(() => {
        ElMessage.success('删除成功。')
      })
    })
    .catch(() => {})
}
const onLeafEditBtnClicked = (e: Event, parent: unknown[], leaf: Leaf) => {
  e.stopPropagation()
  leafEditModel.parent = parent
  leafEditModel.leaf = leaf
  leafEditModel.title = leaf.title
  leafEditModel.type = leaf.type
  fileUpdateModel.old = leaf.src
  fileUpdateModel.new = null
  leafEditModel.downloadable = leaf.downloadable
  isLeafEditDialogVisible.value = true
}
const onLeafAddBtnClicked = (e: Event, parent: unknown[]) => {
  e.stopPropagation()
  leafEditModel.parent = parent
  leafEditModel.leaf = null
  leafEditModel.title = ''
  leafEditModel.type = 'video'
  fileUpdateModel.old = null
  fileUpdateModel.new = null
  leafEditModel.downloadable = false
  isLeafEditDialogVisible.value = true
}
const onLeafDeleteBtnClicked = (e: Event, parent: unknown[], leaf: unknown) => {
  e.stopPropagation()
  ElMessageBox.confirm('确认删除该节点吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const index = parent.indexOf(leaf)
      parent.splice(index, 1)
      putLessonCourseware(props.lesson.id, JSON.stringify(courseware)).then(() => {
        ElMessage.success('删除成功。')
      })
    })
    .catch(() => {})
}

const onFileInputChanged = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    fileUpdateModel.new = target.files[0]
  }
  target.value = ''
}

const isCoursewareFullScreen = ref(false)
const onCoursewareBackBtnClicked = () => {
  isCoursewareFullScreen.value = false
  activeItem.value = null
}
</script>

<template>
  <div class="p-4">
    <div v-if="!activeItem">
      <div class="pb-4 border-b border-border" v-if="isTeacher()">
        <el-button
          type="primary"
          :icon="Plus"
          @click="onNodeAddBtnClicked($event, courseware)"
          class="w-full"
        >
          新建
        </el-button>
      </div>
      <ul>
        <li
          v-for="(item, index) in courseware"
          :key="`first-${index}`"
          class="px-2 border-b border-border cursor-pointer"
        >
          <div
            class="flex flex-row justify-between items-center py-6"
            @click="toggleExpandedStatus(index)"
          >
            <div class="first-title flex flex-row items-center">
              <el-icon :size="16" class="mr-2">
                <Collection />
              </el-icon>
              <h3 class="font-bold mr-4">
                {{ item.title }}
              </h3>
            </div>
            <div class="flex items-center">
              <div class="mr-2 w-24 shrink-0" v-if="isTeacher()">
                <el-button
                  type="primary"
                  :icon="Plus"
                  circle
                  size="small"
                  @click="onNodeAddBtnClicked($event, item.children)"
                />
                <el-button
                  type="success"
                  :icon="Edit"
                  circle
                  size="small"
                  @click="onNodeEditBtnClicked($event, courseware, item)"
                />
                <el-button
                  type="danger"
                  :icon="Delete"
                  circle
                  size="small"
                  @click="onNodeDeleteBtnClicked($event, courseware, item)"
                />
              </div>
              <el-icon>
                <ArrowRight v-if="!expandedStatus[index]" />
                <ArrowDown v-else />
              </el-icon>
            </div>
          </div>
          <ul class="ml-6 mb-4 text-primary" v-if="expandedStatus[index]">
            <li v-for="(ite, inde) in item.children" :key="`second-${inde}`" class="mb-4">
              <div class="flex items-center justify-between mb-4">
                <div class="second-title flex flex-row items-center">
                  <el-icon :size="16" class="mr-2">
                    <Memo />
                  </el-icon>
                  <h4 class="mr-4">
                    {{ ite.title }}
                  </h4>
                </div>
                <div class="mr-6 w-24 shrink-0" v-if="isTeacher()">
                  <el-button
                    type="primary"
                    :icon="Plus"
                    circle
                    size="small"
                    @click="onLeafAddBtnClicked($event, ite.children)"
                  />
                  <el-button
                    type="success"
                    :icon="Edit"
                    circle
                    size="small"
                    @click="onNodeEditBtnClicked($event, item.children, ite)"
                  />
                  <el-button
                    type="danger"
                    :icon="Delete"
                    circle
                    size="small"
                    @click="onNodeDeleteBtnClicked($event, item.children, ite)"
                  />
                </div>
              </div>
              <ul class="ml-6">
                <li
                  v-for="(it, ind) in ite.children"
                  :key="`third-${ind}`"
                  class="third-title flex flex-row items-center justify-between mb-2 hover:text-theme"
                  @click="activeItem = it"
                >
                  <div class="flex items-center">
                    <el-icon :size="14" class="mr-2">
                      <VideoPlay v-if="it.type === 'video'" />
                      <Picture v-else-if="it.type === 'image'" />
                      <Document v-else-if="it.type === 'pdf'" />
                      <Files v-else />
                    </el-icon>
                    <h5 class="text-sm mr-4">
                      {{ it.title }}
                    </h5>
                  </div>
                  <div class="mr-6 w-16 shrink-0" v-if="isTeacher()">
                    <el-button
                      type="success"
                      :icon="Edit"
                      circle
                      size="small"
                      @click="onLeafEditBtnClicked($event, ite.children, it)"
                    />
                    <el-button
                      type="danger"
                      :icon="Delete"
                      circle
                      size="small"
                      @click="onLeafDeleteBtnClicked($event, ite.children, it)"
                    />
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="flex flex-col h-full" v-else>
      <div class="flex flex-row justify-between w-full mb-4">
        <div class="flex flex-row items-center">
          <div
            class="back-btn text-lg flex flex-row items-center px-4 mr-4 border-r border-border cursor-pointer hover:bg-fill"
            @click="onCoursewareBackBtnClicked"
          >
            <el-icon :size="18">
              <ArrowLeft></ArrowLeft>
            </el-icon>
            返回
          </div>
          <h5>{{ activeItem.title }}</h5>
        </div>
        <div
          class="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-fill rounded-full overflow-hidden"
          @click="isCoursewareFullScreen = !isCoursewareFullScreen"
        >
          <el-icon><FullScreen /></el-icon>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto flex flex-col items-center justify-center mb-4 scroll">
        <video
          :src="activeItem.src.url"
          autoplay
          controls
          class="w-full rounded-md overflow-hidden"
          v-if="activeItem.type === 'video'"
        ></video>
        <el-image
          :src="activeItem.src.url"
          fit="contain"
          :preview-src-list="[activeItem.src.url]"
          class="w-full h-full rounded-md overflow-hidden"
          v-else-if="activeItem.type === 'image'"
        ></el-image>
        <div v-else-if="activeItem.type === 'pdf'" class="w-3/4 h-full mx-auto">
          <vue-pdf-embed :source="activeItem.src.url" />
        </div>
        <div
          class="text-xs text-primary h-40 w-full flex items-center justify-center bg-fill rounded-lg"
          v-else-if="activeItem.type === 'other'"
        >
          <p>
            该文件暂时无法预览，请选择
            <el-button type="primary" size="small">
              <a :href="activeItem.src.url" target="_blank">下载</a>
            </el-button>
            后查看。
          </p>
        </div>
      </div>
      <div
        class="text-sm mx-2"
        v-if="activeItem.downloadable && activeItem.type !== 'other' && isStudent()"
      >
        <p>
          老师已开放该课件的下载，请点此进行
          <el-button type="primary" size="small">
            <a :href="activeItem.src.url" target="_blank">下载</a>
          </el-button>
          。
        </p>
      </div>
    </div>
  </div>
  <el-dialog v-if="activeItem" v-model="isCoursewareFullScreen" :fullscreen="true" title="课件详情">
    <div class="flex-1 overflow-y-auto flex flex-col items-center justify-center mb-4 scroll">
      <video
        :src="activeItem.src.url"
        autoplay
        controls
        class="w-full rounded-md overflow-hidden"
        v-if="activeItem.type === 'video'"
      ></video>
      <el-image
        :src="activeItem.src.url"
        fit="contain"
        :preview-src-list="[activeItem.src.url]"
        class="w-full h-full rounded-md overflow-hidden"
        v-else-if="activeItem.type === 'image'"
      ></el-image>
      <div v-else-if="activeItem.type === 'pdf'" class="w-3/4 h-full mx-auto">
        <vue-pdf-embed :source="activeItem.src.url" />
      </div>
      <div
        class="text-xs text-primary h-40 w-full flex items-center justify-center bg-fill rounded-lg"
        v-else-if="activeItem.type === 'other'"
      >
        <p>
          该文件暂时无法预览，请选择
          <el-button type="primary" size="small">
            <a :href="activeItem.src.url" target="_blank">下载</a>
          </el-button>
          后查看。
        </p>
      </div>
    </div>
    <div
      class="text-sm mx-2"
      v-if="activeItem.downloadable && activeItem.type !== 'other' && isStudent()"
    >
      <p>
        老师已开放该课件的下载，请点此进行
        <el-button type="primary" size="small">
          <a :href="activeItem.src.url" target="_blank">下载</a>
        </el-button>
        。
      </p>
    </div>
  </el-dialog>
  <el-dialog
    v-model="isNodeEditDialogVisible"
    :title="nodeEditModel.node ? '编辑' : '新建'"
    class="w-5/6 sm:w-1/2"
  >
    <el-form :model="nodeEditModel">
      <el-form-item label="标题">
        <el-input v-model="nodeEditModel.title" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onNodeEditCommitBtnClicked"> 确定 </el-button>
      <el-button @click="onNodeEditCancelBtnClicked">取消</el-button>
    </template>
  </el-dialog>
  <el-dialog
    v-model="isLeafEditDialogVisible"
    :title="leafEditModel.leaf ? '编辑' : '新建'"
    class="w-5/6 sm:w-1/2"
  >
    <el-form :model="leafEditModel">
      <el-form-item label="标题">
        <el-input v-model="leafEditModel.title" />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="leafEditModel.type">
          <el-option label="视频" value="video" />
          <el-option label="图片" value="image" />
          <el-option label="PDF" value="pdf" />
          <el-option label="其他" value="other" />
        </el-select>
      </el-form-item>
      <el-form-item label="资源">
        <div
          class="w-36 h-36 flex flex-col items-center mr-2"
          v-if="fileUpdateModel.old || fileUpdateModel.new"
        >
          <div
            class="w-28 h-28 mb-2 rounded-md border border-border border-solid overflow-hidden"
            :title="fileUpdateModel.new?.name || fileUpdateModel.old?.filename"
          >
            <a
              class="h-full w-full flex flex-col items-center justify-center"
              :href="file2URL(fileUpdateModel.new) || fileUpdateModel.old?.url"
              target="_blank"
            >
              <el-icon :size="48" class="text-border">
                <Document />
              </el-icon>
            </a>
          </div>
          <div
            class="h-6 w-20 flex flex-row items-center text-white text-xs rounded-full overflow-hidden"
            :class="fileUpdateModel.new ? 'bg-danger' : 'bg-success'"
          >
            <div class="w-2/3 pl-2">{{ fileUpdateModel.new ? '未上传' : '已上传' }}</div>
            <div class="relative w-1/3 h-full flex items-center justify-center cursor-pointer">
              <el-icon><Switch /></el-icon>
              <input
                type="file"
                class="w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer"
                title="更换资源"
                @change="onFileInputChanged"
              />
            </div>
          </div>
        </div>
        <div class="w-36 h-36 flex justify-center" v-else>
          <div
            class="relative w-28 h-28 text-border flex items-center justify-center rounded-md border border-border border-solid overflow-hidden"
          >
            <el-icon size="32"><Plus /></el-icon>
            <input
              type="file"
              class="w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer"
              title="点击上传"
              @change="onFileInputChanged"
            />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="允许下载">
        <el-switch v-model="leafEditModel.downloadable" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onLeafEditCommitBtnClicked"> 确定 </el-button>
      <el-button @click="onLeafEditCancelBtnClicked">取消</el-button>
    </template>
  </el-dialog>
</template>

<style scoped></style>
