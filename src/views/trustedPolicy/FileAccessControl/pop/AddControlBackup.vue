<template>
  <!--新建开始-->
  <el-dialog title="新建文件访问控制" top="5vh" width="70%" :visible.sync="dialogFormVisible" @closed="diaclose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="120px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <div style="display:flex">
        <div style="flex-grow:1">
          <el-form-item class="zdclass" prop="zdname" label="终端信息：">
            <div class="searchDiv">
              <el-input style="width: 50%" v-model="searchTerminalIp" placeholder="搜索IP" clearable></el-input>
            </div>
            <div class="cardContainer">
              <div class="cardTip" v-if="filterData.length == 0">暂无数据</div>
              <div class="itemCard" :class="{active: categoryIndex == index}"
                v-for="(item,index) in filterData" :key="item.nodeId">
                <div class="radioContainer">
                  <el-radio :label="index" class="itemRadio" v-model="radio" @change.native="getCurrentSelect(item,index)"></el-radio>
                </div>
                <div class="contentContainer">
                  <div><span class="contentText">名称：</span><span class="content">{{item.name}}</span></div>
                  <div><span class="contentText">IP：</span><span class="content">{{item.ip}}</span></div>
                </div>
              </div>
            </div>
          </el-form-item>
        </div>
        <div style="flex-grow:3">
          <el-form-item class="uploadItem" prop="policyName" label="策略名称：">
            <el-input style="width:80%" v-model="ruleForm.policyName" placeholder="请输入中文、英文、数字、_和.符号" name="policyName" maxlength="255" type="text" @change="handlePolicyname"></el-input>
          </el-form-item>
          <el-form-item class="zdclass" prop="zdname" label="策略：">
            <el-table :data="tableData2" class="diatable" stripe tooltip-effect="light" style="width: 100%;border:1px solid #F0F2F5"
            :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"  row-key="num"
            :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}" max-height="50vh" @expand-change="expandChange" :expand-row-keys="expands">
            <template slot="empty">
              <img style="" v-if="emptytxt2" src="@/assets/nodata1.png" />
            </template>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div :id="scope.row.id" class="expandTable">
                  <el-table :data="expandData.filter(data => data.fileName == scope.row.fileName)" width="100%" :show-header="false" size="mini">
                    <el-table-column prop="privilegeName" label="" min-width="200%">
                      <template slot-scope="scope">
                        <el-col :span="8" :offset="10">
                          <el-col :span="21">
                            <el-input v-model="scope.row.privilegeName" v-show="scope.row.show" size="mini" />
                            <span v-show="!scope.row.show">{{scope.row.privilegeName}}</span>
                          </el-col>
                          <el-col :span="3">
                            <i style="color:#FF4D4F;border:0;font-size:22px;margin-left:14px" class="el-icon-remove" @click.prevent="removeDomain(scope.$index)"></i>
                          </el-col>
                        </el-col>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="50px"></el-table-column>
            <el-table-column prop="fileName" label="保护目录" min-width="110%">
              <template slot-scope="scope">
                <el-input v-model="scope.row.fileName" v-show="scope.row.show" size="mini" />
                <span v-show="!scope.row.show">{{scope.row.fileName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="privilegeName" label="特权" min-width="130%">
              <template slot-scope="scope">
                <el-row :gutter="16">
                  <el-col :span="21">
                    <el-input v-model="scope.row.privilegeName" v-show="scope.row.show" size="mini" />
                    <span v-show="!scope.row.show">{{scope.row.privilegeName}}</span>
                  </el-col>
                  <el-col :span="3">
                    <i style="color:#1ac492;border:0;font-size:22px;" class="el-icon-circle-plus" @click="addDomain(scope.$index,scope.row)"></i>
                  </el-col> 
                </el-row>
              </template>
            </el-table-column>
            <el-table-column prop="" label="操作" min-width="100%" align="center">
              <template slot-scope="scope">
                <el-button class="btnClass" plain type="success" size="mini" @click="save1(scope.row)">
                  保存
                </el-button>
                <el-button class="btnClass" plain  type="warning" size="mini"  @click="edit(scope.row)">
                  编辑
                </el-button>
                <!-- <el-button class="btnClass" plain type="danger" size="mini" @click="handleDelete(scope.$index)">
                  删除
                </el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <el-col :span="24">
            <el-button type="success" plain size="small" class="el-table-add-row" @click="handleAdd()" icon="el-icon-plus">
              添加
            </el-button>
          </el-col>
          </el-form-item>
          
        </div>
        
      </div>
      
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="canBtn" @click="dialogFormVisible = false">取 消</el-button>
      <el-button size="small" class="sureBtn" :disabled="btnf1" @click="submitForm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "AddControl",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入策略名称"));
      } else if (value.length > 20) {
        callback(new Error("策略名称长度不超出20个字符"));
      } /*else if (/^\s+$/gi.test(value)) {
        callback(new Error('名称不能为空格'))
      }*/ else if (
        /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\_\.]/g.test(value)
      ) {
        callback(new Error("策略名称只能输入中文、英文、数字、_和.符号"));
      } else {
        callback();
      }
    };
    return {
      btnf1: false,
      dialogFormVisible: false,
      labelPosition: "right",
      radio:"",
      categoryIndex: -1,
      terminalData:[],
      terminalSelection:{},
      searchTerminalIp: "",
      rules: {
        zdname: [{ required: true, message: "请选择终端", trigger: "change" }],
        policyName: [{ required: true, validator: validatePass, trigger: "blur" },],
      },
      ruleForm: {
        zdname: "",
        policyName: "",
      },
      emptytxt2:'',
      tableData2: [],
      expands:[],
      expandData:[],
    };
  },
  computed: {
    filterData:function() {
      return this.terminalData.filter(data => !this.searchTerminalIp || data.ip.includes(this.searchTerminalIp))
    }
  },
  methods: {
    submitForm(formName) {
      var that = this
      if(Object.keys(that.terminalSelection).length == 0) {
        that.ruleForm.zdname = ''
      } else {
        that.ruleForm.zdname = '1'
      }
      for (var i = 0; i < that.tableData2.length; i++) {
        that.tableData2[i].privates = [{"privilegeName":that.tableData2[i].privilegeName}]
        for (var j = 0; j < that.expandData.length; j++) {
          if (that.tableData2[i].fileName == that.expandData[j].fileName) {
            that.tableData2[i].privates.push(that.expandData[j])
          }
        }
      }
      var result = false
    //   for (var item of that.expandData) {
    //     if(item.privilegeName == "") {
    //       result = true
    //       that.$message({ message: "必填参数不可为空", type: "error", showClose: true,});
    //       break;
    //     } else {
    //       result = false
    //     }
    //   }
      for (var item of that.tableData2) {
        if( item.fileName =="") {
          result = true
          that.$message({ message: "必填参数不可为空", type: "error", showClose: true,});
          break;
        } else {
          result = false
        }
      }
      var datas = {
        nodeId: that.terminalSelection.nodeId,
        nodeName: that.terminalSelection.name,
        nodeIp: that.terminalSelection.ip,
        policyName: that.ruleForm.policyName,
        files:that.tableData2
      }
      // console.log(datas)
      if (result == false) {
        that.$refs[formName].validate((valid) => {
          if (valid) {
            // request({ url: "/sec/creFileAccessPolicy", method: "post", data: datas,  
            request({ url: "/sec/gatherFileAccessPolicy", method: "post", data: datas,
            }).then((response) => {
              var res = response.data
              if (res.status === 0) {
                that.dialogFormVisible = false;
                that.$message({ message: "操作成功!",type: "success", showClose: true,});
                that.$emit("addSuccess");
              } else {
                that.btnf1 = true;
              }
            });
          } else {
            that.btnf1 = false;
          }
        });
      }
    },
    diaOpen() {
      var that = this;
      this.dialogFormVisible = true;
      this.btnf1 = false;
      this.ruleForm.zdname = "1";
      this.ruleForm.policyName = "",
      this.searchTerminalIp = "";
      this.radio = ""
      this.categoryIndex = -1
      this.terminalSelection = {}
      this.tableData2 = []
      this.expands = []
      this.expandData = []
      request({url: "/LNodeList",method: "post",
        data: {
          orderBy: "installer_time desc",
          system_type: "1",
          online_status: 1,
          searchPage: "1",
          searchSize: "10000",
        }
      }).then((response) => {
        var res = response.data
        // console.log(res)
        that.terminalData = res.list
      });

      that.$nextTick(function () {
        that.$refs.ruleForm.clearValidate()
      })
    },
    diaclose() {
      var that = this;
      that.dialogFormVisible = false;
    },
    // 选择终端
    getCurrentSelect(item,index) {
      this.categoryIndex = index;
      this.terminalSelection = item;
      this.btnf1 = false;
    },
    handlePolicyname(val) {
      if(val) {
        this.btnf1 = false;
      }
    },
    handleAdd() {
      for (let i of this.tableData2) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      this.tableData2.push({
        fileName: "",
        privilegeName:"",
        show: true,
        num:this.tableData2.length,
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
    handleDelete(index) {
        var that = this
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          this.tableData2.splice(index, 1)
          this.expandData.map(function(value) {
            if (value.num == index) {
              that.expandData.splice(index,1)
            }
          })
          this.$message({ type: "success", message: "删除成功!",});
        }).catch(() => {
          this.$message({ type: "info", message: "已取消删除",})
        })
    },
    expandChange(row,expandedRows) {
      var that = this
    //   // console.log(row)
      if (expandedRows.length) {
        that.expands = []
        if (row) {
          that.expands.push(row.num)
        }
      } else {
        that.expands = []
      }
    },
    removeDomain(index) {
      this.expandData.splice(index, 1)
    },
    addDomain(index,row) {
    //   // console.log(row)
      console.log(this.expands)
      if (this.expands.length==0) {
        this.$message.warning("请先展开要添加的项");
      }
      else if (index != this.expands.toString()) {
        this.$message.warning("请展开当前要添加的项");
      }
      else {
        if (typeof(this.expandData) == 'undefined') {
          this.expandData = []
        }
        this.expandData.push({
          fileName: row.fileName,
          privilegeName:"",
          show: true,
          num: row.num,
        });
      }
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
.itemCard >>>.el-radio__label {
  display: none!important;
}
.cardContainer {
  max-height: 30vh;
  overflow: auto;
}
.cardTip {
  height: 50px;
  color: #909399;
  text-align: center;
  border: 1px solid #DCDFE6;
  border-radius: 3px;
  margin-top: 10px;
  padding-top: 10px;
}
.itemCard {
  width: 96%;
  float: left;
  display: flex;
  border: 1px solid #f0f0f4;
  border-radius: 5px;
  margin-right: 10px;
  margin-top: 20px;
}
.active {
  border-color: #1ac492;
  box-shadow: 0 2px 4px rgba(26,196,146, 0.3), 0 0 6px rgba(26,196,146, .04)
}
.radioContainer {
  width: 20%;
  position: relative;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: #f8f8f8;
}
.itemRadio {
  border-right: 1px solid #f0f0f4;
  position: absolute;
  left:50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.itemRadio .el-radio__label {
  display: none;
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
</style>
