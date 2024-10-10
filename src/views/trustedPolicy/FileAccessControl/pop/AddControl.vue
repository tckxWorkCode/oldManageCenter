<template>
  <!--新建开始-->
  <el-dialog title="文件访问控制采集" top="5vh" width="95%" :visible.sync="dialogFormVisible" @closed="diaclose" :close-on-click-modal="false">
    <div style="overflow:hidden">
      <div style="float:left;width:400px;border-right:1px solid #ddd;padding-right:20px;margin-right:20px">
        <div style="margin-bottom：10px">
          <div style="margin-bottom:8px;color:#000;font-size:14px">选择终端：</div>
          <el-input v-model="searchTerminalIp" placeholder="搜索网络地址" clearable size="small"></el-input>
        </div>
        <el-table :data="filterData" ref="terminalTable" class="terminalTable" max-height="50vh" size="small"
         :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"  :show-header="headerStatus">
          <template slot="empty">
            <div>暂无数据</div>
          </template>
          <el-table-column width="40px" class-name="radioClass">
            <template  slot-scope="scope">
			    		<el-radio  :label="scope.$index" class="itemRadio" v-model="radio" @change.native="getCurrentSelect(scope.row,scope.$index)"></el-radio>
			    	</template>
          </el-table-column>
          <el-table-column prop="system" label="系统类型">
            <template slot-scope="props">
              <span v-if="props.row.system == 'Linux' || props.row.system == 'linux'|| props.row.system == 'Unix'|| props.row.system == 'unix'">
                <img src="@/assets/linux_icon.png"><span style="padding-left:10px">{{props.row.system}}</span>
              </span>
              <span v-else-if="props.row.system.indexOf('win')">
                <img src="@/assets/windows_icon.png"> <span>{{props.row.system}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="IP" min-width="110%" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="终端名称" min-width="110%" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <div style="float:left;width:calc(100% - 450px)">
        <el-button size="small" class="sureBtn" :disabled="btnf1" @click="handleAdd()">添加保护目录</el-button>
        <div style="display:inline;margin-left:20px ">不支持windows系统盘操作！</div>
          <el-table :data="tableData2" class="diatable" stripe tooltip-effect="light" style="width: 100%;border:1px solid #F0F2F5"
          :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"  row-key="num"
          :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}" max-height="50vh">
          <template slot="empty">
            <img style="" v-if="emptytxt2" src="@/assets/nodata1.png" />
          </template>
          <el-table-column type="index" label="序号" width="50px"></el-table-column>
          <el-table-column prop="fileName" label="路径" min-width="110%">
            <template slot-scope="scope">
              <el-input v-model="scope.row.fileName" v-show="scope.row.show" size="mini" maxlength="255"/>
              <span v-show="!scope.row.show">{{scope.row.fileName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fileType" label="类型">
            <template slot-scope="scope">
              <el-select v-show="scope.row.show" v-model="scope.row.fileType" size="mini" clearable filterable placeholder="请选择" :disabled="scope.row.show == false">
                <el-option v-for="item in fileTypeOptions" :key="parseInt(item.value)" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <div v-for="(item,index) in fileTypeOptions" :key="index" v-show="!scope.row.show">
                <div v-if="item.value == scope.row.fileType">{{item.label}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="保护类型">
            <template slot-scope="scope">
              <el-select v-show="scope.row.show" v-model="scope.row.type" size="mini" clearable filterable placeholder="请选择" @change="typeChange" :disabled="scope.row.show == false">
                <el-option v-for="item in typeOptions" :key="parseInt(item.value)" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <div v-for="(item,index) in typeOptions" :key="index" v-show="!scope.row.show">
                <div v-if="item.value == scope.row.type">{{item.label}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="measureFlags" label="度量标识">
            <template slot-scope="scope">
              <el-select v-show="scope.row.show" v-model="scope.row.measureFlags" size="mini" clearable filterable placeholder="请选择" :disabled="scope.row.show == false">
                <el-option v-for="item in flagOptions" :key="parseInt(item.value)" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
              </el-select>
              <div v-for="(item,index) in flagOptions" :key="index" v-show="!scope.row.show">
                <div v-if="item.value == scope.row.measureFlags">{{item.label}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="privileges" label="特权路径" min-width="140%">
            <template slot-scope="scope">
              <el-row :gutter="16">
                <el-col :span="21">
                  <div v-for="(item,index) in scope.row.privileges" :key="index">
                    <el-input style="width:85%;margin-bottom:3px" v-model="item.privilegeName" v-show="scope.row.show" size="mini"  maxlength="255"/>
                    <span v-show="!scope.row.show">{{item.privilegeName}}</span>
                    <i v-show="scope.row.show&&index !=0" style="color:#FF4D4F;border:0;font-size:22px;margin-left:4px" class="el-icon-error" @click.prevent="delPrivilegeName(scope.row,item,index)"></i>
                  </div>
                </el-col>
                <el-col :span="2" v-if="scope.row.show">
                  <i style="color:#1ac492;border:0;font-size:22px;" class="el-icon-circle-plus" @click="addInput(scope.row,scope.$index)"></i>
                </el-col> 
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="privileges.type" label="特权类型" min-width="140%">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.privileges" :key="index">
                <el-select style="width:85%;margin-bottom:3px" v-show="scope.row.show" v-model="item.type" size="mini" clearable filterable placeholder="请选择" :disabled="scope.row.show == false">
                  <el-option v-for="item in priTypeOptions" :key="parseInt(item.value)" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
                <div v-for="(itemSelect,i) in priTypeOptions" :key="i" v-show="!scope.row.show">
                  <div v-if="itemSelect.value == item.type">{{itemSelect.label}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" min-width="100%" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.show == true" class="btnClass" plain type="success" size="mini" @click="save1(scope.row)">
                保存
              </el-button>
              <el-button v-if="scope.row.show == true" class="btnClass" plain type="warning" size="mini" @click="handlecancle(scope.row,scope.$index)">
                取消
              </el-button>
              <el-button v-if="scope.row.show == false" class="editBtn" plain size="mini"  @click="edit(scope.row)">
                编辑
              </el-button>
              <el-button v-if="scope.row.show == false" class="btnClass" plain type="danger" size="mini" @click="handleDelete(scope.$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="canBtn" @click="dialogFormVisible = false">取 消</el-button>
      <el-button size="small" class="sureBtn" :disabled="btnf1" @click="submitForm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "AddControl",
  data() {
    return {
      btnf1: false,
      dialogFormVisible: false,
      headerStatus:true,
      radio:"",
      categoryIndex: -1,
      terminalData:[],
      terminalSelection:{},
      searchTerminalIp: "",
      fileTypeOptions:[{value:"0",label:"文件"},{value:"1",label:"目录"}],
      typeOptions:[{value:"0",label:"写保护"},{value:"1",label:"读保护"}],
      systemType:"",
      flagOptions:[
        {value:"0",label:"都不度量",disabled:false},
        {value:"1",label:"度量内核环境",disabled:false},
        {value:"2",label:"度量进程",disabled:false},
        {value:"3",label:"度量内核环境和进程",disabled:false},
        {value:"4",label:"无效参数",disabled:true}
      ],
      priTypeOptions:[{value:"0",label:"所有权限"},{value:"1",label:"只读",disabled:false}],
      emptytxt2:'',
      tableData2: [],
      savedItem: {}
    };
  },
  computed: {
    filterData:function() {
      return this.terminalData.filter(data => !this.searchTerminalIp || data.ip.includes(this.searchTerminalIp))
    }
  },
  methods: {
    submitForm() {
      // console.log(111)
      var that = this
      var flag = false
      for (let i of this.tableData2) {
        if (i.show) return that.$message.warning("请先保存当前编辑项")
      }
      if (Object.keys(that.terminalSelection).length == 0) {
        that.$message({ message: "请选择终端!",type: "warning", showClose: true,});
      } else if (that.tableData2.length == 0) {
        that.$message({ message: "请添加保护目录!",type: "warning", showClose: true,});
      } else if (flag == true) {
        that.$message.warning("请先保存当前编辑项")
      } else {
        // console.log(that.terminalSelection)
        that.tableData2.map(function(value,index) {
          value.nodeId = that.terminalSelection.nodeId
          value.nodeName = that.terminalSelection.name
          value.nodeIp = that.terminalSelection.ip
          value.type = parseInt(value.type)
          value.measureFlags = parseInt(value.measureFlags)
          value.fileType = parseInt(value.fileType)
          value.privileges.map((val,i) => {
            val.type = parseInt(val.type)
          })
        })
        // console.log(that.tableData2)
        request({ url: "/sec/gatherFileAccessPolicy", method: "post", data: that.tableData2,
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
              that.dialogFormVisible = false;
              that.$message({ message: "操作成功!",type: "success", showClose: true,});
              that.$emit("addSuccess");
            } else {
              that.btnf1 = true;
              that.tableData2.map(function(value,index) {
                value.type = String(value.type)
                value.measureFlags = String(value.measureFlags)
                value.fileType = String(value.fileType)
                value.privileges.map((val,i) => {
                  val.type = String(val.type)
                })
              })
            }
          });
      }
    },
    diaOpen() {
      var that = this;
      this.dialogFormVisible = true;
      this.btnf1 = false;
      this.searchTerminalIp = "";
      this.radio = ""
      this.categoryIndex = -1
      this.systemType = "Linux"
      this.terminalSelection = {}
      this.tableData2 = []
      request({url: "/LNodeList",method: "post",
        data: {
          orderBy: "installer_time desc",
          // system_type: "1",
          online_status: 1,
          searchPage: "1",
          searchSize: "10000",
        }
      }).then((response) => {
        var res = response.data
        // console.log(res)
        that.terminalData = res.list
      });
    },
    diaclose() {
      var that = this;
      that.dialogFormVisible = false;
    },
    // 选择终端
    getCurrentSelect(item,index) {
      // console.log(item,index)
      this.categoryIndex = index;
      this.terminalSelection = item;
      this.systemType = item.system
      if (item.system == 'Linux' || item.system == 'linux'|| item.system == 'Unix'|| item.system == 'unix') {
        // this.flagOptions.map(function(val,index) {
        //   if (index == 0 ||index == 1 ||index == 2 ||index == 3 ) {
        //     val.disabled = false
        //   } else if (index == 4) {
        //     val.disabled = true
        //   }
        // })
        this.flagOptions[0].disabled = false
        this.flagOptions[1].disabled = false
        this.flagOptions[2].disabled = false
        this.flagOptions[3].disabled = false
        this.flagOptions[4].disabled = true
        this.tableData2.map (function (value ,index) {
          if (value.show) {
            value.measureFlags = ""
          }
        })
      } else if (item.system.indexOf('win')) {
        this.flagOptions[0].disabled = true
        this.flagOptions[1].disabled = true
        this.flagOptions[2].disabled = true
        this.flagOptions[3].disabled = true
        this.flagOptions[4].disabled = false
        this.tableData2.map (function (value ,index) {
          if (value.show) {
            value.measureFlags = "4"
          }
        })
      }
      this.btnf1 = false;
    },
    handleAdd() {//添加保护目录
      for (let i of this.tableData2) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      // console.log(this.systemType)
      if (this.systemType == 'Linux' || this.systemType == 'linux'|| this.systemType == 'Unix'|| this.systemType == 'unix') {
        this.tableData2.push({
          fileName: "",
          privileges:[{ privilegeName: '',type: '' }],
          type:"0",
          measureFlags:"",
          show: true,
          num:this.tableData2.length,
        });
      } else if (this.systemType.indexOf('win')) {
        this.tableData2.push({
          fileName: "",
          privileges:[{ privilegeName: '',type: '' }],
          type:"0",
          measureFlags:"4",
          show: true,
          num:this.tableData2.length,
        });
      }
      this.priTypeOptions[1].disabled = true
    },
    typeChange(val) {
      if (val == '0') {
        this.priTypeOptions[1].disabled = true
      } else {
        this.priTypeOptions[1].disabled = false
      }
    },
    addInput(row,index) {//添加特权
      var that = this
      var flag = false
      for (var item of row.privileges) {
        if( item.privilegeName =="") {
          flag = true
          that.$message({ message: "请填写已添加的特权之后再添加", type: "error", showClose: true,});
          break;
        } else if( item.type =="") {
          flag = true
          that.$message({ message: "请选择特权类型", type: "error", showClose: true,});
          break;
        } else {
          flag = false
        }
      }
      if (flag == false) {
        row.privileges.push({
          privilegeName: '',
          type: ''
        });
      }
    },
    delPrivilegeName(row,item,index) {
      row.privileges.splice(index, 1)
    },
    save1(row) {
      // console.log(row)
      var that = this
      var flag = false
      if (row.fileName == "" ||!row.measureFlags||!row.type||!row.fileType ) {
        flag = true
        that.$message({ message: "必填参数不可为空", type: "error", showClose: true,});
      } else {
        flag = false
      }
      var flag2 = false
      for (var item of  row.privileges) {
        // console.log(item) 
        if (item.privilegeName && item.type == "") {
          flag = true
          that.$message({ message: "请选择添加特权路径的特权类型", type: "error", showClose: true,});
          break;
        }
      }
      if (flag == false && flag2 == false) {
        row.show = false
        row.saved = true
        row.privileges.map((value,index) => {
          if(value.privilegeName == "") {
            row.privileges.splice(index, 1)
          } else {
            value.isVal = true
          }
          value.saved = true
        })
        this.savedItem.fileName = row.fileName
        this.savedItem.fileType = row.fileType
        this.savedItem.type = row.type
        this.savedItem.measureFlags = row.measureFlags 
      }
    },
    edit(row) {
      this.btnf1 = false
      row.show = true
      row.fileType = String(row.fileType)
      row.measureFlags = String(row.measureFlags)
      row.type = String(row.type)
      if (row.privileges.length == 0 ) {
        row.privileges.push({ privilegeName: '' ,type: ''});
      } else {
        row.privileges.map((val,i) => {
          val.type = String(val.type)
        })
      }
    },
    handlecancle(row,index) {
      // console.log(row)
      if (row.saved) {
        row.privileges.map((val,i) => {
          if (val.hasOwnProperty('isVal') == false) {
            row.privileges.splice(i,1)
          }
        })
        row.show= false
        console.log(this.savedItem)
        row.fileName = this.savedItem.fileName
        row.fileType = this.savedItem.fileType
        row.type = this.savedItem.type
        row.measureFlags = this.savedItem.measureFlags
      } else {
        this.tableData2.splice(index, 1)
        this.$message({ type: "success", message: "已取消",});
      }
    },
    handleDelete(index) {
      var that = this
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          this.tableData2.splice(index, 1)
          this.$message({ type: "success", message: "删除成功!",});
        }).catch(() => {
          this.$message({ type: "info", message: "已取消删除",})
        })
    },
  },
};
</script>

<style scoped>
/*滚动条*/
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.dialog-footer .sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff;
}
.terminalTable {
  font-size: 14px;margin-top:10px
}

.terminalTable >>> .el-table__row>td{
  /* 去除表格线 */
  border: none;
}

.terminalTable >>> .el-table::before{
  /* 去除下边框 */
  height: 0;
}
.terminalTable >>>.radioClass>.cell {
  height: 23px;
}
.itemRadio>>>.el-radio__label {
  display: none;
}

.el-divider--vertical{
  display:inline-block;
  width:1px;
  height:100%;
  margin:0 16px;
  vertical-align:middle;
  position:relative;
}
.contentContainer {
  font-size: 14px;
  margin-left: 16px;
}
.contentText {
  color: #999999;
}
.content {
  color: #333333;
}
.expandTable >>> .el-table td, .el-table th.is-leaf {
  border-bottom: 0;
}
.el-table-add-row {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  border-radius: 3px;
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
.editBtn {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}
.editBtn:active {
  background: #3a8ee6;
  border-color: #3a8ee6;
  color: #fff;
  outline: none;
}
.editBtn:hover, .editBtn:focus{
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}
</style>
