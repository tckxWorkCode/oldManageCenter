(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-37ec7dbc"],{"235b":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABKUlEQVQ4jeXUvyvFYRTH8dfFKBa/JoMsDBZRJuVXURSLLDaZbmZ/wC3KZFCyKIOsTFyERV2bxSKDSbKQGX3r+d6+vrnupbvIqTM8z/M57845z3meTDa3VquKVlNNmD8BrCtz3o8RdCCDAjZ/AxzFKnpwh5uw3/7TDOuxjnnsYxFX5SBJS/awBWeYxDRmKoD14hzN8UYMbEIeDRjAQQnAEsYS62e04TgwisDdUO4Qbr/JaBwLiXWkHQ6xe34xh2X1sWAOrzhBZ0qTw1HwqIKtxFmkPQ2xs0ngUxiVBzSmgBehV5FPBLBweZd4CX2NGJ/G5hGDX1RxGDy2PixjCjvIhgylgaVsBV14R3d4NdfhgvLpmEqA92jFG7bDiBRKiSsBblSgKdp/+w/xAZXoNAXt/9XhAAAAAElFTkSuQmCC"},"2e74":function(t,e,a){},3659:function(t,e,a){},4406:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAByElEQVQ4jX3US2sTURQH8N80rQRF0p0LQVDcKBFX6kJn41trEAUX0rUYQYjgxo/gxkfARfQziFRqdaNSHPEFbiTUhYp04UZEqFRIEI3cZCpj6M0f7sycew7/8x4xdOrVtZ16NYkaDOE/w069WsUVHMQG/MJr3Ci32vdGEY0NyZcwnZMETGAfrgahmYlGOD4kH43YPczfM83MK9xtpD40MyVswoF/Hjr16g68ixAduj3dfotvhSx+56UJ8nwxtSMRkmVkODxUilJBnisqguEztHAdT/AHj8utdhfHI476qRdrdLrcai8XtZ16dWsofDPrez4WIVlspBYGRLNLpTJ7TEmxHd/xtMyMWuVjc9pGrIkQPVDo2k1cHDI4jxfY20h9aWY24wx2YV2IJKQdCl0kOhHx1g6PXuZcaHmSukP/yO/Hk7TfPYnZpW1YiBCd7E1WQlRf0c0j/JSnuQU/knQQxPiIInbzzp3K56WM/flZweWVj7ERbZ1Xq/zEVEQf8KhIdB878wKuzxc2LOhcb7ACYb5Ww2KSer+iiP8mZpfGepOV3XgZsWglqQvFiFZHrRKm+g3O4nm+W+HuM27h2oiU4+hlJsJZ1QJ/AbUacHd8375/AAAAAElFTkSuQmCC"},"49a6":function(t,e,a){"use strict";a("2e74")},"897c":function(t,e,a){"use strict";a("3659")},"8a2e":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"main"},[s("div",{staticClass:"container"},[s("div",{staticClass:"topNav"},[s("el-breadcrumb",{staticClass:"breadNav",attrs:{separator:"/"}},[s("el-breadcrumb-item",{staticClass:"crumb1"},[t._v("首页")]),s("el-breadcrumb-item",{staticClass:"crumb1"},[t._v("平台管理")]),s("el-breadcrumb-item",{staticClass:"crumb2"},[t._v("密码管理")])],1)],1),s("div",{staticClass:"wrap"},[s("div",{staticClass:"search"},[s("el-form",{ref:"formInline",staticClass:"formInline",attrs:{inline:!0,"label-position":"right","label-width":"145px",model:t.formInline,size:"small"},nativeOn:{submit:function(t){t.preventDefault()}}},[s("el-form-item",{attrs:{label:"终端名称/网络地址：",prop:"terminalName"}},[s("el-input",{attrs:{clearable:"",placeholder:"请输入终端名称/网络地址",oninput:"value=value.replace(/[%]/g, '')"},model:{value:t.formInline.terminalName,callback:function(e){t.$set(t.formInline,"terminalName",e)},expression:"formInline.terminalName"}})],1),s("el-form-item",{directives:[{name:"show",rawName:"v-show",value:1==t.advancedSearch,expression:"advancedSearch==true"}],attrs:{label:"日期：",prop:"startDate"}},[s("el-date-picker",{attrs:{"value-format":"yyyy-MM-dd",editable:!1,type:"date",placeholder:"选择开始时间"},model:{value:t.formInline.startDate,callback:function(e){t.$set(t.formInline,"startDate",e)},expression:"formInline.startDate"}}),t._v(" "),s("span",{},[t._v("至")]),t._v(" "),s("el-date-picker",{attrs:{"value-format":"yyyy-MM-dd",editable:!1,type:"date",placeholder:"选择结束时间"},model:{value:t.formInline.endDate,callback:function(e){t.$set(t.formInline,"endDate",e)},expression:"formInline.endDate"}})],1),s("el-form-item",{staticClass:"advancedBtn"},[s("el-button",{staticClass:"resetBtn",attrs:{size:"small"},on:{click:t.resetForm}},[t._v("重置")]),s("el-button",{staticClass:"searchBtn",attrs:{size:"small"},on:{click:t.searchData}},[t._v("查询")]),s("el-button",{directives:[{name:"show",rawName:"v-show",value:1==t.advancedFlag,expression:"advancedFlag==true"}],staticClass:"gaoji",attrs:{size:"small"},on:{click:t.switchBtn}},[t._v("展开"),s("i",{staticClass:"el-icon-arrow-down el-icon--right",staticStyle:{"font-weight":"bold"}})]),s("el-button",{directives:[{name:"show",rawName:"v-show",value:0==t.advancedFlag,expression:"advancedFlag==false"}],staticClass:"gaoji",attrs:{size:"small"},on:{click:t.switchBtn}},[t._v("收起"),s("i",{staticClass:"el-icon-arrow-up el-icon--right",staticStyle:{"font-weight":"bold"}})])],1)],1)],1),s("div",{staticClass:"mainContainer"},[s("div",{staticClass:"tableTitle"},[t._v("密码管理")]),s("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"strategyTable",staticStyle:{width:"99.9%","font-size":"14px"},attrs:{data:t.strategyData,size:"small","tooltip-effect":"light","element-loading-text":"加载中，请稍后","header-cell-style":{height:"48px","background-color":"#F0F2F5",color:"rgba(0, 0, 0, 0.72)",padding:"0px"},"cell-style":{padding:"0px",color:"rgba(0, 0, 0, 0.9)"},fit:!0,"row-class-name":t.tableRowClassName,"row-style":t.selectedstyle},on:{"sort-change":t.sortChange,"row-click":t.rowClick}},[s("template",{slot:"empty"},[s("div",[t._v("暂无数据")])]),s("el-table-column",{attrs:{type:"index",index:t.indexMethod,label:"序号",width:"50px"}}),s("el-table-column",{attrs:{prop:"name",label:"终端名称","min-width":"100%","show-overflow-tooltip":""}}),s("el-table-column",{attrs:{prop:"ip",label:"网络地址"}}),s("el-table-column",{attrs:{prop:"onlineStatus",label:"终端状态"},scopedSlots:t._u([{key:"default",fn:function(e){return["1"==e.row.onlineStatus?s("span",[s("span",{staticClass:"aqua"},[t._v("●")]),t._v("在线")]):"0"==e.row.onlineStatus?s("span",[s("span",{staticClass:"lightRed"},[t._v("●")]),t._v("离线")]):t._e()]}}])}),s("el-table-column",{attrs:{prop:"system",label:"操作系统"},scopedSlots:t._u([{key:"default",fn:function(e){return["Linux"==e.row.system||"linux"==e.row.system?s("span",[s("img",{attrs:{src:a("d521")}}),s("span",{staticStyle:{"padding-left":"10px"}},[t._v(t._s(e.row.system))])]):e.row.system.indexOf("win")?s("span",[s("img",{attrs:{src:a("4406")}}),s("span",[t._v(t._s(e.row.system))])]):t._e()]}}])}),s("el-table-column",{attrs:{prop:"arch",label:"体系架构"}}),s("el-table-column",{attrs:{prop:"tcmStatus",label:"密码修改状态",formatter:t.statusVal}}),s("el-table-column",{attrs:{prop:"tcmDate","show-overflow-tooltip":"","min-width":"90%",label:"创建时间",sortable:"custom"}}),s("el-table-column",{attrs:{label:"操作",width:"80px"},scopedSlots:t._u([{key:"default",fn:function(e){return[0==e.row.onlineStatus?s("el-button",{staticStyle:{color:"#D9D9D9"},attrs:{type:"text"},on:{click:function(a){return t.openConfig(e.row)}}},[t._v("配置")]):s("el-button",{staticStyle:{color:"#1ac492"},attrs:{type:"text"},on:{click:function(a){return t.openConfig(e.row)}}},[t._v("配置")])]}}])})],2),t.pageShow?s("el-pagination",{staticClass:"paging",attrs:{align:"right","current-page":t.currentPage.sync,"page-sizes":[10,20],"page-size":t.pageSize,layout:"total, prev, pager, next, sizes, jumper",total:t.total},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}}):t._e()],1)])]),s("edit-password",{ref:"poplay",on:{editSuccess:t.initData}})],1)},r=[],l=(a("d81d"),a("ac1f"),a("5319"),a("b775")),i=a("ac95"),o=a("b893"),n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("el-dialog",{staticClass:"dialogw2",attrs:{title:"重置TCM密码",width:"28%",visible:t.dialogFormVisible,"close-on-click-modal":!1},on:{"update:visible":function(e){t.dialogFormVisible=e},close:t.diaClose}},[s("el-form",{ref:"ruleForm",attrs:{"label-position":t.labelPosition,"label-width":"100px",rules:t.rules,model:t.ruleForm,size:"small"}},[s("el-form-item",{staticClass:"uploadItem",attrs:{prop:"oldPassword",label:"原密码："}},[s("el-input",{staticStyle:{width:"90%"},attrs:{id:"old_password",clearable:"",placeholder:"请输入原密码",type:t.password0},model:{value:t.ruleForm.oldPassword,callback:function(e){t.$set(t.ruleForm,"oldPassword",e)},expression:"ruleForm.oldPassword"}},["password"==this.password0?s("i",{attrs:{slot:"suffix"},on:{click:t.pwex0},slot:"suffix"},[s("img",{staticStyle:{"vertical-align":"middle"},attrs:{src:a("a498")}})]):t._e(),"text"==this.password0?s("i",{attrs:{slot:"suffix"},on:{click:t.pwex0},slot:"suffix"},[s("img",{staticStyle:{"vertical-align":"middle"},attrs:{src:a("235b")}})]):t._e()])],1),s("el-form-item",{staticClass:"uploadItem",attrs:{prop:"newPassword",label:"新密码："}},[s("el-input",{staticStyle:{width:"90%"},attrs:{id:"new_password",clearable:"",placeholder:"请输入包含数字、字母、特殊符号8至16位的新密码",type:t.password1},model:{value:t.ruleForm.newPassword,callback:function(e){t.$set(t.ruleForm,"newPassword",e)},expression:"ruleForm.newPassword"}},["password"==this.password1?s("i",{attrs:{slot:"suffix"},on:{click:t.pwex1},slot:"suffix"},[s("img",{staticStyle:{"vertical-align":"middle"},attrs:{src:a("a498")}})]):t._e(),"text"==this.password1?s("i",{attrs:{slot:"suffix"},on:{click:t.pwex1},slot:"suffix"},[s("img",{staticStyle:{"vertical-align":"middle"},attrs:{src:a("235b")}})]):t._e()])],1),s("el-form-item",{staticClass:"uploadItem",attrs:{prop:"password2",label:"确认密码："}},[s("el-input",{staticStyle:{width:"90%"},attrs:{id:"confirm_password",clearable:"",placeholder:"请输入确认密码",type:t.password2},model:{value:t.ruleForm.password2,callback:function(e){t.$set(t.ruleForm,"password2",e)},expression:"ruleForm.password2"}},["password"==this.password2?s("i",{attrs:{slot:"suffix"},on:{click:t.pwex2},slot:"suffix"},[s("img",{staticStyle:{"vertical-align":"middle"},attrs:{src:a("a498")}})]):t._e(),"text"==this.password2?s("i",{attrs:{slot:"suffix"},on:{click:t.pwex2},slot:"suffix"},[s("img",{staticStyle:{"vertical-align":"middle"},attrs:{src:a("235b")}})]):t._e()])],1)],1),s("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[s("el-row",[s("el-col",{attrs:{span:16}},[s("div",{staticClass:"tipText"},[t._v("此密码应用于密钥树迁入迁出、可信存储管理")])]),s("el-col",{attrs:{span:8}},[s("el-button",{staticClass:"canBtn",attrs:{size:"small"},on:{click:function(e){t.dialogFormVisible=!1}}},[t._v("取 消")]),s("el-button",{staticClass:"sureBtn",attrs:{size:"small",disabled:t.btnvalue1},on:{click:function(e){return t.submitForm("ruleForm")}}},[t._v("确定")])],1)],1)],1)],1)},d=[],c={name:"editpw",data:function(){var t=this,e=function(e,a,s){t.ruleForm.newPassword!==t.ruleForm.password2?s(new Error("两次输入密码不一致!")):s()},a=function(e,a,s){var r=/^(?![A-Za-z]+$)(?![A-Z0-9]+$)(?![a-z0-9]+$)(?![a-z\W]+$)(?![A-Z\W]+$)(?![0-9\W]+$)[a-zA-Z0-9\W]{8,16}$/;a.length<8||a.length>16?s(new Error("密码长度必须是8到16之间")):t.ruleForm.newPassword==t.ruleForm.oldPassword?s(new Error("新密码和旧密码不能相同!")):r.test(a)?s():s(new Error("密码包含数字、大写字母、小写字母、特殊符号中任意三项"))};return{btnvalue1:!1,dialogFormVisible:!1,labelPosition:"right",password0:"password",password1:"password",password2:"password",rules:{oldPassword:[{required:!0,message:"请输入原密码",trigger:"blur"}],newPassword:[{required:!0,message:"请输入新密码",trigger:"blur"},{trigger:"blur",validator:a}],password2:[{required:!0,validator:e,trigger:"blur"}]},ruleForm:{oldPassword:"",newPassword:"",password2:""},nodeId:""}},methods:{diaOpen:function(t){var e=this;e.dialogFormVisible=!0,e.btnvalue1=!1,e.password0="password",e.password1="password",e.password2="password",e.ruleForm.oldPassword="",e.ruleForm.newPassword="",e.ruleForm.password2="",e.$nextTick((function(){e.$refs.ruleForm.clearValidate()})),e.nodeId=t.nodeId},diaClose:function(){var t=this;t.dialogFormVisible=!1},pwex0:function(){var t=this;"password"===t.password0?t.password0="text":t.password0="password"},pwex1:function(){var t=this;"password"===t.password1?t.password1="text":t.password1="password"},pwex2:function(){var t=this;"password"===t.password2?t.password2="text":t.password2="password"},submitForm:function(t){var e=this;e.$refs[t].validate((function(t){if(!t)return e.btnvalue1=!1,!1;e.btnvalue1=!0,Object(l["a"])({url:"/sys/editTcmPwd",data:{nodeId:e.nodeId,oldTcmPwd:e.ruleForm.oldPassword,tcmPwd:e.ruleForm.newPassword},method:"post"}).then((function(t){var a=t.data;0===a.status?(e.$message({message:"操作成功!",type:"success",showClose:!0}),e.dialogFormVisible=!1,e.$emit("editSuccess")):e.btnvalue1=!1}))}))},resetForm:function(t){var e=this;e.$refs[t].resetFields()}}},u=c,p=(a("49a6"),a("2877")),m=Object(p["a"])(u,n,d,!1,null,null,null),w=m.exports,f={name:"PasswordManage",components:{EditPassword:w},data:function(){return{loading:!1,formInline:{terminalName:"",startDate:"",endDate:""},advancedSearch:!0,advancedFlag:!1,emptytxt:"",strategyData:[],orderBy:"tcm_date desc",currentPage:1,total:0,pageSize:10,pageShow:!0,getIndex:"",autorefresh:""}},created:function(){Object(o["b"])(this.searchData)},mounted:function(){this.loadData()},beforeDestroy:function(){document.onkeydown=null},methods:{loadData:function(){var t=this;this.loading=!0,Object(l["a"])({url:"/sys/tcmPwdList",method:"post",data:{condition:this.formInline.terminalName,firstTime:this.formInline.startDate,lastTime:this.formInline.endDate,orderBy:this.orderBy,system_type:"1",searchPage:this.currentPage,searchSize:this.pageSize}}).then((function(e){var a=e.data;t.loading=!1,a.list&&(a.list.map((function(t,e){t.tcmDate=Object(i["a"])(t.tcmDate)})),t.total=a.total,t.strategyData=a.list),0==a.total?t.emptytxt=!0:t.emptytxt=!1}))},statusVal:function(t){var e=this.$createElement,a="";if(0==t.tcmStatus)a=e("span",{class:"wathet"},["修改中"]);else if(1==t.tcmStatus)a=e("span",{class:"green"},["已修改"]);else if(2==t.tcmStatus){var s=Object(o["a"])(t.tcmRes);a=s?e("span",{class:"red"},["修改失败（",s,"）"]):t.tcmRes?e("span",{class:"red"},["修改失败（错误码：",t.tcmRes,"）"]):e("span",{class:"red"},["修改失败"])}else a=e("span",{class:"grey"},["初始化状态"]);return a},switchBtn:function(){this.advancedSearch=!this.advancedSearch,this.advancedFlag=!this.advancedFlag},searchData:function(){var t=this;this.currentPage=1,this.loadData(),this.pageShow=!1,this.$nextTick((function(){t.pageShow=!0}))},indexMethod:function(t){return 1===this.currentPage?t<9?"0"+(t+1):t+1:t+1+this.pageSize*(this.currentPage-1)},sortChange:function(t,e,a){a=t.prop.replace(/([A-Z])/g,"_$1").toLowerCase();"ascending"==t.order?this.orderBy=a:this.orderBy=a+" desc",this.loadData()},handleSizeChange:function(t){var e=this;this.currentPage=1,this.pageSize=t,this.pageShow=!1,this.$nextTick((function(){e.pageShow=!0})),this.loadData()},handleCurrentChange:function(t){this.currentPage=t,this.loadData()},selectedstyle:function(t){t.row;var e=t.rowIndex;if(this.getIndex===e)return{"background-color":"#C8E2FB"}},tableRowClassName:function(t){var e=t.row,a=t.rowIndex;e.index=a},rowClick:function(t){this.getIndex=t.index},openConfig:function(t){0==t.onlineStatus?this.$message({message:"终端已离线",type:"error",showClose:!0}):this.$refs.poplay.diaOpen(t)},initData:function(){var t=this,e=0;t.autorefresh=setInterval((function(){e++,t.loadData(),e>5&&clearInterval(t.autorefresh)}),2e3)},resetForm:function(){this.formInline.endDate="",this.formInline=Object.assign({},void 0),this.$refs.formInline.resetFields()}},destroyed:function(){clearInterval(this.autorefresh)}},h=f,g=(a("897c"),Object(p["a"])(h,s,r,!1,null,"51742678",null));e["default"]=g.exports},a498:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABVklEQVQ4ja3UIUjdURTH8c+bRpllbiaDWFxYEQcmYdPBBAUtYrEa5GUZ5jccmAyDsTIwiNU1p0PTYDaLRRdMIisOs8qF+x/Xv/e9p/j/tf8993w5v3PP+dfqjdUOFepJlTAVAZfwsSpggDVwURx0tkl4jTH0o4bf+FKCLeNTO+B4vPQKf3AUz/tawXLALqxhHltYwEETm3dgSj18jj1MYhoz94ANYR89ZeAz/MBTjOB7pg0F7FtSWXiMXuxExn/gRrT7BsctYCHWnZyH77cxd7NsuZlSm6ftLhfAOVxiFwOZyk5iJcHB1yQe7v6MubMp8G8clbPEUtqzw9ivCWzHeHi8X/iHd5Fxa2zOMVqC5UZjGB8whXXUY4XKwLLNAraCQVzjZdyaUPH7OBm3VAbmKgsP8QJX0f5OXMGsOtvAgj43S84pHZuwp9l1eojSChcfAypU7R8bN3NBTOrbN/+dAAAAAElFTkSuQmCC"},d521:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAB8klEQVQ4jZXTP2gTcRTA8a+vZ6uN6aBVDBpKmiCCf4qGCBUNFQpKJnHRgn/QQbAKWkUXZ4d2EwQ3xS5OWrtoF0EQHCI0g1mEC6FZWmxE0qa/NE3vfnKhV870EtsHb7h7v9/n3e/4PVqFCEdF+CrCsggZERItNzQLEbIiaE/+EiGwVcTo6ztmh8MH9MBAUg8NXXHBQb/1RgtrV/JschtSIxaNYFntTE19olQqHdwqtLI7kOZqahpB+FE4SXW57Lzf43uCZopto1Ln9tpdOy0CHTVOHSljGO1OKdWiuU8H4fjk5IReXXyrV8vvtda2Hh6+4/6n/s0iwXj8hGlZlvZGJpNxoZwIXZuBHo+NjWq/SCTiLvb8f4gRDAYKxWLRFxoff+NCFRH2tYJuOHemWeRyOe8Fvb2+z8e6l0g0n4RQKOR9POwLKZMdhTS6p3tirhm0ODda2W5AWxtcvMD8hgXK5JIy+aJMtDKxn4wMVpRSGw7o1F88I/v9I9PK5IMfNLuG1DP7mZ8PRx78iywV1+trWVMmtxqPprxwbw+Hbl6u1mfCiZmZGR7dT/1u6O+M2N1GyGz8yu6OlwuxWC9ORqMR/syni57yCvAUOO2K9eiMcV6Z7AfOANeB/tIC7/L5/GtgFqhGwvXReAUsAdc6Y3yrbwb+AubOLu3Wc3mcAAAAAElFTkSuQmCC"}}]);
//# sourceMappingURL=chunk-37ec7dbc.6ac0c540.js.map