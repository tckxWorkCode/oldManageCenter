<template>
  <div class="dialogStyle">
    <div class="title">
      <span>启动度量详情</span>
      <span class="closeBtn" @click="closeDialog"><i class="el-icon-close"></i></span>
    </div>
    <div class="terminalInfo"> 
      <img class="terminalImg" src="@/assets/terminal.png" alt="">
      <span>{{this.rowMessage.ip}}</span>
        <img class="questionImg" src="@/assets/question.png" title="网络地址">
    </div>
    <div class="container">
      <el-table :data="tableData" stripe border tooltip-effect="light" 
        :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
        :cell-style="{padding:'0px',color: 'rgba(0, 0, 0, 0.9)'}"
        style="font-size:14px;border:1px solid #F0F2F5">
        <template slot="empty">
          <div>暂无数据</div>
        </template>
        <el-table-column type="index" label="序号" width="50px"></el-table-column>
        <el-table-column prop="name" label="度量对象名称" min-width="200%"></el-table-column>
        <el-table-column prop="stage" label="度量阶段" min-width="100%">
          <template slot-scope="scope">
            <span v-if="scope.row.stage >= 0 && scope.row.stage <= 999">TPCM及度量加载器(BIOS,UBOOT)及前期固件验证</span>
            <span v-else-if="scope.row.stage >= 1000 && scope.row.stage <= 1999">加载器加载驱动、配置、操作系统或二级加载器(GRUB)</span>
            <span v-else-if="scope.row.stage >= 2000 && scope.row.stage <= 2999">二级加载器(GRUB)加载驱动、配置、操作系统</span>
            <span v-else-if="scope.row.stage >= 3000">操作系统加载驱动、配置、服务程序</span>
          </template>
        </el-table-column>
        <el-table-column prop="hash" label="hash" min-width="200%"></el-table-column>
        <el-table-column prop="time" label="时间" min-width="100%"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
export default {
  name: "MeasureDetails",
  props:{
    rowMessage: {
      type: Object,
    }
  },
  data() {
    return {
      tableData: [],
      emptytxt:"",
    };
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.tableData=[]
      var that = this;
      that.dialogFormVisible = true;
      request({
        url: "/sec/lBMeasureList?node_id=" +this.rowMessage.nodeId,
        method: "post",
      }).then((response) => {
        var res = response.data
        // console.log(res);
        if(res.data) {
          res.data.map(function(value,index) {
            value.time = timeToZh(value.time);
          })
          that.tableData = res.data
          that.total = res.total
        }
        if(res.total ==0) { that.emptytxt = true} 
        else { that.emptytxt = false}
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
