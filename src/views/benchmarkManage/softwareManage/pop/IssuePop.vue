<template>
  <!--新建开始-->
  <el-dialog title="新建策略" width="35%" top="5vh" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="120px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <el-form-item prop="package_status" label="软件包下发：">
        <el-switch v-model="ruleForm.package_status" :active-text="activeText" :active-value="1" :inactive-value="0" @change="switchChange">
        </el-switch>
      </el-form-item>
      <div class="itemw">
        <el-form-item prop="policyName" label="策略名称：">
          <el-input style="width:80%" v-model="ruleForm.policyName" placeholder="请输入中文、英文、数字、_和.符号" name="policyName" type="text"></el-input>
        </el-form-item>
      </div>
      <div class="itemw">
        <el-form-item class="zdclass" prop="zdname" label="终端信息：">
          <div class="searchDiv">
            <el-input style="width:40%" class="searchinputtab" v-model="searchTerminalIp" placeholder="搜索IP" clearable></el-input>
          </div>
          <div>
            <el-table :data="filterData" size="mini" ref="terminalTable"  @selection-change="handleSelectionChange" class="tableStyle"
            :header-cell-style="{'background-color': '#F0F2F5',padding:'0px'}" :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}"
             height="200px" max-height="200px" :fit='true' >
              <el-table-column type="selection" width="50" align="center"></el-table-column>
              <el-table-column type="index" label="序号" width="50px"></el-table-column>
              <el-table-column prop="name" label="终端名称"></el-table-column>
              <el-table-column prop="ip" label="网络地址"></el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </div>
      <div class="itemw">
        <el-form-item class="zdclass" prop="clname" label="软件包信息：">
          <div class="searchDiv">
            <el-input style="width:40%" class="searchinputtab" v-model="searchSoftwareName" placeholder="搜索软件名称" clearable></el-input>
          </div>
          <el-table :data="filterData2" size="mini" ref="softwareTable"  class="tableStyle"
             :header-cell-style="{'background-color': '#F0F2F5',padding:'0px'}" :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}"
             tooltip-effect="light" height="200px" max-height="200px" :fit='true' row-key="packId"
             @selection-change="handleSelectionChange1" >
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" label="序号" width="50px"></el-table-column>
            <el-table-column prop="packName" label="软件包名称"></el-table-column>
            <el-table-column prop="upTime" label="上传时间"></el-table-column>
          </el-table>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-row>
        <el-col :span="16">
          <div class="tipText">windows系统不支持此项功能</div>
        </el-col>
        <el-col :span="8">
          <el-button size="small" class="canBtn" @click="dialogFormVisible = false">取 消</el-button>
          <el-button size="small" class="sureBtn" :disabled="btnvalue1"  @click="submitForm('ruleForm')">确定</el-button>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
export default {
  name: "IssuePop",
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
      activeText:"是",
      dialogFormVisible: false,
      btnvalue1: false,
      labelPosition: "right",
      terminalData:[],
      terminalSelection:[],
      softwareData: [],
      softwareSelection:[],
      
      nodeId:[],
      pack_ids:[],

      searchTerminalIp: "",
      searchSoftwareName: "",
      
      rules: {
        package_status: [{ required: true, message: "请选择是否下发软件包", trigger: "change" }],
        policyName: [{ required: true, validator: validatePass, trigger: "blur" },],
        zdname: [{ required: true, message: "请选择终端", trigger: "change" }],
        clname: [
          { required: true, message: "请选择软件包", trigger: "change" },
        ],
      },
      ruleForm: {
        package_status:"",
        zdname: "",
        clname: "",
        policyName: "",
      },
    };
  },
  computed: {
    filterData:function() {
      return this.terminalData.filter(data => !this.searchTerminalIp || data.ip.toLowerCase().includes(this.searchTerminalIp.toLowerCase()))
    },
    filterData2:function() {
      return this.softwareData.filter(data => !this.searchSoftwareName || data.packName.toLowerCase().includes(this.searchSoftwareName.toLowerCase()))
    },
  },
  methods: {
    submitForm(formName) {
      var that = this;
      if(that.terminalSelection.length === 0) {
        that.ruleForm.zdname = ''
      }    
      if(that.softwareSelection.length === 0) {
        that.ruleForm.clname = ''
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.btnvalue1 = true;
          for (var i in that.terminalSelection) {
            var obj = new Object() 
            obj.nodeId = that.terminalSelection[i].nodeId
            that.nodeId.push(obj)
          }
          for (var i in that.softwareSelection) {
            that.pack_ids.push(that.softwareSelection[i].packId)
          }
          var data = {
            package_status: that.ruleForm.package_status,
            policyName: that.ruleForm.policyName,
            type:2,
            nodeId:that.nodeId,
            pack_ids:that.pack_ids
          }
          // console.log(data)
          that.dialogFormVisible = false;
          request({
            url:"/sec/whiteListIssued",
            method: "post",
            data:JSON.stringify(data)
          }).then((response) => {
            var res = response.data
            // console.log(res)
            if (res.status === 500) {
              that.btnvalue1 = false;
            } else {
              that.dialogFormVisible = false;
              // that.$message({ message: "操作成功!",type: "success",showClose: true,});
              that.$emit("newsuccess");
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
      this.ruleForm.package_status = 1
      this.ruleForm.policyName = "";
      this.ruleForm.zdname = "1";
      this.ruleForm.clname = "1";
      this.btnvalue1 = false;
      this.searchTerminalIp = "";
      this.searchSoftwareName = "";
      this.nodeId = [],
      this.pack_ids = [],
      this.terminalSelection = []
      this.softwareSelection = []
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
        .filter(item => {
          return item.onlineStatus == 1
        })
      });

      //加载软件包列表
      request({url: "/sec/whiteListPackageSearch",method: "post",
        data: {
          condition: "",
          orderBy: "",
          firstTime: "",
          lastTime: "",
          searchPage: "1",
          searchSize: "10000",
        }
      }).then((response) => {
        var res = response.data
        // console.log(res)
        if(res.list) {
          res.list.map(function(value,index) {
            value.upTime = timeToZh(value.upTime);
          })
          that.softwareData = res.list
        }
      });
      this.$nextTick(function () {
        that.$refs.terminalTable.clearSelection();
        that.$refs.softwareTable.clearSelection();
        that.$refs.ruleForm.resetFields();
      });
    },
    diaClose() {
      this.dialogFormVisible = false;
    },
    switchChange(val) {
      if (val == 0) {
        this.activeText = "否"
      } else if (val == 1) {
        this.activeText = "是"
      }
      this.btnvalue1 = false
    },
    handleSelectionChange (val) { // 终端多选
      if(val) {
        this.terminalSelection = val
        this.ruleForm.zdname = "1"
        this.btnvalue1 = false;
      }
    },
    handleSelectionChange1 (val) {// 软件包多选
      if(val) {
        this.softwareSelection = val
        this.ruleForm.clname = "1"
        this.btnvalue1 = false;
      }
    }
  },
};
</script>

<style scoped>
.tableStyle {
width: 100%;font-size:14px;border:1px solid #F0F2F5;margin-top: 10px;
}
.itemw {
  position: relative;
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
.tipText {
  color: #333;
  text-align: left;
  line-height: 32px;
  padding-left: 10px;
}
</style>
