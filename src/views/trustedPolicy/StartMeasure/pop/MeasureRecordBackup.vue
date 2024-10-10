<template>
  <el-dialog title="启动度量记录" top="5vh" width="75%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false" append-to-body>
    <el-tabs v-model="activeName" type="card" class="record">
      <el-tab-pane label="度量记录" name="first">
        <div style="display:flex;">
          <el-form label-position="right" label-width="90px" ref="ruleForm" size="small" style="flex:2">
            <el-form-item prop="ip" label="网络地址：">
              <el-input style="width:45%" v-model="ip" clearable disabled>{{ip}}</el-input>
            </el-form-item>
          </el-form>
          <div class="statusTip">
            <el-button size="small" @click="getNewListRecord">获取新记录</el-button>
          </div>
        </div>
        <el-table :data="tableData.slice((currentPage2-1)*pageSize2,currentPage2*pageSize2)" class="diatable" stripe tooltip-effect="light" style="width: 100%;border:1px solid #F0F2F5"
        :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}" max-height="50vh">
          <template slot="empty">
            <img style="" v-if="emptytxt" src="@/assets/nodata1.png" />
          </template>
          <el-table-column type="index" :index="indexMethod" label="序号" width="50px"></el-table-column>
          <el-table-column prop="stage" label="度量阶段" min-width="110%">
            <template slot-scope="scope">
              <span v-if="scope.row.stage >= 0 && scope.row.stage <= 999">TPCM及度量加载器(BIOS,UBOOT)及前期固件验证</span>
              <span v-else-if="scope.row.stage >= 1000 && scope.row.stage <= 1999">加载器加载驱动、配置、操作系统或二级加载器(GRUB)</span>
              <span v-else-if="scope.row.stage >= 2000 && scope.row.stage <= 2999">二级加载器(GRUB)加载驱动、配置、操作系统</span>
              <span v-else-if="scope.row.stage >= 3000">操作系统加载驱动、配置、服务程序</span>
              <span v-else>{{scope.row.stage}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="度量对象名称" min-width="150%"></el-table-column>
          <el-table-column prop="hash" label="度量对象hash" min-width="150%"></el-table-column>
          <el-table-column prop="result" label="度量结果" min-width="100%">
            <template slot-scope="scope">
              <span v-if="scope.row.result =='0'">可信</span>
              <span v-else-if="scope.row.result =='1'">不可信</span>
              <span v-else-if="scope.row.result =='2'">未度量</span>
            </template>
          </el-table-column>
          <el-table-column prop="measureTime" label="度量时间" min-width="115%"></el-table-column>
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
      <el-tab-pane label="配置策略" name="second">
        <div style="display:flex">
          <el-form label-position="right" label-width="90px" ref="ruleForm" size="small" style="flex:2">
            <el-form-item prop="ip" label="网络地址：">
              <el-input style="width:45%" v-model="ip" clearable disabled>{{ip}}</el-input>
            </el-form-item>
          </el-form>
          <div>
            <el-button type="text" class="certainBtn"  @click="reAcqu(scope.row)" >重新采集</el-button>
          </div>
        </div>
        <el-table :data="tableData2.slice((currentPage3-1)*pageSize3,currentPage3*pageSize3)" class="diatable" stripe tooltip-effect="light" style="width: 100%;border:1px solid #F0F2F5"
          :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"  row-key="num"
          :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}" max-height="50vh" @expand-change="expandChange" :expand-row-keys="expands">
          <template slot="empty">
            <img style="" v-if="emptytxt2" src="@/assets/nodata1.png" />
          </template>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <div :id="scope.row.id" class="expandTable">
                <el-table :data="expandData.filter(data => data.name == scope.row.name)" width="100%" :show-header="false" size="mini">
                  <el-table-column prop="hash" label="Hash" min-width="200%">
                    <template slot-scope="scope" v-if="scope.row.disabled == false">
                      <el-col :span="8" :offset="10">
                        <el-col :span="22">
                          <el-input v-model="scope.row.hash" v-show="scope.row.show" size="mini" />
                          <span v-show="!scope.row.show">{{scope.row.hash}}</span>
                        </el-col>
                        <el-col :span="2">
                          <i style="color:#FF4D4F;border:0;font-size:22px;margin-left:14px" class="el-icon-error" @click.prevent="removeDomain(scope.$index)"></i>
                        </el-col>
                      </el-col>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </el-table-column>
          <el-table-column type="index" :index="indexMethod2" label="序号" width="50px"></el-table-column>
          <el-table-column prop="stage" label="度量阶段" min-width="100%">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stage" v-show="scope.row.added" size="mini" />
              <span v-if="scope.row.stage ==''">{{ scope.row.stage }}</span>
              <span v-else-if="!scope.row.added && scope.row.stage >= 0 && scope.row.stage <= 999">TPCM及度量加载器(BIOS,UBOOT)及前期固件验证</span>
              <span v-else-if="!scope.row.added && scope.row.stage >= 1000 && scope.row.stage <= 1999">加载器加载驱动、配置、操作系统或二级加载器(GRUB)</span>
              <span v-else-if="!scope.row.added && scope.row.stage >= 2000 && scope.row.stage <= 2999">二级加载器(GRUB)加载驱动、配置、操作系统</span>
              <span v-else-if="!scope.row.added && scope.row.stage >= 3000">操作系统加载驱动、配置、服务程序</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="度量对象名称" min-width="140%">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" v-show="scope.row.added" size="mini" />
              <span v-show="!scope.row.added">{{scope.row.name}}</span>
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
          <el-table-column prop="time" label="度量时间"></el-table-column>
          <el-table-column label="操作" min-width="100%" align="center">
            <template slot-scope="scope">
              <el-button v-show="scope.row.show==true" type="text" class="saveBtn" @click="save1(scope.row,scope.$index)"> 保存 </el-button>
              <el-button v-show="scope.row.show==true" type="text" class="editBtn" @click="cancel(scope.row,scope.$index)"> 取消 </el-button>
              <el-button v-show="scope.row.show==false" type="text" class="certainBtn" @click="edit(scope.row,scope.$index)" > 编辑 </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <el-button type="success" plain size="small" class="el-table-add-row" @click="handleAdd()" icon="el-icon-plus">
            添加
          </el-button>
        </el-col>
        <el-col :span="24">
          <el-pagination
            @size-change="handleSizeChange3" class="paging" align='right'
            @current-change="handleCurrentChange3"
            :current-page="currentPage3"
            :page-sizes="[10,20]" 
            :page-size="pageSize3"
            layout="total, prev, pager, next, jumper"
            :total="total3">
          </el-pagination>
        </el-col>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="canBtn" @click="diaClose">取 消</el-button>
      <el-button size="small" class="sureBtn" @click="submit">确定</el-button>
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
      activeName: 'first',
      emptytxt:'',
      tableData: [],
      currentPage2: 1, // 当前页码
      total2: 0, // 总条数
      pageSize2: 10,// 每页的数据条数
      nodeId:'',
      autorefresh: '',//定时器
      timer:'',
      getOldBtn:false,
      recordType:'',
      ip:'',
      firstNum:0,
      
      emptytxt2:'',
      tableData2: [],
      currentPage3: 1, // 当前页码
      total3: 0, // 总条数
      pageSize3: 10,// 每页的数据条数
      expands:[],
      expandData:[],
      dataList: [],
      addData:[],
      addExpandData: [],
    }
  },
  methods: {
    diaOpen (param) {
      var that = this
      this.dialogFormVisible = true
      this.activeName = 'first'
      that.ip = param.ip
      that.emptytxt = ''
      that.emptytxt2 = ''
      
      that.tableData = []
      that.tableData2 = []
      that.recordType = ''
      that.nodeId= param.nodeId
      this.firstNum = 0
      this.autorefresh = ""
      this.getOldList()
      this.loadData()
    },
    diaClose () {
      var that = this
      that.dialogFormVisible = false
    },
    //first 度量记录
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
      // console.log('每页1', val)
      var that = this
      this.pageSize2 = val
      if(that.recordType == 'list') {
        that.getNewList()
      } else if (that.recordType == 'old') {
        that.getOldList()
      }
    },
    handleCurrentChange2 (val) {
      // console.log('每页2', val)
      var that = this
      this.currentPage2 = val
      if(that.recordType == 'list') {
        that.getNewList()
      } else if (that.recordType == 'old') {
        that.getOldList()
      }
    },
    getNewListRecord () {
      var that = this
      request({url: "/sec/lBMeasureRecord",method: "post", data:{node_id:that.nodeId}})
      .then((response) => {
        var res = response.data
        // console.log(res)
        // res.list.map(function(value,index) {
        //   value.measureTime = timeToZh(value.measureTime);
        // })
        // that.tableData = res.list
          that.initData()
      });
      if (JSON.stringify(that.tableData) =='[]') {
        that.timer = setInterval( function(){
          if (JSON.stringify(that.tableData) !='[]' && JSON.stringify(that.tableData) != undefined && that.tableData.length > 0 ) { 
            // console.log(222233333,JSON.stringify(that.tableData))
            that.$message({ showClose: true, message: '已获取最新记录', type: 'success' });
          }
        },2000);
      } else {
        clearInterval(that.autorefresh)
        clearInterval(that.timer)
        that.$message({ showClose: true, message: '已获取最新记录', type: 'success' });
      }
      setTimeout(function() {
        clearInterval(that.autorefresh)
        clearInterval(that.timer)
        if (JSON.stringify(that.tableData) =='[]' || JSON.stringify(that.tableData) == undefined) {
          // console.log(3333,JSON.stringify(that.tableData))
          that.getOldList()
          that.$message({ showClose: true, message: '请求已超时，已获取历史记录', type: 'warning' });
        } else { 
          // console.log(2222,JSON.stringify(that.tableData))
          that.$message({ showClose: true, message: '已获取最新记录', type: 'success' });
        }
      },5000)
    },
    initData() {
      var that = this;
      that.autorefresh = setInterval(function () {
        that.getNewList()
      }, 1000);
    },
    getNewList() {
      console.log(222222)
      var that = this
      this.firstNum ++
      request({url: "/sec/lBMeasureRecordList",method: "post", data: {node_id:that.nodeId}})
      .then((response) => {
        var res = response.data
        // console.log(res)
        if(res.total ==0) {
          that.emptytxt = true
        } else {
          that.emptytxt = false
        }
        if(res.list.length > 0) {
          that.recordType = 'list'
          that.total2 = res.total
          res.list.map(function(value,index) {
            value.measureTime = timeToZh(value.measureTime);
          })
          that.tableData = res.list
        }
      });
    },
    getOldList() {
      var that = this
      request({url: "/sec/lBMeasureRecordListOld",method: "post", data: {node_id:that.nodeId}})
        .then((response) => {
          var res = response.data
          // console.log(res)
          if(Object.keys(res.list).length != 0) {
            res.list.map(function(value,index) {
              value.measureTime = timeToZh(value.measureTime);
            })
            that.tableData = res.list
            that.total2 = res.total
            that.recordType = 'old'
          } 
          if(res.total ==0) {
            that.emptytxt = true
          } else {
            that.emptytxt = false
          }
        });
    },
    //second 配置策略
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
          that.sortArr(arr,"stage")
          that.tableData2 = res.data
          for (var i = 0; i < that.tableData2.length - 1; i++) {
            for (var j = i + 1; j < that.tableData2.length; j++) {
                if (that.tableData2[i].name == that.tableData2[j].name) {
                    that.tableData2.splice(j, 1);
                    j--;
                }
            }
          }
          that.total = res.total
        }
        if(res.total ==0) { that.emptytxt2 = true} 
        else { that.emptytxt2 = false}
      });
    },
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
      this.pageSize3 = val
      // this.loadData()
    },
    handleCurrentChange3 (val) {
      // console.log('每页2', val)
      this.currentPage3 = val
      // this.loadData()
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
      // console.log(newArr)
      var addArr = []
      this.tableData2.map(function(value,index) {
        if (value.pushed == true) {
          addArr.push(value)
        } else if (value.pushed == false) {
          newArr = []
          newArr.push(value)
        }
      })
      // console.log(addArr)
      // console.log(newArr)
      // console.log(this.addExpandData)
      var arr1 = [], arr2 =[]
      if (JSON.stringify(addArr)!= '[]') {
        arr1 = newArr.concat(addArr)
      } else {
        arr1 = newArr
      }
      if (JSON.stringify(this.addExpandData)!= '[]' &&typeof(that.addExpandData)!= 'undefined') {
        arr2 = arr1.concat(this.addExpandData)
      } else {
        arr2 = arr1
      }
      // console.log(arr1)
      // console.log(arr2)
      var result = false
      for (var item of arr2) {
        if(JSON.stringify(item.hash) == "" || JSON.stringify(item.name) =="" || JSON.stringify(item.stage) == "") {
          result = true
          that.$message({ message: "必填参数不可为空", type: "error", showClose: true,});
          break;
        } else {
          result = false
        }
      }
      if (result == false) {
        request({url: "/sec/creatBMeasurePolicy",method: "post",
          data: arr2
        }).then((response) => {
          var res = response.data
          that.$message({ showClose: true, message: '操作成功', type: 'success' });
          that.$emit("handleSuccess");
          that.diaClose()
        });
      }
    },
    save1(row,index) {
      row.show = false;
      row.added = false
      this.expandData.map(function(value,index) {
        value.show = false
      })
    },
    cancel(row,index) {
      this.expands = []
    },
    edit(row,index) {
      console.log(row)
      row.show = true
      this.expandData.map(function(value,index) {
        value.show = true
      })
    },
    reAcqu() {
      var that = this
      request({url: "/sec/lBMeasureRecordList",method: "post", data: {node_id:that.nodeId}})
      .then((response) => {
        var res = response.data
        // console.log(res)
        if(res.total ==0) { that.emptytxt2 = true} else { that.emptytxt2 = false}
        if(res.list.length > 0) {
          that.total3 = res.total
          res.list.map(function(value,index) {
            value.time = timeToZh(value.time);
            value.show = false
            value.num = index
            value.pushed = false
          })
          that.tableData2 = res.list
          that.$message({ showClose: true, message: '已获取最新记录', type: 'success' });
        }
      });
    },
    // 添加点击按钮
    handleAdd() {
      for (let i of this.tableData2) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      this.tableData2.push({
        name:"",
        stage:"",
        hash: "",
        added: true,
        show: true,
        num:this.tableData2.length,
        pushed:true
      });
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
      if (i>= this.dataList.length) {
        // console.log(123456,this.dataList.length)
        that.expandData = that.addExpandData
      } else {
          that.dataList[i].map(function(value,index) {
            if (index == 0) {
              value.disabled = true
            } else {
              value.disabled = false
            }
          })
        that.expandData = this.dataList[i]
        // console.log(this.expandData)
      }
    },
    removeDomain(index) {
      this.expandData.splice(index, 1)
    },
    addDomain(index,row) {
      // console.log(row)
      // console.log(this.expands)
      if (this.expands.length==0) {
        this.$message.warning("请先展开要添加的项");
      }
      else if (index != this.expands.toString()) {
        this.$message.warning("请展开当前要添加的项");
      }
      //  else if ( index != this.expands.toString()||this.expands.length==0) {
      //   // this.$message.warning("请展开当前要添加的项");
      //   this.expands = [index]
      // } 
      else {
        if (typeof(this.expandData) == 'undefined') {
          this.expandData = []
        }
        this.expandData.push({
          name: row.name,
          nodeId: row.nodeId,
          stage: row.stage,
          status: row.status,
          num: row.num,
          hash: "",
          show: true,
          disabled:false
        });
      }
    },
    sortArr(arr, str) {
      var _arr = [], _t = [], _tmp;
      arr = arr.sort(function(a,b) {
        var s = a[str], t = b[str]
        return s<t?-1:1
      })
      if ( arr.length ){
        _tmp = arr[0][str];
      }
      // console.log(_tmp)
      for (var i in arr) {
        // console.log(arr[i][str])
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
      // console.log(this.dataList)
    },
  },
  destroyed() {
    clearInterval(this.autorefresh);
    clearInterval(this.timer)
  },
}
</script>

<style scoped>
.statusTip {
  margin-bottom: 20px;
  text-align: right;
  /* border: 1px solid #; */
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
  margin-top: 10px;
}
.diatable >>> .el-table__expand-icon>.el-icon {
  width: 14px;
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
  min-width: 14px!important;
  content: '\e6d9'!important;
  color: #ccc;
  display: block!important;
  border: 1px solid #D8D8D8;
}
.diatable >>> .el-table__expand-icon--expanded .el-icon-arrow-right:before{
  min-width: 14px!important;
  content: '\e6d8'!important;
  color: #fff;
  background-color: #1ac492;
  border-color: #1ac492;
}
.expandTable >>> .el-table td, .el-table th.is-leaf {
  border-bottom: 0;
}
.saveBtn {
  color: #67c23a;
  background: #f0f9eb;
  border-color: #c2e7b0;padding:8px
}
.saveBtn:active {
  background: #5daf34;
  border-color: #5daf34;
  color: #fff;
  outline: none;
}
.saveBtn:hover {
  background: #67c23a;
  border-color: #67c23a;
  color: #fff;  
}
.editBtn {
  color:#e6a23c;background: #fdf6ec;border-color: #f5dab1;padding:8px
}
.editBtn:hover {
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
  color:#409eff;background: #ecf5ff;border-color: #b3d8ff;padding:8px
}
.certainBtn:hover {
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
</style>

<style>
.record .el-tabs__item.is-active {
  color: #1ac492!important;
}
.record .el-tabs__item:hover {
  color: #1ac492!important;
}
</style>
