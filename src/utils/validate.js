import request from './request'
/* 验证内容是否英文数字以及下划线 */
export function isPassword (rule, value, callback) {
  const reg =/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{6,16}$/
  if (value.length > 16 || value.length < 6) {
    callback(new Error('密码长度必须是6到16之间'))
  } else {
    if (!reg.test(value)) {
      // callback(new Error('密码仅由汉字,英文字母,数字以及下划线组成'))
      callback(new Error('密码仅由英文字母,数字及特殊符号组成'))
    } else {
      callback()
    }
  }
}
/* 验证内容是否英文数字以及下划线 */
export function isPassword1 (rule, value, callback) {
  // const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/
  // const reg = /^[a-zA-Z0-9]+$/
  const reg =/^[A-Za-z0-9]+$/
  if (value.length > 16 || value.length < 6) {
    callback(new Error('名称长度必须是6到16之间'))
  } else {
    if (!reg.test(value)) {
      // callback(new Error('密码仅由汉字,英文字母,数字以及下划线组成'))
      callback(new Error('名称仅由英文字母,数字组成'))
    } else {
      callback()
    }
  }
}
/* 验证内容是1-223 */
export function isip1 (rule, value, callback) {
  // const reg = /^([1-9]\d?|1\d{2}|2[01]\d|22[0-3]){3}$/
  const reg = /^(22[0-3]|2[0-1][0-9]|[1-1]?[0-9]?[0-9])$/
  if (!reg.test(value)) {
    callback(new Error('范围是1到223'))
  } else {
    callback()
  }
}
/* 验证内容是0-255 */
export function isip (rule, value, callback) {
  const reg = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])$/
  if (value.slice(0,2) === '00') {
    value = '0'
  }
  if (!reg.test(value)) {
    callback(new Error('范围是0到255'))
  } else {
    callback()
  }
}
/* 验证内容是0-255 */
export function isipnew (rule, value, callback) {
  const reg = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])$/
  // console.info('dsfsdfdsfd',value)
  // console.info('dsfsdfdsfd',value.toString().slice(0,2))
  if (value.toString().slice(0,2) === '00') {
    value = '0'
  }
  if (!reg.test(value)) {
    callback(new Error('范围是0到255'))
  } else {
    callback()
  }
}
/* 验证内容是否英文数字以及下划线 */
export function isPasswordcz (rule, value, callback) {
  if(!/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{8,16}$/.test(value)){
      /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\_\.]/g.test(value)
    callback(new Error('密码应该为8-16位数字、字母、特殊符号(~!@#$%^&*?)中任意两种组合'))
  } else {
    callback()
  }
}