import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import babelpolyfill from 'babel-polyfill'
import 'font-awesome/css/font-awesome.min.css'
import 'element-ui/lib/theme-default/index.css'
import routes from './router'
import store from './store'
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.config.productionTip = false;
Vue.config.debug = true; 
Vue.config.devtools = true;
const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
