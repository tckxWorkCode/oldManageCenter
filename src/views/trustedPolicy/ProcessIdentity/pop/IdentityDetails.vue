<template>
  <div class="dialogStyle">
    <div class="title">
      <span>进程身份详情</span>
      <span class="closeBtn" @click="closeDialog"><i class="el-icon-close"></i></span>
    </div>
    <div class="terminalInfo"> 
      <img class="terminalImg" src="@/assets/terminal.png" alt="">
      <span>{{this.rowMessage.node_ip}}</span>
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
      <el-divider></el-divider>
      <div class="tableStyle">
        <el-table row-key="id" ref="terminalTable" size="small" border style="font-size:14px" :data="hashs">
          <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
          <el-table-column prop="hash" label="hash" align="center" min-width="110%"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
export default {
  name: "ConnectionDetails",
  props:{
    rowMessage: {
      type: Object,
    }
  },
  data() {
    return {
      tableData: [],
      hashs:[],
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
        url: "/sys/searchProIdenByID?i_id=" +this.rowMessage.i_id, method: "post",
      }).then((response) => {
        var res = response.data
        // console.log(res);
        that.tableData.splice(0, that.tableData.length);
        if (res.object) {
          that.emptytxt = false
          var value = res.object
          value.creat_date = timeToZh(value.creat_date);
          if(value.specific_libs =="0") { value.specific_libs = "不包含依赖库"
          } else if(value.specific_libs =="1") {  value.specific_libs = "包含依赖库"
          } 
          if(value.status =="0") { value.status = "创建中"
          } else if(value.status =="1") {  value.status = "已创建"
          } else if(value.status =="2") {  value.status = "创建失败"
          } else if(value.status =="3") {  value.status = "删除中"
          } else if(value.status =="4") {  value.status = "已删除"
          } else if(value.status =="5") {  value.status = "删除失败"
          } else if(value.status =="6") {  value.status = "采集信息中"
          } else if(value.status =="7") {  value.status = "采集完成"
          } else if(value.status =="8") {  value.status = "采集失败"
          } else {  value.status = "初始化状态"
          } 
          that.tableData.push(
            { name: "网络地址", value: value.node_ip,},
            { name: "终端名称", value: value.node_name,},
            { name: "进程身份名称", value: value.name,},
            { name: "程序路径", value: value.path,},
            { name: "依赖库", value: value.specific_libs,},
            { name: "依赖库数量", value: value.lib_number,},
            { name: "状态", value: value.status,},
            { name: "创建时间", value: value.creat_date,},
          );
          let hashArr = Array.from(new Set(res.object.hashs))
          hashArr.map((item, index) => {
            that.hashs.push(
              Object.assign( {hash: item})
            ) 
          })
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
  height: calc(100vh - 220px);
  overflow-y: auto;
}
.rowStyle {
  margin: 0 40px;
  position: relative;
}
.tableStyle {
  margin: 20px 40px;
  height: 50vh;
  overflow: auto;
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

