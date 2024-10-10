<template>
  <!--新建开始-->
  <el-dialog title="学习日志" width="60%" top="10vh" :visible.sync="dialogFormVisible" @close="diaClose" :close-on-click-modal="false">
    <el-table :data="keyManageData.slice((currentPage-1)*pageSize,currentPage*pageSize)" size="small" ref="keyManageTable" tooltip-effect="light"
    :header-cell-style="{'background-color': '#F0F2F5',color: 'rgba(0, 0, 0, 0.72)'}" :cell-style="{color: 'rgba(0, 0, 0, 0.9)'}"
        style="width: 99.9%;font-size: 14px;border:1px solid #F0F2F5;" max-height="52vh" :fit='true' row-key="id">
      <template slot="empty">
        <img style="" v-if="emptytxt" src="@/assets/nodata1.png" />
      </template>
      <el-table-column type="index" :index="indexMethod" label="序号" width="50px"></el-table-column>
      <el-table-column prop="node_name" label="终端名称" min-width="100%"></el-table-column>
      <el-table-column prop="node_ip" label="网络地址" min-width="100%"></el-table-column>
      <el-table-column prop="subject" label="主体" min-width="100%"></el-table-column>
      <el-table-column prop="object" label="客体" min-width="100%"></el-table-column>
      <el-table-column prop="time" label="时间" min-width="100%"></el-table-column>
    </el-table>
    <el-pagination align='right' class="paging"
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage" 
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
      dialogFormVisible: false,
      keyManageData:[],
      emptytxt:'',
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 10,// 每页的数据条数
      learnId:''
    };
  },
  methods: {
    diaOpen(row) {
      var that = this
      this.dialogFormVisible = true;
      this.learnId = row.learnId
      this.currentPage = 1
      var datas = {
        learn_id:row.learnId,
        searchPage: this.currentPage,
        searchSize: this.pageSize,
      }
      // 加载终端列表
      request({url: "/sec/whiteListLearnLogSearch",method: "post",
        data: JSON.stringify(datas)
      }).then((response) => {
        var res = response.data
        // console.log(res)
        if(res.list) {
          res.list.map(function(value,index) {
            value.time =  timeToZh(value.time);
          })
        }
        that.keyManageData = res.list
        that.total = res.total
      });
    },
    diaClose() {
      this.dialogFormVisible = false;
    },
     //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
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
    }
  },
};
</script>

<style scoped>
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
.paging >>>.el-pager li.active,.paging >>>.el-pager li:hover{
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
