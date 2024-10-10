<template>
  <div id="app" @mousemove="moveEvent" @click="moveEvent">
    <router-view></router-view>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth' // 验权

import Common from '@/components/common/configVariable.vue'
export default {
  name: 'App',
  data () {
    return {
      timmer: null,
    }
  },
  methods: {
    moveEvent: function() {
      let path = ['/login']
      if(!path.includes(this.$route.path)) {
        clearTimeout(this.timmer)
        this.init()
      }
    },
    init: function() {
      this.timmer = setTimeout(() => {
        sessionStorage.clear()
        localStorage.clear()
        this.$router.push({
          path: '/login'
        })
      }, 1000*60*20)
    },
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  font-size: 14px;
}
body {
  margin: 0;
  padding: 0;
  font-size: 14px;
}
.crumb1 .el-breadcrumb__inner {
  color: rgba(0, 0, 0, 0.45);
}
.crumb2 .el-breadcrumb__inner {
  color: rgba(0, 0, 0, 0.8);
}
.el-table{
  width:99.7% !important;
}
.mainContainer .el-table__body {
  width: 100%!important;
}
.el-table__expand-icon>.el-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  margin-left: 0px; 
  margin-top: 0px;
  color: #1ac492!important;
}
.el-table__fixed-right {
  height: 100% !important;
}
.el-select-dropdown__item.selected{
  color: #1ac492!important;
}
.confirmColor {
  color: #fff!important;
  background-color: #1ac492!important;
  border-color:#1ac492!important;
}
.wathet {/*正常 */
  border-left: solid 3px #1890ff;padding: 0px 10px;
}
.green {
  border-left: solid 3px #1ac492;padding: 0px 10px;
}
.red {/*注销中 */
  border-left: solid 3px #FF4D4F;padding: 0px 10px;
}
.grey {/* 已注销 */
  border-left: solid 3px #D9D9D9;padding: 0px 10px;
}
.aqua {/* 在线 */
  color: #52c41a;
  padding-right: 10px;
}
.lightRed {/* 离线 */
  color: #FF4D4F;
  padding-right: 10px;
}
.greyDot { /*未度量*/ 
  color: #D9D9D9;
  padding-right: 10px;
}
.el-dialog__header {
  border-bottom: 1px solid #ddd;
}
.el-dialog__footer {
  border-top: 1px solid #ddd;
}
.el-table {
  overflow: auto !important;
}
.el-table::before {
  height: 0 !important;
}
.el-table .cell {
  position: relative;
}
.sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff!important;
}
.decoration {/* 查看的样式 */
  background-color: #F1F2F6;
  border: 1px solid #DDDEE0;
}
.decoration::before {
  width: 0;
  height: 0;
  border-left: solid transparent 8px;
  border-right: solid transparent 8px;
  border-bottom: solid #F1F2F6 15px;
  content: "";
  margin-left: -13px;
  position: absolute;
  top: -12px;
  left: 40px;
  z-index: 12;
}
.decoration:after{
  width: 0px;
  height: 0px;
  position: absolute;
  top: -12px;
  left:26px;
  padding:0;
  border-bottom:15px solid #DDDEE0;
  border-left:9px solid transparent;
  border-right:9px solid transparent;
  content:"";
  z-index:10
} 
.el-dialog__headerbtn .el-dialog__close:hover {/**弹出框关闭按钮 */
  color: #1ac492!important;
} 
.el-radio__input.is-checked .el-radio__inner {/**单选 */
  border-color: #1ac492!important;
  background: #1ac492!important;
}
.el-radio__input .el-radio__inner:hover {
  border-color: #1ac492!important;
}
.el-radio__input.is-checked+.el-radio__label {
  color: #1ac492!important;
}
.el-select .el-input__inner:focus {/**下拉 */
  border-color: #1ac492!important;
}
.el-select .el-input.is-focus .el-input__inner {
  border-color: #1ac492!important;
}
.el-form-item .el-input__inner:focus {/**输入框 */
  border-color: #1ac492!important;
}
.el-checkbox__input.is-checked .el-checkbox__inner, 
.el-checkbox__input.is-indeterminate .el-checkbox__inner {/**多选 */
  background-color: #1ac492!important;
  border-color: #1ac492!important;
}
.el-checkbox__input .el-checkbox__inner:focus {
  border-color: #1ac492!important;
}
.el-checkbox__input .el-checkbox__inner:hover {
  border-color: #1ac492!important;
}
.el-checkbox__input .el-checkbox__inner:active {
  border-color: #1ac492!important;
}
.el-checkbox__input.is-checked .el-checkbox__inner::after {
  border: 2px solid #fff;
  border-left: 0;
  border-top: 0;
  top: 0;
  height: 8px!important;
  transform: rotate(35deg) scaleY(1)!important;
}
.el-table__empty-block::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background-color: #EBEEF5;
  z-index: 4;
}
.el-date-table td.today span {
  color: #1ac492!important;
}
.el-date-table td.available:hover, .el-date-table td div:hover ,.el-date-table td span:hover {
  color: #1ac492!important;
}
.el-date-table td.current:not(.disabled) span {
  color: #FFF;
  background-color: #1ac492!important;
}
.el-button--primary {
  color: #FFF;
  background-color: #1ac492!important;
  border-color: #1ac492!important;
}
.el-message-box__headerbtn .el-message-box__close:hover {
  color: #1ac492!important;
}
.el-input.is-active .el-input__inner, .el-input__inner:focus {
  border-color: #1ac492!important;
}
.el-switch.is-checked .el-switch__core {
  border-color: #1ac492 !important;
  background-color: #1ac492 !important;
}
.el-switch__label.is-active {
  color: #1ac492!important;
}

</style>
