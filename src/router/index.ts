import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/recommend',
  },
  {
    path: '/rank',
    name: 'rank',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/rank/rank.vue')
  },
  {
    path: '/singer',
    component: () => import('@/views/singer/singer.vue'),
    children: [
      {
        path: ':id',
        component: () => import('views/singer-detail/singer-detail.vue')
      }
    ]
  },
  {
    path: '/search',
    component: () => import('views/search/search.vue'),
    children: [
      {
        path: ':id',
        component: () => import('views/singer-detail/singer-detail.vue')
      }
    ]
  },
  {
    path: '/recommend',
    component: () => import('views/recommend/recommend.vue'),
    children: [
      {
        path: '/:id',
        component: () => import('views/disc/disc.vue')
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
