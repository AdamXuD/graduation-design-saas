import { service } from '@/hooks/request'
import type { ClassroomRecordItem } from '@/types/classroom'
import type { Lesson, LessonBrief } from '@/types/lesson'
import type { Student } from '@/types/student'
import type { Task } from '@/types/task'
import type { TaskStatus } from '@/types/task_status'
import type { Teacher } from '@/types/teacher'
import type { LessonRecord } from '@/types/lesson_record'

export function getLessons(): Promise<{
  lessons: LessonBrief[]
  semester: {
    year: number
    term: number
  }
}> {
  return service({
    url: '/lesson',
    method: 'get'
  })
}

export function getLessonDetail(lessonId: number): Promise<{
  lesson: Lesson
  teacher: Teacher
}> {
  return service({
    url: '/lesson/' + lessonId,
    method: 'get'
  })
}

export function getLessonTasks(lessonId: number): Promise<{
  tasks: Task[]
  statuses?: TaskStatus[]
}> {
  return service({
    url: '/lesson/' + lessonId + '/task',
    method: 'get'
  })
}

export function putLessonNotice(lessonId: number, notice: string): Promise<null> {
  return service({
    url: '/lesson/' + lessonId + '/notice',
    method: 'put',
    data: { notice }
  })
}

export function getClassroomPreData(lessonId: number): Promise<{
  students: Student[]
  histories: LessonRecord[]
}> {
  return service({
    url: '/lesson/' + lessonId + '/classroom/pre-data',
    method: 'get'
  })
}

export function getClassroomHistory(
  lessonId: number,
  historyId: number
): Promise<{
  history: LessonRecord[]
}> {
  return service({
    url: '/lesson/' + lessonId + '/classroom/history/' + historyId,
    method: 'get'
  })
}

export function getClassroom(lessonId: number): Promise<{
  classroom?: ClassroomRecordItem[]
  qrcode?: string
}> {
  return service({
    url: '/lesson/' + lessonId + '/classroom',
    method: 'get'
  })
}

export function putClassroomBegin(
  lessonId: number,
  data: {
    title: string
    expiration: number
  }
): Promise<null> {
  return service({
    url: '/lesson/' + lessonId + '/classroom/classbegin',
    method: 'put',
    data
  })
}

export function putClassroomEnd(lessonId: number): Promise<null> {
  return service({
    url: '/lesson/' + lessonId + '/classroom/classend',
    method: 'put'
  })
}

export function putClassroomAttendance(lessonId: number, qrcodeContent: string): Promise<null> {
  return service({
    url: '/lesson/' + lessonId + '/classroom/attendance',
    method: 'put',
    data: { qrcode: qrcodeContent }
  })
}

export function getClassroomRoll(
  lessonId: number,
  count: number,
  question: string
): Promise<{
  students: {
    student_id: string
    name: string
  }[]
}> {
  return service({
    url: '/lesson/' + lessonId + '/classroom/roll',
    method: 'get',
    params: { count, question }
  })
}

export function putHomeworkStatus(
  lesson_id: number,
  task_id: number,
  data: {
    text: string
    files: string
  }
): Promise<null> {
  return service({
    url: '/lesson/' + lesson_id + '/task/' + task_id + '/status',
    method: 'put',
    data
  })
}

export function putHomework(
  lesson_id: number,
  task_id: number,
  data: {
    title: string
    deadline: number
    description: string
  }
): Promise<null> {
  return service({
    url: '/lesson/' + lesson_id + '/task/' + task_id,
    method: 'put',
    data
  })
}

export function postHomework(
  lesson_id: number,
  data: {
    title: string
    deadline: number
    description: string
  }
): Promise<{
  task: Task
}> {
  return service({
    url: '/lesson/' + lesson_id + '/task',
    method: 'post',
    data
  })
}

export function deleteHomework(lesson_id: number, task_id: number): Promise<null> {
  return service({
    url: '/lesson/' + lesson_id + '/task/' + task_id,
    method: 'delete'
  })
}

export function putHomeworkEnd(lesson_id: number, task_id: number): Promise<null> {
  return service({
    url: '/lesson/' + lesson_id + '/task/' + task_id + '/end',
    method: 'put'
  })
}

export function getHomeworkChecking(lesson_id: number, task_id: number): Promise<TaskStatus[]> {
  return service({
    url: '/lesson/' + lesson_id + '/task/' + task_id + '/status-checking',
    method: 'get'
  })
}

export function putHomeworkChecking(
  lesson_id: number,
  task_id: number,
  data: {
    student_id: string
    score: number
  }
): Promise<null> {
  return service({
    url: '/lesson/' + lesson_id + '/task/' + task_id + '/status-checking',
    method: 'put',
    data
  })
}

export function putLessonCourseware(lesson_id: number, data: string): Promise<null> {
  return service({
    url: '/lesson/' + lesson_id + '/courseware',
    method: 'put',
    data: { courseware: data }
  })
}
