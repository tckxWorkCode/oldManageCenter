<template>
  <div class="dialogStyle">
    <div class="title">
      <span>度量详情</span>
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
  name: "PolicyAuthDetails",
  props:{
    rowMessage: {
      type: Object,
    },
    policyType: {
      type: Number
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
      request({
        url: "/sys/searchBYKey",
        method: "post",
        data: {
          node_id:that.rowMessage.nodeId,
          policy_type:that.policyType
        },
      }).then((response) => {
        var res = response.data
        // console.log(res);
        if (res.status == 0) {
          if(res.object) {
            that.emptytxt = false
            that.tableData.splice(0, that.tableData.length);
            res.object.on_off == 1 ? res.object.on_off ="开启":res.object.on_off="关闭"
            res.object.policy_type == 1 ? res.object.policy_type ="启动度量策略":res.object.policy_type="白名单度量策略"
            if(res.object.auth_process =="0") { res.object.auth_process = "不需要"
            } else if(res.object.auth_process =="1") {  res.object.auth_process = "使用进程身份认证"
            } else if(res.object.auth_process =="2") { res.object.auth_process = "使用进程角色认证"
            }
            if(res.object.auth_user =="0") { res.object.auth_user = "不需要"
            } else if(res.object.auth_user =="1") {  res.object.auth_user = "使用用户id认证"
            } else if(res.object.auth_user =="2") { res.object.auth_user = "使用用户组id认证"
            }
            if(res.object.auth_trust_state =="0") { res.object.auth_trust_state = "不需要"
            } else if(res.object.auth_trust_state =="1") {  res.object.auth_trust_state = "可信阶段一"
            } 
            if(res.object.auth_cert_keep =="0") { res.object.auth_cert_keep = "只允许签名认证"
            } else if(res.object.auth_cert_keep =="1") {  res.object.auth_cert_keep = "只允许策略认证"
            } else if(res.object.auth_cert_keep =="2") { res.object.auth_cert_keep = "签名认证或者策略认证"
            } else if(res.object.auth_cert_keep =="3") { res.object.auth_cert_keep = "签名认证和策略认证同时满足"
            }
            res.object.auth_trust_state_boot == 1 ? res.object.auth_trust_state_boot ="需要":res.object.auth_trust_state_boot="不需要"
            res.object.auth_trust_state_dm == 1 ? res.object.auth_trust_state_dm ="需要":res.object.auth_trust_state_dm="不需要"
            res.object.auth_trust_state_sm == 1 ? res.object.auth_trust_state_sm ="需要":res.object.auth_trust_state_sm="不需要"
            res.object.auth_env == 1 ? res.object.auth_env ="需要":res.object.auth_env="不需要"
            
            that.tableData.push(
              { name: "是否启用", value: res.object.on_off,},
              { name: "策略类型", value: res.object.policy_type,},
              { name: "进程身份认证方式", value: res.object.auth_process,},
              { name: "进程认证名称", value: res.object.process_name,},
              { name: "用户认证方式", value: res.object.auth_user,},
              { name: "用户id", value: res.object.user_id,},
              { name: "启动阶段可信", value: res.object.auth_trust_state_boot,},
              { name: "动态度量阶段可信", value: res.object.auth_trust_state_dm,},
              { name: "静态度量阶段可信", value: res.object.auth_trust_state_sm,},
              { name: "环境度量", value: res.object.auth_env,},
              // { name: "可信状态认证方式", value: res.object.auth_trust_state,},
              { name: "认证方式", value: res.object.auth_cert_keep,},
            );
          } else {
            that.emptytxt = true
          }
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
