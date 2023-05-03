import { service } from '@/hooks/request'
import type { Task } from '@/types/task'
import type { LessonBrief } from '@/types/lesson'
import type { Dynamic } from '@/types/dynamic'
import type { Student } from '@/types/student'
import type { Teacher } from '@/types/teacher'
import type { Admin } from '@/types/admin'
import type { Class } from '@/types/class'
import type { Profession } from '@/types/profession'

type UserInfo = Student | Teacher | Admin
interface UserInfoUpdate {
  email: string
  phone: string
  avatar: string
  introduction: string
}

interface PasswordUpdate {
  old_password: string
  new_password: string
}

export function getDashboard(): Promise<{
  uncompleted_tasks: Task[]
  uncompleted_lessons: LessonBrief[]
  dynamics: Dynamic[]
}> {
  return service({
    url: '/public/dashboard',
    method: 'get'
  })
}

export function getPersonalInfo(): Promise<{
  personal: UserInfo
  class_?: Class
  profession?: Profession
}> {
  return service({
    url: '/public/personal-info',
    method: 'get'
  })
}

export function putPersonalInfo(data: UserInfoUpdate): Promise<null> {
  return service({
    url: '/public/personal-info',
    method: 'put',
    data
  })
}

export function putPassword(data: PasswordUpdate): Promise<null> {
  return service({
    url: '/public/password',
    method: 'put',
    data
  })
}

export function getDynamicList(): Promise<Dynamic[]> {
  return service({
    url: '/public/dynamic/list',
    method: 'get'
  })
}
