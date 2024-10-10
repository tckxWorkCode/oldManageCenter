<template>
  <div class="main">
    <div class="container">
      <div class="topNav">
        <el-breadcrumb class="breadNav" separator="/">
          <el-breadcrumb-item class="crumb1">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">系统设置</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">管理员证书</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb2">证书下发</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="title">证书下发</div> -->
      </div>
      <div class="wrap">
        <div class="search">
          <el-form :inline="true" :model="formInline" :label-position="labelPosition" label-width="100px" ref="formInline" class="formInline" size="small" @submit.native.prevent>
            <el-form-item label="证书名称：" prop="terminalName">
              <el-input v-model="formInline.terminalName" clearable placeholder="请输入证书名称" oninput="value=value.replace(/[%]/g, '')"></el-input>
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
          <div class="tableTitle">下发证书列表</div>
          <div class="popBtn">
            <el-button class="operateBtn" size="small" @click="uploadDialog">新建</el-button>
          </div>
          <el-table :data="softwareData" size="mini" ref="softwareTable" tooltip-effect="light" style="width: 99.9%;font-size: 14px"   
             v-loading="loading" element-loading-text="加载中，请稍后"
            :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
              @sort-change='sortChange' :cell-style="{padding:'0px',color: 'rgba(0, 0, 0, 0.9)'}" :fit='true' class="softwareTable">
            <template slot="empty">
              <div>暂无数据</div>
            </template>
            <el-table-column type="index" :index="indexMethod" label="序号" width="70px"></el-table-column>
            <el-table-column prop="node_name" label="终端名称" min-width="100%" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="ip" label="网络地址"></el-table-column>
            <el-table-column prop="orther_name" label="证书别名"></el-table-column>
            <el-table-column prop="status" label="证书状态" :formatter="statusVal"></el-table-column>
            <el-table-column prop="create_time" label="创建时间" sortable='custom' :show-overflow-tooltip="true"></el-table-column>
            <!-- <el-table-column prop="start_time" label="有效期始"></el-table-column>
            <el-table-column prop="end_time" label="有效期止"></el-table-column> -->
            <el-table-column fixed="right" label="操作" header-align="left" width="150">
              <template slot-scope="scope">
                <el-button style="color:#1ac492" type="text" v-if="scope.row.status == 2||scope.row.status == 4" @click="startUsing(scope.row)">启用</el-button>
                <el-button v-else disabled type="text">启用</el-button>
                <el-button style="color:#1ac492" type="text" v-if="scope.row.status == 1||scope.row.status == 5" @click="stopUsing(scope.row)">停用</el-button>
                <el-button v-else disabled type="text">停用</el-button>
                <el-button type="text" style="color:#FF4D4F" v-if="scope.row.origin == 1 &&(scope.row.status == 0||scope.row.status == 2||scope.row.status == 4)" @click="del(scope.row)">删除</el-button>
                <el-button v-else-if="scope.row.origin != 1" type="text"></el-button>
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
    <!-- 导入文件弹出框    -->
    <issue-pop ref="poplay" @newsuccess="newsuccess"></issue-pop>
  </div>
</template>
<script>

import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
import { handleEnter,errorValue } from "@/utils/tools";
import IssuePop from './pop/IssuePop'

export default {
  name:"CertificateIssue",
  components: { IssuePop },
  data() {
    return {
      loading:false,
      labelPosition: 'right',
      formInline:{
        terminalName: '',
        startDate:'',
        endDate:'',
      },
      orderBy:'create_time desc',
      advancedSearch:true,
      advancedFlag:false,
      emptytxt:'',
      emptytxt1:'',
      softwareData:[],
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10,// 每页的数据条数
      pageShow:true,
      expands:[],
      expandData:[],
      currentPage1: 1, // 当前页码
      total1: 1, // 总条数
      pageSize1: 5,// 每页的数据条数
      certi_id:'',
      certi_name: [],
      aliasname: [],
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
      request({url: "/sys/LCertSecondPolicyList",method: "post",
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
        that.certi_name.splice(0, that.certi_name.length)
        if(res.list) {
          res.list.map(function(value,index) {
            value.create_time = timeToZh(value.create_time);
            value.start_time = timeToZh(value.start_time);
            value.end_time = timeToZh(value.end_time);
            that.certi_name.push(value.certi_name)
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
    statusVal(row) {
      var option = ""
      if (row.status == 0) {
        option =<span class="wathet">下发中</span>
      } else if (row.status == 1) {
        option =<span class="green">下发成功</span>
      } else if (row.status == 2) {
        var err =  errorValue(row.policy_res)
        if (err) { option = <span class="red">下发失败（{err}）</span>}
        else if(row.policy_res) { option = <span class="red">下发失败（错误码：{row.policy_res}）</span>}
        else { option = <span class="red">下发失败</span>}
      } else if (row.status == 3) {
        option =<span class="wathet">停用中</span>
      } else if (row.status == 4) {
        option =<span class="green">已停用</span>
      } else if (row.status == 5) {
        var err =  errorValue(row.policy_res)
        if (err) { option = <span class="red">停用失败（{err}）</span>}
        else if(row.policy_res) { option = <span class="red">停用失败（错误码：{row.policy_res}）</span>}
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
      this.$refs.poplay.diaOpen(this.certi_name, this.aliasname)
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
    newsuccess() {
      var that = this
      var num = 0
      that.autorefresh = setInterval(function () {
        num ++
        that.loadData()
        if (num > 5) {
          clearInterval(that.autorefresh)
        }
      }, 1000);
    },
    startUsing(row) {
      var that = this
      this.$confirm("此操作将启用该进程，是否继续？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sys/enableLCertSecondPolicy?id="+row.id,method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
          if(res.status==0) {
            that.newsuccess()
            this.$message({showClose: true, message: '操作成功', type: 'success'});
          }
        })
      }).catch(res => {})
    },
    stopUsing(row){
      var that = this
      this.$confirm("此操作将停用该进程，是否继续？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sys/disableLCertSecondPolicy?id="+row.id,method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
          if(res.status==0) {
            that.newsuccess()
            this.$message({showClose: true, message: '操作成功', type: 'success'});
          }
        })
      }).catch(res => {})
    },
    del(row) {
      var that = this
      this.$confirm("此操作将永久删除该数据，是否继续？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sys/deleteLCertSecondPolicy?id=" + row.id,method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
          if(res.status==0) {
            that.newsuccess()
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

</style>
