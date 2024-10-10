<template>
  <el-dialog title="新增" top="5vh" width="30%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false" :append-to-body="true">
    <el-form :label-position="labelPosition" label-width="125px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small" class="form">
      <el-form-item prop="name" label="节点名：">
        <el-input style="width:80%" id="name" v-model="ruleForm.name" clearable placeholder='请输入节点名，只可输入数字和字母' maxlength="128"></el-input>     
      </el-form-item>
      <el-form-item label="叶子节点：" prop="leaf_node">
        <el-radio-group v-model="ruleForm.leaf_node">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="ruleForm.leaf_node == '0'">
        <el-form-item label="迁移：" prop="migaratable">
          <el-radio-group v-model="ruleForm.migaratable">
            <el-radio label="0">可以</el-radio>
            <el-radio label="1">不可以</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item label="密钥用途：" prop="key_use">
          <el-radio-group v-model="ruleForm.key_use" @change="keyUseChange">
            <el-radio label="0">签名</el-radio>
            <el-radio label="1">加密</el-radio>
            <el-radio label="2">封印</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密钥来源：" prop="origin">
          <el-radio-group v-model="ruleForm.origin" @change="originChange">
            <el-radio :disabled="originDisabled1" label="0">内部密钥</el-radio>
            <el-radio :disabled="originDisabled2" label="1">外部密钥</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密钥类型：" prop="key_type">
          <el-radio-group v-model="ruleForm.key_type">
            <el-radio :disabled="keyTypeDisabled1" label="0">非对称密钥</el-radio>
            <el-radio :disabled="keyTypeDisabled2" label="1">对称密钥</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="环境度量：" prop="auth_env"> 
          <el-select v-model="ruleForm.auth_env" clearable placeholder="请选择环境度量">
            <el-option label="不需要" value="0"></el-option>
            <el-option label="需要" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码认证方式：" prop="auth_passwd"> 
          <el-select v-model="ruleForm.auth_passwd" clearable placeholder="请选择密码认证方式">
            <el-option label="不需要" value="0"></el-option>
            <el-option label="需要" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="ruleForm.auth_passwd == '1'" prop="use_passwd" label="使用密码：">
          <el-input style="width:70%" :type="password1" v-model="ruleForm.use_passwd" placeholder="请输入密码" clearable>
            <i slot="suffix" v-if="this.password1 == 'password'" @click="pwex1"><img style="vertical-align: middle;" src="@/assets/login/password_close.png"></i>
            <i slot="suffix" v-if="this.password1 == 'text'" @click="pwex1"><img style="vertical-align: middle;" src="@/assets/login/password_open.png"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="身份认证方式：" prop="auth_process"> 
          <el-select v-model="ruleForm.auth_process" clearable placeholder="请选择用户认证方式">
            <el-option label="不需要" value="0"></el-option>
            <el-option label="进程身份认证" value="1"></el-option>
            <el-option label="进程角色认证" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="ruleForm.auth_process == '1'"  label="进程身份认证：" prop="processIdentity"> 
          <el-select v-model="ruleForm.processIdentity" clearable placeholder="请选择进程身份">
            <el-option v-for="item in processIdentityOptions" :key="item.name" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="ruleForm.auth_process == '2'"  label="进程角色认证：" prop="processRole"> 
          <el-select v-model="ruleForm.processRole" clearable placeholder="请选择进程角色">
            <el-option v-for="item in processRoleOptions" :key="item.name" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户认证方式：" prop="auth_user"> 
          <el-select v-model="ruleForm.auth_user" clearable placeholder="请选择用户认证方式">
            <el-option label="不需要" value="0"></el-option>
            <el-option label="用户id认证" value="1"></el-option>
            <el-option label="用户组id认证" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="ruleForm.auth_user == '1'" prop="userId" label="用户ID：">
          <el-input style="width:70%" v-model.number="ruleForm.userId"  onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" 
            placeholder="请输入用户ID，只可输入数字" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="ruleForm.auth_user == '2'" prop="userGroupId" label="用户组ID：">
          <el-input style="width:70%" v-model.number="ruleForm.userGroupId" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" 
            placeholder="请输入用户组ID，只可输入数字" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否可信：">
          <el-checkbox :true-label="1" :false-label="0" v-model="ruleForm.auth_trust_state_boot">启动阶段</el-checkbox>
          <el-checkbox :true-label="1" :false-label="0" v-model="ruleForm.auth_trust_state_dm">动态度量</el-checkbox>
          <el-checkbox :true-label="1" :false-label="0" v-model="ruleForm.auth_trust_state_sm">静态度量</el-checkbox>
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
export default {
  name: 'CreateNode',
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入节点名称"));
      } else if ( /[^\a-\z\A-\Z0-9]/g.test(value)) {
        callback(new Error("节点名称只能输入数字和字母"));
      } else {
        callback();
      }
    };
    return {
      btnvalue1:false,
      dialogFormVisible: false,
      labelPosition: 'right',
      password0: 'password',
      password1: 'password',
      keyTypeDisabled1:false,
      keyTypeDisabled2:false,
      originDisabled1:false,
      originDisabled2:false,
      rules: {
        name: [{ required: true, validator: validatePass, trigger: 'blur' }],
        leaf_node: [{ required: true, message: '请选择是否为叶子节点', trigger: 'change' }],
        migaratable: [{ required: true, message: '请选择是否可迁移', trigger: 'change' }],
        key_use: [{ required: true, message: '请选择密钥用途', trigger: 'change' }],
        key_type: [{ required: true, message: '请选择密钥类型', trigger: 'change' }],
        origin: [{ required: true, message: '请选择密钥来源', trigger: 'change' }],
        auth_env: [{ required: true, message: '请选择环境度量', trigger: 'change' }],
        auth_passwd:[{ required: true, message: '请选择密码认证方式', trigger: 'change' }],
        use_passwd:[{ required: true,  message: '请输入密码',trigger: 'blur' }],

        auth_process:[{ required: true, message: '请选择身份认证方式', trigger: 'change' }],
        processIdentity:[{ required: true, message: '请选择进程身份，若无进程身份请选择不需要', trigger: 'change' }],
        processRole:[{ required: true, message: '请选择进程角色，若无进程角色请选择不需要', trigger: 'change' }],

        auth_user:[{ required: true, message: '请选择用户认证方式', trigger: 'change' }],
        userId:[{ required: true,type: 'number', message: '请输入用户ID，只可输入数字', trigger: 'blur' }],
        userGroupId:[{ required: true,type: 'number', message: '请输入用户组ID，只可输入数字', trigger: 'blur' }],

        password: [{required: true, message: '请输入密码', trigger: 'blur' }],
      },
      ruleForm: {
        name: '',
        leaf_node:'',//叶子节点
        migaratable:'',//是否可迁移
        key_use:'',//密钥用途
        key_type:'',//密钥类型
        origin:'',//密钥来源
        auth_env:'1',
        auth_passwd:'0',//密码认证方式
        use_passwd:'',//使用密码

        auth_process:'0',//身份认证方式
        process_name:'',//进程身份或进程角色所选择的名字
        processIdentity:'',//进程身份
        processRole:'',//进程角色

        auth_user:'0',//用户认证方式
        user_id:'',//用户id或用户组id
        userId:'',//用户id 
        userGroupId:'',//用户组id

        passwd: '',//密码，密钥用途：加密&密钥来源：内部

        auth_trust_state_boot:0,//启动阶段
        auth_trust_state_dm:0,//动态度量
        auth_trust_state_sm:0,//静态度量
      },
      nodeId:'',
      parentId:'',
      path:'',
      processIdentityOptions:[],
      processRoleOptions:[]
    }
  },
  methods: {
    diaOpen (data,param,path) {
      var that = this
      that.dialogFormVisible = true
      that.btnvalue1 = false
      that.password0 = 'password'
      that.password1 = 'password'
      that.ruleForm.name = ''
      that.ruleForm.password = ''
      that.ruleForm.leaf_node = ''
      that.ruleForm.key_use =''
      that.ruleForm.key_type =''
      that.ruleForm.origin =''
      that.ruleForm.migaratable =''

      that.ruleForm.auth_env ='1'

      that.ruleForm.auth_passwd ='0'
      that.ruleForm.use_passwd = ''

      that.ruleForm.auth_process ='0'
      that.ruleForm.process_name = ''
      that.ruleForm.processIdentity = ''
      that.ruleForm.processRole = ''

      that.ruleForm.auth_user ='0'
      that.ruleForm.user_id = ''
      that.ruleForm.userId = ''
      that.ruleForm.userGroupId = ''

      that.ruleForm.auth_trust_state_boot = 0
      that.ruleForm.auth_trust_state_dm = 0
      that.ruleForm.auth_trust_state_sm = 0

      that.keyTypeDisabled1 = false
      that.keyTypeDisabled2 = false
      that.originDisabled1 = false
      that.originDisabled2 = false

      that.nodeId = param.nodeId
      if(JSON.stringify(data) == '{}') {
        that.parentId = 0
      } else {
        that.parentId = data.id
      }
      that.path = path
      request({url: "/searchProIdenListByNID?node_id="+param.nodeId,method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
          that.processIdentityOptions = res.data
        });
      request({url: "/searchProcessRoleListByNID?node_id="+param.nodeId,method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
          that.processRoleOptions = res.data
        });
      this.$nextTick(function () {
        that.$refs.ruleForm.resetFields();
      });
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
    pwex1() {
      var that = this;
      if (that.password1 === "password") {
        that.password1 = "text";
      } else {
        that.password1 = "password";
      }
    },
    keyUseChange() {
      var that = this
      if(this.ruleForm.key_use == 0) {
        that.originDisabled1 = false
        that.originDisabled2 = true

        that.keyTypeDisabled1 = false
        that.keyTypeDisabled2 = true
        
        that.ruleForm.key_type = ""
        that.ruleForm.origin = ""
      } else if(this.ruleForm.key_use == 1 ) {
        that.ruleForm.key_type = ""
        that.ruleForm.origin = ""
        that.originDisabled1 = false
        that.originDisabled2 = false
        that.keyTypeDisabled1 = true
        that.keyTypeDisabled2 = false
      } else if(this.ruleForm.key_use == 2 ) {
        that.originDisabled1 = false
        that.originDisabled2 = true

        that.keyTypeDisabled1 = false
        that.keyTypeDisabled2 = false
        that.ruleForm.key_type = ""
        that.ruleForm.origin = ""
      }
    },
    originChange() {
      var that = this
      if (this.ruleForm.key_use == 1 &&this.ruleForm.origin == 0) {
        that.keyTypeDisabled1 = true
        that.keyTypeDisabled2 = false
      }  else if(this.ruleForm.key_use == 1 && that.ruleForm.origin == 1){
        that.keyTypeDisabled1 = true
        that.keyTypeDisabled2 = false
      }
    },
    submitForm (formName) {
      var that = this
      if(that.ruleForm.auth_process == 0) {
        that.ruleForm.process_name = ""
      } else if (that.ruleForm.auth_process == 1) {
        that.ruleForm.process_name = that.ruleForm.processIdentity
      } else if (that.ruleForm.auth_process ==2) {
        that.ruleForm.process_name = that.ruleForm.processRole
      }
      if(that.ruleForm.auth_user == 0) {
        that.ruleForm.user_id = ""
      } else if (that.ruleForm.auth_user == 1) {
        that.ruleForm.user_id = that.ruleForm.userId
      } else if (that.ruleForm.auth_user ==2) {
        that.ruleForm.user_id = that.ruleForm.userGroupId
      }
      var path = ""
      if (that.path == "/") {
        path = that.path + that.ruleForm.name
      } else {
        path = that.path + "/" + that.ruleForm.name
      }
      var migaratable = "",key_use = "",key_type = "",origin = ""
      if (that.ruleForm.leaf_node==1) {
        migaratable = ""
        key_use = parseInt(that.ruleForm.key_use)
        key_type = parseInt(that.ruleForm.key_type)
        origin = parseInt(that.ruleForm.origin)
      } else {
        migaratable = parseInt(that.ruleForm.migaratable)
        key_use = ""
        key_type = ""
        origin = ""
      }
      var data = {
        node_id:that.nodeId,
        parent_id : that.parentId,
        name:that.ruleForm.name,
        leaf_node: parseInt(that.ruleForm.leaf_node),
        migaratable: migaratable,
        key_use: key_use,
        key_type:key_type,
        origin:origin,
        auth_env:parseInt(that.ruleForm.auth_env),
        auth_passwd:parseInt(that.ruleForm.auth_passwd),//密码认证方式
        use_passwd:that.ruleForm.use_passwd,//使用密码

        auth_process:parseInt(that.ruleForm.auth_process),//身份认证方式
        process_name:that.ruleForm.process_name,

        auth_user:parseInt(that.ruleForm.auth_user),//用户认证方式
        user_id:that.ruleForm.user_id,

        auth_trust_state_boot:that.ruleForm.auth_trust_state_boot,
        auth_trust_state_dm:that.ruleForm.auth_trust_state_dm,
        auth_trust_state_sm:that.ruleForm.auth_trust_state_sm,

        passwd:that.ruleForm.passwd,
        path:path
      }
      // console.log(data)
      if (that.ruleForm.leaf_node==1 && that.ruleForm.auth_env == 0 &&that.ruleForm.auth_passwd == 0 &&that.ruleForm.auth_process == 0 &&that.ruleForm.auth_user == 0 ) {
        that.$message({message: "环境度量,密码认证方式,身份认证方式,用户认证方式,至少选择一项！", type: 'error',showClose: true })
      } else {
        that.$refs[formName].validate((valid) => {
          if (valid) {
            that.btnvalue1 = true
            request({
              url: '/sec/creatKeyTreeNode',
              data: data,
              method: 'post'
            }).then((response) => {
              var res = response.data
              if (res.status === 0) {
                that.$message({message: '节点添加成功!', type: 'success',showClose: true })
                that.dialogFormVisible = false
                that.$emit('addSuccess')
              } else {
                that.btnvalue1 = false
                that.dialogFormVisible = false
              //   that.$emit('addNode')
                // 
              }
            })
          } else {
            that.btnvalue1 = false
            return false
          }
        })
      }
      
    },
    resetForm (formName) {
       var that = this
       that.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
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
.dialog-footer .sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff;
}
</style>
