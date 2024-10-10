<template>
  <!--新建开始-->
  <el-dialog title="新增证书" top="5vh" width="75%" :visible.sync="dialogFormVisible" @closed="diaclose" :close-on-click-modal="false">
      <div style="float:left;width:350px;border-right:1px solid #ddd;padding-right:20px;margin-right:20px">
        <div style="margin-bottom：10px">
          <div style="margin-bottom:8px;color:#000;font-size:14px">选择终端：</div>
          <el-input v-model="searchTerminalIp" placeholder="搜索网络地址" clearable size="small"></el-input>
        </div>
        <el-table :data="filterData" ref="terminalTable" class="terminalTable" max-height="50vh" size="small"
         :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}">
          <template slot="empty">
            <div>暂无数据</div>
          </template>
          <el-table-column width="40px" class-name="radioClass">
            <template  slot-scope="scope">
			    		<el-radio  :label="scope.$index" class="itemRadio" v-model="radio" @change.native="getCurrentSelect(scope.row,scope.$index)"></el-radio>
			    	</template>
          </el-table-column>
          <el-table-column prop="ip" label="网络地址" min-width="110%" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="终端名称" min-width="110%" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <div class="allowProTrace">
        <div class="allowLeft">
          <div class="subtitle">可选择证书 (共<span>{{this.credentialsData.length}}</span>条)，已选证书 (<span>{{this.certSelection.length}}</span>) 条</div>
          <el-table :data="credentialsData" ref="credentialsTable" tooltip-effect="light"
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

      radio:"",
      categoryIndex: -1,
      terminalData:[],
      searchTerminalIp: "",
      terminalSelection:{},

      certData:[],
      credentialsData:[],
      certSelection:[],
      selectProIden: false,
      repeat:false,
      add:false,
      nodeId:'',
      nodeIp:'',
      nodeName:''
    };
  },
  computed: {
    filterData:function() {
      return this.terminalData.filter(data => !this.searchTerminalIp || data.ip.includes(this.searchTerminalIp))
    }
  },
  methods: {
    submitForm() {
      var that = this;
      var arr = []
      if (Object.keys(that.terminalSelection).length == 0) return that.$message.warning("请选择终端!")
      that.certSelection.map(function(value,index) {
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
        node_ip:that.terminalSelection.ip,
        node_id:that.terminalSelection.nodeId,
        node_name:that.terminalSelection.name,
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
          that.certSelection=[]
        }
      });
    },
    diaOpen() {
      var that = this;
      this.radio = ""
      this.categoryIndex = -1
      this.searchTerminalIp = "";
      this.searchTableData = "";
      this.terminalSelection = {}
      this.dialogFormVisible = true;
      this.btnf1 = false;
      this.selectProIden = false
      this.repeat = false
      
      request({url: "/LNodeList",method: "post",
        data: {
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
      this.loadData()
    },
    loadData() {
      var that = this
      //证书列表
      request({url: "/sec/lCertTpcmList",method: "post",
        data: { searchPage: 1, searchSize: 10000, system_type: 1}
      }).then((response) => {
        var res = response.data
        // console.log(res)
        if(res.list) {
          that.total = res.total
          that.credentialsData = res.list
        }
      });
    },
    diaclose() {
      this.dialogFormVisible = false;
    },
    handleSelectionChange (val) {
      // console.log(val)
      this.certSelection = val
      this.btnf1 = false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 选择终端
    getCurrentSelect(item,index) {
      var that = this
      this.$refs.credentialsTable.clearSelection()
      this.categoryIndex = index;
      this.terminalSelection = item;
      this.btnf1 = false;
      //已选证书
      request({ url: "/sec/trustCertDetail?node_id=" + item.nodeId,method: "post",
      }).then((response) => {
        var res = response.data
        // console.log(res)
        that.certData = res.data;
        that.credentialsData.forEach((_v, _i) => {
          that.certData.forEach((v,i) => {
            if (v.cert_id == _v.certiId) {
              this.$refs.credentialsTable.toggleRowSelection(_v,true)
            }
          })
        })
      });
    },
  },
};
</script>

<style scoped>
.terminalTable {
  font-size: 14px;margin-top:10px
}

.terminalTable >>> .el-table__row>td{
  /* 去除表格线 */
  border: none;
}

.terminalTable >>> .el-table::before{
  /* 去除下边框 */
  height: 0;
}
.terminalTable >>>.radioClass>.cell {
  height: 23px;
}
.itemRadio>>>.el-radio__label {
  display: none;
}
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
