<template>
  <div class="main">
    <div class="container">
      <div class="topNav">
        <el-breadcrumb class="breadNav" separator="/">
          <el-breadcrumb-item class="crumb1">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">审计管理</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">终端审计</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb2">外设控制日志</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="title">外设控制日志</div> -->
      </div>
      <div class="wrap">
        <div class="search">
          <el-form :inline="true" label-position="right" label-width="100px" :model="formInline" ref="formInline" class="formInline" size="small" @submit.native.prevent>
            <el-form-item label="终端名称：" prop="terminalName">
              <el-input v-model="formInline.terminalName" clearable placeholder="请输入终端名称" oninput="value=value.replace(/[%]/g, '')"></el-input>
            </el-form-item>
            <el-form-item label="网络地址：" prop="ip">
              <el-input v-model="formInline.ip" clearable placeholder="请输入网络地址" oninput="value=value.replace(/[%]/g, '')"></el-input>
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
          <div class="tableTitle">日志列表</div>
          <div class="popBtn">
            <el-button class="operateBtn" size="small" @click="exportData" :disabled="peripheraLogData.length==0">导出</el-button>
          </div>
          <el-table :data="peripheraLogData" size="small" ref="startLogTable" tooltip-effect="light" 
            v-loading="loading" element-loading-text="加载中，请稍后" 
            :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
            :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}" @sort-change='sortChange' style="width: 99.9%;font-size: 14px"   :fit='true'>
            <template slot="empty">
              <div>暂无数据</div>
            </template>
            <el-table-column type="index" :index="indexMethod" label="序号" width="80px"></el-table-column>
            <el-table-column prop="nodeName" label="终端名称" min-width="80%" show-overflow-tooltip></el-table-column>
            <el-table-column prop="nodeIp" label="网络地址" min-width="80%"></el-table-column>
            <el-table-column prop="system" label="系统类型" show-overflow-tooltip>
              <template slot-scope="props">
                <span v-if="props.row.system == 'Linux' || props.row.system == 'linux'|| props.row.system == 'Unix'|| props.row.system == 'unix'">
                  <img src="@/assets/linux_icon.png"><span style="padding-left:10px">{{props.row.system}}</span>
                </span>
                <span v-else-if="props.row.system && props.row.system.indexOf('win')">
                  <img src="@/assets/windows_icon.png"> <span>{{props.row.system}}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="别名"></el-table-column>
            <el-table-column prop="deviceName" label="设备名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="venderName" label="供应商名称"></el-table-column>
            <el-table-column prop="flag" label="终端权限">
              <template slot-scope="scope">
                <span v-if="scope.row.flag == '2'">读写</span>
                <span v-else-if="scope.row.flag == '0'">不可见</span>
                <span v-else-if="scope.row.flag == '1'">只读</span>
              </template>
            </el-table-column>
            <el-table-column prop="marked" label="是否标记" min-width="100%">
              <template slot-scope="scope">
                <span v-if="scope.row.marked == '0'"><img src="@/assets/unmark.png" alt="" style="vertical-align:top"> 未标记</span>
                <span v-else-if="scope.row.marked == '1'"><img src="@/assets/marked.png" alt="" style="vertical-align:top"> 已标记</span>
              </template>
            </el-table-column>
            <el-table-column prop="action" label="动作" min-width="80%">
              <template slot-scope="props">
                <span v-if="props.row.action == '1'">插入USB外设</span>
                <span v-else-if="props.row.action == '2'">拔出USB外设</span>
                <span v-else-if="props.row.action == '3'">扫描到USB外设</span>
                <span v-else-if="props.row.action == '4'">标记USB外设</span>
                <span v-else-if="props.row.action == '5'">恢复USB外设</span>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时间" sortable='custom' min-width="100%" show-overflow-tooltip></el-table-column>
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
import { handleEnter } from "@/utils/tools";
export default {
  name:"StartMeasureLog",
  data() {
    return {
      loading:false,
      formInline:{
        terminalName: "",
        ip:"",
        startDate:"",
        endDate:"",
        systemType: "",
      },
      orderBy:'time desc',
      advancedSearch:true,
      advancedFlag:false,
      emptytxt:"",
      peripheraLogData:[],
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
      request({url: "/aud/log/udiskLog",method: "post",
        data: {
          nodeName: this.formInline.terminalName,
          ip: this.formInline.ip,
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
        if (res.list) {
          res.list.map(function(value,index) {
            value.expire_time = timeToZh(value.expire_time);
            value.time = timeToZh(value.time);
          })
          that.peripheraLogData = res.list
        }
        that.total = res.total
        if(res.total ==0) { that.emptytxt = true } else { that.emptytxt = false }
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
      if(column.order=="ascending") {
        this.orderBy = column.prop
      } else {
        this.orderBy = column.prop + " desc"
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
    ab2str(u,f) {
      var b = new Blob([u]);
      var r = new FileReader();
      r.readAsText(b, 'utf-8');
      r.onload = function (){if(f)f.call(null,r.result)}
    },
    exportData() {
      var that=this
      that.$message.closeAll()
      this.$confirm("确定导出此数据？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        var form = new FormData();
        form.append("name", this.formInline.terminalName);
        form.append("ip", this.formInline.ip);
        form.append("firstTime", this.formInline.startDate);
        form.append("lastTime", this.formInline.endDate);
        form.append("system_type", this.formInline.systemType);
        form.append("orderBy", this.orderBy);
        form.append("searchPage", 1);
        form.append("searchSize", this.total);
        request({url: "/aud/downloadUdisk",method: "post",responseType: "blob", data: form
        }).then((response) => {
          var res = response.data
          // console.log(res)
          that.ab2str(res,function(str) {
            // console.log(str)
            if (str.indexOf("status") > -1) {
              var json = JSON.parse(str)
              that.$message({ message: json.errormessage, type: "error", showClose: true});
            } else {
              let fileNameEncode = response.headers['content-disposition'].split('filename=')[1].split(';')[0]
              let fileNames = decodeURIComponent(fileNameEncode)
              const blob = new Blob([res],{type:'application/vnd.ms-excel'})
              if ('download' in document.createElement('a')) {
                const elink = document.createElement('a')
                elink.style.display = 'none'
                elink.href = URL.createObjectURL(blob)
                elink.setAttribute('download',fileNames)
                document.body.appendChild(elink)
                elink.click()
                URL.revokeObjectURL(elink.href)
                document.body.removeChild(elink)
              }
            }
          })
        })
      }).catch(res => {})
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
    resetForm (){
      this.formInline = Object.assign({}, undefined);
      this.$refs.formInline.resetFields();
      this.$set(this,'formInline',this.formInline)
    }
  }
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