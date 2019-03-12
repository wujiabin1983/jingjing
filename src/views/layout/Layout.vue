<template>
    <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
        <!-- <div class="heade-wrapperr">
            <div class="logo"><img :src="logo"/></div>
            <navbar @handleNavId="handleNavId" @handleSwitch="handleSwitch"></navbar>
           
        </div> -->
         <el-dialog class="dialogOne" title="账号管理" :visible.sync="dialogVisible" append-to-body width="70%">
                <h3>{{this.userInfo.userCode}}</h3>
                <el-table border ref="singleTable" class="tableData noBgColorTable" :data="tableData" highlight-current-row @current-change="handleCurrentChange" v-loading="tableLoading">
    				<el-table-column type="index" width="50"> </el-table-column>
    				<el-table-column property="userName" label="账号" width="120"></el-table-column>
    				<el-table-column property="userCode" label="员工工号" width="120"></el-table-column>
    				<el-table-column property="realName" label="用户名"></el-table-column>
    				<el-table-column property="userRoleName" label="角色"></el-table-column>
    				<el-table-column property="storeName" label="所属门店"> </el-table-column>
    				<el-table-column property="brandName" label="所属品牌"> </el-table-column>
    			</el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleSure">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog  class="dialogTwo" title="修改密码"  :visible.sync="dialogVisible2"   append-to-body width="38%">
                <el-form id="forgetBox" :rules="findPassRules"  label-width="95px" autoComplete="on" :model="form"  v-loading="setPasswordLoding" ref="findPassRules" label-position="left" class="card-box login-form">
                    <el-form-item label="手机号码" prop="mobile">
                        <el-input v-model="form.mobile" ref="moblie" class="moblie" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="验证码" prop="verificationCode">
                        <el-input v-model="form.verificationCode" class="vcInput" placeholder="请输入验证码"></el-input><span id="getVerification" ref="code" @click="getVCode" class="verification" data-ver="true">{{text}}</span>
                    </el-form-item>-->
                    <el-form-item label="设置新密码" prop="newPassWord">
                        <el-input type="password" v-model="form.newPassWord" placeholder="请输入密码" class="password" @blur="inputOnBlur"></el-input>
                    </el-form-item>
                    <p class="other">密码强度<span class="small">弱</span><span class="middle">中</span><span class="big">强</span></p>
                    <el-form-item label="确认新密码" prop="confirmPassword">
                        <el-input type="password" v-model="form.confirmPassword" placeholder="请输入密码" class="resetPassword"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer overHidden">
                    <el-button @click="closeBtn">取 消</el-button>
                    <el-button type="primary" @click="onSubmit">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog  class="dialogTwo" title="个人信息"  :visible.sync="dialogVisible3"   append-to-body width="38%">
                <ul class="personalInfo">
                    <li>
                        <label>登录账号</label>
                        <span>{{personalInfo.loginId}}</span>
                    </li>
                    <li>
                        <label>员工姓名</label>
                        <span>{{personalInfo.userName}}</span>
                    </li>
                    <li>
                        <label>所属品牌</label>
                        <span>{{personalInfo.brandName}}</span>
                    </li>
                    <li>
                        <label>性别</label>
                        <span>{{!personalInfo.sex ? '无' : personalInfo.sex}}</span>
                    </li>
                    <li>
                        <label>员工类型</label>
                        <span>{{!personalInfo.userType ? '无' : personalInfo.userType}}</span>
                    </li>
                    <li>
                        <label>年龄</label>
                        <span>{{!personalInfo.age ? '无' : personalInfo.age}}</span>
                    </li>
                    <li>
                        <label>工作地址</label>
                        <span>{{!personalInfo.wordAddress ? '无' : personalInfo.wordAddress}}</span>
                    </li>
                </ul>
                <div slot="footer" class="dialog-footer overHidden">
                    <el-button @click="dialogVisible3 = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible3 = false">确 定</el-button>
                </div>
            </el-dialog>
        <div class="sidebar-wrapper" :style="{backgroundImage: 'url(' + nav_bg + ')'  }">
            <div class="siderbar-user-wrap">
                <div class="user-info">
                    <div class="avatar-box">
                        <img class="user-avatar" src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80">
                    </div>
                    <div class="user-name">
                        {{!userInfo.userCode ? username : userInfo.userCode}}
                    </div>
                </div>
                <el-dropdown trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        <img class="icon" :src="require('@/assets/membershipgrouping_more.png')" alt="">
                        <!-- <i class="el-icon-arrow-down el-icon-tickets"></i> -->
                    </span>
                    <el-dropdown-menu slot="dropdown" >
                        <el-dropdown-item command="首页">
                            <router-link class='inlineBlock' to="/">主页</router-link>
                        </el-dropdown-item>
                         <el-dropdown-item command="个人信息" v-if="userInfo.userType == 'EMPLOYEE' && userInfo.userCode != ''">个人信息</el-dropdown-item>
                        <el-dropdown-item v-if="userInfo.userType == 'EMPLOYEE'||userInfo.userType == 'SELLER' && userInfo.userCode != ''" command="切换账号">切换账号</el-dropdown-item>
                        <el-dropdown-item command="修改密码">修改密码</el-dropdown-item>
                        <el-dropdown-item divided command="退出">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="sidebar-container">
                <sidebar  :handleNavId="navId"></sidebar>
            </div>
            
            <!-- <div class="sidebar-bg">
                <img :src="sidebarBg" alt="">
            </div> -->
        </div>
        <div class="main-container">
            <!-- <navbar></navbar>  main-container1-->
            <app-main></app-main>
        </div>
    </div>
    <!-- <el-container>
        <el-header>
            <navbar></navbar>
        </el-header>
        <el-container>
            <el-aside width="150px">
                <sidebar class="sidebar-container"></sidebar>
            </el-aside>
            <el-main>
                <app-main></app-main>
            </el-main>
        </el-container>
    </el-container> -->
</template>


<script>
import { Navbar, Sidebar, AppMain } from '@/views/layout'
import { isvalidUsername, validateMobile,validatePassword } from '@/utils/validate';
import sidebarBg from '@/assets/pictures.png'
import sidebarBg2 from '@/assets/585f884.jpg'
import nav_bg from '@/assets/nav_bg.png'
import { importStaffManagement } from '@/api/base/staffManagement.js'
import logo from '@/assets/logo.png'
// cookies
import Cookies from 'js-cookie'
// vuex
import { mapGetters } from 'vuex'
import router from '@/router'
const isMobiles = (rule, value, callback) => {
	if(!validateMobile(value)) {
		callback(new Error('请输入正确的手机号码'))
	} else {
		callback()
	}
}
const isPassword = (rule, value, callback) => {
	if(!validatePassword(value)) {
		callback(new Error('密码为至少6位的数字或字母'))
	} else {
		callback()
	}
}
import { getCode, login, selectAccount, forgotPass, cutAccount } from '@/api/login';
export default {
  name: 'layout',
  data() {
	var isPasswordRes = (rule, value, callback) => {
        if (value === '') {
          	callback(new Error('请再次输入密码'));
        } else if (value !== this.form.newPassWord) {
          	callback(new Error('两次输入密码不一致!'));
        } else {
          	callback();
        }
    };
    return {
    	logo:logo,
        // 个人信息
        personalInfo: '',
        //左侧导航
        isSidebar:false,
        // 切换账号
        dialogVisible: false,
        tableData: [],
        // 选择账号
        radio: null,
        tableLoading: false,

		setPasswordLoding:false,
        navId: 1,
        //   图片
        sidebarBg,
        sidebarBg2,
        nav_bg: nav_bg,
        sidebarBgStyle: {
            'background-image': 'url(' + sidebarBg + ')',
            'background-repeat': 'no-repeat'
        },

        dialogVisible2: false,
        dialogVisible3: false,
        text: '获取验证码',
        // 找回密码
        form: {
            mobile: '',
            newPassWord: '',
            confirmPassword: '',
            desc: ''
        },
        findPassRules: {
            mobile: [{ required: true, message: '请输入手机号码', trigger: 'change' },{validator: isMobiles}],
            verificationCode: [{ required: true, message: '请输入验证码', trigger: 'change' }],
            newPassWord: [{ required: true, message: '请输入新密码', trigger: 'change' }, {validator: isPassword}],
            confirmPassword: [{ required: true, message: '请再一次输入新密码', trigger: 'change' }, {validator: isPasswordRes}],
        },
    }
  },
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    ...mapGetters([
        'sidebar',
        'avatar',
        'userInfo',
        'employeeNum'
    ])
  },
    methods: {
    	closeBtn(){
    		this.dialogVisible2 = false;
    		this.form.mobile='';
    		this.form.verificationCode='';
    		this.form.newPassWord='';
    		this.form.confirmPassword='';
    	},
        // 选择账号
        handleCurrentChange(val) {
            this.radio = val;
        },
        handleSure() {
            this.tableLoading = true;
            let that = this;
            if(!this.radio) {
           	 	this.tableLoading = false;
                this.$message.warning('请选择账号');
                return false;
            }
            let res = this.radio;
            let params = {
                "userName": res.userName,
                "userCode": res.userCode,
            }
            sessionStorage.setItem('loginRadio', JSON.stringify(params));
            this.$store.dispatch('LogOut').then((res) => {
                selectAccount(params)
                    .then((res) => {
                        let data = JSON.parse(Base64.decode(res.data));
                        if(data.messageType == 'SUCCESS') {
                            // 权限
                            setTimeout(function() {
                                // 权限
                                let userType = data.messageContent.userType;
                                if(userType == 'EMPLOYEE') {
                                    let roles = JSON.stringify(data.messageContent.roleMenu);
                                    let rolesTop = data.messageContent.platformMenu;
                                    // console.log(roles);
                                    that.tableLoading = false;
                                    let storeUserInfo = {
                                        userType: data.messageContent.userType, // 用户类型
                                        userCode: data.messageContent.userCode //用户代码
                                    }
                                    // 将数据存储在 cookie 里面
									sessionStorage.setItem('userId', data.messageContent.userCode);
                                    Cookies.set('userType', data.messageContent.userType);
									sessionStorage.setItem('userType', data.messageContent.userType);
                                    Cookies.set('userCode', data.messageContent.userCode);
                                    Cookies.set('roles', roles);
                                    Cookies.set('rolesTop', rolesTop); // 顶部导航
                                    // result = data.returnMsg.result;
                                    // 将数据存储在 vuex 里面
                                    that.$store.dispatch('Roles', roles); // 权限
                                    that.$store.dispatch('Login', storeUserInfo);
                                    that.$store.dispatch('Router', JSON.stringify(data.messageContent.asyncRouterMap.SUCCESS)); // 路由全新权限
                                    // console.log(data.messageContent.userInfo.userCode, 'data.messageContent.userInfo.userCode');
                                    that.$store.dispatch('GetEmplayeeNum', data.messageContent.userInfo.userCode); // 员工编号
                                    sessionStorage.setItem('GetEmplayeeNum', data.messageContent.userInfo.userCode);
                                    // alert(1)
                                    that.$store.dispatch('LoginTip', data.messageContent.loginTip);
                                    sessionStorage.setItem('router', that.$store.getters.router);
                                    that.$router.push({ path: '/' });
                                    // that.$router.push({ path: '/' });
                                }else {
                                    let roles = JSON.stringify(data.messageContent.roleMenu);
                                    let rolesTop = data.messageContent.platformMenu;
                                    // console.log(roles);
                                    that.tableLoading = false;
                                    let storeUserInfo = {
                                        userType: data.messageContent.userType, // 用户类型
                                        userCode: data.messageContent.userInfo.userName //用户代码
                                    }
                                    sessionStorage.setItem('userInfoUserName', data.messageContent.userInfo.userName);
                                    //  console.log(data, 'loginData');
                                    // 将数据存储在 cookie 里面
									sessionStorage.setItem('userType', data.messageContent.userType);
                                    Cookies.set('userType', data.messageContent.userType);
                                    Cookies.set('userCode', data.messageContent.userInfo.userName);
                                    Cookies.set('roles', roles);
                                    Cookies.set('rolesTop', rolesTop); // 顶部导航
                                    // result = data.returnMsg.result;
                                    // 将数据存储在 vuex 里面
                                    that.$store.dispatch('Roles', roles); // 权限
                                    that.$store.dispatch('Login', storeUserInfo);
                                    that.$store.dispatch('Router', JSON.stringify(data.messageContent.asyncRouterMap.SUCCESS)); // 路由全新权限
                                    // console.log(data.messageContent, 'loginTui');
                                    that.$store.dispatch('LoginTip', data.messageContent.loginTip);
                                    sessionStorage.setItem('router', that.$store.getters.router);
                                    that.$router.push({ path: '/' });
                                }
                                that.tableLoading = false;
                                that.dialogVisible = false;
                            }, 40);
                            setTimeout(function () {
                                location.reload();
                            }, 60);
                        }else{
                        	that.tableLoading = false;
                            that.$message.warning(data.messageContent);
                        }
                    })
                    .catch((err) => {
//                  	console.log(err)
                        this.tableLoading = false;
                    })
            })
            
        },
        handleNavId(navId) {
			this.$nextTick(function() {
				if(navId!=0){
					this.isSidebar=true;
		    		document.querySelector(".main-container").setAttribute("class","main-container");
				}
	            this.$data.navId = navId;
          	})
        },
        handleCommand(command) {
            if(command == '退出') {
                //this.logout();
                //return
                sessionStorage.removeItem('loginRadio')
                sessionStorage.removeItem('roles')
                sessionStorage.removeItem('router')
                sessionStorage.removeItem('userAccount')
                sessionStorage.removeItem('GetEmplayeeNum')
                sessionStorage.removeItem('userId')
                sessionStorage.removeItem('userToken')
                sessionStorage.removeItem('userType')
                router.push({
                    path: '/login'
                });
            }
            this.handleSwitch(command)

        },
        handleSwitch(str) {
            let that = this;
            if(str == '切换账号') {
                this.showTable();
            }
            if(str == '个人信息') {
                // this.$router.push({
                //     name: '员工管理'
                // });
                let params = {
                    userId: this.userInfo.userCode,
                    userCode: this.employeeNum
                }
                let userCode = !this.employeeNum ? sessionStorage.getItem('GetEmplayeeNum') : this.employeeNum;
                importStaffManagement(params)
                    .then((res) => {
                        let data = JSON.parse(Base64.decode(res.data)),
                            count = data.count,
                            msg = data.data;
//                      console.log(msg);
                        if(count > 0) {
                            msg.forEach((val, index) => {
                                if(val.userCode == userCode) {
                                    that.dialogVisible3 = true;
                                    that.personalInfo = val;
                                }
                            });
                        }
                        
                    })
                    .catch((err) => {
//                      console.log(err);
                    });
            }
            if(str == '修改密码') {
                this.dialogVisible2 = true;
            }
        },
        showTable() {
            // this.tableData = JSON.parse(sessionStorage.getItem('userAccount'));
            let res = JSON.parse(sessionStorage.getItem('loginRadio'));
            // let res = Cookies.get('loginRadio');
            let params = {
                userId: res.userName,
                userCode: res.userCode
            }
            cutAccount(params)
                .then((res) => {
                    let data = JSON.parse(Base64.decode(res.data)),
                        code = data.messageType,
                        msg = data.messageContent,
                        val = data.valueObj;
                    if(code == 'SUCCESS') {
                        this.tableData = msg.result;
                        if(this.tableData.length == 0) {
                            this.$message('当前没有可切换账号');
                        }else {
                            this.dialogVisible = true;
                        }
                    }else {
                        this.$message.error(msg);
                    }
                })
        },
        handleSwitchClose() {
        },
//      getVCode() {
//          // 获取验证码
//          var mobile = this.form.mobile;
//          if(!validateMobile(mobile)) {
//              this.$message.warning('请输入正确的手机号码');
//          }else {
//              // this.$message.success('正确');
//              let that = this;
//              getCode({mobile})
//                  .then(function(res) {
//                      let data = JSON.parse(Base64.decode(res.data));
//                      // console.log(JSON.stringify(data))
//                      // console.log(data.messageContent)
//                      if(data.messageType == 'SUCCESS') {
//                          that.$message.success(data.messageContent);
//                      }else {
//                          that.$message.warning(data.messageContent);
//                      }
//                  })
//                  .catch(function(err) {
//                      that.$message.error('系统繁忙！请稍后重试！');
//                  });
//          }
//
//      },
        //验证密码强度
        inputOnBlur() {
            var value = document.querySelector(".password input").value;
            var score = 0;
            // 含有数字
            if(/\d+/.test(value)) {
                score++;
            }
            // 大小写字母
            if(/[A-Z]/.test(value)||/[a-z]/.test(value)) {
                score++;
            }
            // 特殊字符
            if(/.[!, @, #, $, %, ^, &, *, ?, _, +, ~, -, (,)]/.test(value)) {
                score++;
            }
            if(value != "") {
                if(value.length >5) {
                    if(score == 1) {
                        document.querySelector(".small").style.backgroundColor = "#FF0000";
                        this.$message.warning('密码至少包含一个英文字母');
                    }
                    if(score == 2) {
                        document.querySelector(".small").style.backgroundColor = "#FF0000";
                        document.querySelector(".middle").style.backgroundColor = "#FF9900";
                    }
                    if(score == 3) {
                        document.querySelector(".small").style.backgroundColor = "#FF0000";
                        document.querySelector(".middle").style.backgroundColor = "#FF9900";
                        document.querySelector(".big").style.backgroundColor = "#CCCCCC";
                    }
                } else {
                    // document.querySelector(".passwordFalse").click();
                }
            } else {
                // document.querySelector(".passwordNo").click();
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
            this.$refs.findPassRules.validate((valid) => {
                if (valid) {
                	that.setPasswordLoding=true;
                    let params = {
                        mobile: this.form.mobile,
                        verificationCode: this.form.verificationCode,
                        newPassWord: this.form.newPassWord,
                        confirmPassword: this.form.confirmPassword,
                        type: this.userInfo.userType == 'SELLER' ? '商户' : '员工'
                    }
                    forgotPass(params)
                        .then(function(res) {
                            let data = JSON.parse(Base64.decode(res.data));
                            if(data.messageType == 'SUCCESS') {
                                that.form= {
                                    mobile: '',
                                    newPassWord: '',
                                    confirmPassword: '',
                                }
                                that.showSwitch = 'login';
    							that.dialogVisible2 = false;
                                that.$message.success('修改密码成功！');
                            }else {
                                that.$message.warning(data.messageContent);
                            }
                			that.setPasswordLoding=false;
                        })
                        .catch(function(err) {
                			that.setPasswordLoding=false;
//              			console.log(err)
                            that.$message.error('系统繁忙！请稍后重试！');
                        });
                }
            });
            
        },
    },
  created() {
      	let that = this;
        let userCode = Cookies.get('userCode');
        let userType = Cookies.get('userType');
        let rolesTop = Cookies.get('rolesTop');
        // console.log(rolesTop, 'rolesTop');
        // let userCode = this.userInfo.userCode;
        // console.log(userCode);
        if(typeof userType == 'undefined' || userType == '') {
            this.$message.error('用户会话已经过期或未登录!请重新登陆!');
            setTimeout(function() {
                that.$router.push({ path: '/login' });
            }, 1000);
        }else {
            let storeUserInfo = {
                userCode: Cookies.get('userCode'),
                userType: Cookies.get('userType')
            }
            that.$store.dispatch('Roles', Cookies.get('roles')); // 权限
            that.$store.dispatch('Login', storeUserInfo);
            that.$store.dispatch('RolesTop', JSON.parse(rolesTop));
        }
		this.$nextTick(function() {
			// if(sessionStorage.getItem('loginType')){
			// 	this.isSidebar=false;
			// 	sessionStorage.removeItem('loginType');
            //     document.querySelector(".main-container").setAttribute("class","main-container main-container1");
			// }else{
                this.isSidebar=true;
				document.querySelector(".main-container").setAttribute("class","main-container");
			// }
		})

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";
    @import "src/styles/_function.scss";
    $sideWidth: 200px;
    $top: 49px;
    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
        
        &.hideSidebar {
            .sidebar-wrapper {
                transform: translate(-140px, 0);
                .sidebar-container {
                    transform: translate(132px, 0);

                }
                &:hover {
                    transform: translate(0, 0);
                    .sidebar-container {
                        transform: translate(0, 0);
                    }
                }


            }
            .main-container {
                margin-left: 40px;
            }
        }
        .heade-wrapperr {
            z-index: 999!important;
            .logo {
                position: fixed;
                z-index: 800;
                width: $sideWidth;
                height: $top;
                line-height: $top;
                text-align: center; // 临时
                font-weight: bold;
                color: #FFF;
                img{
	                width: 70%;
	                display: block;
	                margin: 9px auto;
                }
            }
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: $top;
            z-index: 699;
            white-space: nowrap;
            & > ul {
                padding-left: $sideWidth;
                background: #2f4050; /* 标准的语法 */
                border-bottom: 1px solid #2f4050;
                li {
                    white-space: nowrap;
                }
            }
        }
        // jj
        
        .siderbar-user-wrap{
            height:154px;
            text-align: center;
            position: relative;
            // background-image: linear-gradient(#28292a, #28292a), linear-gradient(#ffffff, #ffffff);
            .user-info{
                position:absolute;
                top:50%;
                left:50%;
                transform: translate(-50%,-50%)
            }
            .avatar-box{
                width:50px;
        
                margin:0 auto;
                overflow: hidden;
                img{
                    width:100%;
                    border-radius: 50%;
                }
            }
            .user-name{
                color: #0fa1d3;
                margin-top: 10px;
            }
            .el-dropdown{
                position: absolute;
                right:10px;
                bottom: 20px;
                .el-icon-arrow-down{
                    color:#fff;
                    font-size: 20px;
                }
            }

        }
        .sidebar-wrapper {
            width: $sideWidth;
            height:100%;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 1001;
            overflow: hidden;
            transition: all .28s ease-out;
            //background:url('../../assets/nav_bg.png') 50% 50%/cover no-repeat;
            //background-position: 50% 50%; 　
　　        //background-size: cover;
            //background-repeat: repeat-y;
            .sidebarBg {
                position: absolute;
                left: 0;
                bottom: 0;
                opacity: .2;
            }
        }
        .sidebar-container {
            transition: all .28s ease-out;
            height: calc(100% - 154px);
            top: 0;
            bottom: 0;
            left: 0;
            right: - rem(17px);
            overflow-y: scroll;
            overflow-x: hidden;
            z-index: 20;
            &::-webkit-scrollbar {
                display: none;
            }
        }
        .main-container {
            // margin-top: $top;
            min-height: 100%;
            transition: all .28s ease-out;
            margin-left: $sideWidth;
            // margin-top: 50px;
            & > ul {
                position: fixed;
                top: 0;
            }
        }
        .main-container1 {
        	margin-left: 0;
        }

        .sidebar-bg {
            width: 100%;
            height: 100%;
            position: absolute;
            bottom: 0;
            z-index: 10;
            // opacity: 0.2;
            background-color: #2f4050;
            background-position: 0 300px;
            img {
                // width: 100%;
                height: 50%;
                position: absolute;
                bottom: 0;
                opacity: 0.3;
            }
        }
    }
// 登陆框
.login-form {
    // position: absolute;
    // top: 50%;
    // left: 50%;
    max-width: rem(800px);
    min-width: rem(480px);
    // transform: translate(-50%, -50%);
    padding: 0 rem(45px) 0 rem(45px);
    // background: rgba(225, 225, 225, 0.8);
    // border-radius: rem(15px);
    // z-index: 1000;
}
#forgetBox {
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
            border: 1px solid #eee;
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
        width: 75%;
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
.personalInfo {
    list-style: none;
    label {
        display: inline-block;
        width: 90px;
    }
}
</style>
