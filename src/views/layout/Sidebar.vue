<template>

  <el-menu 
    mode="vertical" 
    :default-active="$route.path"
    text-color="#f3efec"
    active-text-color="#fff"
    background-color="#2f4050"
    @open="handleOpen"
    @close="handleClose"
    @select="handleSelect">
    <sidebar-item :routes="routes" :navId="handleNavId"></sidebar-item>
  </el-menu>
</template>

<script>
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  computed: {
    routes() {
      return this.$router.options.routes
    }
  },
  props: {
    handleNavId: {}
  },
  methods: {
    handleOpen(index, indexPath) {
      // console.log('open', index, indexPath);
      },
    handleClose(index, indexPath) {
      // console.log('close', index, indexPath);
    },
    handleSelect(index, indexPath) {
      // /master/master-2 ["/master/master-2"] indexIndexPath
      // console.log(index, indexPath, 'indexIndexPath');
      // console.log(indexPath[0]);
      sessionStorage.setItem('sideActiveIndex', index);
      let submenu__title = document.getElementsByClassName('el-submenu__title');
      let submenu = document.getElementsByClassName('el-submenu');
      let selectedMenuIndex = '';
      for(let i=0;i<submenu__title.length;i++) {
        let text = submenu__title[i].innerText.replace(/(^\s*)|(\s*$)/g, "");
        // submenu__title[i].querySelectorAll('svg')[0].style.color = '#929292';
        if(index == text) {
          selectedMenuIndex = i;
        }
      }
      // submenu__title[selectedMenuIndex].querySelectorAll('svg')[0].style.color = '#18a98c';
      // submenu[selectedMenuIndex].style.background = 'red';
    }
  },
  created () {
    // console.log(sessionStorage.getItem('indexPath'), 'indexPath')
    // console.log(sessionStorage.getItem('sideActiveIndex'), 'sideBar')
//  console.log(sessionStorage.getItem('sideActiveIndex'), sessionStorage.getItem('indexPath'), "sessionStorage.getItem('indexPath')");
    if (sessionStorage.getItem('sideActiveIndex')) {
      let index = sessionStorage.getItem('sideActiveIndex')
      let indexPath = JSON.parse(sessionStorage.getItem('indexPath'))
      this.handleSelect(index, indexPath);
    }
    // console.log(this.$router, this.routes, '这里是sidebar');
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-menu {
  min-height: 100%;
}

</style>
