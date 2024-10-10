<template>
  <el-dialog title="策略配置" top="5vh" width="45%" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false" >
    <div style="display:flex;">
      <el-form label-position="right" label-width="90px" ref="ruleForm" size="small" style="flex:2">
        <el-form-item prop="ip" label="网络地址：">
          <el-input style="width:45%" v-model="ip" clearable disabled>{{ip}}</el-input>
        </el-form-item>
        <el-form-item prop="networkSwitch" label="网络管理：">
          <el-switch v-model="networkSwitch" :active-text="activeText" :active-value="1" :inactive-value="0" @change="switchChange"></el-switch>
        </el-form-item>
      </el-form>
    </div>
    <el-tabs v-model="activeName" type="card" class="record" >
      <el-tab-pane label="IP白名单" name="first">
        <el-button :disabled="networkSwitch==0" type="success"  size="small"  @click="whiteIPAdd()">添加IP</el-button>
        <el-button :disabled="networkSwitch==0" type="success"  size="small"  @click="whiteIPSegmentAdd()"> 添加IP段</el-button>
        <el-table :data="tableData" class="diatable" stripe tooltip-effect="light"
        :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}" max-height="50vh">
          <el-table-column type="index" :index="indexMethod" label="序号" width="80px"></el-table-column>
          <el-table-column prop="dataFrom" label="IP地址">
            <template slot-scope="scope">
              <div style="display: flex">
                <IpModel v-show="scope.row.show" v-model="scope.row.dataFrom" boxWidth="miniWidth" inputSize="mini" :echoIp="scope.row.dataFrom"></IpModel>
                <div style="display: flex" v-show="scope.row.segment"> <div style="padding:3px 8px"> ~ </div><IpModel v-model="scope.row.dataTo" boxWidth="miniWidth" inputSize="mini" :echoIp="scope.row.dataTo"></IpModel></div>
                <span v-show="!scope.row.show">{{scope.row.dataFrom}} <span v-show="scope.row.dataTo&&scope.row.dataFrom!=scope.row.dataTo"> ~ {{scope.row.dataTo}}</span></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px" align="center">
            <template slot-scope="scope">
              <el-button :disabled="networkSwitch==0" size="small" v-show="scope.row.show==true" type="text" class="saveBtn" @click="whiteIpSave(scope.row,scope.$index)"> 保存 </el-button>
              <el-button :disabled="networkSwitch==0" size="small" v-show="scope.row.show==true" type="text" class="editBtn" @click="whiteIpCancel(scope.row,scope.$index)"> 取消 </el-button>
              <el-button :disabled="networkSwitch==0" size="small" v-show="scope.row.show==false" type="text" class="certainBtn" @click="whiteIpEdit(scope.row,scope.$index)" > 编辑 </el-button>
              <el-button :disabled="networkSwitch==0" size="small" v-show="scope.row.show==false" type="text" class="cancelBtn" @click="whiteIpDel(scope.row,scope.$index)" > 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="IP黑名单" name="second">
        <el-button :disabled="networkSwitch==0" type="success"  size="small"  @click="blackIPAdd()">添加IP</el-button>
        <el-button :disabled="networkSwitch==0" type="success"  size="small"  @click="blackIPSegmentAdd()"> 添加IP段</el-button>
        <el-table :data="tableData2" class="diatable" stripe tooltip-effect="light"
          :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"  row-key="num"
          :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}" max-height="50vh">
          <el-table-column type="index" :index="indexMethod2" label="序号" width="80px"></el-table-column>
          <el-table-column prop="dataFrom" label="IP地址">
            <template slot-scope="scope">
              <div style="display: flex">
                <IpModel v-show="scope.row.show" v-model="scope.row.dataFrom" boxWidth="miniWidth" inputSize="mini" :echoIp="scope.row.dataFrom"></IpModel>
                <div style="display: flex" v-show="scope.row.segment"> <div style="padding:3px 8px"> ~ </div><IpModel v-model="scope.row.dataTo" boxWidth="miniWidth" inputSize="mini" :echoIp="scope.row.dataTo"></IpModel></div>
                <span v-show="!scope.row.show">{{scope.row.dataFrom}} <span v-show="scope.row.dataTo&&scope.row.dataFrom!=scope.row.dataTo"> ~ {{scope.row.dataTo}}</span></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px" align="center">
            <template slot-scope="scope">
              <el-button :disabled="networkSwitch==0" size="small" v-show="scope.row.show==true" type="text" class="saveBtn" @click="blackIpSave(scope.row,scope.$index)"> 保存 </el-button>
              <el-button :disabled="networkSwitch==0" size="small" v-show="scope.row.show==true" type="text" class="editBtn" @click="blackIpCancel(scope.row,scope.$index)"> 取消 </el-button>
              <el-button :disabled="networkSwitch==0" size="small" v-show="scope.row.show==false" type="text" class="certainBtn" @click="blackIpEdit(scope.row,scope.$index)" > 编辑 </el-button>
              <el-button :disabled="networkSwitch==0" size="small" v-show="scope.row.show==false" type="text" class="cancelBtn" @click="blackIpDel(scope.row,scope.$index)" > 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="端口白名单" name="third">
        <el-button :disabled="networkSwitch==0" type="success"  size="small"  @click="whitePortAdd()">添加端口</el-button>
        <el-button :disabled="networkSwitch==0" type="success"  size="small"  @click="whitePortSegmentAdd()"> 添加端口段</el-button>
        <el-table :data="tableData3" class="diatable" stripe tooltip-effect="light"
        :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}" max-height="50vh">
          <el-table-column type="index" :index="indexMethod3" label="序号" width="80px"></el-table-column>
          <el-table-column prop="dataFrom" label="端口号">
            <template slot-scope="scope">
              <div style="display: flex">
                <el-input v-model="scope.row.dataFrom" v-show="scope.row.show" size="mini" onkeyup = "value=value.replace(/[^\d]/g,'')" maxlength="5" />
                <div style="display: flex"  v-show="scope.row.segment"> <div style="padding:3px 8px"> ~ </div><el-input v-model="scope.row.dataTo" size="mini" onkeyup = "value=value.replace(/[^\d]/g,'')" maxlength="5" /></div> 
                <span v-show="!scope.row.show">{{scope.row.dataFrom}}</span>
                <span v-show="!scope.row.show&&scope.row.dataTo&&scope.row.dataFrom!=scope.row.dataTo"> ~ {{scope.row.dataTo}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="isTcp" label="协议">
            <template slot-scope="scope">
              <el-select v-show="scope.row.show" v-model="scope.row.isTcp" size="mini" clearable filterable placeholder="请选择" :disabled="scope.row.show == false">
                <el-option v-for="item in protocolOptions" :key="parseInt(item.value)" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <div v-for="(item,index) in protocolOptions" :key="index" v-show="!scope.row.show">
                <div v-if="item.value == scope.row.isTcp">{{item.label}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100%" align="center">
            <template slot-scope="scope">
              <el-button :disabled="networkSwitch==0" size="small" v-show="scope.row.show==true" type="text" class="saveBtn" @click="whitePortSave(scope.row,scope.$index)"> 保存 </el-button>
              <el-button :disabled="networkSwitch==0" size="small" v-show="scope.row.show==true" type="text" class="editBtn" @click="whitePortCancel(scope.row,scope.$index)"> 取消 </el-button>
              <el-button :disabled="networkSwitch==0" size="small" v-show="scope.row.show==false" type="text" class="certainBtn" @click="whitePortEdit(scope.row,scope.$index)" > 编辑 </el-button>
              <el-button :disabled="networkSwitch==0" size="small" v-show="scope.row.show==false" type="text" class="cancelBtn" @click="whitePortDel(scope.row,scope.$index)" > 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="端口黑名单" name="forth">
        <el-button :disabled="networkSwitch==0" type="success"  size="small"  @click="blackPortAdd()">添加端口</el-button>
        <el-button :disabled="networkSwitch==0" type="success"  size="small"  @click="blackPortSegmentAdd()"> 添加端口段</el-button>
        <el-table :data="tableData4" class="diatable" stripe tooltip-effect="light" 
        :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}" max-height="50vh">
          <el-table-column type="index" :index="indexMethod4" label="序号" width="80px"></el-table-column>
          <el-table-column prop="dataFrom" label="端口号">
            <template slot-scope="scope">
              <div style="display: flex">
                <el-input v-model="scope.row.dataFrom" v-show="scope.row.show" size="mini" onkeyup = "value=value.replace(/[^\d]/g,'')" maxlength="5" />
                <div style="display: flex"  v-show="scope.row.segment"> <div style="padding:3px 8px"> ~ </div><el-input v-model="scope.row.dataTo" size="mini" onkeyup = "value=value.replace(/[^\d]/g,'')" maxlength="5" /></div> 
                <span v-show="!scope.row.show">{{scope.row.dataFrom}}</span>
                <span v-show="!scope.row.show && scope.row.dataTo && scope.row.dataFrom!=scope.row.dataTo"> ~ {{scope.row.dataTo}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="isTcp" label="协议">
            <template slot-scope="scope">
              <el-select v-show="scope.row.show" v-model="scope.row.isTcp" size="mini" clearable filterable placeholder="请选择" :disabled="scope.row.show == false">
                <el-option v-for="item in protocolOptions" :key="parseInt(item.value)" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <div v-for="(item,index) in protocolOptions" :key="index" v-show="!scope.row.show">
                <div v-if="item.value == scope.row.isTcp">{{item.label}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100%" align="center">
            <template slot-scope="scope">
              <el-button :disabled="networkSwitch==0" size="small" v-show="scope.row.show==true" type="text" class="saveBtn" @click="blackPortSave(scope.row,scope.$index)"> 保存 </el-button>
              <el-button :disabled="networkSwitch==0" size="small" v-show="scope.row.show==true" type="text" class="editBtn" @click="blackPortCancel(scope.row,scope.$index)"> 取消 </el-button>
              <el-button :disabled="networkSwitch==0" size="small" v-show="scope.row.show==false" type="text" class="certainBtn" @click="blackPortEdit(scope.row,scope.$index)" > 编辑 </el-button>
              <el-button :disabled="networkSwitch==0" size="small" v-show="scope.row.show==false" type="text" class="cancelBtn" @click="blackPortDel(scope.row,scope.$index)" > 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>  
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="canBtn" @click="diaClose">取 消</el-button>
      <el-button size="small" class="sureBtn" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
import { timeToZh } from "@/utils/timefilter";
import IpModel from './IpModel.vue'

export default {
  name: 'ConfigPop',
  components: { IpModel },
  data () {
    return {
      dialogFormVisible: false,
      dialogVisible1:false,
      ip:"",
      nodeId:'',
      activeText:"关闭",

      networkSwitch:0,

      localData:[{dataFrom:"",dataTo:"",isPort:0,isBlack:0}],
      activeName: 'first',
      tableData: [],
      whiteIpSaved:{},

      tableData2: [],
      blackIpSaved:{},

      protocolOptions:[{value:"0",label:"UDP"},{value:"1",label:"TCP"},{value:"2",label:"TCP/UDP"}],
      tableData3: [],
      whitePortSaved: {},
      mustData: [{dataFrom:"22",dataTo:"22",isTcp:2,isPort:1,isBlack:0},{dataFrom:"7000",dataTo:"7000",isTcp:2,isPort:1,isBlack:0},{dataFrom:"9092",dataTo:"9092",isTcp:2,isPort:1,isBlack:0}],

      tableData4: [],
      blackPortSaved: {},
      portTips: false,
    }
  },
  methods: {
    getLocalhost() {
      var url = "";
      var tempUrl = window.document.location.href;
      if(url === ""){
        var url1 = tempUrl.split("//")[1]
        url = url1.split(":")[0];
      }
      // console.log(url)
      this.localData[0].dataFrom = url
      this.localData[0].dataTo = url
    },
    diaOpen (param) {
      this.getLocalhost()
    //   console.log(param)
      this.dialogFormVisible = true
      this.activeName = 'first'
      this.ip = param.nodeIp
      this.nodeId= param.nodeId
      if (param.netSwitch) { 
        this.networkSwitch = param.netSwitch
        this.activeText = "开启"
      } else { 
        this.networkSwitch = 0 
        this.activeText = "关闭"
      }
      this.loadData(0,0,0)
      this.loadData(1,0,1)
      this.loadData(0,1,2)
      this.loadData(1,1,3)
    },
    diaClose () {
      var that = this
      that.dialogFormVisible = false
    },
    switchChange(val) { 
        var that = this
      if (val == 0) {
        if (this.activeName === "first") { 
          this.tableData.map ((val,index) => {
            if (val.show) {
              that.whiteIpCancel(val,index)
            }
          })
        } else if (this.activeName === "second") { 
          this.tableData2.map ((val,index) => {
            if (val.show) {
              that.blackIpCancel(val,index)
            }
          })
        } else if (this.activeName === "third") { 
          this.tableData3.map ((val,index) => {
            if (val.show) {
              that.whitePortCancel(val,index)
            }
          })
        } else if (this.activeName === "forth") { 
          this.tableData4.map ((val,index) => {
            if (val.show) {
              that.blackPortCancel(val,index)
            }
          })
        }
        this.activeText = "关闭"
      } else if (val == 1) {
        this.activeText = "开启"
      }
    },
    tabHandle(tab, event) {
      if (tab.index == "0") {
        this.loadData(0,0,0)
      } else if (tab.index == "1") {
        this.loadData(1,0,1)
      } else if (tab.index == "2") {
        this.loadData(0,1,2)
      } else if (tab.index == "3") {
        this.loadData(1,1,3)
      }
    },
    loadData(isBlack,isPort,tab) {
      var that = this
      request({ url: "/sec/networkDetail", method: "post",
        data: {
          isBlack: isBlack,
          isPort: isPort,
          nodeId:this.nodeId,
          searchPage: 1,
          searchSize: 10000,
        }
      }).then((response) => {
        var res = response.data
        console.log(res)
        res.list.map(function(value,index) {
          value.show = false
          value.pushed = false
        })
        if (tab == 0) {
          let arr = res.list.filter(item => !that.localData.some(ele=>ele.dataFrom===item.dataFrom))
          console.log(arr)
          that.tableData = that.localData.concat(arr)
        } else if (tab == 1) {
          that.tableData2 = res.list
        } else if (tab == 2) {
          let arr = res.list.filter(item => !that.mustData.some(ele=>ele.dataFrom===item.dataFrom))
          that.tableData3 = that.mustData.concat(arr)
        } else if (tab == 3) {
          that.tableData4 = res.list
        }
      });
    },
    submit() {
      var that = this
      var allData = []
      allData = this.tableData.concat(this.tableData2).concat(this.tableData3).concat(this.tableData4)
      allData.map ((val,index) => {
        if (!val.dataTo) {
          val.dataTo = val.dataFrom
        }
        if (val.isTcp) { val.isTcp = parseInt(val.isTcp) }
      })
      var datas = {
        isBlack:this.isBlack,
        netSwitch:this.networkSwitch,
        nodeId:this.nodeId,
        networkPolicies: allData
      }
    //   console.log(datas)
      request({ url: "/sec/editNetwork", method: "post", data: datas
      }).then((response) => {
        var res = response.data
        if (res.status === 0) {
          that.$message({ showClose: true, message: '操作成功', type: 'success' });
          that.$emit("handleSuccess");
          that.diaClose()
        } else {
          that.tableData3.map(function(value,index) {
            value.isTcp = String(value.isTcp)
          })
          that.tableData4.map(function(value,index) {
            value.isTcp = String(value.isTcp)
          })
        }
      });
    },
    isRepeat(arr,key) { //判断数组是否有重复值，key：判断字段，true：不存在，false：存在
      for (let i = 0; i < arr.length; i ++) {
        for (let j = i + 1; j < arr.length; j ++) {
            if (arr[i][key] == arr[j][key]) {
                return false;
            }
        }
      }
      return true;
    },
    //first IP白名单
    indexMethod(index) {
      if(index < 9) {
        return '0' + ( index + 1 )
      } else {
        return index + 1
      }
    },
    whiteIPAdd() {
      for (let i of this.tableData) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      this.tableData.push({
        dataFrom:"",
        isBlack:0,
        isPort:0,
        show: true,//ip的输入框切换
        pushed:true //是否为添加项
      }); 
    },
    whiteIPSegmentAdd() {
      for (let i of this.tableData) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      this.tableData.push({
        dataFrom:"",
        dataTo:"",
        isBlack:0,
        isPort:0,
        segment: true,
        show: true,//端口号，协议的输入框切换
        pushed:true //是否为添加项
      }); 
    },
    whiteIpSave(row,index) {
    //   console.log(row)
      if (row.segment) {
        if (row.dataFrom == "" ||row.dataTo == "" ) return this.$message.error("IP不能为空");
        if (row.dataTo == row.dataFrom ) return this.$message.error("IP段前后IP不能相同");
        let ipFromList = row.dataFrom.split('.');
        var ip1 = parseInt(ipFromList[0]), ip2 = parseInt(ipFromList[1]), ip3 = parseInt(ipFromList[2]), ip4 = parseInt(ipFromList[3]);
        let ipToList = row.dataTo.split('.');
        var ip5 = parseInt(ipToList[0]), ip6 = parseInt(ipToList[1]), ip7 = parseInt(ipToList[2]), ip8 = parseInt(ipToList[3]);
        if (ip1 > ip5 || (ip1==ip5 && ip2>ip6) || (ip1==ip5 && ip2==ip6 && ip3>ip7) || (ip1==ip5 && ip2==ip6 && ip3==ip7 && ip4>=ip8)) 
        return this.$message.error("请输入正确IP");
        var result = this.isRepeat(this.tableData,'dataTo')
        if (result == false) return this.$message.error("IP不可重复添加");
        row.segment = false
      } else {
        if (row.dataFrom == "") return this.$message.error("IP不能为空");
        var result = this.isRepeat(this.tableData,'dataFrom')
        if (result == false) return this.$message.error("IP不可重复添加");
        row.dataTo = row.dataFrom
      }
      row.show = false
      row.saved = true//项是否保存过
      this.whiteIpSaved.dataTo = row.dataTo
      this.whiteIpSaved.dataFrom = row.dataFrom
    },
    whiteIpCancel(row,index) {
      var that= this
      if (row.segment) {
        row.segment = false
        if (!row.saved && row.pushed) {
          that.tableData.splice(index,1)
        } else {
          row.dataFrom = that.whiteIpSaved.dataFrom
          row.dataTo = that.whiteIpSaved.dataTo
        }
      } else {
        if (!row.saved && row.pushed) {
          that.tableData.splice(index,1)
        } else {
          row.dataFrom = that.whiteIpSaved.dataFrom
          row.dataTo = that.whiteIpSaved.dataFrom
        }
      }
      row.show = false
    },
    whiteIpEdit(row,index) {
      for (let i of this.tableData) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      if (row.dataTo &&row.dataTo!=row.dataFrom) {
        row.segment = true
        this.whiteIpSaved.dataTo = row.dataTo
        this.whiteIpSaved.dataFrom = row.dataFrom
      } else {
        this.whiteIpSaved.dataTo = row.dataFrom
        this.whiteIpSaved.dataFrom = row.dataFrom
      }
      row.show = true
    },
    whiteIpDel(row,index) {
      this.tableData.splice(index, 1)
    },
    //second IP黑名单
    indexMethod2(index) {
      if(index < 9) {
        return '0' + ( index + 1 )
      } else {
        return index + 1
      }
    },
    blackIPAdd() {
      for (let i of this.tableData2) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      this.tableData2.push({
        dataFrom:"",
        isBlack:1,
        isPort:0,
        show: true,//ip的输入框切换
        pushed:true //是否为添加项
      }); 
    },
    blackIPSegmentAdd() {
      for (let i of this.tableData2) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      this.tableData2.push({
        dataFrom:"",
        dataTo:"",
        isBlack:1,
        isPort:0,
        segment: true,//段
        show: true,//ip输入框切换
        pushed:true //是否为添加项
      }); 
    },
    blackIpSave(row,index) {
    //   console.log(row)
      if (row.dataFrom == "") return this.$message.error("IP不能为空");
      if (row.segment) {
        if (row.dataFrom == "" ||row.dataTo == "" ) return this.$message.error("IP不能为空");
        if (row.dataTo == row.dataFrom ) return this.$message.error("IP段前后IP不能相同");
        let ipFromList = row.dataFrom.split('.');
        var ip1 = parseInt(ipFromList[0]), ip2 = parseInt(ipFromList[1]), ip3 = parseInt(ipFromList[2]), ip4 = parseInt(ipFromList[3]);
        let ipToList = row.dataTo.split('.');
        var ip5 = parseInt(ipToList[0]), ip6 = parseInt(ipToList[1]), ip7 = parseInt(ipToList[2]), ip8 = parseInt(ipToList[3]);
        if (ip1 > ip5 || (ip1==ip5 && ip2>ip6) || (ip1==ip5 && ip2==ip6 && ip3>ip7) || (ip1==ip5 && ip2==ip6 && ip3==ip7 && ip4>=ip8)) 
        return this.$message.error("请输入正确IP");
        var result = this.isRepeat(this.tableData2,'dataTo')
        if (result == false) return this.$message.error("IP不可重复添加");
        row.segment = false
      } else {
        var result = this.isRepeat(this.tableData2,'dataFrom')
        if (result == false) return this.$message.error("IP不可重复添加");
        row.dataTo = row.dataFrom
      }
      row.show = false
      row.saved = true//项是否保存过
      this.blackIpSaved.dataTo = row.dataTo
      this.blackIpSaved.dataFrom = row.dataFrom
    },
    blackIpCancel(row,index) {
      var that= this
      if (row.segment) {
        row.segment = false
        if (!row.saved && row.pushed) {
          that.tableData2.splice(index,1)
        } else {
          row.dataFrom = that.blackIpSaved.dataFrom
          row.dataTo = that.blackIpSaved.dataTo
        }
      } else {
        if (!row.saved && row.pushed) {
          that.tableData2.splice(index,1)
        } else {
          row.dataFrom = that.blackIpSaved.dataFrom
          row.dataTo = that.blackIpSaved.dataFrom
        }
      }
      row.show = false
    },
    blackIpEdit(row,index) {
      for (let i of this.tableData2) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      if (row.dataTo &&row.dataTo!=row.dataFrom) {
        row.segment = true
        this.blackIpSaved.dataTo = row.dataTo
        this.blackIpSaved.dataFrom = row.dataFrom
      } else {
        this.blackIpSaved.dataTo = row.dataFrom
        this.blackIpSaved.dataFrom = row.dataFrom
      }
      row.show = true
    },
    blackIpDel(row,index) {
      this.tableData2.splice(index, 1)
    },
    //third 端口白名单
    indexMethod3(index) {
      if(index < 9) {
        return '0' + ( index + 1 )
      } else {
        return index + 1
      }
    },
    whitePortAdd() {
      for (let i of this.tableData3) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      this.tableData3.push({
        dataFrom:"",
        isTcp:"",
        isBlack:0,
        isPort:1,
        show: true,//端口号，协议的输入框切换
        pushed:true //是否为添加项
      }); 
    },
    whitePortSegmentAdd() {
      for (let i of this.tableData3) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      this.tableData3.push({
        dataFrom:"",
        dataTo:"",
        isTcp:"",
        isBlack: 0,
        isPort: 1,
        segment: true,
        show: true,//端口号，协议的输入框切换
        pushed:true //是否为添加项
      }); 
    },
    whitePortSave(row,index) {
    //   console.log(row)
      this.whitePortSaved.isTcp = row.isTcp
      this.whitePortSaved.dataTo = row.dataTo
      this.whitePortSaved.dataFrom = row.dataFrom
      var that = this
      var reg =  /^([1-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
      
      if (row.segment) {
        var result = this.isRepeat(this.tableData3,'dataTo')
        if (row.dataFrom == "" ||row.dataTo == "" ) {
          return this.$message.error("必填参数不可为空");
        } else if (!reg.test(row.dataFrom) || !reg.test(row.dataTo) ) {
          that.portTips = true
          return this.$message.error("参数不符合范围：1-65535");
        } else if (row.dataTo == row.dataFrom ) { 
          return this.$message.error("端口段前后不能相同"); 
        } else if (parseInt(row.dataFrom) > parseInt(row.dataTo)) {
          return this.$message.error("请输入正确端口");
        } else if (row.isTcp == "") {
          return this.$message.error( "请选择协议");
        } else if( result == false) {
          return this.$message.error("IP不可重复添加");
        } else {
          row.segment = false 
        }
      } else {
        var result = this.isRepeat(this.tableData3,'dataFrom')
        if (row.dataFrom == "") {
          that.portTips = true
          return this.$message.error("必填参数不可为空");
        } else if (!reg.test(row.dataFrom)) {
          that.portTips = true
          return this.$message.error("参数不符合范围：1-65535");
        } else if (row.isTcp == "") {
          return this.$message.error( "请选择协议");
        } else if( result == false) {
          return this.$message.error("IP不可重复添加");
        } else {
          that.portTips = false
        }
        row.dataTo = row.dataFrom 
      }
      row.show = false
      row.saved = true//项是否保存过
    },
    whitePortCancel(row,index) {
      var that= this
      if (row.segment) {
        row.segment = false 
        if (!row.saved && row.pushed) {
          that.tableData3.splice(index,1)
        } else {
          row.dataFrom = that.whitePortSaved.dataFrom
          row.dataTo = that.whitePortSaved.dataTo
          row.isTcp = that.whitePortSaved.isTcp  
        }
      } else {
        if (!row.saved && row.pushed) {
          that.tableData3.splice(index,1)
        } else {
          row.dataFrom = that.whitePortSaved.dataFrom
          row.dataTo = that.whitePortSaved.dataFrom
          row.isTcp = that.whitePortSaved.isTcp  
        }
      }
      row.show = false
    },
    whitePortEdit(row,index) {
      for (let i of this.tableData3) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      row.show = true
      row.isTcp = String(row.isTcp)
      if (row.dataTo &&row.dataTo!=row.dataFrom) {
        row.segment = true
        this.whitePortSaved.dataTo = row.dataTo
      } else {
        this.whitePortSaved.dataTo = row.dataFrom
      }
      this.whitePortSaved.isTcp = row.isTcp
      this.whitePortSaved.dataFrom = row.dataFrom
    },
    whitePortDel(row,index) {
      this.tableData3.splice(index, 1)
    },
    //forth 端口黑名单
    indexMethod4(index) {
      if(index < 9) {
        return '0' + ( index + 1 )
      } else {
        return index + 1
      }
    },
    blackPortAdd() {
      for (let i of this.tableData4) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      this.tableData4.push({
        dataFrom:"",
        isTcp:"",
        isBlack:1,
        isPort:1,
        show: true,//端口号，协议的输入框切换
        pushed:true //是否为添加项
      }); 
    },
    blackPortSegmentAdd() {
      for (let i of this.tableData4) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      this.tableData4.push({
        dataFrom:"",
        dataTo:"",
        isTcp:"",
        isBlack:1,
        isPort:1,
        segment: true,
        show: true,//端口号，协议的输入框切换
        pushed:true //是否为添加项
      }); 
    },
    blackPortEdit(row,index) {
      for (let i of this.tableData4) {
        if (i.show) return this.$message.warning("请先保存当前编辑项");
      }
      row.show = true
      row.isTcp = String(row.isTcp)
      if (row.dataTo &&row.dataTo!=row.dataFrom) {
        row.segment = true
        this.blackPortSaved.dataTo = row.dataTo
      } else {
        this.blackPortSaved.dataTo = row.dataFrom
      }
      this.blackPortSaved.isTcp = row.isTcp
      this.blackPortSaved.dataFrom = row.dataFrom
    },
    blackPortDel(row,index) {
      this.tableData4.splice(index, 1)
    },
    blackPortSave(row,index) {
    //   console.log(row)
      this.blackPortSaved.isTcp = row.isTcp
      this.blackPortSaved.dataTo = row.dataTo
      this.blackPortSaved.dataFrom = row.dataFrom
      var that = this
      var reg =  /^([1-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
      if (row.segment) {
        var result = this.isRepeat(this.tableData4,'dataTo')
        if (row.dataFrom == "" ||row.dataTo == "" ) {
          return this.$message.error("必填参数不可为空");
        } else if (!reg.test(row.dataFrom) || !reg.test(row.dataTo) ) {
          that.portTips = true
          return this.$message.error("参数不符合范围：1-65535");
        } else if (row.dataTo == row.dataFrom ) { 
          return this.$message.error("端口段前后不能相同"); 
        } else if (parseInt(row.dataFrom) > parseInt(row.dataTo)) {
          return this.$message.error("请输入正确端口");
        } else if (row.isTcp == "") {
          return this.$message.error( "请选择协议");
        } else if( result == false) {
          return this.$message.error("IP不可重复添加");
        } else {
          row.segment = false 
        }
      } else {
        var result = this.isRepeat(this.tableData4,'dataFrom')
        if (row.dataFrom == "") {
          that.portTips = true
          return this.$message.error("必填参数不可为空");
        } else if (!reg.test(row.dataFrom)) {
          that.portTips = true
          return this.$message.error("参数不符合范围：1-65535");
        } else if (row.isTcp == "") {
          return this.$message.error( "请选择协议");
        } else if( result == false) {
          return this.$message.error("IP不可重复添加");
        } else {
          that.portTips = false
        }
        row.dataTo = row.dataFrom 
      }
      row.show = false
      row.saved = true//项是否保存过
    },
    blackPortCancel(row,index) {
      var that= this
      if (row.segment) {
        row.segment = false 
        if (!row.saved && row.pushed) {
          that.tableData4.splice(index,1)
        } else {
          row.dataFrom = that.blackPortSaved.dataFrom
          row.dataTo = that.blackPortSaved.dataTo
          row.isTcp = that.blackPortSaved.isTcp  
        }
      } else {
        if (!row.saved && row.pushed) {
          that.tableData4.splice(index,1)
        } else {
          row.dataFrom = that.blackPortSaved.dataFrom
          row.dataTo = that.blackPortSaved.dataFrom
          row.isTcp = that.blackPortSaved.isTcp  
        }
      }
      row.show = false 
    },
  },
}
</script>

<style scoped>
.paging {
  margin: 18px 0 0 0;
  color: rgba(51,51,51,0.9);
}
.paging >>>.el-pager li {
  min-width: 31px;
  height: 31px;
  line-height: 31px;
  border-radius: 2px;
  border: 1px solid #e4e4e4;
  margin: 0 3px;
}
.paging >>>.el-pager li.active, .paging >>>.el-pager li:hover{
  background-color: #effff8;
  border: 1px solid #1ac492;
  color: #1ac492;
  font-size: 14px;
}
.paging >>> .btn-next, .paging >>> .btn-prev {
  min-width: 31px;
  height: 31px;
  line-height: 31px;
  border: 1px solid #e4e4e4;
  padding: 0;
  margin: 0 5px;
}
.paging >>>.el-select .el-input__inner:focus,
.paging >>>.el-pagination__sizes .el-input .el-input__inner:hover,
.paging >>>.el-pagination__sizes .el-input .el-input__inner:active,
.paging >>>.el-pagination__sizes .el-select .el-input.is-focus .el-input__inner{
  border-color: #1ac492;
}

.paging >>>.el-pagination__jump {
  margin-left: 0px;
}
.paging >>>.el-pagination__jump .el-input__inner:focus {
  border: 1px solid #1ac492;
  margin-left: 0px;
}
.el-table-add-row {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  border-radius: 3px;
}
.dialog-footer .sureBtn {
  background-color: #1ac492!important;
  border: none;
  border: 1px solid #1ac492!important;
  color: #fff;
}
.diatable {
  width: 100%;
  border:1px solid #F0F2F5;
  margin-top: 10px;
}
.saveBtn {
  color: #67c23a;
  background: #f0f9eb;
  border-color: #c2e7b0;
  padding:8px 16px
}
.saveBtn:active {
  background: #5daf34;
  border-color: #5daf34;
  color: #fff;
  outline: none;
}
.saveBtn:hover, .saveBtn:focus  {
  background: #67c23a;
  border-color: #67c23a;
  color: #fff;  
}
.editBtn {
  color:#e6a23c;background: #fdf6ec;border-color: #f5dab1;padding:8px
}
.editBtn:hover, .editBtn:focus  {
  background: #e6a23c;
  border-color: #e6a23c;
  color: #fff; 
}
.editBtn:active {
  background: #cf9236;
  border-color: #cf9236;
  color: #fff;
  outline: none;
}
.certainBtn {
  color:#409eff;background: #ecf5ff;border-color: #b3d8ff;padding:8px 16px
}
.certainBtn:hover, .certainBtn:focus {
  background: #409eff;
  border-color: #409eff;
  color: #fff; 
}
.certainBtn:active {
  background: #3a8ee6;
  border-color: #3a8ee6;
  color: #fff;
  outline: none;
}
.cancelBtn {
  padding:8px;
  color: #f56c6c;
  background: #fef0f0;
  border-color: #fbc4c4;
}
.cancelBtn:hover, .cancelBtn:focus{
  background: #f56c6c;
  border-color: #f56c6c;
  color: #fff;
}
.cancelBtn:active {
  background: #dd6161;
  border-color: #dd6161;
  color: #fff;
  outline: none;
}
.errorTips >>>.el-input__inner{
  border-color: #dd6161;
}
</style>

<style>
.record .el-tabs__item.is-active {
  color: #1ac492!important;
}
.record .el-tabs__item:hover {
  color: #1ac492!important;
}
</style>
