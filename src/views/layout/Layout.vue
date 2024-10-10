<template>
<el-container>
  <web-socket></web-socket>
  <el-aside width="272px" class="aside">
    <home-aside></home-aside>
  </el-aside>
  <el-container>
    <el-header>
      <home-header></home-header>
    </el-header>
    <el-main>
      <app-main v-if="isRouterAlive"></app-main>
    </el-main>
  </el-container>
</el-container>

</template>

<script>
import request from '@/utils/request'
import HomeHeader from './Header'
import HomeAside from './SideItem'
import AppMain from './AppMain'
import { getToken } from '@/utils/auth'
import WebSocket from '@/utils/WebSocket.vue'
export default {
  name: 'Layout',
  components: {
    HomeHeader,
    HomeAside,
    AppMain,
    WebSocket,
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true,
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
}
.el-header {
  z-index: 1;
  padding: 0;
  height: 48px !important;
  box-shadow: 0px 2px 7px 0px #f0f2f5;
}
.aside {
  height: 100vh;
}
.el-main {
  padding: 0;
}
</style>
