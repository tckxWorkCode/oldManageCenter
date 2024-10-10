<template>
  <el-dialog title="动态度量策略" top="5vh" width="32%" :visible.sync="dialogFormVisible" @close="diaclose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="100px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small" class="form">
      <el-form-item prop="ip" label="网络地址：">
        <el-input style="width:80%" v-model="ip" clearable disabled>{{ip}}</el-input>
      </el-form-item>
      <el-form-item class="uploadItem" prop="timeInterval" label="时间间隔：">
        <el-input style="width:50%" v-model="ruleForm.timeInterval" type="text" placeholder="请输入10-300之间的值" @change="handleTimeInterval"></el-input>
        <div class="unit2">秒</div>
      </el-form-item>
      <el-form-item label="策略配置：">
        <div style="display:flex">
          <div>
            <el-checkbox :true-label="1" :false-label="0" v-model="ruleForm.systemCallSwitch">系统调用表(syscall_table)</el-checkbox>
            <el-checkbox :true-label="1" :false-label="0" v-model="ruleForm.kernalCodeSegSwitch">内核代码段(kernel_section)</el-checkbox>
          </div>
          <div>
            <el-checkbox :true-label="1" :false-label="0" v-model="ruleForm.dmIdtSwitch">中断描述表(idt_table)</el-checkbox>
            <el-checkbox :true-label="1" :false-label="0" v-model="ruleForm.gdtSwitch">全局描述符(gdt)</el-checkbox>
          </div>
        </div>
      </el-form-item>
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
      if (parseInt(value) < 10 || parseInt(value) > 300) {
        callback("请输入10到300之间的值");
      } else if (!reg.test(value)) {
        callback(new Error("请输入10到300之间的值"));
      } else if (value === "") {
        callback(new Error("请输入10到300之间的值"));
      } else {
        callback();
      }
    };
    return {
      btnvalue1: false,
      activeName: "first",
      dialogFormVisible: false,
      labelPosition: "right",
      rules: {
        timeInterval: [{ required: true, validator: validatePass, trigger: "blur" },],
      },
      ruleForm: {
        timeInterval: "",
        systemCallSwitch:"",
        kernalCodeSegSwitch:"",
        dmIdtSwitch:"",
        gdtSwitch:"",
      },
      nodeid: "",
      ip:'',
      
    };
  },
  methods: {
    diaOpen(param) {
      // console.log(param)
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
        that.ruleForm.timeInterval = param.systemCallInterval

        that.ruleForm.systemCallSwitch = param.systemCallSwitch
        that.ruleForm.kernalCodeSegSwitch = param.kernalCodeSegSwitch
        that.ruleForm.dmIdtSwitch = param.dmIdtSwitch
        that.ruleForm.gdtSwitch = param.gdtSwitch
      } else {
        that.ruleForm.timeInterval = 60

        that.ruleForm.systemCallSwitch = 0
        that.ruleForm.kernalCodeSegSwitch = 0
        that.ruleForm.dmIdtSwitch = 0
        that.ruleForm.gdtSwitch = 0
      }
    },
    diaclose() {
      this.dialogFormVisible = false;
    },
    handleTimeInterval(val) {
      if(val) {this.btnvalue1 = false;}
    },
    submitForm(formName) {
      var that = this;
      // console.log(that.ruleForm.timeInterval)
      var timeInterval = ""
      if (that.ruleForm.timeInterval == "" ||that.ruleForm.timeInterval == null ) {
        timeInterval = 60
      } else {
        timeInterval = that.ruleForm.timeInterval
      }
      that.$refs[formName].validate((valid) => {
        if (valid) { 
          that.btnvalue1 = true;
          request({
            url: "/sec/updatelDMeraurePolicy",method: "post",
            data: {
              nodeid: that.nodeid,
              systemCallType: "syscall_table",
              systemCallInterval: timeInterval,
              systemCallSwitch: that.ruleForm.systemCallSwitch,

              kernalCodeSegType: "kernel_section",
              kernalCodeSegInterval: timeInterval,
              kernalCodeSegSwitch: that.ruleForm.kernalCodeSegSwitch,

              dmIdtType: "idt_table",
              dmIdtInterval: timeInterval,
              dmIdtSwitch: that.ruleForm.dmIdtSwitch,

              moduleListType: "gdt",
              moduleListInterval: timeInterval,
              gdtSwitch: that.ruleForm.gdtSwitch,
            }
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
              that.$message({ message: "操作成功!", type: "success", showClose: true,});
              that.dialogFormVisible = false;
              that.$emit("initTable");
            } else {
              that.btnvalue1 = false;
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
}
.unit2 {
  height: 40px;
  line-height: 40px;
  margin-left: 15px;
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
.form >>>.el-checkbox__input.is-checked+.el-checkbox__label {
  color: #606266;
}
</style>
