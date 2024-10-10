<template>
  <!--新建开始-->
  <el-dialog title="新建存储" top="5vh" width="35%" :visible.sync="dialogFormVisible" @closed="diaclose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="130px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small" class="form">
      <el-form-item class="zdclass" prop="zdname" label="终端信息：">
        <div class="searchDiv">
          <el-input style="width: 50%" v-model="searchTerminalIp" placeholder="搜索IP" clearable></el-input>
        </div>
        <div class="cardContainer">
          <div class="cardTip" v-if="filterData.length == 0">暂无数据</div>
          <div class="itemCard" :class="{active: categoryIndex == index}"
            v-for="(item,index) in filterData" :key="item.nodeId">
            <div class="radioContainer">
              <el-radio :label="index" class="itemRadio" v-model="radio" @change.native="getCurrentSelect(item,index)">
              </el-radio>
            </div>
            <div class="contentContainer">
              <div><span class="contentText">名称：</span><span class="content">{{item.name}}</span></div>
              <div><span class="contentText">IP：</span><span class="content">{{item.ip}}</span></div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="存储区域名称：" prop="name"> 
        <el-input style="width:70%" type="text" v-model="ruleForm.name" maxlength="255" placeholder="请输入存储区域名称" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="存储区域大小：" prop="size"> 
        <el-input style="width:70%"  v-model.number="ruleForm.size" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
          placeholder="请输入存储区域大小，只可输入数字" clearable>
        </el-input> 字节
      </el-form-item>
      <el-form-item prop="ownerPasswd" label="密码：">
        <el-input style="width:70%" :type="password0" v-model="ruleForm.ownerPasswd" placeholder="请输入tcm密码" clearable>
          <i slot="suffix" v-if="this.password0 == 'password'" @click="pwex0"><img style="vertical-align: middle;" src="@/assets/login/password_close.png"></i>
          <i slot="suffix" v-if="this.password0 == 'text'" @click="pwex0"><img style="vertical-align: middle;" src="@/assets/login/password_open.png"></i>
        </el-input>
      </el-form-item>
      <el-divider></el-divider>

      <el-form-item label="密钥认证方式：" prop="authPasswd"> 
        <el-select v-model="ruleForm.authPasswd" clearable placeholder="请选择密码认证方式">
          <el-option label="不需要" value="0"></el-option>
          <el-option label="需要" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="ruleForm.authPasswd == '1'" prop="usePasswd" label="使用密码：">
        <el-input style="width:70%" :type="password1" v-model="ruleForm.usePasswd" placeholder="请输入包含数字、字母、特殊符号8至16位的密码" clearable>
          <i slot="suffix" v-if="this.password1 == 'password'" @click="pwex1"><img style="vertical-align: middle;" src="@/assets/login/password_close.png"></i>
          <i slot="suffix" v-if="this.password1 == 'text'" @click="pwex1"><img style="vertical-align: middle;" src="@/assets/login/password_open.png"></i>
        </el-input>
      </el-form-item>

      <el-form-item label="进程身份认证：" prop="authProcess"> 
        <el-select v-model="ruleForm.authProcess" clearable placeholder="请选择用户认证方式">
          <el-option label="不需要" value="0"></el-option>
          <el-option label="进程身份认证" value="1"></el-option>
          <el-option label="进程角色认证" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="ruleForm.authProcess == '1'"  label="进程身份认证：" prop="processIdentity"> 
        <el-select v-model="ruleForm.processIdentity" clearable placeholder="请选择进程身份">
          <el-option v-for="item in processIdentityOptions" :key="item.name" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="ruleForm.authProcess == '2'"  label="进程角色认证：" prop="processRole"> 
        <el-select v-model="ruleForm.processRole" clearable placeholder="请选择进程角色">
          <el-option v-for="item in processRoleOptions" :key="item.name" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="用户认证方式：" prop="authUser"> 
        <el-select v-model="ruleForm.authUser" clearable placeholder="请选择用户认证方式">
          <el-option label="不需要" value="0"></el-option>
          <el-option label="用户id认证" value="1"></el-option>
          <el-option label="用户组id认证" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="ruleForm.authUser == '1'" prop="userId" label="用户ID：">
        <el-input style="width:70%" v-model.number="ruleForm.userId" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" 
          placeholder="请输入用户ID，只可输入数字" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm.authUser == '2'" prop="userGroupId" label="用户组ID：">
        <el-input style="width:70%" v-model.number="ruleForm.userGroupId" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" 
          placeholder="请输入用户组ID，只可输入数字" clearable></el-input>
      </el-form-item>

      <el-form-item label="环境度量：" prop="authEnv"> 
        <el-select v-model="ruleForm.authEnv" clearable placeholder="请选择环境度量">
          <el-option label="不需要" value="0"></el-option>
          <el-option label="需要" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否可信：">
        <el-checkbox :true-label="1" :false-label="0" v-model="ruleForm.auth_trust_state_boot">启动阶段</el-checkbox>
        <el-checkbox :true-label="1" :false-label="0" v-model="ruleForm.auth_trust_state_dm">动态度量</el-checkbox>
        <el-checkbox :true-label="1" :false-label="0" v-model="ruleForm.auth_trust_state_sm">静态度量</el-checkbox>
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
    return {
      height: 0,
      btnf1: false,
      dialogFormVisible: false,
      labelPosition: "right",
      radio:"",
      categoryIndex: -1,
      terminalData:[],
      terminalSelection:{},
      searchTerminalIp: "",
      password0: 'password',
      password1: 'password',
      rules: {
        zdname: [{ required: true, message: "请选择终端", trigger: "change" }],

        name: [{ required: true, message: "请输入存储区域名称", trigger: "blur" }],
        size: [{ required: true,type: 'number', message: '请输入存储区域大小，只可输入数字', trigger: 'blur' }],
        ownerPasswd:[{ required: true, message: "请输入密码",  trigger: 'blur' }
          // { required: true, validator: validatePass, trigger: 'blur' }
        ],

        authPasswd:[{ required: true, message: '请选择密钥认证方式', trigger: 'change' }],
        usePasswd:[{ required: true, message: "请输入密码",  trigger: 'blur' },
          { required: true, validator: validatePass, trigger: 'blur' }
        ],

        authProcess:[{ required: true, message: '请选择进程身份认证方式', trigger: 'change' }],
        processIdentity:[{ required: true, message: '请选择进程身份，若无进程身份请选择不需要', trigger: 'change' }],
        processRole:[{ required: true, message: '请选择进程角色，若无进程角色请选择不需要', trigger: 'change' }],

        authUser:[{ required: true, message: '请选择用户认证方式', trigger: 'change' }],
        userId:[{ required: true,type: 'number', message: '请输入用户ID，只可输入数字', trigger: 'blur' }],
        userGroupId:[{ required: true,type: 'number', message: '请输入用户组ID，只可输入数字', trigger: 'blur' }],
        authEnv:[{ required: true, message: '请选择环境度量', trigger: 'change' }],
      },
      ruleForm: {
        zdname: "",
        name:"",
        size:"",
        ownerPasswd:"",

        authPasswd:'0',//密码认证方式
        usePasswd:'',//使用密码

        authProcess:'0',//身份认证方式
        processName:'',//进程身份或进程角色所选择的名字
        processIdentity:'',//进程身份
        processRole:'',//进程角色

        authUser:'0',//用户认证方式
        userId:'',//用户id或用户组id
        userId:'',//用户id 
        userGroupId:'',//用户组id
        authEnv:'',//环境度量

        auth_trust_state_boot:0,//启动阶段
        auth_trust_state_dm:0,//动态度量
        auth_trust_state_sm:0,//静态度量
      },
      processIdentityOptions:[],
      processRoleOptions:[]
    };
  },
  computed: {
    filterData:function() {
      return this.terminalData.filter(data => !this.searchTerminalIp || data.ip.includes(this.searchTerminalIp))
    }
  },
  methods: {
    submitForm(formName) {
      var that = this
      if(Object.keys(that.terminalSelection).length == 0) {
        that.ruleForm.zdname = ''
      } else {
        that.ruleForm.zdname = '1'
      }
      if(that.ruleForm.authProcess == 0) {
        that.ruleForm.processName = ""
      } else if (that.ruleForm.authProcess == 1) {
        that.ruleForm.processName = that.ruleForm.processIdentity
      } else if (that.ruleForm.authProcess ==2) {
        that.ruleForm.processName = that.ruleForm.processRole
      }
      if(that.ruleForm.authUser == 0) {
        that.ruleForm.userId = ""
      } else if (that.ruleForm.authUser == 1) {
        that.ruleForm.userId = that.ruleForm.userId
      } else if (that.ruleForm.authUser ==2) {
        that.ruleForm.userId = that.ruleForm.userGroupId
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          var datas = {
            nodeId: that.terminalSelection.nodeId,
            nodeName: that.terminalSelection.name,
            nodeIp: that.terminalSelection.ip,
            name:that.ruleForm.name,
            size:that.ruleForm.size,
            ownerPasswd:that.ruleForm.ownerPasswd,

            authPasswd:that.ruleForm.authPasswd,//密码认证方式
            usePasswd:that.ruleForm.usePasswd,//使用密码

            authProcess:that.ruleForm.authProcess,//身份认证方式
            processName:that.ruleForm.processName,

            authUser:that.ruleForm.authUser,//用户认证方式
            userId:that.ruleForm.userId,
            authEnv:that.ruleForm.authEnv,

            auth_trust_state_boot:that.ruleForm.auth_trust_state_boot,
            auth_trust_state_dm:that.ruleForm.auth_trust_state_dm,
            auth_trust_state_sm:that.ruleForm.auth_trust_state_sm,
          }
          // console.log(datas)
          request({
            url: "/sec/createStorage",
            method: "post",
            data: datas,
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
              that.dialogFormVisible = false;
              that.$message({ message: "操作成功!",type: "success", showClose: true,});
              that.$emit("addSuccess");
            } else {
              that.btnf1 = true;
              // that.$message({ message: res.errormessage, type: "error", showClose: true,});
            }
          });
        } else {
          that.btnf1 = false;
        }
      });
    },
    diaOpen() {
      var that = this;
      this.dialogFormVisible = true;
      this.btnf1 = false;
      this.ruleForm.zdname = "1";
      this.searchTerminalIp = "";
      this.radio = ""
      this.terminalSelection = {}
      
      that.password0 = 'password'
      that.password1 = 'password'

      that.ruleForm.name =''
      that.ruleForm.size =''
      that.ruleForm.ownerPasswd = ''

      that.ruleForm.authPasswd ='0'
      that.ruleForm.usePasswd = ''

      that.ruleForm.authProcess ='0'
      that.ruleForm.processName = ''
      that.ruleForm.processIdentity = ''
      that.ruleForm.processRole = ''

      that.ruleForm.authUser ='0'
      that.ruleForm.userId = ''
      that.ruleForm.userId = ''
      that.ruleForm.userGroupId = ''
      that.ruleForm.authEnv = '1'

      that.ruleForm.auth_trust_state_boot = 0
      that.ruleForm.auth_trust_state_dm = 0
      that.ruleForm.auth_trust_state_sm = 0
      request({url: "/LNodeList",method: "post",
        data: {
          condition: "",
          firstTime: "",
          lastTime: "",
          orderBy: "installer_time desc",
          system_type: "1",
          online_status: 1,
          searchPage: "1",
          searchSize: "10000",
        }
      }).then((response) => {
        var res = response.data
        // console.log(res)
        that.terminalData = res.list
        if (res.total > 5) {
          that.height = 240;
        } else if (res.total === 0) {
          that.height = 110;
        } else {
          that.height = 50 + 42 * res.total;
        }
      });
     
      that.$nextTick(function () {
        that.$refs.ruleForm.clearValidate()
      })
    },
    diaclose() {
      var that = this;
      that.dialogFormVisible = false;
    },
    // 选择终端
    getCurrentSelect(item,index){ //获取选中数据this.templateSelection = item;
      // console.log(item)
      var that = this
      this.categoryIndex = index;
      this.terminalSelection = item;
      if(item) {
        request({url: "/searchProIdenListByNID?node_id="+item.nodeId,method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
          that.processIdentityOptions = res.data
        });
        request({url: "/searchProcessRoleListByNID?node_id="+item.nodeId,method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
            that.processRoleOptions = res.data
        });
      }
      
    },
    pwex0() {
      var that = this;
      if (that.password0 === "password") {
        that.password0 = "text";
      } else {
        that.password0 = "password";
      }
    },
    pwex1() {
      var that = this;
      if (that.password1 === "password") {
        that.password1 = "text";
      } else {
        that.password1 = "password";
      }
    },
  },
};
</script>

<style scoped>
/*滚动条*/
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.dialog-footer .sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff;
}
.cardContainer {
  max-height: 20vh;
  overflow: auto;
}
.cardTip {
  height: 50px;
  color: #909399;
  text-align: center;
  border: 1px solid #DCDFE6;
  border-radius: 3px;
  margin-top: 10px;
  padding-top: 10px;
}
.itemCard {
  width: 46%;
  float: left;
  display: flex;
  border: 1px solid #f0f0f4;
  border-radius: 5px;
  margin-right: 10px;
  margin-top: 20px;
}
.active {
  border: 1px solid #1ac492;
  box-shadow: 0 2px 4px rgba(26,196,146, 0.3), 0 0 6px rgba(26,196,146, .04)
}
.radioContainer {
  width: 20%;
  position: relative;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: #f8f8f8;
}
.itemRadio {
  border-right: 1px solid #f0f0f4;
  position: absolute;
  left:50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.itemCard >>>.el-radio__label {
  display: none!important;
}
.contentContainer {
  font-size: 14px;
  margin-left: 16px;
}
.contentText {
  color: #999999;
}
.content {
  color: #333333;
}
.form >>>.el-switch.is-checked .el-switch__core {
  border-color: #1ac492;
  background-color: #1ac492;
}
.form >>>.el-switch__label.is-active {
  color: #1ac492;
}
.form >>>.el-checkbox__input.is-checked+.el-checkbox__label {
  color: #606266;
}
</style>
