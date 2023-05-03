import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'

export const useTokenStore = defineStore('token', () => {
  const token = useLocalStorage('token', '')

  const state = computed(() => {
    try {
      const { username, scope } = JSON.parse(
        decodeURIComponent(escape(window.atob(token.value.split('.')[1])))
      ) as { username: string; scope: string }
      return { id: username, scope }
    } catch (e) {
      token.value = ''
      return { id: '', scope: '' }
    }
  })

  const isTeacher = () => state.value.scope === 'teacher'
  const isStudent = () => state.value.scope === 'student'
  const isAdmin = () => state.value.scope === 'admin'

  return { token, state, isTeacher, isStudent, isAdmin }
})
