import { createRouter, createWebHistory } from 'vue-router'
import Tabler from '@/views/Tabler.vue'
import TableComponents from '@/views/TableComponents.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Tabler,
    },
    {
      path: '/vibecoded',
      name: 'ahh',
      component: TableComponents,
    },
  ],
})

export default router
