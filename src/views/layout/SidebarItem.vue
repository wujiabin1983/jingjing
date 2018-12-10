<template>
  <div>
    <template v-for="(item, itemIndex) in routes">
      <el-menu-item :index="item.path+'/'+item.children[0].path" v-if=" !item.hidden && item.noDropdown && item.children.length>0" :key="itemIndex">
        {{item.children[0].name}}
      </el-menu-item>
      <el-submenu :index="item.name" v-if=" !item.noDropdown && !item.hidden " :key="itemIndex">
        <template slot="title">
         {{item.name}}
        </template>
        <template v-for="(child,childIndex) in item.children" v-if='!child.hidden'>
          <sidebar-item class='menu-indent' v-if='child.children&&child.children.length>0' :routes='[child]' :key="childIndex"> </sidebar-item>
          <el-menu-item v-else :index="item.path+'/'+child.path"  class="menu-indent" :key="childIndex">
            <icon-svg v-if='child.icon' :icon-class="child.icon" /> <span class="menu-span" @click="scrollTop">{{child.name}}</span>
          </el-menu-item>
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
    navList:{
      type:Array
    },
    navId: {}
  },
  mounted() {
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

