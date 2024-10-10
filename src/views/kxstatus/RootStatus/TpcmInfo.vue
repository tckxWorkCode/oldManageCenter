<template>
  <div class="main">
    <div class="container">
      <div class="topNav">
        <el-breadcrumb class="breadNav" separator="/">
          <el-breadcrumb-item class="crumb1">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">可信验证</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb2">TPCM管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="title">TPCM管理</div> -->
      </div>
      <div class="wrap">
        <div class="search">
          <el-form :inline="true" :label-position="labelPosition" label-width="150px" :model="formInline" ref="formInline" class="formInline" size="small" @submit.native.prevent>
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
          <div class="tableTitle">TPCM管理</div>
          <el-table :data="TpcmData" size="small" ref="TpcmTable" style="width: 99.9%;font-size: 14px" :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}"
            v-loading="loading" element-loading-text="加载中，请稍后" tooltip-effect="light"
           :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
           @sort-change='sortChange' :fit='true' row-key="id" >
            <template slot="empty">
              <div>暂无数据</div>
            </template>
            <el-table-column type="index" :index="indexMethod" label="序号" width="80px"></el-table-column>
            <el-table-column prop="nodeName" label="终端名称" min-width="110%" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="nodeIp" label="网络地址" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <a @click="openDialog(scope.row)" style="color:#1ac492;cursor:pointer">{{scope.row.nodeIp}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="beTpcmType" label="TPCM类型" :render-header="renderHeader">
              <template slot-scope="scope">
                <span v-if="scope.row.beTpcmType == '0'">模拟可信根</span>
                <span v-else-if="scope.row.beTpcmType == '1'">主核</span>
                <span v-else-if="scope.row.beTpcmType == '2'">附加核</span>
                <span v-else-if="scope.row.beTpcmType =='3'">模拟</span>
                <span v-else-if="scope.row.beTpcmType == '5'">外置</span>
                <span v-else >{{scope.row.beTpcmType}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="beHostTime" label="获取时间" :show-overflow-tooltip="true" sortable='custom' :render-header="renderHeader"></el-table-column>
            <el-table-column prop="beCmdHandled" label="已处理命令数量"  :render-header="renderHeader"></el-table-column>
            <el-table-column prop="beBootTimes" label="启动次数"></el-table-column>
            <el-table-column prop="beDmeasureTimes" label="动态度量次数" :render-header="renderHeader"></el-table-column>
            <el-table-column prop="beFileIntegrityMeasureTimes" label="程序启动度量次数" :render-header="renderHeader"></el-table-column>
            <el-table-column prop="beFileNotifyTimes" label="通知次数" min-width="80%"></el-table-column>
            <el-table-column prop="beBootTrustState" label="启动可信状态"  :render-header="renderHeader">
              <template slot-scope="scope">
                <span v-if="scope.row.beBootTrustState == '0'" class="wathet">可信</span>
                <span v-else-if="scope.row.beBootTrustState == '1'" class="red">不可信</span>
                <span v-else-if="scope.row.beBootTrustState =='2'" class="grey">未度量</span>
                <span v-else >{{scope.row.beBootTrustState}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column fixed="right" label="操作" width="120px">
              <template slot-scope="scope">
                <el-button type="text" :id="scope.row.id" @click="openSee(scope.row.id)">TPCM详情</el-button>
              </template>
            </el-table-column> -->
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
        </div>
      </div>
    </div>
    <div class="dialogContent" v-if="showDialog == true">
      <tpcm-pop ref="poplay" :rowMessage="rowMessage" @closeDialog="closeDialog"></tpcm-pop>
    </div>
    <div v-if="mask==true" class="mask" @click="closeDialog"></div>
  </div>
</template>
<script>

import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
import { handleEnter } from "@/utils/tools";
import TpcmPop from "./pop/TpcmPop";

export default {
  name:"TpcmInfo",
  components :{ TpcmPop },
  data() {
    return {
      loading:false,
      formInline:{
        terminalName: '',
        startDate:'',
        endDate:'',
      },
      labelPosition: 'right',
      advancedSearch:true,
      advancedFlag:false,
      emptytxt:false,
      TpcmData:[],
      orderBy:'be_host_time desc',
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10,// 每页的数据条数
      pageShow:true,
      showDialog:false,
      mask:false,
      rowMessage:{}
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
      request({url: "/sec/lTpcmAndTcmList ",method: "post",
        data: {
          condition: this.formInline.terminalName,
          firstTime: this.formInline.startDate,
          lastTime: this.formInline.endDate,
          orderBy: this.orderBy,
          system_type: "1",
          searchPage: this.currentPage,
          searchSize: this.pageSize,
        }
      }).then((response) => {
        var res = response.data
        that.loading = false
        // console.log(res)
        if(res.list) {
          res.list.map(function(value,index) {
            value.beHostTime = timeToZh(value.beHostTime);
          })
          that.total = res.total
          that.TpcmData = res.list
        }
        if(res.total ==0) {
          that.emptytxt = true
        } else {
          that.emptytxt = false
        }
      });
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
    renderHeader(h, {column, $index}) {
      let span = document.createElement('span');
      span.innerText = column.label;
      document.body.appendChild(span)
      column.minWidth = span.getBoundingClientRect().width +20
      document.body.removeChild(span)
      return h('span', column.label)
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
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.loadData()
    },
    openDialog(row) {
      // console.log(row)
      this.showDialog = true
      this.rowMessage = JSON.parse(JSON.stringify(row))
      this.mask = true
    },
    closeDialog() {
      this.showDialog = false
      this.mask = false
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
.popBtn {
  position: absolute;
  right: 24px;
  top: 18px;
}
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
.dialogContent {
  width: 28%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 2000;
  /* border-left: 1px solid #ccc; */
  background-color: #fff;
}
.mask  {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: .5;
  background: #000;
  z-index: 2;
}
</style>
