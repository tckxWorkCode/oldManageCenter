<template>
  <el-dialog title="文件访问控制详情" top="5vh" width="55%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false" append-to-body>
    <el-form label-position="right" label-width="100px" ref="ruleForm" size="small">
      <el-form-item prop="ip" label="网络地址：">
        <el-input style="width:45%" v-model="ip" clearable disabled>{{ip}}</el-input>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" stripe tooltip-effect="light" style="width: 100%;border:1px solid #F0F2F5"
    :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}" max-height="55vh">
      <template slot="empty">
        <img style="" v-if="emptytxt" src="@/assets/nodata1.png" />
      </template>
      <el-table-column type="index" label="序号" width="50px"></el-table-column>
      <el-table-column prop="fileNameShow" label="保护目录" ></el-table-column>
      <el-table-column prop="fileType" label="文件类型"> 
        <template slot-scope="scope">
          <span v-if="scope.row.fileType == 0">文件</span>
          <span v-else-if="scope.row.fileType == 1">目录</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="保护类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 0">写保护</span>
          <span v-else-if="scope.row.type == 1">读保护</span>
        </template>
      </el-table-column>
      <el-table-column prop="measureFlags" label="度量标识">
        <template slot-scope="scope">
          <span v-if="scope.row.measureFlags == 0">都不度量</span>
          <span v-else-if="scope.row.measureFlags == 1">度量内核环境</span>
          <span v-else-if="scope.row.measureFlags == 2">度量进程</span>
          <span v-else-if="scope.row.measureFlags == 3">度量内核环境和进程</span>
        </template>
      </el-table-column>
      <el-table-column prop="privileges" label="特权路径" min-width="100%">
        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.privileges" :key="index">
            <div>{{item.privilegeName}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="privileges.type" label="特权类型" min-width="140%">
        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.privileges" :key="index">
            <div v-for="(itemSelect,i) in priTypeOptions" :key="i">
              <div v-if="itemSelect.value == item.type">{{itemSelect.label}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="creatDate" label="创建时间"  min-width="100%"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
import { timeToZh } from "@/utils/timefilter";

export default {
  name: 'ConfigPop',
  data () {
    return {
      dialogFormVisible: false,
      emptytxt:'',
      tableData: [],
      nodeId:'',
      autorefresh: '',//定时器
      timer:'',
      ip:'',
      num:0,
      privates:[],
      priTypeOptions:[{value:"0",label:"所有权限"},{value:"1",label:"只读",disabled:false}],
    }
  },
  methods: {
    diaOpen (param) {
      console.log(param)
      var that = this
      that.ip = param.nodeIp
      that.emptytxt = ''
      that.dialogFormVisible = true
      that.tableData = []
      that.nodeId= param.nodeId
      request({url: "/sec/searchFileAccPolicyById?policyId="+param.id,method: "post",
      }).then((response) => {
        var res = response.data
        // console.log(res)
        that.tableData = [res.object]
      });
     
    },
    diaClose () {
      this.dialogFormVisible = false
    }
  },
}
</script>

<style scoped>

</style>
