import { login, logout, getInfo } from '@/api/login'
import { Message } from 'element-ui'
import { getToken, setToken, removeToken } from '@/utils/auth'
import createPersistedState from "vuex-persistedstate"
const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    errormes: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
      setToken(token);
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      const username = userInfo.userName.trim()
      localStorage.setItem('usershowName', username)
      const datauser = new FormData()
      datauser.append('userName', username)
      datauser.append('passWord', userInfo.passWord)
      // datauser.append('passWord', encrypt(userInfo.passWord, key, iv))
      datauser.append('code', userInfo.code)
      datauser.append('cId', userInfo.cId)
      return new Promise((resolve, reject) => {
        login(datauser).then(response => {
          var res = response.data
          if (res.status === 0 ) {
            // var licenseData = res.license
            // localStorage.setItem('userId',res.userID)
            sessionStorage.setItem('token', res.token)
            setToken(res.userType)
            commit('SET_TOKEN', res.userType)
            resolve(res)
          } else {
            resolve(res)
            // Message({message: res.errormessage, type: 'error', showClose: true})
            // commit('SET_ERROR', 'res.errorMessage')
            }
        }).catch(error => {
          // _this.$message({message: res.error, type: 'error'})
          // alert('3')
          //reject(new Error(error))
        })
      })
    },
    
    // 获取用户信息
    GetInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        var rolea = new Array()
        rolea.push(getToken())
        commit('SET_ROLES', getToken())
        resolve(getToken())
      })
    },

    // 登出
    LogOut ({ commit, state }) {
      return new Promise((resolve, reject) => {
        console.info(state)
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
         // Message.closeAll()
          localStorage.removeItem('usershowName')
          localStorage.removeItem('tokenrole')
          // localStorage.removeItem('menuListdata')
          localStorage.removeItem('userType')
          localStorage.removeItem('userId')
          localStorage.removeItem('loginnum')
          // sessionStorage.removeItem('token')
          window.sessionStorage.clear()
          // commit('CLEAR_LOCK')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
    // 动态修改权限
    ChangeRoles ({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getInfo(role).then(response => {
          const data = response
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve()
        })
      })
    }
  },
  plugins: [createPersistedState()]
}

export default user
