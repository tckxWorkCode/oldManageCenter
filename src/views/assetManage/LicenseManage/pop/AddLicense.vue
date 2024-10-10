<template>
  <!--新建开始-->
  <el-dialog title="新建" top="10vh" width="30%" :visible.sync="dialogFormVisible" @closed="diaclose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="100px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <div class="itemw">
        <el-form-item class="zdclass" prop="zdname" label="终端信息：">
          <div class="searchinputdiv">
            <el-input style="width:50%" v-model="searchTableData" placeholder="搜索IP" clearable></el-input>
          </div>
          <el-table row-key="nodeId" ref="terminalTable" size="small" :height="height" @selection-change="handleSelectionChange"  class="tableStyle"
             :header-cell-style="{'background-color': '#F0F2F5',padding:'0px'}" :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}"
             :data="tableData2.filter(data => !searchTableData || data.ip.includes(searchTableData))">
            <el-table-column reserve-selection type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" label="序号" width="50px"></el-table-column>
            <el-table-column prop="name" label="终端名称" :show-overflow-tooltip="true" min-width="100%"></el-table-column>
            <el-table-column prop="ip" label="网络地址" min-width="60%"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item class="formItem" prop="license_type" label="类型：">
          <el-radio-group v-model="ruleForm.license_type" @change="handleLicenseType">
            <el-radio :label="'2'">基础版</el-radio>
            <el-radio :label="'3'">扩展版</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="formItem" prop="valid_days" label="有效期：">
          <el-input style="width:70%" v-model.number="ruleForm.valid_days" clearable @change="handleValidDays"
            placeholder="请输入30-3650之间的数字" name="valid_days" type="number"></el-input>
            &nbsp;&nbsp;<span>天</span>
        </el-form-item>
      </div>
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
  name: "AddLicense",
  data() {
    var validatePass = (rule, value, callback) => {
      var reg = /^[0-9]+$/;
      if (value === "") {
        callback(new Error("请输入30-3650之间的整数"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正整数"));
      } else if ( parseInt(value) < 30 ) {
        callback(new Error("请输入大于30的正整数"));
      } else if ( parseInt(value) > 3650 ) {
        callback(new Error("请输入小于3650的正整数"));
      } else {
        callback();
      }
    };
    return {
      height: 0,
      btnf1: false,
      searchTableData: "",
      tableData2: [],
      dialogFormVisible: false,
      labelPosition: "right",
      search: "",
      filterText: "",
      rules: {
        zdname: [{ required: true, message: "请选择终端", trigger: "change" }],
        license_type: [{ required: true, message: "请选择类型", trigger: "change" },],
        valid_days: [{ required: true,validator: validatePass,  trigger: "blur" },],
      },
      ruleForm: {
        zdname: "",
        license_type: "",
        valid_days:""
      },
      titles2: [
        { prop: "name", label: "终端名称",},
        { prop: "ip", label: "网络地址",},
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      terminalSelection:[],
      nodeId:[],
    };
  },
  methods: {
    submitForm(formName) {
      var that = this;
      if(that.terminalSelection.length === 0) {
        that.ruleForm.zdname = ''
      } else {
        that.ruleForm.zdname = "1";
      }
      that.$refs[formName].validate((valid) => {
        if (valid) {
          for (var i in that.terminalSelection) {
            that.nodeId.push(that.terminalSelection[i].nodeId)
          }
          var datas = {
            license_type: that.ruleForm.license_type,
            node_ids:that.nodeId,
            valid_days:that.ruleForm.valid_days
          }
          // console.log(datas)
          request({
            url: "/sys/createLTpcmAuthorize",
            method: "post",
            data: JSON.stringify(datas),
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
              that.dialogFormVisible = false;
              that.$message({ message: "操作成功!",type: "success", showClose: true,});
              that.$emit("newsuccess");
            } else {
              that.btnf1 = true;
            }
          });
        } else {
          that.btnf1 = false;
        }
      });
    },
    handleSelectionChange (val) {
      if(val) {
        this.terminalSelection = val
        this.ruleForm.zdname = "1"
        this.btnf1 = false;
      }
    },
    handleLicenseType(val) {
      if (val) {
        this.btnf1 = false
      }
    },
    handleValidDays(val) {
      if (val) {
        this.btnf1 = false
      }
    },
    diaOpen() {
      var that = this;
      this.dialogFormVisible = true;
      this.btnf1 = false;
      this.searchTableData = "";
      this.ruleForm.license_type = "";
      this.ruleForm.valid_days = ""
      this.nodeId = [],
      this.terminalSelection=[]
      request({ url: "/LNodeList",method: "post",
        data: {
          orderBy: "installer_time desc",
          // system_type: "1",
          online_status: 1,
          searchPage: 1,
          searchSize: 10000,
        },
      }).then((response) => {
        var res = response.data
        that.tableData2 = res.list;
        if (res.total > 5) {
          that.height = 350;
        } else if (res.total === 0) {
          that.height = 110;
        } else {
          that.height = 100 + 42 * res.total;
        }
      });
      that.$nextTick(function () {
        that.$refs.ruleForm.clearValidate();
        that.$refs.terminalTable.clearSelection();
      });
    },
    diaclose() {
      this.dialogFormVisible = false;
      this.terminalSelection =[]
      this.nodeId = []
    },
  },
};
</script>

<style scoped>
.tableStyle {
font-size:14px;border:1px solid #F0F2F5;margin-top: 10px;
}
.itemw {
  position: relative;
}
/*滚动条*/
.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
