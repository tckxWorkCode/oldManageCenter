<template>
  <el-dialog title="全局策略" top="10vh" width="20%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="120px" :rules="rules" :model="ruleForm" ref="ruleForm" class="form">
      <el-form-item prop="ip" label="网络地址：">
        <el-input style="width:80%" v-model="ip" clearable disabled>{{ip}}</el-input>
      </el-form-item>
      <el-form-item prop="be_boot_measure_on" label="启动度量：" :hidden ="winDisable">
        <el-switch v-model="ruleForm.be_boot_measure_on" :active-text="activeText1" :active-value="1" :inactive-value="0" @change="switchChange1">
        </el-switch>
      </el-form-item>
      <el-form-item prop="be_boot_control" label="启动度量控制：" :hidden ="winDisable">
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
      <!-- <el-form-item prop="be_program_measure_on" label="白名单控制：" :hidden ="linuxDisable">
        <el-switch v-model="ruleForm.be_program_measure_on" :active-text="activeText7" :active-value="1" :inactive-value="0" @change="switchChange7">
        </el-switch>
      </el-form-item> -->
      <el-form-item prop="protect_module" label="模块防卸载：">
        <el-switch v-model="ruleForm.protect_module" :active-text="activeText5" :active-value="1" :inactive-value="0" @change="switchChange5">
        </el-switch>
      </el-form-item>
      <el-form-item prop="protect_process" label="进程防杀：">
        <el-switch v-model="ruleForm.protect_process" :active-text="activeText6" :active-value="1" :inactive-value="0" @change="switchChange6">
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
      activeText5:"",
      activeText6:"",
      activeText7:"",
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
        protect_module:0,
        protect_process:0,
        be_program_measure_on:1,
      },
      winDisable:false,
      linuxDisable: false,
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
      if (param.system=="linux" || param.system =="Linux") {
        that.winDisable = false
        that.linuxDisable = true
      } else {
        that.winDisable = true
        that.linuxDisable = false
      }
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
              that.ruleForm.protect_module = res.object.protect_module,
              that.ruleForm.protect_process = res.object.protect_process
              that.ruleForm.be_program_measure_on = res.object.be_program_measure_on
              if (that.ruleForm.protect_module == null && param.system.indexOf('win')) {that.ruleForm.protect_module = 1}
              if (that.ruleForm.protect_process == null && param.system.indexOf('win')) {that.ruleForm.protect_process = 1}
            } else {
              that.ruleForm.be_boot_measure_on=0,
              that.ruleForm.be_boot_control=0,
              that.ruleForm.be_dynamic_measure_on=0,
              that.ruleForm.be_program_control=0,
              // that.ruleForm.protect_module = 0,
              // that.ruleForm.protect_process = 0
              that.ruleForm.be_program_measure_on = 1
              if (param.system=="linux" || param.system =="Linux") {
                that.ruleForm.protect_module = 0,
                that.ruleForm.protect_process = 0
              } else {
                that.ruleForm.protect_module = 1,
                that.ruleForm.protect_process = 1
              }
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
            if (that.ruleForm.be_program_control == 0) {
              that.activeText4="关闭"
            } else if (that.ruleForm.be_program_control == 1) {
              that.activeText4="开启"
            }
            if (that.ruleForm.protect_module == 0) {
              that.activeText5="关闭"
            } else if (that.ruleForm.protect_module == 1) {
              that.activeText5="开启"
            } else {
              that.activeText5="关闭"
            }
            if (that.ruleForm.protect_process == 0) {
              that.activeText6="关闭"
            } else if (that.ruleForm.protect_process == 1) {
              that.activeText6="开启"
            } else {
              that.activeText6="关闭"
            }
            if (that.ruleForm.be_program_measure_on == 0) {
              that.activeText7="关闭"
            } else if (that.ruleForm.be_program_measure_on == 1) {
              that.activeText7="开启"
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
              protect_module: that.ruleForm.protect_module,
              protect_process: that.ruleForm.protect_process,
              be_program_measure_on: 1,
            },
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
              that.$message({ message: "操作成功!", type: "success", showClose: true,});
              that.dialogFormVisible = false;
              that.$emit("initTable");
            } else {
              // that.btnvalue1 = false;
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
    switchChange7(val) {
      if (val == 0) {
        this.activeText7 = "关闭"
      } else if (val == 1) {
        this.activeText7 = "开启"
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
