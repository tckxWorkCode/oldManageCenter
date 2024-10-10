<template>
  <el-dialog title="启动度量记录" top="5vh" width="65%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false" append-to-body>
    <div style="display:flex;">
      <el-form label-position="right" label-width="90px" ref="ruleForm" size="small" style="flex:2">
        <el-form-item prop="ip" label="网络地址：">
          <el-input style="width:45%" v-model="ip" clearable disabled>{{ip}}</el-input>
        </el-form-item>
      </el-form>
      <div class="statusTip">
        <el-button size="small" @click="getNewListRecord">获取新记录</el-button>
      </div>
    </div>
    
    <el-table :data="tableData.slice((currentPage2-1)*pageSize2,currentPage2*pageSize2)" stripe tooltip-effect="light" style="width: 100%;border:1px solid #F0F2F5"
    :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}" max-height="55vh">
      <template slot="empty">
        <img style="" v-if="emptytxt" src="@/assets/nodata1.png" />
      </template>
      <el-table-column type="index" :index="indexMethod" label="序号" width="50px"></el-table-column>
      <el-table-column prop="stage" label="度量阶段" min-width="110%">
        <template slot-scope="scope">
          <span v-if="scope.row.stage >= 0 && scope.row.stage <= 999">TPCM及度量加载器(BIOS,UBOOT)及前期固件验证</span>
          <span v-else-if="scope.row.stage >= 1000 && scope.row.stage <= 1999">加载器加载驱动、配置、操作系统或二级加载器(GRUB)</span>
          <span v-else-if="scope.row.stage >= 2000 && scope.row.stage <= 2999">二级加载器(GRUB)加载驱动、配置、操作系统</span>
          <span v-else-if="scope.row.stage >= 3000">操作系统加载驱动、配置、服务程序</span>
          <span v-else>{{scope.row.stage}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="度量对象名称" min-width="150%"></el-table-column>
      <!-- <el-table-column prop="hash" label="度量对象hash" min-width="150%"></el-table-column> -->
      <el-table-column prop="bootMeasures" label="度量对象hash" min-width="200%">
        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.bootMeasures" :key="index">
            <div style="margin-bottom:5px">{{item.hash}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="result" label="度量结果" min-width="100%">
        <template slot-scope="scope">
          <span v-if="scope.row.result =='0'">可信</span>
          <span v-else-if="scope.row.result =='1'">不可信</span>
          <span v-else-if="scope.row.result =='2'">未度量</span>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="度量时间" min-width="115%"></el-table-column>
    </el-table>
      <el-pagination
        @size-change="handleSizeChange2" class="paging" align='right'
        @current-change="handleCurrentChange2"
        :current-page="currentPage2"
        :page-sizes="[10,20]" 
        :page-size="pageSize2"
        layout="total, prev, pager, next, jumper"
        :total="total2">
      </el-pagination>
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
      onlineStatus: "",
      tableData: [],
      currentPage2: 1, // 当前页码
      total2: 0, // 总条数
      pageSize2: 10,// 每页的数据条数
      nodeId:'',
      getOldBtn:false,
      autorefresh: '',//定时器
      timer:'',
      recordType:'',
      ip:'',
      num:0
    }
  },
  methods: {
    diaOpen (param) {
      var that = this
      that.ip = param.ip
      that.emptytxt = ''
      that.dialogFormVisible = true
      that.tableData = []
      that.recordType = ''
      that.nodeId= param.nodeId
      this.onlineStatus = param.onlineStatus
      that.getOldBtn = false
      this.num = 0
      this.getOldList()
    },
    diaClose () {
      var that = this
      that.dialogFormVisible = false
    },
    indexMethod(index) {
      if (this.currentPage2 === 1) {
        if(index < 9) {
          return '0' + ( index + 1 )
        } else {
          return index + 1
        }
      } else {
        return ( index + 1 ) + this.pageSize2 * (this.currentPage2 - 1)
      }
    },
    handleSizeChange2 (val) {
      // console.log('每页1', val)
      var that = this
      this.pageSize2 = val
      if(that.recordType == 'list') {
        that.getNewList()
      } else if (that.recordType == 'old') {
        that.getOldList()
      }
    },
    handleCurrentChange2 (val) {
      // console.log('每页2', val)
      var that = this
      this.currentPage2 = val
      if(that.recordType == 'list') {
        that.getNewList()
      } else if (that.recordType == 'old') {
        that.getOldList()
      }
    },
    getNewListRecord () {
      var that = this
      if (this.onlineStatus == 0) {
        return that.$message({ showClose: true, message: '终端已离线', type: 'error' });
      } else {
        request({url: "/sec/lBMeasureRecord",method: "post", data:{node_id:that.nodeId}})
        .then((response) => {
          var res = response.data
          // console.log(res)
          // res.list.map(function(value,index) {
          //   value.measureTime = timeToZh(value.measureTime);
          // })
          // that.tableData = res.list
          that.initData()
        });
        if (JSON.stringify(that.tableData) =='[]') {
          that.timer = setInterval( function(){
            if (JSON.stringify(that.tableData) !='[]' && JSON.stringify(that.tableData) != undefined && that.tableData.length > 0 ) { 
              // console.log(222233333,JSON.stringify(that.tableData))
              that.$message({ showClose: true, message: '已获取最新记录', type: 'success' });
            }
          },2000);
        } else {
          clearInterval(that.autorefresh)
          clearInterval(that.timer)
          that.$message({ showClose: true, message: '已获取最新记录', type: 'success' });
        }
        setTimeout(function() {
          clearInterval(that.autorefresh)
          clearInterval(that.timer)
          if (JSON.stringify(that.tableData) =='[]' || JSON.stringify(that.tableData) == undefined) {
            // console.log(3333,JSON.stringify(that.tableData))
            that.getOldList()
            that.$message({ showClose: true, message: '请求已超时，已获取历史记录', type: 'warning' });
          } else { 
            // console.log(2222,JSON.stringify(that.tableData))
            that.$message({ showClose: true, message: '已获取最新记录', type: 'success' });
          }
        },5000)
      }
    },
    initData() {
      var that = this;
      that.autorefresh = setInterval(function () {
        that.getNewList()
      }, 1000);
    },
    getNewList() {
      var that = this
      this.num ++
      request({url: "/sec/lBMeasureRecordTree?nodeId=" +that.nodeId,method: "post"})
      .then((response) => {
        var res = response.data
        // console.log(res)
        if(res.total ==0) {
          that.emptytxt = true
        } else {
          that.emptytxt = false
        }
        if(res.data) {
          res.data.map(function(value,index) {
            value.time = timeToZh(value.time);
          })
          that.tableData = res.data
          that.total2 = res.data.length
          that.recordType = 'list'
        }
      });
    },
    getOldList() {
      var that = this
      request({url: "/sec/lBMeasureRecordTreeOld?nodeId=" +that.nodeId,method: "post"})
        .then((response) => {
          var res = response.data
          // console.log(res)
          if(res.data) {
            res.data.map(function(value,index) {
              value.time = timeToZh(value.time);
            })
            that.tableData = res.data
            that.total2 = res.data.length
            that.recordType = 'old'
          }
          if(res.total ==0) {
            that.emptytxt = true
          } else {
            that.emptytxt = false
          }
        });
    },
  },
  destroyed() {
    clearInterval(this.autorefresh);
    clearInterval(this.timer)
  },
}
</script>

<style scoped>
.statusTip {
  margin-bottom: 20px;
  text-align: right;
  /* border: 1px solid #; */
}
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
  cursor: pointer;
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
.paging {
  margin: 18px 0;
  color: rgba(51,51,51,0.9);
}
.paging >>>.el-pager li {
  min-width: 31px;
  height: 31px;
  line-height: 31px;
  border-radius: 2px;
  border: 1px solid #e4e4e4;
  margin: 0 3px;
}
.paging >>>.el-pager li.active, .paging >>>.el-pager li:hover{
  background-color: #effff8;
  border: 1px solid #1ac492;
  color: #1ac492;
  font-size: 14px;
}
.paging >>> .btn-next, .paging >>> .btn-prev {
  min-width: 31px;
  height: 31px;
  line-height: 31px;
  border: 1px solid #e4e4e4;
  padding: 0;
  margin: 0 5px;
}
.paging >>>.el-select .el-input__inner:focus,
.paging >>>.el-pagination__sizes .el-input .el-input__inner:hover,
.paging >>>.el-pagination__sizes .el-input .el-input__inner:active,
.paging >>>.el-pagination__sizes .el-select .el-input.is-focus .el-input__inner{
  border-color: #1ac492;
}

.paging >>>.el-pagination__jump {
  margin-left: 0px;
}
.paging >>>.el-pagination__jump .el-input__inner:focus {
  border: 1px solid #1ac492;
  margin-left: 0px;
}
.el-table-add-row {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  border-radius: 3px;
}
.dialog-footer .sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff;
}
</style>
