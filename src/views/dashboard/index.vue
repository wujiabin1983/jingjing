<template>
  <div class="dashboard-container">
    <!-- <div class='dashboard-text'>name:{{name}}</div>
    <div class='dashboard-text'>role:<span v-for='role in roles' :key='role'>{{role}}</span></div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'loginTip'
    ])
  },
  created() {
        // 钩子函数 -- 初始化
//      console.log(this.loginTip);
		let that = this;
    if(!(!this.loginTip)) {
      setTimeout(() => {
        that.$notify.info({
          title: '消息',
          message: this.loginTip
        });
        that.$store.dispatch('LoginTip', '');
      }, 500);
    }
		if(sessionStorage.getItem('loginType')){
	    that.$router.push({
				path: '/member/member-1-1'
			});
		}
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
