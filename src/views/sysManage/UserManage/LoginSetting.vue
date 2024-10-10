<template>
  <div class="main">
    <div class="container">
      <div class="topNav">
        <el-breadcrumb class="breadNav" separator="/">
          <el-breadcrumb-item class="crumb1">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">系统设置</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb2">登录设置</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="title">登录设置</div> -->
      </div>
      <div class="wrap">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" size="small" style="width:30%;margin: 20px auto 0px auto;">
          <el-form-item label="登录尝试次数：" prop="lock_num">
            <el-input v-model="ruleForm.lock_num" clearable placeholder="请输入登录尝试次数"></el-input>
            <div class="unit1">次</div>
          </el-form-item>
          <el-form-item label="账户锁定时间：" prop="lock_time">
            <el-input v-model="ruleForm.lock_time" clearable placeholder="请输入账号锁定时间"></el-input>
            <div class="unit2">分钟</div>
          </el-form-item>
          <el-form-item class="setrepeat">
            <el-button size="small" class="canBtn" @click="resetForm('ruleForm')">重置</el-button>
            <el-button size="small" class="sureBtn" :disabled="btnvalue1" @click="submitForm('ruleForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>   
  </div>
</template>
<script>

import request from "@/utils/request";

export default {
  name:"LoginSetting",
  data() {
    var validatePass1 = (rule, value, callback) => {
      var reg = /^[0-9]+$/
      console.info(value)
      console.info(typeof value)
      if (value === '') {
        callback(new Error('请输入登录尝试次数'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正整数'))
      } else if (parseInt(value) < 1 || parseInt(value) > 100) {
        callback(new Error('请输入1到100之间的正整数'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      var reg = /^[0-9]+$/
      if (value === '') {
        callback(new Error('请输入账号锁定时间'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正整数'))
      }  else if (parseInt(value) < 10 || parseInt(value) > 1000) {
        callback(new Error('请输入10到1000之间的正整数'))
      } else {
        callback()
      }
    }
    return {
      btnvalue1:false,
      ruleForm: {
        lock_num: '',
        lock_time: '',
      },
      userid: '',
      rules: {
        lock_num: [{ required: true, validator: validatePass1 , trigger: 'blur' }],
        lock_time: [{ required: true, validator: validatePass2 , trigger: 'blur' }],
      }
    };
  },
  mounted() {
    this.loadData()
  },
  methods: { 
    loadData() {
      var that = this
      request({url: '/sys/getUserLock ', method: 'post'})
        .then((response) => {
          var res = response.data
          that.userid = res.id
          that.ruleForm.lock_time = res.lock_time
          that.ruleForm.lock_num = res.lock_num
        })
    },
    submitForm(formName) {
      var that = this
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.btnvalue1 = true
          const datauser = new FormData()
          datauser.append('id', that.userid)
          datauser.append('lock_num', that.ruleForm.lock_num)
          datauser.append('lock_time',that.ruleForm.lock_time)
          request({
            url: '/sys/updateUserLock',
            method: 'post',
            data: {
              id:that.userid,
              lock_num:that.ruleForm.lock_num,
              lock_time:that.ruleForm.lock_time,
            }
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
              that.$message({message: '操作成功!', type: 'success', showClose: true})
              that.btnvalue1 = false
               request({url: '/sys/getUserLock ', method: 'post'})
                .then((response) => {
                  var res = response.data
                  that.userid = res.id
                  that.ruleForm.lock_time = res.lock_time
                  that.ruleForm.lock_num = res.lock_num
                })
            } else {
              that.btnvalue1 = false
              // that.$message({message: res.errormessage, type: 'error', duration: 0, showClose: true})
            }
          })
        }  else {
           that.btnvalue1 = false
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.main {
  display: flex;
  padding: 0;
}
.container {
  flex: 1;
  overflow: hidden;
}
.topNav {
  position: absolute;
  top: 0px;
  font-size: 14px;
  margin-left: 24px;
}
.title {
  font-family: 'PingFang-SC-Bold';
  font-size: 20px;
  font-weight: bold;
  color: #000;
  padding: 18px 0;
}
.breadNav {
  padding-top: 18px;
}
.wrap{
  overflow: auto;
  height: calc(100vh - 96px);
  padding: 24px;
  background-color: #f0f2f5;
}
.unit1{
  position: absolute;
  right: -20px;
  top: 0px; 
}
.unit2{
  position: absolute;
  right: -33px;
  top: 0px;
}
.sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff;
}
</style>