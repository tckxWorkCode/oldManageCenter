<template>
  <div class="main">
    <div class="container">
      <div class="topNav">
        <el-breadcrumb class="breadNav" separator="/">
          <el-breadcrumb-item class="crumb1">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">系统设置</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb2">License授权</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="title">License授权</div> -->
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
          <div class="tableTitle">授权列表</div>
          <div class="popBtn">
            <el-button class="operateBtn" size="small" @click="importLicense">导入</el-button>
            <el-button class="operateBtn" size="small" @click="addLicense">新建</el-button>
          </div>
          <el-table :data="licenseData" size="mini" ref="licenseTable" tooltip-effect="light" style="width: 99.9%;font-size: 14px" 
            v-loading="loading" element-loading-text="加载中，请稍后"
            :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
            :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}" @sort-change='sortChange'   :fit='true'>
            <template slot="empty">
              <!-- <img style="" v-if="emptytxt" src="@/assets/nodata1.png" /> -->
              <div>暂无数据</div>
            </template>
            <el-table-column type="index" :index="indexMethod" label="序号" width="50px"></el-table-column>
            <el-table-column prop="node_name" label="终端名称" min-width="100%" show-overflow-tooltip></el-table-column>
            <el-table-column prop="node_ip" label="网络地址" min-width="100%"></el-table-column>
            <el-table-column prop="license_name" label="授权名称" min-width="170%"></el-table-column>
            <el-table-column prop="license_type" label="授权类型" min-width="100%">
              <template slot-scope="props">
                <span v-if="props.row.license_type == '2'">基础版</span>
                <span v-else-if="props.row.license_type == '3'">扩展版</span>
              </template>
            </el-table-column>
            <el-table-column prop="license_create_time" label="创建时间" min-width="110%" sortable='custom' show-overflow-tooltip></el-table-column>
            <el-table-column prop="license_req_time" label="上报时间" min-width="110%"></el-table-column>
            <el-table-column prop="license_authorize_name" label="授权文件名称" min-width="110%"></el-table-column>
            <el-table-column prop="license_authorize_time" label="授权导入时间" min-width="115%"></el-table-column>
            <el-table-column prop="effect_time" label="生效时间" min-width="115%"></el-table-column>
            <el-table-column prop="status" label="状态" min-width="100%">
              <template slot-scope="props">
                <span v-if="props.row.status == '0'">创建和下发请求</span>
                <span v-else-if="props.row.status == '1'">获取license请求</span>
                <span v-else-if="props.row.status == '2'">导出license请求</span>
                <span v-else-if="props.row.status == '3'">授权策略下发</span>
                <span v-else-if="props.row.status == '4'">已授权</span>
                <span v-else-if="props.row.status == '5'">授权失败</span>
                <span v-else-if="props.row.status == '6'">获取license请求验签失败</span>
                <span v-else class="grey">初始化状态</span>
              </template>
            </el-table-column>
            <el-table-column prop="valid_days" label="有效期（天）" min-width="100%"></el-table-column>
            <el-table-column width="100px" label="操作" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button style="color:#1ac492" v-if="scope.row.status == '1' || scope.row.status == '2'" @click="exportData(scope.row)" type="text">导出</el-button>
                <el-button v-else disabled type="text">导出</el-button>
                 <el-button style="color:#FF4D4F" v-if="scope.row.status != '4'" @click="delData(scope.row)" type="text">删除</el-button>
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
    <import-license ref="importLicense" @deliveData="addSuccess"></import-license>  
    <add-license ref="addLicense" @newsuccess="addSuccess"></add-license>  
  </div>
</template>
<script>

import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
import { handleEnter } from "@/utils/tools";
import ImportLicense from './pop/ImportLicense'
import AddLicense from './pop/AddLicense'


export default {
  name:"LicenseAuthorize",
  components: { ImportLicense,AddLicense },
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
      licenseData:[],
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10,// 每页的数据条数
      pageShow:true,
      orderBy:'license_create_time desc',
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
      request({url: "/sys/lTpcmAuthorizeList",method: "post",
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
        if (res.list) {
          res.list.map(function(value,index) {
            value.license_create_time = timeToZh(value.license_create_time)
            value.license_req_time = timeToZh(value.license_req_time)
            value.license_authorize_time = timeToZh(value.license_authorize_time)
            value.effect_time = timeToZh(value.effect_time)
          })
          that.licenseData = res.list
        }
        that.total = res.total
        if(res.total ==0) {that.emptytxt = true} else { that.emptytxt = false}
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
    importLicense() {
      this.$refs.importLicense.diaOpen()
    },
    addLicense() {
      this.$refs.addLicense.diaOpen()
    },
    addSuccess() {
      var that = this;
      var num = 0
      that.autorefresh = setInterval(function () {
        num ++
        that.loadData()
        if (num > 4) {
          clearInterval(that.autorefresh)
        }
      }, 1000);
    },
    ab2str(u,f) {
      var b = new Blob([u]);
      var r = new FileReader();
      r.readAsText(b, 'utf-8');
      r.onload = function (){if(f)f.call(null,r.result)}
    },
    exportData(param){
      // console.info(param)
      var that=this
      that.$message.closeAll()
      this.$confirm("确定导出此数据？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
      request({url: "/sys/export_unauthorize_license?id=" + param.id,method: "post",responseType: "arraybuffer", }).
        then((response) => {
          var res = response.data
          that.ab2str(res,function(str) {
            // console.log(str)
            if (str.indexOf("status") > -1) {
              var json = JSON.parse(str)
              that.$message({ message: json.errormessage, type: "error", showClose: true});
            } else {
              let fileNames = response.headers["filename"]
              const blob = new Blob([res],{type:'application/octet-stream'})
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
    delData(param) {
      var that = this
      that.$message.closeAll()
      var form = new FormData();
      form.append("id", param.id);
      this.$confirm("此操作将永久删除该数据，是否继续？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sys/delete_license",method: "post",data:form}).
          then((response) => {
          var res = response.data
          if(res.status == 0) {
            that.$message({ message: "操作成功!", type: "success", showClose: true,});
            that.addSuccess()
          }else {
            // that.$message({ message: response.errormessage, type: "error", duration: 0, showClose: true,});
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
