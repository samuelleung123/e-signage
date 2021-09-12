import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Editor from "@/views/Editor.vue";
import Viewer from "@/views/Viewer.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'E-Signage',
    component: Home
  },
  {
    path: '/viewer',
    name: 'Viewer',
    component: Viewer
  },
  {
    path: '/editor',
    name: 'Editor',
    component: Editor
  },
]

const router = new VueRouter({
  routes
})

export default router
