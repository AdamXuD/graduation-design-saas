<script setup lang="ts">
import { reactive, ref } from 'vue'
import QRCode from 'qrcode'
import { useIntervalFn } from '@vueuse/shared'
import { useTokenStore } from '@/stores/token'
import {
  getClassroom,
  putClassroomBegin,
  putClassroomEnd,
  getClassroomRoll,
  putClassroomAttendance
} from '@/api/lesson'
import type { Lesson } from '@/types/lesson'
import { ElMessage } from 'element-plus'
import jsQR from 'jsqr'

const props = defineProps<{
  lesson: Lesson
}>()

const formatTime = (time: number) => {
  const date = new Date(time)
  const hh = date.getHours().toString().padStart(2, '0')
  const mm = date.getMinutes().toString().padStart(2, '0')
  const ss = date.getSeconds().toString().padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

const renderEventType = (type: string) => {
  /*
   * type:
   * classbegin: 课程开始
   * attendance: 签到
   * taketheroll: 抽签
   * classend: 课程结束
   */
  switch (type) {
    case 'classbegin':
      return '课程开始'
    case 'attendance':
      return '签到'
    case 'taketheroll':
      return '抽签'
    case 'classend':
      return '课程结束'
    default:
      return '其他事件'
  }
}

interface StudentBrief {
  student_id: string
  name: string
}

const renderEventDesc = (data: { type: string; data: unknown }) => {
  let str = ''
  switch (data.type) {
    case 'classbegin':
      str = '现在开始上课，请认真听讲。'
      break
    case 'attendance': {
      const { student, order } = data.data as {
        student: StudentBrief
        order: number
      }
      str = `学生${student.name}(${student.student_id})完成签到，您是第${order}个完成签到的同学。`
      break
    }
    case 'taketheroll': {
      const { students, question } = data.data as {
        students: StudentBrief[]
        question: string
      }
      str = `老师发起了抽签，抽签结果为：`
      str += students
        .map((item) => {
          return `${item.name}(${item.student_id})`
        })
        .join('、')
      if (question.length > 0) {
        str += `，抽签问题为：${question}`
      }
      break
    }
    case 'classend':
      str = '现在下课，请听从老师的安排，有序离开教室。'
      break
    default: {
      const { desc } = data.data as { desc: string }
      str = desc
      break
    }
  }
  return str
}

const isClassroomOpening = ref(false)
const { isTeacher, isStudent } = useTokenStore()

const cameraReady = ref(false)
const video = document.createElement('video')
const canvasElem = ref<HTMLCanvasElement>()

const record = reactive<
  {
    type: string
    time: number
    data: unknown
  }[]
>([])
const qrcodeUrl = ref('')

const interval = useIntervalFn(
  async () => {
    if (props.lesson.id === -1) return
    const res = await getClassroom(props.lesson.id)

    if (res.classroom) {
      record.length = 0
      record.push(...res.classroom)
      isClassroomOpening.value = true
    }

    if (res.qrcode) {
      qrcodeUrl.value = await QRCode.toDataURL(res.qrcode)
    } else {
      qrcodeUrl.value = ''
    }
  },
  8000,
  { immediate: true, immediateCallback: true }
)

const isClassBeginDialogShow = ref(false)
const classBeginModel = reactive({
  title: '',
  expiration: 600
})
const onClassBeginDialogCancelBtnClicked = () => {
  isClassBeginDialogShow.value = false
}
const onClassBeginDialogConfirmBtnClicked = () => {
  isClassBeginDialogShow.value = false
  putClassroomBegin(props.lesson.id, classBeginModel)
    .then(() => {
      isClassroomOpening.value = true
    })
    .catch(() => {
      ElMessage.error('上课失败')
    })
}

const onSwitchChanged = async () => {
  if (isClassroomOpening.value) {
    await putClassroomEnd(props.lesson.id)
    return true
  } else {
    isClassBeginDialogShow.value = true
    return false
  }
}

const qrcodeCapture = () => {
  let mediaStream: MediaStream | null = null
  const drawLine = (
    canvas: CanvasRenderingContext2D,
    begin: { x: number; y: number },
    end: { x: number; y: number },
    color: string
  ) => {
    canvas.beginPath()
    canvas.moveTo(begin.x, begin.y)
    canvas.lineTo(end.x, end.y)
    canvas.lineWidth = 4
    canvas.strokeStyle = color
    canvas.stroke()
  }
  const tick = (onQRCodeFound: (res: string | PromiseLike<string>) => void) => {
    if (video.readyState === video.HAVE_ENOUGH_DATA && canvasElem.value) {
      canvasElem.value.height = video.videoHeight
      canvasElem.value.width = video.videoWidth
      const canvas = canvasElem.value.getContext('2d', { willReadFrequently: true })
      if (canvas) {
        canvas.drawImage(video, 0, 0, canvasElem.value.width, canvasElem.value.height)
        const imageData = canvas.getImageData(0, 0, canvasElem.value.width, canvasElem.value.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        })
        if (code) {
          drawLine(canvas, code.location.topLeftCorner, code.location.topRightCorner, '#FFF')
          drawLine(canvas, code.location.topRightCorner, code.location.bottomRightCorner, '#FFF')
          drawLine(canvas, code.location.bottomRightCorner, code.location.bottomLeftCorner, '#FFF')
          drawLine(canvas, code.location.bottomLeftCorner, code.location.topLeftCorner, '#FFF')
          mediaStream && mediaStream.getTracks()[0].stop()
          video.src = ''
          return onQRCodeFound(code.data)
        }
      }
    }
    requestAnimationFrame(() => tick(onQRCodeFound))
  }

  return new Promise<string>((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        video.srcObject = stream
        mediaStream = stream
        video.setAttribute('playsinline', 'true')
        video.play()
        requestAnimationFrame(() => tick(resolve))
      })
      .catch((err) => {
        reject(err)
      })
  })
}

const isAttendanceDialogShow = ref(false)
const onAttendanceBtnClicked = async () => {
  if (isStudent()) {
    qrcodeCapture().then((res) => {
      putClassroomAttendance(props.lesson.id, res).then(() => {
        ElMessage.success('签到成功')
        isAttendanceDialogShow.value = false
      })
    })
  }
  isAttendanceDialogShow.value = true
}
const onAttendanceBtnConfirmBtnClicked = () => {
  isAttendanceDialogShow.value = false
}

const isRollDialogShow = ref(false)
const rollModel = reactive({
  count: 1,
  question: ''
})
const rollSelectedStudent = reactive<
  {
    student_id: string
    name: string
  }[]
>([])
const onRollBtnClicked = async () => {
  rollModel.count = 1
  rollModel.question = ''
  isRollDialogShow.value = true
}
const onRollCommitBtnClicked = () => {
  getClassroomRoll(props.lesson.id, rollModel.count, rollModel.question)
    .then((res) => {
      rollSelectedStudent.length = 0
      rollSelectedStudent.push(...res.students)
      ElMessage.success('抽签成功')
    })
    .catch(() => {
      ElMessage.error('抽签失败')
    })
}
</script>

<template>
  <div class="p-4">
    <div class="flex mb-4 items-center" v-if="isTeacher()">
      <el-switch
        v-model="isClassroomOpening"
        class="mr-4"
        inline-prompt
        active-text="上课"
        inactive-text="下课"
        :before-change="onSwitchChanged"
      />
      <div class="flex items-center" v-if="isTeacher() && isClassroomOpening">
        <el-button type="primary" size="small" @click="onAttendanceBtnClicked"> 签到 </el-button>
        <el-button type="primary" size="small" @click="onRollBtnClicked"> 抽签 </el-button>
      </div>
    </div>
    <div class="flex mb-4 items-center" v-if="isStudent() && isClassroomOpening">
      <el-button type="primary" class="mr-3" size="small" @click="onAttendanceBtnClicked">
        签到
      </el-button>
    </div>
    <div>
      <p class="text-sm mb-4">
        <span v-if="isClassroomOpening"> 现在正在上课，请认真听讲。 </span>
        <span v-else>现在为下课时间，请认真回顾上课知识，检查作业完成情况。</span>
      </p>
      <div class="">
        <div class="flex flex-row items-center mb-2">
          <h3 class="font-bold mr-4">课堂互动记录</h3>
          <el-icon :size="16" class="animate-spin" v-if="interval.isActive">
            <Loading />
          </el-icon>
          <el-icon :size="16" v-else>
            <Warning />
          </el-icon>
        </div>
        <el-table :data="isClassroomOpening ? record : []">
          <el-table-column label="时间" width="180">
            <template #default="{ row }">
              <el-icon><Timer /></el-icon>
              {{ formatTime(row.time) }}
            </template>
          </el-table-column>
          <el-table-column label="事件" width="180">
            <template #default="{ row }">
              {{ renderEventType(row.type) }}
            </template>
          </el-table-column>
          <el-table-column label="描述" min-width="180">
            <template #default="{ row }">
              {{ renderEventDesc(row) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  <el-dialog v-model="isClassBeginDialogShow" title="课堂设置" class="w-5/6 sm:w-1/2">
    <el-form :model="classBeginModel" label-width="120px">
      <el-form-item label="上课主题">
        <el-input v-model="classBeginModel.title"></el-input>
      </el-form-item>
      <el-form-item label="签到有效时间">
        <el-input-number v-model="classBeginModel.expiration" :min="60"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="onClassBeginDialogConfirmBtnClicked">提交</el-button>
      <el-button @click="onClassBeginDialogCancelBtnClicked">取消</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="isAttendanceDialogShow" title="签到" class="w-5/6 sm:w-1/2">
    <div class="w-full sm:w-1/2 mx-auto flex flex-col items-center" v-if="isTeacher()">
      <el-image :src="qrcodeUrl" class="w-full"></el-image>
      <p class="text-xs mb-2">签到二维码</p>
    </div>
    <div class="w-2/3 mx-auto flex flex-col items-center" v-if="isStudent()">
      <div v-if="cameraReady">正在初始化摄像头...</div>
      <canvas ref="canvasElem" class="w-full mb-4"></canvas>
      <p class="text-xs mb-2">二维码扫描框</p>
    </div>
    <template #footer>
      <el-button type="primary" @click="onAttendanceBtnConfirmBtnClicked" class="w-full">
        确认
      </el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="isRollDialogShow" title="抽签" class="w-5/6 sm:w-1/2">
    <div class="mb-4">
      <el-input v-model="rollModel.question" placeholder="抽签问题" class="mb-4" />
      <div class="flex justify-between">
        <el-input-number
          v-model="rollModel.count"
          :min="1"
          :max="10"
          controls-position="right"
          placeholder="抽签人数"
          class="mr-4"
        />
        <el-button type="primary" @click="onRollCommitBtnClicked">抽签</el-button>
      </div>
    </div>
    <el-table :data="rollSelectedStudent" width="100%">
      <el-table-column prop="student_id" label="ID" width="180" />
      <el-table-column prop="name" label="Name" />
    </el-table>
  </el-dialog>
</template>

<style scoped></style>
