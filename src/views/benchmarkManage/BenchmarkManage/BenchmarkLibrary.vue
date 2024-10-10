<template>
  <div class="main">
    <div class="container">
      <div class="topNav">
        <el-breadcrumb class="breadNav" separator="/">
          <el-breadcrumb-item class="crumb1">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">基准管理</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb2">白名单</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="title">白名单</div> -->
      </div>
      <div class="wrap">
        <div class="search">
          <el-form :inline="true" :model="formInline" :label-position="labelPosition" label-width="100px" ref="formInline" class="formInline" size="small" @submit.native.prevent>
            <el-form-item label="终端名称/网络地址：" prop="terminalName" label-width="150px">
              <el-input v-model="formInline.terminalName" clearable placeholder="请输入终端名称/网络地址" oninput="value=value.replace(/[%]/g, '')"></el-input>
            </el-form-item>
            <el-form-item label="系统类型：" prop="systemType" v-show="advancedSearch==true">
              <el-select v-model="formInline.systemType" clearable placeholder="请选择">
                <el-option label="所有系统" value="0"></el-option>
                <el-option label="Linux系统" value="1"></el-option>
                <el-option label="Windows系统" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="采集路径：" prop="path" v-show="advancedSearch==true">
              <el-input v-model="formInline.path" clearable placeholder="请输入采集路径"></el-input>
            </el-form-item>
            <el-form-item label="数据来源：" prop="policyType" v-show="advancedSearch==true">
              <el-select v-model="formInline.policyType" clearable placeholder="请选择" @change="currentSelect">
                <el-option v-for="item in policyTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
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
          <div class="tableTitle">白名单列表</div>
          <el-table :data="benchmarkLibraryData" size="small" ref="benchmarkLibraryTable" tooltip-effect="light"
              :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
              :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}" v-loading="loading" element-loading-text="加载中，请稍后"
              @sort-change='sortChange' style="width: 99.9%;font-size: 14px"   :fit='true'>
            <template slot="empty">
              <div>暂无数据</div>
            </template>
            <el-table-column type="index" :index="indexMethod" label="序号" width="100px"></el-table-column>
            <el-table-column prop="nodeName" label="终端名称" min-width="100%" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="nodeIp" label="网络地址"></el-table-column>
            <el-table-column prop="system" label="系统类型" min-width="100%">
              <template slot-scope="props">
                <span v-if="props.row.system == 'Linux' || props.row.system == 'linux'|| props.row.system == 'Unix'|| props.row.system == 'unix'">
                  <img src="@/assets/linux_icon.png"><span style="padding-left:10px">{{props.row.system}}</span>
                </span>
                <span v-else-if="props.row.system && props.row.system.indexOf('win')">
                  <img src="@/assets/windows_icon.png"> <span>{{props.row.system}}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="source" label="数据来源">
              <template slot-scope="scope">
                <span v-if="scope.row.source == '1'">初始采集</span>
                <span v-else-if="scope.row.source == '2'">管理中心配置</span>
                <span v-else-if="scope.row.source == '3'">本地配置</span>
              </template>
            </el-table-column>
            <el-table-column prop="path" label="采集路径" min-width="180%">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <div>{{scope.row.hash}}</div>
                  <div slot="reference"> {{scope.row.path}} </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="creatDate" label="创建时间" sortable='custom' min-width="100%" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
          <el-pagination align='right' class="paging" v-if="pageShow"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage.sync"
            :page-sizes="[10,20]"
            :page-size="pageSize"
            layout="total, prev,pager, next,sizes, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>   
  </div>
</template>
<script>

import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
import { handleEnter } from "@/utils/tools";
export default {
  name:"BenchmarkLibrary",
  data() {
    return {
      loading:"",
      labelPosition: 'right',
      formInline:{
        terminalName: '',
        path:'',
        systemType:'',
        policyType:'',
        startDate:'',
        endDate:'',
      },
      policyTypeList:[{label:"初始采集",value:1},{label:"管理中心配置",value:2},{label:"本地配置",value:3}],
      orderBy:'creat_date desc',
      advancedSearch:true,
      advancedFlag:false,
      emptytxt:'',
      benchmarkLibraryData:[],
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10,// 每页的数据条数
      pageShow:true
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
    loadData() {
      var that = this
      this.loading = true
      request({url: "/sec/whiteListStoreSearch",method: "post",
        data: {
          condition: this.formInline.terminalName,
          path: this.formInline.path,
          system_type: this.formInline.systemType,
          policy_type: this.formInline.policyType,
          firstTime: this.formInline.startDate,
          lastTime: this.formInline.endDate,
          orderBy: this.orderBy,
          searchPage: this.currentPage,
          searchSize: this.pageSize,
        }
      })
      .then((response) => {
        var res = response.data
        that.loading = false
        // console.log(res)
        if(res.list) {
          res.list.map(function(value,index) {
            value.creatDate = timeToZh(value.creatDate);
          })
          that.benchmarkLibraryData = res.list
        }
        that.total = res.total
        if(res.total ==0) {
          that.emptytxt = true
        } else {
          that.emptytxt = false
        }
      });
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
    switchBtn() {
      this.advancedSearch = !this.advancedSearch
      this.advancedFlag = !this.advancedFlag  
    },
    currentSelect(value) {
      // console.log(value)
    },
    sortChange: function(column, prop, order) {
      // console.log(column + '-' + column.prop + '-' + column.order)
      // console.log(column)
      var order = column.prop.replace(/([A-Z])/g,"_$1").toLowerCase()
      if(column.order=="ascending") {
        this.orderBy = order
      } else {
        this.orderBy = order + " desc"
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
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.loadData()
    },
    searchData() {
      this.currentPage = 1
      this.loadData()
      this.pageShow = false
      this.$nextTick(() => {
        this.pageShow = true
      })
    },
    resetForm (){
      this.formInline.endDate =''
      this.formInline = Object.assign({}, undefined);
      this.$refs.formInline.resetFields();
    }
  }
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
