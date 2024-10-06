// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import './index.css'

const RedirectedPage = { template: '<h2>Welcome to the Redirected Page!</h2>' }

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: App },
  { path: '/redirected', component: RedirectedPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(router).mount('#app')
