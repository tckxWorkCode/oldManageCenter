<template>
  <!--新建开始-->
  <el-dialog title="新建策略" width="50%" top="10vh" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="120px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <div class="itemw">
        <el-form-item class="zdclass" prop="zdname" label="终端信息：">
          <div class="searchDiv">
            <el-input style="width:40%" class="searchinputtab" v-model="searchTerminalIp" placeholder="搜索IP" clearable></el-input>
          </div>
            <el-table :data="filterData" size="mini" ref="terminalTable"  @selection-change="handleSelectionChange" class="tableStyle"
            :header-cell-style="{'background-color': '#F0F2F5',padding:'0px'}" :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}"
             height="200px" max-height="200px" :fit='true' >
              <el-table-column type="selection" width="50" align="center"></el-table-column>
              <el-table-column type="index" label="序号" width="50px"></el-table-column>
              <el-table-column prop="name" label="终端名称"></el-table-column>
              <el-table-column prop="ip" label="网络地址"></el-table-column>
            </el-table>
        </el-form-item>
      </div>
      <div class="itemw">
        <el-form-item class="zdclass" prop="clname" label="证书信息：">
          <div class="searchDiv">
            <el-input style="width:40%" class="searchinputtab" v-model="searchSoftwareName" placeholder="搜索证书名称" clearable></el-input>
          </div>
          <el-table :data="filterData2" size="mini" ref="softwareTable" class="tableStyle"
            :header-cell-style="{'background-color': '#F0F2F5',padding:'0px'}" :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}"
             tooltip-effect="light" height="200px" max-height="200px" :fit='true' row-key="certi_id"
             @selection-change="handleSelectionChange1" >
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" label="序号" width="50px"></el-table-column>
            <el-table-column prop="certi_name" label="证书名称"></el-table-column>
            <el-table-column prop="orther_name" label="证书别名"></el-table-column>
            <el-table-column prop="start_time" label="有效期始"></el-table-column>
            <el-table-column prop="end_time" label="有效期止"></el-table-column>
          </el-table>
        </el-form-item>
      </div>
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
  name: "IssuePop",
  data() {
    return {
      dialogFormVisible: false,
      btnvalue1: false,
      labelPosition: "right",
      terminalData:[],
      terminalSelection:[],
      softwareData: [],
      softwareSelection:[],
      
      nodeId:[],
      ids:[],

      searchTerminalIp: "",
      searchSoftwareName: "",
      
      rules: {
        zdname: [{ required: true, message: "请选择终端", trigger: "change" }],
        clname: [
          { required: true, message: "请选择证书", trigger: "change" },
        ],
      },
      ruleForm: {
        zdname: "",
        clname: "",
      },
    };
  },
  computed: {
    filterData:function() {
      return this.terminalData.filter(data => !this.searchTerminalIp || data.ip.toLowerCase().includes(this.searchTerminalIp.toLowerCase()))
    },
    filterData2:function() {
      return this.softwareData.filter(data => !this.searchSoftwareName || data.certi_name.toLowerCase().includes(this.searchSoftwareName.toLowerCase()))
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
            that.nodeId.push(that.terminalSelection[i].nodeId)
          }
          for (var i in that.softwareSelection) {
            that.ids.push(that.softwareSelection[i].certi_id)
          }
          var data = {
            node_ids:that.nodeId,
            ids:that.ids
          }
          request({
            url:"/sys/creatlCertSecondPolicy",
            method: "post",
            data:JSON.stringify(data)
          }).then((response) => {
            var res = response.data
            // console.log(res)
            if (res.status === 500) {
              that.btnvalue1 = false;
            } else {
              that.dialogFormVisible = false;
              that.$message({ message: "操作成功!",type: "success",showClose: true,});
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
      this.ruleForm.zdname = "1";
      this.ruleForm.clname = "1";
      this.btnvalue1 = false;
      this.searchTerminalIp = "";
      this.searchSoftwareName = "";
      this.nodeId = [],
      this.ids = [],
      this.terminalSelection = []
      this.softwareSelection = []
      // 加载终端列表
      request({url: "/LNodeList",method: "post",
        data: {
          condition: "",
          firstTime: "",
          lastTime: "",
          orderBy: "installer_time desc",
          // system_type: "1",
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

      //加载证书列表
      request({url: "/sys/LCertSecondList",method: "post",
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
            value.start_time = timeToZh(value.start_time);
            value.end_time = timeToZh(value.end_time);
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
    handleSelectionChange (val) { // 终端多选
      var that = this
      // console.log(val)
      if(val) {
        that.terminalSelection = val
        that.ruleForm.zdname = "1"
        that.btnvalue1 = false;
      }
    },
    handleSelectionChange1 (val) {// 证书多选
      var that = this
      // console.log(val)
      if(val) {
        that.softwareSelection = val
        that.ruleForm.clname = "1"
        that.btnvalue1 = false;
      }
    }
  },
};
</script>

<style scoped>
.tableStyle {
  width: 100%;
  font-size:14px;
  border:1px solid #F0F2F5;
  margin-top: 10px;
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
</style>
