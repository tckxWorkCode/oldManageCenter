<template>
  <el-dialog title="查看记录" top="10vh" width="45%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false" >
    <div style="display:flex;">
      <el-form label-position="right" label-width="90px" ref="ruleForm" size="small" style="flex:2">
        <el-form-item prop="ip" label="网络地址：">
          <el-input style="width:45%" v-model="ip" clearable disabled>{{ip}}</el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-tabs v-model="activeName" type="card" class="record" @tab-click="handleClick">
      <el-tab-pane label="IP白名单" name="first">
        <el-table :data="tableData" class="diatable" stripe max-height="50vh"
        :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}">
          <el-table-column type="index" :index="indexMethod" label="序号" width="80px"></el-table-column>
          <el-table-column prop="dataFrom" label="网络地址">
            <template slot-scope="scope">
              <span>{{scope.row.dataFrom}} <span v-show="scope.row.dataFrom != scope.row.dataTo"> ~ {{scope.row.dataTo}}</span></span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange2" class="paging" align='right'
          @current-change="handleCurrentChange2"
          :current-page="currentPage2"
          :page-sizes="[10,20]" 
          :page-size="pageSize2"
          layout="total, prev, pager, next, jumper"
          :total="total2">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="IP黑名单" name="second">
        <!-- :data="tableData2.slice((currentPage3-1)*pageSize3,currentPage3*pageSize3)"  -->
        <el-table :data="tableData2" class="diatable" stripe tooltip-effect="light"
          :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"  row-key="num"
          :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}" max-height="50vh">
          <el-table-column type="index" :index="indexMethod2" label="序号" width="80px"></el-table-column>
          <el-table-column prop="dataFrom" label="网络地址">
            <template slot-scope="scope">
              <span>{{scope.row.dataFrom}} <span v-show="scope.row.dataFrom != scope.row.dataTo"> ~ {{scope.row.dataTo}}</span></span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange3" class="paging" align='right'
          @current-change="handleCurrentChange3"
          :current-page="currentPage3"
          :page-sizes="[10,20]" 
          :page-size="pageSize3"
          layout="total, prev, pager, next, jumper"
          :total="total3">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="端口白名单" name="third">
        <el-table :data="tableData3" class="diatable" stripe tooltip-effect="light"
        :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}" max-height="50vh">
          <el-table-column type="index" :index="indexMethod" label="序号" width="80px"></el-table-column>
          <el-table-column prop="dataFrom" label="端口号">
            <template slot-scope="scope">
              <span>{{scope.row.dataFrom}} <span v-show="scope.row.dataFrom != scope.row.dataTo"> ~ {{scope.row.dataTo}}</span></span>
            </template>
          </el-table-column>
          <el-table-column prop="isTcp" label="协议">
            <template slot-scope="scope">
              <span v-if="scope.row.isTcp == 0">UDP</span>
              <span v-else-if="scope.row.isTcp == 1">TCP</span>
              <span v-else-if="scope.row.isTcp == 2">TCP/UDP</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange4" class="paging" align='right'
          @current-change="handleCurrentChange4"
          :current-page="currentPage4"
          :page-sizes="[10,20]" 
          :page-size="pageSize4"
          layout="total, prev, pager, next, jumper"
          :total="total4">
        </el-pagination>  
      </el-tab-pane>
      <el-tab-pane label="端口黑名单" name="forth">
        <el-table :data="tableData4" class="diatable" stripe tooltip-effect="light"
        :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}" max-height="50vh">
          <el-table-column type="index" :index="indexMethod" label="序号" width="80px"></el-table-column>
          <el-table-column prop="dataFrom" label="端口号">
            <template slot-scope="scope">
              <span>{{scope.row.dataFrom}} <span v-show="scope.row.dataFrom != scope.row.dataTo"> ~ {{scope.row.dataTo}}</span></span>
            </template>
          </el-table-column>
          <el-table-column prop="isTcp" label="协议">
            <template slot-scope="scope">
              <span v-if="scope.row.isTcp == 0">UDP</span>
              <span v-else-if="scope.row.isTcp == 1">TCP</span>
              <span v-else-if="scope.row.isTcp == 2">TCP/UDP</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange5" class="paging" align='right'
          @current-change="handleCurrentChange5"
          :current-page="currentPage5"
          :page-sizes="[10,20]" 
          :page-size="pageSize5"
          layout="total, prev, pager, next, jumper"
          :total="total5">
        </el-pagination>  
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="canBtn" @click="diaClose">取 消</el-button>
      <el-button size="small" class="sureBtn" @click="diaClose">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
import { timeToZh } from "@/utils/timefilter";

export default {
  name: 'ConfigPop',
  data () {
    return {
      dialogFormVisible: false,
      dialogVisible1:false,
      ip:"",
      nodeId:'',
      isBlack: "",
      isPort:"",

      activeName: 'first',
      tableData: [],
      currentPage2: 1, // 当前页码
      total2: 0, // 总条数
      pageSize2: 10,// 每页的数据条数

      
      
      tableData2: [],
      currentPage3: 1, // 当前页码
      total3: 0, // 总条数
      pageSize3: 10,// 每页的数据条数

      tableData3: [],
      currentPage4: 1, // 当前页码
      total4: 0, // 总条数
      pageSize4: 10,// 每页的数据条数

      tableData4: [],
      currentPage5: 1, // 当前页码
      total5: 0, // 总条数
      pageSize5: 10,// 每页的数据条数
    }
  },
  methods: {
    diaOpen (param) {
      console.log(param)
      var that = this
      this.dialogFormVisible = true
      this.activeName = 'first'
      this.ip = param.nodeIp
      this.isBlack = 0
      this.isPort = 0
      
      this.tableData = []
      this.tableData2 = []
      this.nodeId= param.nodeId
      this.loadData(0,0,0,this.currentPage2,this.pageSize2)
    },
    diaClose () {
      var that = this
      that.dialogFormVisible = false
    },
    handleClick(tab, event) {
      if (tab.index == "0") {
        this.loadData(0,0,0,this.currentPage2,this.pageSize2)
      } else if (tab.index == "1") {
        this.loadData(1,0,1,this.currentPage3,this.pageSize3)
      } else if (tab.index == "2") {
        this.loadData(0,1,2,this.currentPage4,this.pageSize4)
      } else if (tab.index == "3") {
        this.loadData(1,1,3,this.currentPage5,this.pageSize5)
      }
    },
    loadData(isBlack,isPort,tab,currentPage,pageSize) {
      var that = this
      request({ url: "/sec/networkDetail", method: "post",
        data: {
          isBlack: isBlack,
          isPort: isPort,
          nodeId:this.nodeId,
          searchPage: currentPage,
          searchSize: pageSize,
        }
      }).then((response) => {
        var res = response.data
        console.log(res)
        if (tab == 0) {
          that.tableData = res.list
          that.total2 = res.total
        } else if (tab == 1) {
          that.tableData2 = res.list
          that.total3 = res.total
        } else if (tab == 2) {
          that.tableData3 = res.list
          that.total4 = res.total
        } else if (tab == 3) {
          that.tableData4 = res.list
          that.total5 = res.total
        }
      });
    },
    //first IP白名单
    indexMethod(index) {
      if (this.currentPage2 === 1) {
        if(index < 9) {
          return '0' + ( index + 1 )
        } else {
          return index + 1
        }
      } else {
        return ( index + 1 ) + this.pageSize2 * (this.currentPage2 - 1)
      }
    },
    handleSizeChange2 (val) {
      this.pageSize2 = val
      this.loadData(0,0,0,this.currentPage2,this.pageSize2)
    },
    handleCurrentChange2 (val) {
      this.currentPage2 = val
      this.loadData(0,0,0,this.currentPage2,this.pageSize2)
    },
    //second IP黑名单
    indexMethod2(index) {
      if (this.currentPage3 === 1) {
        if(index < 9) {
          return '0' + ( index + 1 )
        } else {
          return index + 1
        }
      } else {
        return ( index + 1 ) + this.pageSize3 * (this.currentPage3 - 1)
      }
    },
    
    handleSizeChange3 (val) {
      var that = this
      this.pageSize3 = val
      this.loadData(1,0,1,this.currentPage3,this.pageSize3)
    },
    handleCurrentChange3 (val) {
      var that = this
      this.currentPage3 = val
      this.loadData(1,0,1,this.currentPage3,this.pageSize3)
    },
    //third 端口白名单
    indexMethod3(index) {
      if (this.currentPage4 === 1) {
        if(index < 9) {
          return '0' + ( index + 1 )
        } else {
          return index + 1
        }
      } else {
        return ( index + 1 ) + this.pageSize4 * (this.currentPage4 - 1)
      }
    },
    handleSizeChange4 (val) {
      // console.log('每页1', val)
      this.pageSize4 = val
      this.loadData(0,1,2,this.currentPage4,this.pageSize4)
    },
    handleCurrentChange4 (val) {
      // console.log('每页2', val)
      this.currentPage4 = val
      this.loadData(0,1,2,this.currentPage4,this.pageSize4)
    },
    //forth 端口黑名单
    indexMethod4(index) {
      if (this.currentPage5 === 1) {
        if(index < 9) {
          return '0' + ( index + 1 )
        } else {
          return index + 1
        }
      } else {
        return ( index + 1 ) + this.pageSize5 * (this.currentPage5 - 1)
      }
    },
    handleSizeChange5 (val) {
      // console.log('每页1', val)
      this.pageSize5 = val
      this.loadData(1,1,3,this.currentPage5,this.pageSize5)
    },
    handleCurrentChange5 (val) {
      // console.log('每页2', val)
      this.currentPage5 = val
      this.loadData(1,1,3,this.currentPage5,this.pageSize5)
    },
  },
}
</script>

<style scoped>
.paging {
  margin: 18px 0 0 0;
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
.paging >>>.el-pager li.active, .paging >>>.el-pager li:hover{
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
.dialog-footer .sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff;
}
.diatable {
  width: 100%;
  border:1px solid #F0F2F5;
  margin-top: 10px;
}
</style>

<style>
.record .el-tabs__item.is-active {
  color: #1ac492!important;
}
.record .el-tabs__item:hover {
  color: #1ac492!important;
}
</style>
