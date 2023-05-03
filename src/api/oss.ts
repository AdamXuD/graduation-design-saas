import { service } from '@/hooks/request'
import type { CloudListItem, CloudShare } from '@/types/cloud'

interface PublicFileUploadReturn {
  filename: string
  url: string
}

export function putHomeworkObject(
  task_id: number,
  files: File[]
): Promise<PublicFileUploadReturn[]> {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })
  return service({
    url: '/oss/public/homework/' + task_id,
    method: 'put',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function deleteHomeworkObject(task_id: number, filenames: string[]): Promise<null> {
  return service({
    url: '/oss/public/homework/' + task_id,
    method: 'delete',
    data: filenames
  })
}

export function putCoursewareObject(
  lesson_id: number,
  files: File[]
): Promise<PublicFileUploadReturn[]> {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })
  return service({
    url: '/oss/public/courseware/' + lesson_id,
    method: 'put',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function deleteCoursewareObject(lesson_id: number, filenames: string[]): Promise<null> {
  return service({
    url: '/oss/public/courseware/' + lesson_id,
    method: 'delete',
    data: filenames
  })
}

export function putCloudObjects(
  area: string,
  user_id: string | number,
  path: string,
  files: File[]
): Promise<null> {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })
  return service({
    url: '/oss/cloud/' + area + '/' + user_id + '/file',
    method: 'put',
    params: { path },
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function deleteCloudObjects(
  area: string,
  user_id: string | number,
  path: string,
  names: string[]
): Promise<null> {
  return service({
    url: '/oss/cloud/' + area + '/' + user_id,
    method: 'delete',
    params: { path },
    data: names
  })
}

export function getCloudList(
  area: string,
  user_id: string | number,
  path: string = '/'
): Promise<CloudListItem[]> {
  return service({
    url: '/oss/cloud/' + area + '/' + user_id + '/list',
    method: 'get',
    params: { path }
  })
}

export function getCloudObject(
  area: string,
  user_id: string | number,
  path: string
): Promise<Blob> {
  return service({
    url: '/oss/cloud/' + area + '/' + user_id + '/file',
    method: 'get',
    params: { path },
    responseType: 'blob'
  })
}

export function putCloudName(
  area: string,
  user_id: string | number,
  path: string,
  old_name: string,
  new_name: string
): Promise<null> {
  return service({
    url: '/oss/cloud/' + area + '/' + user_id + '/name',
    method: 'put',
    params: { path },
    data: { old_name, new_name }
  })
}

export function moveCloudObjects(
  area: string,
  user_id: string | number,
  src_path: string,
  dst_path: string,
  names: string[]
): Promise<null> {
  return service({
    url: '/oss/cloud/' + area + '/' + user_id + '/move',
    method: 'put',
    data: { src_path, dst_path, names }
  })
}

export function copyCloudObjects(
  area: string,
  user_id: string | number,
  src_path: string,
  dst_path: string,
  names: string[]
): Promise<null> {
  return service({
    url: '/oss/cloud/' + area + '/' + user_id + '/copy',
    method: 'put',
    data: { src_path, dst_path, names }
  })
}

export function postCloudShare(
  area: string,
  user_id: string | number,
  path: string,
  expire: number
): Promise<CloudShare> {
  return service({
    url: '/oss/cloud/' + area + '/' + user_id + '/share',
    method: 'post',
    data: { path, expire }
  })
}

export function getCloudShare(share_id: string): Promise<CloudShare> {
  return service({
    url: '/oss/cloud/share',
    method: 'get',
    params: { share_id }
  })
}

export function putCloudShareRecv(
  area: string,
  user_id: string | number,
  share_id: string,
  path: string
): Promise<null> {
  return service({
    url: '/oss/cloud/' + area + '/' + user_id + '/share/recv',
    method: 'put',
    data: { share_id, path }
  })
}
