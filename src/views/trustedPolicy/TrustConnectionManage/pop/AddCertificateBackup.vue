<template>
  <!--新建开始-->
  <el-dialog title="新增证书" top="5vh" width="65%" :visible.sync="dialogFormVisible" @closed="diaclose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="90px" ref="ruleForm" size="small">
      <el-form-item prop="nodeIp" label="网络地址：">
        <el-input style="width:40%" v-model="nodeIp" clearable disabled>{{nodeIp}}</el-input>
      </el-form-item>
      <div class="allowProTrace">
        <div class="allowLeft">
          <div class="subtitle">选择证书 (共<span>{{this.credentialsData.length}}</span>条)</div>
          <div class="searchinputdiv">
            <el-input v-model="searchTableData" placeholder="搜索IP" clearable></el-input>
          </div>
          <el-table :data="credentialsData.filter(data => !searchTableData || data.ip.includes(searchTableData))" ref="credentialsTable" tooltip-effect="light"
             @selection-change="handleSelectionChange"
          :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
           size="small" style="width: 100%;font-size: 14px;border:1px solid #F0F2F5" height="50vh" :fit='true'>
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" label="序号" width="50px"></el-table-column>
            <el-table-column prop="name" label="终端名称" min-width="100%"></el-table-column>
            <el-table-column prop="ip" label="网络地址" min-width="100%"></el-table-column>
            <el-table-column prop="certiName" label="证书名称" min-width="140%"></el-table-column>
          </el-table>
        </div>
        <div class="middle">
          <div class="middleIcon" @click="submitToRight"><i class="el-icon-arrow-right"></i></div>
          <div class="middleIcon" @click="submitToLeft"><i class="el-icon-arrow-left"></i></div>
        </div>
        <div class="allowRight">
          <div class="subtitle">已选证书 (<span>{{this.certData.length}}</span>) 条</div>
          <el-table :data="certData" size="small" ref="ProcessTraceTable" header-align="center" @selection-change="handleSelectionChange1"
           :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
           :cell-style="{padding:'0px'}" style="width: 100%;font-size: 14px;border:1px solid #F0F2F5;" height='calc(50vh + 40px)' :fit='true'>
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
            <el-table-column prop="lCertTpcm.nodeName" label="终端名称" min-width="110%"></el-table-column>
            <el-table-column prop="lCertTpcm.ip" label="网络地址" min-width="110%"></el-table-column>
            <el-table-column prop="lCertTpcm.certiName" label="证书名称" min-width="140%"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="delPT(scope.$index,scope.row)">
                  <i style="color:#FD5517;font-size:18px" class="el-icon-error"></i>
                </el-button>
                <!-- <el-button type="text" v-if="scope.row.add == true" @click="delPT(scope.$index,scope.row)">
                  <i style="color:#FD5517;font-size:18px" class="el-icon-error"></i>
                </el-button> -->
                <!-- <el-button type="text" v-else disabled>
                  <i style="color:#FD5517;font-size:18px" class="el-icon-error"></i>
                </el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top:10px;text-align:right">
            <div class="selectProIden" v-if="selectProIden == true">请选择证书信息</div>
            <div class="selectProIden" v-if="repeat == true" >该证书已添加，请勿重复添加</div>
          </div>
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
      terminalSelection1:[],
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
      var datas = {
        node_ip:that.nodeIp,
        node_id:that.nodeId,
        node_name:that.nodeName,
        certs:that.certData,
        status:0
      }
      // console.log(datas)
      request({
        url: "/sec/creatLTrustLinkCert",
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
      this.nodeName = row.name,
      this.terminalSelection=[]
      request({ url: "/sec/trustCertDetail?node_id=" + row.nodeId,method: "post",
      }).then((response) => {
        var res = response.data
        // console.log(res)
        that.certData = res.data;
      });
      setTimeout(function() {
        //证书列表
        request({url: "/sec/lCertTpcmList",method: "post",data: { searchPage: 1, searchSize: 10000,}
        }).then((response) => {
          var res = response.data
          // console.log(res)
          if(res.list) {
            that.total = res.total
            that.credentialsData = res.list
            if (that.certData.length>0) {
              for (var i = 0; i<that.certData.length; i++) {
                for (var j = 0; j<that.credentialsData.length; j++) {
                  if (that.credentialsData[j].name == that.certData[i].lCertTpcm.nodeName) {
                    that.credentialsData.splice(j,1)
                  }
                }
              }
            }
          }
        });
      },30)
    },
    diaclose() {
      this.dialogFormVisible = false;
      this.terminalSelection = []
    },
    handleSelectionChange (val) {
      // console.log(val)
      this.terminalSelection = val
      if (val) {
        this.selectProIden = false
      } 
      this.repeat = false
    },
    handleSelectionChange1 (val) {
      // console.log(val)
      this.terminalSelection1 = val
    },
    submitToRight() {//确定添加
      var that = this
      // console.log(this.terminalSelection)
      if(this.terminalSelection.length == 0) {
        that.selectProIden = true
      } else {
        that.selectProIden = false
        that.terminalSelection.map((item, index) => {
          that.certData.push({
            cert_id: item.certiId,
            lCertTpcm:{
              certiId:item.certiId,
              certiName:item.certiName,
              ip:item.ip,
              nodeName:item.name,
            },
            add:true
          })
        })
        let deWeightThree = () => {
          let map = new Map();
          for (let item of that.certData) {
              if (!map.has(item.lCertTpcm.certiName)) {
                map.set(item.lCertTpcm.certiName, item);
              } else {
                that.repeat = true
              }
          }
          return [...map.values()];
        }
        that.certData = deWeightThree();
        that.certData = this.compar (this.certData, "certiId")
        // console.log(that.certData)
        for(var i = 0; i < that.credentialsData.length; i++){
          for(var j = 0; j < that.terminalSelection.length; j++){
            if(that.credentialsData[i].certiId === that.terminalSelection[j].certiId){
              that.credentialsData.splice(i,1);
            }
          }
        }
      }
    },
    submitToLeft() {
      var that = this
      // console.log(this.terminalSelection1)
      for(var i = 0; i < that.terminalSelection1.length; i++){
        for(var j = 0; j < that.certData.length; j++){
          if(that.terminalSelection1[i].cert_id === that.certData[j].cert_id){
            that.certData.splice(j,1);
            that.credentialsData.push({
              name:that.terminalSelection1[i].lCertTpcm.nodeName,
              ip:that.terminalSelection1[i].lCertTpcm.ip,
              certiName:that.terminalSelection1[i].lCertTpcm.certiName,
              certiId:that.terminalSelection1[i].cert_id
            })
          }
        }
      }
      that.credentialsData = this.compar (this.credentialsData, "certiId")
      this.terminalSelection1 = []
      // console.log(this.terminalSelection1)
    },
    delPT(index,row) { //删除
      // console.log(row)
      var that = this
      for(var i = 0; i < that.certData.length; i++){
        if(that.certData[i].cert_id === row.cert_id){
          that.certData.splice(i,1);
          that.credentialsData.push({
            name:row.lCertTpcm.nodeName,
            ip:row.lCertTpcm.ip,
            certiName:row.lCertTpcm.certiName,
            certiId:row.cert_id
          })
        }
      }
      that.credentialsData = this.compar (this.credentialsData, "certiId")
    },
    compar(array, key) {
      return array.sort(function (a, b) {
        const x = a[key];
        const y = b[key];
        return ((x<y)?-1:(x>y)?1:0)
      });
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
  width: 48%;
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
