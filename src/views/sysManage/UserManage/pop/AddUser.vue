<template>
  <el-dialog title="新增用户" width="30%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="120px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <div class="itemw">
        <el-form-item class="uploadItem" prop="userId" label="用户名：">
          <el-input id="userId" style="width:80%" v-model="ruleForm.userId" clearable placeholder='请输入用户名，20个字符以内的英文、数字'></el-input>
        </el-form-item>
        <el-form-item class="uploadItem" prop="name" label="昵称：">
          <el-input id="name" style="width:80%" v-model="ruleForm.name" clearable placeholder='请输入昵称，20个字符以内的英文、数字'></el-input>     
        </el-form-item>
        <el-form-item class="uploadItem" prop="password" label="密码：">
          <el-input id="password" style="width:80%" v-model="ruleForm.password" clearable placeholder="请输入包含数字、字母、特殊符号8至16位的密码" :type="password">
            <!-- <i slot="suffix" class="el-icon-view" style="line-height:40px" @click="pwex0"></i> -->
            <i slot="suffix" v-if="this.password == 'password'" @click="pwex0"><img style="vertical-align: middle;" src="@/assets/login/password_close.png"></i>
            <i slot="suffix" v-if="this.password == 'text'" @click="pwex0"><img style="vertical-align: middle;" src="@/assets/login/password_open.png"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="uploadItem" prop="type" label="管理员类型：">
          <el-select v-model="ruleForm.type" clearable placeholder="请选择管理员类型">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="canBtn" @click="dialogFormVisible = false">取 消</el-button>
      <el-button size="small" class="sureBtn" :disabled="btnvalue1" @click="submitForm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
import "@/utils/sm4.js"
import CryptoJS from 'crypto-js/crypto-js'
import { encrypt } from "@/utils/Aes.js"
export default {
  name: 'AddUser',
  data () {
    var validatePass  = (rule, value, callback) => {
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
    var validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入名称"));
      } else if (value.length > 20) {
        callback(new Error("名称长度不超出20个字符"));
      } else if (
        // /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\_\.]/g.test(value)
        /[^\a-\z\A-\Z0-9]/g.test(value)
      ) {
        callback(new Error("名称只能输入英文、数字"));
      } else {
        callback();
      }
    };
    return {
      btnvalue1:false,
      dialogFormVisible: false,
      labelPosition: 'right',
      password: 'password',
      rules: {
        userId: [{required: true, validator: validatePass1, trigger: 'blur' }],
        name: [{required: true, validator: validatePass1, trigger: 'blur' }],
        password: [{required: true, validator: validatePass, trigger: 'blur' }],
        type: [{ required: true, message: '请选择管理员类型', trigger: 'change' }],
      },
      ruleForm: {
        userId: '',
        name: '',
        password: '',
        type:''
      },
      options:[
        {value:"audit",label:"审计管理员"},
        {value:"safe",label:"安全管理员"},
        {value:"system",label:"系统管理员"},
      ]
    }
  },
  methods: {
    diaOpen () {
      var that = this
      that.dialogFormVisible = true
      that.btnvalue1 = false
      that.password='password',
      that.ruleForm.userId= ''
      that.ruleForm.name= ''
      that.ruleForm.password= ''
      that.ruleForm.type=''
      that.$nextTick(function () {
        that.$refs.ruleForm.clearValidate()
      })
    },
    diaClose () {
      var that = this
      that.dialogFormVisible = false
    },
    pwex0() {
      var that = this;
      if (that.password === "password") {
        that.password = "text";
      } else {
        that.password = "password";
      }
    },
    submitForm (formName) {
      var that = this

      var data = [90, 71, 73, 121, 77, 84, 77, 53, 78, 84, 89, 120, 89, 122, 108, 109, 90, 84, 65, 50, 79, 65, 61, 61 ]
      // console.log(that.ruleForm.oldPassword)
      var k =  CryptoJS.enc.Base64.parse(Buffer.from(data).toString());
      var iv =  CryptoJS.enc.Base64.parse(Buffer.from(data).toString());
      let formData = new FormData()
      formData.append('pwd', encrypt(this.ruleForm.password, k, iv))
      // console.log( '45654#@@@', formData.get('pwd'))
      //   console.log(encrypt("HTTC@system", key, iv))
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.btnvalue1 = true
          request({
            url: '/sys/userAdd',
            data: {
              user_id:that.ruleForm.userId,
              name:that.ruleForm.name,
              password:formData.get('pwd'),
              type:that.ruleForm.type
            },
            method: 'post'
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
            that.$message({message: '添加成功!', type: 'success',showClose: true })
            that.dialogFormVisible = false
            that.$emit('addSuccess')
            } else {
              that.btnvalue1 = false
            // that.$message({message: res.errormessage, type: 'error',showClose: true })
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
</script>m 

<style scoped>
.eyeIcon {
  background:url("../../../../assets/login/password_close.png") no-repeat 10px center; 
}
.dialog-footer .sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff;
}
</style>
