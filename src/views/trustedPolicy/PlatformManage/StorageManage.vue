<template>
  <div class="main">
    <div class="container">
      <div class="topNav">
        <el-breadcrumb class="breadNav" separator="/">
          <el-breadcrumb-item class="crumb1">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">可信存储</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb2">可信存储管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="title">存储管理</div> -->
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
          <div class="tableTitle">存储管理</div>
          <div class="popBtn">
            <el-button class="operateBtn" size="small" @click="addStorage">新建</el-button>
          </div>
          <el-table :data="terminalData" ref="terminalTable" tooltip-effect="light" style="width: 99.9%;font-size: 14px" 
             :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
            :cell-style="{padding:'0px',color: 'rgba(0, 0, 0, 0.9)'}" v-loading="loading" element-loading-text="加载中，请稍后"
            @sort-change='sortChange'>
            <template slot="empty">
              <div>暂无数据</div>
            </template>
            <el-table-column type="index" :index="indexMethod" label="序号" width="50px"></el-table-column>
            <el-table-column prop="nodeName" label="终端名称" min-width="110%" show-overflow-tooltip></el-table-column>
            <el-table-column prop="nodeIp" label="网络地址" min-width="110%"></el-table-column>
            <el-table-column prop="name" label="存储区域名称" min-width="100%">
              <!-- <template slot="header">
                <div class="nowrap">存储区域</div>
                <div>名称</div>
              </template> -->
            </el-table-column>
            <el-table-column prop="size" label="存储区域大小(字节)" min-width="100%">
              <template slot="header">
                <div class="nowrap">存储区域大小</div>
                <div>(字节)</div>
              </template>
            </el-table-column>
            <el-table-column prop="authPasswd" label="密钥认证方式" min-width="100%">
              <template slot-scope="props">
                <span v-if="props.row.authPasswd=='0'">不需要</span>
                <span v-else-if="props.row.authPasswd=='1'">需要</span>
              </template>
            </el-table-column>
            <el-table-column prop="authProcess" label="进程身份认证" min-width="100%">
              <template slot-scope="props">
                <span v-if="props.row.authProcess=='0'">不需要</span>
                <span v-else-if="props.row.authProcess=='1'">进程身份认证</span>
                <span v-else-if="props.row.authProcess=='2'">进程角色认证</span>
              </template>
            </el-table-column>
            <el-table-column prop="processName" label="进程身份名称" min-width="100%"></el-table-column>
            <el-table-column prop="authUser" label="用户认证方式" min-width="100%">
              <template slot-scope="props">
                <span v-if="props.row.authUser=='0'">不需要</span>
                <span v-else-if="props.row.authUser=='1'">用户ID认证</span>
                <span v-else-if="props.row.authUser=='2'">用户组ID认证</span>
              </template>
            </el-table-column>
            <el-table-column prop="userId" label="用户认证ID" min-width="90%"></el-table-column>
            <el-table-column prop="authEnv" label="环境度量" min-width="100%">
              <template slot-scope="props">
                <span v-if="props.row.authEnv=='0'">不需要</span>
                <span v-else-if="props.row.authEnv=='1'">需要</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" min-width="100%" :formatter="statusVal"></el-table-column>
            <el-table-column prop="updateDate" :show-overflow-tooltip="true" min-width="100%" label="更新时间" sortable='custom'></el-table-column>
            <el-table-column fixed="right" label="操作" align="left" width="180px">
              <template slot-scope="props">
                <el-button style="color:#1ac492" type="text" v-if="props.row.status=='0' || props.row.status=='2' || props.row.status=='4'" @click="reissue(props.row)">重新下发</el-button>
                <!-- <el-button style="color:#1ac492" type="text" v-else-if="props.row.status=='5'" @click="reissue1(props.row)">重新下发</el-button> -->
                <el-button type="text" v-else disabled>重新下发</el-button>
                <el-button style="color:#1ac492" type="text" v-if="props.row.status=='1' || props.row.status=='5'" @click="cancellation(props.row)" >停用</el-button>
                <el-button type="text" v-else disabled>停用</el-button>
                <el-button style="color:#FF4D4F" type="text" v-if="props.row.status=='0' || props.row.status=='2' || props.row.status=='3'||
                  props.row.status=='4'" @click="del(props.row)" >删除</el-button>
                <el-button type="text" v-else disabled>删除</el-button>
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
    <add-storage ref="poplay" @addSuccess="initData"></add-storage>
    <deactivate-storage ref="deactivate" @success="initData"></deactivate-storage>
    <reissue-storage ref="reissue" @success="initData"></reissue-storage>
  </div>
</template>
<script>

import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
import { handleEnter,errorValue } from "@/utils/tools";
import AddStorage from './pop/AddStorage.vue';
import DeactivateStorage from './pop/DeactivateStorage.vue'
import ReissueStorage from './pop/ReissueStorage.vue'
export default {
  name:"ProcessIdentity",
  components: { AddStorage,DeactivateStorage,ReissueStorage},
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
    loadData() {
      var that = this
      this.loading = true
      request({url: "/sec/storageList",method: "post",
        data: {
          condition: this.formInline.terminalName,
          firstTime: this.formInline.startDate,
          lastTime: this.formInline.endDate,
          system_type:"1",
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
            value.updateDate = timeToZh(value.updateDate);
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
    addStorage() {
      this.$refs.poplay.diaOpen()
    },
    initData() {
      var that = this;
      var num = 0
      that.autorefresh = setInterval(function () {
        num ++
        that.loadData()
        if (num > 7) {
          clearInterval(that.autorefresh)
        }
      }, 3000);
    },
    reissue(row) {
      this.$refs.reissue.diaOpen(row)
    },
    reissue1(row) {
      var that = this
      // console.log(row)
      this.$prompt("重新下发存储空间？请输入密码：","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(({value}) => {
        request({url: "/sec/cancelStorage?id=" + row.id +"&password=" +value,method: "post",}).
          then((response) => {
            var res = response.data
            if(res.status == 0) {
              that.$message({ message: "操作成功!", type: "success", showClose: true,});
              that.initData()
            }else {
              // that.$message({ message: res.errormessage, type: "error", duration: 0, showClose: true,});
            }
          })
      }).catch(res => {})
    },
    cancellation(row) {
      this.$refs.deactivate.diaOpen(row)
    },
    del(row){
      var that = this
      this.$confirm("此操作将永久删除该数据，是否继续？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sec/deleteStorage?id=" + row.id,method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
          if(res.status==0) {
            that.initData()
            this.$message({showClose: true, message: '删除成功', type: 'success'});
          } else {
            this.$message({ showClose: true, message: res.errormessage,duration: 0, type: 'error'});
          }
        })
      }).catch(res => {})
    },
    resetForm (){
      this.formInline.endDate =''
      this.formInline = Object.assign({}, undefined);
      this.$refs.formInline.resetFields();
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
.nowrap {
  white-space: nowrap;
}
</style>
