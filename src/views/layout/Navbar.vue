<!-- old -->
<template>
	<el-menu class="navbar" mode="horizontal" text-color="#333" active-text-color="#00ff00">
		<top-nav @handleNavId="handleNavId"></top-nav>
		<div class="navBar">
			<el-dropdown class="avatar-container" trigger="click" @command="handleCommand">
				<div class="avatar-wrapper">
					<img class="user-avatar" src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80">
					<i class="el-icon-caret-bottom"></i>
				</div>
				<el-dropdown-menu class="user-dropdown" slot="dropdown">
					<router-link class='inlineBlock' to="/">
						<el-dropdown-item command="首页">
							主页
						</el-dropdown-item>
					</router-link>
					<el-dropdown-item command="个人信息" v-if="userInfo.userType == 'EMPLOYEE' && userInfo.userCode != ''">个人信息</el-dropdown-item>
					<el-dropdown-item v-if="userInfo.userType == 'EMPLOYEE'||userInfo.userType == 'SELLER' && userInfo.userCode != ''" command="切换账号">切换账号</el-dropdown-item>
					<el-dropdown-item command="修改密码">修改密码</el-dropdown-item>
					<el-dropdown-item divided command="退出">退出</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
			<div class="navLoginName">
				&nbsp;&nbsp;您好!&nbsp;{{!userInfo.userCode ? username : userInfo.userCode}}
			</div>
		</div>
	</el-menu>
</template>

<script>
	import { mapGetters } from 'vuex'
	import Levelbar from './Levelbar'
	import TopNav from './TopNav'
	export default {
	    data() {
	        return {
	    		color:"#2f4050"
	        }
        },
		components: {
			Levelbar,
			TopNav
		},
		computed: {
			...mapGetters([
				'sidebar',
				'avatar',
				'userInfo'
			]),
			username() {
				return sessionStorage.getItem('userInfoUserName');
			}
		},
		methods: {
			toggleClick(){},
			setColor(val){
				$("#app .app-wrapper .heade-wrapperr>.el-menu").css({
					"background": val,
					"border-bottom": "1px solid"+ val
				})
			},
			handleCommand(command) {
				if(command == '切换账号') {
					this.$emit('handleSwitch', '切换账号');
				}
				if(command == '个人信息') {
					this.$emit('handleSwitch', '个人信息');
				}
				if(command == '修改密码') {
					this.$emit('handleSwitch', '修改密码');
				}
				if(command == '退出') {
					this.logout();
				}
			},
			toggleSideBar() {
				this.$store.dispatch('ToggleSideBar')
			},
			logout() {
				this.$store.dispatch('LogOut').then((res) => {
					this.reloadPush();
				})
			},
			async reloadPush() {
				await location.reload() // 为了重新实例化vue-router对象 避免bug   
			},

			handleNavId(id) {
				this.$emit('handleNavId', id)
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	@import 'src/styles/_function.scss';
	$top: 50px;
	.navbar {
		height: $top;
		line-height: $top;
		border-radius: 0px !important;
		.hamburger-container {
			line-height: $top;
			height: $top;
			float: left;
			padding: 0 rem(10px);
			outline: none;
			.svg-icon {
				color: #009ee2 !important;
			}
		}
		.errLog-container {
			display: inline-block;
			position: absolute;
			right: rem(150px);
		}
		.navBar {
			position: absolute;
			right: 20px;
			top: 0;
			// width: 280px;
			outline: none;
			padding-right: 10px;
			height: 50px;
		}
		.navLoginName {
			display: inline-block;
			float: right;
			height: 50px;
			line-height: 50px;
			margin: 0 5px;
			font-size: 14px;
			color: #FFF;
		}
		.resetBgColor{
			display: inline-block;
			float: right;
			font-size: 14px;
			height: 50px;
			line-height: 50px;
			color:#fff;
			span{
				display: inline-block;
				float: left;
				margin-right: 4px;
			}
			.block{
				padding-top: 8px;
				float: left;
			}
		}
		.screenfull {
			position: absolute;
			right: rem(16px);
			top: rem(16px);
			// color: red;
		}
		.avatar-container {
			height: 50px;
			float: right;
			outline: none;
			color: #FFF;
			vertical-align: top;
			cursor: pointer;
			.avatar-wrapper {
				cursor: pointer;
				margin-top: 8px;
				position: relative;
				.user-avatar {
					width: 25px;
					height: 25px;
					margin-left: rem(10px);
					border-radius: rem(10px);
				}
				.el-icon-caret-bottom {
					position: absolute;
					top:1px;
					font-size:12px;
					color: #FFF;
				}
			}
		}
	}
	
	.dialog-user {}
	
	.drop-down-span {
		display: block;
		padding-left: 10px;
		padding-right: 10px;
	}
	
	#icon-user1 {
		color: #FFF;
		font-weight: bold;
	}
	
	#icon-loginout1 {
		color: #FFF;
	}
</style>