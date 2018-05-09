import Vue from 'vue'
import Router from 'vue-router'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Home from '@/components/Home'
import Settings from '@/components/Settings'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      components: {
        main: Home,
        header: Header,
        sidebar: Sidebar
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      components: {
        main: Settings,
        header: Header,
        sidebar: Sidebar
      }
    }
  ]
})
