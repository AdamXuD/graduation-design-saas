<script setup lang="ts"></script>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="flex flex-col items-center justify-center px-6">
      <h3 class="mb-6 text-2xl">页面未找到</h3>
      <p class="text-sm mb-6">你正在寻找的页面不存在。</p>
      <el-button type="primary" @click="$router.go(-1)">返回上一页</el-button>
    </div>
    <div class="text-9xl px-6 border-l border-l-border">😭</div>
  </div>
</template>

<style scoped></style>
