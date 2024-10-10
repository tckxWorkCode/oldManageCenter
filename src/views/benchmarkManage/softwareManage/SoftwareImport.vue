<template>
  <div class="main">
    <div class="container">
      <div class="topNav">
        <el-breadcrumb class="breadNav" separator="/">
          <el-breadcrumb-item class="crumb1">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">策略管理</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">软件白名单</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb2">软件包导入</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="title">软件包导入</div> -->
      </div>
      <div class="wrap">
        <div class="search">
          <el-form :inline="true" label-position="right" label-width="130px" :model="formInline" ref="formInline" class="formInline" size="small" @submit.native.prevent>
            <el-form-item label="软件包文件名称：" prop="terminalName">
              <el-input v-model="formInline.terminalName" clearable placeholder="请输入软件包文件名称" oninput="value=value.replace(/[%]/g, '')"></el-input>
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
          <div class="tableTitle">软件包文件列表</div>
          <div class="popBtn">
            <el-button class="operateBtn" size="small" @click="uploadDialog">导入</el-button>
          </div>
          <el-table :data="softwareData" size="mini" ref="softwareTable" tooltip-effect="light" style="width: 99.9%;font-size: 14px"   
             v-loading="loading" element-loading-text="加载中，请稍后"
            :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
              @sort-change='sortChange' :cell-style="{padding:'0px',color: 'rgba(0, 0, 0, 0.9)'}" :fit='true' row-key="packId" 
              :expand-row-keys="expands"  @expand-change="expandrow" class="softwareTable">
            <template slot="empty">
              <div>暂无数据</div>
            </template>
            <el-table-column type="index" :index="indexMethod" label="序号" width="50px"></el-table-column>
            <el-table-column prop="packName" label="软件包名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="packOtherName" label="别名"></el-table-column>
            <el-table-column prop="packSize" label="软件包大小(字节)"></el-table-column>
            <el-table-column prop="execFileNum" label="可执行文件个数"></el-table-column>
            <el-table-column prop="upTime" label="上传时间" sortable='custom' show-overflow-tooltip></el-table-column>
            <el-table-column fixed="right" type="expand">
              <template slot-scope="props">
                <div class="decoration">
                  <div :id="props.row.packId" style="border-bottom:1px solid #DDDEE0">
                    <el-table :data="expandData" tooltip-effect="light" :header-cell-style="headClass" :cell-style="rowClass"> 
                      <template slot="empty">
                        <img style="" v-if="emptytxt1" src="@/assets/nodata1.png" />
                      </template>
                      <el-table-column type="index" :index="indexMethod2" label="序号" width="80px"></el-table-column>
                      <el-table-column prop="packConName" label="文件名"  min-width="100%"></el-table-column>
                      <el-table-column prop="packConSize" label="大小(字节)" min-width="100%"></el-table-column>
                      <el-table-column prop="hash" label="Hash" min-width="300%" :show-overflow-tooltip="true"></el-table-column>
                      <el-table-column prop="fileType" label="类型" min-width="100%"></el-table-column>
                    </el-table>
                  </div>
                  <el-pagination  align='right' class="paging1" v-if="pageShow1"
                    @size-change="handleSizeChange1"
                    @current-change="handleCurrentChange1"
                    :current-page="currentPage1"
                    :page-sizes="[5,10]"
                    :page-size="pageSize1"
                    layout="sizes, total, prev, pager, next"
                    :total="total1">
                  </el-pagination>
                </div>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" header-align="left" width="100px">
              <template slot-scope="scope">
                <el-button type="text" style="color:#FF4D4F" :id="scope.row.packId" @click="del(scope.row.packId)">删除</el-button>
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
    <!-- 导入文件弹出框    -->
    <import-pop ref="poplay" @importsuccess="importFile"></import-pop>
  </div>
</template>
<script>

import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
import { handleEnter } from "@/utils/tools";
import ImportPop from './pop/ImportPop'

export default {
  name:"SoftwareImport",
  components: { ImportPop },
  data() {
    return {
      loading:false,
      formInline:{
        terminalName: '',
        startDate:'',
        endDate:'',
      },
      orderBy:'up_time desc',
      advancedSearch:true,
      advancedFlag:false,
      emptytxt:'',
      emptytxt1:'',
      softwareData:[],
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10,// 每页的数据条数
      pageShow:true,
      pageShow1:true,
      expands:[],
      expandData:[],
      currentPage1: 1, // 当前页码
      total1: 1, // 总条数
      pageSize1: 5,// 每页的数据条数
      packId:'',
      packName: [],
      aliasname: [],
      autorefresh:'',
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
      request({url: "/sec/whiteListPackageSearch",method: "post",
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
        that.packName.splice(0, that.packName.length)
        if(res.list) {
          res.list.map(function(value,index) {
            value.upTime = timeToZh(value.upTime);
            that.packName.push(value.packName)
          })
          that.softwareData = res.list
          that.total = res.total
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
    indexMethod2(index) {
      if (this.currentPage1 === 1) {
        if(index < 9) {
          return '0' + ( index + 1 )
        } else {
          return index + 1
        }
      } else {
        return ( index + 1 ) + this.pageSize1 * (this.currentPage1 - 1)
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
    searchData() {
      this.currentPage = 1
      this.loadData()
      this.pageShow = false
      this.$nextTick(() => {
        this.pageShow = true
      })
    },
    //打开导入界面
    uploadDialog() {
      this.$refs.poplay.diaOpen(this.packName, this.aliasname)
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
     //查看里面的表格
    headClass () {
      return 'text-align: center;background:#F0F2F5;color: rgba(0, 0, 0, 0.9);border-bottom:1px solid #DDDEE0'
    },
    rowClass () {
      return 'text-align: center;background:#F0F2F5;'
    },
    handleSizeChange1(val) {
        // console.log(`每页 ${val} 条`);
        this.currentPage1 = 1;
        this.pageSize1 = val;
        this.pageShow1 = false
      this.$nextTick(() => {
        this.pageShow1 = true
      })
        this.initSee()
    },
    handleCurrentChange1(val) {
        // console.log(`当前页: ${val}`);
        this.currentPage1 = val;
        this.initSee()
    },
    expandrow (row, expandedRows) {
      var that = this
      this.$message.closeAll()
      this.pageSize1 = 5
      this.currentPage1 = 1
      this.packId = row.packId
      if (expandedRows.length) {
        that.expands = []
        if (row) {
          that.expands.push(row.packId)
        }
      } else {
        that.expands = []
      }
      // console.log(row)
      request({
        url: '/sec/whiteListPackageContentSearch',
        method: 'post',
        data: {
          condition: '',
          orderBy: '',
          searchPage: that.currentPage1,
          searchSize: that.pageSize1,
          syspack_id: row.packId
        }
      }).then((response) => {
        var res = response.data
        // console.log(res)
        if(res.list) {
          res.list.map(function (value, index) {
            if(value.fileType === 0) {
              value.fileType = '不可执行'
            } else  if(value.fileType === 1) {
              value.fileType = '可执行'
            }
          })
          that.expandData = res.list
          that.total1 = res.total
        }
        if(res.total ==0) {
          that.emptytxt1 = true
        } else {
          that.emptytxt1 = false
        }
      })
    },
    initSee () {
      var that = this
      request({
        url: '/sec/whiteListPackageContentSearch',
        method: 'post',
        data: {
          condition: '',
          orderBy: '',
          searchPage: that.currentPage1,
          searchSize: that.pageSize1,
          syspack_id: that.packId
        }
      }).then((response) => {
        var res = response.data
        // console.log(res)
        if(res.list) {
          res.list.map(function (value, index) {
            if(value.fileType === 0) {
              value.fileType = '不可执行'
            } else if(value.fileType === 1) {
              value.fileType = '可执行'
            }
          })
          that.expandData = res.list
          that.total1 = res.total
        }
        if(res.total ==0) {
          that.emptytxt1 = true
        } else {
          that.emptytxt1 = false
        }
      })
    },
    importFile() {
      var that = this
      var num = 0
      that.autorefresh = setInterval(function () {
        num ++
        that.loadData()
        if (num > 5) {
          clearInterval(that.autorefresh)
        }
      }, 2000);
    },
    del(id) {
      // console.log(id)
      var pack_id = id;
      var that = this
      this.$confirm("此操作将永久删除该数据，是否继续？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sec/whiteListPackageDelete",method: "post",
          data: JSON.stringify(pack_id)
        }).then((response) => {
          var res = response.data
          // console.log(res)
          if(res.status==0) {
            that.importFile()
            this.$message({ showClose: true, message: '删除成功', type: 'success' });
          } else {
            // this.$message({ showClose: true, message: res.errormessage, type: 'error' });
          }
        })
      }).catch(res => {})
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
.paging1 {
  margin: 8px 0;
  /* color: rgba(51,51,51,0.9); */
}
.paging1 >>>.el-pagination__sizes {
  position: absolute;
  left: 40px;
}
.paging1 >>>.el-pager li {
  min-width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 2px;
  background-color: #F0F2F5;
  margin: 0 3px;
}
.paging1 >>>.el-pager li.active {
  background-color: #effff8;
  border: 1px solid #1ac492;
  color: #1ac492;
  font-size: 14px;
}
.paging1 >>>.el-pager li:hover {
  background-color: #effff8;
  border: 1px solid #1ac492;
  color: #1ac492;
}
.paging1 >>> .btn-next, .paging1 >>> .btn-prev {
  min-width: 24px;
  height: 24px;
  line-height: 24px;
  background-color: #F1F2F6;
  padding: 0;
}
.paging1 >>>.el-select .el-input__inner:focus,
.paging1 >>>.el-pagination__sizes .el-input .el-input__inner:hover,
.paging1 >>>.el-pagination__sizes .el-input .el-input__inner:active,
.paging1 >>>.el-pagination__sizes .el-select .el-input.is-focus .el-input__inner{
  border-color: #1ac492;
}
</style>
<style>
.decoration .el-table__empty-block {
  background-color: #F0F2F5;
} 
.el-table__expand-icon>.el-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  margin-left: 0px; 
  margin-top: 0px;
  color: #1ac492!important;
}
.el-table__expanded-cell {
  padding: 2px 20px !important;
}
.softwareTable .el-table__expand-icon .el-icon-arrow-right:before{
  content: '查看'!important;
  min-width: 32px!important;
  display: block!important;
  font-size: 14px!important;
}
.el-table__expand-icon--expanded {
  -webkit-transform: rotate(0deg)!important;
  transform: rotate(0deg)!important;
}
th.el-table__expand-column .cell {
  text-align: right!important;
  padding-right:0px!important;
  padding-left: 0!important;
}

</style>
