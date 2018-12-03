// 基础设置 - 业务规则 - 会员权益 - 积分新增scrm模式弹窗(品牌管理员)
<template>
	<el-container class="app-container integral-container">
		<el-dialog title="" :visible.sync="handleTabDialog" class="transfer" append-to-body>
			<!-- <template> -->
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="门店" name="first">
						<div class="search">
							<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
							</el-cascader>
							<el-input v-model="searchContent" class="searchContent" placeholder="请输入门店编号或门店名称"></el-input>
							<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
						</div>
						<el-transfer :filterable="false" :titles="titleDataStore" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
						</el-transfer>
					</el-tab-pane>
					<el-tab-pane label="店组" name="second">
						<div class="search">
							<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
							</el-cascader>
							<el-input v-model="searchContent" class="searchContent" placeholder="请输入店组编号或店组名称"></el-input>
							<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
						</div>
						<el-transfer :filterable="false" :titles="titleDataGroup" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
						</el-transfer>
					</el-tab-pane>
					<el-tab-pane label="区域" name="third">
						<div class="search">
							<el-cascader :options="optionsProCityAreaPop" change-on-select :clearable=true @change="selectChange">
							</el-cascader>
							<el-input v-model="searchContent" class="searchContent" placeholder="请输入区域编号或区域名称"></el-input>
							<el-button type="primary" id="search" @click="searchStoreTab">搜索</el-button>
						</div>
						<el-transfer :filterable="false" :titles="titleDataArea" @change="storeArray" v-model="value2" :props="{key: 'storeId',label: 'storeName'}" :data="data2">
						</el-transfer>
					</el-tab-pane>
				</el-tabs>
			<!-- </template> -->
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleTabDialog = false">取 消</el-button>
				<el-button type="primary" @click="enterStore">确 定</el-button>
			</div>
		</el-dialog>
		<el-main>
			<!-- <el-card> -->
			<el-form :model="formScrm" label-width="140px">
				{{msg}}
				<el-form-item label="选择门店" v-if="childType == '按门店配置'">
					<el-button type="primary" @click="storeClick" v-if="childPageType!= '查看'">选择门店</el-button>
					<!-- {{formScrm.storeid}} -->
					<el-tag v-for="(item, index) in storeArrayTag" :key="item">{{item}}</el-tag>
				</el-form-item>
				<el-form-item label="积分小数规则">
					<el-radio-group v-model="formScrm.decimalRule" :disabled="childPageType == '查看'">
						<el-radio label="四舍五入">四舍五入</el-radio>
						<el-radio label="抹零">抹零</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="积分有效期">
					<el-radio-group v-model="formScrm.integralValidity.msg" @change="handleSelectIntegralValidityMsg" :disabled="childPageType == '查看'">
						<el-radio label="永久有效" class="blockRadio marginTop10" :disabled="childPageType == '查看'">永久有效</el-radio>
						<el-radio label="相对有效" class="blockRadio" :disabled="childPageType == '查看'">
							相对有效
							<el-form class="formScrmIVrelative" label-width="120px" :inline="true" v-if="this.formScrm.integralValidity.msg == '相对有效'">
								<el-radio-group v-model="formScrm.integralValidity.timeSelect" @change="getTimeDate" :disabled="childPageType == '查看'">
									<el-radio label="年">
										<el-input class="widthInline" v-model="formScrm.integralValidity.year" :disabled="childPageType == '查看' || formScrm.integralValidity.timeSelect != '年'"></el-input>
										<div class="formText">年</div>
									</el-radio>
									<el-radio label="月">
										<el-input class="widthInline" v-model="formScrm.integralValidity.month" :disabled="childPageType == '查看' || formScrm.integralValidity.timeSelect != '月'"></el-input>
										<div class="formText">月</div>
									</el-radio>
									<el-radio label="日">
										<el-input class="widthInline" v-model="formScrm.integralValidity.day" :disabled="childPageType == '查看'  || formScrm.integralValidity.timeSelect != '日'"></el-input>
										<div class="formText">日</div>
									</el-radio>
								</el-radio-group>
							</el-form>
						</el-radio>
						<el-radio label="绝对有效" class="blockRadio">
							绝对有效
							<el-form class="formScrmIVrelative" label-width="120px" :inline="true" v-if="this.formScrm.integralValidity.msg == '绝对有效'">
								<el-input class="widthInline" v-model="formScrm.integralValidity.yearAfter" :disabled="childPageType == '查看'"></el-input>
								<div class="formText">（年）后的</div>
								<el-select class="widthInline" v-model="formScrm.integralValidity.overdueMonth" placeholder="请选择" :disabled="childPageType == '查看'">
									<el-option v-for="item in monthDate" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
								<div class="formText">月</div>
								<el-select class="widthInline" v-model="formScrm.integralValidity.overdueDay" placeholder="请选择" :disabled="childPageType == '查看'">
									<el-option v-for="item in dayDate" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
								<div class="formText">号过期</div>
							</el-form>
						</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="过期预警天数" v-if="formScrm.integralValidity.msg != '永久有效'">
					<div class="formText">积分到期前</div>
					<el-input class="widthInline" v-model="formScrm.overdueWarnDays" :disabled="childPageType == '查看'"></el-input>
					<div class="formText">天通知会员</div>
				</el-form-item>
				<el-form-item label="消费积分冻结天数">
					<el-input class="widthInline marginLeft0" v-model="formScrm.freezingDays" :disabled="childPageType == '查看'"></el-input>
					<div class="formText">天后，积分可以使用</div>
				</el-form-item>
				<el-form-item label="消费积分折扣下限">
					<el-radio-group v-model="formScrm.discountLower.msg" @change="handleSelectDiscountLowerMsg" :disabled="childPageType == '查看'">
						<el-radio label="全部" class="blockRadio marginTop10" :disabled="childPageType == '查看' " >全部</el-radio>
						<el-radio label="部分" class="blockRadio" :disabled="childPageType == '查看' ">
							<div class="formText">只统计折扣率 >= </div>
							<el-input class="widthInline" v-model="formScrm.discountLower.ipt" :disabled="childPageType == '查看'  || formScrm.discountLower.msg!='部分'"></el-input>
							<div class="formText">%的订单（8折请输入80）</div>
						</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="消费积分类型">
					<el-radio-group v-model="formScrm.integralType.msg" @change="handleSelectIntegralTypeMsg" :disabled="childPageType == '查看'">
						<el-radio label="固定" class="blockRadio marginTop0">
							<div class="formText">固定积分 每笔消费，送</div>
							<el-input class="widthInline" v-model="formScrm.integralType.ipt1" :disabled="childPageType == '查看' || formScrm.integralType.msg != '固定'"></el-input>
							<div class="formText">分</div>
						</el-radio>
						<el-radio label="满送" class="blockRadio">
							<!-- <el-form class="formScrmIVrelative" label-width="120px" :inline="true"> -->
							<div class="formText">订单金额 消费满</div>
							<el-input class="widthInline" v-model="formScrm.integralType.ipt2" :disabled="childPageType == '查看' || formScrm.integralType.msg != '满送'"></el-input>
							<div class="formText">元，送1积分</div>
							<!-- </el-form> -->
						</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="消费赠送标准">
					<el-radio-group v-model="formScrm.giveCriterion.msg" @change="handleGiveCriterionMsg" :disabled="childPageType == '查看'">
						<el-radio label="统一标准" class="blockRadio marginTop10">统一标准</el-radio>
						<el-radio label="差异标准" class="blockRadio">差异标准
							<el-form class="formScrmIVgiveCriterion" label-width="120px" :inline="true" v-if="formScrm.giveCriterion.msg=='差异标准'" v-for="item in formScrm.giveCriterion.msgData" :key="item.index">
								<div class="formText">{{item.name}}</div>
								<el-input class="widthInline" v-model="item.value" :disabled="childPageType == '查看' || formScrm.giveCriterion.msg != '差异标准'"></el-input>
								<div class="formText">倍</div>
							</el-form>
							<!--<el-form class="formScrmIVgiveCriterion" label-width="120px" :inline="true">
								<div class="formText">银卡会员</div>
								<el-input class="widthInline" v-model="formScrm.giveCriterion.ipt2" :disabled="childPageType == '查看' || formScrm.giveCriterion.msg != '差异标准'"></el-input>
								<div class="formText">倍</div>
							</el-form>
							<el-form class="formScrmIVgiveCriterion" label-width="120px" :inline="true">
								<div class="formText">金卡会员</div>
								<el-input class="widthInline" v-model="formScrm.giveCriterion.ipt3" :disabled="childPageType == '查看' || formScrm.giveCriterion.msg != '差异标准'"></el-input>
								<div class="formText">倍</div>
							</el-form>-->
						</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="积分说明">
					<quill-editor ref="newEditor" :content="formScrm.integralDesc" :options="editorOption" @change="onEditorChange($event)" :disabled="childPageType == '查看'">
					</quill-editor>
				</el-form-item>
				<!-- <el-button type="primary" @click="handleSure">确认</el-button> -->
			</el-form>
			<form :action="uploadAction" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
				<input type="file" name="file" ref="uploadIpt1" @change="handleSelectImg1" />
				<input type="submit" value="上传" ref="uploadSubmit" />
			</form>
			<el-dialog width="80%" :visible.sync="dialogVisiblePic" :modal="false">
				<!-- 图片选择 -->
				<groupMaterialListPic @handleChecked="handleChecked"></groupMaterialListPic>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisiblePic = false">取 消</el-button>
					<el-button type="primary" @click="handleDialogSurePic">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog width="80%" :visible.sync="dialogVisibleVideo" :modal="false">
				<!-- 视频选择 -->
				<groupMaterialListVideo ref="groupMaterialListVideo" @handleChecked="handleCheckedVideo"></groupMaterialListVideo>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisibleVideo = false">取 消</el-button>
					<el-button type="primary" @click="handleDialogSureVideo">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog width="80%" :visible.sync="dialogVisibleAudio" :modal="false">
				<!--音频选择 -->
				<groupMaterialListAudio ref="groupMaterialListAudio" @handleChecked="handleCheckedAudio"></groupMaterialListAudio>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisibleAudio = false">取 消</el-button>
					<el-button type="primary" @click="handleDialogSureAudio">确 定</el-button>
				</span>
			</el-dialog>
			<!-- </el-card> -->
		</el-main>
	</el-container>
</template>
<script>
	// 引入富文本
	import { quillEditor } from 'vue-quill-editor'
	import Bus from '@/utils/eventBus.js'
	import groupMaterialListPic from '@/views/WebRoot/mobile/component/groupMaterialListPic' // 图片素材
	import groupMaterialListVideo from '@/views/WebRoot/mobile/component/groupMaterialListVideo' // 图片素材
	import groupMaterialListAudio from '@/views/WebRoot/mobile/component/groupMaterialListAudio' // 图片素材
	import { MaterialLibraryCardShow3 } from '@/api/mobile/graphicMaterial'
	import { mapGetters } from 'vuex'
	import Cookie from 'js-cookie'
	import { uploadImg } from '@/api/base/brandInfo'
	import { selectProCityArea, selectRoleData, selectTabData,selectLevalInfo } from '@/api/public'
	export default {
		props: ['childType', 'childFormData', 'childPageType', 'childBrandFormData', 'childAddType'],
		data() {
			return {
				dialogVisiblePic:false,
				dialogVisibleVideo:false,
				dialogVisibleAudio:false,
				videoUrl:'',
				audioUrl:'',
				checkedPic :[],
				levelOption:[],//等级
				levelOptionForm:[],
				// 穿梭框
				handleTabDialog: false,
				storeArr: '',
				tabType: '门店',
				provinceId: '', //弹窗搜索省代码
				cityId: '', //弹窗搜索市代码
				areaId: '', //弹窗搜索区代码
				searchContent: '', //门店名称或编码
				titleDataStore: ['未选择门店', '已选择门店'], //穿梭框的左右两侧的标题
				titleDataGroup: ['未选择店组', '已选择店组'], //穿梭框的左右两侧的标题
				titleDataArea: ['未选择区域', '已选择区域'], //穿梭框的左右两侧的标题
				dataIndex: [], //穿梭框右侧的值
				data2: [], //搜索门店的值
				value2: [], //选择的值
				optionsProCityAreaPop: [], //级联选择器省市区数据
				activeName: 'first',
				// form表单数据
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传图片路径
				formScrm: {
					storeId: '', // 门店id
					storeName: '', // 门店name
					// integralModel: '', // 积分模式
					decimalRule: '', // 积分小数规则(四舍五入/抹零)
					integralValidity: {
						msg: '', // 积分有效期(永久有效/相对有效/绝对有效)
						timeSelect: '', // 选择有限时间(年/月/日)
						year: '', // 年
						month: '', // 月
						day: '', // 日
						yearAfter: '', // 多少年后
						overdueMonth: '', // 过期月
						overdueDay: '', // 过期日
					}, // 积分有效期
					overdueWarnDays: '', // 过期预警天数
					freezingDays: '', // 消费积分冻结天数
					discountLower: {
						msg: '',// (全部/部分)
						ipt: ''
					}, // 折扣下限
					integralType: {
						msg: '', // (固定/满送)
						ipt1: '', // 每笔消费
						ipt2: '' // 订单金额
					}, // 积分类型
					giveCriterion: {
						msg: '', // (统一标准/差异标准)
						msgData:[]
					}, // 赠送标准
					integralDesc: '' // 积分说明
				},
				timeYear: true, // 年
				timeMonth: true, // 月
				timeDay: true, // 日
				monthDate: [{
						label: '1',
						value: '1'
					},
					{
						label: '2',
						value: '2'
					},
					{
						label: '3',
						value: '3'
					},
					{
						label: '4',
						value: '4'
					},
					{
						label: '5',
						value: '5'
					},
					{
						label: '6',
						value: '6'
					},
					{
						label: '7',
						value: '7'
					},
					{
						label: '8',
						value: '8'
					},
					{
						label: '9',
						value: '9'
					},
					{
						label: '10',
						value: '10'
					},
					{
						label: '11',
						value: '11'
					},
					{
						label: '12',
						value: '12'
					}
				], // 月份 - 绝对有效期
				dayDate: [
					{label: '1', value: '1'},
                    {label: '2', value: '2'},
                    {label: '3', value: '3'},
                    {label: '4', value: '4'},
                    {label: '5', value: '5'},
                    {label: '6', value: '6'},
                    {label: '7', value: '7'},
                    {label: '8', value: '8'},
                    {label: '9', value: '9'},
                    {label: '10', value: '10'},
                    {label: '11', value: '11'},
                    {label: '12', value: '12'},
                    {label: '13', value: '13'},
                    {label: '14', value: '14'},
                    {label: '15', value: '15'},
                    {label: '16', value: '16'},
                    {label: '17', value: '17'},
                    {label: '18', value: '18'},
                    {label: '19', value: '19'},
                    {label: '20', value: '20'},
                    {label: '21', value: '21'},
                    {label: '22', value: '22'},
                    {label: '23', value: '23'},
                    {label: '24', value: '24'},
                    {label: '25', value: '25'},
                    {label: '26', value: '26'},
                    {label: '27', value: '27'},
                    {label: '28', value: '28'},
                    {label: '29', value: '29'},
                    {label: '30', value: '30'}
				], // 日期 - 绝对有效期

				items: [], // 富文本
				content: "", // 富文本
				editorOption:{
					modules: {
                        syntax: {
                            highlight: text => hljs.highlightAuto(text).value
                        },
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                            ['blockquote', 'code-block'],

                            [{'header': 1}, {'header': 2}],               // custom button values
                            [{'list': 'ordered'}, {'list': 'bullet'}],
                            [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                            [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                            [{'direction': 'rtl'}],                         // text direction

                            [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
                            [{'header': [1, 2, 3, 4, 5, 6, false]}],

                            [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                            [{'font': []}],
                            [{'align': []}],
                            ['link', 'image', 'formula', 'video','videoLink','audio'],
                            ['clean']
                        ]
                    },
				},

				msg: ''
			}
		},
		components: {
			quillEditor,
			groupMaterialListPic,
			groupMaterialListVideo,
			groupMaterialListAudio
		},
		methods: {
			//音频监听
			handleCheckedAudio(str){
				if(str.coverUrl){
					this.audioUrl=str.coverUrl;
				}else{
					this.audioUrl='';
				}
			},
			//音频弹出确认
			handleDialogSureAudio(){
				let audioUrl=this.audioUrl;
				if(audioUrl!=""){
					$(".ql-editor").append('<p><iframe class="ql-video" style="height:150px" allowfullscreen="true" src="'+audioUrl+'" frameborder="0"></iframe></p>');
				}
	    		this.dialogVisibleAudio=false;
			},
			//视频弹出监听选择
			handleCheckedVideo(str){
				if(str.coverUrl){
					this.videoUrl=str.coverUrl;
				}else{
					this.videoUrl='';
				}
			},
			//视频弹出确认
			handleDialogSureVideo(){
				let videoUrl=this.videoUrl;
				if(videoUrl!=""){
					$(".ql-editor").append('<p><iframe class="ql-video" allowfullscreen="true" src="'+videoUrl+'" frameborder="0"></iframe></p>')
				}
	    		this.dialogVisibleVideo=false;
			},
			// 图片选择
			handleChecked(str) {
				this.checkedPic[0] = str.id
			},
			//弹出确认
			handleDialogSurePic() {
				let params = {
					userId: this.userInfo.userCode,
					id: this.checkedPic[0]
				}
				MaterialLibraryCardShow3(params)
					.then(res => {
						let data = JSON.parse(Base64.decode(res.data)),
							code = data.count,
							msg = data.data;
						if(code == 1) {
//							console.log(msg)
							$(".ql-editor").append('<img src="'+msg[0].coverUrl+'"  />')
						}
						this.dialogVisiblePic = false;
					})
					.catch()
			},
			handleSelectImg1(file) { // 上传图片
				let that = this;
				let files = file.target.files[0];
				// console.log(files);return false;
				//判断file的类型是不是图片类型。 
				if(!/image\/\w+/.test(files.type)) {
					this.$message("请上传一张图片");
					return false;
				}
				var reader = new FileReader();
				reader.readAsDataURL(files); //调用readAsDataURL方法来读取选中的图像文件 
				//最后在onload事件中，获取到成功读取的文件内容，并以插入一个img节点的方式显示选中的图片 
				reader.onload = function(e) {
					// that.form.brandLogo = e.target.result; // 图片回填 - 本地图片
					// that.$refs.uploadSubmit.dispatchEvent(new MouseEvent('click')); // 上传图片
					let formData = new FormData(); // 可以增加表单数据
					formData.append("file", files); // 文件对象
					uploadImg(formData)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data)),
								code = data.messageType,
								msg = data.messageContent;
                            let value = msg.fileName;
//	                        console.log(msg.fileName);
	                        that.$refs.newEditor.quill.insertEmbed(that.$refs.newEditor.quill.getSelection().index, 'image', value)  
							that.$message.success('上传成功');
//	                        console.log(msg.fileName);
						})
						.catch((err) => {
							// console.log(err);
						})
				}
			},
			// 方法
			onEditorChange (str) {
				this.formScrm.integralDesc = str.html;
			},
			// 消费赠送标准
			handleGiveCriterionMsg (str) {
				var arr =  this.formScrm.giveCriterion.msgData;
				if(str=="统一标准"){
					this.formScrm.giveCriterion.msgData=[];
					arr.forEach((val,index)=>{
						arr[index].value='';
					})
					this.formScrm.giveCriterion.msgData=arr;
				}
			},
			// 消费积分类型
			handleSelectIntegralTypeMsg(str) {
				if(str === '固定') {
					this.formScrm.integralType.ipt2 = '';
				}
				if(str === '满送') {
					this.formScrm.integralType.ipt1 = '';
				}
			},
			// 消费积分折扣下限
			handleSelectDiscountLowerMsg(str) {
				if(str === '全部') {
					this.formScrm.discountLower.ipt = '';
				}
			},
			// 积分有效期
			handleSelectIntegralValidityMsg(str) {
				if(str == '永久有效') {
					this.formScrm.integralValidity.timeSelect = '';
					this.formScrm.integralValidity.year = '';
					this.formScrm.integralValidity.month = '';
					this.formScrm.integralValidity.day = '';
					this.formScrm.integralValidity.yearAfter = '';
					this.formScrm.integralValidity.overdueMonth = '';
					this.formScrm.integralValidity.overdueDay = '';
				}
				if(str === '相对有效') {
					this.formScrm.integralValidity.yearAfter = '';
					this.formScrm.integralValidity.overdueMonth = '';
					this.formScrm.integralValidity.overdueDay = '';
				}
				if(str === '绝对有效') {
					this.formScrm.integralValidity.timeSelect = '';
					this.formScrm.integralValidity.year = '';
					this.formScrm.integralValidity.month = '';
					this.formScrm.integralValidity.day = '';
				}
			},
			// 穿梭框
			//点击查询的 选择组织
			storeClick() {
				this.handleTabDialog = true;
				//请求省市区下拉框
				var params = {
					parentId: '1'
				}
				selectProCityArea(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//	        		console.log(JSON.stringify(data));
						this.optionsProCityAreaPop=[];
						data.forEach((val, index) => {
							if(val.label == "未知") {
								this.optionsProCityAreaPop.push({
									...val
								});
							} else {
								this.optionsProCityAreaPop.push({
									children: [],
									...val
								});
							}
						})
					})
					.catch((err) => {
						// console.log('err');
					})
				let idArray = this.formScrm.storeId.split(",");
				let nameArray = this.formScrm.storeName.split(",");
				this.data2=[];
				this.value2=[];
				this.value2=idArray;
				idArray.forEach((val,index)=>{
					this.data2.push({
						index: index,
						storeName: '',
						storeId: val
					})
				})
				idArray.forEach((val,index)=>{
					this.data2[index].storeName=val;
				})
//				this.searchStoreTab();
			},
			//监听tab页
			handleClick(tab, event) {
				this.tabType = event.target.firstChild.data;
				this.data2 = [];
				this.value2 = [];
				this.dataIndex = [];
				this.searchStoreTab();
			},
			//监听父级选项动态加载省市区数据(弹窗内)
			cascaderSelect(val) {
				if(val.length == 1) {
					let proIndex = val[0];
					let parentId = this.optionsProCityAreaPop[proIndex].key;
					let params = {
						parentId: parentId
					}
					// console.log(params, '||params');
					selectProCityArea(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//					        		console.log(JSON.stringify(data));
							this.optionsProCityAreaPop[proIndex].children = [];
							data.forEach((val, index) => {
								if(val.label == "未知") {
									this.optionsProCityAreaPop[proIndex].children.push({
										...val
									});
								} else {
									this.optionsProCityAreaPop[proIndex].children.push({
										children: [],
										...val
									});
								}
							})
							//		        		console.log(JSON.stringify(this.optionsProCityAreaPop[proIndex]))
						})
						.catch((err) => {
							// console.log('err');
						})
				}
				if(val.length == 2) {
					let proIndex = val[0];
					let cityIndex = val[1];
					let parentId = this.optionsProCityAreaPop[proIndex].children[cityIndex].key;
					let params = {
						parentId: parentId
					}
					selectProCityArea(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//					        		console.log(JSON.stringify(data));
							let array = [];
							this.optionsProCityAreaPop[proIndex].children[cityIndex].children = [];
							data.forEach((val, index) => {
								array.push({
									...val
								});
							})
							this.optionsProCityAreaPop[proIndex].children[cityIndex].children = array;
							//				        		console.log(JSON.stringify(this.optionsProCityAreaPop[proIndex].children[cityIndex].children))
						})
						.catch((err) => {
							// console.log('err');
						})
				}
			},
			//监听省市区返回值（弹窗）
			selectChange(val) {
				if(val.length == 0) {
					this.provinceId = '';
					this.cityId = '';
					this.areaId = '';
				}
				let proIndex = '';
				let cityIndex = '';
				let areaIndex = '';
				if(val.length == 1) {
					proIndex = val[0];
					this.provinceId = this.optionsProCityAreaPop[proIndex].key;
					this.cityId = '';
					this.areaId = '';
					let params = {
						parentId: this.provinceId
					}
					selectProCityArea(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							this.optionsProCityAreaPop[proIndex].children = [];
							data.forEach((val, index) => {
								if(val.label == "未知") {
									this.optionsProCityAreaPop[proIndex].children.push({
										...val
									});
								} else {
									this.optionsProCityAreaPop[proIndex].children.push({
										children: [],
										...val
									});
								}
							})
						})
						.catch((err) => {
//							console.log(err);
						})
				}
				if(val.length == 2) {
					proIndex = val[0];
					cityIndex = val[1];
					this.provinceId = this.optionsProCityAreaPop[proIndex].key;
					this.cityId = this.optionsProCityAreaPop[proIndex].children[cityIndex].key;
					this.areaId = '';
					let params = {
						parentId: this.cityId
					}
					selectProCityArea(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							let array = [];
							this.optionsProCityAreaPop[proIndex].children[cityIndex].children = [];
							data.forEach((val, index) => {
								array.push({
									...val
								});
							})
							this.optionsProCityAreaPop[proIndex].children[cityIndex].children = array;
						})
						.catch((err) => {
//							console.log(err);
						})
				}
				if(val.length == 3) {
					proIndex = val[0];
					cityIndex = val[1];
					areaIndex = val[2];
					this.provinceId = this.optionsProCityAreaPop[proIndex].key;
					this.cityId = this.optionsProCityAreaPop[proIndex].children[cityIndex].key;
					this.areaId = this.optionsProCityAreaPop[proIndex].children[cityIndex].children[areaIndex].key;
				}
			},
			//弹窗确认
			enterStore(val) {
				var idArray = '';
				var nameArray = '';
				var that = this;
				that.data2.forEach((data,dataIndex)=>{
					this.dataIndex.forEach((val, index) => {
						if(data.storeId==val){
							idArray += data.storeId+ ",";
							nameArray += data.storeId + ",";
						}
					})
				})
				this.storeArr = nameArray.substr(0,nameArray.length-1);;
				this.formScrm.storeId = idArray.substr(0,idArray.length-1);;
				this.formScrm.storeName = nameArray.substr(0,nameArray.length-1);;
				this.handleTabDialog = false;
			},
			// 监听穿梭框事件
			storeArray(val) {
				var idArray = '';
				var nameArray = '';
				var that = this;
				this.dataIndex = val;
				that.data2.forEach((data,dataIndex)=>{
					val.forEach((val, index) => {
						if(data.storeId==val){
							idArray += data.storeId+ ",";
							nameArray += data.storeId + ",";
						}
					})
				})
				this.formScrm.storeId = idArray.substr(0,idArray.length-1);
				this.formScrm.storeName = nameArray.substr(0,nameArray.length-1);
			},
			//门店搜索（tab）
			searchStoreTab() {
				var params = {
					"userId": this.userInfo.userCode,
					"searchContent": this.searchContent,
					"provinceId": this.provinceId,
					"cityId": this.cityId,
					"areaId": this.areaId
				}
				//				console.log(this.tabType);
				if(this.tabType == "门店") {
					params.flag = "1";
				}
				if(this.tabType == "店组") {
					params.flag = "2";
				}
				if(this.tabType == "区域") {
					params.flag = "3";
				}
				//				console.log(params)
				selectTabData(params)
					.then((res) => {
						let data = JSON.parse(Base64.decode(res.data));
						//		        		console.log(JSON.stringify(data)+"返回值")
						this.data2 = [];
						if(data != "") {
							if(this.tabType == "门店") {
								data.data.forEach((val, index) => {
									this.data2.push({
										index: index,
										storeName: val.storeName,
										storeId: val.storeId
									});
								})
							}
							if(this.tabType == "店组") {
								data.data.forEach((val, index) => {
									this.data2.push({
										index: index,
										storeName: val.storeGroupName,
										storeId: val.storeGroupId
									});
								})
							}
							if(this.tabType == "区域") {
								data.data.forEach((val, index) => {
									this.data2.push({
										index: index,
										storeName: val.storeAreaName,
										storeId: val.storeAreaId
									});
								})
							}
						}
					})
					.catch((err) => {
						// console.log(err)
					})
				$("#transfer").show();
			},
			// 确认时间
			getTimeDate(str) {
				//              console.log(str);
				if(str == '年') {
					this.timeYear = false;
					this.timeMonth = true;
					this.timeDay = true;
					this.formScrm.integralValidity.month = '';
					this.formScrm.integralValidity.day = '';
				}
				if(str == '月') {
					this.timeYear = true;
					this.timeMonth = false;
					this.timeDay = true;
					this.formScrm.integralValidity.year = '';
					this.formScrm.integralValidity.day = '';
				}
				if(str == '日') {
					this.timeYear = true;
					this.timeMonth = true;
					this.timeDay = false;
					this.formScrm.integralValidity.year = '';
					this.formScrm.integralValidity.month = '';
				}
			},
			handleSure() {
				// 确认
				// this.$emit('handleSure', false);
			}

		},
		created() {
			let that = this;
			// 门店配置默认选项
			if(this.childType == '按门店配置') {
				// console.log(this.childBrandFormData);
				if(this.childBrandFormData != '[]') {
					let data = JSON.parse(this.childBrandFormData)[0];
					// that.formScrm.decimalRule = data.decimalRule;
					// this.formScrm.integralValidity = data.integralValidity;
					// this.formScrm.overdueWarnDays = data.overdueWarnDays;
					// this.formScrm.freezingDays = data.freezingDays;
					// this.formScrm.discountLower = data.discountLower;
				}
			}
			// 钩子函数 -- 初始化
//			console.log(this.getFormData);
//		    console.log(this.getPageType);
//			console.log(this.formScrm.decimalRule)
			if(this.getPageType == '查看') {
//				console.log(1)
				let res = JSON.parse(this.getFormData);
				this.formScrm = {
					...res
				}
//				console.log(2)
				this.storeArr = res.storeName;
//				if(this.childType == '按门店配置') {
//					let merchantManagerUser = JSON.parse(Base64.decode(localStorage.getItem('merchantManagerUser')));
//				
//				console.log(3);	this.formScrm.integralModel = merchantManagerUser.integralModel;
//					this.formScrm.decimalRule = merchantManagerUser.decimalRule;
//					this.formScrm.integralValidity = merchantManagerUser.integralValidity;
//					this.formScrm.overdueWarnDays = merchantManagerUser.overdueWarnDays;
//					this.formScrm.freezingDays = merchantManagerUser.freezingDays;
//					this.formScrm.discountLower = merchantManagerUser.discountLower;
//				}
//				console.log(this.formScrm.decimalRule)
			} else if(this.getPageType == '修改') {
				let res = JSON.parse(this.getFormData);
				this.formScrm = {
					...res
				}
//				console.log(JSON.stringify(res))
				this.storeArr = res.storeName;
//				if(this.childType == '按门店配置') {
//					let merchantManagerUser = JSON.parse(Base64.decode(localStorage.getItem('merchantManagerUser')));
//					this.formScrm.integralModel = merchantManagerUser.integralModel;
//					this.formScrm.decimalRule = merchantManagerUser.decimalRule;
//					this.formScrm.integralValidity = merchantManagerUser.integralValidity;
//					this.formScrm.overdueWarnDays = merchantManagerUser.overdueWarnDays;
//					this.formScrm.freezingDays = merchantManagerUser.freezingDays;
//					this.formScrm.discountLower = merchantManagerUser.discountLower;
//				}
			} else {
				let formScrm =  {
					storeId: '', // 门店id
					storeName: '', // 门店name
					// integralModel: '', // 积分模式
					decimalRule: '', // 积分小数规则
					integralValidity: {
						msg: '', // 积分有效期
						timeSelect: '', // 选择有限时间
						year: '', // 年
						month: '', // 月
						day: '', // 日
						yearAfter: '', // 多少年后
						overdueMonth: '', // 过期月
						overdueDay: '', // 过期日
					}, // 积分有效期
					overdueWarnDays: '', // 过期预警天数
					freezingDays: '', // 消费积分冻结天数
					discountLower: {
						msg: '',
						ipt: ''
					}, // 折扣下限
					integralType: {
						msg: '',
						ipt1: '', // 每笔消费
						ipt2: '' // 订单金额
					}, // 积分类型
					giveCriterion: {
						msg: '',
//						ipt1: '', // 普通会员
//						ipt2: '', // 银卡会员
//						ipt3: '' // 金卡会员
					}, // 赠送标准
					integralDesc: '' // 积分说明
				};
				if(this.getFormData === '{}') {
					this.formScrm = formScrm;
				}
			}
			
//			for(var item in this.formScrm.giveCriterion){
//				if(item!="msg"){
//					this.formScrm.giveCriterion[item]='';
//				}
//			}
			let params={
				userId:this.userInfo.userCode
			}
			let str = '';
			let strName = '';
			selectLevalInfo(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
//	        		console.log(JSON.stringify(data)+"返回值");
	        		this.levelOption=[];
        			if(this.getPageType != '修改'&&this.getPageType != '查看'){
//	        			this.levelOptionForm=[];
        				this.formScrm.giveCriterion.msgData=[];
		        		data.data.forEach((val,index)=>{
	        				this.formScrm.giveCriterion.msgData.push({
	        					value:'',
	        					name:val.key,
	        					index:index
	        				})
		        		})
        			}
				})
				.catch((err) => {
//					 console.log(err)
				})
		},
		computed: {
			// 计算属性
			...mapGetters([
				'userInfo',
			]),
			getPageType() {
				return this.childPageType;
			},
			getFormData() {
				return this.childFormData;
			},
			storeArrayTag() {
				if(!this.formScrm.storeName) {
					return [];
				} else {
					return this.formScrm.storeName.split(',')
				}
			}
		},
		mounted() {
			let vm = this;
		    let imgHandler = async function(state) {
			    if (state) {
		    		vm.dialogVisiblePic=true;
			    }
		    }
		    vm.$refs.newEditor.quill.getModule("toolbar").addHandler("image", imgHandler)
		    $(".ql-audio").click(function(){
				vm.dialogVisibleAudio=true;
			})
			
			$(".ql-videoLink").click(function(){
	    		vm.dialogVisibleVideo=true;
				vm.$nextTick(() => {
	    			vm.$refs.groupMaterialListVideo.handleMaterialLibraryListShow();
				});
			})
		},
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	
	.el-form {
		width: rem(700px);
		min-width: 500px;
	}
	
	.el-select {
		width: 100%;
	}
	
	.el-select {
		width: 100%;
	}
	
	// 行内文本 span
	.formText {
		display: inline;
		line-height: rem(30px);
	}
	
	.el-header {
		padding: rem(10px);
		background: #EEE;
		position: relative;
	}
	
	.el-main {
		padding: rem(10px);
	}
	
	.widthInline {
		width: rem(90px);
		margin: 0 rem(10px);
	}
	
	.container .handleSure {
		margin: 0 auto;
	}
	
	.blockRadio {
		display: block;
		margin: 15px 0;
	}
	
	// 相对有效
	.formScrmIVrelative {
		position: absolute;
		top: -18px;
		left: 100px;
	}
	
	.formScrmIVgiveCriterion {
		margin-left: 24px;
		margin-top: 10px;
	}

	.searchContent {
		width: 160px;
		margin-bottom: 10px;
	}
	.integral-container{
		height:350px;
		overflow-y: auto;
	}
	.marginTop10{
		margin-top: 10px;
	}
	.marginLeft0{
		margin-left: 0;
	}
	.marginTop0{
		margin-top: 0;
	}
</style>