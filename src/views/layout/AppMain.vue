<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <keep-alive>
	    	<router-view :key="key" v-if="$route.meta.keepAlive"></router-view>
	    </keep-alive>
    </transition>
    <router-view v-if="!$route.meta.keepAlive" :key="key"></router-view>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  mounted() {
    // console.log(this.$route.meta)
  },
  computed: {
    key () {
      this.bus.$emit('leftMenuData', this.$route)
      return this.$route.fullPath
    }
  }
}
</script>
<style scoped>
.app-main {
  overflow: auto;
}
</style>
