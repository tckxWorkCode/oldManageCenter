<template>
  <!--新建开始-->
  <el-dialog title="配置策略" top="10vh" width="30%" :visible.sync="dialogFormVisible" @closed="diaClose" :close-on-click-modal="false" append-to-body>
    <el-form :label-position="labelPosition" label-width="145px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <el-form-item prop="measureName" label="度量对象：">
        <el-input style="width:80%" v-model="ruleForm.measureName" clearable></el-input>
      </el-form-item>
      <el-form-item prop="measureStage" label="度量阶段：">
        <el-input style="width:80%" v-model="ruleForm.measureStage" clearable></el-input>
      </el-form-item>
      <el-form-item prop="measureHash" label="HASH：">
        <el-input style="width:80%" v-model="ruleForm.measureHash" clearable></el-input>
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
  name: "ConfigStrategy",
  data() {
    return {
      btnf1: false,
      dialogFormVisible: false,
      labelPosition: "right",
      rules: {
        measureName:[{ required: true, message: '请输入度量对象名称', trigger: 'blur' }],
        measureStage:[{ required: true, message: '请输入度量对象阶段', trigger: 'blur' }],
        measureHash:[{ required: true, message: '请输入hash', trigger: 'blur' }],
      },
      ruleForm: {
        measureName:'',
        measureStage:'',
        measureHash:'',
      },
    };
  },
  methods: {
    submitForm(formName) {
      var that = this
      that.$refs[formName].validate((valid) => {
        if (valid) {
          var datas = {
            name:that.ruleForm.measureName,
            stage:that.ruleForm.measureStage,
            hash:that.ruleForm.measureHash,
          }
          // console.log(datas)
          that.$emit("policy", datas);
          that.diaClose()
        } else {
          that.btnf1 = false;
        }
      });
    },
    diaOpen() {
      var that = this;
      this.dialogFormVisible = true;
      this.btnf1 = false;
      this.ruleForm.measureName = ''
      this.ruleForm.measureStage = ''
      this.ruleForm.measureHash = ''
      that.$nextTick(function () {
        that.$refs.ruleForm.clearValidate()
      })
    },
    diaClose() {
      var that = this;
      that.dialogFormVisible = false;
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
</style>
