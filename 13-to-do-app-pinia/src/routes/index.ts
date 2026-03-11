import { useTodoStore } from '@/stores/useTodoStore'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/tasks/active',
    name: 'active-tasks',
    component: () => import('@/views/TaskListView.vue'),
    beforeEnter: (to, from, next) => {
      const store = useTodoStore()
      store.filter = 'active'
      next()
    },
  },
  {
    path: '/tasks/done',
    name: 'done-tasks',
    component: () => import('@/views/TaskListView.vue'),
    beforeEnter: (to, from, next) => {
      const store = useTodoStore()
      store.filter = 'done'
      next()
    },
  },
  {
    path: '/task/:id',
    name: 'task-detail',
    component: () => import('@/views/TaskDetailView.vue'),
    props: true,
  },
  {
    path: '/tags/:tag',
    name: 'tag-tasks',
    component: () => import('@/views/TagView.vue'),
    props: true,
  },
  {
    path: '/stats',
    name: 'statistics',
    component: () => import('@/views/StatisticsView.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'text-violet-500 bg-violet-500/10',
})
