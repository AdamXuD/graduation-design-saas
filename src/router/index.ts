import { createRouter, createWebHistory } from 'vue-router'
import PageDashboard from '@/views/PageDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: PageDashboard,
      meta: {
        title: '仪表盘'
      }
    },
    {
      path: '/lesson',
      name: 'lesson',
      component: () => import('@/views/PageLesson.vue'),
      meta: {
        title: '课程'
      }
    },
    {
      path: '/lesson/:lessonId',
      name: 'lesson-detail',
      component: () => import('@/views/PageLessonDetail.vue'),
      meta: {
        title: '课程'
      },
      props: true,
      redirect: (to) => to.path + '/notice',
      children: [
        {
          path: 'notice',
          component: () => import('@/views/PageLessonDetailNotice.vue'),
          meta: {
            subtitle: '课程公告'
          }
        },
        {
          path: 'classroom',
          component: () => import('@/views/PageLessonDetailClassroom.vue'),
          meta: {
            subtitle: '课堂'
          }
        },
        {
          path: 'courseware',
          component: () => import('@/views/PageLessonDetailCourseware.vue'),
          meta: {
            subtitle: '课件'
          }
        },
        {
          path: 'homework',
          component: () => import('@/views/PageLessonDetailHomework.vue'),
          meta: {
            subtitle: '作业'
          }
        },
        {
          path: 'cloud',
          component: () => import('@/views/PageLessonDetailCloud.vue'),
          meta: {
            subtitle: '云盘'
          }
        }
      ]
    },
    {
      path: '/cloud',
      name: 'cloud',
      component: () => import('../views/PageCloud.vue'),
      meta: {
        title: '云盘'
      },
      props: (route) => ({ shareid: route.query.shareid })
    }
  ]
})

export default router
