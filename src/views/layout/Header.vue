<template>
  <div class="nav">
    <div class="layout">
      <div class="userIcon">
        <img class="userLogo" src="@/assets/user.png">
      </div>      
      <div class="user">       
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <span id="userName"></span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="about" command="aboutOpen">授权信息</el-dropdown-item>
            <el-dropdown-item class="about" command="exit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <license-info ref="license"></license-info>
  </div>
</template>

<script>
import request from "@/utils/request";
import LicenseInfo from './LicenseInfo.vue';
export default {
  components: { LicenseInfo },
  name: "Header",
  data() {
    return {
    };
  },
  mounted() {
    // console.log(this.$route)
    document.getElementById("userName").innerHTML =localStorage.getItem('usershowName')
  },
  watch:{
    $route (to, from) {
    }
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "aboutOpen" :
          this.$refs.license.diaOpen()
          break;
        case "exit" :
          var that = this
          that.$store.dispatch('LogOut').then(() => {
            // window.location.href = 'https://192.168.1.49/#/index'
            that.$router.push({ path: '/login'})
            localStorage.setItem('loginremind','')
            localStorage.removeItem("loginnum")
            window.sessionStorage.clear()
          })
          break;
      }
    },
  },
};
</script>

<style scoped>
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
.nav {
  display: flex;
}

.layout {
  display: flex;
  height: 48px;
  line-height: 48px;
  position: absolute;
  right: 40px;
}
.userIcon {
  margin-right: 10px;
}
.userLogo {
  vertical-align:middle;
}
.user {
  margin-right: 10px;
}
.el-popper {
  margin-top: 0 !important;
}
#userName {
cursor: pointer;
}
.about {
  width: 100px;
  text-align: center;
  color: #1ac492;
}
.about:hover {
  color: #1ac492!important;
  background: #f0f9eb!important;
  border-color: #c2e7b0!important;
}
.exitBtn {
  cursor: pointer;
}
</style>


