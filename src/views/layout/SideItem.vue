<template>
  <div>
    <div class="title">
      <img :src="`${publicPath}inner_logo.png`">
      <div class="titleText">{{title1}}</div>
      <div class="titleText">{{title2}}</div>
    </div>
    <el-menu :default-active="$route.path" active-text-color="#ffffff" @select="selectmenu" :collapse-transition="false"	:unique-opened="true" router  :collapse="isCollapse">
       <!-- 一级菜单 -->
      <template v-for="item in sideItem">
        <el-menu-item class="firstMenu" v-if="item.children.length==1 && item.hidden == false" :key="item.path" :index="item.path">
          <template slot="title">
            <img style="margin-right: 9px;" :src="item.meta.icon" alt=""/>
            <span>{{item.meta.alias}}</span>
          </template>
        </el-menu-item>
        <el-submenu v-else :index="item.path" :key="item.path"> 
        <!-- <el-submenu v-if="item.children && item.children.length!=1" :index="item.path" :key="item.path"> -->
          <template slot="title">
    		  	<img style="margin-right: 9px;" :src="item.meta.icon" alt=""/>
    		  	<span>{{item.meta.alias}}</span>
    		  </template>
          <!-- 二级菜单 -->
          <template v-for="itemChild in item.children">
            <el-submenu class="secondMenu" v-if="itemChild.children && itemChild.children.length" :index="itemChild.path" :key="itemChild.path">
              <template slot="title">
                <span>{{itemChild.meta.title1}}</span>
              </template>
              <!-- 三级菜单 -->
              <el-menu-item v-for="itemChild_Child in itemChild.children" :index="itemChild.path+'/'+itemChild_Child.path" :key="itemChild_Child.path">
                <span slot="title">{{itemChild_Child.meta.title2}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-if="!itemChild.children || itemChild.children.length==0" :key="itemChild.path" :index="itemChild.path">
              <template slot="title">
                <span>{{itemChild.meta.title1}}</span>
              </template>
            </el-menu-item>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
 
<script>
export default {
  name: 'SideItem',
  inject: ['reload'],
  data () {
    return {
      publicPath:process.env.BASE_URL,
      userType:'',
      title1:'',
      title2:'',
      openeds:[],
      topNav: "",
      isCollapse: false,
      menuclass: 'menuclass1',
      expandmenu: ['1'],
      firstsubmenu: true,
      firstsubmenuasy: true,
      routers:[],
      sideItem:[],
      asideItem:[],
      activePath:'',
      isSec:true
    }
  },
  created: function() {
    this.title1 = loginTitle
    this.title2 = loginTitle2
  },
  mounted: function () {
    var that = this
    this.routers = this.$router.options.routes
    this.userType = localStorage.getItem("userType")
    for (var i=0;i<this.routers.length;i++) {
      if(this.routers[i].meta) {
        if(this.routers[i].meta.roles.indexOf(that.userType) >-1) {
          that.sideItem.push(this.routers[i])
        }
      }
    }
    
    // console.log(that.sideItem)
    if (fileControl == false ) { //文件访问控制
      that.sideItem.map (function(value,i) {
        if (value.meta.alias == "策略管理") {
          value.children.map(function(val,index ) {
            if (val.meta.title1 == "文件访问控制") {
              value.children.splice(index,1)
            }
          })
        }
      })
      for (var i=0;i<that.sideItem.length;i++) {
        if(that.sideItem[i].meta.alias== "审计管理") {
          that.sideItem[i].children.map(function(value,index ) {
            if (value.meta.title1 == "终端审计") {
              value.children.map(function(val,ind) {
                if (val.meta.title2 =="文件访问控制日志") {
                  value.children.splice(ind,1)
                }
              })
            }
          })
        }
      }
    }
    if (peripheralControl == false ) { //外设控制
      that.sideItem.map (function(value,i) {
        if (value.meta.alias == "策略管理") {
          value.children.map(function(val,index ) {
            if (val.meta.title1 == "外设控制") {
              value.children.splice(index,1)
            }
          })
        }
      })
      for (var i=0;i<that.sideItem.length;i++) {
        if(that.sideItem[i].meta.alias== "审计管理") {
          that.sideItem[i].children.map(function(value,index ) {
            if (value.meta.title1 == "终端审计") {
              value.children.map(function(val,ind) {
                if (val.meta.title2 =="外设控制日志") {
                  value.children.splice(ind,1)
                }
              })
            }
          })
        }
      }
    }
    if (trustConnection == false ) { //可信连接
      that.sideItem.map (function(value,i) {
        if (value.meta.alias == "可信连接") {
          that.sideItem.splice(i,1)
        }
      })
      for (var i=0;i<that.sideItem.length;i++) {
        if(that.sideItem[i].meta.alias== "审计管理") {
          that.sideItem[i].children.map(function(value,index ) {
            if (value.meta.title1 == "终端审计") {
              value.children.map(function(val,ind) {
                if (val.meta.title2 =="可信连接日志") {
                  value.children.splice(ind,1)
                }
              })
            }
          })
        }
      }
    }
    if (networkControl == false ) { //网络控制
      that.sideItem.map (function(value,i) {
        if (value.meta.alias == "策略管理") {
          value.children.map(function(val,index ) {
            if (val.meta.title1 == "网络管理") {
              value.children.splice(index,1)
            }
          })
        }
      })
      for (var i=0;i<that.sideItem.length;i++) {
        if(that.sideItem[i].meta.alias== "审计管理") {
          that.sideItem[i].children.map(function(value,index ) {
            if (value.meta.title1 == "终端审计") {
              value.children.map(function(val,ind) {
                if (val.meta.title2 =="网络管理日志") {
                  value.children.splice(ind,1)
                }
              })
            }
          })
        }
      }
    }
    if (this.userType == "system") {
      that.sideItem[0].children.splice(1,1)
    }
    //  else {
      if (location.href.indexOf("#re") == -1) {
        location.href = location.href + "#re"
        location.reload()
      }
    // } 
    this.addView()
    // this.reload()
  },
  methods: {
    selectmenu (index) {
      // console.log(index)
      if (index === this.$route.path) {
        this.reload()
      }
    },
    generateRoute () {
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    addView () {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
    },
  },
}
</script>

<style scoped>
.title { /* 标题 */
  text-align: center;
  margin-top: 10px;
}
.logo {
  margin-top: 16px;
}
.titleText {/* 标题文字 */
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 8px;
}
a{ 
  text-decoration:none
}
.el-menu{
  border-right:none;
  background-color: #001529!important;
}
.el-submenu {
  background-color: #001529!important
}
.menuitem .el-submenu__title {
  font-size: 14px;
  color:rgba(255,255,255,0.65)!important
}
.secondMenu {
  background-color: #000!important;
}
.el-submenu__title:hover *{
  color:#fff!important;
}
.el-menu-item:hover{
  color:#fff!important;
}
.menuitem .el-submenu__title *{
  text-align: left !important;
  color:#ffffff!important;
}
.el-menu-item:focus, .el-menu-item:hover{
  background-color: #1ac492!important;
}
.el-menu-item{
  text-align: left;
  height: 40px!important;
  line-height: 40px!important;
  margin: 8px 0px;
  color:rgba(255,255,255,0.65)!important;
}
.el-menu-item.is-active{
  color: #ffffff!important;
  background-color: #1ac492!important;
}
</style>
<style>
.aside {
  background-color: #001529!important;
}
.el-menu-item-group__title {
  padding: 0 !important;
}
.el-menu {/**菜单展开的margin背景颜色 */
  background-color: #000!important;
}
.el-submenu__title {
  font-size: 14px;
  color:rgba(255,255,255,0.65)!important
}
.el-submenu.is-active>.el-submenu__title {
  color: #ffffff!important;
}
.secondMenu.el-submenu.is-active .el-submenu__title {
  color: #ffffff!important;
}
.el-submenu__title:focus,.el-submenu__title:hover{
  background-color: #1ac492 !important;
}
.el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow {
  color: #fff!important;
}
.firstMenu {
  background-color: #001529!important;
}
</style>
