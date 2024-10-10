<template>
  <!--新建开始-->
  <el-dialog title="配置策略" top="10vh" width="35%" :visible.sync="dialogFormVisible" @closed="diaclose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="150px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <el-form-item prop="ip" label="网络地址：">
        <el-input style="width:70%" v-model="ip" clearable disabled>{{ip}}</el-input>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="动态度量审计策略：" prop="dmeasureType">
        <el-radio-group v-model="ruleForm.dmeasureType">
          <!-- <el-radio :label="1">成功</el-radio> -->
          <el-radio :label="2">失败</el-radio>
          <el-radio :label="4">不审计</el-radio>
          <!-- <el-radio :label="8">全审计</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="白名单审计策略：" prop="smeasureType">
        <el-radio-group v-model="ruleForm.smeasureType">
          <!-- <el-radio :label="1">成功</el-radio> -->
          <el-radio :label="2">失败</el-radio>
          <el-radio :label="4">不审计</el-radio>
          <!-- <el-radio :label="8">全审计</el-radio> -->
        </el-radio-group>
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
        dmeasureType:[{ required: true, message: '请选择动态度量审计策略', trigger: 'change' }],
        smeasureType:[{ required: true, message: '请选择白名单审计策略', trigger: 'change' }],
      },
      ruleForm: {
        dmeasureType:'',
        smeasureType:'',
      },
      nodeId:'',
      ip:''
    };
  },
  methods: {
    submitForm(formName) {
      var that = this
      that.$refs[formName].validate((valid) => {
        if (valid) {
          var datas = {
            nodeId: that.nodeId,
            dmeasureType:that.ruleForm.dmeasureType,
            smeasureType:that.ruleForm.smeasureType,
          }
          // console.log(datas)
          request({ url: "/aud/log/auditPolicySet", method: "post", data: datas,
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
    diaOpen(param) {
      var that = this;
      this.dialogFormVisible = true;
      this.btnf1 = false;
      this.ip = param.nodeIp
      this.nodeId = param.nodeId
      request({ url: "/aud/log/auditPolicySearchByNodeId?node_id=" + param.nodeId, method: "post",
      }).then((response) => {
        var res = response.data
        // console.log(res)
        that.ruleForm.dmeasureType = res.dmeasureType
        that.ruleForm.smeasureType = res.smeasureType
      });
      that.$nextTick(function () {
        that.$refs.ruleForm.clearValidate()
      })
    },
    diaclose() {
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
