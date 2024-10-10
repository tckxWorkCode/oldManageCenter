<template>
  <!--新建开始-->
  <el-dialog title="白名单学习" width="35%" top="10vh" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="120px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <div class="itemw">
        <el-form-item class="zdclass" prop="zdname" label="终端信息：">
          <div class="searchDiv">
            <el-input style="width:50%" class="searchinputtab" v-model="searchTerminalIp" placeholder="搜索IP" clearable></el-input>
          </div>
          <div class="cardContainer">
            <div class="cardTip" v-if="filterData.length == 0">暂无数据</div>
            <div class="itemCard" :class="{active: categoryIndex == index}"
              v-for="(item,index) in filterData" :key="item.nodeId">
              <div class="radioContainer">
                <el-radio :label="index" class="itemRadio" v-model="radio" @change.native="getCurrentSelect(item,index)"></el-radio>
              </div>
              <div class="contentContainer">
                <div> 名称：{{item.name}}</div>
                <div>IP：{{item.ip}}</div>
              </div>
            </div>
          </div>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="canBtn" @click="dialogFormVisible = false">取 消</el-button>
      <el-button size="small" class="sureBtn" :disabled="btnvalue1"  @click="submitForm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
export default {
  name: "IssuePop",
  data() {
    return {
      height: 0,
      dialogFormVisible: false,
      btnvalue1: false,
      labelPosition: "right",
      terminalData:[],
      terminalSelection:{},
      searchTerminalIp:'',
      radio:"",
      categoryIndex: -1,
      rules: {
        zdname: [{ required: true, message: "请选择终端", trigger: "change" }],
      },
      ruleForm: {
        zdname: "",
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
      var that = this;
      if(Object.keys(that.terminalSelection).length == 0) {
        that.ruleForm.zdname = ''
      } else {
        that.ruleForm.zdname = '1'
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.btnvalue1 = true;
          var formData = new FormData()
          formData.append("node_id", that.terminalSelection.nodeId);
          formData.append("bypass_switch", "0");
          request({url: "/sec/whiteListLearnSwitch",method: "post",
            data: formData
          }).then((response) => {
            var res = response.data
            // console.log(res)
            if (res.status === 0) {
              that.dialogFormVisible = false;
              that.$message({ message: "操作成功!", type: "success", showClose: true,});
              that.$emit("success");
            } else {
              that.btnvalue1 = false;
              // that.$message({ message: res.errormessage, type: "error", duration: 0, showClose: true,});
            }
          });
        } else {
          that.btnvalue1 = false;
        }
      });
    },
    diaOpen() {
      var that = this
      this.radio=""
      this.categoryIndex=-1
      this.dialogFormVisible = true;
      this.ruleForm.zdname = "1";
      this.btnvalue1 = false;
      this.searchTerminalIp = "";
      this.terminalSelection={}

      // 加载终端列表
      request({url: "/LNodeList",method: "post",
        data: {
          condition: "",
          firstTime: "",
          lastTime: "",
          orderBy: "installer_time desc",
          online_status: 1,
          searchPage: "1",
          searchSize: "10000",
        }
      }).then((response) => {
        var res = response.data
        // console.log(res)
        that.terminalData = res.list
      });
      this.$nextTick(function () {
        that.$refs.terminalTable.clearSelection();
        that.$refs.ruleForm.resetFields();
      });
    },
    diaClose() {
      this.dialogFormVisible = false;
    },
    // 选择终端
    getCurrentSelect(item,index) {
      this.categoryIndex = index;
      this.terminalSelection = item;
      this.btnvalue1 = false
    },
  },
};
</script>

<style scoped>
.itemw {
  position: relative;
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
.itemCard >>>.el-radio__label {
  display: none!important;
}
.cardContainer {
  max-height: 40vh;
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
  color: #000;
  font-size: 14px;
  margin-left: 16px;
}

</style>
