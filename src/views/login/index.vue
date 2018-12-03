<template>
	<div class="login-container">
		<div class="warp">
			<div class="top">
				<span class="logoImg flaotLeft"><img :src="logo"/></span><span class="top-tel floatRight">15606009777</span><span class="companyName flaotLeft">XXXX有限公司</span><span class="top-tel-icon floatRight"><img :src="tel" alt="" /></span>
			</div>
		</div>
		<div class="main" :style="{backgroundImage: `url(${background})`}">
			<!-- 登陆 -->
		 	<el-tabs v-model="activeName" v-if="showSwitch == 'login'" class="login-form" @tab-click="handleClick">
			    <img :src="userLogin" v-if="activeName=='first'" class="top-icon userLogin"/>
			    <img :src="rapidEnrollmentNo" v-if="activeName=='first'" class="top-icon rapidEnrollmentNo"/>
			    <img :src="userLoginNo" v-if="activeName=='second'" class="top-icon userLoginNo"/>
			    <img :src="rapidEnrollment" v-if="activeName=='second'" class="top-icon rapidEnrollment"/>
			    <el-tab-pane label="用户登录" name="first">
			    	<el-form id="loginBox" autoComplete="on"  v-loading="loading" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="card-box">
						<!-- 用户名输入框 -->
						<el-form-item prop="username">
							<el-input ref="userName" name="username" type="text" v-model="loginForm.username" placeholder="用户名" @keyup.enter.native="handleFocusNext" />
						</el-form-item>
						<!-- 密码输入框 -->
						<el-form-item prop="password">
							<el-input ref="password" name="password" type="password" @keyup.enter.native="handleEnter" v-model="loginForm.password" autoComplete="on" placeholder="密码"></el-input>
						</el-form-item>
						<!-- 登陆按钮 -->
						<el-form-item>
							<div id="mpanel"></div>
							<el-button type="primary" ref="loginButton" class="loginClick" :disabled="disabeld" @click.native.prevent="handleLogin">登录</el-button>
							<a class="passAct forgetPass" @click="getPass">忘记密码</a>
						</el-form-item>
						<el-button @click="setCurrent(tableData[0])" v-show="" class="selectRowClick">选中第一行</el-button>
						<!--<el-checkbox class="passAct rememberPass" v-model="remindPass" label="记住密码" name="type"></el-checkbox>-->
					</el-form>
			    </el-tab-pane>
			    <el-tab-pane label="快速登录入口" name="second">
			    	<div class="twoQcode">
			    		<img :src="twoQcode" alt=""/>
			    	</div>
			    	<p class="twoQcodeP">客户端扫码登录</p>
			    	<div class="useWechatLogin otherLogin">使用微信登录<img :src="wechat" alt="" /></div>
			    	<div class="useQQLogin otherLogin">使用QQ登录<img :src="qqImg" alt="" /></div>
			    </el-tab-pane>
		  	</el-tabs>
		  	<!-- 账号选择 -->
			<el-form v-else-if="showSwitch == 'login2'" v-loading="tableLoading" autoComplete="on" ref="loginForm" class="card-box login-form">
				<h3 class="title">账号选择</h3>
				<el-table border ref="singleTable" class="tableData el-tableRadio" :data="tableData" highlight-current-row @current-change="handleCurrentChange">
					<el-table-column type="index" width="50"> </el-table-column>
					<el-table-column property="userName" label="账号" width="120"></el-table-column>
					<el-table-column property="userCode" label="员工工号" width="120"></el-table-column>
					<el-table-column property="realName" label="用户名"></el-table-column>
					<el-table-column property="userRoleName" label="角色"></el-table-column>
					<el-table-column property="storeName" label="所属门店"> </el-table-column>
					<el-table-column property="brandName" label="所属品牌"> </el-table-column>
				</el-table>
				<div class="dsh-footer">
					<el-button @click="backLogin">返回</el-button>
					<el-button @click="employeeSelect" type="primary" class="handleEnterLogin" @keyup.enter.native="handleEnterLogin">确认登入</el-button>
				</div>
			</el-form>

			<!-- 忘记密码 -->
			<el-form id="forgetBox" :rules="findPassRules" v-loading="forgetBoxLoading" v-else-if="showSwitch == 'forgetPass'" autoComplete="on" :model="form" ref="findPassRules" label-position="left" class="card-box login-form">
				<h3 class="title">找回密码</h3>
				<el-form-item label="手机号码" prop="mobile">
					<el-input v-model="form.mobile" ref="moblie" class="moblie"></el-input>
				</el-form-item>
				<el-form-item label="验证码" prop="verificationCode">
					<el-input v-model="form.verificationCode" class="vcInput"></el-input><span id="getVerification" ref="code" @click="getVCode" class="verification" data-ver="true">{{text}}</span>
				</el-form-item>
				<el-form-item label="设置新密码" prop="newPassWord">
					<el-input type="password" v-model="form.newPassWord" class="password" ></el-input>
				</el-form-item>
				<p class="other">密码强度<span class="small">弱</span><span class="middle">中</span><span class="big">强</span></p>
				<el-form-item label="确认新密码" prop="confirmPassword">
					<el-input type="password" v-model="form.confirmPassword" class="resetPassword"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="btn" @click="backLogin">返回</el-button>
					<el-button type="primary" class="btn" @click="onSubmit">完成</el-button>
				</el-form-item>
				<button @click="moblieNo" class="moblieNo" style="display: none;"></button>
				<button @click="moblieFlase" class="moblieFlase" style="display: none;"></button>
				<button @click="passwordNo" class="passwordNo" style="display: none;"></button>
				<button @click="passwordFalse" class="passwordFalse" style="display: none;"></button>
			</el-form>
		</div>
		<div class="warp-bottom">
			<ul>
				<li>关于XX</li>
				<li><a href="javascript:void(0);">XX介绍</a></li>
				<li><a href="javascript:void(0);">团队</a></li>
				<li><a href="javascript:void(0);">联系</a></li>
				<li><a href="javascript:void(0);">加入我们</a></li>
			</ul>
			<ul>
				<li>XX服务</li>
				<li><a href="javascript:void(0);">商户入住</a></li>
				<li><a href="javascript:void(0);">小程序</a></li>
				<li><a href="javascript:void(0);">公众号</a></li>
				<li><a href="javascript:void(0);">网站建设</a></li>
				<li><a href="javascript:void(0);">空间相册</a></li>
				<li><a href="javascript:void(0);">域名注册</a></li>
			</ul>
			<ul>
				<li>域名注册</li>
				<li><a href="javascript:void(0);">使用指南</a></li>
				<li><a href="javascript:void(0);">运营方案</a></li>
			</ul>
			<ul class="Contact">
				<li>联系方式</li>
				<li><img :src="tel" class="tel-bottom"/>0571-8888888  /   0571-88999999</li>
				<li><img :src="address" class="address-bottom"/>杭州市天目山路XXXX</li>
				<li><img :src="email" class="email-bottom"/>tech@123456.com</li>
			</ul>
		</div>
		<div class="bottom">
			<span>Copyright&copy;2017浙ICP17016319</span>
			<span>厦门导客信息有限公司</span>
		</div>
	</div>
</template>

<script>
	import NProgress from 'nprogress' // Progress 进度条
	// cookies
	import Cookies from 'js-cookie'
	// 用户名验证、 手机号码验证
	import { isvalidUsername, validateMobile } from '@/utils/validate';
	import { checkMobile, verification } from '@/utils/login';
	import { getToken, setToken, removeToken } from '@/utils/auth'
	// 获取验证码、 登陆、选择账号、忘记密码
	import { getCode, login, selectAccount, forgotPass } from '@/api/login';
	import img_user from '@/assets/login_images/user.png'
	import img_password from '@/assets/login_images/password.png'
	import background from '@/assets/background.png'
	import tel from '@/assets/lianxidianhua.png'
	import '@/styles/verify.css'
	import userLogin from '@/assets/huiyuan.png'
	import userLoginNo from '@/assets/huiyuan2.png'
	import rapidEnrollmentNo from '@/assets/kuaisu.png'
	import rapidEnrollment from '@/assets/kuaisu2.png'
	import address from '@/assets/dizhi.png'
	import email from '@/assets/youxiang.png'
	import twoQcode from '@/assets/images/twoQcode.png'
	import qq from '@/assets/qq.png'
	import wechat from '@/assets/wechat.png'
	import logo from '@/assets/logo.png'
	import bgCanvas from './bg.vue'
	import axios from 'axios'
	import  '@/api/verify';

	export default {

		name: 'login',
		components: {
			bgCanvas,
		},
		data() {
			const validateUsername = (rule, value, callback) => {
				if(!isvalidUsername(value)) {
					callback(new Error('请输入正确的用户名'))
				} else {
					callback()
				}
			}
			const validatePass = (rule, value, callback) => {
				if(value.length < 5) {
					callback(new Error('密码不能小于5位'))
				} else {
					callback()
				}
			}
			return {
				logo:logo,
				twoQcode:twoQcode,
				userLogin:userLogin,
				userLoginNo:userLoginNo,
				rapidEnrollment:rapidEnrollment,
				rapidEnrollmentNo:rapidEnrollmentNo,
				email:email,
				wechat:wechat,
				qqImg:qq,
				address:address,
				activeName:'first',
				tel: tel,
				background: background,
				isVerification:false,
				// 忘记密码loading
				forgetBoxLoading: false,
				remindPass: false,
				disabeld: false,
				text: '获取验证码',
				showSwitch: 'login',
				loginForm: {
					username: '',
					password: ''
				},
				loginRules: {
					// username: [{ required: true, trigger: 'blur', validator: validateUsername }],
					// password: [{ required: true, trigger: 'blur', validator: validatePass }]
				},
				findPassRules: {
					mobile: [{
						required: true,
						message: '请输入手机号码',
						trigger: 'blur'
					}],
					verificationCode: [{
						required: true,
						message: '请输入验证码',
						trigger: 'blur'
					}],
					newPassWord: [{
						required: true,
						message: '请输入新密码',
						trigger: 'blur'
					}],
					confirmPassword: [{
						required: true,
						message: '请再一次输入新密码',
						trigger: 'blur'
					}],
				},
				loading: false,
				tableLoading: false,
				// 图片
				img_user,
				img_password,
				tableData: [],
				// 选择账号
				radio: null,
				// 找回密码
				form: {
					mobile: '',
					verificationCode: '',
					newPassWord: '',
					confirmPassword: '',
					desc: ''
				},
				score:0
			}
		},
		methods: {
			handleClick(){},
			//确认登录
			handleEnterLogin() {
				document.querySelector(".handleEnterLogin").click();
			},
			// 密码回车事件
			handleEnter() {
				this.disabled = "true";
				document.querySelector(".loginClick").click();
			},
			// 用户名回车事件
			handleFocusNext() {
				this.$refs.password.focus();
			},
			moblieFlase() {
				this.$message({
					showClose: true,
					message: '请输入正确的手机号！',
					type: 'warning'
				});
			},
			moblieNo() {
				this.$message({
					showClose: true,
					message: '请输入手机号！',
					type: 'warning'
				});
			},
			passwordFalse() {
				this.$message({
					showClose: true,
					message: '最少输入六位密码！',
					type: 'warning'
				});
			},
			passwordNo() {
				this.$message({
					showClose: true,
					message: '请输入密码！',
					type: 'warning'
				});
			},
			// 登录
			handleLogin() {
				var that = this;
				this.$refs.loginForm.validate(valid => {
					if(valid) {
						let userInfo = {
							userName: this.loginForm.username.trim(),
							password: this.loginForm.password
						}
						if(userInfo.userName == '') {
							that.$message.warning('请输入用户名！');
							return false;
						}
						if(userInfo.password == '') {
							that.$message.warning('请输入密码！');
							return false;
						}
						if(!this.isVerification){
							that.$message.warning('请完成验证！');
							return false;
						}
						this.loading = true;
						login(userInfo)
							.then(function(res) {
								let data = JSON.parse(Base64.decode(res.data));
								if(!data.messageContent.userToken) {
									sessionStorage.setItem('userToken', '');
								} else {
									sessionStorage.setItem('userId', !data.messageContent.result ? '' : data.messageContent.result[0].userCode);
									sessionStorage.setItem('userToken', data.messageContent.userToken);
								}
								let result;
								let storeUserInfo; // 用户信息
								let roles; // 权限
								if(data.messageType == 'SUCCESS') {
									if(that.remindPass) {
										if(typeof(Storage) !== "undefined") {
											let value = "a" + userInfo.userName + "," + userInfo.password + "123";
											let valueBase = Base64.encode(Base64.encode(value));
											localStorage.setItem("dl", valueBase);
										} else {
											that.remindPass = false;
											that.$message.warning('该浏览器不支持记住密码功能！');
										}
									} else {
										localStorage.removeItem("dl");
									}
								} else {
									that.loading = false
								}
								let rolesTop = data.messageContent.platformMenu;
								that.$store.dispatch('RolesTop', rolesTop); // 顶部导航权限
								Cookies.set('rolesTop', rolesTop);
								if(data.messageContent.userType == "EMPLOYEE") {
									// emplayee 品牌管理员
									//									that.loading = true;
									if(data.messageType == 'SUCCESS') {
										that.disabled = true;
										let result = [];
										data.messageContent.result.forEach((val, index) => {
											result.push({
												...val
											});
										})
										that.tableData = result;
										// 当可供切换的账号只有一个时，直接登录
										if(result.length == 1) {
											let params = {
												"userName": result[0].userName,
												"userCode": result[0].userCode,
											}
											sessionStorage.setItem('loginRadio', JSON.stringify(params));
											selectAccount(params)
												.then((res) => {
													let data = JSON.parse(Base64.decode(res.data));
													// console.log(JSON.stringify(data.messageContent.asyncRouterMap.SUCCESS), '权限');
													if(data.messageType == 'SUCCESS') {
														// 权限
														let userType = data.messageContent.userType;
														if(!data.messageContent.userToken) {
															sessionStorage.setItem('userToken', '');
														} else {
															sessionStorage.setItem('userToken', data.messageContent.userToken);
														}
														if(userType == 'EMPLOYEE') {
															sessionStorage.setItem('loginType', 'emplayee');
															let roles = JSON.stringify(data.messageContent.roleMenu);
															let rolesTop = data.messageContent.platformMenu;
															that.tableLoading = false;
															let storeUserInfo = {
																userType: data.messageContent.userType, // 用户类型
																userCode: data.messageContent.userCode //用户代码
															}
															sessionStorage.setItem('userId', data.messageContent.userCode);
															// 将数据存储在 cookie 里面
															Cookies.set('userType', data.messageContent.userType);
															sessionStorage.setItem('userType', data.messageContent.userType);
															Cookies.set('userCode', data.messageContent.userCode);
															Cookies.set('roles', roles);
															Cookies.set('rolesTop', rolesTop); // 顶部导航
															// 将数据存储在 vuex 里面
															that.$store.dispatch('Roles', roles); // 权限
															that.$store.dispatch('Login', storeUserInfo);
															that.$store.dispatch('Router', JSON.stringify(data.messageContent.asyncRouterMap.SUCCESS)); // 路由全新权限
															that.$store.dispatch('GetEmplayeeNum', data.messageContent.userInfo.userCode); // 员工编号
															sessionStorage.setItem('GetEmplayeeNum', data.messageContent.userInfo.userCode);
															that.$store.dispatch('LoginTip', data.messageContent.loginTip);
															sessionStorage.setItem('router', that.$store.getters.router);
															that.$router.push({
																path: '/'
															});
														} else {
															let roles = JSON.stringify(data.messageContent.roleMenu);
															let rolesTop = data.messageContent.platformMenu;
															// console.log(roles);
															that.tableLoading = false;
															let storeUserInfo = {
																userType: data.messageContent.userType, // 用户类型
																userCode: data.messageContent.userInfo.userName //用户代码
															}
															sessionStorage.setItem('userId', data.messageContent.userInfo.userName);
															sessionStorage.setItem('userInfoUserName', data.messageContent.userInfo.userName);
															// 将数据存储在 cookie 里面
															Cookies.set('userType', data.messageContent.userType);
															sessionStorage.setItem('userType', data.messageContent.userType);
															Cookies.set('userCode', data.messageContent.userInfo.userName);
															Cookies.set('roles', roles);
															Cookies.set('rolesTop', rolesTop); // 顶部导航
															// 将数据存储在 vuex 里面
															that.$store.dispatch('Roles', roles); // 权限
															that.$store.dispatch('Login', storeUserInfo);
															that.$store.dispatch('Router', JSON.stringify(data.messageContent.asyncRouterMap.SUCCESS)); // 路由全新权限
															// console.log(data.messageContent, 'loginTui');
															that.$store.dispatch('LoginTip', data.messageContent.loginTip);
															sessionStorage.setItem('router', that.$store.getters.router);
															that.$router.push({
																path: '/'
															});
														}
													} else {
														that.$message.warning(data.messageContent);
														that.loading = false
													}
												})
												.catch((err) => {
													that.tableLoading = false;
												})
										} else {
											//that.loading = false;
											that.disabled = false;
											that.showSwitch = 'login2';
											sessionStorage.setItem('userAccount', JSON.stringify(that.tableData));
											document.querySelector(".selectRowClick").click();
										}
									} else {
										that.$message(data.messageContent);
										that.loading = false
									}
								} else {
									// admin系统管理员 || seller商户管理员
									if(data.messageType == 'SUCCESS') {
										// 权限
										roles = JSON.stringify(data.messageContent.roleMenu);
										// 用户信息
										storeUserInfo = {
											userType: data.messageContent.userType, // 用户类型
											userCode: data.messageContent.userInfo.userName //用户代码
										}
										sessionStorage.setItem('userId', data.messageContent.userInfo.userName);
										// 将数据存储在 cookie 里面
										Cookies.set('userType', data.messageContent.userType);
										Cookies.set('userCode', data.messageContent.userInfo.userName);
										sessionStorage.setItem('userType', data.messageContent.userType);
										Cookies.set('roles', roles);
										result = data.messageContent.result;
										// 将数据存储在 vuex 里面
										that.$store.dispatch('Roles', JSON.stringify(roles)); // 权限
										that.$store.dispatch('Login', storeUserInfo); // 用户信息
										that.$store.dispatch('LoginTip', data.messageContent.loginTip);
										//  console.log(JSON.stringify(data.messageContent.asyncRouterMap.SUCCESS), 'data.messageContent.asyncRouterMap.SUCCESS登录页面');
										that.$store.dispatch('Router', data.messageContent.asyncRouterMap.SUCCESS); // 路由全新权限
										sessionStorage.setItem('router', JSON.stringify(data.messageContent.asyncRouterMap.SUCCESS));
										that.$router.push({
											path: '/'
										});
									} else {
										that.$message(data.messageContent);
										that.loading = false
									}
									//									that.loading = false;
								}
								//								that.loading = false
							})
							.catch(function(err) {
								that.$message.error('系统繁忙！请稍后重试！');
								that.loading = true;
							})
					} else {
						that.$message.error('请输入正确的用户名和密码');
						that.loading = false;
						return false
					}
				})
			},
			//选择员工
			employeeSelect() {
				let that = this;
				if(!this.radio) {
					this.$message.warning('请选择账号');
					return false;
				}
				this.tableLoading = true;
				let res = this.radio;
				sessionStorage.setItem('loginRadio', JSON.stringify(res));
				let params = {
					"userName": res.userName,
					"userCode": res.userCode,
				}
				selectAccount(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						if(!data.messageContent.userToken) {
							sessionStorage.setItem('userToken', '');
						} else {
							sessionStorage.setItem('userToken', data.messageContent.userToken);
						}
						if(data.messageType == 'SUCCESS') {
							// 账户类型
							let userType = data.messageContent.userType;
							console.log(userType)
							if(userType == 'EMPLOYEE') {
								let roles = JSON.stringify(data.messageContent.roleMenu);
								let rolesTop = data.messageContent.platformMenu;
								sessionStorage.setItem('loginType', 'emplayee');
								that.tableLoading = false;
								let storeUserInfo = {
									userType: data.messageContent.userType, // 用户类型
									userCode: data.messageContent.userCode //用户代码
								}
								sessionStorage.setItem('userId', data.messageContent.userCode);
								// 将数据存储在 cookie 里面
								Cookies.set('userType', data.messageContent.userType);
								sessionStorage.setItem('userType', data.messageContent.userType);
								Cookies.set('userCode', data.messageContent.userCode);
								Cookies.set('roles', roles);
								Cookies.set('rolesTop', rolesTop); // 顶部导航
								// 将数据存储在 vuex 里面
								that.$store.dispatch('Roles', roles); // 权限
								that.$store.dispatch('Login', storeUserInfo);
								that.$store.dispatch('Router', JSON.stringify(data.messageContent.asyncRouterMap.SUCCESS)); // 路由全新权限
								that.$store.dispatch('GetEmplayeeNum', data.messageContent.userInfo.userCode); // 员工编号
								sessionStorage.setItem('GetEmplayeeNum', data.messageContent.userInfo.userCode);
								that.$store.dispatch('LoginTip', data.messageContent.loginTip);
								sessionStorage.setItem('router', that.$store.getters.router);
								that.$router.push({
									path: '/'
								});
							} else {
								let roles = JSON.stringify(data.messageContent.roleMenu);
								let rolesTop = data.messageContent.platformMenu;
								that.tableLoading = false;
								let storeUserInfo = {
									userType: data.messageContent.userType, // 用户类型
									userCode: data.messageContent.userInfo.userName //用户代码
								}
								sessionStorage.setItem('userId', data.messageContent.userInfo.userName);
								sessionStorage.setItem('userType', data.messageContent.userType);
								sessionStorage.setItem('userInfoUserName', data.messageContent.userInfo.userName);
								// 将数据存储在 cookie 里面
								Cookies.set('userType', data.messageContent.userType);
								Cookies.set('userCode', data.messageContent.userInfo.userName);
								Cookies.set('roles', roles);
								Cookies.set('rolesTop', rolesTop); // 顶部导航
								// 将数据存储在 vuex 里面
								that.$store.dispatch('Roles', roles); // 权限
								that.$store.dispatch('Login', storeUserInfo);
								that.$store.dispatch('Router', JSON.stringify(data.messageContent.asyncRouterMap.SUCCESS)); // 路由全新权限
								that.$store.dispatch('LoginTip', data.messageContent.loginTip);
								sessionStorage.setItem('router', that.$store.getters.router);
								that.$router.push({
									path: '/'
								});
							}
						} else {
							that.$message.warning(data.messageContent);
							that.tableLoading = false;
						}
					})
					.catch((err) => {
						that.tableLoading = false;
					})
			},
			backLogin() {
				this.showSwitch = 'login';
				this.loading = false;
				this.$nextTick(function() {
					this.slideVerify();
				})
			},
			getPass() {
				this.showSwitch = 'forgetPass';
			},
			setCurrent(row) {
				this.$nextTick(function() {
					this.$refs.singleTable.setCurrentRow(row);
				})
			},
			handleCurrentChange(val) {
				this.radio = val;
			},
			// 忘记密码
			getVCode() {
				// 获取验证码
				var mobile = this.form.mobile;
				if(!validateMobile(mobile)) {
					this.$message.warning('请输入正确的手机号码');
				} else {
//					// this.$message.success('正确');
					let that = this;
					let params = {
						mobile:mobile
					}
					getCode(params)
						.then(function(res) {
							let data = JSON.parse(Base64.decode(res.data));
							// console.log(JSON.stringify(data))
							// console.log(data.messageContent)
							if(data.messageType == 'SUCCESS') {
								that.$message.success(data.messageContent);
							} else {
								that.$message.warning(data.messageContent);
							}
						})
						.catch(function(err) {
							that.$message.error('系统繁忙！请稍后重试！');
						});
//					checkMobile();
//					var flag = this.$refs.code.getAttribute("data-ver");
//					var val = this.$refs.code.innerHTML;
//					if(flag == "false" && val == "获取验证码") {
//					 	this.$refs.code.innerHTML = "59";
//					 	var prarms = {
//					 		mobile: this.$refs.moblie.value
//					 	};
//					 	console.log(prarms); //请求的参数
//					 	var data = getCode(prarms);
//					 	verification();
//					}
				}

			},
			onSubmit() {
				/**
				 * form: {
					mobile: '',
					verificationCode: '',
					newPassWord: '',
					confirmPassword: '',
					desc: ''
				}
				 */
				let that = this;
				// console.log(this.form.mobile);
				let newPassWord = this.form.newPassWord,
					confirmPassword = this.form.confirmPassword;
				this.$refs.findPassRules.validate((valid) => {
					if(valid) {
						if(newPassWord.length<=5){
							this.$message.warning('最少输入六位密码');
							return false;
						}
						if(this.score==1){
							this.$message.warning('密码至少包含一个英文字母');
							return false;
						}
						if(newPassWord != confirmPassword) {
							this.$message.warning('两次密码不一致');
							return false;
						}
						this.forgetBoxLoading = true;
						let params = {
							mobile: this.form.mobile,
							verificationCode: this.form.verificationCode,
							newPassWord: this.form.newPassWord,
							confirmPassword: this.form.confirmPassword
						}
						forgotPass(params)
							.then(function(res) {
								let data = JSON.parse(Base64.decode(res.data));
								// console.log(data)
								if(data.messageType == 'SUCCESS') {
									// console.log(data.returnMsg);
									that.form = {
										mobile: '',
										verificationCode: '',
										newPassWord: '',
										confirmPassword: '',
										desc: ''
									}
									that.forgetBoxLoading = false;
									that.backLogin();
//									that.showSwitch = 'login';
									that.$message.success(data.messageContent);
								} else {
									that.$message.warning(data.messageContent);
								}
							})
							.catch(function(err) {
//								console.log(err)
								that.$message.error('系统繁忙！请稍后重试！');
								that.forgetBoxLoading = false;
							});
					}
				});
				return false;

			},
			slideVerify(){
				let that = this;
				$('#mpanel').slideVerify({
	        		type : 1,		//类型
	        		vOffset : 5,	//误差量，根据需求自行调整
			        barSize : {
			        	width : '278px',
			        	height : '30px',
			        },
			        ready : function() {
			    	},
			        success : function() {
			        	that.isVerification=true;
			        	//......后续操作
			        },
			        error : function() {
	//		        	alert('验证失败！');
			        }
			        
			    });
			}
		},
		watch: {
			'form.newPassWord': function(val) {
				var value = val;
				this.score = 0;
				// 含有数字
				if(/\d+/.test(value)) {
					this.score++;
				}
				// 大小写字母
				if(/[A-Z]/.test(value) || /[a-z]/.test(value)) {
					this.score++;
				}
				// 特殊字符
				if(/.[!, @, #, $, %, ^, &, *, ?, _, +, ~, -, (,)]/.test(value)) {
					this.score++;
				}
				if(value != "") {
					if(value.length > 5) {
						if(this.score == 1) {
							document.querySelector(".small").style.backgroundColor = "#FF0000";
							document.querySelector(".middle").style.backgroundColor = "#FFFFFF";
							document.querySelector(".big").style.backgroundColor = "#FFFFFF";
							this.$message.warning('密码至少包含一个英文字母');
						}
						if(this.score == 2) {
							document.querySelector(".small").style.backgroundColor = "#FF0000";
							document.querySelector(".middle").style.backgroundColor = "#FF9900";
							document.querySelector(".big").style.backgroundColor = "#FFFFFF";
						}
						if(this.score == 3) {
							document.querySelector(".small").style.backgroundColor = "#FF0000";
							document.querySelector(".middle").style.backgroundColor = "#FF9900";
							document.querySelector(".big").style.backgroundColor = "#CCCCCC";
						}
					}else{
						document.querySelector(".small").style.backgroundColor = "#FFFFFF";
						document.querySelector(".middle").style.backgroundColor = "#FFFFFF";
						document.querySelector(".big").style.backgroundColor = "#FFFFFF";
					}
				}
			},
		},
		created() {
			sessionStorage.removeItem('loginType');
			sessionStorage.setItem('userToken','');
			if(localStorage.getItem("dl")) {
				let value = localStorage.getItem("dl");
				let str = Base64.decode(Base64.decode(value));
				str = str.substr(1, str.length - 4);
				let array = str.split(",");
				this.loginForm.username = array[0];
				this.loginForm.password = array[1];
				this.remindPass = true;
			}
			this.$nextTick(function() {
				// console.log(this.$refs.userName, 'this.$refs.userName');
				this.$refs.userName.focus();
				this.slideVerify();
			});
			let params = {
				userName: 'admin01',
				password: 'a12345'
			}
			let result = Base64.encode(JSON.stringify(params));
			// console.log(result);
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss">
	@import "src/styles/mixin.scss";
	@import "src/styles/_function.scss";
	// $bg:#2d3a4b;
	// $dark_gray:#889aa4;
	// $light_gray:#eee;
	$blue: #009ee2;
	$bg:#2d3a4b;
	$dark_gray:#889aa4;
	$light_gray:#eee;
	.login-container {
		overflow: hidden;
		background: #FFFFFF;
		color: #52c0c7;
		.warp {
			max-width: 1050px;
			height: 54px;
			margin: 0 auto;
		}
		.warp-bottom{
			width: 720px;
			min-height: 150px;
			margin: 0 auto;
			overflow: hidden;
			margin-top: 15px;
			ul{
				float: left;
				margin-right: 120px;
				list-style:none;
				li{
					height: 22px;
					line-height: 22px;
					font-size:12px;
					position: relative;
					img{
						position:absolute;
						display: block;
						left: 0;
						top: 3px;
						width: 14px;
					}
				}
				li:first-child{
					font-size: 16px;
					margin-bottom: 10px;
				}
			}
			ul:nth-child(3){
				margin-right: 80px;
			}
			ul:last-child{
				margin: 0;
			}
			ul.Contact{
				li{
					padding-left: 34px;
					box-sizing: border-box;
				}
				li:first-child{
					padding: 0;
				}
				.tel-bottom{
					
				}
				.email-bottom{
					top: 7px;
				}
				.address-bottom{
				
				}
			}
		}
		.bottom{
			width: 100%;
			height: 35px;
			line-height: 35px;
			margin-top: 10px;
			font-size: 12px;
			border-top: 1px solid #ececec;
			span{
				width: 50%;
				height: 35px;
				line-height: 35px;
				display: block;
				float: left;
				padding: 0 50px;
				box-sizing: border-box;
				text-align: right;
			}
			span:last-child{
				text-align: left;
			}
		}
		.logoImg {
			width: 144px;
			height: 36px;
			display: block;
			float: left;
			margin:9px 10px;
			img{
				width: 100%;
				display: block;
			}
		}
		.companyName {
			font-size: 18px;
			height: 54px;
			line-height: 54px;
		}
		.top-tel {
			font-size: 18px;
			height: 54px;
			line-height: 54px;
			margin-right: 10px;
		}
		.top-tel-icon {
			width: 30px;
			height: 54px;
			margin-right: 20px;
			img {
				width: 24px;
				height: 24px;
				display: inline-block;
				margin-top: 15px;
			}
		}
		.main {
			width: 100%;
			height: 460px;
			background-size: cover;
			/*background-repeat: no-repeat;*/
			background-position-y: -44px;
			position: relative;
			.el-tabs__content{
				overflow: inherit;
			}
			.login-form {
				position: absolute;
				top: 7%;
				right: 10%;
				max-width: rem(800px);
				min-width: 350px;
				padding: 30px 50px;
				background: #fff;
				z-index: 1000;
				.el-tabs__item{
					width: 175px;
					padding: 0 10px;
					color: #dcdcdc;
					text-align: center;
				}
				.el-tabs__item.is-active{
					color: #a0a0a0;
				}
				.el-tabs__active-bar{
					background-color: #a0a0a0;
				}
				.el-tabs__item:hover{
					color: #dcdcdc;
				}
				.el-tabs__item.is-active:hover{
					color: #a0a0a0;
				}
				.top-icon{
					position: absolute;
					width: 20px;
					height: 20px;
				}
				.userLogin{
					top: -57px;
					left: 35px;
				}
				.userLoginNo{
					top: -42px;
					left: 35px;
				}
				.rapidEnrollment{
					top: -42px;
					right: 135px;
				}
				.rapidEnrollmentNo{
					top: -57px;
					right: 135px;
				}
				.twoQcode{
					width: 150px;
					height: 150px;
					margin: 0 auto;
					display: block;
					border:1px solid #ddd;
					padding: 10px;
					img{
						width: 100%;
						display: block;
					}
				}
				.twoQcodeP{
					width: 100%;
					color: #3B3B3B;
					font-size: 14px;
					text-align: center;
					height: 35px;
					line-height: 35px;
					margin: 8px 0;
				}
				.otherLogin{
					width: 240px;
					height: 30px;
					line-height: 30px;	
					color: #FFFFFF;
					margin: 0 auto;
					position: relative;
					text-align: center;
					font-size: 14px;
					cursor: pointer;
					img{
						position: absolute;
						left: 0;
						top: 0;
					}
				}
				.useWechatLogin{
					background: #4bd33d;
					margin-bottom: 10px;
				}
				.useQQLogin{
					background: #3d84d3;
				}
			}
		}
	}
	
	canvas {
		z-index: 500!important;
	}
	
	// 登陆框
	#loginBox {
		margin-top: 30px;
		padding-top: 20px;
		input:-webkit-autofill {
			-webkit-box-shadow: 0 0 0px 10px #fff inset !important;
			transition: background-color 50000s ease-in-out 0s;
		}
		.el-form-item {
			width: 280px;
			background: #FFF;
			border-radius: rem(5px);
			color: #454545;
			margin: 0 auto;
			margin-bottom: 10px;
		}
		input {
			background: #fff!important;
			border: 0px;
			-webkit-appearance: none;
			border-radius: 0px;
		}
		.el-input {
			display: inline-block;
			height: 34px;
			font-size: rem(14px);
			color: #CCC;
			input {
				border: 1px solid #ddd;
				padding: rem(4px) rem(5px) rem(4px) rem(10px);
				color: #333;
			}
		}
		.tips {
			font-size: rem(14px);
			color: #fff;
			margin-bottom: rem(10px);
		}
		.img-container {
			// padding: 6px 5px 6px 15px;
			color: $dark_gray;
			vertical-align: middle;
			width: rem(30px);
			text-align: center;
			display: inline-block;
			img {
				position: relative;
				// top: rem(4px);
				left: rem(8px);
				width: rem(20px);
				height: rem(23px);
			}
			&_login {
				font-size: rem(20px);
			}
		}
		.show-pwd {
			position: absolute;
			right: rem(10px);
			top: rem(7px);
			font-size: rem(7px);
			color: $dark_gray;
			cursor: pointer;
		}
		.thirdparty-button {
			position: absolute;
			right: rem(35px);
			bottom: rem(28px);
		}
		#mpanel{
			margin-top: 20px;
		}
		// 按钮
		.el-button {
			width:100%;
			height:34px;
			line-height: 34px;
			font-size: 14px;
			background-color: #52c0c7;
			padding: 0;
			margin-top: 10px;
			span{
				display: block;
				width: 100%;
				height: 34px;
				line-height: 34px;
			}
		}
		.rememberPass {
			.el-checkbox__inner {
				border-color: #ccc;
			}
			.el-checkbox__input {
				margin-top: - rem(3px);
			}
			.el-checkbox__label {
				// height: rem(14px);
				line-height: rem(14px);
				color: #ccc;
			}
			float: left;
			margin-left: rem(10px);
			vertical-align: middle;
			&.is-checked {
				.el-checkbox__inner {
					background-color: #2562a6;
					border-color: #2562a6;
				}
				.el-checkbox__label {
					color: #2562a6;
				}
			}
		}
		// 忘记密码 按钮
		.forgetPass {
			// color: #1d368d;
			float: right;
			margin-right: 10px;
		}
		.passAct {
			color: #52c0c7;
			font-size: rem(14px);
			margin-top: rem(10px);
		}
	}
	
	// 选择账号框
	#selectBox {
		.el-table__body tr.current-row>td {
			background: lighten(#009ee2, 40%);
		}
	}
	
	#forgetBox {
		min-width: rem(480px);
		// 忘记密码
		.title {
			color: #1d368d;
			margin: rem(0px) auto 0 auto;
			text-align: center;
			line-height: rem(58px);
			font-size: rem(24px);
			font-family: 'ios-bold';
		}
		.other {
			width: 100%;
			text-align: left;
			height: 22px;
			line-height: 22px;
			position: relative;
			margin: 10px 0;
			margin-left: rem(100px);
			font-size: 12px;
			span {
				position: absolute;
				top: 0;
				display: block;
				width: rem(60px);
				height: rem(22px);
				line-height: rem(22px);
				text-align: center;
				background: #fff;
			}
			.small {
				/*background: #FF0000;*/
				left: rem(60px);
				border-radius: rem(15px) 0 0 rem(15px);
			}
			.middle {
				/*background: #FF9900;*/
				left: rem(120px);
			}
			.big {
				border-radius: 0 rem(15px) rem(15px) 0;
				/*background: #CCCCCC;*/
				left: rem(180px);
			}
		}
		.el-form-item__content {
			margin-left: 100px;
		}
		.el-form-item__label {
			width: 100px;
			text-align: right;
		}
		.vcInput {
			width: 60%;
		}
		//获取验证码
		#getVerification {
			position: absolute;
			line-height: 32px;
			display: inline-block;
			margin-left: rem(10px);
			background: #33b1e8;
			color: #fff;
			top: rem(1px);
			border-radius: rem(5px);
			padding: 0 rem(15px);
			cursor: pointer;
		}
		.btn {
			padding: 0.45rem 1.5rem;
		}
	}
	.dsh-footer{
		margin-top: 20px;
		margin-bottom: 20px;
		text-align: right;
	}
</style>