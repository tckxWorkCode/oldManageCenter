<template>
  <div class="main">
    <div class="container">
      <div class="topNav">
        <el-breadcrumb class="breadNav" separator="/">
          <el-breadcrumb-item class="crumb1">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">资产管理</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">资产列表</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb2">可信资产</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="title">可信资产</div> -->
      </div>
      <div class="wrap">
        <div class="search">
          <el-form :inline="true" :model="formInline" :label-position="labelPosition" label-width="90px" ref="formInline" class="formInline" size="small" @submit.native.prevent>
            <el-form-item label="终端名称/网络地址：" prop="terminalName" label-width="145px">
              <el-input v-model="formInline.terminalName" clearable placeholder="请输入终端名称/网络地址" oninput="value=value.replace(/[%]/g, '')"></el-input>
            </el-form-item>
            <el-form-item label="是否在线：" prop="onlineStatus" v-show="advancedSearch==true">
              <el-select v-model="formInline.onlineStatus" clearable placeholder="请选择">
                <el-option label="在线" value="1"></el-option>
                <el-option label="离线" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="注册日期：" prop="startDate" v-show="advancedSearch==true">
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
          <div class="tableTitle">资产列表</div>
          <el-table :data="terminalData" ref="terminalTable" @sort-change='sortChange' v-loading="loading" element-loading-text="加载中，请稍后"
              :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
              tooltip-effect="light" style="font-size: 14px" :cell-style="cellStyle">
            <template slot="empty">
              <div>暂无数据</div>
            </template>
            <el-table-column type="index" :index="indexMethod" label="序号" width="50px"></el-table-column>
            <el-table-column prop="name" label="终端名称" min-width="120%" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="ip" label="网络地址" min-width="100%"></el-table-column>
            <el-table-column prop="system" label="系统类型" min-width="100%" :show-overflow-tooltip="true">
              <template slot-scope="props">
                <span v-if="props.row.system == 'Linux' || props.row.system == 'linux'|| props.row.system == 'Unix'|| props.row.system == 'unix'">
                  <img src="@/assets/linux_icon.png"><span style="padding-left:10px">{{props.row.system}}</span>
                </span>
                <span v-else-if="props.row.system.indexOf('win')">
                  <img src="@/assets/windows_icon.png"> <span>{{props.row.system}}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="arch" label="体系架构" min-width="70%"></el-table-column>
            <!-- <el-table-column prop="descrption" label="描述"></el-table-column> -->
            <!-- <el-table-column prop="status" label="运行状态" min-width="70%">
              <template slot-scope="props">
                <span v-if="props.row.status == '1'" class="green">正常</span>
                <span v-else-if="props.row.status == '2'" class="red">注销中</span>
                <span v-else-if="props.row.status =='3'" class="grey">已注销</span>
              </template>
            </el-table-column> -->
            <el-table-column prop="onlineStatus" label="是否在线" min-width="80%">
              <template slot-scope="props">
                <span v-if="props.row.onlineStatus == '1'"><span class="aqua">●</span>在线</span>
                <span v-else-if="props.row.onlineStatus == '0'"><span class="lightRed">●</span>离线</span>
              </template>
            </el-table-column>
            <el-table-column prop="installerTime" show-overflow-tooltip min-width="100%" label="注册时间" sortable='custom'></el-table-column>
            <!-- <el-table-column prop="version" label="版本号"></el-table-column> -->
            <el-table-column prop="tpcmLicStateString" label="产品授权" :show-overflow-tooltip="true" min-width="110%"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180px" v-if="userName=='system'||userName=='httcadmin'">
              <template slot-scope="scope">
                <el-button type="text" style="color:#1ac492" @click="editMessage(scope.row)">修改</el-button>
                <!-- <el-button type="text" style="color:#1ac492" v-if="scope.row.onlineStatus == '0'||scope.row.status == '1'" @click="cancellation(scope.row)">注销</el-button>
                <el-button type="text" disabled v-else>注销</el-button> -->
                <el-button type="text" style="color:#1ac492" v-if="scope.row.onlineStatus == '0'||scope.row.status == '1'" @click="cancellation(scope.row)">模式切换</el-button>
                <el-button type="text" disabled v-else>模式切换</el-button>
                <el-button type="text" style="color:#FF4D4F" v-if="scope.row.onlineStatus == '0'" @click="del(scope.row)">删除</el-button>
                <el-button type="text" disabled v-else>删除</el-button>
              </template>
            </el-table-column>
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
    <edit-name ref="editName" @addSuccess="refresh"></edit-name>
  </div>
</template>
<script>

import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
import { handleEnter } from "@/utils/tools";
import EditName from './pop/EditName.vue';

export default {
  name:"TerminalManage",
  components:{ EditName },
  data() {
    return {
      userName:'',
      loading:false,
      labelPosition: 'right',
      // tableHeight:550,
      formInline:{
        terminalName: '',
        onlineStatus:'',
        startDate:'',
        endDate:'',
      },
      orderBy:'installer_time desc',
      advancedSearch:true,
      advancedFlag:false,
      emptytxt:'',
      terminalData:[],
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10,// 每页的数据条数
      pageShow:true,
      autorefresh:'',
    };
  },
  created() {
    handleEnter(this.searchData)
  },
  mounted() {
    this.userName = localStorage.getItem('userType')
    this.loadData()
  },
  beforeDestroy() {
    document.onkeydown = null
  },
  methods: {
    loadData() {
      var that = this
      this.loading = true
      request({url: "/LNodeList",method: "post",
        data: {
          condition: this.formInline.terminalName,
          firstTime: this.formInline.startDate,
          lastTime: this.formInline.endDate,
          orderBy: this.orderBy,
          online_status: this.formInline.onlineStatus,
          searchPage: this.currentPage,
          searchSize: this.pageSize,
        }
      }).then((response) => {
        var res = response.data
        that.loading = false
        if (res.list) {
          res.list.map(function(value,index) {
            value.installerTime = timeToZh(value.installerTime);
          })
          that.terminalData = res.list
        }
        that.total = res.total
        if(res.total ==0) { that.emptytxt = true} else { that.emptytxt = false}
      })
    },
    switchBtn() {
      this.advancedSearch = !this.advancedSearch
      this.advancedFlag = !this.advancedFlag  
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
      var order = column.prop.replace(/([A-Z])/g,"_$1").toLowerCase()
      if(column.order=="ascending") {
        this.orderBy = order
      } else {
        this.orderBy = order + " desc"
      }
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
    cellStyle() {
      let cellStyle;
      if ( this.userName=='safe') {
        cellStyle = "padding:7px 0px;color: rgba(0, 0, 0, 0.9)"
      } else {
        cellStyle = "padding:0px 0px;color: rgba(0, 0, 0, 0.9)"
      }
      return cellStyle
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
      if (val == null) { return}
      this.currentPage = val;
      this.loadData()
    },
    editMessage(row) {
      // console.log(row)
      this.$refs.editName.diaOpen(row)
    },
    cancellation(row) {
      var that = this
      // console.log(row)
      this.$confirm("确定注销此终端？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sys/LogOutByNodeId?node_id=" + row.nodeId,method: "post",}).
          then((response) => {
            var res = response.data
            if(res.status == 0) {
              that.$message({ message: "操作成功!", type: "success", showClose: true,});
              that.refresh()
            }else {
              // that.$message({ message: res.errormessage, type: "error", duration: 0, showClose: true,});
            }
          })
      }).catch(res => {})
    },
    del(row) {
      var that = this
      // console.log(row)
      this.$confirm("确定删除此终端？该操作不可逆转，请谨慎操作","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        confirmButtonClass:"btnColor",
        type:"warning"
      }).then(() => {
        request({url: "/sys/deleteNodeById?node_id=" + row.nodeId,method: "post",}).
          then((response) => {
            var res = response.data
            if(res.status == 0) {
              that.$message({ message: "操作成功!", type: "success", showClose: true,});
              that.refresh()
            }else {
              // that.$message({ message: res.errormessage, type: "error", duration: 0, showClose: true,});
            }
          })
      }).catch(res => {})
    },
    refresh() {
      var that = this
      var num = 0
      that.autorefresh = setInterval(function () {
        num ++
        that.loadData()
        if (num > 4) {
          clearInterval(that.autorefresh)
        }
      }, 3000);
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
.btnColor {
  color: #1ac492;
}
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
