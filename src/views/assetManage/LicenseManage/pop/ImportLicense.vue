<template>
  <el-dialog title="导入LICENSE文件" width="30%" :visible.sync="dialogFormVisible" @closed="diaclose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="125px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <el-form-item label="LICENSE文件：" prop="file">
        <el-input class="fileLabel" style="float: left" type="text" v-model="ruleForm.file" placeholder="请选择.license文件" :disabled="true"></el-input>
        <el-upload :http-request="uploadFile" :before-upload="beforeUpload"
          :show-file-list="false" name="file" accept=".license" ref="upload" :action="url" :file-list="fileList"
          :on-change="changefile" :auto-upload="false" :on-success="successUpload" :on-error="errorUpload" :on-progress="progressUpload">
          <el-button class="llbdwj">浏览本地文件</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="canBtn" @click="dialogFormVisible = false">取 消</el-button>
      <el-button size="small" class="sureBtn" v-if="btnf1" @click="getdaytime('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "ImportLicense",
  data() {
    return {
      btnf1: true,
      url: "",
      dialogFormVisible: false,
      ruleForm: {
        file: "",
      },
      rules: {
        file: [{ required: true, message: "请选择.license格式文件", trigger: "change" },],
      },
      labelPosition: "right",
      fileList: [],
      loadingInstance: "",
      uploadmessage: "",
    };
  },
  methods: {
    uploadFile(content) {
      var that = this;
      var form = new FormData();
      form.append("file", content.file);
      request({
        url: that.url,
        method: "post",
        data: form,
      }).then((response) => {
        var res = response.data
        if (res.status === 0) {
          that.loadingInstance.close();
          that.uploadmessage = "";
          that.$message({ message: "导入成功!", type: "success",showClose: true,});
          that.$refs.upload.clearFiles();
          that.dialogFormVisible = false;
          that.$emit("deliveData");
        } else {
          that.loadingInstance.close();
          that.btnf1 = true;
          // that.$message({message: res.errormessage,type: "error", duration: 0,showClose: true, });
          that.uploadmessage = res.errormessage;
        }
      });
    },
    beforeUpload(file, fileList) {},
    uploaddialog() {
      var that = this;
      that.dialogFormVisible = true;
    },
    errorUpload(response, file, fileList) {},
    successUpload(response, file, fileList) {
      var that = this;
      that.$notify.success({ title: "成功", message: "文件上传成功",});
    },
    progressUpload(response, file, fileList) {},
    changefile(file, fileList) {
      var that = this;
      that.uploadmessage = "";
      that.fileList.splice(0, that.fileList.length);
      that.ruleForm.file = file.name;
      that.fileList.push(fileList[fileList.length - 1]);
    },
    getdaytime(formName) {
      var that = this;
      that.btnf1 = false;
      that.$refs[formName].validate((valid) => {
        if (valid) {
          if (that.uploadmessage === "") {
            that.loadingInstance = that.$loading({
              body: true,
              lock: true,
              text: "正在上传,请耐心等待,不要刷新页面!",
            });
            that.$refs.upload.submit();
            that.$refs.upload.clearFiles();
          } else {
            that.btnf1 = true;
          }
        } else {
          that.btnf1 = true;
          return false;
        }
      });
    },
    resetForm(formName) {
      var that = this;
      that.$refs[formName].resetFields();
      that.$refs.upload.clearFiles();
    },
    diaOpen() {
      var that = this;
      that.dialogFormVisible = true;
      that.btnf1 = true;
      that.ruleForm.file = "";
      that.url = "/sys/importLTpcmAuthorize";
      that.$nextTick(function () {
        that.$refs.upload.clearFiles();
        that.$refs["ruleForm"].resetFields();
      });
    },
    diaclose() {
      var that = this;
      that.dialogFormVisible = false;
      that.$refs.upload.clearFiles();
    },
  },
};
</script>

<style scoped>
.el-input {
  width: 60%;
}
.formItem .el-select {
  float: left;
}
.formItem .el-input {
  float: left;
}
.dialog-footer .sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff;
}
</style>
