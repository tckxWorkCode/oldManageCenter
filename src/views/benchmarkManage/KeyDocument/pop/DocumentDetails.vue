<template>
  <div class="dialogStyle">
    <div class="title">
      <span>关键文件度量详情</span>
      <span class="closeBtn" @click="closeDialog"><i class="el-icon-close"></i></span>
    </div>
    <div class="terminalInfo"> 
      <img class="terminalImg" src="@/assets/terminal.png" alt="">
      <span>{{this.rowMessage.nodeIp}}</span>
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
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
export default {
  name: "DocumentDetails",
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
      var that = this;
      // console.log(this.rowMessage)
    //   request({
    //     url: '/sec/lDMeraureInfo?nodeId='+this.rowMessage.nodeid,
    //     method: "post",
    //   }).then((response) => {
    //     var res = response.data
    //     console.log(res);
    //     that.tableData.splice(0, that.tableData.length);
    //     if (res.object) {
    //       that.emptytxt = false
    //       var value = res.object
          if(this.rowMessage.status =="0") { this.rowMessage.status = "采集中"
          } else if(this.rowMessage.status =="1") {  this.rowMessage.status = "已采集"
          } else if(this.rowMessage.status =="2") { this.rowMessage.status = "采集失败"
          } else if(this.rowMessage.status =="3") {  this.rowMessage.status = "下发中"
          } else if(this.rowMessage.status =="4") { this.rowMessage.status = "下发成功"
          } else if(this.rowMessage.status =="5") {  this.rowMessage.status = "下发失败"
          } else if(this.rowMessage.status =="6") { this.rowMessage.status = "删除中"
          } else if(this.rowMessage.status =="7") {  this.rowMessage.status = "删除成功"
          } else if(this.rowMessage.status =="8") { this.rowMessage.status = "删除失败"
          }
          this.rowMessage.createTime = timeToZh(this.rowMessage.createTime);
          this.rowMessage.collectTime = timeToZh(this.rowMessage.collectTime);
          that.tableData.push(
            // {name: "状态",value: value.status,},
            {name: "终端名称",value: this.rowMessage.nodeName,},
            {name: "状态",value: this.rowMessage.status,},
            {name: "文件路径",value: this.rowMessage.path},
            {name: "HASH",value: this.rowMessage.hash},
            {name: "创建时间",value: this.rowMessage.createTime,},
            {name: "采集时间",value: this.rowMessage.collectTime,},
          );
        // } else {
        //   that.emptytxt = true
        // }
    //   });
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
.rowStyle:hover {
  height: 70px;
  overflow: visible;
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
  overflow: hidden;
  text-overflow: ellipsis;
  width: 280px;
}
.itemValue:hover {
  color: #000;
  position: absolute;
  right: 0px;
  height: 70px;
  line-height: 35px;
  text-align: right;
  padding: 0px 10px;
  overflow: visible;
  width: 280px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
