import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import PhosphorVue from "phosphor-vue"

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBook, faChalkboardTeacher, faCrosshairs, faIdBadge, faMagnifyingGlass, faPen, faPersonChalkboard, faPlus, faScroll, faTrash, faUser, faUserGroup, faUsers, faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { group } from 'console'

library.add(faUserSecret, faTrash, faPen, faUsers, faScroll, faChalkboardTeacher, faBook, faIdBadge, faUserGroup, faMagnifyingGlass, faPersonChalkboard, faUser, faCrosshairs)


createApp(App).use(store).use(router).component('font-awesome-icon', FontAwesomeIcon).use(PhosphorVue).mount('#app')
