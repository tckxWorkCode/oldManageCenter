<template>
  <!--新建开始-->
  <el-dialog title="配置进程防跟踪" top="5vh" width="45%" :visible.sync="dialogFormVisible" @closed="diaclose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="125px" ref="ruleForm" size="small" class="form">
      <el-form-item prop="ip" label="网络地址：">
        <el-input style="width:50%" v-model="ip" clearable disabled>{{ip}}</el-input>
      </el-form-item>
      <el-form-item prop="enable" label="进程防跟踪开关：">
        <el-switch v-model="enable" :active-text="activeText" :active-value="1" :inactive-value="0" @change="switchChange">
        </el-switch>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" type="card" class="traceTab">
      <el-tab-pane label="允许跟踪" name="first">
        <div class="allowProTrace">
          <div class="allowLeft">
            <div class="subtitle">选择进程 (共<span>{{this.identityData.length}}</span>条)</div>
            <div class="searchinputdiv">
              <el-input v-model="searchTableData" placeholder="请输入名称" clearable></el-input>
            </div>
            <el-table :data="identityData.filter(data => !searchTableData || data.name.includes(searchTableData))" ref="identityTable" 
              tooltip-effect="light" @selection-change="handleSelectionChange" 
              :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
              style="width: 100%;font-size: 14px;border:1px solid #F0F2F5" height="40vh" :fit='true'>
              <el-table-column type="selection" width="50" align="center"></el-table-column>
              <el-table-column type="index" label="序号" width="50px"></el-table-column>
              <el-table-column prop="name" label="进程身份名称" min-width="100%"></el-table-column>
            </el-table>
          </div>
          <div class="middle">
            <div class="middleIcon" @click="submitToRight"><i class="el-icon-arrow-right"></i></div>
            <div class="middleIcon" @click="submitToLeft"><i class="el-icon-arrow-left"></i></div>
          </div>
          <div class="allowRight">
            <div class="subtitle">已选进程 (<span>{{this.processTrace.length}}</span>) 条</div>
            <el-table :data="processTrace" size="small" ref="nonProcessTraceTable" header-align="center" @selection-change="handleSelectionChange1"
             :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
             :cell-style="{padding:'0px'}" style="width: 100%;font-size: 14px;border:1px solid #F0F2F5" height='calc(40vh + 40px)' :fit='true'>
              <el-table-column type="selection" width="50" align="center"></el-table-column>
              <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
              <el-table-column prop="name" label="进程名称" align="center"></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button style="color:#FF4D4F" type="text" @click="delPT(scope.$index,scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top:10px;text-align:right">
              <div class="selectProIden" v-if="selectProIden == true">请选择进程身份</div>
              <div class="selectProIden" v-if="repeat == true" >该进程身份已添加，请勿重复添加</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="禁止跟踪" name="second">
        <el-table :data="nonProcessTrace" size="small" ref="nonProcessTraceTable" header-align="center"
         :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
         style="width: 100%;font-size: 14px;border:1px solid #dfdfdf" max-height="50vh" :fit='true'>
          <!-- <el-table-column type="selection" width="50" align="center"></el-table-column> -->
          <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
          <el-table-column prop="name" label="进程名称" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" v-show="scope.row.show"  min-width="140%" size="mini" />
              <span v-show="!scope.row.show">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button class="btnClass" plain type="success" size="mini" @click="save1(scope.row)" :disabled="scope.row.disable == true">
                保存
              </el-button>
              <el-button plain type="danger" size="mini" @click="handleDelete(scope.$index)">删除</el-button>
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
      <el-button size="small" class="canBtn" @click="dialogFormVisible = false">取 消</el-button>
      <el-button size="small" class="sureBtn" :disabled="btnf1" @click="submitForm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "ConfigProcessTrace",
  data() {
    return {
      activeText:"关闭",
      searchTableData: "",
      height: 0,
      btnf1: false,
      dialogFormVisible: false,
      labelPosition: "right",
      activeName:"first",
      emptytxt:"",
      processTrace:[],
      identityData:[],
      terminalSelection:[],
      terminalSelection1:[],
      addSure: false,
      selectProIden: false,
      repeat:false,
      repeat1:false,
      nonProcessTrace:[],
      nodeId:'',
      enable:'',
      ip:''
    };
  },
  methods: {
    submitForm() {
      var that = this;
      var processTraceData = []
      var nonProcessTraceData = []
      processTraceData = that.processTrace.map (item => {return item.name})
      nonProcessTraceData = that.nonProcessTrace.map (item => {return item.name})
      if (nonProcessTraceData.indexOf('') == 0) {
        that.$message({ message: "必填参数不可为空", type: "error", showClose: true,});
      } else {
        var datas = {
          node_id:that.nodeId,
          enable:that.enable,
          non_tracee_names_array:nonProcessTraceData,
          ptracer_names_array:processTraceData
        }
        // console.log(datas)
        request({ url: "/sys/creatPTracer", method: "post", data: datas,
        }).then((response) => {
          var res = response.data
          if (res.status === 0) {
            that.dialogFormVisible = false;
            that.$message({ message: "操作成功!",type: "success", showClose: true,});
            that.$emit("success");
          } else {
            // that.btnf1 = true;
            // that.$message({ message: res.errormessage, type: "error", showClose: true,});
          }
        });
      }
    },
    diaOpen(param) {
      // console.log(param)
      var that = this;
      this.searchTableData = "";
      this.dialogFormVisible = true;
      this.btnf1 = false;
      this.selectProIden = false
      this.addSure = false
      this.repeat = false
      this.repeat1 = false
      this.nodeId = param.nodeId
      this.ip = param.ip
      this.loadPTracerId()
      // 
      // that.$nextTick(function () {
      //   that.$refs.ruleForm.clearValidate();
      // });
    },
    loadPTracerId() {
      var that = this
      request({ url: "/sys/searchPTracerId?node_id=" + this.nodeId, method: "post",
      }).then((response) => {
        var res = response.data
        var value = response.data.object
        // console.log(res)
        if (value) {
          that.enable = value.enable
          that.switchChange(that.enable)
          let pTArr = Array.from(new Set(value.ptracer_names_array))
          let nonPTArr = Array.from(new Set(value.non_tracee_names_array))
          pTArr.map((item, index) => {
            that.processTrace.push(
              Object.assign( {name: item})
            ) 
          })
          nonPTArr.map((item, index) => {
            that.nonProcessTrace.push(
              Object.assign( {name: item})
            ) 
          })
        } 
        that.loadProcessIdentityList()
      });
    },
    loadProcessIdentityList() {
      var that = this
      request({url: "/searchProIdenListByNID?node_id="+this.nodeId,method: "post",
      }).then((response) => {
        var res = response.data
        // console.log(res)
        // console.log(that.processTrace)
        // if(res.list) {
          that.identityData = res.data
          for (var i = 0; i<that.processTrace.length; i++) {
            for (var j = 0; j<that.identityData.length; j++) {
              if (that.identityData[j].name == that.processTrace[i].name) {
                that.identityData.splice(j,1)
              }
            }
          }
        // }
      });
    },
    diaclose() {
      this.dialogFormVisible = false;
      this.terminalSelection = []
      this.processTrace=[],
      this.nonProcessTrace=[]
    },
    switchChange(val) {
      if (val == 0) {
        this.activeText = "关闭"
      } else if (val == 1) {
        this.activeText = "开启"
      }
    },
    handleSelectionChange (val) {
      // console.log(val)
      this.terminalSelection = val
      if (val) {
        this.selectProIden = false
        this.addSure = true
      } 
      this.repeat = false
    },
    handleSelectionChange1 (val) {
      // console.log(val)
      this.terminalSelection1 = val
    },
    submit() {
      var that = this
      // console.log(this.terminalSelection)
      if(this.terminalSelection.length == 0) {
        that.selectProIden = true
      } else {
        that.addSure = true
        that.selectProIden = false
        that.terminalSelection.map((item, index) => {
          that.processTrace.push(
            Object.assign( {name: item.name})
          ) 
        })
        let deWeightThree = () => {
          let map = new Map();
          for (let item of that.processTrace) {
              if (!map.has(item.name)) {
                map.set(item.name, item);
              } else {
                that.repeat = true
              }
          }
          return [...map.values()];
        }
        that.processTrace = deWeightThree();
        // console.log(that.processTrace)
      }
    },
    submitToRight() {//确定添加
      var that = this
      // console.log(this.terminalSelection)
      if(this.terminalSelection.length == 0) {
        that.selectProIden = true
      } else {
        that.selectProIden = false
        that.terminalSelection.map((item, index) => {
          that.processTrace.push({
            i_id: item.i_id,
            name:item.name,
            add:true
          })
        })
        let deWeightThree = () => {
          let map = new Map();
          for (let item of that.processTrace) {
              if (!map.has(item.name)) {
                map.set(item.name, item);
              } else {
                that.repeat = true
              }
          }
          return [...map.values()];
        }
        that.processTrace = deWeightThree();
        that.processTrace = this.compar (this.processTrace, "certiId")
        // console.log(that.processTrace)
        for(var i = 0; i < that.identityData.length; i++){
          for(var j = 0; j < that.terminalSelection.length; j++){
            if(that.identityData[i].name === that.terminalSelection[j].name){
              that.identityData.splice(i,1);
            }
          }
        }
      }
    },
    submitToLeft() {
      var that = this
      // console.log(this.terminalSelection1)
      for(var i = 0; i < that.terminalSelection1.length; i++){
        for(var j = 0; j < that.processTrace.length; j++){
          if(that.terminalSelection1[i].name === that.processTrace[j].name){
            that.processTrace.splice(j,1);
            that.identityData.push({
              name:that.terminalSelection1[i].name,
              i_id:that.terminalSelection1[i].i_id,
            })
          }
        }
      }
      that.identityData = this.compar (this.identityData, "i_id")
      this.terminalSelection1 = []
      // console.log(this.terminalSelection1)
    },
    delPT(index,row) { //允许的进程删除
      var that = this
      for(var i = 0; i < that.processTrace.length; i++){
        if(that.processTrace[i].name === row.name){
          that.processTrace.splice(i,1);
          that.identityData.push({
            name:row.name,
            i_id:row.i_id
          })
        }
      }
      that.identityData = this.compar (this.identityData, "i_id")
    },
    delNonPT (index,row) { //不允许的进程删除
      var that = this
      for(var i = 0; i < that.nonProcessTrace.length; i++){
        if(that.nonProcessTrace[i].name === row.name){
            that.nonProcessTrace.splice(i,1);
        }
      }
    },
    compar(array, key) {
      return array.sort(function (a, b) {
        const x = a[key];
        const y = b[key];
        return ((x<y)?-1:(x>y)?1:0)
      });
    },
    save1(row) {
      if (row.name =="") {
        return this.$message({ message: "必填参数不可为空", type: "error", showClose: true,});
      }
      row.show = false;
    },
    // 添加点击按钮
    handleAdd() {
      for (let i of this.nonProcessTrace) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      this.nonProcessTrace.push({
        name: '',
        show: true,
      });
    },
    handleDelete(index) {
      // this.$confirm("是否删除?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // }).then(() => {
        this.nonProcessTrace.splice(index, 1)
      //   this.$message({ type: "success", message: "删除成功!",});
      // }).catch(() => {
      //   this.$message({ type: "info", message: "已取消删除",})
      // })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.form >>>.el-switch.is-checked .el-switch__core {
  border-color: #1ac492;
  background-color: #1ac492;
}
.form >>>.el-switch__label.is-active {
  color: #1ac492;
}
.allowProTrace {
  height: 50vh;
  display: flex;
}
.subtitle {
  font-size: 14px;
  margin: 15px;
}
.allowLeft {
  width: 48%;
}
.allowRight {
  width: 48%;
  margin-right: 24px;
}
.middle {
  margin: 16px;
  align-self: center;
}
.middleIcon {
  width: 31px;
  height: 31px;
  line-height: 31px;
  text-align: center;
  color: #ffffff;
  background-color: #1ac492;
  margin-bottom: 20px;
  cursor: pointer;
}
.middleIcon:active {
  border: 1px solid #1ac492;
  cursor: pointer;
}
.middleIcon:visited {
  color: #fff;
  background-color: #1ac492;
  border: 1px solid #1ac492;
  cursor: pointer;
}
.selectProIden {
  color: #f56c6c;
}
.searchinputdiv >>>.el-input .el-input__inner {
  border-radius: 0;
}
.searchinputdiv >>>.el-input .el-input__inner:focus {
  border-color: #1ac492;
}
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
.demo-dynamic {
  margin-top: 20px;
}
.el-table-add-row {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  border-radius: 3px;
}
</style>
<style>
.traceTab .el-tabs__item.is-active {
  color: #fff;
  background-color: #1ac492!important;
  border-bottom: 1px solid #e4e7ed
}
.traceTab .el-tabs__item:hover {
  color: #fff;
  background-color: #1ac492!important;
}
</style>
