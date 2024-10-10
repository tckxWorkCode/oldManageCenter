<template>
  <div class="main">
    <div class="container">
      <div class="topNav">
        <el-breadcrumb class="breadNav" separator="/">
          <el-breadcrumb-item class="crumb1">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">平台管理</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">进程身份</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb2">进程身份</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="title">进程身份</div> -->
      </div>
      <div class="wrap">
        <div class="search">
          <el-form :inline="true" label-position="right" label-width="145px"  :model="formInline" ref="formInline" class="formInline" size="small" @submit.native.prevent>
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
          <div class="tableTitle">进程身份列表</div>
          <div class="popBtn">
            <el-button class="operateBtn" size="small" @click="addIdentity">信息采集</el-button>
          </div>
          <el-table :data="identityData" size="small" ref="identityTable" tooltip-effect="light" 
            v-loading="loading" element-loading-text="加载中，请稍后"  :expand-row-keys="expands"  row-key="i_id" @expand-change="expandrow" 
            :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
            @sort-change='sortChange' :cell-style="{padding:'0px',color: 'rgba(0, 0, 0, 0.9)'}" style="width: 99.9%;font-size: 14px"   :fit='true'>
            <template slot="empty">
              <div>暂无数据</div>
            </template>
            <el-table-column type="index" :index="indexMethod" label="序号" width="50px"></el-table-column>
            <el-table-column prop="node_name" label="终端名称" min-width="120%" show-overflow-tooltip></el-table-column>
            <el-table-column prop="node_ip" label="网络地址" min-width="100%"></el-table-column>
            <el-table-column prop="name" label="进程身份名称" min-width="100%"></el-table-column>
            <el-table-column prop="status" label="状态" min-width="100%" :formatter="statusVal"></el-table-column>
            <el-table-column prop="creat_date" label="创建时间" min-width="100%" sortable='custom' show-overflow-tooltip></el-table-column>
            <el-table-column prop="path" label="程序路径" min-width="100%"></el-table-column>
            <el-table-column fixed="right" type="expand" label="" width="50px">
              <template slot-scope="props">
                <div class="decoration">
                  <div class="expandContainer" :id="props.row.i_id" style="border-bottom:1px solid #DDDEE0">
                    <el-table :data="expandData.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)" tooltip-effect="light" border :header-cell-style="headClass" :cell-style="rowClass"> 
                      <template slot="empty">
                        <img style="" v-if="emptytxt1" src="@/assets/nodata1.png" />
                      </template>
                      <el-table-column type="index" :index="indexMethod2" label="序号" width="50px"></el-table-column>
                      <el-table-column prop="category" label="类型" align="center"></el-table-column>
                      <el-table-column prop="hash" label="hash" align="center" min-width="200%"></el-table-column>
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
            <el-table-column fixed="right" label="操作" align="left" min-width="120px">
              <template slot-scope="props">
                <el-button style="color:#1ac492" v-if="props.row.status == '7'" @click="configure(props.row)" type="text">配置</el-button>
                <el-button type="text" v-else disabled>配置</el-button>
                <el-button style="color:#1ac492" v-if="props.row.status == '8'" @click="reacquisition(props.row)" type="text">重新采集</el-button>
                <el-button type="text" v-else disabled>重新采集</el-button>
                <el-button style="color:#FF4D4F" type="text" v-if="props.row.status == '1'|| props.row.status == '3'|| props.row.status == '5'" @click="del(props.row)">删除</el-button>
                <el-button style="color:#FF4D4F" type="text" v-else @click="deleteLProcessIdentityInfo(props.row)">删除</el-button>
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
      <identity-details ref="details" :rowMessage="rowMessage" @closeDialog="closeDialog"></identity-details>
    </div>
    <div v-if="mask==true" class="mask" @click="closeDialog"></div> 
    <!-- 新建弹出框    -->
    <add-identity ref="poplay" @addSuccess="addSuccess"></add-identity>
    <config-identity ref="configure"></config-identity>
  </div>
</template>
<script>

import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
import { handleEnter,errorValue } from "@/utils/tools";
import AddIdentity from './pop/AddIdentity.vue';
import ConfigIdentity from './pop/ConfigIdentity.vue';
import IdentityDetails from './pop/IdentityDetails.vue';
export default {
  name:"ProcessIdentity",
  components: { AddIdentity, ConfigIdentity,IdentityDetails},
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
      identityData:[],
      orderBy:'creat_date desc',
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10,// 每页的数据条数
      pageShow:true,
      autorefresh: "",//定时器
      showDialog:false,
      mask:false,
      rowMessage:{},

      expands:[],
      expandData:[],
      currentPage1: 1, // 当前页码
      total1: 0, // 总条数
      pageSize1: 5,// 每页的数据条数
      emptytxt1:'',
      pageShow1:true,
      i_id:""
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
      request({url: "/lProcessIdentityList",method: "post",
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
            value.creat_date = timeToZh(value.creat_date);
          })
          that.identityData = res.list
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
        option =<span class="wathet">创建中</span>
      } else if (row.status == 1) {
        option =<span class="green">已创建</span>
      } else if (row.status == 2) {
        var err =  errorValue(row.policy_res)
        if (err) { option = <span class="red">创建失败（{err}）</span>}
        else if(row.policy_res) { option = <span class="red">创建失败（错误码：{row.policy_res}）</span>}
        else { option = <span class="red">创建失败</span>}
      } else if (row.status == 3) {
        option =<span class="wathet">删除中</span>
      } else if (row.status == 4) {
        option =<span class="green">已删除</span>
      } else if (row.status == 5) {
        var err =  errorValue(row.policy_res)
        if (err) { option = <span class="red">删除失败（{err}）</span>}
        else if(row.policy_res) { option = <span class="red">删除失败（错误码：{row.policy_res}）</span>}
        else { option = <span class="red">删除失败</span>}
      } else if (row.status == 6) {
        option =<span class="wathet">采集信息中</span>
      } else if (row.status == 7) {
        option =<span class="green">采集完成</span>
      } else if (row.status == 8) {
        var err =  errorValue(row.policy_res)
        if (err) { option = <span class="red">采集失败（{err}）</span>}
        else if(row.policy_res) { option = <span class="red">采集失败（错误码：{row.policy_res}）</span>}
        else { option = <span class="red">采集失败</span>}
      }  else {
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
    addIdentity() {
      this.$refs.poplay.diaOpen()
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
    del(row){
      var that = this
      this.$confirm("此操作将永久删除该数据，是否继续？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sys/deleteLProcessIdentity?i_id="+row.i_id,method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
          if(res.status==0) {
            that.addSuccess()
            this.$message({showClose: true, message: '删除成功', type: 'success'});
          } else {
            // this.$message({ showClose: true, message: res.errormessage, type: 'error'});
          }
        })
      }).catch(res => {})
    },
    deleteLProcessIdentityInfo(row){
      var that = this
      this.$confirm("此操作将永久删除该数据，是否继续？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sys/deleteLProcessIdentityInfo?i_id="+row.i_id,method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
          if(res.status==0) {
            that.addSuccess()
            this.$message({showClose: true, message: '删除成功', type: 'success'});
          } else {
            // this.$message({ showClose: true, message: res.errormessage, type: 'error'});
          }
        })
      }).catch(res => {})
    },
    configure(row) {
      // console.log(row)
      this.$refs.configure.diaOpen(row)
    },
    reacquisition(row) {
      // console.log(row)
      this.$confirm("是否重新采集信息？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sys/informationMonitoring",method: "post",
          data: {
            node_id:row.node_id,
            name:row.name,
            path:row.path,
          },
        }).then((response) => {
          var res = response.data
          // console.log(res)
          if(res.status==0) {
            that.addSuccess()
            this.$message({showClose: true, message: '操作成功', type: 'success'});
          } else {
            // this.$message({ showClose: true, message: res.errormessage, type: 'error'});
          }
        })
      }).catch(res => {})
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
      }, 3000);
    },
    resetForm (){
      this.formInline.endDate =''
      this.formInline = Object.assign({}, undefined);
      this.$refs.formInline.resetFields();
    },
     //查看里面的表格
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
      this.i_id = row.i_id
      if (expandedRows.length) {
        that.expands = []
        if (row) {
          that.expands.push(row.i_id)
        }
      } else {
        that.expands = []
      }
      // this.expandData = []
      // console.log(row)
      request({
        url: '/sys/searchProIdenByID?i_id='+row.i_id,
        method: 'post',
      }).then((response) => {
        var res = response.data
        // console.log(res)
        if(res.object) {
          let hashArr = Array.from(new Set(res.object.hashs))
          hashArr.map((item, index) => {
            if (index === 0) {
              that.expandData.push(
                Object.assign( {hash: item,category :"主程序"})
              ) 
            } else {
              that.expandData.push(
                Object.assign( {hash: item,category :"共享库"})
              ) 
            }
          })
        } else {
          that.expandData = []
        }
        that.total1 = that.expandData.length
        if(that.expandData.length ==0) {
          that.emptytxt1 = true
        } else {
          that.emptytxt1 = false
        }
      })
    },
    initSee () {
      var that = this
      this.expandData = []
      request({
        url: '/sys/searchProIdenByID?i_id='+that.i_id,
        method: 'post',
      }).then((response) => {
        var res = response.data
        // console.log(res)
        if(res.object) {
          let hashArr = Array.from(new Set(res.object.hashs))
          hashArr.map((item, index) => {
            if (index === 0) {
              that.expandData.push(
                Object.assign( {hash: item,category :"主程序"})
              ) 
            } else {
              that.expandData.push(
                Object.assign( {hash: item,category :"共享库"})
              ) 
            }
          })
        } else {
          that.expandData = []
        }
        that.total1 = that.expandData.length
        if(that.expandData.length ==0) {
          that.emptytxt1 = true
        } else {
          that.emptytxt1 = false
        }
      })
    },
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
.expandContainer .el-table__empty-block {
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
  text-align: right!important;
  padding-right:0px!important;
  padding-left: 0!important;
}
</style>

