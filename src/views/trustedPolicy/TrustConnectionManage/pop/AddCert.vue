<template>
  <!--新建开始-->
  <el-dialog title="新增证书" top="5vh" width="35%" :visible.sync="dialogFormVisible" @closed="diaclose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="90px" ref="ruleForm" size="small">
      <el-form-item prop="nodeIp" label="网络地址：">
        <el-input style="width:40%" v-model="nodeIp" clearable disabled>{{nodeIp}}</el-input>
      </el-form-item>
      <div class="allowProTrace">
        <div class="allowLeft">
          <div class="subtitle">可选择证书 (共<span>{{this.credentialsData.length}}</span>条)，已选证书 (<span>{{this.terminalSelection.length}}</span>) 条</div>
          <div class="searchinputdiv">
            <el-input v-model="searchTableData" placeholder="搜索IP" clearable></el-input>
          </div>
          <el-table :data="credentialsData.filter(data => !searchTableData || data.ip.includes(searchTableData))" ref="credentialsTable" tooltip-effect="light"
             @selection-change="handleSelectionChange" :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
           size="small" style="width: 100%;font-size: 14px;border:1px solid #F0F2F5" height="50vh" :fit='true' row-key="certiId">
            <el-table-column type="selection" width="50" align="center" :reserve-selection="true"></el-table-column>
            <el-table-column type="index" label="序号" width="50px"></el-table-column>
            <el-table-column prop="name" label="终端名称" min-width="100%"></el-table-column>
            <el-table-column prop="ip" label="网络地址" min-width="100%"></el-table-column>
            <el-table-column prop="certiName" label="证书名称" min-width="140%"></el-table-column>
          </el-table>
        </div>
        <div style="margin-top:10px;text-align:right">
          <div class="selectProIden" v-if="selectProIden == true">请选择证书信息</div>
          <div class="selectProIden" v-if="repeat == true" >该证书已添加，请勿重复添加</div>
        </div>
      </div>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="canBtn" @click="dialogFormVisible = false">取 消</el-button>
      <el-button size="small" class="sureBtn" :disabled="btnf1" @click="submitForm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
export default {
  name: "ConfigProcessTrace",
  data() {
    return {
      searchTableData: "",
      btnf1: false,
      dialogFormVisible: false,
      labelPosition: "right",
      emptytxt:"",
      certData:[],
      credentialsData:[],
      terminalSelection:[],
      selectProIden: false,
      repeat:false,
      add:false,
      nodeId:'',
      nodeIp:'',
      nodeName:''
    };
  },
  methods: {
    submitForm() {
      var that = this;
      var arr = []
      that.terminalSelection.map(function(value,index) {
        // console.log(value)
        arr.push({
          cert_id: value.certiId,
          lCertTpcm:{
            certiId:value.certiId,
            certiName:value.certiName,
            ip:value.ip,
            nodeName:value.name,
          },
        })
      })
      var datas = {
        node_ip:that.nodeIp,
        node_id:that.nodeId,
        node_name:that.nodeName,
        certs:arr,
        status:0
      }
      // console.log(datas)
      request({ url: "/sec/creatLTrustLinkCert", method: "post", data: datas,
      }).then((response) => {
        var res = response.data
        if (res.status === 0) {
          that.dialogFormVisible = false;
          that.$message({ message: "操作成功!",type: "success", showClose: true,});
          that.$emit("success");
        } else {
          that.btnf1 = true;
          that.terminalSelection=[]
        }
      });
    },
    diaOpen(row) {
      // console.log(row)
      var that = this;
      this.searchTableData = "";
      this.dialogFormVisible = true;
      this.btnf1 = false;
      this.selectProIden = false
      this.repeat = false
      this.nodeId = row.nodeId,
      this.nodeIp = row.ip,
      this.nodeName = row.name
      
      //已选证书
      request({ url: "/sec/trustCertDetail?node_id=" + row.nodeId,method: "post",
      }).then((response) => {
        var res = response.data
        // console.log(res)
        that.certData = res.data;
        // console.log(111,that.certData)
          //证书列表
        request({url: "/sec/lCertTpcmList",method: "post",data: { searchPage: 1, searchSize: 10000,}
        }).then((response) => {
          var res = response.data
          // console.log(res)
          if(res.list) {
            that.total = res.total
            that.credentialsData = res.list
            this.$nextTick(function() {
              that.certData.forEach((v,i) => {
                that.credentialsData.forEach((_v, _i) => {
                  if (v.cert_id == _v.certiId) {
                    this.$refs.credentialsTable.toggleRowSelection(_v,true)
                  }
                })
              })
            })
          }
        });
      });
    },
    diaclose() {
      this.dialogFormVisible = false;
    },
    handleSelectionChange (val) {
      // console.log(val)
      this.terminalSelection = val
      this.btnf1 = false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.allowProTrace {
  height: 60vh;
  display: flex;
}
.subtitle {
  font-size: 14px;
  margin: 15px;
}
.allowLeft {
  margin: 0 15px;
  width: 95%;
}
.allowRight {
  width: 48%;
  margin-right: 24px;
}
.middle {
  margin: 16px;
  align-self: center;
}
.middleIcon {
  width: 31px;
  height: 31px;
  line-height: 31px;
  text-align: center;
  color: #ffffff;
  background-color: #1ac492;
  margin-bottom: 20px;
  cursor: pointer;
}
.middleIcon:active {
  border: 1px solid #1ac492;
  cursor: pointer;
}
.middleIcon:visited {
  color: #fff;
  background-color: #1ac492;
  border: 1px solid #1ac492;
  cursor: pointer;
}
.selectProIden {
  color: #f56c6c;
}
.searchinputdiv >>>.el-input .el-input__inner {
  border-radius: 0;
}
.searchinputdiv >>>.el-input .el-input__inner:focus {
  border-color: #1ac492;
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
