<template>
  <div class="main">
    <div class="loginContainer">
      <div class="title">
        <img :src="`${publicPath}login_logo.png`">
          <!-- <img src="../../../public/static/img/login_logo.png"> -->
        <div>{{title1}}</div>
        <div>{{title2}}</div>
      </div>
      <div class="formContainer">
        <el-form class="form" ref="ruleForm" :model="ruleForm" :rules="rules" @submit.native.prevent>
          <el-form-item prop="userName">
            <div class="label">用户名</div>
            <el-input class="inputStyle" type="text" placeholder="请输入用户名" v-model="ruleForm.userName"></el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <div class="label">密码</div>
            <el-input :class="[this.inputType == 'password'?'inputStyle spacing':'inputStyle']" :type="inputType" placeholder="请输入密码" v-model="ruleForm.passWord"
              @paste.native.capture.prevent="handlePaste" @change="getFocus" @keyup.native="checkCapslock" @blur="onblur">
              <i slot="suffix" v-if="this.inputType == 'password'" @click="showPassword"><img src="../../assets/login/password_close.png"></i>
              <i slot="suffix" v-if="this.inputType == 'text'" @click="showPassword"><img src="../../assets/login/password_open.png"></i>
            </el-input>
            <div v-if="isPaste" id="parseforbid">禁止粘贴</div>
            <div v-if="capsTooltip" id="lock">大写锁定已开启</div>
          </el-form-item>
          <el-form-item prop="code">
            <div class="label">验证码</div>
            <el-input class="inputStyle" type="text" placeholder="请输入验证码" v-model="ruleForm.code"></el-input>
            <div @click="getCaptchaCode">
              <s-identify :identifyCode="identifyCode"></s-identify>
            </div>
          </el-form-item>
          <el-button class="btn" @click="submitForm('ruleForm')">登 录</el-button>
        </el-form>
      </div>
    </div>
    <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%" top="30vh">
      <div style="text-align:center;font-size:20px;margin:20px 0;color:#000">
        <img src="@/assets/error.png" alt="" style="vertical-align:middle"> 您的密码<span style="color:#ff0000">已到期</span> ，必须重新修改密码!</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="beforeEditPwd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="温馨提示" :visible.sync="dialogVisible1" width="30%" top="30vh">
      <div style="text-align:center;font-size:20px;margin:20px 0;color:#000">
        <img src="@/assets/ok.png" alt="" style="vertical-align:middle"> 密码修改成功，请重新<span style="color:#1ac492">登录</span>!</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible1 = false">取 消</el-button>
        <el-button size="small" type="primary" @click="afterEditPwd">确 定</el-button>
      </span>
    </el-dialog>
    <change-pwd ref="edit" @successup="successup" @diaVisible="diaVisible"></change-pwd>
  </div>
</template>

<script>
import SIdentify from "../../components/common/identify";
import global from "../../components/common/configVariable.vue"
import request from "@/utils/request";
import { getToken } from "@/utils/auth";
import ChangePwd from './ChangePwd.vue';
export default {
  name: "Login",
  components: {
    SIdentify,global, ChangePwd
  },
  created() {
    this.title1 =loginTitle
    this.title2 = loginTitle2
  },
  mounted: function () {
    this.getCaptchaCode()
    window.addEventListener('keydown',this.keyDown)
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (value !== this.identifyCode) {
        callback(new Error("验证码输入错误"));
      } else {
        callback();
      }
    };
    return {
      publicPath:process.env.BASE_URL,
      dialogVisible: false,
      dialogVisible1:false,
      changePage:false,
      title1:'',
      title2:'',
      isPaste: false,
      capsTooltip:false,
      inputType: "password",
      identifyCode: "",
      ruleForm: {
        userName: "",
        passWord: "",
        code: "",
      },
      rules: {
        userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
        passWord: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, validator: validatePass, trigger: "blur" },],
      },
      passwordCode :"",
      cId:""
    };
  },
  methods: {
    getCaptchaCode() {
      // sessionStorage.removeItem("sessionId")
      request({url: "/getCaptchaCode",method: "post",
      }).then((response) => {
        var res = response.data
        this.identifyCode = res.code
        this.cId = res.cId
      });
    },
    submitForm(formName) {//登录
      var that = this;
      this.randomNumber(this.ruleForm.passWord)
      var datas = {
        userName: this.ruleForm.userName,
        passWord:this.passwordCode,
        code:this.ruleForm.code,
        cId:this.cId
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          that.$store.dispatch("Login", datas).then((res) => {
            if (res.status == 500 ||res.status == 888) {
              that.getCaptchaCode();
              // that.$message({ message: res.errormessage, type: "error", showClose: true,});
            } else if (res.status == 888) {
              that.getCaptchaCode();
            } else if (res.status == 999) {
              that.dialogVisible = true
            } else {
              // var userid = getToken();
              localStorage.setItem("loginremind", "");
              sessionStorage.setItem("currentTime", new Date().getTime());
              localStorage.setItem("tokenrole", res.userType);
              localStorage.setItem("userId", res.userID);
              localStorage.setItem("loginnum", 1);
              localStorage.setItem("userType",res.userType)
              localStorage.setItem("licenseDeadline",res.licenseDeadline)
              localStorage.setItem("node_num",res.node_num)
              sessionStorage.setItem("sessionId",res.sessionId)
              // console.log("1111    "+ res.sessionId)
              // console.log("2222     "+ sessionStorage.getItem("sessionId"))
              // global.userName = res.usershowName
              global.userId = res.userID
              that.$message({ message: '登录成功', type: 'success', showClose: true});
              // window.location.href = 'https://192.168.1.49/#/index'
              if (res.userType == 'audit') {
                that.$router.push({ path: "/auditManage/TerminalAudit/DynamicMeasureLog"}).catch((err) => {});
              } else {
                that.$router.push({ path: "/assetManage/TerminalManage/TerminalManage"}).catch((err) => {});
              }
            }
          })
        } 
        else {
          that.getCaptchaCode();
          // console.log("error submit!!");
          return false;
        }
      });
    },
    randomNumber(datas) {
      var data=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"]; 
      var result =""
      for (var i=0;i<datas.length;i++) {
        var r = Math.floor( Math.random() * 16 )
        result += data[r]
      }
      var strArr = datas.split('') , addArr = result.split('');
      for (var i=0;i<datas.length;i++) {
        strArr[i] += addArr[i]
      }
      var newStr = strArr.join('')
      this.stringToHex(newStr)
    },
    stringToHex(str) {
      var val = ""
      for (var i = 0; i<str.length; i++) {
        if (val == "") val = str.charCodeAt(i).toString(16);
        else val += str.charCodeAt(i).toString(16)
      }
      this.passwordCode = val
    },
    beforeEditPwd() {
      this.dialogVisible = false
      this.$refs.edit.diaOpen()
      this.changePage = true
    },
    diaVisible() {
      this.changePage = false
    },
    successup() {
      this.dialogVisible1 = true
      this.changePage = false
    },
    afterEditPwd() {
      this.dialogVisible1 = false
      this.$router.go(0)
    },
    showPassword() {// 密码显隐
      this.inputType = this.inputType === "password" ? "text" : "password";
    },
    getFocus() { // 禁止粘贴
      this.isPaste = false;
    },
    handlePaste() {
      this.isPaste = true;
    },
    onblur() {
      this.isPaste = false;
      this.capsTooltip = false;
    },
    checkCapslock({ shiftKey, key } = {}) {//大写
      if (key && key.length === 1) {
        if ( (shiftKey && key >= "a" && key <= "z") || (!shiftKey && key >= "A" && key <= "Z")) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    keyDown(e) {
      if (e.keyCode ==13 && this.changePage == false && this.dialogVisible == false && this.dialogVisible1 == false  ) {this.submitForm('ruleForm')}
    },
  },
};
</script>

<style scoped>
.main {
  height: 100vh;
  background: url('../../assets/login/login_bg.jpg') no-repeat;
  background-size: 100% 100%;
}
.loginContainer {
  background-color: rgba(255,255,255,0.05); 
  width: 490px;
  height: 655px;
  position: absolute;
  left: 50%;
  top: 154px;
  transform: translate( -50%);
}
.title {
  font-size: 26px;
  color: #ffffff;
  margin: 24px;
  text-align: center;
}
.formContainer {
  text-align: center;
  margin: 32px 48px;
}
.label {
  font-size: 14px;
  color: #515b64;
  text-align: left;
}
.inputStyle>>>.el-input__inner:-webkit-autofill{
  -webkit-text-fill-color: #fff !important;
  background-color:transparent !important;
  background-image: none;
  transition: background-color 5000s ease-in-out 0s !important;
}
.inputStyle>>>.el-input__inner {
  font-size: 18px;
  font-family: "Microsoft YaHei";
  color: #ffffff;
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  background: transparent;
}
.spacing>>>.el-input__inner{ 
  letter-spacing: 10px
}
.inputStyle>>>.el-input__inner:focus{
  border-bottom: 1px solid rgb(255,255,255);
  box-shadow: 0px 15px 10px -8px rgb(20,70,83);
}
.el-form-item.is-error .inputStyle>>>.el-input__inner, 
.el-form-item.is-error .inputStyle>>>.el-input__inner:focus {
   border-bottom: 1px solid rgb(255,0,0)!important;
}
.inputStyle>>>.el-input__suffix {
  top: 7px !important;
}
.s-canvas {
  position: absolute;
  top: 39px;
  left: 300px;
  height: 40px;
}
.btn {
  width: 394px;
  height: 40px;
  margin-top: 35px;
  margin-bottom: 32px;
  font-size: 16px;
  color: #fff;
  border-radius: 4px;
  background-image: linear-gradient(92deg, #14b889 0%, #26d8af 45%, #38f8d4 100%);
  opacity: 0.8;
  border: 0;
}
.btn:hover {
  width: 394px;
  height: 40px;
  margin-bottom: 32px;
  font-size: 16px;
  color: #fff;
  border-radius: 4px;
  background-image: linear-gradient(92deg, #14b889 0%, #26d8af 45%, #38f8d4 100%);
  opacity: 1;
  border: 0;
}
.btn:active {
  width: 394px;
  height: 40px;
  margin-bottom: 32px;
  font-size: 16px;
  color: #fff;
  border-radius: 4px;
  background-image: linear-gradient(92deg, #14b889 0%, #26d8af 45%, #38f8d4 100%);
  opacity: 1;
  border: 0;
}
.form >>>.el-form-item__error {
  color: #FF0000!important;
  font-size: 14px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 295px;
}
#parseforbid {
  color: #FF0000;
  font-size: 14px;
  line-height: 1;
  position: absolute;
  top: 85px;
  right: 150px;
}
#lock {
  color: #FF0000;
  font-size: 14px;
  line-height: 1;
  position: absolute;
  top: 85px;
}
.inputStyle>>>::-webkit-input-placeholder { /* WebKit browsers */
  letter-spacing: 0px;
  font-size:16px;
}
.inputStyle>>>:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  letter-spacing: 0px;
  font-size:16px;
}
.inputStyle>>>::-moz-placeholder { /* Mozilla Firefox 19+ */
  letter-spacing: 0px;
  font-size:16px;
}
.inputStyle>>>:-ms-input-placeholder { /* Internet Explorer 10+ */
  letter-spacing: 0px;
  font-size:16px;
}
</style>