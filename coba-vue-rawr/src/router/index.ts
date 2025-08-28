import { createRouter, createWebHistory } from 'vue-router'
import Tabler from '@/views/Tabler.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Tabler,
    },
  ],
})

export default router
