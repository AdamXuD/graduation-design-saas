export interface LessonRecord {
  id: number
  lesson_id: number
  time: number
  data: string
}

export interface ParsedRecordData {
  type: string
  data: unknown
  time: number
}
