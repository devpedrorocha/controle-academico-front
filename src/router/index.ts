import { createRouter, createWebHistory } from 'vue-router'
import userSubjects from '../views/userSubjects.vue'
import AdminView from '../views/AdminView.vue'
import LoginView from '../views/LoginView.vue'
import store from "../store/index"
/* import store from '@/store' */

import UsersView from '../views/Views-CA/UsersView.vue'
import EnrolledsView from '../views/Views-CA/EnrolledsView.vue'
import ClassesView from '../views/Views-CA/ClassesView.vue'
import SubjectsView from '../views/Views-CA/SubjectsView.vue'
import RolesView from '../views/Views-CA/RolesView.vue'
import ActionsView from '../views/Views-CA/ActionsView.vue'
import CreateEnrolledView from '../views/Views-CA/CreateEnrolledView.vue'


const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView

  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: {
      auth: true
    }
  },
  {
    path: '/userSubjects',
    name: 'user subjects',
    component: userSubjects
  },
  {
    path: '/users',
    name: 'users',
    component: UsersView,
    meta: {
      auth: true
    }
  },
  {
    path: '/enrolleds',
    name: 'enrolleds',
    component: EnrolledsView,
    meta: {
      auth: true
    }
  },
  {
    path: '/classes',
    name: 'classes',
    component: ClassesView,
    meta: {
      auth: true
    }
  },
  {
    path: '/subjects',
    name: 'subjects',
    component: SubjectsView,
    meta: {
      auth: true
    }
  },
  {
    path: '/roles',
    name: 'roles',
    component: RolesView,
    meta: {
      auth: true
    }
  },
  {
    path: '/actions',
    name: 'actions',
    component: ActionsView,
    meta: {
      auth: true
    }
  },
  {
    path: '/create/enrolled',
    name: 'create enrolled',
    component: CreateEnrolledView,
    meta: {
      auth: true
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach((to, from, next) => {

  if (to.meta.auth) {
    if (store.state.logged === true) {
      next()
    } else {
      next('/')
    }
  } else {
    next();
  }
})

export default router
