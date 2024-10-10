<template>
  <div class="main">
    <div class="container">
      <div class="topNav">
        <el-breadcrumb class="breadNav" separator="/">
          <el-breadcrumb-item class="crumb1">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">可信密钥</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb2">密钥管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="title">密钥管理</div> -->
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
          <div class="tableTitle">密钥管理</div>
          <el-table :data="keyManageData" size="small" ref="keyManageTable" tooltip-effect="light" 
            v-loading="loading" element-loading-text="加载中，请稍后"
             :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
             style="width: 99.9%;font-size: 14px"  :cell-style="{padding:'0px',color: 'rgba(0, 0, 0, 0.9)'}"  @sort-change='sortChange'
               :fit='true'  row-key="id">
            <template slot="empty">
              <div>暂无数据</div>
            </template>
            <el-table-column type="index" :index="indexMethod" label="序号" width="100px"></el-table-column>
            <el-table-column prop="name" label="终端名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ip" label="网络地址">
              <template slot-scope="scope">
                <a @click="keyTree(scope.row)" style="color:#1ac492;cursor:pointer">{{scope.row.ip}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="keytreeStatus" label="状态" min-width="100%" :formatter="statusVal"></el-table-column>
            <el-table-column prop="onlineStatus" label="是否在线" min-width="80%">
              <template slot-scope="scope">
                <span v-if="scope.row.onlineStatus == '1'"><span class="aqua">●</span>在线</span>
                <span v-else-if="scope.row.onlineStatus == '0'"><span class="lightRed">●</span>离线</span>
              </template>
            </el-table-column>
            <el-table-column prop="lpolicyStatus.keytreeUpdateDate" label="更新时间" min-width="100%" sortable='custom' show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" align="left" >
              <template slot-scope="scope">
                <el-button style="color:#1ac492" type="text" @click="openDialog(scope.row)">迁移记录</el-button>
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
    <div class="treeContent" v-if="showTree == true">
      <key-tree ref="poplay" :rowMessage="rowMessage" @closeDialog="closeDialog" @addSuccess="addSuccess"></key-tree>
    </div>
    <div v-if="mask==true" class="mask" @click="closeDialog"></div>
    <migration-records ref="migrationRecords"></migration-records>
  </div>
</template>
<script>

import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
import { handleEnter,errorValue } from "@/utils/tools";
import KeyTree from './pop/KeyTree'
import MigrationRecords from './pop/MigrationRecords.vue';
export default {
  name:"KeyManagement",
  components: { KeyTree,MigrationRecords },
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
      keyManageData:[],
      orderBy:'ldm.keytree_update_date desc',
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10,// 每页的数据条数
      pageShow:true,
      showTree:false,
      mask:false,
      rowMessage:{},
      autorefresh: '',//定时器
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
      request({url: "/sec/lKeytreeListAll",method: "post",
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
            value.installerTime = timeToZh(value.installerTime);
          })
          that.keyManageData = res.list
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
      if (row.lpolicyStatus == null) {
        option = ""
      } else if (row.lpolicyStatus.keytreeStatus == 0) {
        option =<span class="wathet">创建中</span>
      } else if (row.lpolicyStatus.keytreeStatus == 1) {
        option =<span class="green">已创建</span>
      } else if (row.lpolicyStatus.keytreeStatus == 2) {
        var err =  errorValue(row.lpolicyStatus.keytreeRes)
        if (err) { option = <span class="red">创建失败（{err}）</span>}
        else if(row.lpolicyStatus.keytreeRes) { option = <span class="red">创建失败（错误码：{row.lpolicyStatus.keytreeRes}）</span>}
        else { option = <span class="red">创建失败</span>}
      } 
      else if (row.lpolicyStatus.keytreeStatus == 3) {
        option =<span class="wathet">删除中</span>
      } else if (row.lpolicyStatus.keytreeStatus == 4) {
        option =<span class="green">已删除</span>
      } else if (row.lpolicyStatus.keytreeStatus == 5) {
        var err =  errorValue(row.lpolicyStatus.keytreeRes)
        if (err) { option = <span class="red">删除失败（{err}）</span>}
        else if(row.lpolicyStatus.keytreeRes) { option = <span class="red">删除失败（错误码：{row.lpolicyStatus.keytreeRes}）</span>}
        else { option = <span class="red">删除失败</span>}
      }
      else if (row.lpolicyStatus.keytreeStatus == 6) {
        option =<span class="wathet">导出中</span>
      } else if (row.lpolicyStatus.keytreeStatus ==7 ) {
        option =<span class="green">已导出</span>
      } else if (row.lpolicyStatus.keytreeStatus ==8 ) {
        var err =  errorValue(row.lpolicyStatus.keytreeRes)
        if (err) { option = <span class="red">导出失败（{err}）</span>}
        else if(row.lpolicyStatus.keytreeRes) { option = <span class="red">导出失败（错误码：{row.lpolicyStatus.keytreeRes}）</span>}
        else { option = <span class="red">导出失败</span>}
      } 
      else if (row.lpolicyStatus.keytreeStatus == 9) {
        option =<span class="wathet">导入中</span>
      } else if (row.lpolicyStatus.keytreeStatus ==10 ) {
        option =<span class="green">已导入</span>
      } else if (row.lpolicyStatus.keytreeStatus ==11 ) {
        var err =  errorValue(row.lpolicyStatus.keytreeRes)
        if (err) { option = <span class="red">导入失败（{err}）</span>}
        else if(row.lpolicyStatus.keytreeRes) { option = <span class="red">导入失败（错误码：{row.lpolicyStatus.keytreeRes}）</span>}
        else { option = <span class="red">导入失败</span>}
      } 
      else if (row.lpolicyStatus.keytreeStatus == 12) {
        option =<span class="wathet">迁出中</span>
      } else if (row.lpolicyStatus.keytreeStatus ==13 ) {
        option =<span class="green">已迁出</span>
      } else if (row.lpolicyStatus.keytreeStatus ==14 ) {
        var err =  errorValue(row.lpolicyStatus.keytreeRes)
        if (err) { option = <span class="red">迁出失败（{err}）</span>}
        else if(row.lpolicyStatus.keytreeRes) { option = <span class="red">迁出失败（错误码：{row.lpolicyStatus.keytreeRes}）</span>}
        else { option = <span class="red">迁出失败</span>}
      } 
      else if (row.lpolicyStatus.keytreeStatus == 15) {
        option =<span class="wathet">迁入中</span>
      } else if (row.lpolicyStatus.keytreeStatus ==16 ) {
        option =<span class="green">已迁入</span>
      } else if (row.lpolicyStatus.keytreeStatus ==17 ) {
        var err =  errorValue(row.lpolicyStatus.keytreeRes)
        if (err) { option = <span class="red">迁入失败（{err}）</span>}
        else if(row.lpolicyStatus.keytreeRes) { option = <span class="red">迁入失败（错误码：{row.lpolicyStatus.keytreeRes}）</span>}
        else { option = <span class="red">迁入失败</span>}
      } 
      else {
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
      var str = column.prop.split(".")[1]
      var order = str.replace(/([A-Z])/g,"_$1").toLowerCase()
      if(column.order=="ascending") {
        this.orderBy = "ldm."+  order
      } else {
        this.orderBy = "ldm."+ order + " desc"
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
      this.$refs.migrationRecords.diaOpen(row)
    },
    keyTree(row) {
      // console.log(row)
      this.showTree = true
      this.rowMessage = JSON.parse(JSON.stringify(row))
      this.mask = true
    },
    closeDialog() {
      this.showTree = false
      this.mask = false
    },
    addSuccess() {
      var that = this;
      var num = 0
      that.autorefresh = setInterval(function () {
        num ++
        that.loadData()
        if (num > 5) {
          clearInterval(that.autorefresh)
        }
      }, 1000);
    },
    resetForm (){
      this.formInline.endDate =''
      this.formInline = Object.assign({}, undefined);
      this.$refs.formInline.resetFields();
    }
  },
  destroyed() {
    clearInterval(this.autorefresh)
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
.treeContent {
  width: 28%;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 2000;
  border-left: 1px solid #ccc;
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
