<template>
  <el-dialog title="查看在线设备清单明细表" top="5vh" width="65%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false" >
    <div style="display:flex;">
      <el-form label-position="right" label-width="90px" ref="ruleForm" size="small" style="flex:2">
        <el-form-item prop="ip" label="网络地址：">
          <el-input style="width:45%" v-model="ip" clearable disabled>{{ip}}</el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="mark">
      <div>
        <img src="@/assets/unmark.png" alt="" style="vertical-align:top"> <span>待标记：</span><span>{{this.tableData.length}}</span>
      </div>
      <div>
        <img src="@/assets/marked.png" alt="" style="vertical-align:top"> <span>已标记：</span><span>{{this.tableData2.length}}</span>
      </div>
    </div>
    <el-tabs v-model="activeName" type="card" class="record">
      <el-tab-pane label="待标记" name="first">
        <el-table :data="tableData.slice((currentPage2-1)*pageSize2,currentPage2*pageSize2)" class="diatable" stripe tooltip-effect="light"
        :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}" max-height="50vh">
          <template slot="empty">
            <img style="" v-if="emptytxt" src="@/assets/nodata1.png" />
          </template>
          <el-table-column type="index" :index="indexMethod" label="序号" width="50px"></el-table-column>
          <el-table-column prop="guid" label="设备ID"></el-table-column>
          <el-table-column prop="name" label="别名"></el-table-column>
          <el-table-column prop="deviceName" label="设备名称"></el-table-column>
          <el-table-column prop="venderName" label="供应商名称"></el-table-column>
          <el-table-column prop="isMarked" label="标记状态">
            <template >
              <img src="@/assets/unmark.png" alt="" style="vertical-align:top"> <span>未标记</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <el-button size="small"  class="saveBtn"  @click="sign(scope.row)">标记</el-button>
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
      <el-tab-pane label="已标记" name="second">
        <!-- :data="tableData2.slice((currentPage3-1)*pageSize3,currentPage3*pageSize3)"  -->
        <el-table :data="tableData2.slice((currentPage3-1)*pageSize3,currentPage3*pageSize3)" class="diatable" stripe tooltip-effect="light"
          :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"  row-key="num"
          :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}" max-height="50vh">
          <template slot="empty">
            <img style="" v-if="emptytxt2" src="@/assets/nodata1.png" />
          </template>
          <el-table-column type="index" :index="indexMethod2" label="序号" width="50px"></el-table-column>
          <el-table-column prop="guid" label="设备ID"></el-table-column>
          <el-table-column prop="name" label="别名"></el-table-column>
          <el-table-column prop="deviceName" label="设备名称"></el-table-column>
          <el-table-column prop="venderName" label="供应商名称"></el-table-column>
          <el-table-column prop="isMarked" label="标记状态">
            <template>
              <img src="@/assets/marked.png" alt="" style="vertical-align:top"> <span>已标记</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <el-button size="small" class="saveBtn" @click="editOthername(scope.row)">修改别名</el-button>
              <el-button size="small" class="certainBtn" @click="recover(scope.row)">恢复</el-button>
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
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-row>
        <el-col :span="16">
          <div class="tipText">进行恢复操作需要重新插拔U盘</div>
        </el-col>
        <el-col :span="8">
          <el-button size="small" class="canBtn" @click="diaClose">取 消</el-button>
        </el-col>
      </el-row>
      <!-- <el-button size="small" class="sureBtn" @click="submit">保 存</el-button> -->
    </div>
    <!-- 弹出层 -->
    <mark-equipment ref="sign" @success="signSuccess"></mark-equipment>
    <edit-othername ref="edit" @success="editSuccess"></edit-othername>

    <el-dialog title="提示" :visible.sync="dialogVisible1" width="30%" top="30vh" append-to-body>
      <div style="text-align:center;font-size:18px;margin:20px 0;color:#000">
        <img src="@/assets/tips.png" alt="" style="vertical-align:middle">  您确定要恢复标记前初始状态吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible1 = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
import { timeToZh } from "@/utils/timefilter";
import MarkEquipment from "./MarkEquipment.vue"
import EditOthername from "./EditOthername.vue"

export default {
  name: 'ConfigPop',
  components: { MarkEquipment,EditOthername},
  data () {
    return {
      dialogFormVisible: false,
      dialogVisible1:false,
      ip:"",
      activeName: 'first',
      emptytxt:'',
      tableData: [{name:"1"}],
      currentPage2: 1, // 当前页码
      total2: 0, // 总条数
      pageSize2: 10,// 每页的数据条数
      nodeId:'',
      
      emptytxt2:'',
      tableData2: [{name:"1"}],
      currentPage3: 1, // 当前页码
      total3: 0, // 总条数
      pageSize3: 10,// 每页的数据条数

      guid:"",
      autorefresh:""
    }
  },
  methods: {
    diaOpen (param) {
      console.log(param)
      var that = this
      this.dialogFormVisible = true
      this.activeName = 'first'
      this.ip = param.ip
      this.emptytxt = ''
      this.emptytxt2 = ''
      
      this.tableData = []
      this.tableData2 = []
      this.nodeId= param.nodeId
      this.loadData()
    },
    diaClose () {
      var that = this
      that.dialogFormVisible = false
    },
    //first 待标记
    loadData() {
      var that = this
      request({ url: "/getOnlineUdisk?node_id=" +this.nodeId, method: "post",
      }).then((response) => {
        var res = response.data
        if (res.status == 0) {
          that.initData()
        }
      });
    },
    initData() {
      var that = this;
      var num = 0
      that.autorefresh = setInterval(function () {
        num ++
        that.loadOnlineData()
        if (num > 5) {
          clearInterval(that.autorefresh)
        }
      }, 2000);
    },
    loadOnlineData() {
      var that = this
      request({ url: "/searchOnlineUdiskInfo?node_id=" +this.nodeId, method: "post",
      }).then((response) => {
        var res = response.data
        // console.log(res);
        if(res.data) {
          that.tableData = res.data.filter(item => {
            return item.isMarked == 0
          })
          that.tableData2 = res.data.filter(item => {
            return item.isMarked == 1
          })
          that.total2 = that.tableData.length
          that.total3 = that.tableData2.length
          clearInterval(that.autorefresh)
        }
        if(res.total2 ==0) { that.emptytxt = true} 
        else { that.emptytxt = false}
        if(res.total3 ==0) { that.emptytxt2 = true} 
        else { that.emptytxt2 = false}
      });
    },
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
    },
    handleCurrentChange2 (val) {
      this.currentPage2 = val
    },
    sign(row) {
      this.$refs.sign.diaOpen(row)
    },
    signSuccess() {
      this.initData()
    },
    //second 已标记列表
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
      // console.log('每页1', val)
      var that = this
      this.pageSize3 = val
    },
    handleCurrentChange3 (val) {
      // console.log('每页2', val)
      var that = this
      this.currentPage3 = val
    },
    editOthername(row) {
      this.$refs.edit.diaOpen(row)
    },
    editSuccess() {
      this.initData()
    },
    recover(row) {
      this.dialogVisible1= true
      this.guid = row.guid
    },
    submit() {
      var that = this
    },
    confirm() {
      var that = this
      var datas = {
        guid: this.guid,
      }
      request({ url: '/recoverUdisk', data:datas, method: 'post'
        }).then((response) => {
          var res = response.data
          if (res.status === 0) {
            that.$message({message: '操作成功!', type: 'success', showClose: true })
            that.dialogVisible1= false
            that.loadData()
          } else {
            that.btnvalue1 = false
          }
        })
    }
  },
  destroyed() {
    clearInterval(this.autorefresh);
  },
}
</script>

<style scoped>
.tipText {
  color: #aaa;
  text-align: left;
  line-height: 32px;
  padding-left: 10px;
}
.mark {
  position: absolute;
  top: 140px;
  right: 40px;
  display: flex;
}
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
.el-table-add-row {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  border-radius: 3px;
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
.saveBtn {
  color: #67c23a;
  background: #f0f9eb;
  border-color: #c2e7b0;
  padding:8px 16px
}
.saveBtn:active {
  background: #5daf34;
  border-color: #5daf34;
  color: #fff;
  outline: none;
}
.saveBtn:hover, .saveBtn:focus  {
  background: #67c23a;
  border-color: #67c23a;
  color: #fff;  
}
.editBtn {
  color:#e6a23c;background: #fdf6ec;border-color: #f5dab1;padding:8px
}
.editBtn:hover, .editBtn:focus  {
  background: #e6a23c;
  border-color: #e6a23c;
  color: #fff; 
}
.editBtn:active {
  background: #cf9236;
  border-color: #cf9236;
  color: #fff;
  outline: none;
}
.certainBtn {
  color:#409eff;background: #ecf5ff;border-color: #b3d8ff;padding:8px 16px
}
.certainBtn:hover, .certainBtn:focus {
  background: #409eff;
  border-color: #409eff;
  color: #fff; 
}
.certainBtn:active {
  background: #3a8ee6;
  border-color: #3a8ee6;
  color: #fff;
  outline: none;
}
.cancelBtn {
  padding:8px;
  color: #f56c6c;
  background: #fef0f0;
  border-color: #fbc4c4;
}
.cancelBtn:hover, .cancelBtn:focus{
  background: #f56c6c;
  border-color: #f56c6c;
  color: #fff;
}
.cancelBtn:active {
  background: #dd6161;
  border-color: #dd6161;
  color: #fff;
  outline: none;
}
.errorTips >>>.el-input__inner{
  border-color: #dd6161;
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
