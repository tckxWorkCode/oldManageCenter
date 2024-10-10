import Vue from 'vue'

import ElementUI from 'element-ui'

import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import request from '@/utils/request'

// import '@/permission'
import Common from '@/components/common/configVariable.vue'

import 'element-ui/lib/theme-chalk/index.css'


Vue.use(ElementUI)

axios.defaults.withCredentials = true
Vue.config.productionTip = false
Vue.prototype.bus = new Vue()
Vue.prototype.$axios= axios
Vue.prototype.Common = Common
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


router.beforeEach((to, from, next) => {
  // console.log(to);
  // console.log(from);
  // if(sessionStorage.getItem('token')){ //判断本地是否存在access_token
  //   next();
  // }else {
  //   if(to.path === '/login'){
  //     next();
  //   }else {
  //     // next({ path:'/login'})
  //     return next('login')
  //   }
  // }
  if(to.path ==='/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr){
    return next ('/login') 
  } else{ next() }
  
  /*如果本地 存在 token 则 不允许直接跳转到 登录页面*/
  if(to.fullPath == "/login"){
    if(sessionStorage.getItem('token')){
      next({
        path:from.fullPath
      });
    }else {
      if (localStorage.getItem('loginnum')) {
        next()
      } else {
        next({path:'/'});
      }
    }
  }
});

window.addEventListener('visibilitychange',function() {
  if (document.hidden === false && Common.global.userId !== localStorage.getItem('userId')) {
    // 只有当初始创建的userId不等于localStorage里面的userId的时候去覆盖掉这个userId的值并且需要先刷新浏览器窗口
    // 原生JS提供的方法
    window.location.reload()  
    Common.global.userId = localStorage.getItem('userId')
  } else {
    Common.global.userId = localStorage.getItem('userId')
  }
  // console.log(Common.global.userId,localStorage.getItem('userId'))
})