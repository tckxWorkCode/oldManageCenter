<template>
  <div class="dialogStyle">
    <div class="title">
      <span>可信报告详情</span>
      <span class="closeBtn" @click="closeDialog"><i class="el-icon-close"></i></span>
    </div>
    <div class="terminalInfo"> 
      <img class="terminalImg" src="@/assets/terminal.png" alt="">
      <span>{{this.rowMessage.nodeIp}}</span>
      <img class="questionImg" src="@/assets/question.png" title="网络地址">
      <circle-rate :percentNum="rate" class="circle"></circle-rate>
    </div>
    <div class="container">
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
import circleRate from "./circle.vue"
export default {
  name: "TpcmPop",
  props:{
    rowMessage: {
      type: Object,
    }
  },
  components:{ circleRate },
  data() {
    return {
      tableData: [],
      rate:''
    };
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      var that = this;
      request({
        url: "/sec/lTrustReportInfo?id=" + this.rowMessage.id,
        method: "post",
      }).then((response) => {
        var res = response.data
        // console.log(res);
        that.tableData.splice(0, that.tableData.length);
        if (res.object) {
          var value = res.object
          value.beTpcmReportTime = timeToZh(value.beTpcmReportTime);
          that.rate = value.beEval
          if(value.beBootMeasureResult =="0") { value.beBootMeasureResult = "可信"
          } else if(value.beBootMeasureResult =="1") {  value.beBootMeasureResult = "不可信"
          } else if(value.beBootMeasureResult =="2") { value.beBootMeasureResult = "未度量"
          }//启动度量
          if(value.status =="0") { value.status = "成功"
          } else if(value.status =="1") {  value.status = "失败"
          } else if(value.status =="2") { value.status = "证书已过期"
          } else if(value.status =="3") { value.status = "无证书"
          } else if(value.status =="4") { value.status = "证书不在有效期内"
          } else if(value.status =="5") { value.status = "无证书"
          }//验签状态
          that.tableData.push(
            { name: "非法程序执行次数", value: value.beIlegalProgramLoad,},
            { name: "非法动态库加载次数", value: value.beIlegalLibLoad,},
            { name: "非法内核模块加载次数", value: value.beIlegalKernelModuleLoad,},
            { name: "非法文件访问次数", value: value.beIlegalFileAccess,},
            { name: "非法设备访问次数", value: value.beIlegalDeviceAccess,},
            { name: "非法网络访问次数", value: value.beIlegalNetworkInreq,},
            { name: "程序代码段度量失败次数", value: value.beProcessCodeMeasureFail, },
            { name: "内核代码段度量失败次数", value: value.beKernelCodeMeasureFail,},
            { name: "内核关键数据度量失败次数", value: value.beKernelDataMeasureFail,},
            { name: "错误通知次数", value: value.beNotifyFail,},
            { name: "启动度量", value: value.beBootMeasureResult,},
            { name: "启动次数", value: value.beBootTimes,},
            { name: "内部时钟计数", value: value.beTpcmTime,},
            { name: "上报时间", value: value.beTpcmReportTime,},
            { name: "日志条数", value: value.beLogNumber,},
            { name: "验签状态", value: value.status,}
          );
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
  margin: 24px 40px 24px 24px;
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
.circle {
  float: right;
  width: 100px;
  height: 100px;
  background-color: #eeeeee;
  border-radius: 50%;
  position: relative;
}
.littleCircle {
  width: 90px;
  height: 90px;
  text-align: center;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  top: 5px;
  left: 5px;
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
</style>