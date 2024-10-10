<template>
  <el-dialog title="创建程序包模板" width="40%" top="10vh" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="100px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <el-form-item prop="ip" label="网络地址：">
        <el-input style="width:80%" v-model="ip" clearable disabled>{{ip}}</el-input>
      </el-form-item>
      <el-form-item prop="name" label="模板名称：">
        <el-input style="width:80%" v-model="ruleForm.name" clearable placeholder='请输入模板名称'></el-input>
      </el-form-item>
      <el-divider></el-divider>
      <el-table :data="logData" size="small" tooltip-effect="light" style="width: 99.9%;font-size: 14px;border:1px solid #F0F2F5;"
      :header-cell-style="{'background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)'}" :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}"
       max-height="50vh" @selection-change="handleSelectionChange" :fit='true' ref="logTable">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="50px"></el-table-column>
        <el-table-column prop="subject" label="主体"></el-table-column>
        <el-table-column prop="object" label="客体"></el-table-column>
      </el-table>
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
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' },],
      },
      ruleForm: {
        name: '',
      },
      learnId:'',
      ip:'',
      logData:[],
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10,// 每页的数据条数
      terminalSelection:[],
    }
  },
  methods: {
    diaOpen (row) {
      var that = this
      this.learnId = row.learnId
      this.ip = row.ip
      this.ruleForm.name = ''  
      this.dialogFormVisible = true
      this.btnvalue1 = false
      var formData = new FormData();
      formData.append("learn_id", row.learnId);
      request({url: "/sec/whiteListLearnModelCreateSearch",method: "post",
        data: formData
      }).then((response) => {
        var res = response.data
        // console.log(res)
        that.logData = res
        if (that.logData.length) {
        this.$nextTick(function() {
          that.logData.forEach(item => {
            this.$refs.logTable.toggleRowSelection(item, true);
          })
        })
      }
      });
      
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
      
      var selectData = []
      this.terminalSelection.forEach(item =>{
        selectData.push(item.hash)
      })
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.btnvalue1 = true
          var formData = new FormData();
          formData.append("hashs", selectData.map(String));
          formData.append("learn_id",that.learnId);
          formData.append("model_name", that.ruleForm.name);
          request({
            url: '/sec/whiteListLearnModelCreate',
            data:formData,
            method: 'post'
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
            that.$message({message: '操作成功!', type: 'success', showClose: true })
            that.dialogFormVisible = false
            that.$emit('success')
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
    },
    handleSelectionChange (val) {
      // console.log(val)
      this.terminalSelection = val
      this.btnvalue1 = false
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
