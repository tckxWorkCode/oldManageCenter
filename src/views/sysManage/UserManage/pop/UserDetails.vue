<template>
  <div class="dialogStyle">
    <div class="title">
      <span>用户信息详情</span>
      <span class="closeBtn" @click="closeDialog"><i class="el-icon-close"></i></span>
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
  name: "UserDetails",
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
    loadData() {
      var that = this;
      that.tableData = []
      request({
        url: "/sys/user/getById?user_id=" + this.rowMessage.user_id,
        method: "post",
      }).then((response) => {
        var res = response.data
        // console.log(res);
        that.tableData.splice(0, that.tableData.length);
        if (res.object) {
          var value = res.object
          value.last_login_error_time = timeToZh(value.last_login_error_time);
          if(value.is_locked =="0") { value.is_locked = "否"
          } else if(value.is_locked =="1") {  value.is_locked = "是"}

          that.tableData.push(
            {name: "用户名", value: value.user_id,},
            {name: "昵称", value: value.name,},
            {name: "用户类型", value: value.type,},
            {name: "是否锁定", value: value.is_locked, },
            {name: "上次锁定时间", value: value.last_login_error_time,},
            {name: "错误次数", value: value.login_error_count, },
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
