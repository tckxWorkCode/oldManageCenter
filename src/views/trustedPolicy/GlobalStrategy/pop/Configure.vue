<template>
  <el-dialog title="全局策略" width="20%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="120px" :rules="rules" :model="ruleForm" ref="ruleForm" class="form">
      <el-form-item prop="ip" label="网络地址：">
        <el-input style="width:80%" v-model="ip" clearable disabled>{{ip}}</el-input>
      </el-form-item>
      <el-form-item prop="be_boot_measure_on" label="启动度量：">
        <el-switch v-model="ruleForm.be_boot_measure_on" :active-text="activeText1" :active-value="1" :inactive-value="0" @change="switchChange1">
        </el-switch>
      </el-form-item>
      <el-form-item prop="be_boot_control" label="启动度量控制：">
        <el-switch v-model="ruleForm.be_boot_control" :active-text="activeText2" :active-value="1" :inactive-value="0" @change="switchChange2">
        </el-switch>
      </el-form-item>
      <el-form-item prop="be_dynamic_measure_on" label="动态度量：">
        <el-switch v-model="ruleForm.be_dynamic_measure_on" :active-text="activeText3" :active-value="1" :inactive-value="0" @change="switchChange3">
        </el-switch>
      </el-form-item>
      <el-form-item prop="be_program_control" label="白名单控制：">
        <el-switch v-model="ruleForm.be_program_control" :active-text="activeText4" :active-value="1" :inactive-value="0" @change="switchChange4">
        </el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="diaClose" class="canBtn">取消</el-button>
      <el-button size="small" class="sureBtn" :disabled="btnvalue1" @click="submitForm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "Configure",
  data() {
    return {
      activeText1:"",
      activeText2:"",
      activeText3:"",
      activeText4:"",
      btnvalue1: false,
      dialogFormVisible: false,
      labelPosition: "right",
      rules: {
      },
      ruleForm: {
        be_boot_measure_on:0,
        be_boot_control:0,
        be_dynamic_measure_on:0,
        be_program_control:0,
      },
      nodeId: "",
      ip:''
    };
  },
  methods: {
    diaOpen(param) {
      var that = this;
      that.dialogFormVisible = true;
      that.btnvalue1 = false;
      that.ip = param.ip
      that.nodeId = param.nodeId;
      request({
          url: "/sys/searchFuncWwitch?node_id=" +param.nodeId,
          method: "post",
        }).then((response) => {
          var res = response.data
          // console.log(res)
          if (res.status === 0) {
            if(res.object) {
              that.ruleForm.be_boot_measure_on = res.object.be_boot_measure_on,
              that.ruleForm.be_boot_control = res.object.be_boot_control,
              that.ruleForm.be_dynamic_measure_on = res.object.be_dynamic_measure_on,
              that.ruleForm.be_program_control = res.object.be_program_control
            } else {
              that.ruleForm.be_boot_measure_on=0,
              that.ruleForm.be_boot_control=0,
              that.ruleForm.be_dynamic_measure_on=0,
              that.ruleForm.be_program_control=0
            }
            if (that.ruleForm.be_boot_measure_on == 0) {
              that.activeText1="关闭"
            } else if (that.ruleForm.be_boot_measure_on == 1) {
              that.activeText1="开启"
            }
            if (that.ruleForm.be_boot_control == 0) {
              that.activeText2="关闭"
            } else if (that.ruleForm.be_boot_control == 1) {
              that.activeText2="开启"
            }
            if (that.ruleForm.be_dynamic_measure_on == 0) {
              that.activeText3="关闭"
            } else if (that.ruleForm.be_dynamic_measure_on == 1) {
              that.activeText3="开启"
            }
            if (that.ruleForm.be_dynamic_measure_on == 0) {
              that.activeText4="关闭"
            } else if (that.ruleForm.be_dynamic_measure_on == 1) {
              that.activeText4="开启"
            }
          }
        });
      
      that.$nextTick(function () {
        that.$refs.ruleForm.clearValidate();
      });
    },
    diaClose() {
      this.dialogFormVisible = false;
    },
    submitForm(formName) {
      var that = this;
      that.$refs[formName].validate((valid) => {
        if (valid) {
          // that.btnvalue1 = true;
          request({
            url: "/sys/createFuncWwitch",
            method: "post",
            data: {
              node_id: that.nodeId,
              be_boot_measure_on: that.ruleForm.be_boot_measure_on,
              be_boot_control: that.ruleForm.be_boot_control,
              be_dynamic_measure_on: that.ruleForm.be_dynamic_measure_on,
              be_program_control: that.ruleForm.be_program_control,
            },
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
    
  },
};
</script>

<style scoped>
.uploadItem {
  margin-bottom: 14px;
}
.el-input {
  float: left;
  width: 200px;
}
.unit2 {
  height: 40px;
  line-height: 40px;
  margin-left: 10px;
}
.dialog-footer .sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff;
}
.form >>>.el-switch.is-checked .el-switch__core {
  border-color: #1ac492;
  background-color: #1ac492;
}
.form >>>.el-switch__label.is-active {
  color: #1ac492;
}
</style>
