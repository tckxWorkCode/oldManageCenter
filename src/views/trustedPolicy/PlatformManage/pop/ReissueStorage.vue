<template>
  <!--新建开始-->
  <el-dialog title="重新下发" width="23%" :visible.sync="dialogFormVisible" @closed="diaclose" :close-on-click-modal="false" class="deactivate">
    <div style="margin-bottom:10px"><i class="el-icon-warning" style="color:#E6A23C;font-size:24px;vertical-align: middle;margin-right:16px"></i>确定重新下发此存储区域？请输入tcm密码：</div>
    <el-form :rules="rules" :model="ruleForm" ref="ruleForm" @submit.native.prevent>
      <el-form-item prop="tcmPassword">
        <el-input style="width:99%" :type="password0" v-model="ruleForm.tcmPassword" placeholder="请输入tcm密码，密码不允许输入空格" clearable 
          :onkeyup="ruleForm.tcmPassword=ruleForm.tcmPassword.replace(/[ ]/g,'')" @change="changePwd">
          <i slot="suffix" v-if="this.password0 == 'password'" @click="pwex0"><img style="vertical-align: middle;" src="@/assets/login/password_close.png"></i>
          <i slot="suffix" v-if="this.password0 == 'text'" @click="pwex0"><img style="vertical-align: middle;" src="@/assets/login/password_open.png"></i>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="canBtn" @click="dialogFormVisible = false">取 消</el-button>
      <el-button size="small" class="sureBtn" :disabled="btnf1" @click="submitForm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "AddStorage",
  data() {
    return {
      height: 0,
      btnf1: false,
      dialogFormVisible: false,
      rowParam:"",
      password0: 'password',
      rules: {
        tcmPassword:[{ required: true, message: "请输入密码",  trigger: 'blur' },
        //   { required: true, validator: validatePass, trigger: 'blur' }
        ],
      },
      ruleForm: {
        tcmPassword: "",
      },
    };
  },
  methods: {
    submitForm(formName) {
      var that = this
      that.$refs[formName].validate((valid) => {
        console.log(this.ruleForm.tcmPassword)
        console.log(this.ruleForm.tcmPassword.length)
        if (valid) {
          request({url: "/sec/retrySendStore?id=" + this.rowParam.id +"&password=" +this.ruleForm.tcmPassword,method: "post",}).
            then((response) => {
              var res = response.data
              if(res.status == 0) {
                that.dialogFormVisible = false;
                that.$message({ message: "操作成功!",type: "success", showClose: true,});
                that.$emit("success");
              }else {
                that.btnf1 = true;
              }
            })
        } else {
          that.btnf1 = false;
        }
      });
    },
    diaOpen(param) {
      var that = this;
      this.dialogFormVisible = true;
      this.btnf1 = false;
      this.rowParam = param
      this.password0 = 'password'
      this.ruleForm.tcmPassword = ''
      this.$nextTick(function () {
        this.$refs.ruleForm.clearValidate()
      })
    },
    diaclose() {
      this.dialogFormVisible = false;
    },
    pwex0() {
      var that = this;
      if (that.password0 === "password") {
        that.password0 = "text";
      } else {
        that.password0 = "password";
      }
    },
    changePwd() {
      this.btnf1 = false;
    }
  },
};
</script>

<style scoped>
.deactivate>>>.el-dialog{
  display: flex;
  flex-direction: column;
  margin:0 !important;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-60%);
  /*height:600px;*/
  max-height:calc(100% - 30px);
  max-width:calc(100% - 30px);
}
.deactivate>>>.el-dialog .el-dialog__body{
  flex:1;
  overflow: auto;
}
/*滚动条*/
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.deactivate>>>.el-dialog__body {
  padding: 8px 16px!important;
}
.deactivate>>>.el-dialog__header {
  border-bottom: 0px;
}
.deactivate>>>.el-dialog__footer {
  border-top: 0px;
}
.dialog-footer .sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff;
}
</style>
