(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-197f0e4d"],{4406:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAByElEQVQ4jX3US2sTURQH8N80rQRF0p0LQVDcKBFX6kJn41trEAUX0rUYQYjgxo/gxkfARfQziFRqdaNSHPEFbiTUhYp04UZEqFRIEI3cZCpj6M0f7sycew7/8x4xdOrVtZ16NYkaDOE/w069WsUVHMQG/MJr3Ci32vdGEY0NyZcwnZMETGAfrgahmYlGOD4kH43YPczfM83MK9xtpD40MyVswoF/Hjr16g68ixAduj3dfotvhSx+56UJ8nwxtSMRkmVkODxUilJBnisqguEztHAdT/AHj8utdhfHI476qRdrdLrcai8XtZ16dWsofDPrez4WIVlspBYGRLNLpTJ7TEmxHd/xtMyMWuVjc9pGrIkQPVDo2k1cHDI4jxfY20h9aWY24wx2YV2IJKQdCl0kOhHx1g6PXuZcaHmSukP/yO/Hk7TfPYnZpW1YiBCd7E1WQlRf0c0j/JSnuQU/knQQxPiIInbzzp3K56WM/flZweWVj7ERbZ1Xq/zEVEQf8KhIdB878wKuzxc2LOhcb7ACYb5Ww2KSer+iiP8mZpfGepOV3XgZsWglqQvFiFZHrRKm+g3O4nm+W+HuM27h2oiU4+hlJsJZ1QJ/AbUacHd8375/AAAAAElFTkSuQmCC"},c0c9:function(e,t,a){},d370b:function(e,t,a){"use strict";a("c0c9")},d521:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAB8klEQVQ4jZXTP2gTcRTA8a+vZ6uN6aBVDBpKmiCCf4qGCBUNFQpKJnHRgn/QQbAKWkUXZ4d2EwQ3xS5OWrtoF0EQHCI0g1mEC6FZWmxE0qa/NE3vfnKhV870EtsHb7h7v9/n3e/4PVqFCEdF+CrCsggZERItNzQLEbIiaE/+EiGwVcTo6ztmh8MH9MBAUg8NXXHBQb/1RgtrV/JschtSIxaNYFntTE19olQqHdwqtLI7kOZqahpB+FE4SXW57Lzf43uCZopto1Ln9tpdOy0CHTVOHSljGO1OKdWiuU8H4fjk5IReXXyrV8vvtda2Hh6+4/6n/s0iwXj8hGlZlvZGJpNxoZwIXZuBHo+NjWq/SCTiLvb8f4gRDAYKxWLRFxoff+NCFRH2tYJuOHemWeRyOe8Fvb2+z8e6l0g0n4RQKOR9POwLKZMdhTS6p3tirhm0ODda2W5AWxtcvMD8hgXK5JIy+aJMtDKxn4wMVpRSGw7o1F88I/v9I9PK5IMfNLuG1DP7mZ8PRx78iywV1+trWVMmtxqPprxwbw+Hbl6u1mfCiZmZGR7dT/1u6O+M2N1GyGz8yu6OlwuxWC9ORqMR/syni57yCvAUOO2K9eiMcV6Z7AfOANeB/tIC7/L5/GtgFqhGwvXReAUsAdc6Y3yrbwb+AubOLu3Wc3mcAAAAAElFTkSuQmCC"},f551:function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"main"},[o("div",{staticClass:"container"},[o("div",{staticClass:"topNav"},[o("el-breadcrumb",{staticClass:"breadNav",attrs:{separator:"/"}},[o("el-breadcrumb-item",{staticClass:"crumb1"},[e._v("首页")]),o("el-breadcrumb-item",{staticClass:"crumb1"},[e._v("审计管理")]),o("el-breadcrumb-item",{staticClass:"crumb1"},[e._v("终端审计")]),o("el-breadcrumb-item",{staticClass:"crumb2"},[e._v("网络管理日志")])],1)],1),o("div",{staticClass:"wrap"},[o("div",{staticClass:"search"},[o("el-form",{ref:"formInline",staticClass:"formInline",attrs:{inline:!0,"label-position":"right","label-width":"100px",model:e.formInline,size:"small"},nativeOn:{submit:function(e){e.preventDefault()}}},[o("el-form-item",{attrs:{label:"终端名称：",prop:"terminalName"}},[o("el-input",{attrs:{clearable:"",placeholder:"请输入终端名称",oninput:"value=value.replace(/[%]/g, '')"},model:{value:e.formInline.terminalName,callback:function(t){e.$set(e.formInline,"terminalName",t)},expression:"formInline.terminalName"}})],1),o("el-form-item",{attrs:{label:"网络地址：",prop:"ip"}},[o("el-input",{attrs:{clearable:"",placeholder:"请输入网络地址",oninput:"value=value.replace(/[%]/g, '')"},model:{value:e.formInline.ip,callback:function(t){e.$set(e.formInline,"ip",t)},expression:"formInline.ip"}})],1),o("el-form-item",{directives:[{name:"show",rawName:"v-show",value:1==e.advancedSearch,expression:"advancedSearch==true"}],attrs:{label:"系统类型：",prop:"systemType"}},[o("el-select",{attrs:{clearable:"",placeholder:"请选择"},model:{value:e.formInline.systemType,callback:function(t){e.$set(e.formInline,"systemType",t)},expression:"formInline.systemType"}},[o("el-option",{attrs:{label:"所有系统",value:"0"}}),o("el-option",{attrs:{label:"Linux系统",value:"1"}}),o("el-option",{attrs:{label:"Windows系统",value:"2"}})],1)],1),o("el-form-item",{directives:[{name:"show",rawName:"v-show",value:1==e.advancedSearch,expression:"advancedSearch==true"}],attrs:{label:"日期：",prop:"startDate"}},[o("el-date-picker",{attrs:{"value-format":"yyyy-MM-dd",editable:!1,type:"date",placeholder:"选择开始时间"},model:{value:e.formInline.startDate,callback:function(t){e.$set(e.formInline,"startDate",t)},expression:"formInline.startDate"}}),e._v(" "),o("span",{},[e._v("至")]),e._v(" "),o("el-date-picker",{attrs:{"value-format":"yyyy-MM-dd",editable:!1,type:"date",placeholder:"选择结束时间"},model:{value:e.formInline.endDate,callback:function(t){e.$set(e.formInline,"endDate",t)},expression:"formInline.endDate"}})],1),o("el-form-item",{staticClass:"advancedBtn"},[o("el-button",{staticClass:"resetBtn",attrs:{size:"small"},on:{click:e.resetForm}},[e._v("重置")]),o("el-button",{staticClass:"searchBtn",attrs:{size:"small"},on:{click:e.searchData}},[e._v("查询")]),o("el-button",{directives:[{name:"show",rawName:"v-show",value:1==e.advancedFlag,expression:"advancedFlag==true"}],staticClass:"gaoji",attrs:{size:"small"},on:{click:e.switchBtn}},[e._v("展开"),o("i",{staticClass:"el-icon-arrow-down el-icon--right",staticStyle:{"font-weight":"bold"}})]),o("el-button",{directives:[{name:"show",rawName:"v-show",value:0==e.advancedFlag,expression:"advancedFlag==false"}],staticClass:"gaoji",attrs:{size:"small"},on:{click:e.switchBtn}},[e._v("收起"),o("i",{staticClass:"el-icon-arrow-up el-icon--right",staticStyle:{"font-weight":"bold"}})])],1)],1)],1),o("div",{staticClass:"mainContainer"},[o("div",{staticClass:"tableTitle"},[e._v("日志列表")]),o("div",{staticClass:"popBtn"},[o("el-button",{staticClass:"operateBtn",attrs:{size:"small",disabled:0==e.networkLogData.length},on:{click:e.exportData}},[e._v("导出")])],1),o("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"startLogTable",staticStyle:{width:"99.9%","font-size":"14px"},attrs:{data:e.networkLogData,size:"small","tooltip-effect":"light","element-loading-text":"加载中，请稍后","header-cell-style":{height:"48px","background-color":"#F0F2F5",color:"rgba(0, 0, 0, 0.72)",padding:"0px"},"cell-style":{color:"rgba(0, 0, 0, 0.9)"},fit:!0},on:{"sort-change":e.sortChange}},[o("template",{slot:"empty"},[o("div",[e._v("暂无数据")])]),o("el-table-column",{attrs:{type:"index",index:e.indexMethod,label:"序号",width:"80px"}}),o("el-table-column",{attrs:{prop:"nodeName",label:"终端名称","min-width":"80%","show-overflow-tooltip":""}}),o("el-table-column",{attrs:{prop:"nodeIp",label:"网络地址","min-width":"100%"}}),o("el-table-column",{attrs:{prop:"system",label:"系统类型","min-width":"90%","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return["Linux"==t.row.system||"linux"==t.row.system||"Unix"==t.row.system||"unix"==t.row.system?o("span",[o("img",{attrs:{src:a("d521")}}),o("span",{staticStyle:{"padding-left":"10px"}},[e._v(e._s(t.row.system))])]):t.row.system&&t.row.system.indexOf("win")?o("span",[o("img",{attrs:{src:a("4406")}}),e._v(" "),o("span",[e._v(e._s(t.row.system))])]):e._e()]}}])}),o("el-table-column",{attrs:{prop:"srcip",label:"源IP","show-overflow-tooltip":""}}),o("el-table-column",{attrs:{prop:"destip",label:"目标IP"}}),o("el-table-column",{attrs:{prop:"srcport",label:"源端口"}}),o("el-table-column",{attrs:{prop:"destport",label:"目标端口"}}),o("el-table-column",{attrs:{prop:"protocol",label:"协议"},scopedSlots:e._u([{key:"default",fn:function(t){return["0"==t.row.protocol?o("span",[e._v("IP")]):"1"==t.row.protocol?o("span",[e._v("ICMP")]):"2"==t.row.protocol?o("span",[e._v("IGMP")]):"4"==t.row.protocol?o("span",[e._v("IPIP")]):"6"==t.row.protocol?o("span",[e._v("TCP")]):"8"==t.row.protocol?o("span",[e._v("EGP")]):"12"==t.row.protocol?o("span",[e._v("PUP")]):"17"==t.row.protocol?o("span",[e._v("UDP")]):"22"==t.row.protocol?o("span",[e._v("IDP")]):"29"==t.row.protocol?o("span",[e._v("TP")]):"33"==t.row.protocol?o("span",[e._v("DCCP")]):"41"==t.row.protocol?o("span",[e._v("IPV6")]):"46"==t.row.protocol?o("span",[e._v("RSVP")]):"47"==t.row.protocol?o("span",[e._v("GRE")]):"50"==t.row.protocol?o("span",[e._v("ESP")]):"51"==t.row.protocol?o("span",[e._v("AH")]):"92"==t.row.protocol?o("span",[e._v("MTP")]):"94"==t.row.protocol?o("span",[e._v("BEETPH")]):"98"==t.row.protocol?o("span",[e._v("ENCAP")]):"103"==t.row.protocol?o("span",[e._v("PIM")]):"108"==t.row.protocol?o("span",[e._v("COMP")]):"132"==t.row.protocol?o("span",[e._v("SCTP")]):"136"==t.row.protocol?o("span",[e._v("UDPLITE")]):"137"==t.row.protocol?o("span",[e._v("MPLS")]):"255"==t.row.protocol?o("span",[e._v("RAW")]):o("span",[e._v("其他")])]}}])}),o("el-table-column",{attrs:{prop:"actionType",label:"动作","min-width":"80%"},scopedSlots:e._u([{key:"default",fn:function(t){return["1"==t.row.actionType?o("span",[e._v("禁止")]):"2"==t.row.actionType?o("span",[e._v("允许")]):o("span",[e._v("未知")])]}}])}),o("el-table-column",{attrs:{prop:"direction",label:"方向"},scopedSlots:e._u([{key:"default",fn:function(t){return["1"==t.row.direction?o("span",[e._v("出")]):"0"==t.row.direction?o("span",[e._v("入")]):e._e()]}}])}),o("el-table-column",{attrs:{prop:"time",label:"时间",sortable:"custom","min-width":"80%","show-overflow-tooltip":""}})],2),e.pageShow?o("el-pagination",{staticClass:"paging",attrs:{align:"right","current-page":e.currentPage.sync,"page-sizes":[10,20],"page-size":e.pageSize,layout:"total, prev, pager, next, sizes, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}}):e._e()],1)])])])},n=[],r=(a("d81d"),a("ac1f"),a("1276"),a("d3b7"),a("3ca3"),a("ddb0"),a("2b3d"),a("b775")),l=a("ac95"),s=a("b893"),i={name:"StartMeasureLog",data:function(){return{loading:!1,formInline:{terminalName:"",ip:"",startDate:"",endDate:"",systemType:""},orderBy:"time desc",advancedSearch:!0,advancedFlag:!1,emptytxt:"",networkLogData:[],currentPage:1,total:0,pageSize:10,pageShow:!0}},created:function(){Object(s["b"])(this.searchData)},mounted:function(){this.loadData()},beforeDestroy:function(){document.onkeydown=null},methods:{loadData:function(){var e=this;this.loading=!0,Object(r["a"])({url:"/aud/log/networkLog",method:"post",data:{name:this.formInline.terminalName,ip:this.formInline.ip,firstTime:this.formInline.startDate,lastTime:this.formInline.endDate,system_type:this.formInline.systemType,orderBy:this.orderBy,searchPage:this.currentPage,searchSize:this.pageSize}}).then((function(t){var a=t.data;e.loading=!1,a.list&&(a.list.map((function(e,t){e.expire_time=Object(l["a"])(e.expire_time),e.time=Object(l["a"])(e.time)})),e.networkLogData=a.list),e.total=a.total,0==a.total?e.emptytxt=!0:e.emptytxt=!1}))},switchBtn:function(){this.advancedSearch=!this.advancedSearch,this.advancedFlag=!this.advancedFlag},indexMethod:function(e){return 1===this.currentPage?e<9?"0"+(e+1):e+1:e+1+this.pageSize*(this.currentPage-1)},sortChange:function(e,t,a){"ascending"==e.order?this.orderBy=e.prop:this.orderBy=e.prop+" desc",this.loadData()},searchData:function(){var e=this;this.currentPage=1,this.loadData(),this.pageShow=!1,this.$nextTick((function(){e.pageShow=!0}))},ab2str:function(e,t){var a=new Blob([e]),o=new FileReader;o.readAsText(a,"utf-8"),o.onload=function(){t&&t.call(null,o.result)}},exportData:function(){var e=this,t=this;t.$message.closeAll(),this.$confirm("确定导出此数据？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){var a=new FormData;a.append("name",e.formInline.terminalName),a.append("ip",e.formInline.ip),a.append("firstTime",e.formInline.startDate),a.append("lastTime",e.formInline.endDate),a.append("system_type",e.formInline.systemType),a.append("orderBy",e.orderBy),a.append("searchPage",1),a.append("searchSize",e.total),Object(r["a"])({url:"/aud/downloadNetwork",method:"post",responseType:"blob",data:a}).then((function(e){var a=e.data;t.ab2str(a,(function(o){if(o.indexOf("status")>-1){var n=JSON.parse(o);t.$message({message:n.errormessage,type:"error",showClose:!0})}else{var r=e.headers["content-disposition"].split("filename=")[1].split(";")[0],l=decodeURIComponent(r),s=new Blob([a],{type:"application/vnd.ms-excel"});if("download"in document.createElement("a")){var i=document.createElement("a");i.style.display="none",i.href=URL.createObjectURL(s),i.setAttribute("download",l),document.body.appendChild(i),i.click(),URL.revokeObjectURL(i.href),document.body.removeChild(i)}}}))}))})).catch((function(e){}))},handleSizeChange:function(e){var t=this;this.currentPage=1,this.pageSize=e,this.pageShow=!1,this.$nextTick((function(){t.pageShow=!0})),this.loadData()},handleCurrentChange:function(e){this.currentPage=e,this.loadData()},resetForm:function(){this.formInline=Object.assign({},void 0),this.$refs.formInline.resetFields(),this.$set(this,"formInline",this.formInline)}}},c=i,p=(a("d370b"),a("2877")),d=Object(p["a"])(c,o,n,!1,null,"11bc5ebe",null);t["default"]=d.exports}}]);
//# sourceMappingURL=chunk-197f0e4d.7b8bdbb1.js.map