<template>
  <el-dialog title="授权信息" class="dialogpadd" top="20vh" width="35%" :visible.sync="dialogFormVisible" @close="diaclose" :close-on-click-modal="false" append-to-body>
    <div class="rowstyle" v-for="(item,index) in tableData" :key="index">
      <div v-if="index===0" style="border-top:1px solid #ebeef5;overflow:hidden;">
        <div class="itemType">{{item.name}}</div>
        <div class="itemValue">{{item.value}}</div>
      </div>
      <div v-else style="overflow:hidden;">
        <div class="itemType">{{item.name}}</div>
        <div class="itemValue">{{item.value}}</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'LicenseInfo',
  data () {
    return {
      homepage:'',
      dialogFormVisible: false,
      labelPosition: 'right',
      tableData: [],
    }
  },
  methods: {
    diaOpen () {
      var that = this
      that.dialogFormVisible = true
      this.tableData = []
      this.tableData.push(
        { name: "控制点数", value: localStorage.getItem('node_num')},
        { name: "授权有效期", value: localStorage.getItem('licenseDeadline')},
      )
    },
    diaclose () {
      var that = this
      that.dialogFormVisible = false
    },
  }
}
</script>

<style scoped>
.rowstyle {
  border-left:1px solid #ebeef5;
  border-right:1px solid #ebeef5;
  border-bottom:1px solid #ebeef5;
}
.rowstyle:nth-of-type(odd) {
  background-color:#fafafa
}
.rowstyle:hover{
  background-color: #CAD4E6 !important;
  /* cursor: pointer; */
}
.itemType {
  width:175px;
  text-align:left;
  float:left;
  border-right:1px solid #ebeef5;
  height:35px;
  line-height:35px;
  padding:0px 10px;
}
.itemValue {
  float:left;
  height:35px;
  line-height:35px;
  padding:0px 10px;
}
</style>
