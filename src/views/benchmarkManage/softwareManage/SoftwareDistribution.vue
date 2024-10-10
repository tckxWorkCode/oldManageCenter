<template>
  <div class="main">
    <div class="container">
      <div class="topNav">
        <el-breadcrumb class="breadNav" separator="/">
          <el-breadcrumb-item class="crumb1">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">策略管理</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">软件白名单</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb2">软件包下发</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="title">软件包下发</div> -->
      </div>
      <div class="wrap">
        <div class="search">
          <el-form :inline="true" label-position="right" label-width="150px"  :model="formInline" ref="formInline" class="formInline" size="small" @submit.native.prevent>
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
          <div class="tableTitle">软件包下发</div>
          <div class="popBtn">
            <el-button class="operateBtn" size="small" @click="openDialog">新建</el-button>
          </div>
          <el-table :data="issueData" size="small" ref="issueTable" tooltip-effect="light" style="width: 99.9%;font-size: 14px"   
            v-loading="loading" element-loading-text="加载中，请稍后"
            :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
            @sort-change='sortChange' :cell-style="{padding:'0px',color: 'rgba(0, 0, 0, 0.9)'}" :fit='true' row-key="policyId" :expand-row-keys="expands"  @expand-change="expandrow">
            <template slot="empty">
              <div>暂无数据</div>
            </template>
            <el-table-column type="index" :index="indexMethod" label="序号" width="50px"></el-table-column>
            <el-table-column prop="name" label="终端名称" min-width="100%" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ip" label="网络地址"></el-table-column>
            <el-table-column prop="policyName" label="策略名称"></el-table-column>
            <el-table-column prop="policyType" label="策略类型">
              <template slot-scope="props">
                <span v-if="props.row.policyType == 1">学习模式策略</span>
                <span v-else-if="props.row.policyType == 2">软件包策略</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="策略状态" :formatter="statusVal"></el-table-column>
            <el-table-column prop="createDate" label="创建时间" min-width="100%" sortable='custom'></el-table-column>
            <el-table-column prop="packageName" label="软件包名称" min-width="100%" show-overflow-tooltip></el-table-column>
            <el-table-column prop="packageStatus" label="软件包状态" min-width="100%" :formatter="statusVal2"></el-table-column>
            <el-table-column prop="packageTime" label="软件包下发时间" min-width="100%" sortable='custom' show-overflow-tooltip></el-table-column>
            <el-table-column fixed="right" type="expand" align="center" width="50px">
              <template slot-scope="props">
                <div class="decoration">
                  <div :id="props.row.policyId" style="border-bottom:1px solid #DDDEE0">
                    <el-table :data="expandData" border width="100%" :header-cell-style="headClass" :cell-style="rowClass">
                      <template slot="empty">
                        <img style="" v-if="emptytxt1" src="@/assets/nodata1.png" />
                      </template>
                      <el-table-column type="index" :index="indexMethod2"  label="序号"  width="50px"></el-table-column>
                      <el-table-column prop="sPackconName" label="文件名"></el-table-column>
                      <el-table-column prop="sPackconHash" label="Hash" min-width="200%"></el-table-column>
                      <el-table-column prop="upStatus" label="状态">
                        <template slot-scope="props">
                          <span v-if="props.row.upStatus == '0'">添加等待</span>
                          <span v-else-if="props.row.upStatus == '1'">添加生效</span>
                          <span v-else-if="props.row.upStatus == '2'">删除等待</span>
                          <span v-else-if="props.row.upStatus == '3'">删除生效</span>
                          <span v-else-if="props.row.upStatus == '4'">下发失败</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="upDate" label="时间"></el-table-column>
                    </el-table>
                  </div>
                  <el-pagination align='right' class="paging1"  v-if="pageShow1"
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
            <el-table-column fixed="right" label="操作" align="left" width="120px">
              <template slot-scope="props">
                <el-button style="color:#1ac492" v-if="props.row.status == '3' || props.row.status == '4'" @click="startfun(props.row)" type="text">启用</el-button>
                <!-- <el-button v-else disabled type="text">启用</el-button> -->
                <el-button style="color:#1ac492" v-if="props.row.status == '1' || props.row.status == '7'"  @click="stopUsing(props.row)" type="text">停用</el-button>
                <!-- <el-button v-else disabled type="text">停用</el-button> -->
                <el-button style="color:#FF4D4F" v-if="props.row.status == '3' || props.row.status == '4'" type="text" @click="del(props.row)" >删除</el-button>
                <el-button v-else disabled type="text">删除</el-button>
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
    <!-- 新建弹出框    -->
    <issue-pop ref="poplay" @newsuccess="newsuccess"></issue-pop>
  </div>
</template>
<script>

import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
import { handleEnter,errorValue } from "@/utils/tools";
import IssuePop from './pop/IssuePop'
export default {
  name:"SoftwareDistribution",
  components: { IssuePop },
  data() {
    return {
      loading:false,
      formInline:{
        terminalName: '',
        startDate:'',
        endDate:'',
      },
      orderBy:'create_date desc',
      advancedSearch:true,
      advancedFlag:false,
      emptytxt:'',
      emptytxt1:'',
      issueData:[],
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10,// 每页的数据条数
      pageShow:true,
      pageShow1:true,
      currentPage1: 1, // 查看的当前页码
      total1: 1, // 查看的总条数
      pageSize1: 5,// 查看的每页的数据条数
      expands:[],
      expandData:[],
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
    loadData() {
      var that = this
      this.loading = true
      request({url: "/sec/whiteListPolicySearch",method: "post",
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
            value.createDate = timeToZh(value.createDate);
            value.packageTime = timeToZh(value.packageTime);
          })
          that.issueData = res.list
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
        option =<span class="wathet">等待更新</span>
      } else if (row.status == 1) {
        option =<span class="green">已更新</span>
      } else if (row.status == 2) {
        option =<span class="green">等待停用</span>
      } else if (row.status == 3) {
        option =<span class="green">已停用</span>
      } else if (row.status == 4) {
        var err =  errorValue(row.policyRes)
        if (err) { option = <span class="red">下发失败（{err}）</span>}
        else if(row.policyRes) { option = <span class="red">下发失败（错误码：{row.policyRes}）</span>}
        else { option = <span class="red">下发失败</span>}
      } else if (row.status == 5) {
        option =<span class="green">下发部分成功</span>
      } else if (row.status == 6) {
        option =<span class="green">删除部分成功</span>
      } else if (row.status == 7) {
        var err =  errorValue(row.policyRes)
        if (err) { option = <span class="red">停用失败（{err}）</span>}
        else if(row.policyRes) { option = <span class="red">停用失败（错误码：{row.policyRes}）</span>}
        else { option = <span class="red">停用失败</span>}
      } else {
        option =<span class="grey">初始化状态</span>
      }
      return option
    },
    statusVal2(row) {
      var option = ""
      if (row.packageStatus == 0) {
        option =<span class="wathet">不下发软件包</span>
      } else if (row.packageStatus == 1) {
        option =<span class="wathet">下发软件包</span>
      } else if (row.packageStatus == 2) {
        option =<span class="wathet">正在下发</span>
      } else if (row.packageStatus == 3) {
        option =<span class="green">下发软件包成功</span>
      } else if (row.packageStatus == 4) {
        var err =  errorValue(row.packageRes)
        if (err) { option = <span class="red">下发软件包失败（{err}）</span>}
        else if(row.packageRes) { option = <span class="red">下发软件包失败（错误码：{row.packageRes}）</span>}
        else { option = <span class="red">下发软件包失败</span>}
      } else {
        option =<span class="grey">初始化状态</span>
      }
      return option
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
      this.pageShow1 = false
      this.$nextTick(() => {
        this.pageShow1 = true
      })
      this.loadData()
    },
    openDialog() {
      this.$refs.poplay.diaOpen()
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
      this.policyId = row.policyId
      if (expandedRows.length) {
        that.expands = []
        if (row) {
          that.expands.push(row.policyId)
        }
      } else {
        that.expands = []
      }
      // console.log(row)
      request({
        url: '/sec/whiteListPolicyContentSearch',
        method: 'post',
        data: {
          condition: '',
          orderBy: '',
          searchPage: that.currentPage1,
          searchSize: that.pageSize1,
          syspack_id: row.policyId
        }
      }).then((response) => {
        var res = response.data
        // console.log(res)
        if(res.list) {
          res.list.map(function(value,index) {
            value.upDate = timeToZh(value.upDate);
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
        url: '/sec/whiteListPolicyContentSearch',
        method: 'post',
        data: {
          condition: '',
          orderBy: '',
          searchPage: that.currentPage1,
          searchSize: that.pageSize1,
          syspack_id: that.policyId
        }
      }).then((response) => {
        var res = response.data
        // console.log(res)
        res.list.map(function(value,index) {
          value.upDate = timeToZh(value.upDate);
        })
        if(res.list) {
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
    // 操作列
    startfun(param){
      console.info('sfdsfsdfdd', param)
      var that = this
      this.$confirm("确定启用此策略？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sec/whiteListEnable?policyId="+param.policyId,method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
          if(res.status==0) {
            that.newsuccess()
            this.$message({ showClose: true, message: '操作成功', type: 'success' });
          } else {
            // this.$message({ showClose: true, message: res.errormessage, duration: 0, type: 'error' });
          }
        })
      }).catch(res => {})
    },
    stopUsing(param){
      console.info('234234324', param)
      var that = this
      this.$confirm("确定停用此策略？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sec/whiteListDisable?policyId="+param.policyId,method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
          if(res.status==0) {
            that.newsuccess()
            this.$message({ showClose: true, message: '操作成功', type: 'success' });
          } else {
            // this.$message({ showClose: true, message: res.errormessage, duration: 0, type: 'error' });
          }
        })
      }).catch(res => {})
    },
    del(row){
      console.info('2343242', row)
      var that = this
      this.$confirm("此操作将永久删除该数据，是否继续？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sec/whiteListPolicyDel?policy_id=" +row.policyId,method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
          if(res.status==0) {
            that.newsuccess()
            this.$message({ showClose: true, message: '删除成功', type: 'success' });
          } else {
            // this.$message({ showClose: true, message: res.errormessage, duration: 0, type: 'error' });
          }
        })
      }).catch(res => {})
    },
    resetForm (){
      this.formInline.endDate =''
      this.formInline = Object.assign({}, undefined);
      this.$refs.formInline.resetFields();
    },
    newsuccess () {
      var that = this
      var num = 0
      that.autorefresh = setInterval(function () {
        num ++
        that.loadData()
        if (num > 5) {
          clearInterval(that.autorefresh)
        }
      }, 1000);
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
  color: rgba(51,51,51,0.9);
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
.el-table__expand-icon .el-icon-arrow-right:before{
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
  text-align: right;
  padding-right:0px!important;
  padding-left: 0!important;
}
</style>
