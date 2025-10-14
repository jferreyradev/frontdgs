import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: () => import('../views/Reportes.vue'),
    },
    {
      path: '/consultas',
      name: 'consultas',
      component: () => import('../views/Consultas.vue'),
    },
    {
      path: '/configuracion',
      name: 'configuracion',
      component: () => import('../views/Configuracion.vue'),
    },
  ],
})

export default router
