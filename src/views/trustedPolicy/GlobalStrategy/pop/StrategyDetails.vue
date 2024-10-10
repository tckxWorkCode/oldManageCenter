<template>
  <div class="dialogStyle">
    <div class="title">
      <span>全局策略详情</span>
      <span class="closeBtn" @click="closeDialog"><i class="el-icon-close"></i></span>
    </div>
    <div class="terminalInfo"> 
      <img class="terminalImg" src="@/assets/terminal.png" alt="">
      <span>{{this.rowMessage.ip}}</span>
        <img class="questionImg" src="@/assets/question.png" title="网络地址">
    </div>
    <div class="container">
      <div style="text-align:center"><img v-if="emptytxt" src="@/assets/nodata.png" /></div>
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
  name: "StrategyDetails",
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
      request({
        url: "/sys/searchFuncWwitch?node_id=" +this.rowMessage.nodeId,
        method: "post",
      }).then((response) => {
        var res = response.data
        // console.log(res);
        if(res.object) {
          that.emptytxt = false
          that.tableData.splice(0, that.tableData.length);
          var value = res.object
          value.be_boot_measure_on == 1 ? value.be_boot_measure_on ="开启":value.be_boot_measure_on="关闭"
          value.be_program_measure_on == 1 ? value.be_program_measure_on ="开启":value.be_program_measure_on="关闭"
          value.be_dynamic_measure_on == 1 ? value.be_dynamic_measure_on ="开启":value.be_dynamic_measure_on="关闭"
          value.be_boot_control == 1 ? value.be_boot_control ="控制":value.be_boot_control="不控制"
          value.be_program_control == 1 ? value.be_program_control ="控制":value.be_program_control="不控制"
          value.be_policy_replay_check == 1 ? value.be_policy_replay_check ="需要校验":value.be_policy_replay_check="不需要校验"
          value.be_static_reference_replay_check == 1 ? value.be_static_reference_replay_check ="需要校验":value.be_static_reference_replay_check="不需要校验"
          value.be_dynamic_reference_replay_check == 1 ? value.be_dynamic_reference_replay_check ="需要校验":value.be_dynamic_reference_replay_check="不需要校验"
          if(value.be_program_measure_mode =="0") { value.be_program_measure_mode = "软件度量"
          } else if(value.be_program_measure_mode =="1") {  value.be_program_measure_mode = "TPCM校验"
          } else if(value.be_program_measure_mode =="2") { value.be_program_measure_mode = "TPCM度量"
          } else if(value.be_program_measure_mode =="3") { value.be_program_measure_mode = "自动度量"
          }
          value.be_measure_use_cache == 1 ? value.be_measure_use_cache ="使用缓存":value.be_measure_use_cache="不使用缓存"
          value.be_process_dmeasure_ref_mode == 1 ? value.be_process_dmeasure_ref_mode ="文件库完整性":value.be_process_dmeasure_ref_mode="启动时候采集"
          value.be_process_dmeasure_match_mode == 1 ? value.be_process_dmeasure_match_mode ="带路径匹配":value.be_process_dmeasure_match_mode="只匹配hash"
          value.be_program_measure_match_mode == 1 ? value.be_program_measure_match_mode ="带路径匹配":value.be_program_measure_match_mode="只匹配hash"
          value.be_process_dmeasure_lib_mode == 1 ? value.be_process_dmeasure_lib_mode ="度量":value.be_process_dmeasure_lib_mode="不度量"
          if(value.be_process_verify_lib_mode =="0") { value.be_process_verify_lib_mode = "按策略制定方式"
          } else if(value.be_process_verify_lib_mode =="1") {  value.be_process_verify_lib_mode = "不验证"
          } else if(value.be_process_verify_lib_mode =="2") { value.be_process_verify_lib_mode = "按全局基准库验证"
          } else if(value.be_process_verify_lib_mode =="3") { value.be_process_verify_lib_mode = "按专门基准库验证"
          }
          value.be_process_dmeasure_sub_process_mode == 1 ? value.be_process_dmeasure_sub_process_mode ="度量":value.be_process_dmeasure_sub_process_mode="不度量"
          value.be_process_dmeasure_old_process_mode == 1 ? value.be_process_dmeasure_old_process_mode ="度量":value.be_process_dmeasure_old_process_mode="不度量"
          value.protect_module == 1 ? value.protect_module ="开启":value.protect_module="关闭"
          value.protect_process == 1 ? value.protect_process ="开启":value.protect_process="关闭"
          that.tableData.push(
            { name: "启动度量", value: res.object.be_boot_measure_on,},
            { name: "启动度量控制开关", value: res.object.be_boot_control,},

            { name: "白名单功能", value: res.object.be_program_measure_on,},
            { name: "白名单控制开关", value: res.object.be_program_control,},
            { name: "白名单度量模式", value: res.object.be_program_measure_mode,},
            { name: "白名单度量匹配模式", value: res.object.be_program_measure_match_mode,},

            { name: "策略重放校验", value: res.object.be_policy_replay_check,},
            { name: "静态基准值重放校验", value: res.object.be_static_reference_replay_check,},
            { name: "动态基准值重放校验", value: res.object.be_dynamic_reference_replay_check,},
            
            { name: "程序度量使用缓存", value: res.object.be_measure_use_cache,},

            { name: "动态度量", value: res.object.be_dynamic_measure_on,},
            { name: "动态度量间隔时间", value: res.object.be_dmeasure_max_busy_delay+" 秒"},

            { name: "进程动态度量模式", value: res.object.be_process_dmeasure_ref_mode,},
            { name: "进程动态度量匹配模式", value: res.object.be_process_dmeasure_match_mode,},
            { name: "进程动态度量度量lib库", value: res.object.be_process_dmeasure_lib_mode,},
            { name: "进程验签lib模式", value: res.object.be_process_verify_lib_mode,},
            { name: "进程动态度量子进程度量模式", value: res.object.be_process_dmeasure_sub_process_mode,},
            { name: "进程动态度量已启动进程度量模式", value: res.object.be_process_dmeasure_old_process_mode,},
            { name: "进程动态度量时间间隔", value: res.object.be_process_dmeasure_interval+ " 毫秒"},

            { name: "模块防卸载", value: res.object.protect_module,},
            { name: "进程防杀", value: res.object.protect_process,},
          );
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
</style>

