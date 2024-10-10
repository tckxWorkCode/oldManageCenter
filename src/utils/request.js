import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui';
import { MessageBox } from 'element-ui';
import { getToken } from '@/utils/auth'
// 创建axios实例
var url = "";
var tempUrl = window.document.location.href;  
if(url === ""){
  url = tempUrl.split("#")[0];
}
// console.log(url)
// 创建axios实例

const service = axios.create({
  // baseURL:'https://192.168.14.237:8081/',
  // baseURL:'https://192.168.1.46:8081/',//何成
  // baseURL:'http://192.168.1.137:8081/',//唐昌华
  // baseURL:'https://10.0.5.79:8081/',// 
  // baseURL:'https://10.0.5.91:8081/',
  // baseURL:'https://192.168.0.140:8081/',
  // baseURL:'https://10.0.5.78:8081/',
  // baseURL: baseURLStr.ApiUrl, // api的base_url
  baseURL:url,
  withCredentials:true,
  crossDomain: true,
  timeout: 60000, // 请求超时时间,
  // headers:{
  //   'token': localStorage.getItem('tokenrole'),  
  // }, 
})
// request拦截器
service.interceptors.request.use(config => {
  // console.info('请求配置',config)
  config.headers['Content-type'] = 'application/json;charset=UTF-8'
  config.headers['Set-Cookie'] = sessionStorage.getItem('sessionId')
  // config.headers['sessionId'] = sessionStorage.getItem('sessionId')
  if (config.url.indexOf('license_search') === -1) {
    //  console.log(sessionStorage.getItem('sessionId'))
    
    if (store.getters.token) {
      config.headers['token'] = sessionStorage.getItem('token') // 让每个请求携带自定义token 请根据实际情况自行修改
    } else {
      config.headers['token'] = null
    }
  }
  if(location.protocol === 'https:') {
    config.baseURL = config.baseURL.replace(/^http:/, 'https:')
  }
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    // debugger
    // console.log(response)
    // console.log(url)
    if(response.data.errormessage =="non null key required") {
      window.location.href="/"
    } else if (response.data.status == 500) {
      Message({ message: response.data.errormessage, type: "error", showClose: true,});
      return response
    } else if (response.data.status == 10086) {
      Message({ message: response.data.errormessage, type: "error", showClose: true,});
      window.location.href="/"
    }
    else {
      return response
    }
  },
  error => {
    // debugger
    console.log(error)
    console.log(error.response)
    // if (error.response.status == 1001) {
      // Message({ message: error.response.data.errormessage, type: "error", showClose: true,});
    // }
    if(error.response.status === 10086 || error.response.data.status === 10086){
      Message({ message: error.response.data.errormessage, type: "error", showClose: true,});
      window.location.href="/"
    } else if (error.response.status == 400) {
      Message({ message: error.response.data.errormessage, type: "error", showClose: true,});
      return error.response
    } else {
      return Promise.reject(error)
    }
  }
)

export default service

//const service = axios.create({
// baseURL: 'http://192.168.1.68:8080/',
// baseURL: 'http://10.0.2.224:8080/', // api的base_url
//baseURL: process.env.SERVER_PORT,
//timeout: 5000 // 请求超时时间
//})
// var baseUrl = window.getComputedStyle.ApiUrl
