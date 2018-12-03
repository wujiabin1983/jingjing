 // 移动管理 - 自定义菜单
<template>
	<div class="btn3 clearfix" v-loading="boxLoading">
		<!--循环展示菜单信息-->
		<div class="menu" v-for="(item, index) in buttonItems" :key="item.name" @click="handleNav(index, $event)">
			<div class="bt-name">
				<!--判断菜单信息，如果主菜单的name不是+号或者有子菜单信息则显示name-->
				<a href="javascript:;" v-if="(item.name != '+') || (item.sub_button != undefined)" id="menu" :data-index="index">{{item.name}}</a>
				<!-- 一般情况不会出现下面的情况 -->
				<a href="javascript:;" v-else id="menu">{{item.name}}</a>
			</div>
			<div style="display: none;" v-if="(item.name == '+') || (item.sub_button == undefined)"></div>
			<div v-else>
				<div class="triangle"></div><!--右下角三角形-->
				<div class="new-sub" v-show="isNavShow[index]">
					<!--<ul v-for="subItem in item.sub_button" :key="item.sub_button.name">
						<li>
							<a href="javascript:;" id="subMenu" :data-index="index" :title="subItem.name">{{ subItem.name }}</a>
						</li>
					</ul>-->
					<table border="0" class="el-tableThree" cellspacing="0">
						<tbody>
							<tr v-for="subItem in item.sub_button" :key="item.sub_button.name">
								<!--{{subItem}}-->
								<td id="subMenu" :data-index="index" :title="subItem.name">{{subItem.name}}</td>
								<td v-if="subItem.name!='+'">
									<i class="el-icon-rank icon-rank moveIcon"></i>
								</td>
							</tr>
						</tbody>
					</table>
					<div class="tiggle"></div>
					<div class="innertiggle"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { mapGetters } from "vuex";
	import { customizeMenuShow, customizeMenuAdd, customizeMenuEdit } from '@/api/mobile/customizeMenu' 
	import Sortable from 'sortablejs' // 排序
	//344 345 346
	export default {
		props: ['childData', 'clickName', 'childType', 'childContent'],
		data() {
			return {
				boxLoading: false,
				isNavShow: [false, false, false],
				buttonItems: [],//菜单信息存放容器
				pushItems: [], // 用于上传的备份数组
				targetMenu: '', // 选中的元素
				mainIndex: '', // 主菜单下标
				mainLength: '', // 主菜单长度
				subMenuIndex: '', // 子菜单下标
				subMenuLength: '', // 子菜单长度 
				type: '', // 按钮类型
				sortable: null,
				tableDataCopy:[]
			};
		},
		methods: {
			setSort() { // 排序
				const el = $('.el-tableThree > tbody');
				if(el.length==0){
					return false;
				}
				this.sortable = Sortable.create(el[0], {
					setData: function(dataTransfer) {
						dataTransfer.setData('Text', '')
					},
					onEnd: evt => {
						var arrText=[];
						el[0].childNodes.forEach((val,index)=>{
							if(val!="+"){
								arrText.push(val.children[0].innerHTML)
							}
						})
						var oldArr=this.buttonItems[0].sub_button;
						var newArr = [];
						arrText.forEach((val,index)=>{
							oldArr.forEach((val1,index1)=>{
								if(val==val1.name){
									newArr.push(val1);
								}
							})
						})
						sessionStorage.setItem("listSort1",JSON.stringify(newArr));
					}
				});
				if(el.length<2){
					return false;
				}
				this.sortable = Sortable.create(el[1], {
					setData: function(dataTransfer) {
						dataTransfer.setData('Text', '')
					},
					onEnd: evt => {
						var arrText=[];
						el[1].childNodes.forEach((val,index)=>{
							if(val!="+"){
								arrText.push(val.children[0].innerHTML)
							}
						})
						var oldArr=this.buttonItems[1].sub_button;
						var newArr = [];
						arrText.forEach((val,index)=>{
							oldArr.forEach((val1,index1)=>{
								if(val==val1.name){
									newArr.push(val1);
								}
							})
						})
						sessionStorage.setItem("listSort2",JSON.stringify(newArr));
					}
				});
				
				if(el.length<3){
					return false;
				}
				this.sortable = Sortable.create(el[2], {
					setData: function(dataTransfer) {
						dataTransfer.setData('Text', '')
					},
					onEnd: evt => {
						var arrText=[];
						el[2].childNodes.forEach((val,index)=>{
							if(val!="+"){
								arrText.push(val.children[0].innerHTML)
							}
						})
						var oldArr=this.buttonItems[2].sub_button;
						var newArr = [];
						arrText.forEach((val,index)=>{
							oldArr.forEach((val1,index1)=>{
								if(val==val1.name){
									newArr.push(val1);
								}
							})
						})
						sessionStorage.setItem("listSort3",JSON.stringify(newArr));
					}
				});
			},
			//回显菜单数据,初始化菜单信息
			handleShow() {
				const params = {
					"userId": this.userInfo.userCode
				}
				customizeMenuShow(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.messageType,
							msg = data.messageContent;
						//{"messageType":"SUCCESS","messageContent":{"menuJson":"","id":"153118935645800021","version":0}}空数据的返回值
						if(code == 'SUCCESS') {
//							console.log(JSON.stringify(data)+"查询菜单数据");
							// 初始化json字符串 添加‘+’加号按钮
							let items = this.handleInit(msg);
							this.buttonItems = items;
//							console.log(JSON.stringify(this.buttonItems));
							localStorage.setItem('customMenu', Base64.encode(JSON.stringify(this.buttonItems)));
							sessionStorage.setItem('customMenu', Base64.encode(JSON.stringify(this.buttonItems)));
						} else {
							this.$message.warning(msg);
							msg = {
								"menuJson": {
									"button": []
								}
							}
							let items = this.handleInit(msg);
							this.buttonItems = items;
						}
						let that = this;
						setTimeout(function(){
							that.setSort(); // 拖拽排序
						},500)
					})
					.catch((err) => {
//						 console.log(err);
					});
			},
			// 初始化json数据
			handleInit(obj) { 
//				console.log(JSON.stringify(obj));//菜单信息
				this.id = obj.id;
				this.version = obj.version;
				if(obj.menuJson == ''||JSON.stringify(obj) == '{}') {//如果没有菜单信息，清空存放菜单信息容器的缓存
					obj.menuJson = {};
					obj.menuJson.button = [];
				}
				let items = obj.menuJson.button;
				if(items.length < 3) {//如果主菜单少于三个或者为空的时候会在后台添加一个+号按钮
					items.push({
						"name": "+",//主菜单添加按钮名称
						"sub_button": []//子菜单的信息数组
					});
				}
				items.forEach((val, index) => {//循环每个主菜单
					let subItems = val.sub_button;//val.sub_button为每个主菜单的子菜单信息
					if(subItems.length < 5) {//如果该主菜单的子菜单信息少于五个，则在最顶部加一个+号按钮
						subItems.push({
							name: '+'//子菜单的添加按钮名称
						});
					}
				});
//				console.log(JSON.stringify(items)+"根据查询的菜单信息，初始化菜单json格式");
				return items;//根据查询的菜单信息，初始化菜单json格式
			},
			handleUninit(itemsObj) { // 反初始化json数据
				let items = JSON.parse(JSON.stringify(itemsObj));
				if(items[items.length - 1].name == '+') {
					items.pop();
				}
				items.forEach((val, index) => {
					val.sub_button.forEach((subVal, subIndex) => {
						if(subVal.type=="click"){
							delete items[index].sub_button[subIndex].media_id
						}
						if(subVal.name == '+') {
							val.sub_button.pop();
						}
					});
				});
				let obj = {
					"button": items
				}
				// console.log(JSON.stringify(obj), 'handleUninit');
				return obj;
			},
			// 点击菜单事件
			handleNav(index, e) {
				if(e.target.tagName!="TD"&&e.target.tagName!="A"){
					return false;
				}
				if(e.target.id==""){
					return false;
				}
				let that = this;
				this.mainIndex = index; // 主菜单下标
				this.subMenuIndex = ''; // 子菜单下标

				this.$emit('handleIndex', {
					type: '',
					mainIndex: this.mainIndex,
					subMenuIndex: this.subMenuIndex
				});				
				// 菜单显示隐藏
				this.isNavShow.forEach((val, index) => {
					this.$set(this.isNavShow, index, false);
				});
				this.$set(this.isNavShow, index, !this.isNavShow[index]);

				// 目标元素
				this.targetMenu = e.target.innerText;
				let isAddBtn = this.targetMenu == '+'; // 被选元素的内容是添加 '+'  按钮
				let isMenu = e.target.id == 'menu'; // 被选元素是三个主菜单中的一个
				// 目标元素标亮
				document.querySelectorAll('#menu').forEach((val) => {
					val.style.border = '2px dashed transparent';
				});
				document.querySelectorAll('#subMenu').forEach((val) => {
					val.style.border = '2px dashed transparent';
				});
				e.target.style.border = '2px dashed #19aa8d';

				// 主菜单
				let hasAddBtn = false;
				this.buttonItems.forEach((mainVal, mainIndex) => {
					if(mainVal.name == '+') {
						hasAddBtn = true;
					}
				});
				if(hasAddBtn) {
					this.mainLength = this.buttonItems.length - 1; // 子菜单长度
				} else {
					this.mainLength = this.buttonItems.length; // 子菜单长度
				}

				// 子菜单下标、 是否有添加按钮
				let hasAddSubBtn = false; // 是否包含添加 '+' 按钮
				if(!(isMenu && isAddBtn)) { // 如果主菜单是添加按钮，没有子菜单，不能参与关于子菜单数量的计算
					this.buttonItems[this.mainIndex].sub_button.forEach((subVal, subIndex) => {
						if(subVal.name == e.target.innerText) {
							this.subMenuIndex = subIndex; // 子菜单下标
							this.$emit('handleIndex', {
								type: 'subMenu',
								mainIndex: this.mainIndex,
								subMenuIndex: this.subMenuIndex
							});	
						}
						if(subVal.name == '+') {
							hasAddSubBtn = true;
						}
					});
					if(hasAddSubBtn) {
						this.subMenuLength = this.buttonItems[index].sub_button.length - 1; // 子菜单长度
					} else {
						this.subMenuLength = this.buttonItems[index].sub_button.length; // 子菜单长度
					}
				} else {
					this.subMenuLength = 0; // 当主菜单为添加按钮，定义无子菜单
				}
				let hasSubMenu = this.subMenuLength > 0; // 是否有子菜单
				let type = '';
				if(isMenu) {
					this.$emit('handleIndex', {
						type: 'main',
						mainIndex: this.mainIndex,
						subMenuIndex: ''
					});	
					if(hasSubMenu) {
						type = '有子菜单的主菜单';
					} else {
						if(isAddBtn) {
							type = '主菜单添加按钮';
						} else {
							type = '无子菜单的主菜单';
						}
					}
				} else {
					if(isAddBtn) {
						if(this.subMenuLength == 5) {
							type = '到达添加上线，禁止添加';
						} else {
							type = '添加';
						}
					} else {
						type = '子菜单';
					}
				}
				this.type = type;
				this.$emit('clickType', type);
				if(this.targetMenu != '+') {
					this.$emit('clickTarget', this.targetMenu);
				}else {
					this.$emit('clickTarget', '');
					document.querySelectorAll('#menu').forEach((val) => {
						val.style.border = '2px dashed transparent';
					});
					document.querySelectorAll('#subMenu').forEach((val) => {
						val.style.border = '2px dashed transparent';
					});
				}
				// 添加
				if(type == '添加') { // 添加子菜单
					this.subMenuLength++;
//					console.log(this.mainIndex)
					if(this.mainIndex==0){
						sessionStorage.removeItem("listSort1");
					}
					if(this.mainIndex==1){
						sessionStorage.removeItem("listSort2");
					}
					if(this.mainIndex==2){
						sessionStorage.removeItem("listSort3");
					}
					this.buttonItems[this.mainIndex].sub_button.unshift({ // 添加子菜单
						name: '子菜单',
						"type": 'click',
						"key": `rselemenu_${this.mainIndex}_${this.subMenuLength}`,
						"keyType":'文字'
					});
					if(this.subMenuLength == 5) { // 到达添加上线时去掉 '+' 按钮
						this.buttonItems[this.mainIndex].sub_button.pop();
					}
				}
				if(type == '主菜单添加按钮') { // 添加主菜单
					this.mainLength++;
					if(this.mainLength == 3) {
						this.buttonItems.pop();
						this.buttonItems.push({
							"name": "菜单名称",
							"type": 'click',
							"keyType":'文字',
							"key": `rselemenu_${this.mainIndex}`,
							"sub_button": [{
								"name": "+"
							}]
						});
					} else {
						this.buttonItems.unshift({
							"name": "菜单名称",
							"type": 'click',
							"keyType":'文字',
							"key": `rselemenu_${this.mainIndex}`,
							"sub_button": [{
								"name": "+"
							}]
						});
					}
				}
				let params = {
					"userId": this.userInfo.userCode,
					"id": this.id,
					"version": this.version,
					"menuJson": this.handleUninit(this.buttonItems)
				}
				this.$emit('handleEdit', JSON.stringify(params));
			},
			handleEdit(obj) {
				let menuJson = this.handleUninit(obj);
				
				let params = {
					"userId": this.userInfo.userCode,
					"id": this.id,
					"version": this.version,
					"menuJson": menuJson
				}
				// console.log(params, 'handleEdit');
				this.$emit('handleEditSet', JSON.stringify(params));
			}
		},
		created() {
			// 钩子函数 -- 初始化
			this.handleShow();
			
		},
		computed: {
			// 计算属性
			...mapGetters(["userInfo"])
		},
		watch: {
			childData: function(newVal, oldVal) {
//				console.log(newVal, 'childDataWatch');
				if(newVal.indexOf('删除') >= 0) {
					if(this.type == '无子菜单的主菜单') { // 主菜单删除
						if(this.mainLength > 0) {
							//                      console.log(this.mainLength);
							if(this.mainLength == 3) {
								this.buttonItems.splice(this.mainIndex, 1);
								this.buttonItems.push({
									"type": "click",
									"name": "+",
									"key": "N01"
								});
							} else {
								this.buttonItems.splice(this.mainIndex, 1);
							}
//							console.log('childData1')
							this.handleEdit(this.buttonItems);
							this.mainLength--;
						}
					} else { // 子菜单删除
						if(this.subMenuLength == this.subMenuIndex) {
							return false;
						}
						if(this.subMenuLength > 0) {
							if(this.subMenuLength == 5) { // 添加 '+' 按钮
								this.buttonItems[this.mainIndex].sub_button.push({
									name: '+'
								});
							}
							this.buttonItems[this.mainIndex].sub_button.splice(this.subMenuIndex, 1); // 在数组中删除选中节点
//							console.log('childData2');
							this.handleEdit(this.buttonItems);
							this.subMenuLength--;
						}
					}
					// console.log(this.subMenuLength);
					// console.log(this.buttonItems[this.mainIndex].sub_button);
				}
			},
			clickName: function(val, oldVal) {
				// console.log(val, 'clickNameWatch');
				// mainIndex // 主下标
				// subMenuIndex //子下标
				// console.log(this.mainIndex, this.subMenuIndex, this.targetMenu, val);
				// console.log(this.buttonItems[this.mainIndex]);
				//          console.log(val, oldVal);
				let targetName = '';
				if(this.targetMenu != '+') {
					if(this.subMenuIndex.length == 0) {
						this.buttonItems[this.mainIndex].name = val; // 主菜单
						this.handleEdit(this.buttonItems);
					} else {
						this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].name = val; // 子菜单
						this.handleEdit(this.buttonItems);
					}
				}
			},
			childType: function(val, oldVal) {
//				console.log(val)
				if(this.targetMenu != '+') {
					if(this.subMenuIndex.length == 0) {
						if(val == '外部链接' || val == '会员功能') {
							this.buttonItems[this.mainIndex].type = 'view'; // 主菜单
							this.buttonItems[this.mainIndex].keyType = ''; // 主菜单
						}
						if(val == '文本消息') {
							this.buttonItems[this.mainIndex].type = 'click'; // 主菜单
							this.buttonItems[this.mainIndex].keyType = '文字'; // 主菜单
						}
						if(val == '图文素材') {
							this.buttonItems[this.mainIndex].type = 'click'; // 主菜单
							this.buttonItems[this.mainIndex].keyType = '图文'; // 主菜单
						}
						this.handleEdit(this.buttonItems);
					} else {
						if(val == '外部链接' || val == '会员功能') {
							this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].type = 'view'; // 子菜单
							this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].keyType = ''; // 子菜单
							if(typeof this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].key != 'undefined') {
								delete this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].key;
							}
							if(typeof this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].content != 'undefined') {
								delete this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].content;
							}
						}
						if(val == '文本消息') {
							this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].type = 'click'; // 主菜单
							this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].keyType = '文字'; // 子菜单
							this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].key= `rselemenu_${this.mainIndex}_${this.subMenuLength}`
						}
						if(val == '图文素材') {
							this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].type = 'click'; // 主菜单
							this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].keyType = '图文'; // 子菜单
							this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].key= `rselemenu_${this.mainIndex}_${this.subMenuLength}`
							if(typeof this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].url != 'undefined') {
								delete this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].url;
							}
							if(typeof this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].content != 'undefined') {
								delete this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].content;
							}
						}
						this.handleEdit(this.buttonItems);
					}
				}
			},
			childContent: function(val, oldVal) {
//				console.log(JSON.stringify(this.buttonItems[this.mainIndex])+'childContentWatch'+JSON.stringify(val))
				if(this.targetMenu != '+') {
					if(this.subMenuIndex.length == 0) {
						if(this.buttonItems[this.mainIndex].type == 'view') {
							this.buttonItems[this.mainIndex].url = val; // 主菜单
						}
						if(this.buttonItems[this.mainIndex].type == 'click') {
							if(!val) {
								return false;
							}else {
								this.buttonItems[this.mainIndex].content = val; // 主菜单
							}
						}
						this.handleEdit(this.buttonItems);
					} else {
						if(this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].type == 'view') {
							this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].url = val; // 子菜单
						}
						if(this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].type == 'click') {
							if(!val) {
								return false;
							}else {
								this.buttonItems[this.mainIndex].sub_button[this.subMenuIndex].content = val; // 子菜单
							}
						}
						this.handleEdit(this.buttonItems);
					}
				}
			},
			deep: true
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-form {
		display: inline-block;
		position: absolute;
		margin-left: rem(20px);
	}
	
	.dsh-center {
		display: flex;
		justify-content: center;
	}
	
	.dsh-vertical-center {
		display: flex;
		align-items: center;
	}
	
	html,
	body,
	p,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	form,
	input,
	textarea,
	select,
	button,
	fieldset,
	legend,
	img,
	ul,
	ol,
	li,
	dl,
	dt,
	dd,
	th,
	td,
	pre,
	blockquote {
		margin: 0;
		padding: 0;
	}
	
	html {
		height: 100%;
		-webkit-text-size-adjust: 100%;
		-ms-text-size-adjust: 100%;
		-webkit-font-smoothing: antialiased;
	}
	
	body {
		background: #f0f0f0;
		color: #000;
	}
	
	body,
	button,
	input,
	select,
	textarea,
	h2,
	h3,
	h4,
	h5,
	h6 {
		font: 14px "Hiragino Sans GB", "Microsoft Yahei", "微软雅黑", "宋体", \5b8b\4f53, Tahoma, Arial;
	}
	
	img,
	fieldset {
		border: 0;
		vertical-align: middle;
	}
	
	input {
		padding: 0;
		margin: 0;
		outline: none;
	}
	
	a {
		text-decoration: none;
		color: #4c4c4c;
	}
	
	a:hover {
		text-decoration: none;
	}
	
	ul,
	li,
	ol {
		list-style: none;
	}
	
	img {
		max-width: 100%;
	}
	
	.clear {
		clear: both;
		height: 0;
		line-height: 0;
		font-size: 0;
		visibility: hidden;
		overflow: hidden;
	}
	
	.clearfix:after {
		visibility: hidden;
		display: block;
		font-size: 0;
		content: " ";
		clear: both;
		height: 0;
		zoom: 1;
	}
	
	.l {
		float: left;
	}
	
	.r {
		float: right;
	}
	/*reset样式重置*/
	
	.btn3 {
		position: absolute;
		z-index: 3;
		bottom: 0px;
		border-top: 1px solid #b3b3b3;
		background: #e6e6e6;
		width: 100%;
		text-align: center;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}
	
	.menu {
		position: relative;
		float: left;
		width: 33.33%;
		height: 50px;
		line-height: 46px;
		background: #fff;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		border-right: 1px solid #ebebeb;
		cursor: pointer;
	}
	
	.menu:last-child {
		border-right: none;
	}
	.moveIcon{
		margin-left: 4px;
		width: 100%;
		height: 50px;
		line-height: 50px;
		float: left;
	}
	.new-sub {
		position: absolute;
		bottom: 60px;
		z-index: 10;
		width: 100%;
		padding: 0px 10px;
		background: #fff;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		border: 1px solid #eeeeee;
		border-radius: 5px;
		padding: 0px 10px;
	}
	
	.new-sub li {
		width: 100%;
		background: #fff;
		float: none;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		border-top: 1px solid #f2f2f2;
	}
	
	.new-sub li a {
		display: block;
		height: 50px;
		line-height: 50px;
		text-align: left;
		background: #fff;
		color: #333;
		border: none;
		text-align: center;
		font-size: 16px;

		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.triangle {
		position: absolute;
		bottom: 5px;
		right: 5px;
		width: 0;
		height: 0;
		border: 5px solid transparent;
		border-right: 5px solid #000;
		border-bottom: 5px solid #000;
		opacity: 0.5;
	}
	
	.bt-name {
		font-size: 16px;
		color: #000;
	}
	
	.bt-name a {
		display: block;
		font-size: 16px;
		color: #000;
	}
	
	.new-sub .tiggle {
		width: 0px;
		height: 0px;
		position: absolute;
		left: 50%;
		margin-left: -10px;
		bottom: -9px;
		border-top: 10px solid #eeeeee;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		z-index: 10;
	}
	
	.new-sub .innertiggle {
		width: 0px;
		height: 0px;
		position: absolute;
		left: 50%;
		margin-left: -9px;
		bottom: -8px;
		border-top: 9px solid white;
		border-left: 9px solid transparent;
		border-right: 9px solid transparent;
		z-index: 11;
	}
</style>