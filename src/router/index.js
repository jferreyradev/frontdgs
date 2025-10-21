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
      path: '/reportes/reposicore',
      name: 'reportes-reposicore',
      component: () => import('../views/reportes/ReporteSicore.vue'),
    },
    {
      path: '/reportes/inventario',
      name: 'reportes-inventario',
      component: () => import('../views/reportes/ReportesInventario.vue'),
    },
    {
      path: '/reportes/usuarios',
      name: 'reportes-usuarios',
      component: () => import('../views/reportes/ReportesUsuarios.vue'),
    },
    {
      path: '/reportes/financiero',
      name: 'reportes-financiero',
      component: () => import('../views/reportes/ReportesFinanciero.vue'),
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
    {
      path: '/ejemplos/combos',
      name: 'ejemplo-combos',
      component: () => import('../views/EjemploCombos.vue'),
    },
    {
      path: '/demo/combos',
      name: 'demo-combos',
      component: () => import('../views/DemoCombos.vue'),
    },
    {
      path: '/ejemplos/selector-periodo',
      name: 'ejemplo-selector-periodo',
      component: () => import('../views/EjemploSelectorPeriodo.vue'),
    },
    {
      path: '/demo/filtros-completos',
      name: 'demo-filtros-completos',
      component: () => import('../views/DemoFiltrosCompletos.vue'),
    },
  ],
})

export default router
