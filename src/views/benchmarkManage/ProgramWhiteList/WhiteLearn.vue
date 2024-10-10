<template>
  <div class="main">
    <div class="container">
      <div class="topNav">
        <el-breadcrumb class="breadNav" separator="/">
          <el-breadcrumb-item class="crumb1">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">策略管理</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">程序白名单</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb2">白名单学习</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="title">白名单学习</div> -->
      </div>
      <div class="wrap">
        <div class="search">
          <el-form :inline="true" label-position="right" label-width="90px" :model="formInline" ref="formInline" class="formInline" size="small" @submit.native.prevent>
            <el-form-item label="终端名称/网络地址：" prop="terminalName" label-width="145px">
              <el-input v-model="formInline.terminalName" clearable placeholder="请输入终端名称/网络地址" oninput="value=value.replace(/[%]/g, '')"></el-input>
            </el-form-item>
            <el-form-item label="系统类型：" prop="systemType" v-show="advancedSearch==true">
              <el-select v-model="formInline.systemType" clearable placeholder="请选择">
                <el-option label="所有系统" value="0"></el-option>
                <el-option label="Linux系统" value="1"></el-option>
                <el-option label="Windows系统" value="2"></el-option>
              </el-select>
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
          <div class="tableTitle">白名单列表</div>
          <div class="popBtn">
            <el-button class="operateBtn" size="small" @click="startLearn">开始学习</el-button>
          </div>
          <el-table :data="whiteLearnData" size="small" ref="whiteLearnTable" tooltip-effect="light" style="width: 99.9%;font-size: 14px" 
             v-loading="loading" element-loading-text="加载中，请稍后"
            :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
            :cell-style="{padding:'0px',color: 'rgba(0, 0, 0, 0.9)'}" 
             @sort-change='sortChange'   :fit='true'>
            <template slot="empty">
              <div>暂无数据</div>
            </template>
            <el-table-column type="index" :index="indexMethod" label="序号" width="50px"></el-table-column>
            <el-table-column prop="name" label="终端名称" min-width="120%" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ip" label="网络地址" min-width="100%"></el-table-column>
            <el-table-column prop="system" label="系统类型" min-width="100%">
              <template slot-scope="props">
                <span v-if="props.row.system == 'Linux' || props.row.system == 'linux'|| props.row.system == 'Unix'|| props.row.system == 'unix'">
                  <img src="@/assets/linux_icon.png"><span style="padding-left:10px">{{props.row.system}}</span>
                </span>
                <span v-else-if="props.row.system && props.row.system.indexOf('win')">
                  <img src="@/assets/windows_icon.png"> <span>{{props.row.system}}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="learnStatus" label="学习状态" min-width="100%" :formatter="statusVal"></el-table-column>
            <el-table-column prop="learnStartTime" label="学习开始时间" sortable='custom' min-width="100%" show-overflow-tooltip></el-table-column>
            <el-table-column prop="learnEndTime" label="学习结束时间" sortable='custom' min-width="100%" show-overflow-tooltip></el-table-column>
            <el-table-column fixed="right" label="操作" align="left" min-width="100%">
              <template slot-scope="props">
                <el-button style="color:#1ac492" v-if="props.row.learnStatus == '1'" type="text" @click="endLearn(props.row)" >结束学习</el-button>
                <el-button v-else disabled type="text">结束学习</el-button>
                &nbsp;&nbsp;
                <el-dropdown placement="bottom-start">
                  <el-button style="color:#1ac492" type="text">更多操作</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><el-button style="color:#1ac492" type="text" @click="viewLog(props.row)">查看学习日志</el-button></el-dropdown-item>
                    <el-dropdown-item><el-button style="color:#1ac492" type="text" @click="createTemplate(props.row)">创建程序包模板</el-button></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
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
    <start-learn ref="poplay" @success="success"></start-learn> 
    <create-template ref="template" @success="loadData"></create-template>
    <view-log ref="viewLog"></view-log>
  </div>
</template>
<script>

import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
import { handleEnter, errorValue} from "@/utils/tools";
import StartLearn from "./pop/StartLearn.vue";
import CreateTemplate from "./pop/CreateTemplate.vue";
import ViewLog from "./pop/ViewLog.vue";

export default {
  name:"whiteLearn",
  components: { StartLearn, CreateTemplate, ViewLog },
  data() {
    return {
      loading:false,
      formInline:{
        terminalName: '',
        systemType:'',
        startDate:'',
        endDate:'',
      },
      orderBy:'learn_start_time desc',
      advancedSearch:true,
      advancedFlag:false,
      emptytxt:'',
      whiteLearnData:[],
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
      that.loading = true
      request({url: "/sec/whiteListLearnSearch",method: "post",
        data: {
          condition: this.formInline.terminalName,
          firstTime: this.formInline.startDate,
          lastTime: this.formInline.endDate,
          system_type: this.formInline.systemType,
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
            value.learnStartTime =  timeToZh(value.learnStartTime);
            value.learnEndTime =  timeToZh(value.learnEndTime);
          })
          that.total = res.total
          that.whiteLearnData = res.list
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
    statusVal(row) {
      var option = ""
      if (row.learnStatus == 0) {
        option =<span class="wathet">关闭成功</span>
      } else if (row.learnStatus == 1) {
        option =<span class="green">开启成功</span>
      } else if (row.learnStatus == 2) {
        option =<span class="wathet">正在开启</span>
      } else if (row.learnStatus == 3) {
        option =<span class="green">正在关闭</span>
      } else if (row.learnStatus == 4) {
        var err =  errorValue(row.learnRes)
        if (err) { option = <span class="red">开启失败（{err}）</span>}
        else if(row.learnRes) { option = <span class="red">开启失败（错误码：{row.learnRes}）</span>}
        else { option = <span class="red">开启失败</span>}
      } else if (row.learnStatus == 5) {
        var err =  errorValue(row.learnRes)
        if (err) { option = <span class="red">关闭失败（{err}）</span>}
        else if(row.learnRes) { option = <span class="red">关闭失败（错误码：{row.learnRes}）</span>}
        else { option = <span class="red">关闭失败</span>}
      } else {
        option =<span class="grey">初始化状态</span>
      }
      return option
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
      this.loadData()
    },
    startLearn() {
      this.$refs.poplay.diaOpen()
    },
    endLearn(row) {
      // console.log(row)
      var that = this
      var formData = new FormData()
      formData.append("node_id", row.learnNodeId);
      formData.append("bypass_switch", "1");
      formData.append("learn_id", row.learnId);
      this.$confirm("确定要结束学习吗？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sec/whiteListLearnSwitch",method: "post",
          data:formData 
        }).then((response) => {
          var res = response.data
          // console.log(res)
          if (res.status === 0) {
            that.success()
            that.$message({ message: "操作成功!", type: "success", showClose: true,});
          } else {
            // that.$message({ message: res.errormessage, type: "error", duration: 0, showClose: true,});
          }
        });
      }).catch(res => {})
    },
    viewLog(row) {
      // console.log(row)
      this.$refs.viewLog.diaOpen(row)
    },
    createTemplate(row) {
      // console.log(row)
      this.$refs.template.diaOpen(row)
    },
    resetForm (){
      this.formInline.endDate =''
      this.formInline = Object.assign({}, undefined);
      this.$refs.formInline.resetFields();
    },
    success() {
      var that = this
      var num = 0
      that.autorefresh = setInterval(function () {
        num ++
        that.loadData()
        if (num > 5) {
          clearInterval(that.autorefresh)
        }
      }, 2000);
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
.paging >>>.el-pager li.active,.paging >>>.el-pager li:hover{
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
