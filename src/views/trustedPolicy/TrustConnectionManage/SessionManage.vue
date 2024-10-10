<template>
  <div class="main">
    <div class="container">
      <div class="topNav">
        <el-breadcrumb class="breadNav" separator="/">
          <el-breadcrumb-item class="crumb1">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">可信连接</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb2">会话信息</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="title">会话信息</div> -->
      </div>
      <div class="wrap">
        <div class="search">
          <el-form :inline="true"  label-position="right" label-width="145px" :model="formInline" ref="formInline" class="formInline" size="small" @submit.native.prevent>
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
          <div class="tableTitle">会话信息</div>
          <el-table :data="strategyData" size="small" ref="strategyTable" tooltip-effect="light"  @sort-change='sortChange'
            v-loading="loading" element-loading-text="加载中，请稍后"
            :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
            :cell-style="{padding:'0px',color: 'rgba(0, 0, 0, 0.9)'}" style="width: 99.9%;font-size: 14px"   :fit='true'>
            <template slot="empty">
              <div>暂无数据</div>
            </template>
            <el-table-column type="index" :index="indexMethod" label="序号" width="50px"></el-table-column>
            <el-table-column prop="node_name" label="终端名称" show-overflow-tooltip min-width="100%"></el-table-column>
            <el-table-column prop="node_ip" label="网络地址"></el-table-column>
            <el-table-column prop="local_session_id" label="本地会话ID" min-width="110%" ></el-table-column>
            <el-table-column prop="peer_session_id" label="对端会话ID"></el-table-column>
            <el-table-column prop="expire_time" label="会话过期时间" sortable='custom'></el-table-column>
            <el-table-column prop="be_peer_addr" label="对端IP地址"></el-table-column>
            <el-table-column prop="is_bidir" label="双向会话">
              <template slot-scope="props">
                <span v-if="props.row.is_bidir == '0'">单向</span>
                <span v-else-if="props.row.is_bidir == '1'">双向</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" :formatter="statusVal"></el-table-column>
            <!-- <el-table-column prop="up_date" min-width="90%" label="修改时间"></el-table-column> -->
            <el-table-column label="操作" width="100px">
              <template slot-scope="scope">
                <el-button style="color:#1ac492" type="text" v-if="scope.row.status == '0' || scope.row.status == '1'" @click="breakOff(scope.row)">断开</el-button>
                <el-button v-else disabled type="text">断开</el-button>
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
  </div>
</template>
<script>

import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
import { handleEnter,errorValue } from "@/utils/tools";
export default {
  name:"SessionManage",
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
      orderBy:'expire_time desc',
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10,// 每页的数据条数
      pageShow:true,
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
      request({url: "/sec/trustSessions",method: "post",
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
            if(value) {
              var expireTime = value.expire_time+''
              if(expireTime.length == 10) {
                value.expire_time = timeToZh(value.expire_time*1000);
              } else {
                value.expire_time = timeToZh(value.expire_time);
              }
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
      if (row.status == 0 ||row.status == null) {
        option =<span class="green">正常</span>
      } 
      else if (row.status == 1) {
        option =<span class="wathet">正在断开</span>
      } else if (row.status == 2) {
        option =<span class="green">已断开</span>
      } else if (row.status == 3) {
        var err =  errorValue(row.res)
        if (err) { option = <span class="red">断开失败（{err}）</span>}
        else if(row.res) { option = <span class="red">断开失败（错误码：{row.res}）</span>}
        else { option = <span class="red">断开失败</span>}
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
    breakOff(row) {
      var that = this
      // console.log(row)
      this.$confirm("确定断开此终端？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sec/delSession?id=" + row.id, method: "post",
        }).then((response) => {
          var res = response.data
          if (res.status === 0) {
            that.loadData()
            that.$message({ message: "操作成功!",type: "success", showClose: true,});
          } else {
            // that.$message({ message: res.errormessage, type: "error", showClose: true,});
          }
        });
      }).catch(res => {})
    },
    resetForm (){
      this.formInline.endDate =''
      this.formInline = Object.assign({}, undefined);
      this.$refs.formInline.resetFields();
    },
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
