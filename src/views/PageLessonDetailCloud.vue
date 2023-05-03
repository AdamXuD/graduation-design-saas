<script setup lang="ts">
import CloudComponent from '@/components/CloudComponent.vue'
import type { Lesson } from '@/types/lesson'
import { useTokenStore } from '@/stores/token'

defineProps<{
  lesson: Lesson
}>()

const { isTeacher } = useTokenStore()
</script>

<template>
  <div class="p-4">
    <cloud-component
      area="lesson"
      :user-id="lesson.id"
      :show-control="isTeacher()"
      small
    ></cloud-component>
  </div>
</template>

<style scoped></style>
