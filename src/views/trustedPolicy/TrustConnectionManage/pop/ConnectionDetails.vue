<template>
  <div class="dialogStyle">
    <div class="title">
      <span>可信连接详情</span>
      <span class="closeBtn" @click="closeDialog"><i class="el-icon-close"></i></span>
    </div>
    <div class="terminalInfo"> 
      <img class="terminalImg" src="@/assets/terminal.png" alt="">
      <span>{{this.rowMessage.ip}}</span>
        <img class="questionImg" src="@/assets/question.png" title="网络地址">
    </div>
    <div class="container">
      <div style="text-align:center">
        <img v-if="emptytxt" src="@/assets/nodata.png" />
      </div>
      <div class="rowStyle" v-for="(item, index) in tableData" :key="index">
        <span class="itemType">{{ item.name }}</span>
        <span class="itemValue">{{ item.value }}</span>
      </div>
      <div class="tableContainer">
        <el-divider></el-divider>
        <el-table row-key="id" ref="terminalTable" size="small" border style="font-size:14px" :data="exceptions">
          <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
          <el-table-column prop="" label="协议" align="center" min-width="100%">
            <template slot-scope="props">
              <span v-if="props.row.protocol == '1'">TCP</span>
              <span v-else-if="props.row.protocol == '2'">UDP</span>
              <span v-if="props.row.protocol == '0'">TCP/UDP</span>
            </template>
          </el-table-column>
          <el-table-column prop="remote_ip" label="对端IP" align="center" min-width="110%"></el-table-column>
          <el-table-column prop="remote_port" label="对端端口" align="center" min-width="100%"></el-table-column>
          <!-- <el-table-column prop="local_ip" label="本地IP" align="center" min-width="110%"></el-table-column> -->
          <el-table-column prop="local_port" label="本地端口" align="center" min-width="100%"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
export default {
  name: "ConnectionDetails",
  props:{
    rowMessage: {
      type: Object,
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 15,
      total: 0,
      tableData: [],
      exceptions:[],
      emptytxt:"",
    };
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      var that = this;
      that.dialogFormVisible = true;
      request({
        url: "/sec/selectLinkByNodeId",method: "post",
        data: {
          node_id:this.rowMessage.nodeId,
        },
      }).then((response) => {
        var res = response.data
        // console.log(res);
        that.tableData.splice(0, that.tableData.length);
        if (res.object) {
          that.emptytxt = false
          var value = res.object
          if(value.control_mode =="0") { value.control_mode = "不控制"
          } else if(value.control_mode =="1") {  value.control_mode = "全控制"
          } else {value.control_mode = ""}
          // if(value.encrypt_auth =="0") { value.encrypt_auth = "不加密"
          // } else if(value.encrypt_auth =="1") {  value.encrypt_auth = "加密"
          // } else {value.encrypt_auth = ""}
          if(value.server_testify =="0") { value.server_testify = "不附加"
          } else if(value.server_testify =="1") {  value.server_testify = "附加"
          } else {value.server_testify = ""} 
          if(value.report_auth_fail =="0") { value.report_auth_fail = "不汇报"
          } else if(value.report_auth_fail =="1") {  value.report_auth_fail = "汇报"
          } else {value.report_auth_fail = ""} 
          if(value.report_session =="0") { value.report_session = "不汇报"
          } else if(value.report_session =="1") {  value.report_session = "汇报"
          } else {value.report_session = ""} 
          if (value.be_session_expire =="0") { value.be_session_expire = "30"}
          that.tableData.push(
            { name: "控制模式", value: value.control_mode,},
            { name: "管理中心IP", value: value.server_ip,},
            { name: "管理中心端口", value: value.server_port,},
            { name: "报文加密认证", value: "加密",},
            { name: "附加管理中心证实", value: value.server_testify,},
            { name: "汇报可信认证失败", value: value.report_auth_fail,},
            { name: "汇报会话", value: value.report_session,},
            { name: "会话过期时间", value: value.be_session_expire + "分钟",},
          );
          that.exceptions = res.object.exceptions
        } else {
          that.emptytxt = true
        }
      });
    },
    closeDialog () {
      this.$emit("closeDialog")
    },
  },
};
</script>

<style scoped>
.title {
  margin: 20px;
  font-size: 20px;
  color: #000;
  font-family: "Microsoft YaHei";
}
.terminalInfo {
  color: #000;
  margin: 24px;
  font-size: 24px;
}
.closeBtn {
  color: #B4B4B4;
  font-weight: 800!important;
  position: absolute;
  right: 20px;
  cursor: pointer;
}
.terminalImg {
  vertical-align: middle;
  margin: 16px;
}
.questionImg {
  margin-left: 8px;
}

.container {
  height: calc(100vh - 200px);
  overflow-y: auto;
}
.rowStyle {
  margin: 0 40px;
  position: relative;
}
.itemType {
  color: #676767;
  height: 35px;
  line-height: 35px;
  text-align: left;
  padding: 0px 10px;
}
.itemValue {
  color: #000;
  position: absolute;
  right: 0px;
  height: 35px;
  line-height: 35px;
  text-align: right;
  padding: 0px 10px;
}
.tableContainer {
  padding: 20px 30px;
}
</style>

