<template>
  <el-dialog title="配置" top="5vh" width="40%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false">
    <el-form :label-position="labelPosition" ref="ruleForm" size="small">
      <el-form-item prop="nodeIp" label="网络地址：">
        <el-input style="width:80%" v-model="nodeIp" clearable disabled>{{nodeIp}}</el-input>
      </el-form-item>
      <el-divider></el-divider>
        <el-table row-key="id" ref="terminalTable" size="small" style="font-size:14px;border:1px solid #F0F2F5" 
          :header-cell-style="{'background-color': '#F0F2F5'}" :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}"
          :data="hashs" max-height="50vh" :height="tableHeight">
          <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
          <el-table-column type="category" label="类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.$index == 0">主程序</span>
              <span v-else>共享库</span>
            </template>
          </el-table-column>
          <el-table-column prop="hash" label="hash" align="center" min-width="200%">
            <template slot-scope="scope">
              <el-input v-model="scope.row.hash" v-show="scope.row.show" size="mini" oninput="value=value.replace(/[^0-9a-fA-F]/g,'')" maxlength="64"/>
              <span v-show="!scope.row.show">{{scope.row.hash}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" min-width="100%" align="center">
            <template slot-scope="scope">
              <el-button class="btnClass" plain type="success" size="mini" @click="save1(scope.row)">
                保存
              </el-button>
              <el-button class="btnClass" plain  type="warning" size="mini" @click="scope.row.show = true" >
                编辑
              </el-button>
              <el-button class="btnClass" plain type="danger" size="mini" @click="handleDelete(scope.$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      <el-col :span="24">
        <el-button type="success" plain size="small" class="el-table-add-row" @click="handleAdd()" icon="el-icon-plus">
          添加
        </el-button>
      </el-col>
      <div style="clear:both;"></div>
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
    return {
      btnvalue1:false,
      dialogFormVisible: false,
      labelPosition: 'right',
      i_id: '',
      nodeId:'',
      nodeIp:'',
      name:'',
      path:'',
      hashs:[],
      tableHeight:0,
    }
  },
  mounted () {
    
  },
  methods: {
    diaOpen (row) {
      var that = this
      this.nodeId = row.node_id
      this.nodeIp = row.node_ip
      this.i_id = row.i_id;
      this.name = row.name,
      this.path = row.path,
      that.hashs=[]
      that.dialogFormVisible = true
      that.btnvalue1 = false
      request({
        url: "/sys/searchProIdenByID?i_id=" +row.i_id, method: "post",
      }).then((response) => {
        var res = response.data
        // console.log(res);
        if(res.object) {
          let hashArr = Array.from(new Set(res.object.hashs))
          hashArr.map((item, index) => {
            that.hashs.push(
              Object.assign( {hash: item,show:false})
            ) 
          })
          // console.log(that.hashs)
        } else {
          that.hashs = []
        }
      });
      that.$nextTick(function () {
        setTimeout(() => {
          this.tableHeight = window.innerHeight - this.$refs.terminalTable.$el.offsetTop;
        },100)
        that.$refs.ruleForm.clearValidate()
      })
    },
    diaClose () {
      var that = this
      that.dialogFormVisible = false
    },
    submitForm (formName) {
      var that = this
      var hashData = []
      hashData = that.hashs.map (item => {return item.hash})
          that.btnvalue1 = true
          request({
            url: '/sys/createLProcessIdentity',
            data: {
              node_id: that.nodeId,
              i_id: that.i_id,
              name:that.name,
              path:that.path,
              hashs:hashData
            },
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
    },
    resetForm (formName) {
      var that = this
      that.$refs[formName].resetFields()
    },
    save1(row) {
      if (row.hash =="") {
        return this.$message({ message: "必填参数不可为空", type: "error", showClose: true,});
      }
      if (row.hash.length != 64) {
        return this.$message({ message: "请填写正确长度的Hash", type: "error", showClose: true,});
      }
      row.show = false;
    },
    // 添加点击按钮
    handleAdd() {
      for (let i of this.hashs) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      this.hashs.push({
        hash: "",
        show: true,
      });
      this.$nextTick(()=>{
        this.$refs.terminalTable.bodyWrapper.scrollTop = this.$refs.terminalTable.bodyWrapper.scrollHeight;
      })
    },
    handleDelete(index) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          this.hashs.splice(index, 1)
          this.$message({ type: "success", message: "删除成功!",});
        }).catch(() => {
          this.$message({ type: "info", message: "已取消删除",})
        })
    },
  }
}
</script>

<style scope>
.el-dialog__body {
  padding: 20px 20px 10px;
}
.btnClass {
  padding: 5px;
}
.el-table-add-row {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  border-radius: 3px;
}
.sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff!important;
}
</style>
