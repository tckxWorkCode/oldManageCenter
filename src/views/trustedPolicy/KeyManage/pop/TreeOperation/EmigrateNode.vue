<template>
  <el-dialog title="迁出文件" width="32%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false" :append-to-body="true">
    <el-form :label-position="labelPosition" label-width="100px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <el-form-item class="zdclass" prop="zdname" label="终端信息：">
        <div class="searchDiv">
          <el-input style="width: 50%" v-model="searchTerminalIp" placeholder="搜索IP" clearable></el-input>
        </div>
        <div class="cardContainer">
          <div class="cardTip" v-if="filterData.length == 0">暂无数据</div>
          <div class="itemCard" :class="{active: categoryIndex == index}"
            v-for="(item,index) in filterData" :key="item.nodeId">
            <div class="radioContainer">
              <el-radio :label="index" class="itemRadio" v-model="radio" @change.native="getCurrentSelect(item,index)"></el-radio>
            </div>
            <div class="contentContainer">
              <div><span class="contentText">名称：</span><span class="content">{{item.name}}</span></div>
              <div><span class="contentText">IP：</span><span class="content">{{item.ip}}</span></div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item class="uploadItem" prop="password" label="密码：">
        <el-input style="width:80%" v-model="ruleForm.password" clearable placeholder='请输入tcm密码' :type="password0">
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
  name: 'EmigrateNode',
  data () {
    return {
      btnvalue1:false,
      dialogFormVisible: false,
      labelPosition: 'right',
      password0: "password",
      searchTerminalIp: "",
      radio:"",
      categoryIndex: -1,
      terminalData:[],
      terminalSelection:{},
      rules: {
        zdname: [{ required: true, message: "请选择终端", trigger: "change" }],
      },
      ruleForm: {
        zdname: "",
        password:'',
      },
      path:"",
      nodeId:"",
      id:""
    }
  },
  computed: {
    filterData:function() {
      return this.terminalData.filter(data => !this.searchTerminalIp || data.ip.includes(this.searchTerminalIp))
    }
  },
  methods: {
    diaOpen (nodeData,rowMessage,path) {
      var that = this
      this.categoryIndex=-1
      that.dialogFormVisible = true
      that.btnvalue1 = false
      that.password0= "password"
      that.searchTerminalIp = "";
      that.radio = ""
      that.ruleForm.zdname = "1";
      that.ruleForm.password=''
      this.terminalSelection = {}
      that.nodeId = rowMessage.nodeId
      that.path = path
      that.id = nodeData.id
      request({url: "/LNodeList",method: "post",
        data: {
          system_type: "1",
          searchPage: "1",
          searchSize: "10000",
        }
      }).then((response) => {
        var res = response.data
        // console.log(res)
        that.terminalData = res.list
      });
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
      if (that.password0 === "password") {
        that.password0 = "text";
      } else {
        that.password0 = "password";
      }
    },
    // 选择终端
    getCurrentSelect(item,index) {
      this.categoryIndex = index;
      this.terminalSelection = item;
    },
    submitForm (formName) {
      var that = this
      if(Object.keys(that.terminalSelection).length == 0) {
        that.ruleForm.zdname = ''
      } else {
        that.ruleForm.zdname = '1'
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.btnvalue1 = true
          request({
            url: '/sec/emigrateKeyTree',
            data: {
              node_id:that.nodeId,
              transfer_node_id: that.terminalSelection.nodeId,
              ownerpass: that.ruleForm.password,
              tree_path:that.path,
              tree_path_id:that.id
            },
            method: 'post'
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
            that.$message({message: '操作成功!迁出数据请在迁移记录中下载', type: 'success', showClose: true })
            that.dialogFormVisible = false
            that.$emit('addSuccess')
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
.cardContainer {
  max-height: 40vh;
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
  width: 47%;
  float: left;
  display: flex;
  border: 1px solid #f0f0f4;
  border-radius: 5px;
  margin-right: 10px;
  margin-top: 20px;
}
.active {
  border-color: #1ac492;
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
.itemRadio .el-radio__label {
  display: none;
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
</style>
