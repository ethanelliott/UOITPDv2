import Vue from 'vue'
import Router from 'vue-router'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Home from '@/components/Home'
import Settings from '@/components/Settings'
import Course from '@/components/Course'
import Calendar from '@/components/Calendar'
import Todo from '@/components/Todo'
import Projects from '@/components/Projects'
import Notes from '@/components/Notes'
import Weather from '@/components/Weather'
import Login from '@/components/Login'

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
    },
    {
      path: '/login',
      name: 'Login',
      components: {
        main: Login,
        header: Header,
        sidebar: Sidebar
      }
    },
    {
      path: '/calendar',
      name: 'Calendar',
      components: {
        main: Calendar,
        header: Header,
        sidebar: Sidebar
      }
    },
    {
      path: '/todo',
      name: 'ToDo',
      components: {
        main: Todo,
        header: Header,
        sidebar: Sidebar
      }
    },
    {
      path: '/projects',
      name: 'Projects',
      components: {
        main: Projects,
        header: Header,
        sidebar: Sidebar
      }
    },
    {
      path: '/notes',
      name: 'Notes',
      components: {
        main: Notes,
        header: Header,
        sidebar: Sidebar
      }
    },
    {
      path: '/weather',
      name: 'Weather',
      components: {
        main: Weather,
        header: Header,
        sidebar: Sidebar
      }
    },
    {
      path: '/course/:courseid',
      name: 'Course',
      components: {
        main: Course,
        header: Header,
        sidebar: Sidebar
      },
      props: {
        default: true, main: true
      }
    }
  ]
})
