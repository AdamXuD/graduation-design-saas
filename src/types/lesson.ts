export interface LessonBrief {
  id: number
  title: string
  teacher_id: string
  year: number
  term: number
  is_over: boolean
  thumbnail: string
}

export interface Lesson extends LessonBrief {
  notice: string
  courseware: string
}
