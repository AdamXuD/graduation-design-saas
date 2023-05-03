export interface CloudListItem {
  name: string
  type: 'folder' | 'file'
  size: number
  src: string
  modified_time: number
}

export interface CloudShare {
  id: number
  key: string
  type: 'folder' | 'file'
  path: string
  name: string
  expire: number
}
