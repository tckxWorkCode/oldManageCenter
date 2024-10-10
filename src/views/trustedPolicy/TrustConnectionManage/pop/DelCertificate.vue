<template>
  <el-dialog title="删除证书" top="10vh" width="48%" :visible.sync="dialogFormVisible" @closed="diaclose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="100px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <div class="itemw">
        <el-form-item class="zdclass" prop="zdname" label="终端信息：">
          <div class="searchinputdiv">
            <el-input style="width:50%" v-model="searchTableData" placeholder="搜索证书名称" clearable></el-input>
          </div>
          <el-table row-key="id" ref="terminalTable" size="small" max-height="50vh" @selection-change="handleSelectionChange" 
            :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
            :cell-style="{padding:'0px',color: 'rgba(0, 0, 0, 0.9)'}" 
             style="margin-top:10px;font-size:14px;border:1px solid #F0F2F5" :data="tableData2.filter(data => !searchTableData || data.lCertTpcm.certiName.includes(searchTableData))">
            <el-table-column reserve-selection type="selection" align="center" width="50"></el-table-column>
            <el-table-column type="index" label="序号" width="50px"></el-table-column>
            <el-table-column prop="lCertTpcm.certiName" label="证书名称" min-width="150%"></el-table-column>
            <el-table-column prop="lCertTpcm.certiPath" label="证书路径" min-width="150%"></el-table-column>
            <el-table-column prop="lCertTpcm.createTime" label="创建时间" min-width="70%"></el-table-column>
            <el-table-column prop="lCertTpcm.startTime" label="有效期始" min-width="70%"></el-table-column>
            <el-table-column prop="lCertTpcm.endTime" label="有效期止" min-width="70%"></el-table-column>
          </el-table>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="canBtn" @click="dialogFormVisible = false">取 消</el-button>
      <el-button size="small" class="sureBtn" :disabled="btnf1" @click="submitForm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
export default {
  name: "DelCertificate",
  data() {
    return {
      height: 0,
      btnf1: false,
      searchTableData: "",
      tableData2: [],
      dialogFormVisible: false,
      labelPosition: "right",
      rules: {
        zdname: [{ required: true, message: "请选择终端", trigger: "change" }],
      },
      ruleForm: {
        zdname: "",
      },
      terminalSelection:[],
      nodeId:'',
      nodeIp:'',
      nodeName:''
    };
  },
  methods: {
    submitForm(formName) {
      var that = this;
      if(that.terminalSelection.length === 0) {
        that.ruleForm.zdname = ''
      } else {
        that.ruleForm.zdname = "1";
      }
      var selData = []
      that.terminalSelection.map (item => {
        // console.log(item)
        selData.push({cert_id:item.cert_id})
      })
      // console.log(selData)
      that.$refs[formName].validate((valid) => {
        if (valid) {
          var datas = {
            node_ip:that.nodeIp,
            node_id:that.nodeId,
            node_name:that.nodeName,
            certs:selData,
            status:2
          }
          // console.log(datas)
          request({
            url: "sec/delLTrustLinkCert",
            method: "post",
            data: datas,
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
              that.dialogFormVisible = false;
              that.$message({ message: "操作成功!",type: "success", showClose: true,});
              that.$emit("success");
            } else {
              that.btnf1 = true;
              that.terminalSelection=[]
              // that.$message({ message: res.errormessage, type: "error", showClose: true,});
            }
          });
        } else {
          that.btnf1 = false;
        }
      });
    },
    handleSelectionChange (val) {
      var that = this
      // console.log(val)
      if(val) {
        that.terminalSelection = val
        that.ruleForm.zdname = "1"
      }
    },
    diaOpen(row) {
      // console.log(row)
      var that = this;
      this.dialogFormVisible = true;
      this.btnf1 = false;
      this.searchTableData = "";
      this.nodeId = row.nodeId,
      this.nodeIp = row.ip,
      this.nodeName = row.name,
      this.terminalSelection=[]
      request({
        url: "/sec/trustCertDetail?node_id=" + row.nodeId,method: "post",
      }).then((response) => {
        var res = response.data
        // console.log(res)
        res.data.map(function(value,index) {
          value.lCertTpcm.createTime = timeToZh(value.lCertTpcm.createTime);
          value.lCertTpcm.startTime = timeToZh(value.lCertTpcm.startTime);
          value.lCertTpcm.endTime = timeToZh(value.lCertTpcm.endTime);
        })
        that.tableData2 = res.data;
      });
      that.$nextTick(function () {
        that.$refs.ruleForm.clearValidate();
        that.$refs.terminalTable.clearSelection();
      });
    },
    diaclose() {
      var that = this;
      that.dialogFormVisible = false;
      that.terminalSelection =[]
    },
  },
};
</script>

<style scoped>
.searchcol {
  width: 100% !important;
}
.uploadItem .el-input {
  float: left;
}
.uploadItem .el-radio-button {
  float: left;
}
.uploadItem .el-input.putml {
  float: right;
}
.itemw {
  position: relative;
}
.wrapTable {
  overflow: hidden;
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
