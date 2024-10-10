<template>
  <div>
    <div class="topNav">
      <el-breadcrumb class="breadNav" separator="/">
          <el-breadcrumb-item class="crumb1">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb1">系统设置</el-breadcrumb-item>
          <el-breadcrumb-item class="crumb2">登录设置</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="title">系统设置</div>
    </div>
    <div class="wrap">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="145px" size="small" style="width: 30%; margin: 20px auto 0px auto">
        <el-form-item class="formItem" label="选择保留日志时间：" prop="saveLogTime">
          <el-input class="display-inline" v-model="ruleForm.saveLogTime" clearable placeholder="请输入数字" type="text"></el-input>
          <span class="sydw">天</span>
        </el-form-item>
        <el-form-item class="faselect lastcp" prop="diskSurplusNum" label="磁盘告警阈值：">
          <el-input class="display-inline" v-model="ruleForm.diskSurplusNum" clearable placeholder="请输入1~10240以内的整数值" type="text"></el-input>
          <span class="sydw">M</span>
        </el-form-item>
        <el-form-item class="setrepeat">
          <el-button size="small" class="canBtn" @click="resetForm('ruleForm')">重置</el-button>
          <el-button size="small" class="sureBtn" :disabled="btnvalue1" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "DiskAlarm",
  data() {
    var validatePass = (rule, value, callback) => {
      if (parseInt(value) <= 0 || value === "") {
        callback(new Error("请输入1~10240以内的数值"));
      } else if (/^\s+$/gi.test(value)) {
        callback(new Error("不能为空格"));
      } else if (isNaN(value)) {
        callback(new Error("请输入1~10240以内的数值"));
      } else if (
        value.toString().slice(0, 1) === "0" && value.toString().length > 1
      ) {
        callback(new Error("请输入1~10240以内的数值"));
      } else if (value > 10240) {
        callback(new Error("请输入1~10240以内的数值"));
      } else {
        callback();
      }
    };
    return {
      btnvalue1: false,
      tableData: [],
      dialogFormVisible: false,
      labelPosition: "right",
      rules: {
        saveLogTime: [{ required: true, message: '请输入保留日志时间', trigger: 'blur' }],
        diskSurplusNum: [{ required: true, validator: validatePass, trigger: "blur" },],
      },
      ruleForm: {
        saveLogTime:"",
        diskSurplusNum: "",
      },
    };
  },
  mounted: function () {
    var that = this;
    request({url: "/sys/configDetail", method: "post",})
      .then((response) => {
        var res = response.data
        // console.log(res)
        that.tableData.splice(0, that.tableData.length);
        res.map(function(value,index) {
          if (value.config_type ==1) {
            that.ruleForm.saveLogTime = value.config_item_val
          } else if(value.config_type ==2) {
            that.ruleForm.diskSurplusNum = value.config_item_val
          }
        })
      });
  },
  methods: {
    diaclose() {
      var that = this;
      that.dialogFormVisible = false;
    },
    resetForm(formName) {
      var that = this;
      that.$refs[formName].resetFields();
    },
    submitForm(formName) {
      var that = this;
      that.tableData = [
        {config_type:1,config_item_val:that.ruleForm.saveLogTime},
        {config_type:2,config_item_val:that.ruleForm.diskSurplusNum}
      ]
      // console.log(that.tableData)
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.btnvalue1 = true;
          request({
            url: "/sys/editConfig",
            method: "post",
            data: {configs:that.tableData},
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
              that.$message({ message: "操作成功!", type: "success", showClose: true,});
              that.btnvalue1 = false;
            } else {
              that.btnvalue1 = false;
              // that.$message({message: res.errormessage,type: "error",duration: 0,showClose: true,});
            }
          });
        } else {
          that.btnvalue1 = false;
          return false;
        }
      });
    },
  },

};
</script>

<style scoped>
.topNav {
  position: absolute;
  top: 0px;
  font-size: 14px;
  margin-left: 24px;
}
.title {
  font-family: 'PingFang-SC-Bold';
  font-size: 20px;
  font-weight: bold;
  color: #000;
  padding: 18px 0;
}
.breadNav {
  padding-top: 18px;
}
.wrap{
  overflow: auto;
  height: calc(100vh - 96px);
  padding: 24px;
  background-color: #f0f2f5;
}
.sydw{
  position: absolute;
  right: -33px;
  top: 0px;
}
.sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff;
}
</style>
