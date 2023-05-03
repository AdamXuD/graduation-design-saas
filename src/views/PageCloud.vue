<script setup lang="ts">
import CloudComponent from '@/components/CloudComponent.vue'
import { useTokenStore } from '@/stores/token'

defineProps<{
  shareid?: string
}>()

const { state } = useTokenStore()
</script>

<template>
  <div class="p-2 sm:p-4 sm:h-full">
    <cloud-component
      :shareid="shareid"
      :area="state.scope"
      :user-id="state.id"
      :show-control="true"
    ></cloud-component>
  </div>
</template>

<style scoped></style>
