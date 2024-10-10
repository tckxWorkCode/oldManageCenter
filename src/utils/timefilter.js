/**
 * Created by jiachenpan on 16/11/18.
 */

 export function parseTime (time, cFormat) {
    if (arguments.length === 0) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if (('' + time).length === 10) time = parseInt(time) * 1000
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key]
      if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
    return timeStr
  }
  
  export function formatTime (time, option) {
    time = +time * 1000
    const d = new Date(time)
    const now = Date.now()
  
    const diff = (now - d) / 1000
  
    if (diff < 30) {
      return '刚刚'
    } else if (diff < 3600) { // less 1 hour
      return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
      return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
      return '1天前'
    }
    if (option) {
      return parseTime(time, option)
    } else {
      return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
    }
  }
  export function param2Obj (url) {
    const search = url.split('?')[1]
    if (!search) {
      return {}
    }
    return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
  }
  
  /* yyyy-MM-dd hh:mm:ss时间转换 */
  export function timeToZh (param) {
    if (param) {
    var famtY = new Date(param).getFullYear()
    if ((new Date(param).getMonth() + 1) < 10) {
      var famtM = '0' + (new Date(param).getMonth() + 1)
    } else {
      famtM = new Date(param).getMonth() + 1
    }
    if (new Date(param).getDate() < 10) {
      var famtD = '0' + new Date(param).getDate()
    } else {
      famtD = new Date(param).getDate()
    }
    if (new Date(param).getHours() === 0) {
      var famtH = '00'
    } else {
      if (new Date(param).getHours() > 9) {
        var famtH = new Date(param).getHours()
      } else if(new Date(param).getHours() > 0 && new Date(param).getHours() < 10) {
        var famtH = '0' + new Date(param).getHours()
      }
    }
    if (new Date(param).getMinutes() === 0) {
      var famtF ='00'
    } else {
      if (new Date(param).getMinutes() > 9) {
        var famtF = new Date(param).getMinutes()
      } else if (new Date(param).getMinutes() > 0 && new Date(param).getMinutes() < 10){
        var famtF = '0' + new Date(param).getMinutes()
      }
    }
    // if (new Date(param).getMinutes()) {
    //   if (new Date(param).getMinutes() > 9) {
    //     var famtF = new Date(param).getMinutes()
    //   } else if (new Date(param).getMinutes() === 0) {
    //     var famtF ='00'
    //   }else if (new Date(param).getMinutes() > 0 && new Date(param).getMinutes() < 10){
    //     var famtF = '0' + new Date(param).getMinutes()
    //   }
    // }
    if (new Date(param).getSeconds() === 0) {
      var famtS = '00'
    }else if (new Date(param).getSeconds() ){
      if (new Date(param).getSeconds() > 9) {
        var famtS = new Date(param).getSeconds()
      }else if (new Date(param).getSeconds() > 0 && new Date(param).getSeconds() < 10 ){
        var famtS = '0' + new Date(param).getSeconds()
      }
      
    }
    return famtY + '-' + famtM + '-' + famtD + ' ' + famtH + ':' + famtF + ':' + famtS
  } else {
    return ''
  }
  }
  
  /* yyyy-MM-dd hh:mm:ss时间转换 */
  export function dataToZh (param) {
    if (param) {
    var famtY = new Date(param).getFullYear()
    if ((new Date(param).getMonth() + 1) < 10) {
      var famtM = '0' + (new Date(param).getMonth() + 1)
    } else {
      famtM = new Date(param).getMonth() + 1
    }
    if (new Date(param).getDate() < 10) {
      var famtD = '0' + new Date(param).getDate()
    } else {
      famtD = new Date(param).getDate()
    }
    if (new Date(param).getHours() === 0) {
      var famtH = '00'
    } else {
      if (new Date(param).getHours() > 9) {
        var famtH = new Date(param).getHours()
      } else if(new Date(param).getHours() > 0 && new Date(param).getHours() < 10) {
        var famtH = '0' + new Date(param).getHours()
      }
    }
    if (new Date(param).getMinutes() === 0) {
      var famtF ='00'
    } else {
      if (new Date(param).getMinutes() > 9) {
        var famtF = new Date(param).getMinutes()
      } else if (new Date(param).getMinutes() > 0 && new Date(param).getMinutes() < 10){
        var famtF = '0' + new Date(param).getMinutes()
      }
    }
  
    if (new Date(param).getSeconds() === 0) {
      var famtS = '00'
    }else if (new Date(param).getSeconds() ){
      if (new Date(param).getSeconds() > 9) {
        var famtS = new Date(param).getSeconds()
      }else if (new Date(param).getSeconds() > 0 && new Date(param).getSeconds() < 10 ){
        var famtS = '0' + new Date(param).getSeconds()
      }
      
    }
    return famtY + '-' + famtM + '-' + famtD
  } else {
    return ''
  }
  }
  
  export function getDateStr (seconds) {
    let date = new Date(seconds*1000)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    let second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    let currentTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    return currentTime
  }
  