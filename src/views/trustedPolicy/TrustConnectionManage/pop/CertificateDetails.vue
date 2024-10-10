<template>
<div class="dialogStyle">
    <div class="title">
      <span>证书详情</span>
      <span class="closeBtn" @click="closeDialog"><i class="el-icon-close"></i></span>
    </div>
    <div class="terminalInfo"> 
      <img class="terminalImg" src="@/assets/terminal.png" alt="">
      <span>{{this.rowMessage.ip}}</span>
        <img class="questionImg" src="@/assets/question.png" title="网络地址">
    </div>
    <div class="container">
      <el-table row-key="id" ref="terminalTable" size="small" max-height="50vh" 
      :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
      :cell-style="{padding:'0px',color: 'rgba(0, 0, 0, 0.9)'}"
      style="font-size:14px;border:1px solid #F0F2F5" :data="tableData2">
        <template slot="empty">
          <div>暂无数据</div>
        </template>
        <el-table-column type="index" label="序号" width="50px"></el-table-column>
        <el-table-column prop="lCertTpcm.nodeName" label="终端名称" min-width="100%"></el-table-column>
        <el-table-column prop="lCertTpcm.ip" label="网络地址" min-width="100%"></el-table-column>
        <el-table-column prop="lCertTpcm.certiName" label="证书名称" min-width="140%"></el-table-column>
        <el-table-column prop="lCertTpcm" label="有效期" min-width="110%">
          <template slot-scope="props">
            <span >{{props.row.lCertTpcm.startTime}}</span>
            <br>
            <span>{{props.row.lCertTpcm.endTime}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
export default {
  name: "CertificateDetails",
  props:{
    rowMessage: {
      type: Object,
    }
  },
  data() {
    return {
      tableData2: [],
      nodeId:'',
    };
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      var that = this;
      request({
        url: "/sec/trustCertDetail?node_id=" + this.rowMessage.nodeId,method: "post",
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
        that.$refs.terminalTable.clearSelection();
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
  padding: 20px 40px;
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
</style>

