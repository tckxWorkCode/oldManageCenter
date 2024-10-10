<template>
  <el-dialog title="启动度量记录" top="5vh" width="75%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false" >
    <el-tabs v-model="activeName" type="card" class="record">
      <el-tab-pane label="度量记录" name="first">
        <div style="display:flex;">
          <el-form label-position="right" label-width="90px" ref="ruleForm" size="small" style="flex:2">
            <el-form-item prop="ip" label="网络地址：">
              <el-input style="width:45%" v-model="ip" clearable disabled>{{ip}}</el-input>
            </el-form-item>
          </el-form>
          <div class="statusTip">
            <el-button size="small" class="certainBtn" @click="getNewListRecord">获取新记录</el-button>
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
          <!-- <el-table-column prop="hash" label="度量对象hash" min-width="150%"></el-table-column> -->
          <el-table-column prop="bootMeasures" label="度量对象hash" min-width="200%">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.bootMeasures" :key="index">
                <div style="margin-bottom:5px">{{item.hash}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="result" label="度量结果" min-width="100%">
            <template slot-scope="scope">
              <span v-if="scope.row.result =='0'">可信</span>
              <span v-else-if="scope.row.result =='1'">不可信</span>
              <span v-else-if="scope.row.result =='2'">未度量</span>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="度量时间" min-width="115%"></el-table-column>
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
            <el-button type="text" class="certainBtn" size="small" @click="reAcquDia()">重新采集</el-button>
          </div>
        </div>
        <!-- :data="tableData2.slice((currentPage3-1)*pageSize3,currentPage3*pageSize3)"  -->
        <el-table :data="tableData2" class="diatable" stripe tooltip-effect="light" style="width: 100%;border:1px solid #F0F2F5"
          :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"  row-key="num"
          :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}" max-height="50vh">
          <template slot="empty">
            <img style="" v-if="emptytxt2" src="@/assets/nodata1.png" />
          </template>
          <el-table-column type="index" :index="indexMethod2" label="序号" width="50px"></el-table-column>
          <el-table-column prop="stage" label="度量阶段" min-width="100%">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stage" @change="stageVal" :class="stageTips == true? 'errorTips':''" v-show="scope.row.added" size="mini" maxlength="4" oninput="value=value.replace(/[^\d.]/g,'')" @blur="cancelstageTips"/>
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
              <el-input v-model="scope.row.name" v-show="scope.row.added" size="mini"  maxlength="255" />
              <span v-show="!scope.row.added">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="bootMeasures" label="度量对象hash" min-width="200%">
            <template slot-scope="scope">
              <el-row :gutter="16">
                <el-col :span="22">
                  <div v-for="(item,index) in scope.row.bootMeasures" :key="index">
                    <el-input style="width:90%;margin-bottom:3px" v-model="item.hash" v-show="scope.row.show" size="small" 
                      oninput="value=value.replace(/[^0-9a-fA-F]/g,'')" @change="hashChange" maxlength="64"
                       :class="hashTips == true? 'errorTips':''" @blur="cancelHashtips"/>
                    <div v-show="!scope.row.show" style="margin-bottom:5px">{{item.hash}}</div>
                    <i v-show="scope.row.show&&index !=0" style="color:#FF4D4F;border:0;font-size:22px;margin-left:4px" class="el-icon-error" @click.prevent="delHash(scope.row,item,index)"></i>
                  </div>
                </el-col>
                <el-col :span="2" v-if="scope.row.show">
                  <i style="color:#1ac492;border:0;font-size:22px;" class="el-icon-circle-plus" @click="addInput(scope.row,scope.$index)"></i>
                </el-col> 
              </el-row>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="time" label="度量时间"></el-table-column> -->
          <el-table-column label="操作" min-width="100%" align="center">
            <template slot-scope="scope">
              <el-button v-show="scope.row.show==true" type="text" class="saveBtn" @click="save1(scope.row,scope.$index)"> 保存 </el-button>
              <el-button v-show="scope.row.show==true" type="text" class="editBtn" @click="cancel(scope.row,scope.$index)"> 取消 </el-button>
              <el-button v-show="scope.row.show==false" type="text" class="certainBtn" @click="edit(scope.row,scope.$index)" > 编辑 </el-button>
              <el-button v-show="scope.row.show==false&&scope.row.pushed " type="text" class="cancelBtn" @click="handleDel(scope.row,scope.$index)" > 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24">
          <el-button type="success" plain size="small" class="el-table-add-row" @click="handleAdd()" icon="el-icon-plus">
            添加
          </el-button>
        </el-col>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="canBtn" @click="diaClose">取 消</el-button>
      <el-button size="small" class="sureBtn" @click="submit">确定</el-button>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible1" width="30%" top="30vh" append-to-body>
      <div style="text-align:center;font-size:20px;margin:20px 0;color:#000">
        <img src="@/assets/tips.png" alt="" style="vertical-align:middle"> 重新采集策略将覆盖原始策略，是否重新采集？</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible1 = false">取 消</el-button>
        <el-button size="small" type="primary" @click="reAcqu">确 定</el-button>
      </span>
    </el-dialog>
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
      onlineStatus: "",
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
      stageTips:false,
      hashTips:false,
      savedItem:{name:"",stage:"",bootMeasures:[]}
    }
  },
  methods: {
    diaOpen (param) {
      // console.log(param)
      var that = this
      this.dialogFormVisible = true
      this.onlineStatus = param.onlineStatus
      this.activeName = 'first'
      this.ip = param.ip
      this.emptytxt = ''
      this.emptytxt2 = ''
      
      this.tableData = []
      this.tableData2 = []
      this.recordType = ''
      this.nodeId= param.nodeId
      this.firstNum = 0
      this.autorefresh = ""
      this.savedItem = {name:"",stage:"",bootMeasures:[]}

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
      if (this.onlineStatus == 0) {
        return that.$message({ showClose: true, message: '终端已离线', type: 'error' });
      } else {
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
      }
     
    },
    initData() {
      var that = this;
      that.autorefresh = setInterval(function () {
        that.getNewList()
      }, 1000);
    },
    getNewList() {
      // console.log(222222)
      var that = this
      this.firstNum ++
      request({url: "/sec/lBMeasureRecordTree?nodeId=" +that.nodeId,method: "post"})
      .then((response) => {
        var res = response.data
        // console.log(res)
        if(res.total ==0) {
          that.emptytxt = true
        } else {
          that.emptytxt = false
        }
        if(res.data) {
          res.data.map(function(value,index) {
            value.time = timeToZh(value.time);
          })
          that.tableData = res.data
          that.total2 = res.data.length
          that.recordType = 'list'
        }
      });
    },
    getOldList() {
      var that = this
      request({url: "/sec/lBMeasureRecordTreeOld?nodeId=" +that.nodeId,method: "post"})
        .then((response) => {
          var res = response.data
          // console.log(res)
          if(res.data) {
            res.data.map(function(value,index) {
              value.time = timeToZh(value.time);
            })
            that.tableData = res.data
            that.total2 = res.data.length
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
      request({ url: "/sec/lBMeasureTree?nodeId=" +this.nodeId, method: "post",
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
          that.tableData2 = res.data
          that.total3 = res.data.length
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
    reAcquDia() {
      if (this.onlineStatus == 0) {
        this.$message({ showClose: true, message: '终端已离线', type: 'error' });
      } else {
        this.dialogVisible1 = true
      }
    },
    reAcqu() {
      var that = this
      // request({url: "/sec/lBMeasureRecordList",method: "post", data: {node_id:that.nodeId}})
        request({url: "/sec/lBMeasureRecordTree?nodeId=" +that.nodeId,method: "post", })
        .then((response) => {
          var res = response.data
          // console.log(res)
          if(res.data.length ==0) { that.emptytxt2 = true} else { that.emptytxt2 = false}
          if(res.data.length > 0) {
            res.data.map(function(value,index) {
              value.time = timeToZh(value.time);
              value.show = false
              value.num = index
              value.pushed = false
            })
          }
          that.total3 = res.data.length
          that.tableData2 = res.data
          that.$message({ showClose: true, message: '已获取最新记录', type: 'success' });
          that.savedItem = {}
          that.dialogVisible1 = false
        });
    },
    submit() {
      var that = this
      var result = false
      for (let i of this.tableData2) {
        if (i.show) return this.$message.warning("请先保存当前编辑项")
      }
      this.tableData2.map((value,index) => {
        value.bootMeasures.map((val,i) => {
          val.nodeId = this.nodeId
          val.name = value.name
          val.stage = value.stage
        })
      })
      var arr = this.tableData2.reduce((a,o) => a.concat(o.bootMeasures), []);

      for (var item of arr) {
        if(item.hash == "" || item.stage == "") {
          result = true
          that.$message({ message: "必填参数不可为空", type: "error", showClose: true,});
          break;
        } else {
          result = false
        }
      }
      // console.log(this.tableData2)
      // console.log(arr)
      if (result == false) {
        // console.log(111)
        request({url: "/sec/creatBMeasurePolicy",method: "post", data: arr
        }).then((response) => {
          var res = response.data
          that.$message({ showClose: true, message: '操作成功', type: 'success' });
          that.$emit("handleSuccess");
          that.diaClose()
        });
      }
    },
    stageVal(val) {
      // console.log(val)
    },
    cancelstageTips() {
      this.stageTips = false
    },
    cancelHashtips() {
      this.hashtips = false
    },
    save1(row,index) {
      var that = this
      var flag1 = false
      var flag2 = false
      var flag3 = false
      if (row.stage == "") {
        flag1 = true
        that.$message({ message: "必填参数不可为空", type: "error", showClose: true,});
        that.stageTips = true
      } else {
        flag1 = false
        that.stageTips = false
      }
      for (var item of row.bootMeasures) {
        if( item.hash =="") {
          flag2 = true
          that.hashTips = true
          that.$message({ message: "请填写已添加的Hash之后再保存", type: "error", showClose: true,});
          break;
        } else if(item.hash.length != 64) {
          flag2 = true
          that.hashTips = true
          that.$message({ message: "请填写正确长度的Hash", type: "error", showClose: true,});
          break;
        } else {
          flag2 = false
          that.hashTips = false
          item.saved = true//hash是否保存过
        }
      }
      // var arr = this.tableData2.reduce((a,o) => a.concat(o.bootMeasures), []);
      // for (var i = 0;i<arr.length;i++) {
      //   for (var j = 0;j<arr.length;j++) {
      //     if (arr[i].hash == arr[j].hash && i!=j) {
      //       that.$message({ message: "hash不可重复", type: "error", showClose: true,});
      //       return flag3 = true
      //     } else {
      //       flag3 = false
      //     }
      //   }
      // }
      if (flag1 == false && flag2 == false) {
        that.savedItem.stage = row.stage
        that.savedItem.name = row.name
        that.savedItem.bootMeasures = JSON.parse(JSON.stringify(row.bootMeasures))
        row.added = false
        row.show = false
        row.saved = true//项是否保存过
      }
    },
    cancel(row,index) {
      var that= this
      // console.log(row,index)
      if (row.pushed) {
        if (row.saved) {
          row.bootMeasures.map((val,i) => {
            if (val.hasOwnProperty('saved') === false) {
              row.bootMeasures.splice(i,1)
            }
          })
          row.bootMeasures = that.savedItem.bootMeasures
          row.name = that.savedItem.name
          row.stage = that.savedItem.stage
          row.added = false
          row.show = false
        } else if (!row.saved) {
          that.tableData2.splice(index,1)
        }
      } else if (!row.pushed) {
        if (row.saved) {
          row.bootMeasures.map((val,i) => {
            if (val.hasOwnProperty('saved') == false) {
              row.bootMeasures.splice(i,1)
            }
          })
        } else if (!row.saved) {
          row.bootMeasures.map((val,i) => {
            if (val.hashadd) {
              row.bootMeasures.splice(i,1)
            }
          })
        }
        row.bootMeasures = that.savedItem.bootMeasures
        row.name = that.savedItem.name
        row.stage = that.savedItem.stage
        row.added = false
        row.show = false
      }
    },
    edit(row,index) {
      // console.log(row)
      for (let i of this.tableData2) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      row.show = true
      if (row.pushed == true) {
        row.added  = true
      }
      if (!row.pushed && !row.saved) {
        this.savedItem.stage = row.stage
        this.savedItem.name = row.name
        this.savedItem.bootMeasures = JSON.parse(JSON.stringify(row.bootMeasures))
      }
    },
    handleAdd() {// 添加点击按钮
      for (let i of this.tableData2) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      this.hashTips = false
      this.tableData2.push({
        name:"",
        stage:"",
        bootMeasures:[{ hash: '', name: "", stage: "" }],
        added: true,//name、stage的输入框切换
        show: true,//hash的输入框切换
        num:this.tableData2.length,
        pushed:true //是否为添加项
      });
    },
    handleDel(row,index) {
      this.tableData2.splice(index, 1)
    },
    addInput(row,index) {//添加hash
      // console.log(row)
      var that = this
      var flag = false
      for (var item of row.bootMeasures) {
        if( item.hash =="") {
          flag = true
          that.hashTips = true
          that.$message({ message: "请填写已添加的Hash之后再添加", type: "error", showClose: true,});
          break;
        } else {
          that.hashTips = false
          flag = false
        }
      }
      if (flag == false) {
        row.bootMeasures.push({
          hash: '',
          hashadd: true,//是否为添加hash
          name:row.name,
          stage:row.stage
        });
      }
    },
    delHash(row,item,index) {//删除添加的hash
      row.bootMeasures.splice(index, 1)
    },
    hashChange(val) {
      this.hashTips = false
    }
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
  color:#409eff;background: #ecf5ff;border-color: #b3d8ff;padding:8px
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
