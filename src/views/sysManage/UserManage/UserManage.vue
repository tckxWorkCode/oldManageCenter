<template>
  <div class="main">
    <div class="container">
      <div class="topNav">
        <el-breadcrumb class="breadNav" separator="/">
          <el-breadcrumb-item class="crumb1">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">系统设置</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb2">管理员信息</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div class="title">管理员信息</div> -->
      </div>
      <div class="wrap">
        <div class="search">
          <el-form :inline="true" label-position="right" label-width="100px"  :model="formInline" ref="formInline" class="formInline" size="small" @submit.native.prevent>
            <el-form-item label="用户名称：" prop="name">
              <el-input v-model="formInline.name" clearable placeholder="请输入用户名称"></el-input>
            </el-form-item>
            <el-form-item label="管理员类型：" prop="userType">
              <el-select v-model="formInline.userType" clearable placeholder="请选择" @change="currentSelect">
                <el-option label="所有管理员" :value="0"></el-option>
                <el-option label="审计管理员" :value="3"></el-option>
                <el-option label="安全管理员" :value="2"></el-option>
                <el-option label="系统管理员" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="advancedBtn">
              <el-button class="resetBtn" size="small" @click="resetForm">重置</el-button>
              <el-button class="searchBtn" size="small" @click="searchData">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="mainContainer">
          <div class="tableTitle">管理员信息列表</div>
          <div class="popBtn">
            <el-button class="operateBtn" size="small" @click="addUser">新增</el-button>
          </div>
          <el-table :data="userData" size="small" 
            :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
            :cell-style="{padding:'0px',color: 'rgba(0, 0, 0, 0.9)'}" @sort-change='sortChange'
            ref="userTable" tooltip-effect="light" style="width: 99.9%;font-size: 14px"   :fit='true'>
            <template slot="empty">
              <div>暂无数据</div>
            </template>
            <el-table-column type="index"  :index="indexMethod" label="序号" width="80px"></el-table-column>
            <el-table-column prop="user_id" label="用户名">
              <template slot-scope="scope">
                <a @click="openDialog(scope.row)" style="color:#1ac492;cursor:pointer">{{scope.row.user_id}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="昵称"></el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="props">
                <el-button style="color:#1ac492" type="text" @click="editPassword(props.row)">修改密码</el-button>
                <el-button style="color:#FF4D4F" type="text" v-if="userName=='system'||userName=='httcadmin'" @click="del(props.row)">删除</el-button>
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
    <div class="dialogContent" v-if="showDialog == true">
      <user-details ref="poplay" :rowMessage="rowMessage" @closeDialog="closeDialog"></user-details>
    </div>
    <div v-if="mask==true" class="mask" @click="closeDialog"></div> 
    <edit-password ref="editPop"></edit-password>
    <add-user ref="addUser" @addSuccess="addSuccess"></add-user>
  </div>
</template>
<script>

import request from "@/utils/request";
import { handleEnter } from "@/utils/tools";
import EditPassword from './pop/EditPassword.vue';
import AddUser from './pop/AddUser.vue';
import UserDetails from './pop/UserDetails';
export default {
  components: { EditPassword,AddUser,UserDetails },
  name:"UserManage",
  data() {
    return {
      formInline:{
        name: '',
        userType:'',
      },
      userType:"",
      userName:'',
      emptytxt:'',
      userData:[],
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10,// 每页的数据条数
      pageShow:true,
      showDialog:false,
      mask:false,
      rowMessage:{},
      autorefresh:""
    };
  },
  created() {
    handleEnter(this.searchData)
  },
  mounted() {
    this.loadData()
    this.userName = localStorage.getItem('userType')
  },
  beforeDestroy() {
    document.onkeydown = null
  },
  methods: {  
    loadData() {
      var that = this
      request({url: "/sys/userSearch",method: "post",
        data: {
          condition: this.formInline.name,
          userType: this.userType,
          // userType: this.formInline.userType,
          searchPage: this.currentPage,
          searchSize: this.pageSize,
        }
      }).then((response) => {
        var res = response.data
        // console.log(res)
        that.userData = res.list
        that.total = res.total
        if(res.total ==0) { that.emptytxt = true} else { that.emptytxt = false}
      });
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
    // 新增用户
    addUser() {
      this.$refs.addUser.diaOpen()
    },
    addSuccess() {
      this.loadData()
    },
    openDialog(row) {
      // console.log(row)
      this.showDialog = true
      this.rowMessage = row
      this.mask = true
    },
    closeDialog() {
      this.showDialog = false
      this.mask = false
    },
    editPassword(param) { // 修改密码
      this.$refs.editPop.diaOpen(param)
    },
    del(param) {
      // console.log(param.user_id)
      var that = this
      this.$confirm("此操作将永久删除该数据，是否继续？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
        request({url: "/sys/userDel?user_id="+param.user_id,method: "post",
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
      this.userType = ""
      this.$refs.formInline.resetFields();
    },
    newsuccess() {
      var that = this
      var num = 0
      that.autorefresh = setInterval(function () {
        num ++
        that.loadData()
        if (num > 4) {
          clearInterval(that.autorefresh)
        }
      }, 1000);
    },
    currentSelect(value) {
      if (value == ""||value == 0) {
        this.userType = ""
      } else {
        this.userType = parseInt(value)
      }
     
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