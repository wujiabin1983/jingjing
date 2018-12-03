// 预置活动模板 - 新建模板 - 微信卡券自定义入口设置
<template>
	<el-form :model="form" ref="form" label-width="140px" class="demo-form">
		<el-form-item label="自定义入口" prop="entry1">
			<div>
				<span>入口名称</span>
				<el-input v-model="customEntry.name" :disabled="true" placeholder="请输入入口名称"></el-input>
				<span>链接到</span>
				<span class="customEntryUrl">{{ this.customEntry.url }}</span>
				<el-button type="primary" size="small" @click="selectLink()">请选择链接</el-button>
			</div>
		</el-form-item>
		<!--<el-form-item label="" prop="entry2">
            <div>
                <span>入口名称</span>
                <el-input v-model="form.entry2" placeholder="请输入入口名称"></el-input>
                <span>链接到</span>
                <el-button type="primary" size="small">请选择链接</el-button>
            </div>
        </el-form-item>
        <el-form-item label="" prop="entry3">
            <div>
                <span>入口名称</span>
                <el-input v-model="form.entry3" placeholder="请输入入口名称"></el-input>
                <span>链接到</span>
                <el-button type="primary" size="small">请选择链接</el-button>
            </div>
        </el-form-item>-->
		<el-button type="primary" class="marginTop10" @click="prev">上一步</el-button>
		<el-button type="primary" class="marginTop10" @click="finish">完成</el-button>
		<el-dialog title="请选择链接地址" :visible.sync="dialogVisible" width="30%">
			<div>
				<customEntry ref="customEntry"></customEntry>
			</div>
			<span slot="footer" class="dialog-footer">
	    <el-button @click="dialogVisible = false">取 消</el-button>
	    <el-button type="primary" @click="handleCommit">确 定</el-button>
	  </span>
		</el-dialog>
	</el-form>
</template>
<script>
	import { permission } from '@/utils'
	// 手机号、固定电话、邮箱
	import { validateMobile, validateTel, validateEmail } from '@/utils/validate';
	import { getBrandInfo } from '@/api/public'
	import { addElectronic, setElectronic } from '@/api/base/electronic'
	import { mapGetters } from 'vuex'
	import Cookie from 'js-cookie'
	import customEntry from '@/components/common/customEntry'
	export default {
		data() {
			return {
				roleBtn: {
					selectElectronicRuleInfo: false,
					addElectronicRuleInfo: false,
					updateElectronicRuleInfo: false
				},
				dialogVisible: false,
				brandId: '',
				brandName: '',
				// form表单数据
				form: {
					customEntry: ''
				},
				customEntry: {
					name:'',
					url:''
				},
				entryIndex: 0,
			}
		},
		components: {
			customEntry
		},
		methods: {
			handleCommit() {
				this.dialogVisible = false;
				let selected = this.$refs.customEntry.handleAdd();
				this.customEntry.name = selected.name;
				this.customEntry.url = selected.url;
			},
			selectLink() {
				this.dialogVisible = true;
			},
			prev() {
				this.$emit('message2', '1');
			},
			finish() {
				let that = this;
				let params = {
					userId: this.userInfo.userCode,
					electronicRule: {
						brandId: this.brandId,
						brandName: this.brandName,
						...JSON.parse(sessionStorage.getItem("dataOnes")),
					},
					wechatCoupons: {
						brandId: this.brandId,
						brandName: this.brandName,
						...JSON.parse(sessionStorage.getItem("dataTwos")),
						customEntry:JSON.stringify(this.customEntry)
					}
				}
				delete params.wechatCoupons.createdOn
				delete params.electronicRule.createdOn

				delete params.wechatCoupons.modifiedOn
				delete params.electronicRule.modifiedOn

//				 console.log(JSON.stringify(params))
				if(sessionStorage.getItem("type")) {
					if(sessionStorage.getItem("type") == "修改") {
						if(this.roleBtn.updateElectronicRuleInfo) {
							setElectronic(params)
								.then(function(res) {
									//								console.log(res)
									let data = JSON.parse(Base64.decode(res.data));
																	// console.log(JSON.stringify(data))
									if(data.messageType == 'SUCCESS') {
										sessionStorage.removeItem("dataOnes");
										sessionStorage.removeItem("dataTwos");
										that.$emit('message2', '0');
										that.$message({
											message: data.messageContent,
											type: 'success'
										});
									} else {
										that.$message({
											message: data.messageContent,
											type: 'warning'
										});
									}
								})
								.catch(function(err) {
									// console.log(err);
								});
						}
					} else {
						if(this.roleBtn.addElectronicRuleInfo) {
							addElectronic(params)
								.then(function(res) {
									let data = JSON.parse(Base64.decode(res.data));
									// console.log(data)
									if(data.messageType == 'SUCCESS') {
										sessionStorage.removeItem("dataOnes");
										sessionStorage.removeItem("dataTwos");
										that.$emit('message2', '0');
										that.$message({
											message: data.messageContent,
											type: 'success'
										});
									} else {
										that.$message({
											message: data.messageContent,
											type: 'warning'
										});
									}
									//								console.log(data)
								})
								.catch(function(err) {
									// console.log(err);
								});
						}
					}
				}

			}
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
			var params = {
				userId: this.userInfo.userCode
			}
			let that = this;
			getBrandInfo(params)
				.then(function(res) {
					let data = JSON.parse(Base64.decode(res.data));
					if(data.messageType == 'SUCCESS') {
						that.brandId = data.messageContent.brandId;
						that.brandName = data.messageContent.brandName;
					}
				})
				.catch(function(err) {
					// console.log(err);
				});
			if(sessionStorage.getItem("type")) {
				if(sessionStorage.getItem("type") == "修改") {
					let data = sessionStorage.getItem("data");
					// console.log(JSON.parse(data).wechatCoupons)
					this.form = JSON.parse(data).wechatCoupons;
					this.customEntry=JSON.parse(data).wechatCoupons.customEntry;
				}
			}
		},
		computed: {
			// 计算属性
			//登录时候缓存的用户类型和用户代码
			...mapGetters([
				'userInfo',
			]),
			getPageType() {
				return this.$route.params.pageType;
			},
			getFormData() {
				return this.$route.params.formData;
			}
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-input {
		width: rem(200px);
	}
	
	.el-select {
		width: 100%;
	}
	/*// 上传图片*/
	
	.avatar-uploader .el-upload {
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		border: 1px dashed #d9d9d9;
		border-radius: 8px;
		width: 134px;
		height: 134px;
		line-height: 134px;
		text-align: center;
	}
	
	.avatar {
		display: block;
		width: 134px;
		height: 134px;
		border: 1px dashed #d9d9d9;
		border-radius: 8px;
	}
	
	.avatar:hover {
		border-color: #409EFF;
	}
	
	// 核销方式
	.verificationModeBox {
		float: left;
		margin-right: 10px;
	}
	.el-form{
		width:auto;
	}
	.verificationModeBox>div {
		width: 120px;
		height: 80px;
		padding: 10px;
		border: 1px solid #000;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.customEntryUrl{
		color: blue;
	}
</style>