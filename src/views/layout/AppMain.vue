<template>
  <section class="app-main" v-loading="loading">
    <transition name="fade" mode="out-in">
      <router-view :key="key"></router-view>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
	data() {
		return {
			loading:true
		}
	},
	methods: {
	},
	created() {
	},
  computed: {
    key() {
			this.loading=true;
			setTimeout(()=>{
				this.loading=false;
			},2000)
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>
