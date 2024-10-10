<template>
  <el-dialog title="标记设备" width="30%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false" append-to-body>
    <el-form :label-position="labelPosition" label-width="100px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <el-form-item prop="name" label="别名：">
        <el-input style="width:80%" v-model="ruleForm.name" clearable placeholder='请输入别名'></el-input>
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
  name: 'CreateTemplate',
  data () {
    return {
      btnvalue1:false,
      dialogFormVisible: false,
      labelPosition: 'right',
      rules: {
        name: [{ required: true, message: '请输入别名', trigger: 'blur' },],
      },
      ruleForm: {
        name: '',
      },
      guid:'',
    }
  },
  methods: {
    diaOpen (row) {
      var that = this
      this.guid = row.guid
      this.ruleForm.name = ''  
      this.dialogFormVisible = true
      this.btnvalue1 = false
      
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
          var datas = {
            guid: this.guid,
            name: this.ruleForm.name
          }
          // console.log(datas)
          request({ url: '/markUdisk', data:datas, method: 'post'
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
              that.$message({message: '修改别名成功!', type: 'success', showClose: true })
              that.dialogFormVisible = false
              that.$emit('success')
            } else {
              that.btnvalue1 = false
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
    },
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
