<template>
  <div class="main">
    <div class="container">
      <div class="topNav">
        <el-breadcrumb class="breadNav" separator="/">
          <el-breadcrumb-item class="crumb1">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">可信连接</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb2">可信配置</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="title">可信配置</div> -->
      </div>
      <div class="wrap">
        <div class="search">
          <el-form :inline="true" label-position="right" label-width="145px" :model="formInline" ref="formInline" class="formInline" size="small" @submit.native.prevent>
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
          <div class="tableTitle">可信配置</div>
          <el-table :data="strategyData" size="small" ref="strategyTable" tooltip-effect="light"  @sort-change='sortChange'
            v-loading="loading" element-loading-text="加载中，请稍后"
            :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
            :cell-style="{padding:'0px',color: 'rgba(0, 0, 0, 0.9)'}" style="width: 99.9%;font-size: 14px" :fit='true'>
            <template slot="empty">
              <div>暂无数据</div>
            </template>
            <el-table-column type="index" :index="indexMethod" label="序号" width="50px"></el-table-column>
            <el-table-column prop="name" label="终端名称" min-width="100%" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ip" label="网络地址">
              <template slot-scope="scope">
                <a @click="openDialog(scope.row)" style="color:#1ac492;cursor:pointer">{{scope.row.ip}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="onlineStatus" label="终端状态">
              <template slot-scope="props">
                <span v-if="props.row.onlineStatus == '1'"><span class="aqua">●</span>在线</span>
                <span v-else-if="props.row.onlineStatus == '0'"><span class="lightRed">●</span>离线</span>
              </template>
            </el-table-column>
            <el-table-column prop="system" label="操作系统" show-overflow-tooltip>
              <template slot-scope="props">
                <span v-if="props.row.system == 'Linux' || props.row.system == 'linux'">
                  <img src="@/assets/linux_icon.png"><span style="padding-left:10px">{{props.row.system}}</span>
                </span>
                <span v-else-if="props.row.system.indexOf('win')">
                  <img src="@/assets/windows_icon.png"><span>{{props.row.system}}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="arch" label="体系架构"></el-table-column>
            <el-table-column prop="status" label="状态" :formatter="statusVal"></el-table-column>
            <el-table-column prop="installerTime" :show-overflow-tooltip="true" min-width="90%" label="创建时间" sortable='custom'></el-table-column>
            <el-table-column label="操作" width="100px">
              <template slot-scope="scope">
                <el-button v-if="scope.row.onlineStatus == 0" style="color:#D9D9D9" type="text" @click="openConfig(scope.row)">配置</el-button>
                <el-button v-else style="color:#1ac492" type="text" @click="openConfig(scope.row)">配置</el-button>
                <!-- <el-button type="text" v-if ="scope.row.lpolicyStatus.tcmStatus == '2'" @click="reissue(scope.row)">重新下发</el-button> -->
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
        </div>
      </div>
    </div>
    <div class="dialogContent" v-if="showDialog == true">
      <connection-details ref="details" :rowMessage="rowMessage" @closeDialog="closeDialog"></connection-details>
    </div>
    <div v-if="mask==true" class="mask" @click="closeDialog"></div> 
    <config-connection ref="poplay" @success="initData"></config-connection>
  </div>
</template>
<script>

import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
import { handleEnter,errorValue } from "@/utils/tools";
import ConfigConnection from './pop/ConfigConnection'
import ConnectionDetails from "./pop/ConnectionDetails.vue"
export default {
  name:"GlobalStrategy",
  components:{ConfigConnection,ConnectionDetails},
  data() {
    return {
      loading:false,
      formInline:{
        terminalName: '',
        startDate:'',
        endDate:'',
      },
      advancedSearch:true,
      advancedFlag:false,
      emptytxt:'',
      strategyData:[],
      orderBy:'update_time desc',
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10,// 每页的数据条数
      pageShow:true,
      autorefresh: "",//定时器
      showDialog:false,
      mask:false,
      rowMessage:{},
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
      request({url: "/sec/trustList",method: "post",
        data: {
          condition: this.formInline.terminalName,
          firstTime: this.formInline.startDate,
          lastTime: this.formInline.endDate,
          system_type: "1",
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
            if(value) {
              value.installerTime = timeToZh(value.installerTime);
            }
          })
          that.total = res.total
          that.strategyData = res.list
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
        option =<span class="green">下发成功</span>
      } else if (row.status == 2) {
        var err =  errorValue(row.res)
        if (err) { option = <span class="red">下发失败（{err}）</span>}
        else if(row.res) { option = <span class="red">下发失败（错误码：{row.res}）</span>}
        else { option = <span class="red">下发失败</span>}
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
      var order = column.prop.replace(/([A-Z])/g,"_$1").toLowerCase()
      if(column.order=="ascending") {
        this.orderBy = order
      } else {
        this.orderBy = "update_time desc"
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
    openConfig(row) {
      // console.log(row)
      if(row.onlineStatus==0) {
        this.$message({ message: "终端已离线", type: "error", showClose: true,});
      } else {
        this.$refs.poplay.diaOpen(row)
      }
    },
    initData() {
      var that = this;
      var num = 0
      that.autorefresh = setInterval(function () {
        num ++
        that.loadData()
        if (num > 5) {
          clearInterval(that.autorefresh)
        }
      }, 3000);
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
    },
    // reissue(row) {
    //   var that = this
    //   // console.log(row)
    //   this.$confirm("重新下发全局策略？","提示", {
    //     confirmButtonText:"确定",
    //     cancelButtonText:"取消",
    //     type:"warning"
    //   }).then(() => {
    //     request({url: "/sec/retrySendStore?id=" + row.id,method: "post",}).
    //       then((response) => {
    //         var res = response.data
    //         if(res.status == 0) {
    //           that.$message({ message: "操作成功!", type: "success", showClose: true,});
    //           that.loadData()
    //         }else {
    //           that.$message({ message: res.errormessage, type: "error", duration: 0, showClose: true,});
    //         }
    //       })
    //   }).catch(res => {})
    // },
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

