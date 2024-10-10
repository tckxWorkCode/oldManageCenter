<template>
  <el-dialog title="启动度量配置" top="5vh" width="65%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false">
    <el-table :data="tableData" class="diatable" stripe tooltip-effect="light" style="width: 100%;border:1px solid #F0F2F5"
    :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"  row-key="num"
     :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}" max-height="55vh" @expand-change="expandChange" :expand-row-keys="expands">
      <template slot="empty">
        <img style="" v-if="emptytxt" src="@/assets/nodata1.png" />
      </template>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <div :id="scope.row.id" class="expandTable">
            <el-table :data="expandData" width="100%" :show-header="false" size="mini">
              <el-table-column prop="hash" label="Hash" min-width="200%">
                <template slot-scope="scope" v-if="scope.row.disabled == false">
                  <el-col :span="9" :offset="12">
                    <el-col :span="22">
                      <el-input v-model="scope.row.hash" v-show="scope.row.show" size="mini" />
                      <span v-show="!scope.row.show">{{scope.row.hash}}</span>
                    </el-col>
                    <el-col :span="2">
                      <i style="color:#FF4D4F;border:0;font-size:22px;margin-left:14px" class="el-icon-remove" @click.prevent="removeDomain(scope.$index)"></i>
                    </el-col>
                  </el-col>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column type="index" :index="indexMethod" label="序号" width="50px"></el-table-column>
      <el-table-column prop="name" label="度量对象名称" min-width="140%">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" v-show="scope.row.show" size="mini" />
          <span v-show="!scope.row.show">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stage" label="度量阶段" min-width="100%">
        <template slot-scope="scope">
          <el-input v-model="scope.row.stage" v-show="scope.row.show" size="mini" />
          <span v-show="!scope.row.show">{{scope.row.stage}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hash" label="度量对象hash" min-width="200%">
        <template slot-scope="scope">
          <el-row :gutter="16">
            <el-col :span="22">
              <el-input v-model="scope.row.hash" v-show="scope.row.show" size="mini" />
              <span v-show="!scope.row.show">{{scope.row.hash}}</span>
            </el-col>
            <el-col :span="2">
              <i style="color:#1ac492;border:0;font-size:22px;" class="el-icon-circle-plus" @click="addDomain(scope.$index,scope.row)"></i>
            </el-col> 
          </el-row>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="measureTime" label="度量时间" min-width="115%"></el-table-column> -->
      <el-table-column label="操作" min-width="120%" align="center">
        <template slot-scope="scope">
          <el-button class="btnClass" plain type="success" size="mini" @click="save1(scope.row)">
            保存
          </el-button>
          <el-button class="btnClass" plain  type="warning" size="mini" @click="edit(scope.row)" >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-col :span="24">
      <el-button type="success" plain size="small" class="el-table-add-row" @click="handleAdd()" icon="el-icon-plus">
        添加
      </el-button>
    </el-col> -->
    <el-col :span="24">
      <el-pagination
        @size-change="handleSizeChange2" class="paging" align='right'
        @current-change="handleCurrentChange2"
        :current-page="currentPage2"
        :page-sizes="[10,20]" 
        :page-size="pageSize2"
        layout="total, prev, pager, next, jumper"
        :total="total2">
      </el-pagination>
    </el-col>
    <add-policy ref="poplay" @policy="updateData"></add-policy>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="canBtn" @click="diaClose">取 消</el-button>
      <el-button size="small" class="sureBtn" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
import { timeToZh } from "@/utils/timefilter";
import AddPolicy from './AddPolicy.vue'

export default {
  name: 'ConfigPop',
  components: { AddPolicy },
  data () {
    return {
      dialogFormVisible: false,
      emptytxt:'',
      tableData: [],
      currentPage2: 1, // 当前页码
      total2: 0, // 总条数
      pageSize2: 10,// 每页的数据条数
      nodeId:'',
      expands:[],
      expandData:[],
      dataList: [],
      addData:[],
      innerVisible: false
    }
  },
  methods: {
    diaOpen (param) {
      this.emptytxt = ''
      this.dialogFormVisible = true
      this.nodeId= param.nodeId
      this.dataList = []
      this.expands = []
      this.expandData = []
      this.loadData()
    },
    diaClose () {
      this.dialogFormVisible = false
    },
    loadData() {
      var that = this
      request({
        url: "/sec/lBMeasureList?node_id=" +this.nodeId,
        method: "post",
      }).then((response) => {
        var res = response.data
        // console.log(res);
        if(res.data) {
          res.data.map(function(value,index) {
            value.time = timeToZh(value.time);
            value.show = false
            value.num = index
            value.pushed = false
          })
          var arr = res.data
          that.sortArr(arr,"name")
          that.tableData = res.data
          for (var i = 0; i < that.tableData.length - 1; i++) {
            for (var j = i + 1; j < that.tableData.length; j++) {
                if (that.tableData[i].name == that.tableData[j].name) {
                    that.tableData.splice(j, 1);
                    j--;
                }
            }
          }
          that.total = res.total
        }
        if(res.total ==0) { that.emptytxt = true} 
        else { that.emptytxt = false}
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
      console.log('每页1', val)
      this.pageSize2 = val
      this.loadData()
    },
    handleCurrentChange2 (val) {
      console.log('每页2', val)
      this.currentPage2 = val
      this.loadData()
    },
    submit() {
      var that = this
      var newArr = []
      for (let item of this.dataList) {
        if (Array.isArray(item)) {
          for (let key of item) {
            newArr.push(key)
          }
        } else {
          newArr.push(key)
        }
      }
      for (let i of newArr) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      request({url: "/sec/creatBMeasurePolicy",method: "post",
        data: newArr
      }).then((response) => {
        var res = response.data
        // console.log(res)
        that.$emit("handleSuccess");
        that.diaClose()
      });
    },
    
    save1(row) {
      row.show = false;
      this.expandData.map(function(value,index) {
        value.show = false
      })
    },
    edit(row) {
      row.show = true
      this.expandData.map(function(value,index) {
        value.show = true
      })
    },
    // 添加点击按钮
    handleAdd() {
      console.log(123456789)
      this.$refs.poplay.diaOpen()
      // for (let i of this.tableData) {
      //   if (i.show) return this.$message.warning("请先保存当前编辑项");
      // }
      // this.tableData.push({
      //   name:"",
      //   stage:"",
      //   hash: "",
      //   show: true,
      //   num:this.tableData.length,
      //   pushed:true
      // });
    },
    expandChange(row,expandedRows) {
      var that = this
      // console.log(row)
      if (expandedRows.length) {
        that.expands = []
        if (row) {
          that.expands.push(row.num)
        }
      } else {
        that.expands = []
      }
      var i = that.expands.toString()
      console.log(i)
      that.expandData = this.dataList[i]
      if (typeof(that.expandData) != 'undefined') {
        that.expandData.map(function(value,index) {
          if (index == 0) {
            value.disabled = true
          } else {
            value.disabled = false
          }
        })
      }
    },
    removeDomain(index) {
      this.expandData.splice(index, 1)
    },
    addDomain(index,row) {
      console.log(this.expands)
      if (this.expands.length==0) {
        this.$message.warning("请先展开要添加的项");
      } else if (this.expands.toString() != index) {
        this.$message.warning("请展开当前要添加的项");
      } else {
        if (typeof(this.expandData) == 'undefined') {
          this.expandData = []
        }
        this.expandData.push({
          name: row.name,
          nodeId: row.nodeId,
          stage: row.stage,
          status: row.status,
          hash: "",
          show: true,
          disabled:false
        });
      }
        // this.addData = [{}]
    },
    sortArr(arr, str) {
      console.log(arr)
      var _arr = [], _t = [], _tmp;
      if (arr.length) { _tmp = arr[0][str]}
      for (var i in arr) {
        if ( arr[i][str] == _tmp) {
          _t.push(arr[i])
        } else {
          _tmp = arr[i][str];
          _arr.push(_t);
          _t = [arr[i]]
        }
      }
      _arr.push(_t)
      this.dataList = _arr
    },
    updateData(data) {
      console.log(data)
      this.tableData.push(data)
    }
  },
}
</script>

<style scoped>
.rowstyle {
  border-left:1px solid #ebeef5;
  border-right:1px solid #ebeef5;
  border-bottom:1px solid #ebeef5;
}
.rowstyle:nth-of-type(odd) {
  background-color:#fafafa
}
.rowstyle:hover{
  background-color: #CAD4E6 !important;
  cursor: pointer;
}
.itemType {
  width:175px;
  text-align:left;
  float:left;
  border-right:1px solid #ebeef5;
  height:35px;
  line-height:35px;
  padding:0px 10px;
}
.itemValue {
  float:left;
  height:35px;
  line-height:35px;
  padding:0px 10px;
}
.paging {
  margin-bottom: 18px;
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
.diatable >>> .el-table__expand-icon>.el-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: 0px;
  margin-top: 0px;
}
.diatable >>> .el-table__expand-icon {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
.diatable >>> .el-table__expand-icon .el-icon-arrow-right:before{
  content: '\e6d9'!important;
  color: #ccc;
  display: block!important;
  border: 1px solid #D8D8D8;
}
.diatable >>> .el-table__expand-icon--expanded .el-icon-arrow-right:before{
  content: '\e6d8'!important;
  color: #fff;
  background-color: #1ac492;
  border-color: #1ac492;
}
.expandTable >>> .el-table td, .el-table th.is-leaf {
  border-bottom: 0;
}
</style>
