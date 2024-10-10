<template>
  <el-dialog title="配置" top="5vh" width="38%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="150px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <el-form-item label="控制模式：" prop="control_mode">
        <el-radio-group v-model="ruleForm.control_mode" @change="controlModel">
          <el-radio :label="0">不控制</el-radio>
          <el-radio :label="1">全控制</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="server_ip" label="管理中心IP：">
        <el-input style="width:50%"  :disabled="controlDisable" v-model="ruleForm.server_ip" clearable placeholder='请输入管理中心IP'></el-input>     
      </el-form-item>
      <el-form-item prop="server_port" label="管理中心端口：">
        <el-input style="width:50%"  :disabled="controlDisable" v-model.number="ruleForm.server_port" clearable type="number" placeholder='请输入管理中心端口'></el-input>
      </el-form-item>
      <!-- <el-form-item label="报文加密认证：" prop="encrypt_auth">
        <el-radio-group v-model="ruleForm.encrypt_auth" :disabled="controlDisable">
          <el-radio :label="0">不加密</el-radio>
          <el-radio :label="1">加密</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="附加管理中心证实：" prop="server_testify">
        <el-radio-group v-model="ruleForm.server_testify" :disabled="controlDisable">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="汇报可信认证失败：" prop="report_auth_fail">
        <el-radio-group v-model="ruleForm.report_auth_fail" :disabled="controlDisable">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="汇报会话：" prop="report_session">
        <el-radio-group v-model="ruleForm.report_session" :disabled="controlDisable">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item prop="be_session_expire" label="会话过期时间：">
        <el-input style="width:50%" v-model.number="ruleForm.be_session_expire" :disabled="controlDisable"
          clearable type="number"></el-input>
          &nbsp;&nbsp;<span>分钟 （0表示不过期）</span>
      </el-form-item> -->
      <el-divider></el-divider>
      <el-table row-key="id" ref="terminalTable" size="small" style="border:1px solid #F0F2F5;font-size:14px" 
      :header-cell-style="{'background-color': '#F0F2F5'}" :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}"
      :data="exceptions" max-height="20vh">
        <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
        <el-table-column prop="" label="协议" align="center" min-width="140%">
          <template slot-scope="scope">
            <el-select v-model="scope.row.protocol" size="mini" filterable placeholder="请选择协议">
              <el-option v-for="item in options" :key="parseInt(item.value)" :label="item.label" :value="parseInt(item.value)">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="remote_ip" label="对端IP" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remote_ip" v-show="scope.row.show"  min-width="140%" size="mini" />
            <span v-show="!scope.row.show">{{scope.row.remote_ip}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remote_port" label="对端端口" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remote_port" v-show="scope.row.show"  min-width="100%" size="mini" />
            <span v-show="!scope.row.show">{{scope.row.remote_port}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="local_ip" label="本地IP" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.local_ip" v-show="scope.row.show"  min-width="140%" size="mini" />
            <span v-show="!scope.row.show">{{scope.row.local_ip}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="local_port" label="本地端口" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.local_port" v-show="scope.row.show"  min-width="100%" size="mini" />
            <span v-show="!scope.row.show">{{scope.row.local_port}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" min-width="150%" align="center">
          <template slot-scope="scope">
            <el-button class="btnClass" plain type="success" size="mini" @click="save1(scope.row)" :disabled="scope.row.disable == true">
              保存
            </el-button>
            <el-button class="btnClass" plain  type="warning" size="mini"  @click="edit(scope.row)" :disabled="scope.row.disable == true">
              编辑
            </el-button>
            <el-button class="btnClass" plain type="danger" size="mini" @click="handleDelete(scope.$index)" :disabled="scope.row.disable == true">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-col :span="24"> -->
        <el-button type="success" plain size="small" class="el-table-add-row"  :disabled="controlDisable" @click="handleAdd()" icon="el-icon-plus">
          添加
        </el-button>
      <!-- </el-col> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button size="small" type="success" plain v-if="!controlDisable" @click="addInitValue">添加模板</el-button> -->
      <el-button size="small" class="canBtn" @click="dialogFormVisible = false">取 消</el-button>
      <el-button size="small" class="sureBtn" :disabled="btnvalue1" @click="submitForm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'ConfigConnection',
  data () {
    var validatePass = (rule, value, callback) => {
      var reg = /^\d+$/;
      if (!reg.test(value) && parseInt(value) <= 0 || parseInt(value) > 65535) {
        callback("请输入0到65535之间值");
      } else {
        callback();
      }
    };
    return {
      btnvalue1:false,
      dialogFormVisible: false,
      labelPosition: 'right',
      rules: {
        server_ip:[{ required: true, message: '请输入管理中心IP', trigger: 'blur' }],
        server_port:[{ required: true,type: 'number', validator: validatePass, trigger: 'blur' }],
        control_mode: [{ required: true, message: '请选择控制模式', trigger: 'change' },],
        encrypt_auth:[{ required: true, message: '请选择报文是否加密认证', trigger: 'change' },],
        server_testify:[{ required: true, message: '请选择是否附加管理中心证实', trigger: 'change' },],
        report_auth_fail:[{ required: true, message: '请选择是否向管理中心汇报可信认证失败', trigger: 'change' }],
        report_session:[{ required: true, message: '请选择是否向管理中心汇报会话建立、过期、删除', trigger: 'change' }],
        be_session_expire:[{ required: true,type: 'number', message: '请输入会话过期时间', trigger: 'blur' }],
      },
      ruleForm: {
        server_ip: '',
        server_port: '',
        control_mode:'',//控制模式
        encrypt_auth:'',//报文是否加密认证
        server_testify: '',//是否附加管理中心证实
        report_auth_fail:'',//是否向管理中心汇报可信认证失败
        report_session:'',//向管理中心汇报会话建立、过期、删除
        be_session_expire: '',//是否会话过期时间
        
      },
      nodeName: '',
      nodeId:'',
      nodeIp:'',
      exceptions:[],
      tableData:[],
      addData:[],
      options:[{value:0,label:"TCP/UDP"},{value:1,label:"TCP"},{value:2,label:"UDP"}],
      controlDisable:false,
    }
  },
  methods: {
    diaOpen (row) {
      // console.log(this.options)
      var that = this
      this.nodeId = row.nodeId
      this.nodeIp = row.ip
      this.nodeName = row.name;
      that.dialogFormVisible = true
      that.btnvalue1 = false
      request({ url: "/sec/selectLinkByNodeId", method: "post",data: { node_id:row.nodeId,},
      }).then((response) => {
        var res = response.data
        // console.log(res);
        if(res.object) {
          that.ruleForm.server_ip = res.object.server_ip
          that.ruleForm.server_port = res.object.server_port
          that.ruleForm.control_mode = res.object.control_mode
          // console.log(res.object.control_mode)
          if (res.object.control_mode == 0 || res.object.control_mode == null) {
            that.ruleForm.control_mode = 0
            that.controlDisable = true
            that.ruleForm.server_testify = 0
            that.ruleForm.report_auth_fail = 0
            that.ruleForm.report_session = 0
          } else {
            that.ruleForm.control_mode = res.object.control_mode
            that.controlDisable = false
            that.ruleForm.server_testify = res.object.server_testify
            that.ruleForm.report_auth_fail = res.object.report_auth_fail
            that.ruleForm.report_session = res.object.report_session
          }
          that.ruleForm.encrypt_auth = res.object.encrypt_auth
          that.ruleForm.be_session_expire = res.object.be_session_expire
          if (JSON.stringify(res.object.exceptions) !='[]') {
            res.object.exceptions.map (function(value,index) {
              if (value.protocol ==1) {value.protocol ="TCP"}
              else if (value.protocol ==2) {value.protocol ="UDP"}
              else if (value.protocol ==0) {value.protocol ="TCP/UDP"}
              value.show = false
              value.disable = false
            })
          }
          that.tableData = res.object.exceptions
          that.defaultExceptions = res.object.defaultExceptions
          if (res.object.control_mode == 0) {
            that.controlDisable = true
            that.exceptions = []
          } else if (res.object.control_mode == 1) {
            that.controlDisable = false
            that.exceptions = res.object.exceptions
            // console.log(that.exceptions)
          }
        } else {
          that.ruleForm.server_ip = ''
          that.ruleForm.server_port = ''
          that.ruleForm.control_mode = ''
          that.ruleForm.encrypt_auth = ''
          that.ruleForm.server_testify = ''
          that.ruleForm.report_auth_fail = ''
          that.ruleForm.report_session = ''
          that.ruleForm.be_session_expire = ''
          that.exceptions = []
        }
      });
      that.$nextTick(function () {
        that.$refs.ruleForm.clearValidate()
      })
    },
    diaClose () {
      var that = this
      that.dialogFormVisible = false
    },
    controlModel(val) {
      // console.log(val)
      var that = this
      if (val == 0) {
        that.controlDisable = true
        that.ruleForm.server_testify = 0
        that.ruleForm.report_auth_fail = 0
        that.ruleForm.report_session = 0
        that.exceptions=[]
      } else if (val == 1) {
        that.controlDisable = false
        
        request({ url: "/sec/selectLinkByNodeId", method: "post", data: { node_id:that.nodeId,},
          }).then((response) => {
            var res = response.data
            // console.log(res)
            if (JSON.stringify(res.object.exceptions) !='[]') {
              res.object.exceptions.map (function(value,index) {
                if (value.protocol ==1) {value.protocol ="TCP"}
                else if (value.protocol ==2) {value.protocol ="UDP"}
                else if (value.protocol ==0) {value.protocol ="TCP/UDP"}
                value.show = false
                value.disable = false
              })
            }
            if (res.object.server_testify == null) {
              that.ruleForm.server_testify = 0
            } else {
              that.ruleForm.server_testify = res.object.server_testify
            } 
            if (res.object.report_auth_fail == null) {
              that.ruleForm.report_auth_fail = 0
            } else {
              that.ruleForm.report_auth_fail = res.object.report_auth_fail
            } 
            if (res.object.report_session == null) {
              that.ruleForm.report_session = 0
            } else {
              that.ruleForm.report_session = res.object.report_session
            } 
            that.exceptions = res.object.exceptions
            that.addInitValue()
          })
      }
    },
    addInitValue() {
      var that = this
      that.exceptions=[{
        protocol: 1,
        remote_ip: "0.0.0.0",
        // local_ip: "0.0.0.0",
        remote_port: "0",
        local_port: "9821",
        disable:true
      },{
        protocol: 1,
        remote_ip: "0.0.0.0",
        // local_ip: "0.0.0.0",
        remote_port: "9821",
        local_port: "0",
        disable:true
      },{
        protocol: 1,
        remote_ip: "0.0.0.0",
        // local_ip: "0.0.0.0",
        remote_port: "0",
        local_port: "22",
        disable:true
      },{
        protocol: 2,
        remote_ip: "0.0.0.0",
        // local_ip: "0.0.0.0",
        remote_port: "53",
        local_port: "0",
        disable:true
      }]
      if (that.defaultExceptions != null) {
        that.exceptions = that.exceptions.concat(that.defaultExceptions)
      }
    },
    submitForm (formName) {
      var that = this
      that.exceptions.map (function(value,index) {
        if (value.protocol =="TCP") {value.protocol =1}
        else if (value.protocol =="UDP") {value.protocol =2}
        else if (value.protocol =="TCP/UDP") {value.protocol =0}
      })
      // console.log(that.exceptions)
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.btnvalue1 = true
          request({
            url: '/sec/editLink',
            data: {
              node_id: that.nodeId,
              node_name: that.nodeName,
              node_ip: that.nodeIp,
              server_ip:that.ruleForm.server_ip,
              server_port:that.ruleForm.server_port,
              control_mode: that.ruleForm.control_mode,
              // encrypt_auth: that.ruleForm.encrypt_auth,
              encrypt_auth: 0,
              server_testify: that.ruleForm.server_testify,
              report_auth_fail: that.ruleForm.report_auth_fail,
              report_session: that.ruleForm.report_session,
              // be_session_expire: that.ruleForm.be_session_expire,
              be_session_expire: 0,
              exceptions:that.exceptions
            },
            method: 'post'
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
            that.$message({message: '操作成功!', type: 'success', showClose: true })
            that.dialogFormVisible = false
            that.$emit('success')
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
    },
    save1(row) {
      row.show = false;
      // console.log(row)
      this.addData.push(row)
    },
    edit(row) {
      // console.log(row)
      row.show = true;
    },
    // 添加点击按钮
    handleAdd() {
      for (let i of this.exceptions) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      this.exceptions.push({
        protocol: "",
        remote_ip: "",
        // local_ip: "",
        remote_port: "",
        local_port: "",
        show: true,
      });
      // console.log(this.exceptions)
    },
    handleDelete(index) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          this.exceptions.splice(index, 1)
          this.$message({ type: "success", message: "删除成功!",});
        }).catch(() => {
          this.$message({ type: "info", message: "已取消删除",})
        })
    },
  }
}
</script>

<style scope>
.btnClass {
  padding: 5px;
}
.el-table-add-row {
  text-align: center;
  margin-top: 10px;
  width: 100%;
  border-radius: 3px;
}
.sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff!important;
}
</style>
