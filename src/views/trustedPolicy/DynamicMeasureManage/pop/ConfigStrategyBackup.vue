<template>
  <el-dialog title="动态度量策略" top="5vh" width="30%" min-width="420px" :visible.sync="dialogFormVisible" @close="diaclose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="100px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small" class="form">
      <el-form-item prop="ip" label="网络地址：">
        <el-input style="width:80%" v-model="ip" clearable disabled>{{ip}}</el-input>
      </el-form-item>
      <el-divider></el-divider>
      <div class="containerStyle">
        <div class="boxContainer">
          <div class="titleContainer" :class="{titleColor: flag1 == true}">
            <el-form-item class="nameSwitch" prop="systemCallSwitch" label="系统调用表：">
              <el-switch v-model="ruleForm.systemCallSwitch" :active-text="activeText1" :active-value="1" :inactive-value="0" @change="switchChange1">
              </el-switch>
            </el-form-item>
            <span class="iconStyle" v-show="flag1==false" @click="expandCollapse1"><i class="el-icon-arrow-right"></i></span>
            <span class="iconStyle" v-show="flag1==true" @click="expandCollapse1"><i class="el-icon-arrow-down"></i></span>
          </div>
          <div class="itemStyle" v-show="flag1==true">
            <el-form-item class="uploadItem" prop="systemCallType" label="类型：">
              <el-input v-model="ruleForm.systemCallType" disabled type="text"></el-input>
            </el-form-item>
            <el-form-item class="uploadItem" prop="systemCallInterval" label="时间间隔：">
              <el-input v-model="ruleForm.systemCallInterval" type="text" @blur="blur1"></el-input>
              <div class="unit2">秒</div>
            </el-form-item>
          </div>
        </div>
        <div class="boxContainer">
          <div class="titleContainer" :class="{titleColor: flag2 == true}">
            <el-form-item class="nameSwitch" prop="kernalCodeSegSwitch" label="内核代码段：">
              <el-switch v-model="ruleForm.kernalCodeSegSwitch" :active-text="activeText2" :active-value="1" :inactive-value="0" @change="switchChange2">
              </el-switch>
            </el-form-item>
            <span class="iconStyle" v-show="flag2==false" @click="expandCollapse2"><i class="el-icon-arrow-right"></i></span>
            <span class="iconStyle" v-show="flag2==true" @click="expandCollapse2"><i class="el-icon-arrow-down"></i></span>
          </div>
          <div class="itemStyle" v-show="flag2==true">
            <el-form-item class="uploadItem" prop="kernalCodeSegType" label="类型：">
              <el-input v-model="ruleForm.kernalCodeSegType" disabled type="text"></el-input>
            </el-form-item>
            <el-form-item class="uploadItem" prop="kernalCodeSegInterval" label="时间间隔：">
              <el-input v-model="ruleForm.kernalCodeSegInterval" type="text" @blur="blur2"></el-input>
              <div class="unit2">秒</div>
            </el-form-item>
          </div>
        </div>
        <div class="boxContainer">
          <div class="titleContainer" :class="{titleColor: flag3 == true}">
            <el-form-item class="nameSwitch" prop="dmIdtSwitch" label="中断描述表：">
              <el-switch v-model="ruleForm.dmIdtSwitch" :active-text="activeText3" :active-value="1" :inactive-value="0" @change="switchChange3">
              </el-switch>
            </el-form-item>
            <span class="iconStyle" v-show="flag3==false" @click="expandCollapse3"><i class="el-icon-arrow-right"></i></span>
            <span class="iconStyle" v-show="flag3==true" @click="expandCollapse3"><i class="el-icon-arrow-down"></i></span>
          </div>
          <div class="itemStyle" v-show="flag3==true">
            <el-form-item class="uploadItem" prop="dmIdtType" label="类型：">
              <el-input v-model="ruleForm.dmIdtType" disabled type="text"></el-input>
            </el-form-item>
            <el-form-item class="uploadItem" prop="dmIdtInterval" label="时间间隔：">
              <el-input v-model="ruleForm.dmIdtInterval" type="text" @blur="blur3"></el-input>
              <div class="unit2">秒</div>
            </el-form-item>
          </div>
        </div>
        <div class="boxContainer">
          <div class="titleContainer" :class="{titleColor: flag4 == true}">
            <el-form-item class="nameSwitch" prop="moduleListSwitch" label="模块列表：">
              <el-switch v-model="ruleForm.moduleListSwitch" :active-text="activeText4" :active-value="1" :inactive-value="0" @change="switchChange4">
              </el-switch>
            </el-form-item>
            <span class="iconStyle" v-show="flag4==false" @click="expandCollapse4"><i class="el-icon-arrow-right"></i></span>
            <span class="iconStyle" v-show="flag4==true" @click="expandCollapse4"><i class="el-icon-arrow-down"></i></span>
          </div>
          <div class="itemStyle" v-show="flag4==true">
            <el-form-item class="uploadItem" prop="moduleListType" label="类型：">
              <el-input v-model="ruleForm.moduleListType" disabled type="text"></el-input>
            </el-form-item>
            <el-form-item class="uploadItem" prop="moduleListInterval" label="时间间隔：">
              <el-input v-model="ruleForm.moduleListInterval" type="text" @blur="blur4"></el-input>
              <div class="unit2">秒</div>
            </el-form-item>
          </div>
        </div>
        <div class="boxContainer">
          <div class="titleContainer" :class="{titleColor: flag5 == true}">
            <el-form-item class="nameSwitch" prop="filesystemSwitch" label="文件系统：">
              <el-switch v-model="ruleForm.filesystemSwitch" :active-text="activeText5" :active-value="1" :inactive-value="0" @change="switchChange5">
              </el-switch>
            </el-form-item>
            <span class="iconStyle" v-show="flag5==false" @click="expandCollapse5"><i class="el-icon-arrow-right"></i></span>
            <span class="iconStyle" v-show="flag5==true" @click="expandCollapse5"><i class="el-icon-arrow-down"></i></span>
          </div>
          <div class="itemStyle" v-show="flag5==true">
            <el-form-item class="uploadItem" prop="filesystemType" label="类型：">
              <el-input v-model="ruleForm.filesystemType" disabled type="text"></el-input>
            </el-form-item>
            <el-form-item class="uploadItem" prop="filesystemInterval" label="时间间隔：">
              <el-input v-model="ruleForm.filesystemInterval" type="text" @blur="blur5"></el-input>
              <div class="unit2">秒</div>
            </el-form-item>
          </div>
        </div>
        <div class="boxContainer">
          <div class="titleContainer" :class="{titleColor: flag6 == true}">
            <el-form-item class="nameSwitch" prop="networkSwitch" label="网络协议：">
              <el-switch v-model="ruleForm.networkSwitch" :active-text="activeText6" :active-value="1" :inactive-value="0" @change="switchChange6">
              </el-switch>
            </el-form-item>
            <span class="iconStyle" v-show="flag6==false" @click="expandCollapse6"><i class="el-icon-arrow-right"></i></span>
            <span class="iconStyle" v-show="flag6==true" @click="expandCollapse6"><i class="el-icon-arrow-down"></i></span>
          </div>
          <div class="itemStyle" v-show="flag6==true">
            <el-form-item class="uploadItem" prop="networkType" label="类型：">
              <el-input v-model="ruleForm.networkType" disabled type="text"></el-input>
            </el-form-item>
            <el-form-item class="uploadItem" prop="networkInterval" label="时间间隔：">
              <el-input v-model="ruleForm.networkInterval" type="text" @blur="blur6"></el-input>
              <div class="unit2">秒</div>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="diaclose" class="canBtn">取消</el-button>
      <el-button size="small" class="sureBtn" :disabled="btnvalue1" @click="submitForm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "ConfigStrategy",
  data() {
    var validatePass = (rule, value, callback) => {
      var reg = /^\d+$/;
      if (!reg.test(value) || parseInt(value) < 10 || parseInt(value) > 300) {
        callback("请输入10到300之间值");
      } else {
        callback();
      }
    };
    return {
      activeText1:"",
      activeText2:"",
      activeText3:"",
      activeText4:"",
      activeText5:"",
      activeText6:"",
      btnvalue1: false,
      activeName: "first",
      dialogFormVisible: false,
      labelPosition: "right",
      flag1:false,
      flag2:false,
      flag3:false,
      flag4:false,
      flag5:false,
      flag6:false,
      rules: {
        systemCallInterval: [{ required: true, validator: validatePass, trigger: "blur" },],
        kernalCodeSegInterval: [{ required: true, validator: validatePass, trigger: "blur" },],
        dmIdtInterval: [{ required: true, validator: validatePass, trigger: "blur" },],
        moduleListInterval: [{ required: true, validator: validatePass, trigger: "blur" },],
        filesystemInterval: [{ required: true, validator: validatePass, trigger: "blur" },],
        networkInterval: [{ required: true, validator: validatePass, trigger: "blur" },],
      },
      ruleForm: {
        systemCallSwitch:"",
        systemCallType: "syscall_table",
        systemCallInterval: "",

        kernalCodeSegType: "kernel_section",
        kernalCodeSegInterval: "",
        kernalCodeSegSwitch:"",

        dmIdtType: "idt_table",
        dmIdtInterval: "",
        dmIdtSwitch:"",

        moduleListType: "module_list",
        moduleListInterval: "",
        moduleListSwitch:"",
        
        filesystemType: "filesystem",
        filesystemInterval: "",
        filesystemSwitch:"",

        networkType: "network",
        networkInterval: "",
        networkSwitch:"",
      },
      nodeid: "",
      ip:''
    };
  },
  methods: {
    diaOpen(param) {
      var that = this;
      that.dialogFormVisible = true;
      that.btnvalue1 = false;
      that.activeName = "first";
      that.nodeid = param.nodeId;
      that.ip = param.ip
      that.$nextTick(function () {
        that.$refs.ruleForm.clearValidate();
      });
      if (param) {
        that.ruleForm.systemCallSwitch = param.systemCallSwitch
        that.ruleForm.systemCallInterval = param.systemCallInterval

        that.ruleForm.kernalCodeSegSwitch = param.kernalCodeSegSwitch
        that.ruleForm.kernalCodeSegInterval = param.kernalCodeSegInterval

        that.ruleForm.dmIdtSwitch = param.dmIdtSwitch
        that.ruleForm.dmIdtInterval = param.dmIdtInterval

        that.ruleForm.moduleListSwitch = param.moduleListSwitch
        that.ruleForm.moduleListInterval = param.moduleListInterval

        that.ruleForm.filesystemSwitch = param.filesystemSwitch
        that.ruleForm.filesystemInterval = param.filesystemInterval

        that.ruleForm.networkSwitch = param.networkSwitch
        that.ruleForm.networkInterval = param.networkInterval;
      } else {
        that.ruleForm.systemCallSwitch = 0
        that.ruleForm.systemCallInterval = 60;

        that.ruleForm.kernalCodeSegSwitch = 0
        that.ruleForm.kernalCodeSegInterval = 60;

        that.ruleForm.dmIdtSwitch = 0
        that.ruleForm.dmIdtInterval = 60;

        that.ruleForm.moduleListSwitch = 0
        that.ruleForm.moduleListInterval = 60;

        that.ruleForm.filesystemSwitch = 0
        that.ruleForm.filesystemInterval = 60;

        that.ruleForm.networkSwitch = 0
        that.ruleForm.networkInterval = 60;
      }

      if (that.ruleForm.systemCallSwitch == 0) {
        that.activeText1="关闭"
        that.ruleForm.systemCallInterval = 10;
      } else if (that.ruleForm.systemCallSwitch == 1) {
        that.activeText1="开启"
        that.ruleForm.systemCallInterval = param.systemCallInterval
      }
      if (that.ruleForm.kernalCodeSegSwitch == 0) {
        that.activeText2="关闭"
        that.ruleForm.kernalCodeSegInterval = 10;
      } else if (that.ruleForm.kernalCodeSegSwitch == 1) {
        that.activeText2="开启"
        that.ruleForm.systemCallInterval = param.systemCallInterval
      }
      if (that.ruleForm.dmIdtSwitch == 0) {
        that.activeText3="关闭"
        that.ruleForm.dmIdtInterval = 10;
      } else if (that.ruleForm.dmIdtSwitch == 1) {
        that.activeText3="开启"
        that.ruleForm.systemCallInterval = param.systemCallInterval
      }
      if (that.ruleForm.moduleListSwitch == 0) {
        that.activeText4="关闭"
        that.ruleForm.moduleListInterval = 10;
      } else if (that.ruleForm.moduleListSwitch == 1) {
        that.activeText4="开启"
        that.ruleForm.systemCallInterval = param.systemCallInterval
      }
      if (that.ruleForm.filesystemSwitch == 0) {
        that.activeText5="关闭"
        that.ruleForm.filesystemInterval = 10;
      } else if (that.ruleForm.filesystemSwitch == 1) {
        that.activeText5="开启"
        that.ruleForm.systemCallInterval = param.systemCallInterval
      }
      if (that.ruleForm.networkSwitch == 0) {
        that.activeText6="关闭"
        that.ruleForm.networkInterval = 10;
      } else if (that.ruleForm.networkSwitch == 1) {
        that.activeText6="开启"
        that.ruleForm.systemCallInterval = param.systemCallInterval
      }
    },
    diaclose() {
      this.dialogFormVisible = false;
    },
    switchChange1(val) {
      if (val == 0) {
        this.activeText1 = "关闭"
      } else if (val == 1) {
        this.activeText1 = "开启"
      }
    },
    switchChange2(val) {
      if (val == 0) {
        this.activeText2 = "关闭"
      } else if (val == 1) {
        this.activeText2 = "开启"
      }
    },
    switchChange3(val) {
      if (val == 0) {
        this.activeText3 = "关闭"
      } else if (val == 1) {
        this.activeText3 = "开启"
      }
    },
    switchChange4(val) {
      if (val == 0) {
        this.activeText4 = "关闭"
      } else if (val == 1) {
        this.activeText4 = "开启"
      }
    },
    switchChange5(val) {
      if (val == 0) {
        this.activeText5 = "关闭"
      } else if (val == 1) {
        this.activeText5 = "开启"
      }
    },
    switchChange6(val) {
      if (val == 0) {
        this.activeText6 = "关闭"
      } else if (val == 1) {
        this.activeText6 = "开启"
      }
    },
    expandCollapse1 () {
      this.flag1 = !this.flag1
    },
    expandCollapse2 () {
      this.flag2 = !this.flag2
    },
    expandCollapse3 () {
      this.flag3 = !this.flag3
    },
    expandCollapse4 () {
      this.flag4 = !this.flag4
    },
    expandCollapse5 () {
      this.flag5 = !this.flag5
    },
    expandCollapse6 () {
      this.flag6 = !this.flag6
    },
    blur1() {
      var that = this;
      var reg = /^\d+$/;
      if ( !reg.test(that.ruleForm.systemCallInterval) || parseInt(that.ruleForm.systemCallInterval) < 10 ||
        parseInt(that.ruleForm.systemCallInterval) > 300) {
        that.$message({ message: "系统调用表时间间隔应为10到300之间数值", type: "error", showClose: true});
      }
    },
    blur2() {
      var that = this;
      var reg = /^\d+$/;
      if ( !reg.test(that.ruleForm.kernalCodeSegInterval) || parseInt(that.ruleForm.kernalCodeSegInterval) < 10 ||
        parseInt(that.ruleForm.kernalCodeSegInterval) > 300
      ) {
        that.$message({ message: "内核代码段时间间隔应为10到300之间数值", type: "error", showClose: true});
      }
    },
    blur3() {
      var that = this;
      var reg = /^\d+$/;
      if ( !reg.test(that.ruleForm.dmIdtInterval) || parseInt(that.ruleForm.dmIdtInterval) < 10 ||
        parseInt(that.ruleForm.dmIdtInterval) > 300
      ) {
        that.$message({ message: "中断描述符表时间间隔应为10到300之间数值", type: "error", showClose: true});
      }
    },
    blur4() {
      var that = this;
      var reg = /^\d+$/;
      if ( !reg.test(that.ruleForm.moduleListInterval) || parseInt(that.ruleForm.moduleListInterval) < 10 ||
        parseInt(that.ruleForm.moduleListInterval) > 300
      ) {
        that.$message({ message: "模块列表时间间隔应为10到300之间数值", type: "error", showClose: true});
      }
    },
    blur5() {
      var that = this;
      var reg = /^\d+$/;
      if ( !reg.test(that.ruleForm.filesystemInterval) || parseInt(that.ruleForm.filesystemInterval) < 10 ||
        parseInt(that.ruleForm.filesystemInterval) > 300
      ) {
        that.$message({ message: "文件系统时间间隔应为10到300之间数值", type: "error", showClose: true});
      }
    },
    blur6() {
      var that = this;
      var reg = /^\d+$/;
      if ( !reg.test(that.ruleForm.networkInterval) || parseInt(that.ruleForm.networkInterval) < 10 ||
        parseInt(that.ruleForm.networkInterval) > 300
      ) {
        that.$message({ message: "网络协议时间间隔应为10到300之间数值", type: "error", showClose: true});
      }
    },
    submitForm(formName) {
      var that = this;
      // if () {

      // }
      that.$refs[formName].validate((valid) => {
        if (valid) { 
          that.btnvalue1 = true;
          request({
            url: "/sec/updatelDMeraurePolicy",method: "post",
            data: {
              nodeid: that.nodeid,
              systemCallType: that.ruleForm.systemCallType,
              systemCallInterval: that.ruleForm.systemCallInterval,
              systemCallSwitch: that.ruleForm.systemCallSwitch,

              kernalCodeSegType: that.ruleForm.kernalCodeSegType,
              kernalCodeSegInterval: that.ruleForm.kernalCodeSegInterval,
              kernalCodeSegSwitch: that.ruleForm.kernalCodeSegSwitch,

              dmIdtType: that.ruleForm.dmIdtType,
              dmIdtInterval: that.ruleForm.dmIdtInterval,
              dmIdtSwitch: that.ruleForm.dmIdtSwitch,

              moduleListType: that.ruleForm.moduleListType,
              moduleListInterval: that.ruleForm.moduleListInterval,
              moduleListSwitch: that.ruleForm.moduleListSwitch,

              filesystemType: that.ruleForm.filesystemType,
              filesystemInterval: that.ruleForm.filesystemInterval,
              filesystemSwitch: that.ruleForm.filesystemSwitch,

              networkType: that.ruleForm.networkType,
              networkInterval: that.ruleForm.networkInterval,
              networkSwitch: that.ruleForm.networkSwitch,
            }
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
              that.$message({ message: "操作成功!", type: "success", showClose: true,});
              that.dialogFormVisible = false;
              that.$emit("initTable");
            } else {
              that.btnvalue1 = false;
              // that.$message({ message: res.errormessage, type: "error", duration: 0, showClose: true,});
            }
          });
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.containerStyle {
  max-height: calc(75vh - 150px);
  overflow: auto;
}
.uploadItem {
  margin: 16px 0 14px;
}
.el-input {
  float: left;
  width: 90%;
}
.unit2 {
  height: 40px;
  line-height: 40px;
  margin-left: 10px;
}
.boxContainer {
  margin-bottom: 10px;
  border: 1px solid #DEDEDE;
}
.boxTitle {
  display: flex;
}
.titleContainer {
  display: flex;
  justify-content: space-between;
  align-items:center;
  padding: 10px 0;
}
.titleColor {
  background-color: #F5F5F5;
}
.nameSwitch {
  margin-left: 20px;
}
.iconStyle {
  cursor: pointer;
  margin-right: 20px;
}
.iconStyle i {
  font-weight: bold;
}
.itemStyle {
  display: flex;
  border-top: 1px solid #DEDEDE;
}
.dialog-footer .sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff;
}
.titleContainer .el-form-item--mini.el-form-item, 
.titleContainer .el-form-item--small.el-form-item {
  margin-bottom: 0;
}
.form >>>.el-switch.is-checked .el-switch__core {
  border-color: #1ac492;
  background-color: #1ac492;
}
.form >>>.el-switch__label.is-active {
  color: #1ac492;
}
</style>
