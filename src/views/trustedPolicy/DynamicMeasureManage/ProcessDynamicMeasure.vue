<template>
  <div class="main">
    <div class="container">
      <div class="topNav">
        <el-breadcrumb class="breadNav" separator="/">
          <el-breadcrumb-item class="crumb1">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">策略管理</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">动态度量管理</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb2">进程动态度量</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="title">进程动态度量</div> -->
      </div>
      <div class="wrap">
        <div class="search">
          <el-form :inline="true" :model="formInline" ref="formInline" class="formInline" size="small" @submit.native.prevent>
            <el-form-item label="终端名称/网络地址：" prop="terminalName">
              <el-input v-model="formInline.terminalName" clearable placeholder="请输入终端名称/网络地址" oninput="value=value.replace(/[%]/g, '')"></el-input>
            </el-form-item>
            <el-form-item label="日期：" prop="startDate" v-show="advancedSearch==true">
              <el-date-picker value-format="yyyy-MM-dd" :editable="false" type="date" placeholder="选择开始时间" v-model="formInline.startDate"></el-date-picker>
              &nbsp;&nbsp;<span class="">至</span>&nbsp;&nbsp;
              <el-date-picker value-format="yyyy-MM-dd" :editable="false" type="date" placeholder="选择结束时间" v-model="formInline.endDate"></el-date-picker>
            </el-form-item>
            <el-form-item class="advancedBtn">
              <el-button class="resetBtn" size="small" @click="resetForm">重置</el-button>
              <el-button class="searchBtn" size="small" @click="searchData">查询</el-button>
              <el-button class="gaoji" size="small" v-show="advancedFlag==true" @click="switchBtn">展开<i class="el-icon-arrow-down el-icon--right" style="font-weight: bold;"></i></el-button>
              <el-button class="gaoji" size="small" v-show="advancedFlag==false" @click="switchBtn">收起<i class="el-icon-arrow-up el-icon--right" style="font-weight: bold;"></i></el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="mainContainer">
          <!-- <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="Linux系统" name="first"> -->
              <div class="tableTitle">进程动态度量</div>
              <div class="popBtn">
                <el-button class="operateBtn" size="small" @click="addProcessDynamic">新建</el-button>
              </div>
              <el-table :data="terminalData" ref="terminalTable" tooltip-effect="light" @sort-change='sortChange'
                v-loading="loading" element-loading-text="加载中，请稍后"
                :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
                style="width: 99.9%;font-size: 14px"   :cell-style="{padding:'0px',color: 'rgba(0, 0, 0, 0.9)'}">
                <template slot="empty">
                  <div>暂无数据</div>
                </template>
                <el-table-column type="index" :index="indexMethod" label="序号" width="50px"></el-table-column>
                <el-table-column prop="node_name" label="终端名称" min-width="100%" show-overflow-tooltip></el-table-column>
                <el-table-column prop="node_ip" label="网络地址" min-width="100%"></el-table-column>
                <el-table-column prop="process_type" label="进程类型" min-width="80%">
                  <template slot-scope="props">
                    <span v-if="props.row.process_type=='0'">全路径</span>
                    <span v-else-if="props.row.process_type=='1'">进程名</span>
                    <span v-else-if="props.row.process_type=='2'">HASH</span>
                  </template>
                </el-table-column>
                <el-table-column prop="sub_process_mode" label="子进程" min-width="100%">
                  <template slot-scope="props">
                    <span v-if="props.row.sub_process_mode=='0'">跟随全局策略</span>
                    <span v-else-if="props.row.sub_process_mode=='1'">度量</span>
                    <span v-else-if="props.row.sub_process_mode=='2'">不度量</span>
                  </template>
                </el-table-column>
                <el-table-column prop="old_process_mode" label="已启动的进程" min-width="100%">
                  <template slot-scope="props">
                    <span v-if="props.row.old_process_mode=='0'">跟随全局策略</span>
                    <span v-else-if="props.row.old_process_mode=='1'">度量</span>
                    <span v-else-if="props.row.old_process_mode=='2'">不度量</span>
                  </template>
                </el-table-column>
                <el-table-column prop="share_lib_mode" label="共享库" min-width="100%">
                  <template slot-scope="props">
                    <span v-if="props.row.share_lib_mode=='0'">跟随全局策略</span>
                    <span v-else-if="props.row.share_lib_mode=='1'">度量</span>
                    <span v-else-if="props.row.share_lib_mode=='2'">不度量</span>
                  </template>
                </el-table-column>
                <el-table-column prop="measure_interval" label="度量间隔(秒)" min-width="100%"></el-table-column>
                <el-table-column prop="process" label="进程名" min-width="100%"></el-table-column>
                <el-table-column prop="status" label="状态" min-width="100%" :formatter="statusVal"></el-table-column>
                <el-table-column prop="update_date" :show-overflow-tooltip="true" min-width="110%" label="更新时间" sortable='custom'></el-table-column>
                <el-table-column fixed="right" label="操作" align="left" width="150px">
                  <template slot-scope="props">
                    <!-- <el-button style="color:#1ac492" type="text" @click="stopUsing(props.row)">停用</el-button> -->
                    <el-button style="color:#1ac492" type="text" @click="stopUsing(props.row)" v-if="props.row.status=='1'||props.row.status=='5'">停用</el-button>
                    <!-- <el-button v-else disabled type="text">停用</el-button> -->
                    <el-button style="color:#1ac492" type="text" @click="enableUsing(props.row)" v-if="props.row.status=='4'">启用</el-button>
                    <!-- <el-button v-else disabled type="text">启用</el-button> -->
                    <el-button style="color:#FF4D4F" type="text" @click="del(props.row)">删除</el-button>
                    <!-- <el-button style="color:#FF4D4F" type="text" @click="del(props.row)"  v-if="props.row.status=='0' || props.row.status=='2'">删除</el-button> -->
                    <!-- <el-button v-else disabled type="text">停用</el-button> -->
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination align='right' class="paging" v-if="pageShow"
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange"
                :current-page="currentPage.sync" 
                :page-sizes="[10,20]" 
                :page-size="pageSize" 
                layout="total, prev, pager, next, sizes, jumper" 
                :total="total">
              </el-pagination>
            <!-- </el-tab-pane>
            <el-tab-pane label="windows" name="second">windows</el-tab-pane>
          </el-tabs> -->
          
        </div>
      </div>
    </div>   
    <!-- 新建弹出框    -->
    <add-process-dynamic ref="poplay" @addSuccess="initData"></add-process-dynamic>
  </div>
</template>
<script>

import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
import { handleEnter,errorValue } from "@/utils/tools";
import AddProcessDynamic from './pop/AddProcessDynamic';
export default {
  name:"ProcessIdentity",
  components: { AddProcessDynamic},
  data() {
    return {
      activeName: 'first',
      loading:false,
      formInline:{
        terminalName: '',
        startDate:'',
        endDate:'',
      },
      advancedSearch:true,
      advancedFlag:false,
      emptytxt:'',
      terminalData:[],
      orderBy:'update_date desc',
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10,// 每页的数据条数
      pageShow:true,
      autorefresh: "",//定时器
    };
  },
  created() {
    handleEnter(this.searchData)
  },
  mounted() {
    this.loadData()
  },
  beforeDestroy() {
    document.onkeydown = null
  },
  methods: {  
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    loadData() {
      var that = this
      this.loading = true
      request({url: "/sec/processDMeraureList",method: "post",
        data: {
          condition: this.formInline.terminalName,
          firstTime: this.formInline.startDate,
          lastTime: this.formInline.endDate,
          orderBy: this.orderBy,
          searchPage: this.currentPage,
          searchSize: this.pageSize,
        }
      }).then((response) => {
        var res = response.data
        that.loading = false
        // console.log(res)
        if(res.list) {
          res.list.map(function(value,index) {
            value.update_date = timeToZh(value.update_date);
          })
          that.terminalData = res.list
          that.total = res.total
        }
        if(res.total ==0) {
          that.emptytxt = true
        } else {
          that.emptytxt = false
        }
      });
    },
    statusVal(row) {
      var option = ""
      if (row.status == 0) {
        option =<span class="wathet">下发中</span>
      } else if (row.status == 1) {
        option =<span class="green">已下发</span>
      } else if (row.status == 2) {
        var err =  errorValue(row.res)
        if (err) { option = <span class="red">下发失败（{err}）</span>}
        else if(row.res) { option = <span class="red">下发失败（错误码：{row.res}）</span>}
        else { option = <span class="red">下发失败</span>}
      } else if (row.status == 3) {
        option =<span class="wathet">停用中</span>
      } else if (row.status == 4) {
        option =<span class="green">已停用</span>
      } else if (row.status == 5) {
        var err =  errorValue(row.res)
        if (err) { option = <span class="red">停用失败（{err}）</span>}
        else if(row.res) { option = <span class="red">停用失败（错误码：{row.res}）</span>}
        else { option = <span class="red">停用失败</span>}
      } else {
        option =<span class="grey">初始化状态</span>
      }
      return option
    },
    switchBtn() {
      this.advancedSearch = !this.advancedSearch
      this.advancedFlag = !this.advancedFlag  
    },
    searchData() {
      this.currentPage = 1
      this.loadData()
      this.pageShow = false
      this.$nextTick(() => {
        this.pageShow = true
      })
    },
    indexMethod(index) {
      if (this.currentPage === 1) {
        if(index < 9) {
          return '0' + ( index + 1 )
        } else {
          return index + 1
        }
      } else {
        return ( index + 1 ) + this.pageSize * (this.currentPage - 1)
      }
    },
    sortChange: function(column, prop, order) {
      // console.log(column + '-' + column.prop + '-' + column.order)
      // console.log(column)
      if(column.order=="ascending") {
        this.orderBy = column.prop
      } else {
        this.orderBy = column.prop + " desc"
      }
      this.loadData()
    },
     //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
      this.pageShow = false
      this.$nextTick(() => {
        this.pageShow = true
      })
      this.loadData()
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.loadData()
    },
    addProcessDynamic() {
      this.$refs.poplay.diaOpen()
    },
    enableUsing(row){
      var that = this
      this.$confirm("此操作将启用该进程，是否继续？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sec/enableProcessMeasure?id="+row.id,method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
          if(res.status==0) {
            that.initData()
            this.$message({showClose: true, message: '操作成功', type: 'success'});
          } else {
            // this.$message({ showClose: true, message: res.errormessage, type: 'error'});
          }
        })
      }).catch(res => {})
    },
    stopUsing(row){
      var that = this
      this.$confirm("此操作将停用该进程，是否继续？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sec/delProcessMeraure?id="+row.id,method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
          if(res.status==0) {
            that.initData()
            this.$message({showClose: true, message: '操作成功', type: 'success'});
          } else {
            // this.$message({ showClose: true, message: res.errormessage, type: 'error'});
          }
        })
      }).catch(res => {})
    },
    del(row){
      var that = this
      this.$confirm("此操作将永久删除该数据，是否继续？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sec/delPMeraure?id="+row.id,method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
          if(res.status==0) {
            that.initData()
            this.$message({showClose: true, message: '操作成功', type: 'success'});
          } else {
            // this.$message({ showClose: true, message: res.errormessage, type: 'error'});
          }
        })
      }).catch(res => {})
    },
    initData() {
      var that = this;
      var num = 0
      that.autorefresh = setInterval(function () {
        num ++
        that.loadData()
        if (num > 4) {
          clearInterval(that.autorefresh)
        }
      }, 2000);
    },
    resetForm (){
      this.formInline.endDate =''
      this.formInline = Object.assign({}, undefined);
      this.$refs.formInline.resetFields();
    }
  },
  destroyed() {
    clearInterval(this.autorefresh);
  },
}
</script>

<style scoped>
.main {
  display: flex;
  padding: 0;
}
.container {
  flex: 1;
  overflow: auto;
}
.topNav {
  position: absolute;
  top: 0px;
  font-size: 14px;
  margin-left: 24px;
}
.title {
  font-family: 'PingFang-SC-Bold';
  font-size: 20px;
  font-weight: bold;
  color: #000;
  padding: 18px 0;
}
.breadNav {
  padding-top: 18px;
}
.wrap{
  overflow: auto;
  height: calc(100vh - 96px);
  padding: 24px;
  background-color: #f0f2f5;
}
.search {
  background-color:#fff;
  padding-left: 80px;
  position: relative;
}
.formInline {
  padding: 24px 0 5px
}
.el-input{
  width: 215px;
}
.resetBtn {
  width: 56px;
  height: 32px;
  font-size: 14px;
  color: rgba(0,0,0,0.9);
  padding: 7px 13px;
}
.searchBtn {
  width: 56px;
  height: 32px;
  color: #fff;
  border: 1px solid #1ac492;
  font-size: 14px!important;
  background-color: #1ac492;
  padding: 7px 13px;
}
.advancedBtn {
  position: absolute;
  right: 10px;
}
.gaoji {
  border: 0;
  font-size: 14px;
  color: #1ac492;
}
.mainContainer {
  overflow:auto;
  margin:18px 0;
  background-color:#fff;
  position: relative;
  padding: 20px;
}
.tableTitle {
  font-size: 16px;
  margin-bottom: 24px;
}
.popBtn {
  position: absolute;
  right: 24px;
  top: 18px;
}
/* .popBtn {
  position: absolute;
  right: 24px;
  top: 0px;
} */
.operateBtn {
  color: #fff;
  font-size: 14px;
  min-width: 56px;
  height: 32px;
  border: 1px solid #1ac492;
  background-color: #1ac492;
  padding: 7px 13px;
}
.paging {
  margin-top: 18px;
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
.paging >>>.el-pager li.active,.paging >>>.el-pager li:hover {
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
</style>
