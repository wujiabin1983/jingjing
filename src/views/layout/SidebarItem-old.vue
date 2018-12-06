<template>
  <div>
    <template v-for="(item, index) in handleRoutes">
      <router-link v-if=" !item.hidden && item.noDropdown && item.children.length>0" :to="item.path+'/'+item.children[0].path">
        <el-menu-item :index="item.path+'/'+item.children[0].path">
          <icon-svg v-if='item.icon' :icon-class="item.icon" /> {{item.children[0].name}}
        </el-menu-item>
      </router-link>
      <el-submenu :index="item.name" v-if=" !item.noDropdown && !item.hidden ">
        <template slot="title">
          <icon-svg v-if='item.icon' :icon-class="item.icon" /> {{item.name}}
        </template>
        <template v-for="child in item.children" v-if='!child.hidden'>
          <sidebar-item class='menu-indent' v-if='child.children&&child.children.length>0' :routes='[child]'> </sidebar-item>
          <router-link v-else class="menu-indent" :to="item.path+'/'+child.path">
            <el-menu-item :index="item.path+'/'+child.path">
              <icon-svg v-if='child.icon' :icon-class="child.icon" /> <span class="menu-span" @click="scrollTop">{{child.name}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  data() {
    return {
      activeIndex: ''
    }
  },
  props: {
    routes: {
      type: Array
    },
    navId: {}
  },
  methods: {
  scrollTop() {
  window.scroll(0, 0)	
		}
},
  computed: {
    handleRoutes() {
      let navId
      if (this.navId) {
        navId = this.navId
      }
      if (sessionStorage.getItem('topActiveIndex')) {
        navId = sessionStorage.getItem('topActiveIndex')
      }
      let result= this.routes.filter(function(route) {
        return route.id == navId
      })
      console.log(result)
      return result
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.svg-icon {
  margin-right: 10px;
}
.hideSidebar .menu-indent{
  display: block;
  text-indent: 10px;
}
.menu-span{
	display: block;
	width: 100%;
	height: 100%;
}
</style>

