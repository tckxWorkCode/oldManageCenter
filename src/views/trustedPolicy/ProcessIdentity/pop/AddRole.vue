<template>
  <!--新建开始-->
  <el-dialog title="新建角色" width="35%" top="10vh" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="120px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <el-form-item class="uploadItem" prop="roleName" label="进程角色名称：">
        <el-input v-model="ruleForm.roleName" placeholder="请输入进程角色名称" name="roleName" type="text" style="width: 70%"></el-input>
      </el-form-item>
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
      <el-form-item class="zdclass" prop="clname" label="进程身份信息：">
        <div class="cardTip" v-if="JSON.stringify(this.terminalSelection) == '{}' && processIdentityData.length == 0">暂无数据</div>
        <div v-else>
          <el-table :data="processIdentityData" size="mini" ref="processIdentityTable" style="width: 100%;font-size:14px;border:1px solid #F0F2F5;" 
           tooltip-effect="light" :height="height2" max-height="250px" :fit='true' row-key="i_id"
           :header-cell-style="{'background-color': '#F0F2F5',padding:'0px'}" :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}"
           @selection-change="handleSelectionChange1" id="processIdentityTable">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" label="序号" width="50px"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="path" label="路径"></el-table-column>
          </el-table>
        </div>
        
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="canBtn" @click="dialogFormVisible = false">取 消</el-button>
      <el-button size="small" class="sureBtn" :disabled="btnvalue1"  @click="submitForm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
export default {
  name: "AddRole",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入策略名称"));
      } else if (value.length > 20) {
        callback(new Error("策略名称长度不超出20个字符"));
      } /*else if (/^\s+$/gi.test(value)) {
        callback(new Error('名称不能为空格'))
      }*/ else if (
        /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\_\.]/g.test(value)
      ) {
        callback(new Error("策略名称只能输入中文、英文、数字、_和.符号"));
      } else {
        callback();
      }
    };
    return {
      height2:0,
      dialogFormVisible: false,
      btnvalue1: false,
      labelPosition: "right",
      radio:"",
      categoryIndex: -1,
      terminalData:[],
      terminalSelection:{},
      processIdentityData: [],
      proIdentitySelection:[],
      nodeId:[],
      i_ids:[],
      searchTerminalIp: "",
      rules: {
        roleName: [{ required: true, validator: validatePass, trigger: "blur" }],
        zdname: [{ required: true, message: "请选择终端", trigger: "change" }],
        clname: [
          { required: true, message: "请选择进程身份，至少一项", trigger: "change" },
        ],
      },
      ruleForm: {
        zdname: "",
        clname: "",
        roleName: "",
      },
    };
  },
  computed: {
    filterData:function() {
      return this.terminalData.filter(data => !this.searchTerminalIp || data.ip.includes(this.searchTerminalIp))
    }
  },
  methods: {
    submitForm(formName) {
      var that = this;
      if(Object.keys(that.terminalSelection).length == 0) {
        that.ruleForm.zdname = ''
      } else {
        that.ruleForm.zdname = '1'
      }
      if(that.proIdentitySelection.length === 0) {
        that.ruleForm.clname = ''
      } else {
        that.ruleForm.clname = '1'
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.btnvalue1 = true;
          for (var i in that.proIdentitySelection) {
            that.i_ids.push(that.proIdentitySelection[i].i_id)
          }
          var data = {
            name: that.ruleForm.roleName,
            node_id: that.terminalSelection.nodeId,
            i_ids:that.i_ids
          }
          request({
            url:"/sys/createLProcessRole",
            method: "post",
            data:JSON.stringify(data)
          }).then((response) => {
            var res = response.data
            // console.log(res)
            if (res.status === 0) {
              that.dialogFormVisible = false;
              that.$message({ message: "操作成功!", type: "success", showClose: true });
              that.$emit("addSuccess");
            } else {
              that.btnvalue1 = false;
              // that.terminalSelection= {},
              // that.proIdentitySelection= [],
              // that.nodeId= [],
              // that.i_ids= []
              // that.$message({ message: res.errormessage, type: "error", showClose: true,});
            }
          });
        } else {
          that.btnvalue1 = false;
        }
      });
    },
    diaOpen() {
      var that = this
      this.dialogFormVisible = true;
      this.categoryIndex = -1;
      this.ruleForm.policyName = "";
      this.ruleForm.zdname = "1";
      this.ruleForm.clname = "1";
      this.btnvalue1 = false;
      this.searchTerminalIp = "";
      this.radio = ""
      this.terminalSelection = {}
      this.nodeId = [],
      this.i_ids = [],
      this.processIdentityData =[]
      // 加载终端列表
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
      });
      this.$nextTick(function () {
        that.$refs.processIdentityTable.clearSelection();
        that.$refs.ruleForm.resetFields();
      });
    },
    diaClose() {
      this.dialogFormVisible = false;
    },
    // 选择终端
    getCurrentSelect(item,index) {
      var that = this
      this.categoryIndex = index;
      this.terminalSelection = item;
      request({url: "/searchProIdenListByNID?node_id="+item.nodeId,method: "post",
        // data:{ node_id : row.nodeId}
      }).then((response) => {
        var res = response.data
        // console.log(res)
        that.processIdentityData = res.data
        if (res.total >= 5) {
          that.height2 = 240;
        } else if (res.total === 0) {
          that.height2 = 110;
        } else {
          that.height2 = 50 + 42 * res.total;
        }
      });
    },
    // 软件包多选
    handleSelectionChange1 (val) {
      var that = this
      // console.log(val)
      if(val) {
        that.proIdentitySelection = val
        that.ruleForm.clname = "1"
      }
    },
  },
};
</script>

<style scoped>
.uploadItem .el-input {
  float: left;
}
.uploadItem .el-radio-button {
  float: left;
}
.uploadItem .el-input.putml {
  float: right;
}
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
/* #processIdentityTable>>> .el-checkbox__input .is-checked.el-checkbox__inner::before {
  content: '\2714'!important;
  color: #fff;
} */
</style>