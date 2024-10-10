import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import getters from './getters'
import permission from './modules/permission'
import leftMenuData from './modules/leftMenuData'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    permission,
    leftMenuData,
  },
  getters
})

export default store
