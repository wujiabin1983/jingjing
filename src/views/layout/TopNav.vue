<!--顶部导航 组件 old-->
<template>
  <el-menu :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    ref="elMenu">
   		<!-- 动态导航-->
      <el-menu-item
        v-for="item in computedTopNavData"
        :key="item.index"
        :index="item.name"
        ref="menuItems"
        class="menuItems">
        <icon-svg :icon-class="item.iconCls" />
        {{item.menu}}
      </el-menu-item>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      activeIndex: '0',
      computedTopNavData: []
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key
      sessionStorage.setItem('topActiveIndex', key)
      this.$emit('handleNavId', key)
      const items = this.$refs.elMenu.$el.getElementsByClassName('el-menu-item')
      // 点击顶部导航默认页面
      this.$router.push({
        name: 'Dashboard',
        query: {
          // nav: key,//保证每次点击路由的query项都是不一样的，确保会重新刷新view
          time: +new Date() // 保证每次点击路由的query项都是不一样的，确保会重新刷新view
        },
        params: {
          topNav: key
        }
      })
    }
  },
  created() {
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
  },
  computed: {
      // 计算属性
    ...mapGetters([
      'userInfo',
      'roles',
      'rolesTop',
      'router'
    ]),
    computedTopNav() {
      return !this.rolesTop ? [] : this.rolesTop
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/_function.scss";
  $color: #19aa8d;
  $topHeight: 51px;
  .el-menu {
    display: inline-block;
    // font-size: 14px;
    // line-height: 50px;
    margin-left: 10px;
    &, .el-menu-item {
      height: $topHeight;
      line-height: $topHeight;
    }
    .el-menu {
      background: transparent;
      li {
        & .svg-icon {
          font-size: rem(20px);
          margin: 0 rem(5px);
        }
        &:nth-child(1) .svg-icon {
          color: #FFF;
        }
        &:nth-child(2) .svg-icon {
          color: #FFF;
          font-size: rem(23px);
        }
        &:nth-child(3) .svg-icon {
          color: #FFF;
        }
        &:nth-child(4) .svg-icon {
          color: #FFF;
        }
        &:nth-child(5) .svg-icon {
          color: #FFF;
          font-size: rem(24px);
        }
        &:nth-child(6) .svg-icon {
          color: #FFF;
          font-size: rem(24px);
        }
      }

      .el-menu-item {
        color: #FFF;
        font-weight: bold;
        font-size: rem(14px);
        &:hover {
          background: $color !important;

          color: #fff;
        }
        &.is-active {
          background: transparent;
          // font-size: rem(15px);
          background: $color;
          color: #fff;
          border-bottom: 1px solid $color;
        }
      }
    }
  }
</style>
