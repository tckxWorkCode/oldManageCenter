<template>
  <el-dialog title="修改终端名称" width="25%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="100px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <el-form-item prop="ip" label="网络地址：">
        <el-input style="width:80%" v-model="ip" clearable disabled>{{ip}}</el-input>
      </el-form-item>
      <el-form-item prop="name" label="终端名称：">
        <el-input style="width:80%" v-model="ruleForm.name" clearable placeholder='请输入终端名称'></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="canBtn" @click="dialogFormVisible = false">取 消</el-button>
      <el-button size="small" class="sureBtn" :disabled="btnvalue1" @click="submitForm('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'AddIdentity',
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入终端名称"));
      } else if (value.length > 20) {
        callback(new Error("终端名称长度不超出20个字符"));
      } else if (
        /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\_\.]/g.test(value)
      ) {
        callback(new Error("终端名称只能输入中文、英文、数字、_和.符号"));
      } else {
        callback();
      }
    };
    return {
      btnvalue1:false,
      dialogFormVisible: false,
      labelPosition: 'right',
      rules: {
        name: [{ required: true, validator: validatePass, trigger: 'blur' },],
      },
      ruleForm: {
        name: '',
      },
      nodeId:'',
      ip:''
    }
  },
  methods: {
    diaOpen (row) {
      var that = this
      this.nodeId = row.nodeId
      this.ip = row.ip
      this.ruleForm.name = row.name;
      that.dialogFormVisible = true
      that.btnvalue1 = false
      that.$nextTick(function () {
        that.$refs.ruleForm.clearValidate()
      })
    },
    diaClose () {
      var that = this
      that.dialogFormVisible = false
    },
    submitForm (formName) {
      var that = this
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.btnvalue1 = true
          request({
            url: '/sys/editNodeInfo',
            data: {
              nodeId:that.nodeId,
              name:that.ruleForm.name,
            },
            method: 'post'
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
            that.$message({message: '操作成功!', type: 'success', showClose: true })
            that.dialogFormVisible = false
            that.$emit('addSuccess')
            } else {
              that.btnvalue1 = false
              // that.$message({message: res.errormessage, type: 'error', duration: 0, showClose: true })
            }
          })
        } else {
          that.btnvalue1 = false
          return false
        }
      })
    },
    resetForm (formName) {
      var that = this
      that.$refs[formName].resetFields()
    }
  }
}
</script>

<style scope>
.sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff;
}
</style>
