<template>
  <el-dialog title="修改密码" width="30%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false" class="dialogw2">
    <el-form :label-position="labelPosition" label-width="100px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <el-form-item class="uploadItem" prop="oldPassword" label="原密码：">
        <el-input id="old_password" style="width:90%" v-model="ruleForm.oldPassword" clearable placeholder='请输入原密码' :type="password0">
          <i slot="suffix" v-if="this.password0 == 'password'" @click="pwex0"><img style="vertical-align: middle;" src="@/assets/login/password_close.png"></i>
          <i slot="suffix" v-if="this.password0 == 'text'" @click="pwex0"><img style="vertical-align: middle;" src="@/assets/login/password_open.png"></i>
        </el-input>
      </el-form-item>
      <el-form-item class="uploadItem" prop="newPassword" label="新密码：">
        <el-input id="new_password" style="width:90%" v-model="ruleForm.newPassword" clearable placeholder='请输入包含数字、字母、特殊符号8至16位的新密码' :type="password1">
          <i slot="suffix" v-if="this.password1 == 'password'" @click="pwex1"><img style="vertical-align: middle;" src="@/assets/login/password_close.png"></i>
          <i slot="suffix" v-if="this.password1 == 'text'" @click="pwex1"><img style="vertical-align: middle;" src="@/assets/login/password_open.png"></i>
        </el-input>
      </el-form-item>
      <el-form-item class="uploadItem" prop="password2" label="确认密码：">
        <el-input id="confirm_password" style="width:90%" v-model="ruleForm.password2" clearable placeholder="请输入确认密码" :type="password2">
          <i slot="suffix" v-if="this.password2 == 'password'" @click="pwex2"><img style="vertical-align: middle;" src="@/assets/login/password_close.png"></i>
          <i slot="suffix" v-if="this.password2 == 'text'" @click="pwex2"><img style="vertical-align: middle;" src="@/assets/login/password_open.png"></i>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="canBtn" @click="dialogFormVisible = false">取 消</el-button>
      <el-button size="small" class="sureBtn" :disabled="btnvalue1" @click="submitForm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
import { isPasswordcz } from '@/utils/validate'
import CryptoJS from 'crypto-js/crypto-js'
import { encrypt } from "@/utils/Aes.js"
export default {
  name: 'editpw',
  data () {
    var validatePass = (rule, value, callback) => {
      var reg =/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,16}$/
      if (this.ruleForm.newPassword !== this.ruleForm.password2) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var isPasswordczy = (rule, value, callback) => {
      const reg = /^(?![A-Za-z]+$)(?![A-Z0-9]+$)(?![a-z0-9]+$)(?![a-z\W]+$)(?![A-Z\W]+$)(?![0-9\W]+$)[a-zA-Z0-9\W]{8,16}$/
      // const reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,16}$/;
      if (value.length < 8 || value.length > 16) {
        callback(new Error("密码长度必须是8到16之间"));
      } else {
        if (!reg.test(value)) {
          callback(new Error("密码包含数字、大写字母、小写字母、特殊符号中任意三项"));
        } else {
          callback()
        }
      }
    };
    return {
      btnvalue1:false,
      dialogFormVisible: false,
      labelPosition: 'right',
      password0: "password",
      password1: 'password',
      password2: 'password',
      rules: {
        oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' },
        { trigger: 'blur', validator: isPasswordczy }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' },
        { trigger: 'blur', validator: isPasswordcz }],
        password2: [{required: true, validator: validatePass, trigger: 'blur' }],
      },
      ruleForm: {
        oldPassword:'',
        newPassword: '',
        password2: ''
      },
      userId: ''
    }
  },
  methods: {
    diaOpen (param) {
      // console.log(param)
      var that = this
      that.dialogFormVisible = true
      that.btnvalue1 = false
      that.password0 = "password"
      that.password1 = "password"
      that.password2 = "password"
      that.ruleForm.oldPassword = ""
      that.ruleForm.newPassword = ""
      that.ruleForm.password2 = ""
      that.$nextTick(function () {
        that.$refs.ruleForm.clearValidate()
      })
      that.userId = param.user_id
    },
    diaClose () {
      var that = this
      that.dialogFormVisible = false
    },
    pwex0() {
      var that = this;
      if (that.password0 === "password") {
        that.password0 = "text";
      } else {
        that.password0 = "password";
      }
    },
    pwex1 () {
      var that = this
      if (that.password1 === 'password') {
        that.password1 = 'text'
      } else {
        that.password1 = 'password'
      }
    },
    pwex2 () {
      var that = this
      if (that.password2 === 'password') {
        that.password2 = 'text'
      } else { 
        that.password2 = 'password'
      }
    },
    submitForm (formName) {
      var that = this
      var data = [90, 71, 73, 121, 77, 84, 77, 53, 78, 84, 89, 120, 89, 122, 108, 109, 90, 84, 65, 50, 79, 65, 61, 61 ]
      // console.log(that.ruleForm.oldPassword)
      var k =  CryptoJS.enc.Base64.parse(Buffer.from(data).toString());
      var iv =  CryptoJS.enc.Base64.parse(Buffer.from(data).toString());
      let formData = new FormData()
      formData.append('oldPassword', encrypt(this.ruleForm.oldPassword, k, iv))
      formData.append('newPassword', encrypt(this.ruleForm.newPassword, k, iv))
      // console.log(formData)

      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.btnvalue1 = true
          request({
            url: '/sys/updatePassword',
            data: {
              userId:that.userId,
              oldPassWord:formData.get('oldPassword'),
              newPassWord:formData.get('newPassword'),
            },
            method: 'post'
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
            that.$message({message: '操作成功!', type: 'success',showClose: true})
            that.dialogFormVisible = false
            that.$emit('successup')
            } else {
              that.btnvalue1 = false
            // that.$message({message: res.errormessage, type: 'error', duration: 0, showClose: true })
            }
          })
        } else {
           that.btnvalue1 = false
          return false
        }
      })
    },
    resetForm (formName) {
      var that = this
      that.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
.sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff;
}
</style>
