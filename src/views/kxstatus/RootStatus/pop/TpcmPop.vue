<template>
  <div class="dialogStyle">
    <div class="title">
      <span>TPCM详情</span>
      <span class="closeBtn" @click="closeDialog"><i class="el-icon-close"></i></span>
    </div>
    <div class="terminalInfo"> 
      <img class="terminalImg" src="@/assets/terminal.png" alt="">
      <span>{{this.rowMessage.nodeIp}}</span>
        <img class="questionImg" src="@/assets/question.png" title="网络地址">
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
export default {
  name: "TpcmPop",
  props:{
    rowMessage: {
      type: Object,
    }
  },
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    this.loadData()
  },
  methods: {
    intToByte(number) {
      var bytes = []
      var i=4
      // do {
      //   bytes[i++] = number &(255)
      //   number = number >> 8;
      // } while (i<length) 
      do {
        bytes[i--] =  number &(255)
        number = number >> 8;
      }while (i)
      // console.log(bytes.join("."))
      return bytes.join(".").slice(1)
    },
    loadData() {
      // console.log(this.rowMessage)
      var that = this;
      request({
        url: "/sec/lTpcmAndTcmInfo?id=" + this.rowMessage.id,
        method: "post",
      }).then((response) => {
        var res = response.data
        // console.log(res);
        that.tableData.splice(0, that.tableData.length);
        if (res.object) {
          var value = res.object
          value.beHostTime = timeToZh(value.beHostTime);
          if(value.beBootTrustState =="0") { value.beBootTrustState = "可信"
          } else if(value.beBootTrustState =="1") {  value.beBootTrustState = "不可信"
          } else if(value.beBootTrustState =="2") { value.beBootTrustState = "未度量"
          } else { value.beBootTrustState =  value.beBootTrustState}

          if(value.beTpcmType =="1") { value.beTpcmType = "主核"
          } else if(value.beTpcmType =="2") {  value.beTpcmType = "附加核"
          } else if(value.beTpcmType =="3") { value.beTpcmType = "模拟"
          } else if(value.beTpcmType =="5") { value.beTpcmType = "外置"
          } else { value.beTpcmType =  value.beTpcmType}

          if(value.beSrkGenerated =="0") { value.beSrkGenerated = "未生成"
          } else { value.beSrkGenerated =  "已生成"}

          that.tableData.push(
            { name: "获取时间", value: value.beHostTime,},
            { name: "已处理命令数量", value: value.beCmdHandled,},
            { name: "待处理命令数量", value: value.beCmdPending,},
            { name: "错误命令数量", value: value.beCmdErrorParam,},
            { name: "拒绝接收命令数量", value: value.beCmdErrorRefused,},
            { name: "完整性基准库有效条数", value: value.beFileIntegrityValid,},
            { name: "完整性基准库总条数", value: value.beFileIntegrityTotal,},
            { name: "启动基准库条数", value: value.beBootMeasureRefBumber,},
            { name: "动态度量基准库条数", value: value.beDynamicMeasureRefBumber,},
            { name: "管理员证书数量", value: value.beAdminCertNumber,},
            { name: "信任的证书数量", value: value.beTrustedCertNumber,},
            { name: "启动次数", value: value.beBootTimes,},
            { name: "动态度量次数", value: value.beDmeasureTimes,},
            { name: "程序启动度量次数", value: value.beFileIntegrityMeasureTimes,},
            { name: "通知次数", value: value.beFileNotifyTimes,},
            { name: "TPCM类型", value: value.beTpcmType,},
            { name: "总内存(字节)", value: value.beTpcmTotalMem,},
            { name: "可用内存(字节)", value: value.beTpcmAvailableMem,},
            { name: "存储空间(字节)", value: value.beTpcmNvsapceSize,},
            { name: "可用存储空间(字节)", value: value.beTpcmNvsapceAvailbleSize,},
            { name: "启动可信状态", value: value.beBootTrustState,},
            { name: "可信操作系统版本号", value: this.intToByte(value.beTrustOsVersion),},
            { name: "CPU基础固件版本号", value: this.intToByte(value.beCpuFirmwareVersion),},
            { name: "BIOS固件版本号", value: this.intToByte(value.beBiosFirmwareVersion),},
            { name: "TPCM版本号", value: this.intToByte(value.beTpcmFirmwareVersion),},
            { name: "CPU数量", value: value.beTpcmCpuNumber,},
            { name: "根存储密钥是否生成", value: value.beSrkGenerated,}
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
</style>
