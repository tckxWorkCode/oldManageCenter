(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-06950ac0"],{2532:function(e,t,a){"use strict";var s=a("23e7"),i=a("5a34"),n=a("1d80"),l=a("ab13");s({target:"String",proto:!0,forced:!l("includes")},{includes:function(e){return!!~String(n(this)).indexOf(i(e),arguments.length>1?arguments[1]:void 0)}})},"28f2":function(e,t,a){},"440d":function(e,t,a){},"4a53":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"main"},[a("div",{staticClass:"container"},[a("div",{staticClass:"topNav"},[a("el-breadcrumb",{staticClass:"breadNav",attrs:{separator:"/"}},[a("el-breadcrumb-item",{staticClass:"crumb1"},[e._v("首页")]),a("el-breadcrumb-item",{staticClass:"crumb1"},[e._v("系统设置")]),a("el-breadcrumb-item",{staticClass:"crumb1"},[e._v("管理员证书")]),a("el-breadcrumb-item",{staticClass:"crumb2"},[e._v("证书下发")])],1)],1),a("div",{staticClass:"wrap"},[a("div",{staticClass:"search"},[a("el-form",{ref:"formInline",staticClass:"formInline",attrs:{inline:!0,model:e.formInline,"label-position":e.labelPosition,"label-width":"100px",size:"small"},nativeOn:{submit:function(e){e.preventDefault()}}},[a("el-form-item",{attrs:{label:"证书名称：",prop:"terminalName"}},[a("el-input",{attrs:{clearable:"",placeholder:"请输入证书名称",oninput:"value=value.replace(/[%]/g, '')"},model:{value:e.formInline.terminalName,callback:function(t){e.$set(e.formInline,"terminalName",t)},expression:"formInline.terminalName"}})],1),a("el-form-item",{directives:[{name:"show",rawName:"v-show",value:1==e.advancedSearch,expression:"advancedSearch==true"}],attrs:{label:"日期：",prop:"startDate"}},[a("el-date-picker",{attrs:{"value-format":"yyyy-MM-dd",editable:!1,type:"date",placeholder:"选择开始时间"},model:{value:e.formInline.startDate,callback:function(t){e.$set(e.formInline,"startDate",t)},expression:"formInline.startDate"}}),e._v(" "),a("span",{},[e._v("至")]),e._v(" "),a("el-date-picker",{attrs:{"value-format":"yyyy-MM-dd",editable:!1,type:"date",placeholder:"选择结束时间"},model:{value:e.formInline.endDate,callback:function(t){e.$set(e.formInline,"endDate",t)},expression:"formInline.endDate"}})],1),a("el-form-item",{staticClass:"advancedBtn"},[a("el-button",{staticClass:"resetBtn",attrs:{size:"small"},on:{click:e.resetForm}},[e._v("重置")]),a("el-button",{staticClass:"searchBtn",attrs:{size:"small"},on:{click:e.searchData}},[e._v("查询")]),a("el-button",{directives:[{name:"show",rawName:"v-show",value:1==e.advancedFlag,expression:"advancedFlag==true"}],staticClass:"gaoji",attrs:{size:"small"},on:{click:e.switchBtn}},[e._v("展开"),a("i",{staticClass:"el-icon-arrow-down el-icon--right",staticStyle:{"font-weight":"bold"}})]),a("el-button",{directives:[{name:"show",rawName:"v-show",value:0==e.advancedFlag,expression:"advancedFlag==false"}],staticClass:"gaoji",attrs:{size:"small"},on:{click:e.switchBtn}},[e._v("收起"),a("i",{staticClass:"el-icon-arrow-up el-icon--right",staticStyle:{"font-weight":"bold"}})])],1)],1)],1),a("div",{staticClass:"mainContainer"},[a("div",{staticClass:"tableTitle"},[e._v("下发证书列表")]),a("div",{staticClass:"popBtn"},[a("el-button",{staticClass:"operateBtn",attrs:{size:"small"},on:{click:e.uploadDialog}},[e._v("新建")])],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"softwareTable",staticClass:"softwareTable",staticStyle:{width:"99.9%","font-size":"14px"},attrs:{data:e.softwareData,size:"mini","tooltip-effect":"light","element-loading-text":"加载中，请稍后","header-cell-style":{height:"48px","background-color":"#F0F2F5",color:"rgba(0, 0, 0, 0.72)",padding:"0px"},"cell-style":{padding:"0px",color:"rgba(0, 0, 0, 0.9)"},fit:!0},on:{"sort-change":e.sortChange}},[a("template",{slot:"empty"},[a("div",[e._v("暂无数据")])]),a("el-table-column",{attrs:{type:"index",index:e.indexMethod,label:"序号",width:"70px"}}),a("el-table-column",{attrs:{prop:"node_name",label:"终端名称","min-width":"100%","show-overflow-tooltip":!0}}),a("el-table-column",{attrs:{prop:"ip",label:"网络地址"}}),a("el-table-column",{attrs:{prop:"orther_name",label:"证书别名"}}),a("el-table-column",{attrs:{prop:"status",label:"证书状态",formatter:e.statusVal}}),a("el-table-column",{attrs:{prop:"create_time",label:"创建时间",sortable:"custom","show-overflow-tooltip":!0}}),a("el-table-column",{attrs:{fixed:"right",label:"操作","header-align":"left",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[2==t.row.status||4==t.row.status?a("el-button",{staticStyle:{color:"#1ac492"},attrs:{type:"text"},on:{click:function(a){return e.startUsing(t.row)}}},[e._v("启用")]):a("el-button",{attrs:{disabled:"",type:"text"}},[e._v("启用")]),1==t.row.status||5==t.row.status?a("el-button",{staticStyle:{color:"#1ac492"},attrs:{type:"text"},on:{click:function(a){return e.stopUsing(t.row)}}},[e._v("停用")]):a("el-button",{attrs:{disabled:"",type:"text"}},[e._v("停用")]),1!=t.row.origin||0!=t.row.status&&2!=t.row.status&&4!=t.row.status?1!=t.row.origin?a("el-button",{attrs:{type:"text"}}):a("el-button",{attrs:{disabled:"",type:"text"}},[e._v("删除")]):a("el-button",{staticStyle:{color:"#FF4D4F"},attrs:{type:"text"},on:{click:function(a){return e.del(t.row)}}},[e._v("删除")])]}}])})],2),e.pageShow?a("el-pagination",{staticClass:"paging",attrs:{align:"right","current-page":e.currentPage.sync,"page-sizes":[10,20],"page-size":e.pageSize,layout:"total, prev, pager, next, sizes, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}}):e._e()],1)])]),a("issue-pop",{ref:"poplay",on:{newsuccess:e.newsuccess}})],1)},i=[],n=(a("a434"),a("d81d"),a("ac1f"),a("5319"),a("b775")),l=a("ac95"),r=a("b893"),o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:"新建策略",width:"50%",top:"10vh",visible:e.dialogFormVisible,"close-on-click-modal":!1},on:{"update:visible":function(t){e.dialogFormVisible=t},close:e.diaClose}},[a("el-form",{ref:"ruleForm",attrs:{"label-position":e.labelPosition,"label-width":"120px",rules:e.rules,model:e.ruleForm,size:"small"}},[a("div",{staticClass:"itemw"},[a("el-form-item",{staticClass:"zdclass",attrs:{prop:"zdname",label:"终端信息："}},[a("div",{staticClass:"searchDiv"},[a("el-input",{staticClass:"searchinputtab",staticStyle:{width:"40%"},attrs:{placeholder:"搜索IP",clearable:""},model:{value:e.searchTerminalIp,callback:function(t){e.searchTerminalIp=t},expression:"searchTerminalIp"}})],1),a("el-table",{ref:"terminalTable",staticClass:"tableStyle",attrs:{data:e.filterData,size:"mini","header-cell-style":{"background-color":"#F0F2F5",padding:"0px"},"cell-style":{color:"rgba(0, 0, 0, 0.9)"},height:"200px","max-height":"200px",fit:!0},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"50",align:"center"}}),a("el-table-column",{attrs:{type:"index",label:"序号",width:"50px"}}),a("el-table-column",{attrs:{prop:"name",label:"终端名称"}}),a("el-table-column",{attrs:{prop:"ip",label:"网络地址"}})],1)],1)],1),a("div",{staticClass:"itemw"},[a("el-form-item",{staticClass:"zdclass",attrs:{prop:"clname",label:"证书信息："}},[a("div",{staticClass:"searchDiv"},[a("el-input",{staticClass:"searchinputtab",staticStyle:{width:"40%"},attrs:{placeholder:"搜索证书名称",clearable:""},model:{value:e.searchSoftwareName,callback:function(t){e.searchSoftwareName=t},expression:"searchSoftwareName"}})],1),a("el-table",{ref:"softwareTable",staticClass:"tableStyle",attrs:{data:e.filterData2,size:"mini","header-cell-style":{"background-color":"#F0F2F5",padding:"0px"},"cell-style":{color:"rgba(0, 0, 0, 0.9)"},"tooltip-effect":"light",height:"200px","max-height":"200px",fit:!0,"row-key":"certi_id"},on:{"selection-change":e.handleSelectionChange1}},[a("el-table-column",{attrs:{type:"selection",width:"50",align:"center"}}),a("el-table-column",{attrs:{type:"index",label:"序号",width:"50px"}}),a("el-table-column",{attrs:{prop:"certi_name",label:"证书名称"}}),a("el-table-column",{attrs:{prop:"orther_name",label:"证书别名"}}),a("el-table-column",{attrs:{prop:"start_time",label:"有效期始"}}),a("el-table-column",{attrs:{prop:"end_time",label:"有效期止"}})],1)],1)],1)]),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{staticClass:"canBtn",attrs:{size:"small"},on:{click:function(t){e.dialogFormVisible=!1}}},[e._v("取 消")]),a("el-button",{staticClass:"sureBtn",attrs:{size:"small",disabled:e.btnvalue1},on:{click:function(t){return e.submitForm("ruleForm")}}},[e._v("确定")])],1)],1)},c=[],d=(a("4de4"),a("caad"),a("2532"),{name:"IssuePop",data:function(){return{dialogFormVisible:!1,btnvalue1:!1,labelPosition:"right",terminalData:[],terminalSelection:[],softwareData:[],softwareSelection:[],nodeId:[],ids:[],searchTerminalIp:"",searchSoftwareName:"",rules:{zdname:[{required:!0,message:"请选择终端",trigger:"change"}],clname:[{required:!0,message:"请选择证书",trigger:"change"}]},ruleForm:{zdname:"",clname:""}}},computed:{filterData:function(){var e=this;return this.terminalData.filter((function(t){return!e.searchTerminalIp||t.ip.toLowerCase().includes(e.searchTerminalIp.toLowerCase())}))},filterData2:function(){var e=this;return this.softwareData.filter((function(t){return!e.searchSoftwareName||t.certi_name.toLowerCase().includes(e.searchSoftwareName.toLowerCase())}))}},methods:{submitForm:function(e){var t=this;0===t.terminalSelection.length&&(t.ruleForm.zdname=""),0===t.softwareSelection.length&&(t.ruleForm.clname=""),t.$refs[e].validate((function(e){if(e){for(var a in t.btnvalue1=!0,t.terminalSelection)t.nodeId.push(t.terminalSelection[a].nodeId);for(var a in t.softwareSelection)t.ids.push(t.softwareSelection[a].certi_id);var s={node_ids:t.nodeId,ids:t.ids};Object(n["a"])({url:"/sys/creatlCertSecondPolicy",method:"post",data:JSON.stringify(s)}).then((function(e){var a=e.data;500===a.status?t.btnvalue1=!1:(t.dialogFormVisible=!1,t.$message({message:"操作成功!",type:"success",showClose:!0}),t.$emit("newsuccess"))}))}else t.btnvalue1=!1}))},diaOpen:function(){var e=this;this.dialogFormVisible=!0,this.ruleForm.zdname="1",this.ruleForm.clname="1",this.btnvalue1=!1,this.searchTerminalIp="",this.searchSoftwareName="",this.nodeId=[],this.ids=[],this.terminalSelection=[],this.softwareSelection=[],Object(n["a"])({url:"/LNodeList",method:"post",data:{condition:"",firstTime:"",lastTime:"",orderBy:"installer_time desc",online_status:1,searchPage:"1",searchSize:"10000"}}).then((function(t){var a=t.data;e.terminalData=a.list.filter((function(e){return 1==e.onlineStatus}))})),Object(n["a"])({url:"/sys/LCertSecondList",method:"post",data:{condition:"",orderBy:"",firstTime:"",lastTime:"",searchPage:"1",searchSize:"10000"}}).then((function(t){var a=t.data;a.list&&(a.list.map((function(e,t){e.start_time=Object(l["a"])(e.start_time),e.end_time=Object(l["a"])(e.end_time)})),e.softwareData=a.list)})),this.$nextTick((function(){e.$refs.terminalTable.clearSelection(),e.$refs.softwareTable.clearSelection(),e.$refs.ruleForm.resetFields()}))},diaClose:function(){this.dialogFormVisible=!1},handleSelectionChange:function(e){var t=this;e&&(t.terminalSelection=e,t.ruleForm.zdname="1",t.btnvalue1=!1)},handleSelectionChange1:function(e){var t=this;e&&(t.softwareSelection=e,t.ruleForm.clname="1",t.btnvalue1=!1)}}}),u=d,m=(a("c7c7"),a("2877")),h=Object(m["a"])(u,o,c,!1,null,"42dca7c9",null),p=h.exports,f={name:"CertificateIssue",components:{IssuePop:p},data:function(){return{loading:!1,labelPosition:"right",formInline:{terminalName:"",startDate:"",endDate:""},orderBy:"create_time desc",advancedSearch:!0,advancedFlag:!1,emptytxt:"",emptytxt1:"",softwareData:[],currentPage:1,total:0,pageSize:10,pageShow:!0,expands:[],expandData:[],currentPage1:1,total1:1,pageSize1:5,certi_id:"",certi_name:[],aliasname:[]}},created:function(){Object(r["b"])(this.searchData)},mounted:function(){this.loadData()},beforeDestroy:function(){document.onkeydown=null},methods:{loadData:function(){var e=this;this.loading=!0,Object(n["a"])({url:"/sys/LCertSecondPolicyList",method:"post",data:{condition:this.formInline.terminalName,firstTime:this.formInline.startDate,lastTime:this.formInline.endDate,orderBy:this.orderBy,searchPage:this.currentPage,searchSize:this.pageSize}}).then((function(t){var a=t.data;e.loading=!1,e.certi_name.splice(0,e.certi_name.length),a.list&&(a.list.map((function(t,a){t.create_time=Object(l["a"])(t.create_time),t.start_time=Object(l["a"])(t.start_time),t.end_time=Object(l["a"])(t.end_time),e.certi_name.push(t.certi_name)})),e.softwareData=a.list,e.total=a.total),0==a.total?e.emptytxt=!0:e.emptytxt=!1}))},statusVal:function(e){var t=this.$createElement,a="";if(0==e.status)a=t("span",{class:"wathet"},["下发中"]);else if(1==e.status)a=t("span",{class:"green"},["下发成功"]);else if(2==e.status){var s=Object(r["a"])(e.policy_res);a=s?t("span",{class:"red"},["下发失败（",s,"）"]):e.policy_res?t("span",{class:"red"},["下发失败（错误码：",e.policy_res,"）"]):t("span",{class:"red"},["下发失败"])}else if(3==e.status)a=t("span",{class:"wathet"},["停用中"]);else if(4==e.status)a=t("span",{class:"green"},["已停用"]);else if(5==e.status){s=Object(r["a"])(e.policy_res);a=s?t("span",{class:"red"},["停用失败（",s,"）"]):e.policy_res?t("span",{class:"red"},["停用失败（错误码：",e.policy_res,"）"]):t("span",{class:"red"},["停用失败"])}else a=t("span",{class:"grey"},["初始化状态"]);return a},switchBtn:function(){this.advancedSearch=!this.advancedSearch,this.advancedFlag=!this.advancedFlag},indexMethod:function(e){return 1===this.currentPage?e<9?"0"+(e+1):e+1:e+1+this.pageSize*(this.currentPage-1)},indexMethod2:function(e){return 1===this.currentPage1?e<9?"0"+(e+1):e+1:e+1+this.pageSize1*(this.currentPage1-1)},sortChange:function(e,t,a){a=e.prop.replace(/([A-Z])/g,"_$1").toLowerCase();"ascending"==e.order?this.orderBy=a:this.orderBy=a+" desc",this.loadData()},searchData:function(){var e=this;this.currentPage=1,this.loadData(),this.pageShow=!1,this.$nextTick((function(){e.pageShow=!0}))},uploadDialog:function(){this.$refs.poplay.diaOpen(this.certi_name,this.aliasname)},handleSizeChange:function(e){var t=this;this.currentPage=1,this.pageSize=e,this.pageShow=!1,this.$nextTick((function(){t.pageShow=!0})),this.loadData()},handleCurrentChange:function(e){this.currentPage=e,this.loadData()},newsuccess:function(){var e=this,t=0;e.autorefresh=setInterval((function(){t++,e.loadData(),t>5&&clearInterval(e.autorefresh)}),1e3)},startUsing:function(e){var t=this,a=this;this.$confirm("此操作将启用该进程，是否继续？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){Object(n["a"])({url:"/sys/enableLCertSecondPolicy?id="+e.id,method:"post"}).then((function(e){var s=e.data;0==s.status&&(a.newsuccess(),t.$message({showClose:!0,message:"操作成功",type:"success"}))}))})).catch((function(e){}))},stopUsing:function(e){var t=this,a=this;this.$confirm("此操作将停用该进程，是否继续？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){Object(n["a"])({url:"/sys/disableLCertSecondPolicy?id="+e.id,method:"post"}).then((function(e){var s=e.data;0==s.status&&(a.newsuccess(),t.$message({showClose:!0,message:"操作成功",type:"success"}))}))})).catch((function(e){}))},del:function(e){var t=this,a=this;this.$confirm("此操作将永久删除该数据，是否继续？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){Object(n["a"])({url:"/sys/deleteLCertSecondPolicy?id="+e.id,method:"post"}).then((function(e){var s=e.data;0==s.status&&(a.newsuccess(),t.$message({showClose:!0,message:"删除成功",type:"success"}))}))})).catch((function(e){}))},resetForm:function(){this.formInline.endDate="",this.formInline=Object.assign({},void 0),this.$refs.formInline.resetFields()}},destroyed:function(){clearInterval(this.autorefresh)}},b=f,g=(a("7942"),Object(m["a"])(b,s,i,!1,null,"32d7cda4",null));t["default"]=g.exports},"5a34":function(e,t,a){var s=a("44e7");e.exports=function(e){if(s(e))throw TypeError("The method doesn't accept regular expressions");return e}},7942:function(e,t,a){"use strict";a("28f2")},ab13:function(e,t,a){var s=a("b622"),i=s("match");e.exports=function(e){var t=/./;try{"/./"[e](t)}catch(a){try{return t[i]=!1,"/./"[e](t)}catch(s){}}return!1}},c7c7:function(e,t,a){"use strict";a("440d")}}]);
//# sourceMappingURL=chunk-06950ac0.d2dc3fe7.js.map