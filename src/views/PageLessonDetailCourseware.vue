<script setup lang="ts">
import { courseware } from '@/fakeData'
import { reactive, ref } from 'vue'

const expandedStatus = reactive<{ [key: number]: boolean }>({})
const toggleExpandedStatus = (index: number) => {
  expandedStatus[index] = !expandedStatus[index]
}

const activeItem = ref<{
  title: string
  type: string
  src: string
} | null>(null)
</script>

<template>
  <div class="p-[16px]">
    <ul v-if="!activeItem">
      <li
        v-for="(item, index) in courseware"
        :key="`first-${index}`"
        class="px-[8px] border-b border-[#eaeaea] cursor-pointer"
      >
        <div
          class="flex flex-row justify-between items-center py-[16px]"
          @click="toggleExpandedStatus(index)"
        >
          <div class="first-title flex flex-row items-center">
            <el-icon :size="16" class="mr-[8px]">
              <Collection />
            </el-icon>
            <h3 class="font-bold">
              {{ item.chapter }}
            </h3>
          </div>
          <el-icon>
            <ArrowRight v-if="!expandedStatus[index]" />
            <ArrowDown v-else />
          </el-icon>
        </div>
        <ul class="ml-[24px] mb-[16px]" v-if="expandedStatus[index]">
          <li v-for="(ite, inde) in item.children" :key="`second-${inde}`" class="mb-[16px] group">
            <div
              class="second-title flex flex-row items-center mb-[8px] group-hover:text-[#409eff]"
            >
              <el-icon :size="16" class="mr-[8px]">
                <Memo />
              </el-icon>
              <h4>
                {{ ite.chapter }}
              </h4>
            </div>
            <ul class="ml-[24px]">
              <li
                v-for="(it, ind) in ite.content"
                :key="`third-${ind}`"
                class="third-title flex flex-row items-center mb-[8px]"
                @click="activeItem = it"
              >
                <el-icon :size="14" class="mr-[8px]">
                  <VideoPlay v-if="it.type === 'video'" />
                  <Document v-else />
                </el-icon>
                <h5 class="text-[14px]">
                  {{ it.title }}
                </h5>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    <div class="flex flex-col h-full" v-else>
      <div class="title flex flex-row items-center mb-[16px]">
        <div
          class="back-btn text-[18px] flex flex-row items-center px-[16px] border-r border-[#eaeaea] mr-[16px] cursor-pointer"
          @click="activeItem = null"
        >
          <el-icon :size="18">
            <ArrowLeft></ArrowLeft>
          </el-icon>
          返回
        </div>
        <h5>{{ activeItem.title }}</h5>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center">
        <video
          :src="activeItem.src"
          autoplay
          controls
          class="w-full h-full"
          v-if="activeItem.type === 'video'"
        ></video>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
