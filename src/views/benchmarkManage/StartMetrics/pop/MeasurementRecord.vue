<template>
  <el-dialog top="20px" title="启动度量记录" width="95%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false">
    <antv-graph ref="graph" :nodeId="this.nodeId" :ip="this.ip"></antv-graph>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import antvGraph from "./antvGraph.vue"

export default {
  name: "MeasurementRecord",
  components:{antvGraph},
  data() {
    return {
      btnvalue1: false,
      dialogFormVisible: false,
      labelPosition: "right",
      rules: {},
      ruleForm: {
        be_boot_measure_on: 0,
        be_boot_control: 0,
        be_dynamic_measure_on: 0,
        be_program_control: 0,
      },
      nodeId: "",
      ip: "",
    };
  },
  methods: {
    diaOpen(param) {
      // console.log(param)
      var that = this;
      that.dialogFormVisible = true;
      that.btnvalue1 = false;
      that.ip = param.ip;
      that.nodeId = param.nodeId;
    },
    diaClose() {
      this.dialogFormVisible = false;
      this.$emit("loadData");
    },
  },
};
</script>

