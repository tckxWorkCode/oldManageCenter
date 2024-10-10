<template>
  <div class="dialogStyle">
    <div class="title">
      <span>审计策略详情</span>
      <span class="closeBtn" @click="closeDialog"><i class="el-icon-close"></i></span>
    </div>
    <div class="terminalInfo">
      <img class="terminalImg" src="@/assets/terminal.png" alt="" />
      <span>{{ this.rowMessage.nodeIp }}</span>
      <img class="questionImg" src="@/assets/question.png" title="网络地址" />
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
  props: {
    rowMessage: {
      type: Object,
    },
  },
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      // console.log(this.rowMessage);
      var that = this;
      request({
        url:
          "/aud/log/auditPolicySearchByNodeId?node_id=" +
          this.rowMessage.nodeId,
        method: "post",
      }).then((response) => {
        var res = response.data;
        // console.log(res);
        if (res.status != 500) {
          that.tableData.splice(0, that.tableData.length);
          res.updateTime = timeToZh(res.updateTime);
          if (res.dmeasureType == "1") {
            res.dmeasureType = "成功";
          } else if (res.dmeasureType == "2") {
            res.dmeasureType = "失败";
          } else if (res.dmeasureType == "4") {
            res.dmeasureType = "不审计";
          } else if (res.dmeasureType == "8") {
            res.dmeasureType = "全审计";
          }

          if (res.smeasureType == "1") {
            res.smeasureType = "成功";
          } else if (res.smeasureType == "2") {
            res.smeasureType = "失败";
          } else if (res.smeasureType == "4") {
            res.smeasureType = "不审计";
          } else if (res.smeasureType == "8") {
            res.smeasureType = "全审计";
          }

          if (res.status == "0") {
            res.status = "初始化状态";
          } else if (res.status == "1") {
            res.status = "已生效";
          } else if (res.status == "2") {
            res.status = "下发中";
          } else if (res.status == "3") {
            res.status = "下发失败";
          } else {
            res.status = res.status;
          }
          that.tableData.push(
            { name: "动态度量审计策略", value: res.dmeasureType },
            { name: "白名单审计策略", value: res.smeasureType },
            { name: "状态", value: res.status },
            { name: "更新时间", value: res.updateTime }
          );
        }
      });
    },
    closeDialog() {
      this.$emit("closeDialog");
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
  color: #b4b4b4;
  font-weight: 800 !important;
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
