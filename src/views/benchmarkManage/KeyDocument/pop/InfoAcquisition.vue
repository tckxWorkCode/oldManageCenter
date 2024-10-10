<template>
  <el-dialog title="信息采集" top="10vh" width="35%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" label-width="100px" :rules="rules" :model="ruleForm" ref="ruleForm" size="small">
      <div class="itemw">
        <el-form-item class="uploadItem" prop="path" label="文件路径：">
          <el-input style="width:70%" id="path" v-model="ruleForm.path" clearable placeholder='请输入文件全路径'></el-input>     
        </el-form-item>
      </div>
      <div class="itemw">
        <el-form-item class="zdclass" prop="zdname" label="终端信息：">
          <div class="searchDiv">
            <el-input style="width:50%" v-model="searchTerminalIp" placeholder="搜索IP" clearable></el-input>
          </div>
          <div class="cardContainer">
            <div class="cardTip" v-if="filterData.length == 0">暂无数据</div>
            <div class="itemCard" :class="{active: categoryIndex == index}"
              v-for="(item,index) in filterData" :key="item.nodeId">
              <div class="radioContainer">
                <el-radio :label="index" class="itemRadio" v-model="radio" @change.native="getCurrentSelect(item,index)"></el-radio>
              </div>
              <div class="contentContainer">
                <div><span class="contentText">名称：</span><span class="content">{{item.name}}</span></div>
                <div><span class="contentText">IP：</span><span class="content">{{item.ip}}</span></div>
              </div>
            </div>
          </div>
        </el-form-item>
      </div>
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
  name: 'InfoAcquisition',
  data () {
    return {
      radio:"",
      categoryIndex: -1,
      btnvalue1:false,
      dialogFormVisible: false,
      labelPosition: 'right',
      searchTerminalIp: "",
      terminalData:[],
      terminalSelection:{},
      rules: {
        path: [{ required: true, message: '请输入文件全路径', trigger: 'blur' },],
        zdname: [{ required: true, message: "请选择终端", trigger: "change" }],
      },
      ruleForm: {
        zdname: "",
        path: '',
      },
    }
  },
  computed: {
    filterData:function() {
      return this.terminalData.filter(data => !this.searchTerminalIp || data.ip.includes(this.searchTerminalIp))
    }
  },
  methods: {
    diaOpen () {
      var that = this
      this.radio=""
      this.categoryIndex=-1
      this.ruleForm.zdname = "1";
      this.ruleForm.path = "";
      this.searchTerminalIp = "";
      this.terminalSelection = {}
      that.dialogFormVisible = true
      that.btnvalue1 = false
      that.$nextTick(function () {
        that.$refs.ruleForm.clearValidate()
      })
      // 加载终端列表
      request({url: "/LNodeList",method: "post",
        data: {
          condition: "",
          firstTime: "",
          lastTime: "",
          orderBy: "installer_time desc",
          system_type: "1",
          online_status: 1,
          searchPage: "1",
          searchSize: "10000",
        }
      }).then((response) => {
        var res = response.data
        // console.log(res)
        that.terminalData = res.list
      });
    },
    diaClose () {
      this.dialogFormVisible = false
    },
    getCurrentSelect(item,index) {
      this.categoryIndex = index;
      this.terminalSelection = item;
    },
    submitForm (formName) {
      var that = this
      if(Object.keys(that.terminalSelection).length == 0) {
        that.ruleForm.zdname = ''
      } else {
        that.ruleForm.zdname = '1'
      }
      var formData = new FormData()
      formData.append("node_id", that.terminalSelection.nodeId);
      formData.append("path", that.ruleForm.path);
      that.$refs[formName].validate((valid) => {
        if (valid) {
          that.btnvalue1 = true
          request({
            url: '/sec/collectFileInfo',
            data: formData,
            method: 'post'
          }).then((response) => {
            var res = response.data
            if (res.status === 0) {
            that.$message({message: '操作成功!', type: 'success', showClose: true })
            that.dialogFormVisible = false
            that.$emit('addSuccess')
            } else {
              that.btnvalue1 = false
              that.terminalSelection= {}
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
#terminalTable .el-radio__label {
  display: none;
}
.cardContainer {
  max-height: 40vh;
  overflow: auto;
}
.cardTip {
  height: 50px;
  color: #909399;
  text-align: center;
  border: 1px solid #DCDFE6;
  border-radius: 3px;
  margin-top: 10px;
  padding-top: 10px;
}
.itemCard {
  width: 46%;
  float: left;
  display: flex;
  border: 1px solid #f0f0f4;
  border-radius: 5px;
  margin-right: 10px;
  margin-top: 20px;
}
.active {
  border-color: #1ac492;
  box-shadow: 0 2px 4px rgba(26,196,146, 0.3), 0 0 6px rgba(26,196,146, .04)
}
.radioContainer {
  width: 20%;
  position: relative;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: #f8f8f8;
}
.itemRadio {
  border-right: 1px solid #f0f0f4;
  position: absolute;
  left:50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.itemRadio .el-radio__label {
  display: none;
}
.contentContainer {
  font-size: 14px;
  margin-left: 16px;
}
.contentText {
  color: #999999;
}
.content {
  color: #333333;
}
</style>
