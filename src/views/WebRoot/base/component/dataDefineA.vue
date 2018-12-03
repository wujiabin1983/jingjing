<!--商户-数据定义-生命周期-->
<template>
	<div class="dataDefine-container">
		<div class="header">
			新老状态<i></i>
		</div>
		<div class="list">
			<div class="item">
				<div class="item-icon item-newMember">
					<img :src="img.xinhuiyuan"/>
				</div><div class="item-info">
					<div class="item-tit">新会员</div>
					<div class="item-content"><span>入会时间小于等于</span><el-input v-model="form.newCondition" class="item-input item-input-left"></el-input><span>天</span>
					</div>
				</div>
			</div>
			<div class="item">
				<div class="item-icon item-oldMember">
					<img :src="img.laohuiyuan"/>
				</div><div class="item-info">
					<div class="item-tit">老会员</div>
					<div class="item-content"><span>入会时间大于</span><el-input :disabled="true" v-model="form.oldCondition" class="item-input item-input-left"></el-input><span>天</span>
					</div>
				</div>
			</div>
		</div>
		<div class="header">
			会员活跃度<i></i>
		</div>
		<div class="list">
			<div class="item">
				<div class="item-icon item-hyMember">
					<img :src="img.huoyuehuiyuan"/>
				</div><div class="item-info">
					<div class="item-tit">活跃会员</div>
					<div class="item-content"><p>最后一次消费在，</p><el-input v-model="form.activeCondition" class="item-input"></el-input><span>天内</span>
					</div>
				</div>
			</div>
			<div class="item">
				<div class="item-icon item-cmMember">
					<img :src="img.chenmohuiyuan"/>
				</div><div class="item-info">
					<div class="item-tit">沉默会员</div>
					<div class="item-content"><p>最后一次消费在，</p>第<span class="weight">{{silentCondition}}</span>天到<el-input v-model="form.silentCondition" class="item-input"></el-input>天内</div>
				</div>
			</div>
			<div class="item">
				<div class="item-icon item-smMember">
					<img :src="img.shuimianhuiyuan"/>
				</div><div class="item-info">
					<div class="item-tit">睡眠会员</div>
					<div class="item-content"><p>最后一次消费在，</p>第<span class="weight">{{sleepCondition}}</span>天到<el-input v-model="form.sleepCondition" class="item-input"></el-input>天内</div>
				</div>
			</div>
			<div class="item">
				<div class="item-icon item-ylsMember">
					<img :src="img.yuliushihuiyuan"/>
				</div><div class="item-info">
					<div class="item-tit">预流失会员</div>
					<div class="item-content"><p>最后一次消费在，</p>第<span class="weight">{{beLostCondition}}</span>天到<el-input v-model="form.beLostCondition" class="item-input"></el-input>天内</div>
				</div>
			</div>
			<div class="item">
				<div class="item-icon item-lsMember">
					<img :src="img.liushihuiyuan"/>
				</div><div class="item-info">
					<div class="item-tit">流失会员</div>
					<div class="item-content is-required"><p>最后一次消费</p>大于<el-input v-model="form.beLostCondition" :readonly="true" class="item-input"></el-input>天内</div>
				</div>
			</div>
		</div>
		<div class="header">
			有效会员<i></i>
		</div>
		<div class="list-other">
			<div class="item-other">
				<div class="item-title">是否排除流失会员</div>
				<el-radio-group v-model="form.isLoss">
					<el-radio label="是">排除</el-radio>
					<el-radio label="否">不排除</el-radio>
				</el-radio-group>
			</div>
			<div class="item-other">
				<div class="item-title">是否排除粉丝</div>
				<el-radio-group v-model="form.isFans">
					<el-radio label="是">排除</el-radio>
					<el-radio label="否">不排除</el-radio>
				</el-radio-group>
			</div>
		</div>
		<div class="header">
			未及时二回会员<i></i>
		</div>
		<div class="list-other">
			<div class="item-other item-other-long">
				<div class="item-title">未及时二回会员</div>
				<div class="item-content"><span>自首次消费起，第</span><el-input v-model="form.consumeBegin" class="item-input item-input-left"></el-input><span>天到第</span><el-input v-model="form.consumeEnd" class="item-input item-input-left"></el-input><span>天未发生第二次消费的会员</span>
				</div>
			</div>
		</div>
		<el-button type="primary" @click="handleSave" v-if="roleBtn.addLifeCycleInfo || roleBtn.updateLifeCycleInfo">
			保存
		</el-button>

	</div>

</template>
<script>
	import { permission } from '@/utils'
	import laohuiyuan from '@/assets/images/laohuiyuan.png'
	import xinhuiyuan from '@/assets/images/xinhuiyuan.png'
	import huoyuehuiyuan from '@/assets/images/huoyuehuiyuan.png'
	import chenmohuiyuan from '@/assets/images/chenmohuiyuan.png'
	import shuimianhuiyuan from '@/assets/images/shuimianhuiyuan.png'
	import yuliushihuiyuan from '@/assets/images/yuliushihuiyuan.png'
	import liushihuiyuan from '@/assets/images/liushihuiyuan.png'
	/**
	 * 接口信息
	 */
	import { dataDefineShow, dataDefineAdd, dataDefineEdit } from '@/api/base/dataDefine'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				roleBtn: {
					selectLifeCycleInfo: false,
					addLifeCycleInfo: false,
					updateLifeCycleInfo: false
				},
				img:{
					laohuiyuan:laohuiyuan,
					xinhuiyuan:xinhuiyuan,
					huoyuehuiyuan:huoyuehuiyuan,
					chenmohuiyuan:chenmohuiyuan,
					shuimianhuiyuan:shuimianhuiyuan,
					yuliushihuiyuan:yuliushihuiyuan,
					liushihuiyuan:liushihuiyuan
				},
				tableLoading: false,
				form: {
					'newCondition': '', // 新会员条件
					'oldCondition': '', // 老会员条件
					'activeCondition': '', // 活跃会员条件
					'silentCondition': '', // 沉默会员条件
					'sleepCondition': '', // 睡眠会员条件
					'beLostCondition': '', // 预流失会员条件
					'lostCondition': '', // 流失会员条件
					'isLoss': '是', // 是否排除流失会员（是、否）
					'isFans': '是', // 是否排除粉丝（是、否）
					'consumeBegin': '', // 未及时二回会员条件起
					'consumeEnd': '' // 未及时二回会员条件止
				},
				beLostCondition:'-',
				silentCondition:'-',
				sleepCondition:'-',
				id: '',
				version: ''
			}
		},
		components: {

		},
		methods: {
			// 新会员修改
			handleNewCondition(str) {
				this.form.oldCondition = str;
			},
			handleSave() {
				let that = this;
				if(this.form.id != undefined && this.form.version != undefined) {
					// 修改
					if(this.roleBtn.updateLifeCycleInfo) {
						let params = {
							"userId": this.userInfo.userCode,
							"id": this.form.id,
							"version": this.form.version,
							...this.form
						}
						params.lostCondition = params.beLostCondition;
						dataDefineEdit(params)
							.then((res) => {
								// console.log(res);
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.messageType,
									msg = data.messageContent;
								if(code == 'SUCCESS') {
									this.$message.success({
										message: msg
									});
									that.showTable();
								} else {
									this.$message.error({
										message: msg
									});
									that.showTable();
								}
							})
							.catch((err) => {
								// console.log(err);
							});
					}
				} else {
					// 添加
					if(this.roleBtn.addLifeCycleInfo) {
						let params = {
							userId: this.userInfo.userCode,
							...this.form
						}
						params.lostCondition = params.beLostCondition;
						dataDefineAdd(params)
							.then((res) => {
								// console.log(res);
								let data = JSON.parse(Base64.decode(res.data)),
									code = data.messageType,
									msg = data.messageContent;
								if(code == 'SUCCESS') {
									this.$message.success({
										message: msg
									});
									that.showTable();
								} else {
									this.$message.error({
										message: msg
									});
									that.showTable();
								}
							})
							.catch((err) => {
								// console.log(err);
							});
					}
				}

			},
			showTable() {
				if(this.roleBtn.selectLifeCycleInfo) {
					this.tableLoading = true;
					let params = {
						"userId": this.userInfo.userCode
					}
					// 生命周期 - 查询
					dataDefineShow(params)
						.then((res) => {
							// console.log(res);
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
							if(code == 'SUCCESS') {
								if(JSON.stringify(msg) == '{}') {
									return false;
								}else {
									this.form = msg;
								}
								this.tableLoading = false;
							} else {
								this.$message.error(msg);
								this.tableLoading = false;
							}
						})
						.catch((err) => {
							// console.log(err);
						});
				}
			}
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			// 钩子函数 -- 初始化
			this.showTable();
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
		},
		watch: {
			'form.newCondition': function(val) {
				this.form.oldCondition = val;
			},
			'form.activeCondition': function(val) {
				this.silentCondition = parseInt(val)+1;
			},
			'form.silentCondition': function(val) {
				this.sleepCondition = parseInt(val)+1;
			},
			'form.sleepCondition': function(val) {
				this.beLostCondition = parseInt(val)+1;
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.dataDefine-container{
		padding: 10px 20px;
	}
	.header{
		height: 18px;
		line-height: 18px;
		font-size: 16px;
		padding-left: 14px;
		margin-bottom: 24px;
		margin-top: 30px;
		position: relative;
		i{
			width: 5px;
			height: 18px;
			background: #0068b7;
			border-radius: 2px;
			display: block;
			position: absolute;
			left: 0;
			top: 0;
		}
	}
	.list{
		overflow: hidden;
		.item{
			width: 338px;
			height: 110px;
			background: #ffffff;
			float: left;
			margin-right: 30px;
			margin-bottom:30px;
			.item-icon{
				width: 75px;
				height: 110px;
				text-align: center;
				padding-top:28px;
				float:left;
				img{
					display: block;
					margin: 0 auto;
				}
			}
			.item-newMember{
				background: #00a0e9;
			}
			.item-oldMember{
				background: #22ac38;
			}
			.item-hyMember{
				background: #ea68a2;
			}
			.item-cmMember{
				background: #8957a1;
			}
			.item-smMember{
				background: #002e73;
			}
			.item-ylsMember{
				background: #f39800;
			}
			.item-lsMember{
				background: #a6937c;
			}
			.item-info{
				width:262px;
				float:left;
				font-size: 15px;
				padding-left: 10px;
				box-sizing: border-box;
				.weight{
					color:#333;
					padding: 0 2px;
				}
				.item-tit{
					height: 36px;
					line-height: 36px;
				}
				.item-content{
					line-height: 36px;
					color: #b2b2b2;
					span{
						display: inline-block;
					}
					p{
						height: 36px;
					}
					.item-input{
						width: 64px;
						height: 24px;
						margin-right: 10px;
						margin-left: 10px;
						display: inline-block;
						input{
							height: 24px!important;
						}
					}
					.item-input-left{
						margin: 0 10px;
					}
				}
			}
		}
	}
	
	.list-other{
		overflow: hidden;
		.item-other{
			width: 300px;
			height: 110px;
			background: #fff;
			float: left;
			margin-right: 24px;
			margin-bottom:20px;
			.item-title{
				width: 100%;
				height: 36px;
				line-height: 36px;
				background: #eee;
				font-size: 15px;
				padding-left:18px;
				box-sizing: border-box;
			}
			.el-radio-group{
				margin:  30px 20px;
				.el-radio{
					font-size: 16px;
					color: #b2b2b2;
				}
			}
		}
		.item-other-long{
			width:625px;
			.item-content{
				height: 55px;
				line-height: 55px;
				font-size: 16px;
				padding-left: 20px;
				color: #b2b2b2;
				span{
					display: inline-block;
				}
				.item-input{
					width: 54px;
					height: 24px;
					margin-right: 10px;
					display: inline-block;
					input{
						height: 24px!important;
					}
				}
				.item-input-left{
					margin: 0 10px;
				}
			}

		}
	}
</style>
