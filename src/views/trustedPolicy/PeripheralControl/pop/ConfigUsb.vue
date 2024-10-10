<template>
  <!--新建开始-->
  <el-dialog title="配置策略" top="5vh" width="65%" :visible.sync="dialogFormVisible" @closed="diaclose" :close-on-click-modal="false">
    <el-form label-position="right" label-width="90px" ref="ruleForm" size="small" style="flex:2">
      <el-form-item prop="ip" label="网络地址：">
        <el-input style="width:45%" v-model="ip" clearable disabled>{{ip}}</el-input>
      </el-form-item>
    </el-form>
    <div style="overflow:hidden">
      <div style="float:left;width:280px;border-right:1px solid #ddd;padding-right:20px;margin-right:20px">
        <div style="margin-bottom：10px">
          <div style="margin-bottom:8px;color:#000;font-size:14px">当前为<span style="color:#1ac492">已标记</span>的U盘设备：</div>
          <el-input v-model="searchTerminalIp" placeholder="搜索设备名称或设备ID" clearable size="small"></el-input>
        </div>
        <el-table :data="filterData" ref="terminalTable" class="terminalTable"  max-height="50vh" size="small" 
        :show-header="headerStatus" @selection-change="handleSelectionChange"  row-key="guid">
          <template slot="empty">
            <div>暂无数据</div>
          </template>
          <el-table-column reserve-selection type="selection" width="50"></el-table-column>
          <el-table-column min-width="100%">
            <template slot-scope="scope">
              <span>{{scope.row.deviceName}}：{{scope.row.guid}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="float:left;width:calc(100% - 340px)">
          <div>已选择 {{this.tableData2.length}}个设备</div>
          <el-table :data="tableData2" class="diatable" stripe tooltip-effect="light"
          :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"  row-key="guid"
          :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}" max-height="50vh">
          <template slot="empty">
            <img style="" v-if="emptytxt2" src="@/assets/nodata1.png" />
          </template>
          <el-table-column type="index" label="序号" width="50px"></el-table-column>
          <el-table-column prop="deviceName" label="设备名称" min-width="110%"></el-table-column>
          <el-table-column prop="guid" label="设备ID" min-width="110%"></el-table-column>
          <el-table-column prop="name" label="设备别名" min-width="100%"></el-table-column>
          <el-table-column prop="flag" label="访问权限">
            <template slot-scope="scope">
              <el-select v-model="scope.row.flag" size="mini" clearable filterable placeholder="请选择" :disabled="scope.row.show == false">
                <el-option v-for="item in permissionOptions" :key="parseInt(item.value)" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" min-width="100%" align="center">
            <template slot-scope="scope">
              <el-button class="btnClass" plain type="danger" size="mini" @click="handleDelete(scope.row,scope.$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-row>
        <el-col :span="16">
          <div class="tipText">更改策略需重新 umount/mount U盘</div>
        </el-col>
        <el-col :span="8">
          <el-button size="small" class="canBtn" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" class="sureBtn" :disabled="btnf1" @click="submitForm">下发策略</el-button>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "AddControl",
  data() {
    return {
      btnf1: false,
      dialogFormVisible: false,
      ip:"",
      headerStatus:false,
      nodeId:"",
      markedData:[],
      terminalSelection:[],
      searchTerminalIp: "",
      permissionOptions:[{value:2,label:"可读可写"},{value:1,label:"只读"},{value:0,label:"设备不可见"}],
      emptytxt2:'',
      tableData2: [],
    };
  },
  computed: {
    filterData:function() {
      return this.markedData.filter(data => !this.searchTerminalIp || data.deviceName.includes(this.searchTerminalIp) || data.guid.includes(this.searchTerminalIp))
    }
  },
  methods: {
    submitForm() {
      var that = this
      var disk = []
      that.tableData2.map((value,index) => {
        var item = {}
        item.flag = value.flag
        item.guid = value.guid
        disk[index] = item
      })
      var datas = {
        nodeId:that.nodeId,
        disk:disk,
      }
    //   console.log(datas)
      request({ url: "/creatUdiskPolicy", method: "post", data: datas,
        }).then((response) => {
          var res = response.data
          if (res.status === 0) {
            that.dialogFormVisible = false;
            that.$message({ message: "操作成功!",type: "success", showClose: true,});
            that.$emit("success");
            that.$refs.terminalTable.clearSelection();
          } else {
            that.btnf1 = true;
          }
        });
    },
    diaOpen(param) {
      var that = this;
      this.dialogFormVisible = true;
      this.btnf1 = false;
      this.ip = param.ip
      this.nodeId = param.nodeId
      this.searchTerminalIp = "";
      this.terminalSelection = []
      this.tableData2 = []
      request({url: "/searchAllOudiskInfo?node_id=" + param.nodeId,method: "post",
        data: {
        //   orderBy: "installer_time desc",
          searchPage: "1",
          searchSize: "10000",
        }
      }).then((response) => {
        var res = response.data
        that.markedData = res.data.filter(item => {
          return item.isMarked == 1
        })
        res.data.forEach((row,index) => {
          if (row.isUse == 1&&row.isMarked == 1) {
            that.$refs.terminalTable.toggleRowSelection(row)
          }
        })
        that.tableData2 = res.data.filter(item => {
          return item.isUse == 1
        })
      });
    },
    diaclose() {
      this.dialogFormVisible = false;
      this.$refs.terminalTable.clearSelection();
    },
    // 选择终端
    handleSelectionChange (val) {
        // console.log(val)
      if(val) {
        this.terminalSelection = val
        this.btnf1 = false;
      }
      this.tableData2 = this.terminalSelection
      this.tableData2.map ((value,index) => {
        if (value.flag == null || value.flag == undefined) {
          value.flag = 2
        }
      })
    },
    handleDelete(item,index) {
      var that = this
      for (var i= 0; i<this.terminalSelection.length; i++) {
        if (this.terminalSelection[i].guid == item.guid) {
          this.$refs.terminalTable.toggleRowSelection(this.terminalSelection[i])
        }
      }
    },
  },
};
</script>

<style scoped>
.tipText {
  color: #aaa;
  text-align: left;
  line-height: 32px;
  padding-left: 10px;
}
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
.terminalTable {
  font-size: 14px;
  margin-top:10px
}
.terminalTable >>> .el-table__row>td{
  /* 去除表格线 */
  border: none;
}

.terminalTable >>> .el-table::before{
  /* 去除下边框 */
  height: 0;
}
.itemRadio>>>.el-radio__label {
  display: none;
}
.el-divider--vertical{
  display:inline-block;
  width:1px;
  height:100%;
  margin:0 16px;
  vertical-align:middle;
  position:relative;
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
.expandTable >>> .el-table td, .el-table th.is-leaf {
  border-bottom: 0;
}
.el-table-add-row {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  border-radius: 3px;
}
.diatable {
  margin-top: 10px;
  width: 100%;
  border:1px solid #F0F2F5
}
.editBtn {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}
.editBtn:active {
  background: #3a8ee6;
  border-color: #3a8ee6;
  color: #fff;
  outline: none;
}
.editBtn:hover, .editBtn:focus{
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}
</style>
