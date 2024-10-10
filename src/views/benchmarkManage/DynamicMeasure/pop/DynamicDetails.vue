<template>
  <div class="dialogStyle">
    <div class="title">
      <span>环境动态度量详情</span>
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
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
export default {
  name: "DynamicDetails",
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
      request({
        url: '/sec/lDMeraureInfo?nodeId='+this.rowMessage.nodeid,
        method: "post",
      }).then((response) => {
        var res = response.data
        // console.log(res);
        that.tableData.splice(0, that.tableData.length);
        if (res.object) {
          that.emptytxt = false
          var value = res.object
          if(value.systemCallSwitch =="0") { value.systemCallSwitch = "关闭"
          } else if(value.systemCallSwitch =="1") {  value.systemCallSwitch = "开启"
          } 
          if(value.kernalCodeSegSwitch =="0") { value.kernalCodeSegSwitch = "关闭"
          } else if(value.kernalCodeSegSwitch =="1") {  value.kernalCodeSegSwitch = "开启"
          }
          if(value.dmIdtSwitch =="0") { value.dmIdtSwitch = "关闭"
          } else if(value.dmIdtSwitch =="1") {  value.dmIdtSwitch = "开启"
          }
          if(value.moduleListSwitch =="0") { value.moduleListSwitch = "关闭"
          } else if(value.moduleListSwitch =="1") {  value.moduleListSwitch = "开启"
          }
          if(value.filesystemSwitch =="0") { value.filesystemSwitch = "关闭"
          } else if(value.filesystemSwitch =="1") {  value.filesystemSwitch = "开启"
          }
          if(value.networkSwitch =="0") { value.networkSwitch = "关闭"
          } else if(value.networkSwitch =="1") {  value.networkSwitch = "开启"
          }
          if (this.rowMessage.system == 'Linux' ||this.rowMessage.system == 'linux' ) {
            that.tableData.push(
              {name: "系统调用表开关",value: value.systemCallSwitch,},
              {name: "系统调用表类型",value: value.systemCallType,},
              {name: "系统调用表时间间隔",value: value.systemCallInterval + '秒',},
              
              {name: "内核代码段开关",value: value.kernalCodeSegSwitch,},
              {name: "内核代码段类型",value: value.kernalCodeSegType,},
              {name: "内核代码段时间间隔",value: value.kernalCodeSegInterval + '秒',},
              
              {name: "中断描述符开关",value: value.dmIdtSwitch,},
              {name: "中断描述符表类型",value: value.dmIdtType,},
              {name: "中断描述符表时间间隔",value: value.dmIdtInterval + '秒',},
              
              {name: "模块列表开关",value: value.moduleListSwitch,},
              {name: "模块列表类型",value: value.moduleListType,},
              {name: "模块列表时间间隔",value: value.moduleListInterval + '秒',},
              
              {name: "文件系统开关",value: value.filesystemSwitch,},
              {name: "文件系统类型",value: value.filesystemType,},
              {name: "文件系统时间间隔",value: value.filesystemInterval + '秒',},
  
              {name: "网络协议开关",value: value.networkSwitch,},
              {name: "网络协议类型",value: value.networkType,},
              {name: "网络协议时间间隔",value: value.networkInterval + '秒',},
              
            );
          } else {
            that.tableData.push(
              {name: "系统调用表开关",value: value.systemCallSwitch,},
              {name: "系统调用表类型",value: value.systemCallType,},
              {name: "系统调用表时间间隔",value: value.systemCallInterval + '秒',},
              
              {name: "内核代码段开关",value: value.kernalCodeSegSwitch,},
              {name: "内核代码段类型",value: value.kernalCodeSegType,},
              {name: "内核代码段时间间隔",value: value.kernalCodeSegInterval + '秒',},
              
              {name: "中断描述符开关",value: value.dmIdtSwitch,},
              {name: "中断描述符表类型",value: value.dmIdtType,},
              {name: "中断描述符表时间间隔",value: value.dmIdtInterval + '秒',},
              
              {name: "全局描述符开关",value: value.moduleListSwitch,},
              {name: "全局描述符类型",value: value.moduleListType,},
              {name: "全局描述符时间间隔",value: value.moduleListInterval + '秒',},
              
            );
          }
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
.rowStyle:nth-child(3n+4) {
  margin-bottom: 16px;
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
