<!-- 图文素材 - 图片 -->
<template>
	<el-container class="app-container">
		<el-main v-loading="tableLoading">
			<el-tabs tab-position="left" v-model="activeName" class="dsh-tabs" @tab-click="handleTabClick" @tab-add="handleTabAdd(activeName)">
				<el-tab-pane v-for="item in tabsMenu" :key="item.brandId" :label="item.groupName" :name="item.groupId">
					<!-- {{ item.content }} -->
					<!-- 分组操作区域 -->
					<el-header class="contentHeader">
						<div class="floatLeft">
							<span class="activeNameEdit" v-if="activeNameShow">{{activeNameEdit}}</span>
						</div>
					</el-header>
					<!-- 图片素材卡片 -->
					<el-checkbox-group v-model="checked" @change="handleChange" class="dsh-checkbox-group">
						<el-card class="graphicCard" v-for="item in cardItems" :key="item.id">
							<div class="imgBox">
								<video v-if="item.coverUrl" :src="item.coverUrl" controls="controls" width="200"></video>
							</div>
							<div class="cardInfo">
								<el-checkbox :label="item.id" :valie="item.id">{{ item.title }}</el-checkbox>
								<span>{{ item.updateDate }}</span>
							</div>
						</el-card>
					</el-checkbox-group>
				</el-tab-pane>
			</el-tabs>
			<!-- 分页 -->
			<el-footer>
				<el-pagination
					background
					class="pagination"
					layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
					:page-size="limit"
					:page-sizes="[8,40,80,120,160]"
					:total="count"
					@current-change="handleCurrentChange">
				</el-pagination>
			</el-footer>
		</el-main>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	import { mapGetters } from 'vuex'
	import Cookie from 'js-cookie'
	import { uploadImg} from '@/api/base/brandInfo'
	import { MaterialLibraryListShow, MaterialLibraryCardShow, MaterialLibraryCardShow2 } from '@/api/mobile/graphicMaterial'
	export default {
		data() {
			return {
				// 分页
				page: 0, // 当前页
				count: 0, // 总条数
				limit: this.GLOBAL.limit, // 条/页
				// 数据
				activeName: '',
				tabsMenu: [],
				tabIndex: 0, // 选项卡下标
				tabGroupId: '', // masterId
				tabAddBoxShow: false, // 是否显示标签页添加框
				activeNameShow: true, // 是否允许修改选中的标签页
				activeNameEdit: '', // 可重命名的分组名称 , 初始化等于activeName
				checked: [], // 素材项目选择 el-checkbox-group
				checkedIdList: [], // 被选中的卡片id
				checkedAll: false, // 是否全选 多选
				isIndeterminate: false, // 
				cardItems: [],
				tableLoading: false,
			}
		},
		components: {
			// graphicCard
		},
		methods: {
			// 分页
			handleCurrentChange(val) {
				this.page = val; // 获取当前页
				let params = {
					"userId": this.userInfo.userCode,
					"groupId": this.activeName,
					"fileType": "视频"
				}
				this.handleShowCard(params); // 初始化素材卡片
			},
			handleSizeChange(val) {
				this.limit = val;
				let params = {
					"userId": this.userInfo.userCode,
					"groupId": this.activeName,
					"fileType": "视频"
				}
				this.handleShowCard(params); // 初始化素材卡片
			},
			// 方法
			handleShowCard(params) { // 显示素材卡片
				this.tableLoading = true;
//				console.log(JSON.stringify(params))
				MaterialLibraryCardShow2(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.count,
							msg = data.data;
//						console.log(JSON.stringify(msg));
						this.count = data.count;
						let listItems = [];
						msg.forEach(val => {
							listItems.push({
								id: !val.id ? '' : val.id,
								version: !val.version ? '' : val.version,
								fileType: val.fileType,
								coverUrl: val.coverUrl,
								title: val.title,
								updateDate: val.updateDate,
								brandId: val.brandId,
								mediaId: val.mediaId
							});
						})
						this.cardItems = listItems;
						this.tableLoading = false;
					})
					.catch((err) => {
						// this.$message.error(err);
						this.tableLoading = false;
					})
			},
			handleTabClick(obj) { // tag标签页点击
				this.tabAddBoxShow = false; // 如果存在添加选项卡分组添加框，则隐藏之
				this.activeNameEdit = obj.label; // 重命名后的重新定位
				this.tabIndex = obj.index; // 存储当前选中的下标
				this.tabGroupId = obj.name==""?'ALL_COUNT':obj.name; // 存储当前选中的masterId
				this.activeName = obj.name==""?'ALL_COUNT':obj.name;
				let params = {
					"userId": this.userInfo.userCode,
					"groupId": obj.name,
					"fileType": "视频"
				}
				this.handleShowCard(params);
				// 初始化多选
				this.checked = []; // 素材项目选择 el-checkbox-group
				this.checkedIdList = []; // 被选中的卡片id
				this.checkedAll = false; // 是否全选 多选
				this.isIndeterminate = false; // 
			},
			handleMaterialLibraryListShow() { // 素材卡片 显示
				this.tableLoading = true;
				let params = {
					"userId": this.userInfo.userCode,
					"fileType": "视频"
				}
				MaterialLibraryListShow(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							count = data.count,
							msg = data.data;
//						console.log(JSON.stringify(data));
						if(msg.length > 0) {
							let tabsMenuData = [{
								"groupId":"ALL_COUNT",
								"groupName":"所有",
								"qty":"0"
							}];
							msg.forEach((value, index) => {
								tabsMenuData.push({
									...value
								});
							});
							this.tabsMenu = tabsMenuData;
							this.tabsMenu = tabsMenuData;
							this.activeName="ALL_COUNT";
							this.tabGroupId="ALL_COUNT";
							this.activeNameEdit = "所有"; // 重命名后的重新定位
							this.tabIndex = '0'; // 存储当前选中的下标
							let obj = {
								label:this.activeNameEdit,
								index:this.tabIndex,
								name:this.tabGroupId,
							}
							this.handleTabClick(obj);
							this.tableLoading = false;
						} else {
							this.$message.warning(msg);
							this.tableLoading = false;
						}
					})
					.catch((err) => {
						// console.log(err);
						this.tableLoading = false;
					})
			},
			handleChange(value) {
                if(value.length > 1) {
                    value.shift()
				}
				let cardItem = {};
				for(let item of this.cardItems) {
					if(item.id == value[0]) {
						cardItem = item;
					}
				}
                this.$emit('handleChecked', cardItem);
			},
		},
		created() {
			// 权限
			this.roleBtn = permission(this.roleBtn);
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
		},
		directives: {
			focus: {
				// 指令的定义
				inserted: function(el) {
					el.focus()
				}
			}
		},
		watch: {

		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.app-container {
		padding: 0;
	}
	
	.el-main{
		position: relative;
	}
	
	.el-input {
		display: inline-block;
	}
	
	.contentHeader {
		height: 40px!important;
		// padding: 10px;
		span {
			margin-right: 20px;
		}
		span:nth-child(n + 2) {
			cursor: pointer;
			color: #009ee2;
		}
		.contentInput {
			width: 100px;
			height: 16px;
			border: 0;
			padding: 0;
			outline: none;
			border-bottom: 1px solid #2d2d2d;
		}
	}
	
	.floatRight {
		float: right;
	}
	
	.floatLeft {
		float: left;
		height: 32px;
		line-height: 32px;
	}
	
	.el-tabs__item {
		width: 200px!important;
	}
	
	.graphicCard.el-card {
		float: left;
		margin-top: 10px;
		margin-right: 10px;
		width: 220px!important;
		background: #FFF;
	}
	
	.graphicCard .imgBox {
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		width: 200px;
		height: 100px;
		border: 1px solid #CCC;
		img {
			width: 200px;
		}
	}
	
	.graphicCard .cardInfo {
		display: flex;
		justify-content: space-between;
		height: 30px;
		line-height: 30px;
	}
	
	.graphicCard .cardHandle {
		display: flex;
		justify-content: space-between;
		.el-button {
			width: 50%;
		}
	}
	
	.addTabBox {
		display: inline-block;
		position: absolute;
		top: 0;
		left: 130px;
		border: 1px solid #CCC;
		padding: 10px;
		background: #fff;
		z-index: 200;
	}

	/*上传图片*/
	// 上传图片
	.icon-close {
		position: relative;
		display: inline-block;
		.el-icon-circle-close {
			font-size: 14px; 
			position: absolute;
			top: -5px;
			right: -7px;
			color: #fa5555;
			cursor: pointer;
		}
	}
	.componentBox{
		width:426px
	}
	.component{
		position: relative;
		width: 140px;
		height: 140px;
		margin-right: 8px;
		margin-bottom: 8px;
		float: left;
	}
	.componentDelete{
		position: absolute;
		cursor: pointer;
		top: -5px;
		right: -5px;
		font-size: 20px;
		width: 15px;
		height: 15px;
		line-height: 15px;
		text-align: center;
	}
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
		width: 140px;
		height: 80px;
		line-height: 80px;
		text-align: center;
		float: left;
	}
	
	.avatar {
		display: block;
		width: 140px;
		height: 80px;
		border: 1px dashed #d9d9d9;
		border-radius: 8px;
		float: left;
	}
	.avatar:hover {
		border-color: #409EFF;
	}
	.el-form-img {
		width: 100%;
		text-align: center;
	}
	
	.dsh-tabs{
		position: relative;
		min-height: 200px;
	}
	.activeNameEdit{
		vertical-align: center;
	}
	.dsh-checkbox-group{
		height: 346px;
		overflow-x:hidden;
		overflow-y: auto;
	}
</style>