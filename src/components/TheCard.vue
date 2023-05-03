<script setup lang="ts"></script>

<template>
  <div class="card border border-border rounded shadow flex flex-col">
    <div class="card-header">
      <slot name="header"></slot>
    </div>
    <div class="card-body flex-1 overflow-auto scroll">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>
