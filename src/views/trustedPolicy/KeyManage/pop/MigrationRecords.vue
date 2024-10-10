<template>
  <!--新建开始-->
  <el-dialog :title="title" width="48%" top="5vh" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false">
    <el-table :data="keyManageData" 
        size="small" ref="keyManageTable" tooltip-effect="light" :height="height" 
        :header-cell-style="{height: '48px','background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)',padding:'0px'}"
        style="width: 100%;font-size: 14px;border:1px solid #F0F2F5;"  :cell-style="{padding:'0px',color: 'rgba(0, 0, 0, 0.9)'}" max-height="60vh" :fit='true' row-key="id">
      <template slot="empty">
        <img style="" v-if="emptytxt" src="@/assets/nodata1.png" />
      </template>
      <el-table-column type="index" :index="indexMethod" label="序号" width="50px"></el-table-column>
      <el-table-column prop="type" label="类型">
        <template slot-scope="props">
          <span v-if="props.row.type=='1'">导出</span>
          <span v-if="props.row.type=='2'">导入</span>
          <span v-if="props.row.type=='3'">迁出</span>
          <span v-if="props.row.type=='4'">迁入</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="110%">
        <template slot-scope="props">
          <span v-if="props.row.status=='6'" class="wathet">导出中</span>
          <span v-else-if="props.row.status=='7'" class="green">已导出</span>
          <span v-else-if="props.row.status=='8'" class="red">导出失败</span>

          <span v-else-if="props.row.status=='9'" class="wathet">导入中</span>
          <span v-else-if="props.row.status=='10'" class="green">已导入</span>
          <span v-else-if="props.row.status=='11'" class="red">导入失败</span>

          <span v-else-if="props.row.status=='12'" class="wathet">迁出中</span>
          <span v-else-if="props.row.status=='13'" class="green">已迁出</span>
          <span v-else-if="props.row.status=='14'" class="red">迁出失败</span>

          <span v-else-if="props.row.status=='15'" class="wathet">迁入中</span>
          <span v-else-if="props.row.status=='16'" class="green">已迁入</span>
          <span v-else-if="props.row.status=='17'" class="red">迁入失败</span>
          <span v-else class="grey">初始化状态</span>
        </template>
      </el-table-column>
      <el-table-column prop="file_name" label="文件名称" min-width="150%"></el-table-column>
      <!-- <el-table-column prop="file_path" label="文件路径" min-width="100%"></el-table-column> -->
      <el-table-column prop="tree_path" label="树节点路径" min-width="110%"></el-table-column>
      <el-table-column prop="transfer_node_ip" label="迁出目标" min-width="100%"></el-table-column>
      <el-table-column prop="up_date" label="操作时间" min-width="100%"></el-table-column>
      <el-table-column label="操作" align="left" width="60px">
        <template slot-scope="scope">
          <el-button style="color:#1ac492" type="text" v-if="scope.row.status=='7' || scope.row.status=='13'" @click="download(scope.row)">下载</el-button>
          <el-button type="text" v-else disabled>下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination align='right' class="paging"
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange"
      :current-page="currentPage.sync" 
      :page-sizes="[10,20]" 
      :page-size="pageSize" 
      layout="total, prev, pager, next, sizes, jumper" 
      :total="total">
    </el-pagination>
  </el-dialog>
</template>

<script>
import request from "@/utils/request";
import { timeToZh } from "@/utils/timefilter";
export default {
  name: "MigrationRecords",
  data() {
    return {
      height: 0,
      dialogFormVisible: false,
      keyManageData:[],
      searchTerminalIp:'',
      emptytxt:'',
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10,// 每页的数据条数
      nodeIp:'',
      title: ''
    };
  },
  methods: {
    diaOpen(row) {
      var that = this
      this.dialogFormVisible = true;
      this.searchTerminalIp = "";
      this.nodeIp = row.ip
      this.title = '迁移记录 '+ row.ip
      // 加载终端列表
      request({url: "/sec/searchLKeytreeMigrateList",method: "post",
        data: {
          node_id:row.nodeId,
          condition: "",
          searchPage: "1",
          searchSize: "10",
        }
      }).then((response) => {
        var res = response.data
        // console.log(res)
        that.keyManageData = res.list
        that.total = res.total
        if (res.total > 5) {
          that.height = 400;
        } else if (res.total === 0) {
          that.height = 110;
        } else {
          that.height = 100 + 42 * res.total;
        }
      });
    },
    diaClose() {
      this.dialogFormVisible = false;
    },
    indexMethod(index) {
      if (this.currentPage === 1) {
        if(index < 9) {
          return '0' + ( index + 1 )
        } else {
          return index + 1
        }
      } else {
        return ( index + 1 ) + this.pageSize * (this.currentPage - 1)
      }
    },
     //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
      this.pageShow = false
      this.$nextTick(() => {
        this.pageShow = true
      })
      this.loadData()
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.loadData()
    },
    loadData() {
      var that = this
      request({url: "/sec/searchLKeytreeMigrateList",method: "post",
        data: {
          node_id:this.nodeId,
          searchPage: this.currentPage,
          searchSize: this.pageSize,
        }
      }).then((response) => {
        var res = response.data
        // console.log(res)
        that.keyManageData = res.list
        that.total = res.total
        if (res.total > 5) {
          that.height = 400;
        } else if (res.total === 0) {
          that.height = 110;
        } else {
          that.height = 100 + 42 * res.total;
        }
      });
    },
    ab2str(u,f) {
      var b = new Blob([u]);
      var r = new FileReader();
      r.readAsText(b, 'utf-8');
      r.onload = function (){if(f)f.call(null,r.result)}
    },
    download(row) {
      var that = this
      // console.log(row)
      this.$confirm("确定下载此数据？","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(() => {
      request({url: "/sec/export_Keytree?id=" + row.id,method: "post",responseType: "arraybuffer", }).
        then((response) => {
          var res = response.data
          that.ab2str(res,function(str) {
            // console.log(str)
            if (str.indexOf("status") > -1) {
              var json = JSON.parse(str)
              that.$message({ message: json.errormessage, type: "error", showClose: true});
            } else {
              that.$message({ message: "下载成功!", type: "success", showClose: true,});
              let fileNames = response.headers["filename"]
              const blob = new Blob([res],{type:'application/octet-stream'})
              if ('download' in document.createElement('a')) {
                const elink = document.createElement('a')
                elink.style.display = 'none'
                elink.href = URL.createObjectURL(blob)
                elink.setAttribute('download',fileNames)
                document.body.appendChild(elink)
                elink.click()
                URL.revokeObjectURL(elink.href)
                document.body.removeChild(elink)
              }
            }
          })
        })
      }).catch(res => {})
    }
  },
};
</script>

<style scoped>
.searchDiv {
  display: flex;
  padding-bottom: 10px;
}
.terminalIp {
  /* width: 60px; */
  height: 32px;
  line-height: 32px;
}
/*滚动条*/
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.paging {
  margin-top: 18px;
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
.paging >>>.el-pager li.active,.paging >>>.el-pager li:hover {
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
</style>
