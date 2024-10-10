<template>
  <div class="keyTree">
    <div class="title">
      <span>密钥树管理</span>
      <span class="closeBtn" @click="closeDialog"><i class="el-icon-close"></i></span>
    </div>
    <div class="terminalInfo"> 
      <img class="terminalImg" src="@/assets/terminal.png" alt="">
      <span>{{this.rowMessage.ip}}</span>
        <img class="questionImg" src="@/assets/question.png" title="网络地址">
    </div>
    <div class="btn">
      <el-button size="small" class="popBtn addBtn" @click="addNode">创建</el-button>
      <el-button size="small" class="popBtn importBtn" @click="importNode">导入</el-button>
      <el-button size="small" class="popBtn exportBtn" @click="exportNode">导出</el-button>
      <el-button size="small" class="popBtn moveIn" @click="immigrateNode">迁入</el-button>
      <!-- <el-button size="small" class="moveOut" @click="authenticationNode">认证</el-button> -->
      <el-button size="small" class="popBtn moveOut" @click="emigrateNode">迁出</el-button>
      <el-button size="small" class="popBtn delBtn" @click="delNode">删除</el-button>
    </div>
    <div class="treeContainer">
      <div class="emptyContainer">
        <img src="@/assets/nokey.png" v-if="emptytxt==true" alt="">
      </div>
      <el-tree :data="treeData" :props="props" @node-click="handleNodeClick" default-expand-all class="tree filter-tree" empty-text=""
        node-key="id" :expand-on-click-node="false" ref="tree" highlight-current :render-content="renderContent">
        <span class="custom-tree-node" slot-scope="{ node,data }" @mouseover.native="mouseover(data,$event)">
          <span>
            <i :class="[data.icon]" style="font-size:14px color:red"></i>
            {{ node.label }}
          </span>       
        </span>
      </el-tree>
    </div>
    <create-node ref="createNode" @addSuccess="initData" ></create-node>
    <immigrate-node ref="immigrateNode" @addSuccess="initData" ></immigrate-node>
    <authentication-node ref="authenticationNode"></authentication-node>
    <emigrate-node ref="emigrateNode" @addSuccess="initData"></emigrate-node>
    <import-node ref="importNode" @addSuccess="initData"></import-node>
    <div  id="details" v-if="isDetails == true" :style="{left:floatLeft,top:floatTop}">
      <p><span class="tipTitle">节点名称：</span> <span>{{nodeName}}</span></p>
      <p><span class="tipTitle">叶子节点：</span> <span>{{leafNode}}</span></p>
      <p v-if="leafNode == '叶子节点'"><span class="tipTitle">密钥用途：</span> <span>{{keyUse}}</span></p>
      <p v-if="leafNode == '叶子节点'"><span class="tipTitle">密钥类型：</span> <span>{{keyType}}</span></p>
      <p v-if="leafNode == '叶子节点'"><span class="tipTitle">密钥来源：</span> <span>{{origin}}</span></p>
      <p v-if="leafNode == '非叶子节点'"><span class="tipTitle">迁移：</span> <span>{{migaratable}}</span></p>
      <p v-if="leafNode == '叶子节点'"><span class="tipTitle">密码认证方式：</span> <span>{{authPasswd}}</span></p>
      <p v-if="leafNode == '叶子节点'"><span class="tipTitle">身份认证方式：</span> <span>{{authProcess}}</span></p>
      <p v-if="leafNode == '叶子节点'"><span class="tipTitle">用户认证方式：</span> <span>{{authUser}}</span></p>
      <p v-if="leafNode == '叶子节点'"><span class="tipTitle">环境度量：</span> <span>{{authEnv}}</span></p>
      <p v-if="leafNode == '叶子节点'"><span class="tipTitle">启动阶段是否可信：</span> <span>{{auth_trust_state_boot}}</span></p>
      <p v-if="leafNode == '叶子节点'"><span class="tipTitle">动态度量是否可信：</span> <span>{{auth_trust_state_dm}}</span></p>
      <p v-if="leafNode == '叶子节点'"><span class="tipTitle">静态度量是否可信：</span> <span>{{auth_trust_state_sm}}</span></p>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import CreateNode from "./TreeOperation/CreateNode"
import ImmigrateNode from "./TreeOperation/ImmigarteNode"
import AuthenticationNode from './TreeOperation/AuthenticationNode.vue';
import EmigrateNode from './TreeOperation/EmigrateNode.vue';
import ImportNode from './TreeOperation/ImportNode.vue';

export default {
  name: "KeyTree",
  props:{
    rowMessage: {
      type: Object,
    }
  },
  components: { CreateNode,ImmigrateNode,AuthenticationNode,EmigrateNode,ImportNode},
  data() {
    return {
      treeData: [],
      emptytxt:"",
      props: {
        children: "children",
        label: "name",
      },
      nodeData:{},
      autorefresh: "",//定时器
      num:0,
      icon:'',
      pathLable:"",
      pathList:[],
      isDetails:false,
      floatLeft:'',
      floatTop:'',
      nodeName:'',
      leafNode:'',
      keyUse:'',
      keyType:'',
      origin:'',
      migaratable:'',
      authPasswd:'',
      authProcess:'',
      authUser:'',
      authEnv:'',
      auth_trust_state_boot:0,//启动阶段
      auth_trust_state_dm:0,//动态度量
      auth_trust_state_sm:0,//静态度量
    };
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      // console.log(this.rowMessage)
      var that = this;
      this.nodeData = {}
      request({url: "/sec/searchKeytreeByNID?node_id="+this.rowMessage.nodeId,method: "post",})
      .then((response) => {
        var res = response.data
        // console.log(res)
        if (res.data.length == 0 ) {
          that.emptytxt = true
        } else {
          that.emptytxt = false
          that.treeData = res.data
        }
      });
    },
    getNodeById() {
      request({url: "/sec/searchByID?id="+this.nodeData.id,method: "post",})
      .then((response) => {
        var res = response.data
        // console.log(res)
      });
    },
    closeDialog () {
      this.$emit("closeDialog")
    },
    diaClose() {
      var that = this;
      that.dialogFormVisible = false;
    },
    handleNodeClick(data,e) {
      this.nodeData = data
      let tree = this.$refs.tree
      this.pathList = []
      this.getTreeNode(tree.getNode(data))
    },
    getTreeNode(node) {
      if (node) {
        if (node.label !== undefined) {
          this.pathList.unshift(node.label); //在数组头部添加元素
          this.getTreeNode(node.parent); //递归
          this.pathList.forEach(function(item,index,arr){
            if (item =="/") {
              arr.splice(index,1)
            }
          })
          this.pathLable="/"+this.pathList.join('/');
        }
      }
    },
    renderContent(h, { node, data, store }){
      if (data.status == 1) {
        return <span style="color:#000"><i class={data.icon}></i><span on-mouseover={($event) => this.mouseover($event,data)} on-mouseleave={() => this.mouseleave()} style="padding-left: 4px;">{node.label}</span></span>;
      } else if(data.status == 3) {
        return <span style="color:#f56c6c"><i class={data.icon}></i><span on-mouseover={($event) => this.mouseover($event,data)} on-mouseleave={() => this.mouseleave()} style="padding-left: 4px;">{node.label}</span></span>;
      } else {
        return <span style="color:#999"><i class={data.icon}></i><span on-mouseover={($event) => this.mouseover($event,data)} on-mouseleave={() => this.mouseleave()} style="padding-left: 4px;">{node.label}</span></span>;
      }
    },
    mouseover($event,data) {
      this.isDetails = true 
      this.floatLeft = $event.offsetX + 110 + 'px' // 减去外层div的left距离
      this.floatTop = $event.clientY + 10 +  'px'
      this.nodeName = data.name
      if (data.leaf_node == 0) { this.leafNode = "非叶子节点"} else if(data.leaf_node == 1) { this.leafNode = "叶子节点"} else {this.leafNode = ""}
      if (data.key_use == 0) { this.keyUse = "签名"} 
      else if(data.key_use == 1) { this.keyUse = "加密"}
      else if(data.key_use == 2) { this.keyUse = "封印"}
      else {this.keyUse = ""}

      if (data.key_type == 0) { this.keyType = "非对称密钥"} 
      else if(data.key_type == 1) { this.keyType = "对称密钥"}
      else {this.keyType = ""}

      if (data.origin == 0) { this.origin = "内部密钥"} 
      else if(data.origin == 1) { this.origin = "外部密钥"}
      else {this.origin = ""}

      if (data.migaratable == 0) { this.migaratable = "可迁移"} 
      else if(data.migaratable == 1) { this.migaratable = "不可迁移"}
      else {this.migaratable = ""}

      if (data.auth_passwd == 0) { this.authPasswd = "不需要密码认证"} 
      else if(data.auth_passwd == 1) { this.authPasswd = "需要密码认证"}
      else {this.authPasswd = ""}
      
      if (data.auth_process == 0) { this.authProcess = "不需要身份认证"} 
      else if(data.auth_process == 1) { this.authProcess = "进程身份认证"}
      else if(data.auth_process == 2) { this.authProcess = "进程角色认证"}
      else {this.authProcess = ""}
      
      if (data.auth_user == 0) { this.authUser = "不需要用户认证"} 
      else if(data.auth_user == 1) { this.authUser = "用户ID认证"}
      else if(data.auth_user == 2) { this.authUser = "用户组ID认证"}
      else {this.authUser = ""}

      if (data.auth_env == 0) { this.authEnv = "不需要进行环境度量"} 
      else if(data.auth_env == 1) { this.authEnv = "需要进行环境度量"}
      else {this.authEnv = ""}

      if (data.auth_trust_state_boot == 0) { this.auth_trust_state_boot = "不需要"} 
      else if(data.auth_trust_state_boot == 1) { this.auth_trust_state_boot = "需要"}
      else {this.auth_trust_state_boot = ""}

      if (data.auth_trust_state_dm == 0) { this.auth_trust_state_dm = "不需要"} 
      else if(data.auth_trust_state_dm == 1) { this.auth_trust_state_dm = "需要"}
      else {this.auth_trust_state_dm = ""}

      if (data.auth_trust_state_sm == 0) { this.auth_trust_state_sm = "不需要"} 
      else if(data.auth_trust_state_sm == 1) { this.auth_trust_state_sm = "需要"}
      else {this.auth_trust_state_sm = ""}
    },
    mouseleave() {
      this.isDetails = false
    },
    addNode() {//新增
      // console.log("add",this.pathLable)
      if(JSON.stringify(this.nodeData) == '{}') {
        this.$message({ showClose: true, message:"请选择节点", type: 'error' });
      } else if (this.nodeData.status == 3) {
        this.$message({ showClose: true, message:"该节点正在删除中，不可添加节点", type: 'error' });
      }  else {
        if(this.nodeData.leaf_node == 1) {
          this.$message({ showClose: true, message:"该节点是叶子节点，不可创建数据", type: 'error' });
        } else {
          this.$refs.createNode.diaOpen(this.nodeData,this.rowMessage,this.pathLable)
        }
      }
    },
    importNode() {//导入
      // console.log("importNode",this.pathLable) 
      if(JSON.stringify(this.nodeData) == '{}') {
        this.$message({ showClose: true, message:"请选择节点", type: 'error' });
      } else if (this.nodeData.status == 3) {
        this.$message({ showClose: true, message:"该节点正在删除中，不可导入", type: 'error' });
      } else if (this.nodeData.status == 0 ||this.nodeData.status == 2) {
        this.$message({ showClose: true, message:"该节点不可导入", type: 'error' });
      } else {
        this.$refs.importNode.diaOpen(this.nodeData,this.rowMessage,this.pathLable)
      } 
    },
    exportNode() {//导出
      var that = this
      // console.log("exportNode",this.pathLable)
      if(JSON.stringify(this.nodeData) == '{}') {
        this.$message({ showClose: true, message:"请选择节点", type: 'error' });
      } else if (this.nodeData.status == 3) {
        this.$message({ showClose: true, message:"该节点正在删除中，不可导出", type: 'error' });
      } else if (this.nodeData.status == 0 ||this.nodeData.status == 2) {
        this.$message({ showClose: true, message:"该节点不可导出", type: 'error' });
      } else {
         this.$confirm("确定导出该节点的数据？（导出数据请在迁移记录中下载）","提示", {
          confirmButtonText:"确定",
          cancelButtonText:"取消",
          type:"warning"
        }).then(() => {
          request({url: "/sec/exportKeyTree",method: "post",
            data:{
              node_id: that.rowMessage.nodeId,
              tree_path: that.pathLable,
              id: that.nodeData.id
            }
          }).then((response) => {
            var res = response.data
            // console.log(res)
            if(res.status==0) {
              that.initData()
              this.$message({ showClose: true, message: '操作成功', type: 'success' });
            } else {
              // this.$message({ showClose: true, message: res.errormessage, type: 'error' });
            }
          });
        }).catch(res => {})
      } 
    },
    immigrateNode() {//迁入
      // console.log("immigrateNode",this.pathLable) 
      if(JSON.stringify(this.nodeData) == '{}') {
        this.$message({ showClose: true, message:"请选择节点", type: 'error' });
      } else {
        if(this.nodeData.migaratable == 1) {
          this.$message({ showClose: true, message:"该节点不可迁移", type: 'error' });
        } else if (this.nodeData.status == 3) {
          this.$message({ showClose: true, message:"该节点正在删除中，不可迁入", type: 'error' });
        } else if (this.nodeData.status == 0 ||this.nodeData.status == 2) {
          this.$message({ showClose: true, message:"该节点不可迁入", type: 'error' });
        } else {
          this.$refs.immigrateNode.diaOpen(this.nodeData,this.rowMessage,this.pathLable)
        } 
      }
    },
    // authenticationNode() {
    //   if(JSON.stringify(this.nodeData) == '{}') {
    //     this.$message({ showClose: true, message:"请选择节点", type: 'error' });
    //   } else {
    //     if(this.nodeData.migaratable == 1) {
    //       this.$message({ showClose: true, message:"该节点不可迁移", type: 'error' });
    //     } else if (this.nodeData.status == 3) {
    //       this.$message({ showClose: true, message:"该节点正在删除中，不可迁出", type: 'error' });
    //     } else {
    //       this.$refs.authenticationNode.diaOpen(this.nodeData,this.rowMessage,this.pathLable)
    //     }
    //   }
    // },
    emigrateNode() {//迁出
      // console.log("emigrateNode",this.pathLable)
      if(JSON.stringify(this.nodeData) == '{}') {
        this.$message({ showClose: true, message:"请选择节点", type: 'error' });
      } else {
        if(this.nodeData.migaratable == 1) {
          this.$message({ showClose: true, message:"该节点不可迁移", type: 'error' });
        } else if (this.nodeData.status == 3) {
          this.$message({ showClose: true, message:"该节点正在删除中，不可迁出", type: 'error' });
        } else if (this.nodeData.status == 0 ||this.nodeData.status == 2) {
          this.$message({ showClose: true, message:"该节点不可迁出", type: 'error' });
        } else {
          this.$refs.emigrateNode.diaOpen(this.nodeData,this.rowMessage,this.pathLable)
        } 
      }
    },
    delNode() {
      var that = this
      if(JSON.stringify(this.nodeData) == '{}') {
        this.$message({ showClose: true, message:"请选择节点", type: 'error' });
      } else if (this.nodeData.parent_id == 0) {
        this.$message({ showClose: true, message:"该节点是根节点，不可删除", type: 'error' });
      } else {
        this.$confirm("此操作将永久删除该数据，是否继续？","提示", {
          confirmButtonText:"确定",
          cancelButtonText:"取消",
          type:"warning"
        }).then(() => {
          request({url: "/sec/deleteKeyTreeNode?id="+that.nodeData.id+"&path=" +that.pathLable,method: "post",
          }).then((response) => {
            var res = response.data
            // console.log(res)
            if(res.status==0) {
              that.initData()
              this.$message({ showClose: true, message: '已向终端发送请求，删除中', type: 'success' });
            } else {
              // this.$message({ showClose: true, message: res.errormessage, type: 'error' });
            }
          })
        }).catch(res => {})
      }
    },
    initData(path,parentId) {
      var that = this;
      that.num = 0
      // console.log(this.nodeData)
      that.autorefresh = setInterval(function () {
        that.num ++
        // console.log(that.num)
        that.loadData();
        if(that.num == 5) {
          clearInterval(that.autorefresh);
        }
        
      }, 1000);
      that.$emit('addSuccess')
    },
  },
  destroyed() {
    clearInterval(this.autorefresh);
  },
};
</script>

<style scoped>
.keyTree {
  height: calc(100vh - 60px);
  overflow: auto;
}
.title {
  margin: 20px;
  font-size: 20px;
  color: #000;
  font-family: "Microsoft YaHei";
}
.terminalInfo {
  color: #000;
  margin: 24px;
  font-size: 24px;
}
.closeBtn {
  color: #B4B4B4;
  font-weight: 800!important;
  position: absolute;
  right: 20px;
  cursor: pointer;
}
.terminalImg {
  vertical-align: middle;
  margin: 16px;
}
.questionImg {
  margin-left: 8px;
}
.emptyContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: 10000;
}
.treeContainer {
  position: relative;
  height: calc(100vh - 320px);
  border: 1px solid #f0f0f4;
  margin: 20px 40px;
}
.el-tree{
  margin-top: 16px;
  height: 100%;
  overflow: auto;
}
.btn {
  margin: 24px 40px;
}
.btn .popBtn {
  min-width: 56px;
  height: 32px;
  padding: 7px 13px;
  font-size: 14px;
  background-color: #effff8;
  border: 1px solid #1ac492;
  color: #1ac492;
}
.disableState{
  color: #7195FA;
}
#details {
  padding: 0 5px;
  z-index: 9999;
  width: 200px;
	position: absolute;
  border: 1px solid #1ac492;
  background-color: #EFFEF7;
}
.tipTitle {
  color: #1ac492;
}
/* 树形结构节点添加连线 */
.tree /deep/ .el-tree-node {
  position: relative;
  padding-left: 16px;
}
 
.tree /deep/ .el-tree-node__children {
  padding-left: 16px;
}

.tree /deep/ .el-tree-node__content {
  padding-left: 0px !important;
}

.tree /deep/ .el-tree-node :last-child:before {
  height: 38px;
}
 
.tree /deep/ .el-tree > .el-tree-node:before {
  border-left: none;
}
 
.treeContainer /deep/ .el-tree > .el-tree-node:after {
  border-top: none;
}
 
.tree /deep/ .el-tree-node:before {
  content: "";
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}
 
.tree /deep/ .el-tree-node:after {
  content: "";
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}
.tree /deep/ .el-tree-node__expand-icon.is-leaf {
  display: none;
}
 
.tree /deep/ .el-tree-node:before {
  border-left: 1px dashed #b8b9bb;
  bottom: 0px;
  height: 100%;
  top: -26px;
  width: 1px;
}
 
.tree /deep/ .el-tree-node:after {
  border-top: 1px dashed #b8b9bb;
  height: 20px;
  top: 12px;
  width: 24px;
}
</style>