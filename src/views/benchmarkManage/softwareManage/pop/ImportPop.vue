<template>
  <!--导入安装包开始-->
  <el-dialog title="导入软件包" width="30%" :visible.sync="dialogFormVisible" @close="diaclose" :close-on-click-modal="false" class="dialogw1">
    <el-form :label-position="labelPosition" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <el-form-item class="uploadItem" prop="other_name" label="软件别名：">
        <el-input style="width: 80%;" v-model="ruleForm.other_name" size="small" placeholder="请输入软件别名" maxlength="255" @change="handleOthername"></el-input>
      </el-form-item>
      <el-form-item label="" prop="file" class="uploadfilec">
        <el-upload class="uploadfilediv" :http-request="uploadFile" :show-file-list="true"
          name="file" accept=".tar.gz,.deb,.rpm" ref="upload" action="url"
          :file-list="fileList" :on-change="changefile" :auto-upload="false"
          :on-success="successUpload" :on-error="errorUpload" :on-progress="progressUpload">
          <div class="remindtxt1">上传软件包</div>
        </el-upload>
        <div class="remindtxt2">注：请选择 (*.tar.gz; *.deb; *.rpm) 格式文件</div>
        <div class="remindtxt2">上传软件包大小应小于1G</div>
        <div v-if="this.ruleForm.file" style="float:left;width:80%;border:1px solid #dfdfdf;padding:15px 20px;margin:15px 25px">
          <div style="float:left;margin-right:15px"><img src="../../../../assets/software_package.png"></div>
          <div style="float:left;text-align:left;line-height:20px">
            <div>{{this.ruleForm.file}}</div>
            <div class="remindtxt2">{{this.ruleForm.size}}</div>
          </div>
          <div style="float:right"><el-button style="color:#FF4D4F;font-size:14px" type="text" @click="del">删除</el-button></div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="canBtn" @click="diaclose">取 消</el-button>
      <el-button size="small" class="sureBtn" :disabled="btnvalue1" @click="getdaytime('ruleForm')">确定</el-button>
    </div>
  </el-dialog>
  <!--导入安装包结束-->
</template>

<script>
import request from "@/utils/request";
export default {
  name: "ImportPop",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入软件别名"));
      } else if (value.length > 20) {
        callback(new Error("软件别名名称长度不超出20个字符"));
      } /*else if (/^\s+$/gi.test(value)) {
        callback(new Error('软件别名不能为空格'))
      } */ else if (
        /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\_\.]/g.test(value)
      ) {
        callback(new Error("软件别名只能输入中文、英文、数字、_和.符号"));
      } else {
        callback();
      }
    };
    return {
      btnvalue1: false,
      url: "",
      submitbtn: false,
      dialogFormVisible: false,
      labelPosition: "right",
      rules: {
        other_name: [
          { required: true, validator: validatePass, trigger: "blur" },
        ],
        file: [{ required: true, message: "请选择软件包", trigger: "change" }],
      },
      ruleForm: {
        other_name: "",
        file: "",
        size: ""
      },
      fileList: [],
      repeatupload: false,
      repeatmessage: "",
      importfileName: [],
      aliaspro: [],
      uploadmessage: "",
    };
  },
  methods: {
    resetForm(formName) {
      var that = this;
      that.$refs[formName].resetFields();
      that.$refs.upload.clearFiles();
      that.$message.closeAll();
    },
    getdaytime(formName) {
      var that = this;
      that.$message.closeAll();
      that.$refs[formName].validate((valid) => {
        if (valid) {
          if ( that.aliaspro.indexOf(that.ruleForm.other_name) === -1 && that.importfileName.indexOf(that.ruleForm.file) === -1) {
            if (that.uploadmessage === "") {
              that.btnvalue1 = true;
              that.loadingInstance = that.$loading({
                body: true,
                lock: true,
                text: "正在上传,请耐心等待,不要刷新页面!",
              });
              that.$refs.upload.submit();
              // that.$refs.upload.clearFiles()
            } else {
              that.btnvalue1 = true;
              that.$message.closeAll();
            }
          } else {
            that.$message.closeAll();
            if (that.aliaspro.indexOf(that.ruleForm.other_name) !== -1) {
              that.$message({ message: "软件别名重复,请检查!!!", type: "error", showClose: true, });
            } else if ( that.importfileName.indexOf(that.ruleForm.file) !== -1) {
              that.$message({ message: "软件包名称重复,请检查!!!", type: "error", showClose: true, });
            }
          }
        } else {
          that.btnvalue1 = false;
          return false;
        }
      });
    },
    handleOthername(val) {
      if (val) {
        this.btnvalue1 = false
        this.uploadmessage = ""
      }
    },
    diaOpen(param, param1) {
      var that = this;
      that.dialogFormVisible = true;
      that.btnvalue1 = false;
      //  that.submitbtn = false
      that.importfileName = param;
      that.aliaspro = param1;
      that.url = "/sec/whiteListPackageUpload";
      that.$nextTick(function () {
        that.$refs.upload.clearFiles();
        that.$refs["ruleForm"].resetFields();
      });
    },
    diaclose() {
      var that = this;
      that.$refs["ruleForm"].resetFields();
      that.$refs.upload.clearFiles();
      that.dialogFormVisible = false;
      that.$message.closeAll();
    },
    uploadFile(content) {
      var that = this;
      that.$message.closeAll();
      var form = new FormData();
      form.append("file", content.file);
      form.append("other_name", that.ruleForm.other_name);
      request({ url: that.url, method: "post", data: form,}).then((response) => {
        var res = response.data
        // console.log(3333333,res)
        if (res.status === 0) {
          that.loadingInstance.close();
          that.dialogFormVisible = false;
          that.uploadmessage = "";
          that.$message({ message: "导入成功!", type: "success", showClose: true,});
          that.$emit("importsuccess");
        } else {
          that.btnvalue1 = true;
          that.loadingInstance.close();
          that.uploadmessage = res.errormessage;
        }
      });
    },
    uploaddialog() {
      var that = this;
      that.dialogFormVisible = true;
    },
    errorUpload(response, file, fileList) {},
    successUpload(response, file, fileList) {
      var that = this;
      that.$notify.success({
        title: "成功",
        message: "文件上传成功",
      });
    },
    progressUpload(response, file, fileList) {},
    changefile(file, fileList) {
      var that = this;
      that.$message.closeAll();
      //.tar.gz,.deb,.rpm
      that.btnvalue1 = false;
      if (file.name.slice(file.name.lastIndexOf(".")) === ".gz") {
        var spring1 = file.name.slice(0, file.name.lastIndexOf("."));
        if (spring1.slice(spring1.lastIndexOf(".")) === ".tar") {
          var suffix =
            spring1.slice(spring1.lastIndexOf(".")) +
            file.name.slice(file.name.lastIndexOf("."));
        }
      }
      if (
        suffix !== ".tar.gz" &&
        file.name.slice(file.name.lastIndexOf(".")) !== ".deb" &&
        file.name.slice(file.name.lastIndexOf(".")) !== ".rpm"
      ) {
        // that.fileList.splice(0, that.fileList.length)
        that.uploadmessage = "";
        that.ruleForm.file = file.name;
        that.ruleForm.size = (file.size).toFixed(2)+" 字节";
        that.$message({ message: "请选择 (*.tar.gz; *.deb; *.rpm) 格式文件", type: "error", showClose: true, });
        that.btnvalue1 = true;
      } else {
        // console.log(that.fileList)
        that.fileList.splice(0, that.fileList.length);
        // that.submitbtn = false
        that.uploadmessage = "";
        that.ruleForm.file = file.name;
        that.ruleForm.size = (file.size).toFixed(2)+" 字节";
        that.fileList.push(fileList[fileList.length - 1]);
      }
      const isLt = file.size /1024/1024/1024 <=1
      if (!isLt) {
        that.$message({ message: "上传文件不得超过1GB", type: "error", showClose: true, });
        this.ruleForm.file =""
        this.ruleForm.size = ""
        this.fileList = []
      }
    },
    del () {
      this.ruleForm.file =""
      this.ruleForm.size = ""
      this.fileList = []
    }
  },
};
</script>

<style scoped>
.uploadItem .el-input {
  float: left;
}
.uploadItem >>>.el-form-item__error {
  margin-left: 100px !important;
}
.uploadfilec {
  text-align: center;
}
.remindtxt1 {
  font-size: 14px;
  width: 150px;
  background-color: #0FC360!important;
  border-color: #0FC360!important;
  color: #fff;
  height: 36px;
  line-height: 36px;
  border-radius: 3px;
  margin-top: 20px;
}
.remindtxt2 {
  color: #8F8F8F;
}
.dialog-footer .sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff;
}
.uploadfilediv >>>.el-upload-list {
  display: none;
}
</style>
