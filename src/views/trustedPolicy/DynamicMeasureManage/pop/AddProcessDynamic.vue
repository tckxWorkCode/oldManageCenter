<template>
  <!--新建开始-->
  <el-dialog title="新建进程动态度量" top="5vh" width="40%" :visible.sync="dialogFormVisible" @closed="diaclose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="120px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
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
      <el-form-item prop="process" label="全路径：">
        <el-input style="width:70%" v-model="ruleForm.process" clearable placeholder='请输入全路径' @change="handleProcess"></el-input>
      </el-form-item>
      <el-form-item prop="sub_process_mode" label="子进程：">
        <el-radio-group v-model="ruleForm.sub_process_mode">
          <el-radio :label="'0'">跟随全局策略</el-radio>
          <el-radio :label="'1'">度量</el-radio>
          <el-radio :label="'2'">不度量</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="old_process_mode" label="已启动的进程：">
        <el-radio-group v-model="ruleForm.old_process_mode">
          <el-radio :label="'0'">跟随全局策略</el-radio>
          <el-radio :label="'1'">度量</el-radio>
          <el-radio :label="'2'">不度量</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="share_lib_mode" label="共享库：">
        <el-radio-group v-model="ruleForm.share_lib_mode">
          <el-radio :label="'0'">跟随全局策略</el-radio>
          <el-radio :label="'1'">度量</el-radio>
          <el-radio :label="'2'">不度量</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="measure_interval" label="度量间隔：">
        <el-input style="width:70%" v-model="ruleForm.measure_interval" clearable placeholder="请输入大于10小于300的数字" @change="handleInterval"></el-input>秒
      </el-form-item>
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
  name: "AddProcessDynamic",
  data() {
    var validatePass = (rule, value, callback) => {
      var reg = /^[0-9]+$/;
      if (value === "") {
        callback(new Error("请输入大于10小于300的整数"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正整数"));
      } else if ( parseInt(value) < 10 ) {
        callback(new Error("请输入大于10的正整数"));
      } else if ( parseInt(value) > 300 ) {
        callback(new Error("请输入小于300的正整数"));
      } else {
        callback();
      }
    };
    return {
      height: 0,
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
        sub_process_mode: [{ required: true, message: "请选择子进程是否度量", trigger: "change" },],
        old_process_mode: [{ required: true, message: "请选择策略生效前已启动的进程是否度量", trigger: "change" },],
        share_lib_mode: [{ required: true, message: "请选择共享库是否度量", trigger: "change" },],
        measure_interval: [{ required: true, validator: validatePass, trigger: "blur" },],
        process: [{ required: true, message: "请输入全路径", trigger: "blur" },],
      },
      ruleForm: {
        zdname: "",
        sub_process_mode: "",
        old_process_mode: "",
        share_lib_mode: "",
        measure_interval: "",
        process:''
      },
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
      that.$refs[formName].validate((valid) => {
        if (valid) {
          var datas = {
            node_id: that.terminalSelection.nodeId,
            node_name: that.terminalSelection.name,
            node_ip: that.terminalSelection.ip,
            process_type: 0,
            sub_process_mode: that.ruleForm.sub_process_mode,
            old_process_mode: that.ruleForm.old_process_mode,
            share_lib_mode: that.ruleForm.share_lib_mode,
            measure_interval: that.ruleForm.measure_interval,
            process: that.ruleForm.process,
          }
          // console.log(datas)
          request({
            url: "/sec/createProcessMeraure",
            method: "post",
            data: datas,
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
    },
    diaOpen() {
      var that = this;
      this.dialogFormVisible = true;
      this.btnf1 = false;
      this.ruleForm.zdname = "1";
      this.ruleForm.sub_process_mode = "",
      this.ruleForm.old_process_mode = "",
      this.ruleForm.share_lib_mode = "",
      this.ruleForm.measure_interval = "",
      this.ruleForm.process =''
      this.searchTerminalIp = "";
      this.radio = ""
      this.categoryIndex = -1
      this.terminalSelection = {}
      request({url: "/LNodeList",method: "post",
        data: {
          condition: "",
          firstTime: "",
          lastTime: "",
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
        if (res.total > 5) {
          that.height = 240;
        } else if (res.total === 0) {
          that.height = 110;
        } else {
          that.height = 50 + 42 * res.total;
        }
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
    handleProcess(val) {
      if(val) {this.btnf1 = false;}
    },
    handleInterval(val) {
      if(val) {this.btnf1 = false;}
    }
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
  width: 46%;
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
</style>
