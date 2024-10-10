<template>
  <el-dialog :title="title" top="5vh" width="35%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="150px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small" class="form">
      <div class="itemw">
        <el-form-item prop="allSwitch" label="是否启用：">
          <el-switch v-model="ruleForm.allSwitch" :active-text="activeText" :active-value="1" :inactive-value="0" @change="switchChange">
          </el-switch>
        </el-form-item>
        <el-form-item label="身份认证方式：" prop="auth_process">
          <el-radio-group v-model="ruleForm.auth_process" @change="authProcessChange" :disabled="ruleForm.allSwitch == 0">
            <el-radio :label="0">不需要</el-radio>
            <el-radio :label="1">进程身份认证</el-radio>
            <el-radio :label="2">进程角色认证</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="ruleForm.auth_process == '1'" prop="sfname" label="进程身份信息：">
          <el-table :data="processIdentityData" id="processIdentityTable" size="mini" ref="processIdentityTable" 
            :header-cell-style="{'background-color': '#F0F2F5',padding:'0px'}" :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}"
            style="width: 100%;font-size:14px;border:1px solid #F0F2F5;" :height="height1" max-height="220px" :fit='true' >
            <el-table-column label="" width="40">
              <template scope="scope">
                <el-radio :label="scope.$index" v-model="radio1" @change.native="getIndentityRow(scope.row)"></el-radio>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="50px"></el-table-column>
            <el-table-column prop="name" label="进程身份名称" min-width="130%"></el-table-column>
            <el-table-column prop="path" label="程序路径" min-width="130%"></el-table-column>
            <el-table-column prop="status" label="状态" min-width="100%">
              <template slot-scope="props">
                <span v-if="props.row.status == '0'">创建中</span>
                <span v-else-if="props.row.status == '1'">已创建</span>
                <span v-else-if="props.row.status == '2'">创建失败</span>
                <span v-else-if="props.row.status == '3'">删除中</span>
                <span v-else-if="props.row.status == '4'">已删除</span>
                <span v-else-if="props.row.status == '5'">删除失败</span>
                <span v-else>初始化状态</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-pagination align='right' class="paging"   
            @size-change="handleSizeChange1" 
            @current-change="handleCurrentChange1"
            :current-page="currentPage1" 
            :page-sizes="[10,20]" 
            :page-size="pageSize1" 
            layout="total, prev, pager, next" 
            :total="total1">
          </el-pagination> -->
        </el-form-item>
        <el-form-item v-if="ruleForm.auth_process == '2'" prop="jsname" label="进程角色信息：">
          <el-table :data="processRoleData" size="mini" id="processRoleTable" ref="processRoleTable" 
          :header-cell-style="{'background-color': '#F0F2F5',padding:'0px'}" :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}"
            style="width: 100%;font-size:14px;border:1px solid #F0F2F5;"
          :height="height2" max-height="220px" :fit='true' >
            <el-table-column label="" width="40">
              <template scope="scope">
                <el-radio :label="scope.$index" v-model="radio2" @change.native="getRoleRow(scope.row)"></el-radio>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="50px"></el-table-column>
            <el-table-column prop="name" label="进程角色名称" min-width="130%"></el-table-column>
            <el-table-column prop="node_ip" label="网络地址" min-width="130%"></el-table-column>
            <el-table-column prop="status" label="状态" min-width="100%">
              <template slot-scope="props">
                <span v-if="props.row.status == '0'">创建中</span>
                <span v-else-if="props.row.status == '1'">已创建</span>
                <span v-else-if="props.row.status == '2'">创建失败</span>
                <span v-else-if="props.row.status == '3'">删除中</span>
                <span v-else-if="props.row.status == '4'">已删除</span>
                <span v-else-if="props.row.status == '5'">删除失败</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-pagination align='right' class="paging"   
            @size-change="handleSizeChange2" 
            @current-change="handleCurrentChange2"
            :current-page="currentPage2" 
            :page-sizes="[10,20]" 
            :page-size="pageSize2" 
            layout="total, prev, pager, next" 
            :total="total2">
          </el-pagination> -->
        </el-form-item>
        <el-form-item label="用户认证方式：" prop="auth_user">
          <el-radio-group v-model="ruleForm.auth_user" :disabled="ruleForm.allSwitch == 0">
            <el-radio :label="0">不需要</el-radio>
            <el-radio :label="1">用户id认证</el-radio>
            <el-radio :label="2">用户组id认证</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="ruleForm.auth_user == '1'" prop="userId" label="用户ID：">
          <el-input style="width:70%" v-model.number="ruleForm.userId"  onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" 
            placeholder="请输入用户ID，只可输入数字" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="ruleForm.auth_user == '2'" prop="userGroupId" label="用户组ID：">
          <el-input style="width:70%" v-model.number="ruleForm.userGroupId"  onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" 
            placeholder="请输入用户组ID，只可输入数字" clearable></el-input>
        </el-form-item>
        <el-form-item label="启动阶段可信：" prop="auth_trust_state_boot">
          <el-radio-group v-model="ruleForm.auth_trust_state_boot" :disabled="ruleForm.allSwitch == 0">
            <el-radio :label="0">不需要</el-radio>
            <el-radio :label="1">需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="动态度量阶段可信：" prop="auth_trust_state_dm">
          <el-radio-group v-model="ruleForm.auth_trust_state_dm" :disabled="ruleForm.allSwitch == 0">
            <el-radio :label="0">不需要</el-radio>
            <el-radio :label="1">需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="静态度量阶段可信：" prop="auth_trust_state_sm">
          <el-radio-group v-model="ruleForm.auth_trust_state_sm" :disabled="ruleForm.allSwitch == 0">
            <el-radio :label="0">不需要</el-radio>
            <el-radio :label="1">需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="环境度量：" prop="auth_env">
          <el-radio-group v-model="ruleForm.auth_env" :disabled="ruleForm.allSwitch == 0">
            <el-radio :label="0">不需要</el-radio>
            <el-radio :label="1">需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="uploadItem" prop="auth_cert_keep" label="认证方式：">
          <el-select v-model="ruleForm.auth_cert_keep" clearable placeholder="请选择认证方式" :disabled="ruleForm.allSwitch == 0">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
export default {
  name: 'AddPolicy',
  data () {
    return {
      activeText:"",
      height: 0,
      height1:0,
      height2:0,
      radio:"",
      radio1:"",
      radio2:"",
      btnvalue1:false,
      dialogFormVisible: false,
      labelPosition: 'right',
      processIdentityData:[],
      processIdentitySelection:{},
      processRoleData:[],
      processRoleSelection:{},
      rules: {
        allSwitch:[{ required: true, message: "请选择是否启用", trigger: "change" }],
        sfname: [{ required: true, message: "请选择身份信息", trigger: "change" }],
        jsname: [{ required: true, message: "请选择角色信息", trigger: "change" }],
        auth_process:[{ required: true, message: '请选择进程身份认证方式', trigger: 'change' },],
        auth_user:[{ required: true, message: '请选择用户认证方式', trigger: 'change' },],
        userId:[{ required: true,type: 'number', message: '请输入用户ID，只可输入数字', trigger: 'blur' }],
        userGroupId:[{ required: true,type: 'number', message: '请输入用户组ID，只可输入数字', trigger: 'blur' }],
        auth_trust_state_boot: [{ required: true, message: '请选择启动阶段可信', trigger: 'change' },],
        auth_trust_state_dm: [{ required: true, message: '请选择动态度量阶段可信', trigger: 'change' },],
        auth_trust_state_sm: [{ required: true, message: '请选择静态度量阶段可信', trigger: 'change' },],
        auth_env: [{ required: true, message: '请选择环境度量', trigger: 'change' },],
        auth_cert_keep: [{ required: true, message: '请选择认证方式', trigger: 'change' },],
      },
      ruleForm: {
        allSwitch:'',
        auth_process:'',//是否需要进程身份认证方式
        sfname:'',
        jsname:'',
        process_name: '',//进程身份名称 或者 进程角色名称
        auth_user:'',//是否需要用户认证方式
        user_id:'',//用户id 或者 用户组id
        userId:"",
        userGroupId:"",
        auth_trust_state_boot:'',
        auth_trust_state_dm:'',
        auth_trust_state_sm:'',
        auth_env:'',
        auth_cert_keep:'',//认证方式
      },
      options2:[
        // {value:0,label:"只允许签名认证"},
        {value:1,label:"只允许策略认证"},
        {value:2,label:"签名认证或者策略认证"},
        {value:3,label:"签名认证和策略认证同时满足"},
      ],
      title:'',
      policyType:'',
      nodeId:'',
      currentPage1: 1, // 当前页码
      total1: 0, // 总条数
      pageSize1: 5,// 每页的数据条数
      currentPage2: 1, // 当前页码
      total2: 0, // 总条数
      pageSize2: 5,// 每页的数据条数
    }
  },
  methods: {
    diaOpen (row,param) {
      var that = this
      if (param =='1') {
        this.title= '配置启动度量授权策略'
      } else if(param =='2') {
        this.title = '配置白名单基准值授权策略'
      }
      this.nodeId = row.nodeId
      this.policyType = param
      this.ruleForm.sfname = "1"
      this.ruleForm.jsname = "1"
      this.ruleForm.process_name=''
      
      this.ruleForm.user_id=''
      
      this.ruleForm.userId = ""
      this.ruleForm.userGroupId = ""
      that.radio="",
      that.radio1="",
      that.radio2="",
      that.dialogFormVisible = true
      that.btnvalue1 = false
      that.processIdentitySelection = {}
      that.processRoleSelection = {}

      request({
        url: "/sys/searchBYKey", method: "post",
        data: {
          node_id:row.nodeId,
          policy_type:param
        },
      }).then((response) => {
        var res = response.data
        // console.log(res);
        if(res.status == 0) {
          if (res.object) {
            that.ruleForm.allSwitch = res.object.on_off
            that.ruleForm.auth_process = res.object.auth_process
            if(that.ruleForm.auth_process == 1) {
              request({url: "/searchProIdenListByNID?node_id="+row.nodeId,method: "post",
              }).then((response) => {
                var res1 = response.data
                // console.log(res1)
                  that.processIdentityData = res1.data
                  
                  if (res1.total > 4) { that.height1 = 200;} 
                  else if (res1.total === 0) { that.height1 = 110;} 
                  else { that.height1 = 50 + 42 * res1.total;}
                  that.processIdentityData.forEach((row,index) => {
                    if(row.name == res.object.process_name) {
                      // console.log(row)
                      that.radio1 = index
                      that.processIdentitySelection = row
                      that.ruleForm.process_name = row.name
                    }
                  })
              });
            } else if (that.ruleForm.auth_process == 2) {
              request({url: "/searchProcessRoleListByNID?node_id="+row.nodeId,method: "post",
              }).then((response) => {
                var res2 = response.data
                // console.log(res2)
                  that.processRoleData = res2.data
                  that.total2 = res2.total
                  if (res2.total > 4) { that.height2 = 200;} 
                  else if (res2.total === 0) { that.height2 = 110;} 
                  else { that.height2 = 50 + 42 * res2.total; }
                  that.processRoleData.forEach((row,index) => {
                    if(row.name == res.object.process_name) {
                      that.radio2 = index
                      that.processRoleSelection = row
                      that.ruleForm.process_name = row.name
                    }
                  })
              });
            }
            that.ruleForm.auth_user=res.object.auth_user
            if (res.object.auth_user == 1) { that.ruleForm.userId = res.object.user_id} 
            else if (res.object.auth_user ==2) { that.ruleForm.userGroupId = res.object.user_id}

            that.ruleForm.auth_trust_state_boot = res.object.auth_trust_state_boot
            that.ruleForm.auth_trust_state_dm = res.object.auth_trust_state_dm
            that.ruleForm.auth_trust_state_sm = res.object.auth_trust_state_sm
            that.ruleForm.auth_env = res.object.auth_env

            that.ruleForm.auth_cert_keep = res.object.auth_cert_keep
          } else {
            that.ruleForm.allSwitch = 0
            that.activeText = "关"
            that.ruleForm.auth_process = ''
            that.ruleForm.auth_user = ''
            that.ruleForm.auth_trust_state_boot = ''
            that.ruleForm.auth_trust_state_dm = ''
            that.ruleForm.auth_trust_state_sm = ''
            that.ruleForm.auth_env = ''
            that.ruleForm.auth_cert_keep = ''
          }
        } 
      });
      this.$nextTick(function () {
        that.$refs.ruleForm.clearValidate()
        that.$refs.ruleForm.resetFields();
      });
    },
    diaClose () {
      var that = this
      that.dialogFormVisible = false
    },
    getIndentityRow(row) {
      // console.log(row)
      this.radio2="",
      this.processIdentitySelection = row;
      this.processRoleSelection={}
      this.ruleForm.process_name = row.name
    },
    getRoleRow(row) {
      // console.log(row)
      this.radio1="",
      this.processIdentitySelection = {};
      this.processRoleSelection = row;
      this.ruleForm.process_name = row.name
    },
    switchChange(val) {
      // console.log(val)
      var that = this
      if (val == 0) {
        this.activeText = "关"
        that.$refs.ruleForm.clearValidate()
        that.$refs.ruleForm.resetFields();
      } else if (val == 1) {
        this.activeText = "开"
      }
    },
    authProcessChange(val) {
      // console.log(val)
      var that = this
      if(val == 0) {
        that.radio1="",
        that.radio2="",
        that.ruleForm.process_name = ""
      } else if (val == 1) {
        request({url: "/searchProIdenListByNID?node_id="+this.nodeId,method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
          that.processIdentityData = res.data
          that.total1 = res.data.length
          if (res.total > 4) {
            that.height1 = 200;
          } else if (res.total === 0) {
            that.height1 = 110;
          } else {
            that.height1 = 50 + 42 * res.total;
          }
        });
      } else if (val == 2) {
        request({url: "/searchProcessRoleListByNID?node_id="+this.nodeId,method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
            that.processRoleData = res.data
            that.total2 = res.total
            if (res.total > 4) {
              that.height2 = 200;
            } else if (res.total === 0) {
              that.height2 = 110;
            } else {
              that.height2 = 50 + 42 * res.total;
            }
        });
      }
    },
    handleSizeChange1(val) {
      // console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
      this.authProcessChange(1)
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange1(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.authProcessChange(1)
    },
    handleSizeChange2(val) {
      // console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
      this.authProcessChange(2)
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange2(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.authProcessChange(2)
    },
    submitForm (formName) {
      var that = this
      if(Object.keys(that.processIdentitySelection).length==0 ) { that.ruleForm.sfname = ''
      } else { that.ruleForm.sfname = '1'}
      if(Object.keys(that.processRoleSelection).length==0 ) { that.ruleForm.jsname = ''
      } else { that.ruleForm.jsname = '1'}
      if(that.ruleForm.sfname == "1" || that.ruleForm.jsname =="1") {
        that.ruleForm.sfname == "2"
        that.ruleForm.jsname == "2"
      } else {
        that.ruleForm.sfname == ""
        that.ruleForm.jsname == ""
      }
      if(that.ruleForm.auth_user == 0) {
        that.ruleForm.user_id = ""
      } else if (that.ruleForm.auth_user == 1) {
        that.ruleForm.user_id = that.ruleForm.userId
      } else if (that.ruleForm.auth_user ==2) {
        that.ruleForm.user_id = that.ruleForm.userGroupId
      }
      if (that.ruleForm.allSwitch == 0) {
        that.ruleForm.auth_process = 0,//是否需要进程身份认证方式
        that.ruleForm.process_name = "",//进程身份名称 或者 进程角色名称
        that.ruleForm.auth_user = 0,//是否需要用户认证方式
        that.ruleForm.user_id = "",//用户id 或者 用户组id

        that.ruleForm.auth_trust_state_boot = 0,
        that.ruleForm.auth_trust_state_dm = 0,
        that.ruleForm.auth_trust_state_sm = 0,
        that.ruleForm.auth_env = 0
        that.ruleForm.auth_cert_keep = 2
      }
      var data= {
        node_id:that.nodeId, //终端id
        policy_type:that.policyType,//要配置的策略类型
        on_off: that.ruleForm.allSwitch,//是否启用
        auth_process:that.ruleForm.auth_process,//是否需要进程身份认证方式
        process_name:that.ruleForm.process_name,//进程身份名称 或者 进程角色名称
        auth_user:that.ruleForm.auth_user,//是否需要用户认证方式
        user_id:that.ruleForm.user_id,//用户id 或者 用户组id

        auth_trust_state_boot:that.ruleForm.auth_trust_state_boot,
        auth_trust_state_dm:that.ruleForm.auth_trust_state_dm,
        auth_trust_state_sm:that.ruleForm.auth_trust_state_sm,
        auth_env:that.ruleForm.auth_env,
        auth_cert_keep:that.ruleForm.auth_cert_keep,//是否还需要保留签名认证方式
      }
      // console.log(data)
      that.$refs[formName].validate((valid) => {
        // console.log(valid)
        if (valid) {
          that.btnvalue1 = true
          request({
            url: '/sys/creatPolicyAuth',
            data:data,
            method: 'post'
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
            that.$message({message: '操作成功!', type: 'success', showClose: true })
            that.dialogFormVisible = false
            that.$emit('addSuccess')
            } else {
              that.btnvalue1 = false
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

<style scope>
.el-dialog__body {
  padding: 20px;
}
#terminalTable .el-radio__label,
#processIdentityTable .el-radio__label,
#processRoleTable .el-radio__label{
  display: none;
}
#processIdentityTable .el-radio__input.is-checked .el-radio__inner::before,
#processRoleTable .el-radio__input.is-checked .el-radio__inner::before  {
  content: '\2714';
  color: #fff;
}
#processIdentityTable .el-radio__inner::after,
#processRoleTable .el-radio__inner::after  {
  width: 0;
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: #1ac492;
  background: #1ac492;
}
.el-radio__input .el-radio__inner:hover {
  border-color: #1ac492;
}
.el-radio__input.is-checked+.el-radio__label {
  color: #1ac492;
}
.el-select .el-input__inner:focus {
  border-color: #1ac492;
}
.el-select .el-input.is-focus .el-input__inner {
  border-color: #1ac492;
}
.paging {
  margin-top: 8px;
  color: rgba(51,51,51,0.9);
}
.el-pager li {
  min-width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 2px;
  border: 1px solid #e4e4e4;
  margin: 0 3px;
}
.el-pager li.active,.el-pager li:hover {
  background-color: #effff8;
  border: 1px solid #1ac492;
  color: #1ac492;
  font-size: 14px;
}
.el-switch.is-checked .el-switch__core {
  border-color: #1ac492;
  background-color: #1ac492;
}
.el-switch__label.is-active {
  color: #1ac492;
}
.el-pagination .btn-next, .el-pagination .btn-prev{
  min-width: 24px;
  height: 24px;
  line-height: 24px;
  border: 1px solid #e4e4e4;
  padding: 0;
  margin: 0 5px;
}
</style>