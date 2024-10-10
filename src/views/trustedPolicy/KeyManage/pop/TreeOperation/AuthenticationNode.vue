<template>
  <el-dialog title="迁出文件认证" width="30%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false" :append-to-body="true">
    <el-form :label-position="labelPosition" label-width="100px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <el-form-item class="uploadItem" prop="password" label="密码：">
        <el-input style="width:80%" v-model="ruleForm.password" clearable placeholder='请输入包含数字、字母、特殊符号8至16位的密码' :type="password0">
          <i slot="suffix" v-if="this.password0 == 'password'" @click="pwex0"><img style="vertical-align: middle;" src="@/assets/login/password_close.png"></i>
          <i slot="suffix" v-if="this.password0 == 'text'" @click="pwex0"><img style="vertical-align: middle;" src="@/assets/login/password_open.png"></i>
        </el-input>
      </el-form-item>
      <div class="tips">迁出数据请在迁移记录中下载</div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="canBtn" @click="dialogFormVisible = false">取 消</el-button>
      <el-button size="small" class="sureBtn" :disabled="btnvalue1" @click="submitForm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'AuthenticationNode',
  data () {
    var isPasswordczy = (rule, value, callback) => {
      const reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,16}$/;
      if (value.length < 8 || value.length > 16) {
        callback(new Error("密码长度必须是8到16之间"));
      } else {
        if (!reg.test(value)) {
          callback(new Error("密码必须包含数字、字母、特殊符号"));
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
      rules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
        // { trigger: 'blur', validator: isPasswordczy }
        ],
      },
      ruleForm: {
        password:'',
      },
      path:"",
      nodeId:"",
      id:""
    }
  },
  methods: {
    diaOpen (nodeData,rowMessage,path) {
      var that = this
      that.dialogFormVisible = true
      that.btnvalue1 = false
      that.password0= "password"
      that.ruleForm.password=''
      that.$nextTick(function () {
        that.$refs.ruleForm.clearValidate()
      })
      that.nodeId = rowMessage.nodeId
      that.path = path
      that.id = nodeData.id
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
    submitForm (formName) {
      var that = this
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.btnvalue1 = true
          request({
            url: '/sec/authKeyTree',
            data: {
              node_id:that.nodeId,
              ownerpass:that.ruleForm.password,
              tree_path:that.path,
              tree_path_id:that.id
            },
            method: 'post'
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
            that.$message({message: '操作成功!迁出数据请在迁移记录中下载', type: 'success', showClose: true })
            that.dialogFormVisible = false
            that.$emit('success')
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
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scope>
.tips {
  padding-left: 100px;
  color: #aaa;
}
.sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff;
}
</style>
