import { createRouter, createWebHistory } from 'vue-router'
import PageLogin from '@/views/PageLogin.vue'
import PageApp from '@/views/PageApp.vue'
import { useTokenStore } from '@/stores/token'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: PageLogin,
      meta: {
        title: '登录'
      },
      props: (router) => ({ redirect: router.query.redirect })
    },
    {
      path: '/404',
      name: 'not-found',
      component: () => import('@/views/PageNotFound.vue'),
      meta: {
        title: '页面未找到'
      }
    }
  ]
})

function addRoute() {
  const { isAdmin } = useTokenStore()
  if (!isAdmin()) {
    router.addRoute({
      path: '/',
      name: 'common',
      redirect: 'dashboard',
      component: PageApp,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/PageDashboard.vue'),
          meta: {
            title: '仪表盘'
          }
        },
        {
          path: 'lesson',
          name: 'lesson-list',
          component: () => import('@/views/PageLesson.vue'),
          meta: {
            title: '课程'
          }
        },
        {
          path: 'lesson/:lessonId',
          name: 'lesson-detail',
          component: () => import('@/views/PageLessonDetail.vue'),
          meta: {
            title: '课程'
          },
          props: true,
          redirect: (to) => `lesson/${to.params.lessonId}/notice`,
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
          path: 'cloud',
          name: 'cloud',
          component: () => import('@/views/PageCloud.vue'),
          meta: {
            title: '云盘'
          },
          props: (route) => ({ shareid: route.query.shareid })
        }
      ]
    })
  } else {
    router.addRoute({
      path: '/',
      name: 'admin',
      redirect: 'option',
      component: PageApp,
      children: [
        {
          path: 'option',
          name: 'option',
          component: () => import('@/views/PageAdminOption.vue'),
          meta: {
            title: '设置'
          }
        },
        {
          path: 'profession',
          name: 'profession',
          component: () => import('@/views/PageAdminProfession.vue'),
          meta: {
            title: '专业编辑'
          }
        },
        {
          path: 'class',
          name: 'class',
          component: () => import('@/views/PageAdminClass.vue'),
          meta: {
            title: '班级编辑'
          }
        },
        {
          path: 'student',
          name: 'student',
          component: () => import('@/views/PageAdminStudent.vue'),
          meta: {
            title: '学生编辑'
          }
        },
        {
          path: 'teacher',
          name: 'teacher',
          component: () => import('@/views/PageAdminTeacher.vue'),
          meta: {
            title: '教师编辑'
          }
        },
        {
          path: 'lesson',
          name: 'lesson',
          component: () => import('@/views/PageAdminLesson.vue'),
          meta: {
            title: '课程编辑'
          }
        }
      ]
    })
  }
  router.addRoute({
    name: '404-redirect',
    path: '/:pathMatch(.*)',
    redirect: '/404'
  })
}

function resetRouter() {
  const routes = router.getRoutes()
  if (routes.find((item) => item.name === 'admin')) {
    router.removeRoute('admin')
  } else if (routes.find((item) => item.name === 'common')) {
    router.removeRoute('common')
  }
  router.removeRoute('404-redirect')
}

function isAddedRoutes() {
  const routes = router.getRoutes()
  return (
    routes.find((item) => item.name === 'admin') || routes.find((item) => item.name === 'common')
  )
}

router.beforeEach((to, from, next) => {
  const tokenStore = useTokenStore()
  if (to.path !== '/login' && to.path !== '/404') {
    if (tokenStore.token !== '') {
      if (!isAddedRoutes()) {
        addRoute()
        router.push({ ...to, replace: true })
      }
      next()
    } else {
      next({ path: '/login', query: { redirect: to.fullPath } })
    }
  } else {
    resetRouter()
    next()
  }
})

router.addRoute

export default router
