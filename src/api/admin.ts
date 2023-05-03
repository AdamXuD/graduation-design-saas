import { service } from '@/hooks/request'
import type { Profession } from '@/types/profession'
import type { Option } from '@/types/option'
import type { Class } from '@/types/class'
import type { Teacher } from '@/types/teacher'
import type { Student } from '@/types/student'
import type { Lesson } from '@/types/lesson'

interface PaginatedData<T> {
  data: T[]
  total: number
}

interface PaginationParams {
  page: number
  page_size: number
  keyword?: string
}

export function getOptions(): Promise<Option[]> {
  return service({
    url: '/admin/option/list',
    method: 'get'
  })
}

export function putOption(data: Option): Promise<null> {
  return service({
    url: '/admin/option/' + data.key,
    method: 'put',
    data: { value: data.value }
  })
}

export function getProfessionList(params: PaginationParams): Promise<PaginatedData<Profession>> {
  return service({
    url: '/admin/profession/list',
    method: 'get',
    params
  })
}

export function postProfession(data: Omit<Profession, 'id'>): Promise<null> {
  return service({
    url: '/admin/profession',
    method: 'post',
    data
  })
}

export function putProfession(data: Profession): Promise<null> {
  return service({
    url: '/admin/profession/' + data.id,
    method: 'put',
    data: { name: data.name }
  })
}

export function deleteProfession(id: number): Promise<null> {
  return service({
    url: '/admin/profession/' + id,
    method: 'delete'
  })
}

export function getClassList(params: PaginationParams): Promise<PaginatedData<Class>> {
  return service({
    url: '/admin/class/list',
    method: 'get',
    params
  })
}

export function postClass(data: Omit<Class, 'id'>): Promise<null> {
  return service({
    url: '/admin/class',
    method: 'post',
    data
  })
}

export function putClass(data: Class): Promise<null> {
  return service({
    url: '/admin/class/' + data.id,
    method: 'put',
    data: {
      grade: data.grade,
      profession_id: data.profession_id,
      name: data.name
    }
  })
}

export function deleteClass(id: number): Promise<null> {
  return service({
    url: '/admin/class/' + id,
    method: 'delete'
  })
}
export function getTeacherList(params: PaginationParams): Promise<PaginatedData<Teacher>> {
  return service({
    url: '/admin/teacher/list',
    method: 'get',
    params
  })
}

export function postTeacher(data: Teacher): Promise<null> {
  return service({
    url: '/admin/teacher',
    method: 'post',
    data
  })
}

export function putTeacher(
  id: string,
  data: Teacher & {
    reset_password: boolean
  }
): Promise<null> {
  return service({
    url: '/admin/teacher/' + id,
    method: 'put',
    data
  })
}

export function deleteTeacher(id: string): Promise<null> {
  return service({
    url: '/admin/teacher/' + id,
    method: 'delete'
  })
}

export function getStudentList(params: PaginationParams): Promise<PaginatedData<Student>> {
  return service({
    url: '/admin/student/list',
    method: 'get',
    params
  })
}

export function postStudent(data: Student): Promise<null> {
  return service({
    url: '/admin/student',
    method: 'post',
    data
  })
}

export function putStudent(
  id: string,
  data: Student & {
    reset_password: boolean
  }
): Promise<null> {
  return service({
    url: '/admin/student/' + id,
    method: 'put',
    data
  })
}

export function deleteStudent(id: string): Promise<null> {
  return service({
    url: '/admin/student/' + id,
    method: 'delete'
  })
}

export function getLessonList(params: PaginationParams): Promise<PaginatedData<Lesson>> {
  return service({
    url: '/admin/lesson/list',
    method: 'get',
    params
  })
}

export function postLesson(data: Omit<Lesson, 'id'>): Promise<null> {
  return service({
    url: '/admin/lesson',
    method: 'post',
    data
  })
}

export function putLesson(data: Lesson): Promise<null> {
  return service({
    url: '/admin/lesson/' + data.id,
    method: 'put',
    data: {
      title: data.title,
      teacher_id: data.teacher_id,
      year: data.year,
      term: data.term,
      is_over: data.is_over,
      thumbnail: data.thumbnail,
      notice: data.notice,
      courseware: data.courseware
    }
  })
}

export function deleteLesson(id: number): Promise<null> {
  return service({
    url: '/admin/lesson/' + id,
    method: 'delete'
  })
}

export function getLessonClassList(id: number): Promise<Class[]> {
  return service({
    url: '/admin/lesson/' + id + '/class/list',
    method: 'get'
  })
}

export function putLessonClassList(id: number, class_ids: number[]): Promise<null> {
  return service({
    url: '/admin/lesson/' + id + '/class',
    method: 'put',
    data: class_ids
  })
}
