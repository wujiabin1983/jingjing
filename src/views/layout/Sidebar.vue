<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu mode="vertical" :default-active="$route.path" :unique-opened="true" :router="true" text-color="#eaecf0" active-text-color="#111" background-color="#2f4050" @open="handleOpen" @close="handleClose" @select="handleSelect">
      <template v-for="(nav,navIndex) in navList" >
        <el-submenu :index="nav.name" :key="navIndex">
          <template slot="title">
            <i class="iconfont" :class="`icon-${nav.name}`"></i>
          {{nav.menu}}
          </template>
          <sidebar-item :routes="nav.children" :navId="handleNavId" ></sidebar-item>
        </el-submenu>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
  import SidebarItem from './SidebarItem'
  export default {
    components: {
      SidebarItem
    },
    data() {
      return {
        activeIndex: '0',
        computedTopNavData: [],
        navList:[],
      }
    },
    computed: {
      childrenRoutes() {
        return this.$router.options.routes
      },
      ...mapGetters([
        'userInfo',
        'roles',
        'rolesTop',
        'router'
      ]),
      computedTopNav() {
        return !this.rolesTop ? [] : this.rolesTop
      }
    },
  
    created() {
      // console.log(sessionStorage.getItem('indexPath'), 'indexPath')
      // console.log(sessionStorage.getItem('sideActiveIndex'), 'sideBar')
      //  console.log(sessionStorage.getItem('sideActiveIndex'), sessionStorage.getItem('indexPath'), "sessionStorage.getItem('indexPath')");
      this.getTopNav()
      this.setNavList()
      if (sessionStorage.getItem('sideActiveIndex')) {
        const index = sessionStorage.getItem('sideActiveIndex')
        const indexPath = JSON.parse(sessionStorage.getItem('indexPath'))
        this.handleSelect(index, indexPath)
      }

      // console.log(this.$router, this.routes, '这里是sidebar');
    },
    mounted() {
      // console.log(this.childrenRoutes)
    },
    props: {
      handleNavId: {}
    },
    methods: {
      getTopNav() {
        if (sessionStorage.getItem('topActiveIndex')) {
          this.activeIndex = sessionStorage.getItem('topActiveIndex')
        } else {
          if (!sessionStorage.getItem('loginType')) {
            this.activeIndex = !this.rolesTop[0] ? '' : this.rolesTop[0].name
          }
          this.$emit('handleNavId', this.activeIndex)
        }
        this.computedTopNav.forEach((val, index) => {
          this.computedTopNavData.push({
            index: index,
            ...val
          })
        })
        console.log(this.computedTopNavData)
      },
      setNavList(){
        this.navList = this.$Lodash.cloneDeep(this.computedTopNavData)
        this.navList.map((v,i)=>{
          let child = this.childrenRoutes.filter((route)=> {
            return route.id == v.name
          })

          this.$set(v,'children',child)
        })
      },
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
        sessionStorage.setItem('sideActiveIndex', index)
        const submenu__title = document.getElementsByClassName('el-submenu__title')
        const submenu = document.getElementsByClassName('el-submenu')
        let selectedMenuIndex = ''
        for (let i = 0; i < submenu__title.length; i++) {
          const text = submenu__title[i].innerText.replace(/(^\s*)|(\s*$)/g, '')
          // submenu__title[i].querySelectorAll('svg')[0].style.color = '#929292';
          if (index == text) {
            selectedMenuIndex = i
          }
        }
        // submenu__title[selectedMenuIndex].querySelectorAll('svg')[0].style.color = '#18a98c';
        // submenu[selectedMenuIndex].style.background = 'red';
      }
    },
  
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-menu {
    min-height: 100%;
  }
</style>=