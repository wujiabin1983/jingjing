<!--积分兑礼-新增-->
<template>
	<el-container class="app-container">
		<el-main>
			<el-button @click="handleBack" v-if="this.getPageType=='查看'" class="marginBottom10">返回</el-button>
			<el-card>
				<el-form :model="form" :rules="this.getPageType=='查看' ? norules : rules" v-loading="tableLoading" ref="form" label-width="120px" class="el-dsh-form demo-form">
					<el-form-item label="活动名称" prop="activityName" class="inlineItemInput">
						<el-input v-model="form.activityName" :disabled="disabled" placeholder="请输入活动名称"></el-input>
					</el-form-item>
					<el-form-item label="所属门店" placeholder="请选择门店" prop="applyOrg">
						<el-input v-model="storeArr" :disabled="true" placeholder="请选择门店" class="store width280"></el-input>
						<el-button type="primary" id="search" v-if="this.getPageType!='查看'" @click="searchStorePop">选择</el-button>
					</el-form-item>
					<el-form-item label="兑换商品" prop="goodType">
						<el-radio-group v-model="form.goodType" @change="goodTypeChange" class="paddingTop0">
							<el-radio label="虚拟商品" :disabled="disabled">虚拟商品
							</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="商品名称" prop="goodName" class="inlineItemInput">
						<el-input v-model="form.goodName" :disabled="disabled" placeholder="请输入商品名称"></el-input>
					</el-form-item>
					<el-form-item label="商品编码" prop="goodCode" class="inlineItemInput">
						<el-input v-model="form.goodCode" placeholder="请输入商品编码" :disabled="setDisabled"></el-input>
					</el-form-item>
					<el-form-item label="商品图片-主图" prop="goodUrl">
						<!-- <el-button type="primary" @click="clickTest" class="el-button-upload" v-if="this.getPageType!='查看'" >上传图片</el-button>	
						<el-button type="primary" @click="handleUploadDelete" v-if="this.getPageType!='查看'" >删除</el-button>	 -->
						<!-- <el-upload class="avatar-uploader" :disabled="disabled" :action="uploadAction" :show-file-list="false" :http-request="beforeAvatarUpload"> -->
						<div class="icon-close" v-loading="imgLoading">
							<img v-if="imageUrl" :src="imageUrl" @click="clickTest" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon" @click="clickTest"></i>
							<i v-if="imageUrl&&this.getPageType!='查看'" class="el-icon-circle-close" @click="handleUploadDelete"></i>
						</div>
						<!-- </el-upload> -->
						<form :action="uploadAction" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
							<input type="file" name="file" ref="uploadIpt" @change="handleSelectImg" />
							<input type="submit" value="上传" ref="uploadSubmit" />
						</form>
						<iframe name="uploadFrame" id="uploadFrame" v-show="false"></iframe>
						<el-dialog :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog>
						<p class="activitySpan">图片建议尺寸：140像素*140像素</p>
					</el-form-item>
					<el-form-item label="商品图片-附图" prop="">
						<el-button type="primary" @click="clickUpload" v-if="this.getPageType!='查看'">上传图片</el-button>
						<p class="activitySpan">图片建议尺寸：320像素*136像素</p>
						<div class="componentBox" v-loading="tableLoadingOther">
							<i v-if="dialogImageUrlArr.length=='0'" class="el-icon-plus avatar-uploader-icon"></i>
							<div class="component" v-for="(item, index) in dialogImageUrlArr">
								<i class="el-icon-circle-close componentDelete" v-if="getPageType!='查看'" :index="index" @click="handleImgsDelete"></i>
								<!-- <div class="componentDelete" :index="index" @click="handleImgsDelete"></div> -->
								<img v-if="item" :src="item" class="avatar">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</div>
						</div>
						<form :action="uploadAction" method="post" enctype="multipart/form-data" target="uploadFrame" v-show="false">
							<input type="file" name="file" ref="uploadIpts" @change="handleSelectImgs" />
							<input type="submit" value="上传" ref="uploadSubmit" />
						</form>
						<iframe name="uploadFrame" id="uploadFrame" v-show="false"></iframe>
						<el-dialog :visible.sync="dialogVisibleInfo">
							<img width="100%" :src="dialogImageUrlInfo" alt="">
						</el-dialog>
					</el-form-item>
					<el-form-item label="销售价格" prop="salePrice" class="inlineItemInput">
						<el-input v-model="form.salePrice" :disabled="disabled" placeholder="请输入销售价格" class="width280"></el-input><span class="marginLeft10">元</span>
					</el-form-item>
					<el-form-item label="商品描述" prop="goodDesc" class="inlineItemInput">
						<el-input type="textarea" :disabled="disabled" :autosize="{ minRows: 4, maxRows: 4}" resize="none" placeholder="请输入商品描述" v-model="form.goodDesc">
						</el-input>
					</el-form-item>
					<el-form-item label="兑换有效期" prop="validityDateBegin">
						<el-date-picker :disabled="disabled" v-model="timeRangeArr" :picker-options="pickerOptions0" :editable="false" @change="selectDate" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="兑换积分值" prop="integralJson">
						<el-input v-model="form.integralJson" v-show=""></el-input>
						<el-radio-group v-model="integral" @change="radioIntegral">
							<el-radio label="统一设置" :disabled="disabled">统一设置</el-radio>
							<el-radio label="按等级设置" :disabled="disabled" class="marginLeft40">按等级设置</el-radio>
							<div class="marginTop10" v-if="integral=='统一设置'">
								<el-form :model="formIntegral" :rules="this.getPageType=='查看' ? norules : rulesIntegral" ref="rulesIntegral" label-width="80px" class="demo-form marginTop30">
									<el-form-item label="所需积分" prop="integralValue" class="name">
										<el-input v-model="formIntegral.integralValue" :disabled="disabled" placeholder="请输入所需积分"></el-input>
									</el-form-item>
									<el-form-item label="所需金额" prop="amountValue" class="name">
										<el-input v-model="formIntegral.amountValue" :disabled="disabled" placeholder="请输入所需金额"></el-input>
									</el-form-item>
								</el-form>
							</div>
							<el-card class="card-radio" v-if="integral=='按等级设置'">
								<table border="0" cellspacing="0">
									<thead>
										<tr>
											<th>等级</th>
											<th>所需积分</th>
											<th>所需金额</th>
											<th>操作</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(item, index) in addTableData" :key="item">
											<td>
												<el-select v-model="item.level" @change="levelChange(item.level,index)" :disabled="disabled" class="tableSelect" clearable placeholder="请选择">
													<el-option v-for="item in levalInfo" :key="item.key" :label="item.key" :value="item.key">
													</el-option>
												</el-select>
											</td>
											<td>
												<el-input v-model="item.integral" @change="integralChange(item.integral,index)" :disabled="disabled"></el-input>
												</el-input>
											</td>
											<td>
												<el-input v-model="item.amount" @change="amountChange(item.amount,index)" :disabled="disabled"></el-input>
												</el-input>
											</td>
											<td>
												<el-tooltip class="item" content="删除" v-if="count!='0'">
													<icon-svg class="icon" icon-class="shanchu" @click.native.prevent="iconDeleteAdd(index)" />
												</el-tooltip>
											</td>
										</tr>
									</tbody>
									<tfoot v-if="this.getPageType!='查看'">
										<tr>
											<td colspan="4" @click="iconAddTr" class="height30">
												<i class="el-icon-plus iconAdd"></i>
											</td>
										</tr>
									</tfoot>
								</table>
							</el-card>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="可兑换总数" prop="totalNum" class="inlineItemInput">
						<el-input v-model="form.totalNum" :disabled="disabled" placeholder="请输入可兑换总数"></el-input>
					</el-form-item>
					<el-form-item label="每人限兑次数" prop="restrictNum" class="inlineItemInput">
						<el-input v-model="form.restrictNum" :disabled="disabled" placeholder="请输入每人限兑次数" class="width70"></el-input><span>（0表示无限制）</span>
					</el-form-item>
					<el-form-item label="兑换礼品券" prop="coupName">
						<el-input v-model="coupTempName" :disabled="true" placeholder="选择兑换礼品券" class="width280"></el-input>
						<el-button type="primary" id="search" @click="coupTempClick" v-if="this.getPageType!='查看'">选择</el-button>
					</el-form-item>
					<el-form-item label="券有效期" prop="coupTest">
						<el-radio-group v-model="coupDate" @change="radioTimeHandle">
							<div class="height30">
								<el-radio label="长期" class="radio" :disabled="disabled">
									<div class="radioInfo">
										<span class="formText">自领取之日起</span>
										<el-input class="inlineFormItem" v-model="form.coupTest" @change="dayChange" :disabled="dateInputDisabled" placeholder="请输入" type="number" min="1" prop="drawNum"></el-input>
										<span class="formText">天内有效</span>
									</div>
								</el-radio>
							</div>
							<div>
								<el-radio label="时间段" :disabled="disabled">
									<el-date-picker :disabled="datePickerDisabled" v-model="timeRange" :editable="false" @change="selectCoupDate" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
									</el-date-picker>
								</el-radio>
							</div>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="自提门店" placeholder="请选择自提门店" prop="useObject">
						<el-input v-model="storePickArr" :disabled="true" placeholder="请选择门店" class="store width280"></el-input>
						<el-button type="primary" id="search" v-if="this.getPageType!='查看'" :disabled="useObject" @click="searchStorePickPop">选择</el-button>
					</el-form-item>
					<el-form-item label="自提说明" prop="explainDesc" class="inlineItemInput">
						<el-input type="textarea" :disabled="disabled" :autosize="{ minRows: 4, maxRows: 4}" resize="none" placeholder="请输入自提说明" v-model="form.explainDesc">
						</el-input>
					</el-form-item>
					<el-row :gutter="10" v-if="this.getPageType!='查看'">
						<el-col :span="24">
							<el-form-item>
								<el-button @click="handleBack">返回</el-button>
								<el-button type="primary" @click="submitForm('form')">确定</el-button>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-card>
			<el-dialog title="选择门店" :visible.sync="handleStoreDialog" class="dialogOne">
				<el-form :inline="true" :model="formStore" class="demo-form-inline marginTop10">
					<el-form-item class="floatRight">
						<el-button type="primary" @click="onSubmitStore">查询</el-button>
					</el-form-item>
					<el-form-item label="" class="floatRight marginRight10">
						<el-input placeholder="请输入门店名称或门店编码" class="width200" v-model="formStore.searchContent"></el-input>
					</el-form-item>
				</el-form>
				<el-table ref="tableDataStore" v-loading="tableSelectLoading" :data="tableDataStore" border highlight-current-row class="el-tableRadio" @current-change="handleSelectionStoreChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="storeId" width="150" label="门店编码"></el-table-column>
					<el-table-column prop="storeName" width="150" label="门店名称"></el-table-column>
					<el-table-column prop="address" min-width="250" label="地址"></el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-footer v-if="countStore>limit">
					<el-pagination background class="pagination" layout="total,prev, pager, next, jumper" :page-size="limit" :total="countStore" @current-change="handleCurrentChangeStore">
					</el-pagination>
				</el-footer>
				<div slot="footer" class="dialog-footer overHidden">
					<el-button @click="handleStoreDialog = false">取 消</el-button>
					<el-button type="primary" @click="enterStore">确 定</el-button>
				</div>
			</el-dialog>

			<el-dialog title="选择店组" :visible.sync="handleGroupDialog" class="dialogOne">
				<el-form :inline="true" :model="formGroup" class="demo-form-inline marginTop10">
					<el-form-item class="floatRight">
						<el-button type="primary" @click="onSubmitGroup">查询</el-button>
					</el-form-item>
					<el-form-item label="" class="floatRight marginRight10">
						<el-input placeholder="请输入店组名称或店组编码" class="width200" v-model="formGroup.searchContent"></el-input>
					</el-form-item>
				</el-form>
				<el-table ref="tableDataGroup" v-loading="tableSelectLoading" :data="tableDataGroup" border highlight-current-row class="el-tableRadio" @current-change="handleSelectionGroupChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="storeGroupId" width="150" label="店组编码"></el-table-column>
					<el-table-column prop="storeGroupName" width="150" label="店组名称"></el-table-column>
					<el-table-column prop="storeList" min-width="250" label="门店名称"></el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-footer v-if="countGroup>limit">
					<el-pagination background class="pagination" layout="total,prev, pager, next, jumper" :page-size="limit" :total="countGroup" @current-change="handleCurrentChangeGroup">
					</el-pagination>
				</el-footer>
				<div slot="footer" class="dialog-footer overHidden">
					<el-button @click="handleGroupDialog = false">取 消</el-button>
					<el-button type="primary" @click="enterStore">确 定</el-button>
				</div>
			</el-dialog>

			<el-dialog title="选择区域" :visible.sync="handleAreaDialog" class="dialogOne">
				<el-form :inline="true" :model="formArea" class="demo-form-inline marginTop10">
					<el-form-item class="floatRight">
						<el-button type="primary" @click="onSubmitArea">查询</el-button>
					</el-form-item>
					<el-form-item label="" class="floatRight marginRight10">
						<el-input placeholder="请输入区域名称或区域编码" class="width200" v-model="formArea.searchContent"></el-input>
					</el-form-item>
				</el-form>
				<el-table ref="tableDataArea" v-loading="tableSelectLoading" :data="tableDataArea" border highlight-current-row class="el-tableRadio" @current-change="handleSelectionAreaChange">
					<el-table-column type="index" width="50" label="序号"></el-table-column>
					<el-table-column prop="storeAreaId" width="150" label="区域编码"></el-table-column>
					<el-table-column prop="storeAreaName" width="150" label="区域名称"></el-table-column>
					<el-table-column prop="storeGroupList" min-width="250" label="店组名称"></el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-footer v-if="countArea>limit">
					<el-pagination background class="pagination" layout="total,prev, pager, next, jumper" :page-size="limit" :total="countArea" @current-change="handleCurrentChangeArea">
					</el-pagination>
				</el-footer>
				<div slot="footer" class="dialog-footer overHidden">
					<el-button @click="handleAreaDialog = false">取 消</el-button>
					<el-button type="primary" @click="enterStore">确 定</el-button>
				</div>
			</el-dialog>
			<!--门店区域店组-->
			<el-dialog title="" :visible.sync="handleTabDialog" class="dialogTab">
				<template>
					<el-tabs v-model="activeName" @tab-click="handleClick">
						<el-tab-pane label="门店" name="first" v-loading="tableSelectLoading">
							<el-form :inline="true" :model="formStore" class="demo-form-inline marginTop10">
								<el-form-item class="floatRight">
									<el-button type="primary" @click="onSubmitStore">查询</el-button>
								</el-form-item>
								<el-form-item label="" class="floatRight marginRight10">
									<el-input placeholder="请输入门店名称或门店编码" class="width200" v-model="formStore.searchContent"></el-input>
								</el-form-item>
							</el-form>
							<el-table ref="tableDataStore" :data="tableDataStore" border highlight-current-row class="el-tableRadio" @current-change="handleSelectionStoreChange">
								<el-table-column type="index" width="50" label="序号"></el-table-column>
								<el-table-column prop="storeId" width="150" label="门店编码"></el-table-column>
								<el-table-column prop="storeName" width="150" label="门店名称"></el-table-column>
								<el-table-column prop="address" min-width="250" label="地址"></el-table-column>
							</el-table>
							<!-- 分页 -->
							<el-footer v-if="countStore>limit">
								<el-pagination background class="pagination" layout="prev, pager, next, jumper" :page-size="limit" :total="countStore" @current-change="handleCurrentChangeStore">
								</el-pagination>
							</el-footer>
						</el-tab-pane>
						<el-tab-pane label="店组" name="second" v-loading="tableSelectLoading">
							<el-form :inline="true" :model="formGroup" class="demo-form-inline marginTop10">
								<el-form-item class="floatRight">
									<el-button type="primary" @click="onSubmitGroup">查询</el-button>
								</el-form-item>
								<el-form-item label="" class="floatRight marginRight10">
									<el-input placeholder="请输入店组名称或店组编码" class="width200" v-model="formGroup.searchContent"></el-input>
								</el-form-item>
							</el-form>
							<el-table ref="tableDataGroup" :data="tableDataGroup" border highlight-current-row class="el-tableRadio" @current-change="handleSelectionGroupChange">
								<el-table-column type="index" width="50" label="序号"></el-table-column>
								<el-table-column prop="storeGroupId" width="150" label="店组编码"></el-table-column>
								<el-table-column prop="storeGroupName" width="150" label="店组名称"></el-table-column>
								<el-table-column prop="storeList" min-width="250" label="门店名称"></el-table-column>
							</el-table>
							<!-- 分页 -->
							<el-footer v-if="countGroup>limit">
								<el-pagination background class="pagination" layout="prev, pager, next, jumper" :page-size="limit" :total="countGroup" @current-change="handleCurrentChangeGroup">
								</el-pagination>
							</el-footer>
						</el-tab-pane>
						<el-tab-pane label="区域" name="third" v-loading="tableSelectLoading">
							<el-form :inline="true" :model="formArea" class="demo-form-inline marginTop10">
								<el-form-item class="floatRight">
									<el-button type="primary" @click="onSubmitArea">查询</el-button>
								</el-form-item>
								<el-form-item label="" class="floatRight marginRight10">
									<el-input placeholder="请输入区域名称或区域编码" class="width200" v-model="formArea.searchContent"></el-input>
								</el-form-item>
							</el-form>
							<el-table ref="tableDataArea" :data="tableDataArea" border highlight-current-row class="el-tableRadio" @current-change="handleSelectionAreaChange">
								<el-table-column type="index" width="50" label="序号"></el-table-column>
								<el-table-column prop="storeAreaId" width="150" label="区域编码"></el-table-column>
								<el-table-column prop="storeAreaName" width="150" label="区域名称"></el-table-column>
								<el-table-column prop="storeGroupList" min-width="250" label="店组名称"></el-table-column>
							</el-table>
							<!-- 分页 -->
							<el-footer v-if="countArea>limit">
								<el-pagination background class="pagination" layout="prev, pager, next, jumper" :page-size="limit" :total="countArea" @current-change="handleCurrentChangeArea">
								</el-pagination>
							</el-footer>
						</el-tab-pane>
					</el-tabs>
				</template>
				<div slot="footer" class="dialog-footer overHidden">
					<el-button @click="handleTabDialog = false">取 消</el-button>
					<el-button type="primary" @click="enterStore">确 定</el-button>
				</div>
			</el-dialog>
			<el-dialog title="选择礼品券" :visible.sync="handleTabDialogCoup" class="dialogOne">
				<template>
					<div class="search">
						<!--<el-select v-model="couponType" class="searchContent" clearable placeholder="请选择券类型">
							<el-option label="礼品券" value="礼品券"></el-option>
							<el-option label="折扣券" value="折扣券"></el-option>
							<el-option label="代金券" value="代金券"></el-option>
						</el-select>-->
						<el-input v-model="coupLibraryKey" class="searchContent" placeholder="请输入券ID或券名称"></el-input>
						<el-button type="primary" id="search" @click="searchLibrary">搜索</el-button>
					</div>
					<el-table ref="tableDataTab" v-loading="tableSelectLoading" :data="coupDataTab" highlight-current-row border class="el-tableRadio" @current-change="handleSelectionChangeTab">
						<el-table-column type="index" width="50" label="序号"></el-table-column>
						<el-table-column prop="couponType" label="类型"></el-table-column>
						<el-table-column prop="coupName" label="券名称"></el-table-column>
					</el-table>
					<!-- 分页 -->
					<el-footer v-if="count != 0">
						<el-pagination background class="pagination" layout="prev, pager, next, jumper" :page-size="limit" :total="count" @current-change="handleCoupChange">
						</el-pagination>
					</el-footer>
				</template>
				<div slot="footer" class="dialog-footer overHidden">
					<el-button @click="handleTabDialogCoup = false">取 消</el-button>
					<el-button type="primary" @click="enterCoup">确 定</el-button>
				</div>
			</el-dialog>
		</el-main>
	</el-container>
</template>
<script>
	import { uploadImg } from '@/api/base/brandInfo'
	import { returnSelectedFile } from '@/api/upload'
	import { selectCouponLibraryJurisdiction } from '@/api/member/couponLibrary'
	import { validateInt, validateFloat } from '@/utils/validate'
	import { selectAudioUser, selectLevalInfo, selectProCityArea, selectGroupInfo, selectAreaStoreInfo, selectStoreData, selectTabData } from '@/api/public'
	import { creatRitualData, setRitualData } from '@/api/tool/ritualOflntegration'
	import { mapGetters } from 'vuex'
	import Cookie from 'js-cookie'

	const isInt = (rule, value, callback) => {
		if(!validateInt(value) && value != "0") {
			callback(new Error('请输入有效数字'))
		} else {
			callback()
		}
	}
	const isFloat = (rule, value, callback) => {
		if(!validateFloat(value)) {
			callback(new Error('请输入有效数字'))
		} else {
			callback()
		}
	}
	export default {
		data() {
			return {
			 	pickerOptions0: {
		          	disabledDate(time) {
		            	return time.getTime() < Date.now() - 8.64e7;
		          	}
		        },  
		        tableSelectLoading:false,
				disabled: false,
				imgLoading: false,
				setDisabled: false,
				tableLoadingOther: false,
				useObject: false,
				addTableData: [{
					integral: '',
					amount: '',
					level: ''
				}],
				type: '',
				formIntegral: {
					amountValue: '', //兑换积分值 - 统一设置 - 金额
					integralValue: '' //兑换积分值 - 统一设置 - 积分
				},
				rulesIntegral: {
					amountValue: [{
							required: true,
							message: '请输入所需金額',
							trigger: 'change'
						},
						{
							validator: isFloat
						}
					],
					integralValue: [{
							required: true,
							message: '请输入所需积分',
							trigger: 'change'
						},
						{
							validator: isInt
						}
					],
				},
				imageUrl: '',
				storePickArr: '',
				integral: '统一设置',
				dateInputDisabled: false, //券有效期
				datePickerDisabled: true,
				coupTempName: '', //优惠券input
				coupDataTab: [], //优惠券表格
				couponType: '礼品券',
				coupLibraryKey: '',
				timeRangeArr: [], //兑换有效期
				dialogVisible: false, //图片查看
				dialogVisibleInfo: false,
				handleTabDialogCoup: false, //优惠券弹窗
				dialogImageUrl: '', // 
				dialogImageUrlInfo: '', //查看详情图片
				dialogImageUrlArr: [], // 图片列表
				uploadAction: Cookie.get('baseUrl') + '/I_SCRM_INTERFACE_052.action', // 上传图片路径
				coupDate: '长期', //券有效期单选值
				timeRange: [], //券有效期时间段
				couDateType: '', //券有效期日期
				formStore: {
					searchContent: ''
				},
				formGroup: {
					searchContent: ''
				},
				formArea: {
					searchContent: ''
				},
				// 表格数据
				selectDataType: '',
				activeName: 'first', //tab页签默认选择first
				tabType: '门店', //tab页签默认选择门店
				handleStoreDialog: false, //选择门店弹窗
				handleGroupDialog: false, //选择店组弹窗
				handleAreaDialog: false, //选择区域弹窗
				handleTabDialog: false, //选择品牌弹窗
				searchContent: '', //门店名称或编码
				storeArr: '', //回显所属门店
				tableDataStore: [], //门店表格存放
				tableDataGroup: [], //店组表格存放
				tableDataArea: [], //区域表格存放
				tableDataStoreSelect: {}, //门店选中存放
				tableDataGroupSelect: {}, //店组选择存放
				tableDataAreaSelect: {}, //区域选择存放
				levalInfo:[],//等级
				//分页
				pageStore: 0, // 当前页门店
				countStore: 0, // 当前页门店
				pageGroup: 0, // 当前页店组
				countGroup: 0, // 当前页店组
				pageArea: 0, // 当前页区域
				countArea: 0, // 当前页区域
				// 搜索数据
				form: {
					"activityName": "", //活动名称
					"applyOrg": "", //所属门店{}
					"goodType": "虚拟商品", //兑换商品
					"goodCode": "", //商品编码
					"goodName": "", //商品名称
					"goodUrl": "", //商品图片{}
					"salePrice": "", //销售价格
					"salePrice": "", //商品描述
					"validityDateBegin": "", //兑换有效期起
					"validityDateEnd": "", //兑换有效期止
					"integralJson": "", //兑换积分值{}
					"totalNum": "", //可兑换总数
					"restrictNum": "", //每人限兑次数
					"coupId": "", //兑换礼品券Id,
					"coupName": "", //兑换礼品券Name,
					"couDate":"", //券有效期, {}
					"coupTest":"",
					"explainDesc": "" //自提说明
				},
				norules: {},
				rules: {
					activityName: [{
						required: true,
						message: '请输入活动名称',
						trigger: 'change'
					}],
					applyOrg: [{
						required: true,
						message: '请选择所属门店',
						trigger: 'change'
					}],
					goodCode: [{
						required: true,
						message: '请输入商品编码',
						trigger: 'change'
					}],
					goodName: [{
						required: true,
						message: '请输入商品名称',
						trigger: 'change'
					}],
					goodUrl: [{
						required: true,
						message: '请上传商品图片',
						trigger: 'change'
					}],
					salePrice: [{
							required: true,
							message: '请输入销售价格',
							trigger: 'change'
						},
						{
							validator: isFloat
						}
					],
					validityDateBegin: [{
						required: true,
						message: '请选择兑换有效期',
						trigger: 'change'
					}],
					integralJson: [{
						required: true,
						message: '请输入兑换积分信息',
						trigger: 'change'
					}],
					totalNum: [{
							required: true,
							message: '请输入可兑换总数',
							trigger: 'change'
						},
						{
							validator: isInt
						}
					],
					restrictNum: [{
							required: true,
							message: '请输入每人限兑次数',
							trigger: 'change'
						},
						{
							validator: isInt
						}
					],
					coupName: [{
						required: true,
						message: '请选择兑换礼品券',
						trigger: 'change'
					}],
					coupTest: [{
						required: true,
						message: '请输入券有效期',
						trigger: 'change'
					}],
				},
				mainLogoUrl: '', //主图url
				mainLogoUrlArr: [], //附图url
				// 表格数据
				tableData: [{
					brandId: '',
					brandName: '',
					brandLogo: '',
					brandDesc: '',
					nickname: '',
					integralRuleName: ''
				}],
				page: 0, // 
				count: 0, // 
				limit: this.GLOBAL.limitDialog, // 条/页
				// 表格多选
				multipleSelection: [],
				// 表格是否为加载状态
				tableLoading: false
			}
		},
		methods: {
			dayChange(val) {
//				console.log(val)
				var params = {
					type: val
				}
				this.form.couDate = JSON.stringify(params);
			},
			levelChange(val,index){
				if(this.addTableData[index].integral!=""&&this.addTableData[index].amount!=""){
					var params = {
						type: this.integral,
						integral: '',
						amount: '',
						data: this.addTableData
					}
					this.form.integralJson = JSON.stringify(params);
				}
//				console.log(val,index)
			},
			integralChange(val,index){
				if(this.addTableData[index].level!=""&&this.addTableData[index].amount!=""){
					var params = {
						type: this.integral,
						integral: '',
						amount: '',
						data: this.addTableData
					}
					this.form.integralJson = JSON.stringify(params);
				}
//				console.log(val,index)
			},
			amountChange(val,index){
				if(this.addTableData[index].integral!=""&&this.addTableData[index].level!=""){
					var params = {
						type: this.integral,
						integral: '',
						amount: '',
						data: this.addTableData
					}
					this.form.integralJson = JSON.stringify(params);
				}
//				console.log(val,index)
			},
			iconAddTr() { // 添加
				let setTableData = this.addTableData[this.count];
				if(setTableData.level == '') {
					this.$message.warning('请选择等级');
				} else if(setTableData.integral == '') {
					this.$message.warning('请输入所需积分');
				} else {
					this.count++;
					this.addTableData.push({
						integral: '',
						amount: '',
						level: ''
					});
				}
			},
			//删除
			iconDeleteAdd(index) {
				this.count--;
				this.data2 = [];
				this.dataIndex = [];
				this.value2 = [];
				this.addTableData.splice(index, 1);
			},
			//监听优惠券
			handleSelectionChangeTab(val) {
				this.coupTempName = val.coupName;
				this.form.coupName = val.coupName;
				this.form.coupId = val.coupId;
			},
			// 方法
			submitForm() {
				if(this.getPageType == '查看') {
					this.$router.push({
						name: '积分兑礼'
					});
					return false;
				}
				var that = this;
				var goodUrlObj = {};
				if(this.mainLogoUrl != "") {
					var params = {
						goodType: "主图",
						attaUrl: this.mainLogoUrl
					}
					goodUrlObj.main = params;
				}
				if(this.mainLogoUrlArr.length > 0) {
					let dialogImageUrlStr = '';
					this.mainLogoUrlArr.forEach((val, index) => {
						dialogImageUrlStr += val + ",";
					})
					var params = {
						goodType: "附图",
						attaUrl: dialogImageUrlStr
					}
					goodUrlObj.atta = params;
				}
				this.form.goodUrl = JSON.stringify(goodUrlObj);
//				if(this.coupDate == "长期") {
//					var params = {
//						type: this.couDateType
//					}
//					this.form.couDate = JSON.stringify(params);
//				}
				var params = {
					type: this.integral,
					integral: this.formIntegral.integralValue,
					amount: this.formIntegral.amountValue,
					data: this.addTableData
				}
				if(this.integral == "统一设置") {
					this.$refs['rulesIntegral'].validate((valid) => {
						if(valid) {
							var params = {
								type: this.integral,
								integral: this.formIntegral.integralValue,
								amount: this.formIntegral.amountValue,
								data: ''
							}
							this.form.integralJson = JSON.stringify(params);
						}
					})
				}
				if(this.integral == "按等级设置") {
					var params = {
						type: this.integral,
						integral: '',
						amount: '',
						data: this.addTableData
					}
					this.form.integralJson = JSON.stringify(params);
				}
				
				this.$refs['form'].validate((valid) => {
					if(valid) {
						var params = {
							userId: this.userInfo.userCode,
							...this.form
						}
						if(JSON.parse(params.coupTest).times){
							var activityDate = new Date(params.validityDateEnd).getTime();
							var coupDate = new Date(JSON.parse(params.coupTest).times.end).getTime();
							if(activityDate>coupDate){
								this.$message.warning('优惠券有效期不能小于活动日期！');
								return false;
							}
						}
						this.tableLoading = true;
//						console.log(JSON.stringify(params));
//						return false;
						if(this.getPageType == '添加') {
							creatRitualData(params)
								.then(function(res) {
									let data = JSON.parse(Base64.decode(res.data));
									//						console.log(JSON.stringify(data))
									if(data.messageType == 'SUCCESS') {
										that.$router.push({
											name: '积分兑礼'
										});
										that.$message.success(data.messageContent);
										that.tableLoading = false;
									} else {
										that.$message.error(data.messageContent);
										that.tableLoading = false;
									}
								})
								.catch(function(err) {
									// console.log(err);
									that.tableLoading = false;
								});
						}
						if(this.getPageType == '修改') {
//							console.log(JSON.stringify(params))
							setRitualData(params)
								.then(function(res) {
									let data = JSON.parse(Base64.decode(res.data));
									// console.log(JSON.stringify(data))
									if(data.messageType == 'SUCCESS') {
										that.$router.push({
											name: '积分兑礼'
										});
										that.$message.success(data.messageContent);
										that.tableLoading = false;
									} else {
										that.$message.error(data.messageContent);
										that.tableLoading = false;
									}
								})
								.catch(function(err) {
									// console.log(err);
									that.tableLoading = false;
								});
						}
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			//兑换有效期
			selectDate(val) {
				this.form.validityDateBegin = val[0];
				this.form.validityDateEnd = val[1];
			},
			//券有效期
			selectCoupDate(val) {
				var params={
					times:{
						begin:val[0],
						end:val[1]
					}
				}
				//      	console.log(val)
				this.form.couDate=JSON.stringify(params);
				this.form.coupTest=JSON.stringify(params);
			},
			handleSelectImg(file) { // 上传图片-主图
				let that = this;
				let files = file.target.files[0];
				// console.log(files);return false;
				//判断file的类型是不是图片类型。 
				if(!files) {
					return false;
				} else {
					if(!/image\/\w+/.test(files.type)) {
						this.$message("请上传一张图片");
						return false;
					}
					this.imgLoading = true;
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
								// console.log(msg.fileName)
								that.imgLoading = false;
								if(code == 'SUCCESS') {
									that.mainLogoUrl = msg.fileName; // 图片赋值
									that.dialogImageUrl = msg.fileName; // 图片回填 - 本地图片
									that.imageUrl = msg.fileName + '?x-oss-process=style/small';
									that.$message.success('上传成功');
								} else {
									that.$message({
										message: msg,
										type: 'warning'
									});
								}
							})
							.catch((err) => {
								that.imgLoading = false;
								// console.log(err);
							})
					}
				}
			},
			goodTypeChange(val) {
				this.form.goodType = val;
			},
			handleSelectImgs(file) { // 上传图片-附图
				let that = this;
				let files = file.target.files[0];
				// console.log(files);return false;
				//判断file的类型是不是图片类型。 
				if(!/image\/\w+/.test(files.type)) {
					this.$message("请上传一张图片");
					return false;
				}
				this.tableLoadingOther = true;
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
							that.tableLoadingOther = false;
							if(code == 'SUCCESS') {
								//								console.log(msg.fileName)
								that.mainLogoUrlArr.push(msg.fileName)
								
								if(that.form.activityUrl!=""){
									that.dialogImageUrlArr.push(msg.fileName + '?x-oss-process=style/small'); // 图片回填 - 本地图片
								}
								that.$message.success('上传成功');
							} else {
								that.$message({
									message: msg,
									type: 'warning'
								});
							}
//							console.log(that.dialogImageUrlArr)
						})
						.catch((err) => {
							that.tableLoadingOther = false;
							// console.log(err);
						})
				}
			},
			clickTest() {
				if(this.getPageType!='查看'){
					this.$refs.uploadIpt.dispatchEvent(new MouseEvent('click'));
				}
			},
			clickUpload() {
				if(this.getPageType!='查看'){
					this.$refs.uploadIpts.dispatchEvent(new MouseEvent('click'));
				}
			},
			handlePictureCardPreview(file) { // 图片查看
				this.dialogVisible = true;
			},
			handlePictureCardPreviewInfo(file) { // 图片查看
				//				console.log(file.explicitOriginalTarget.src)
				let str = file.explicitOriginalTarget.src;
				str = str.substr(0, str.length - 26);
				this.dialogImageUrlInfo = str;
				this.dialogVisibleInfo = true;
			},
			handleUploadDelete() { // 删除图片
				this.dialogImageUrl = '';
				this.imageUrl = '';
				this.mainLogoUrl = ''; // 图片赋值
				this.$refs.uploadIpt.value = '';
			},
			handleImgsDelete(val) {
				// console.log()
				let index = parseInt(val.target.attributes.index.value);
				this.$refs.uploadIpts.value = '';
				this.dialogImageUrlArr.splice(index, 1);
				this.mainLogoUrlArr.splice(index, 1);
			},
			//返回
			handleBack() {
				this.$router.push({
					name: '积分兑礼'
				});
			},
			//兑换积分值单选
			radioIntegral(str) {
				if(str == "按等级设置") {
					this.$nextTick(function(){
						this.loadinglevel();
					})
					this.formIntegral.integralValue = '';
					this.formIntegral.amountValue = '';
				}
				if(str == "统一设置") {
					this.addTableData = [{
						integral: '',
						amount: '',
						level: ''
					}];
				}
			},
			// 单选券有效期
			radioTimeHandle(str) {
				this.type = str;
				if(this.type == '时间段') {
					this.datePickerDisabled = false;
					this.dateInputDisabled = true;
					this.form.coupTest='';
					this.form.couDate='';
					this.timeRange = [];
				} else if(this.type == '长期') {
					this.datePickerDisabled = true;
					this.dateInputDisabled = false;
					this.form.coupTest='';
					this.form.couDate='';
					this.timeRange = [];
				}
			},
			//点击选择券模板
			coupTempClick() {
				this.showCouponLibrary(this.page, this.limit);
				this.handleTabDialogCoup = true;
			},
			//点击搜索优惠券库
			searchLibrary() {
				this.showCouponLibrary(this.page, this.limit);
			},
			//查询优惠券库
			showCouponLibrary(start, limit) {
				let that = this;
				let params = {
					"userId": this.userInfo.userCode,
					"page": start,
					"limit": limit,
					"systemStatus": "已生效",
					"coupLibraryKey": this.coupLibraryKey,
					"couponType": this.couponType
				}
				//			console.log(params)
				// 使表格加载
				that.tableSelectLoading=true;
				// 查询接口
				selectCouponLibraryJurisdiction(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						//						console.log(JSON.stringify(data));
						that.tableSelectLoading=false;
						if(data.data) {
							that.coupDataTab = data.data;
							that.count = data.count;
						} else if(data.messageType != 'SUCCESS') {
							that.$message({
								message: data.messageContent,
								type: 'warning'
							});
						}
					})
					.catch(function(err) {
						that.tableSelectLoading=false;
						// console.log(err);
					});
			},
			// 弹窗优惠券分页
			handleCoupChange(val) {
				this.page = val;
				this.showCouponLibrary(val, this.limit);
			},
			//弹窗确认
			enterCoup(val) {
				this.handleTabDialogCoup = false;
			},
			// 表格选择数据门店
			handleSelectionStoreChange(val) {
				if(val) {
					this.tableDataStoreSelect = val;
				}
			},
			// 门店列表分页
			handleCurrentChangeStore(val) {
				this.pageStore = val;
				this.showTableStore(val, this.limit);
			},
			//查询门店-按钮
			onSubmitStore() {
				this.showTableStore('', this.limit);
			},
			//查询门店表格数据
			showTableStore(start, limit) {
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
					searchContent: this.formStore.searchContent
				}
				let that = this;
				that.tableSelectLoading=true;
				//	    		console.log(params)
				selectStoreData(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						that.tableSelectLoading=false;
						if(data.data) {
							//							console.log(JSON.stringify(data))
							let result = [];
							data.data.forEach((val, index) => {
								result.push({
									...val
								});
							})
							that.tableDataStore = result;
							that.countStore = data.count;
						} else if(data.messageType != 'SUCCESS') {
							that.$message.warning(data.messageContent);
						}
					})
					.catch(function(err) {
						that.tableSelectLoading=false;
//						console.log(err);
					});
			},
			// 表格选择数据店组
			handleSelectionGroupChange(val) {
				if(val) {
					this.tableDataGroupSelect = val;
				}
			},
			// 店组列表分页
			handleCurrentChangeGroup(val) {
				this.pageStore = val;
				this.showTableGroup(val, this.limit);
			},
			//查询店组-按钮
			onSubmitGroup() {
				this.showTableGroup('', this.limit);
			},
			//查询店组表格数据
			showTableGroup(start, limit) {
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
					flag: "2",
					searchContent: this.formGroup.searchContent
				}
				let that = this;
				that.tableSelectLoading=true;
				//	    		console.log(params)
				selectTabData(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						that.tableSelectLoading=false;
						if(data.data) {
							//							console.log(JSON.stringify(data))
							let result = [];
							data.data.forEach((val, index) => {
								result.push({
									...val
								});
							})
							that.tableDataGroup = result;
							that.countGroup = data.count;
						} else if(data.messageType != 'SUCCESS') {
							that.$message.warning(data.messageContent);
						}
					})
					.catch(function(err) {
						that.tableSelectLoading=true;
						// console.log(err);
					});
			},
			// 表格选择数据区域
			handleSelectionAreaChange(val) {
				if(val) {
					this.tableDataAreaSelect = val;
				}
			},
			// 区域列表分页
			handleCurrentChangeArea(val) {
				this.pageArea = val;
				this.showTableArea(val, this.limit);
			},
			//查询区域-按钮
			onSubmitArea() {
				this.showTableArea('', this.limit);
			},
			//查询区域表格数据
			showTableArea(start, limit) {
				let params = {
					userId: this.userInfo.userCode,
					page: start,
					limit: limit,
					flag: "3",
					searchContent: this.formArea.searchContent
				}
				let that = this;
				that.tableSelectLoading=true;
				//	    		console.log(params)
				selectTabData(params)
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						that.tableSelectLoading=false;
						if(data.data) {
							//							console.log(JSON.stringify(data))
							let result = [];
							data.data.forEach((val, index) => {
								result.push({
									...val
								});
							})
							that.tableDataArea = result;
							that.countArea = data.count;
						} else if(data.messageType != 'SUCCESS') {
							that.$message.warning(data.messageContent);
						}
					})
					.catch(function(err) {
						that.tableSelectLoading=false;
//						console.log(err);
					});
			},
			//监听tab页
			handleClick(tab, event) {
				this.selectDataType = event.target.firstChild.data;
				this.dataIndex = [];
				if(this.selectDataType == "门店") {
					this.showTableStore(this.pageStore, this.limit);
				}
				if(this.selectDataType == "店组") {
					this.showTableGroup(this.pageGroup, this.limit);
				}
				if(this.selectDataType == "区域") {
					this.showTableArea(this.pageArea, this.limit);
				}
			},
			//自提门店按钮
			searchStorePickPop() {
				let that = this;
				if(this.storeArr == "") {
					that.$message({
						message: '请选择所属门店',
						type: 'warning'
					});
					return false;
				}
				that.tableSelectLoading=true;
				//				console.log(this.selectDataType)
				if(this.selectDataType == "店组") {
					this.selectDataType = "自提门店";
					var params = {
						userId: this.userInfo.userCode,
						page: 0,
						limit: 1000,
						storeGroupId: this.tableDataGroupSelect.storeGroupId
					}
					//									console.log(params)
					selectGroupInfo(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//							console.log(data)
							if(!data.messageType) {
								let result = [];
								data.data.forEach((val, index) => {
									result.push({
										storeId: val.storeId,
										storeName: val.storeName,
										address: val.provinceName + val.cityName + val.areaName + val.addr
									});
								})
								that.tableDataStore = result;
								that.countStore = data.count;
								that.handleStoreDialog = true;
							} else if(data.messageType != "SUCCESS") {
								that.$message({
									message: data.messageContent,
									type: 'warning'
								});
							}
							that.tableSelectLoading = false;
						})
						.catch((err) => {
//							console.log(err);
							that.tableSelectLoading = false;
						})
				}
				if(this.selectDataType == "区域") {
					this.selectDataType = "自提门店";
					var params = {
						userId: this.userInfo.userCode,
						page: 0,
						limit: 1000,
						storeAreaId: this.tableDataAreaSelect.storeAreaId
					}
					//									console.log(params)
					selectAreaStoreInfo(params)
						.then((res) => {
							let data = JSON.parse(Base64.decode(res.data));
							//							console.log(data)
							if(!data.messageType) {
								let result = [];
								data.data.forEach((val, index) => {
									result.push({
										storeId: val.storeId,
										storeName: val.storeName,
										address: val.address
									});
								})
								that.tableDataStore = result;
								that.countStore = data.count;
								that.handleStoreDialog = true;
							} else if(data.messageType != "SUCCESS") {
								that.$message({
									message: data.messageContent,
									type: 'warning'
								});
							}
							that.tableSelectLoading = false;
						})
						.catch((err) => {
//							console.log(err);
							that.tableSelectLoading = false;
						})
				}
			},
			//点击所属门店弹窗显示
			searchStorePop() {
				this.selectDataType = '门店';
				this.handleTabDialog = true;
				this.showTableStore(this.pageStore, this.limit);
			},
			//弹窗确认
			enterStore(val) {
				if(this.selectDataType == "门店") {
					var parmas = {
						storeName: this.tableDataStoreSelect.storeName,
						storeId: this.tableDataStoreSelect.storeId
					}
					this.useObject = true;
					this.form.applyOrg = JSON.stringify(parmas);
					this.storeArr = this.tableDataStoreSelect.storeName;
					this.form.storeJson = JSON.stringify(parmas);
					this.storePickArr = this.tableDataStoreSelect.storeName;
					this.handleStoreDialog = false;
				}
				if(this.selectDataType == "店组") {
					var parmas = {
						storeName: this.tableDataGroupSelect.storeGroupName,
						storeId: this.tableDataGroupSelect.storeGroupId
					}
					this.useObject = false;
					this.form.applyOrg = JSON.stringify(parmas);
					this.storeArr = this.tableDataGroupSelect.storeGroupName;
					this.form.storeJson = '';
					this.storePickArr = '';
					this.handleGroupDialog = false;
				}
				if(this.selectDataType == "区域") {
					var parmas = {
						storeName: this.tableDataAreaSelect.storeAreaName,
						storeId: this.tableDataAreaSelect.storeAreaId
					}
					this.useObject = false;
					this.form.applyOrg = JSON.stringify(parmas);
					this.storeArr = this.tableDataAreaSelect.storeAreaName;
					this.form.storeJson = '';
					this.storePickArr = '';
					this.handleAreaDialog = false;
				}
				if(this.selectDataType == "自提门店") {
					var parmas = {
						storeName: this.tableDataStoreSelect.storeName,
						storeId: this.tableDataStoreSelect.storeId
					}
					this.useObject = false;
					this.form.storeJson = JSON.stringify(parmas);
					this.storePickArr = this.tableDataStoreSelect.storeName;
					this.handleStoreDialog = false;
				}
				this.handleTabDialog = false;
			},
			loadinglevel(){
				let params = {
					userId: this.userInfo.userCode
				}
				let that = this;
				selectLevalInfo(params) //请求会员等级
					.then(function(res) {
						let data = JSON.parse(Base64.decode(res.data));
						let result = [];
//						console.log(JSON.stringify(data)+"会员等级")				
						that.levalInfo = data.data;
					})
					.catch(function(err) {
	//					 console.log(err);
					});
			}
		},
		created() {
			// console.log(this.getPageType);
			if(this.getPageType == '查看') {
				this.disabled = true;
				this.setDisabled = true;
				this.dateInputDisabled = true;
				this.datePickerDisabled = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
//				console.log(JSON.stringify(this.form));
				this.integral = this.form.integralJson.type;
				if(this.integral == "统一设置") {
					this.formIntegral.integralValue = this.form.integralJson.integral;
					this.formIntegral.amountValue = this.form.integralJson.amount;
				}
				if(this.integral == "按等级设置") {
					this.addTableData = this.form.integralJson.data;
				}
				//兑换有效期
				this.timeRangeArr.push(this.form.validityDateBegin);
				this.timeRangeArr.push(this.form.validityDateEnd);
				//主图imageUrl
				this.mainLogoUrl = this.form.goodUrl.main.attaUrl;
				this.imageUrl = this.form.goodUrl.main.attaUrl;
				this.dialogImageUrl = this.form.goodUrl.main.attaUrl;
				//附图
				if(this.form.goodUrl.atta){
					let attaUrl = this.form.goodUrl.atta.attaUrl;
					attaUrl = attaUrl.substr(0, attaUrl.length - 1);
					let attaArr = attaUrl.split(",");
					attaArr.forEach((val, index) => {
						this.dialogImageUrlArr.push(val);
						this.mainLogoUrlArr.push(val);
					})
				}
				//券有效期
				if(this.form.couDateJson.type) {
					this.coupDate = "长期";
					this.couDateType = this.form.couDateJson.type;
					this.form.coupTest=this.form.couDateJson.type;
				}
				if(this.form.couDateJson.times) {
					this.coupDate = "时间段";
					this.timeRange.push(this.form.couDateJson.times.begin);
					this.timeRange.push(this.form.couDateJson.times.end);
				}
				this.storeArr = this.form.applyOrg.storeName; //所属门店
				this.storePickArr = this.form.storeJson.storeName; //自提门店
				this.coupTempName = this.form.coupName; //优惠券
				this.form.storeJson=JSON.stringify(this.form.storeJson);
				this.form.couDateJson=JSON.stringify(this.form.couDateJson);
				this.form.applyOrg=JSON.stringify(this.form.applyOrg);
				this.form.goodUrl=JSON.stringify(this.form.goodUrl);
				this.form.integralJson=JSON.stringify(this.form.integralJson);
			} else if(this.getPageType == '修改') {
				this.setDisabled = true;
				let res = JSON.parse(this.getFormData);
				this.form = {
					...res
				}
//				console.log(JSON.stringify(this.form));
				//兑换积分值
				this.integral = this.form.integralJson.type;
				if(this.integral == "统一设置") {
					this.formIntegral.integralValue = this.form.integralJson.integral;
					this.formIntegral.amountValue = this.form.integralJson.amount;
				}
				if(this.integral == "按等级设置") {
					this.addTableData = this.form.integralJson.data;
				}
				//兑换有效期
				this.timeRangeArr.push(this.form.validityDateBegin);
				this.timeRangeArr.push(this.form.validityDateEnd);
				//主图
				this.imageUrl = this.form.goodUrl.main.attaUrl;
				this.mainLogoUrl = this.form.goodUrl.main.attaUrl;
				this.dialogImageUrl = this.form.goodUrl.main.attaUrl;
				//附图
				if(this.form.goodUrl.atta){
					let attaUrl = this.form.goodUrl.atta.attaUrl;
					attaUrl = attaUrl.substr(0, attaUrl.length - 1);
					let attaArr = attaUrl.split(",");
					attaArr.forEach((val, index) => {
						this.dialogImageUrlArr.push(val);
						this.mainLogoUrlArr.push(val);
					})
				}
				//券有效期
				if(this.form.couDateJson.type) {
					this.coupDate = "长期";
					this.dateInputDisabled=false;
					this.datePickerDisabled=true;
					this.couDateType = this.form.couDateJson.type;
					this.form.coupTest=this.form.couDateJson.type;
					this.form.couDate=JSON.stringify(this.form.couDateJson);
				}
				if(this.form.couDateJson.times) {
					this.coupDate = "时间段";
					this.dateInputDisabled=true;
					this.datePickerDisabled=false;
					this.timeRange.push(this.form.couDateJson.times.begin);
					this.timeRange.push(this.form.couDateJson.times.end);
					this.form.coupTest=JSON.stringify(this.form.couDateJson.times);
					this.form.couDate=JSON.stringify(this.form.couDateJson.times);
				}
				//所属门店
				this.storeArr = this.form.applyOrg.storeName; //所属门店
				this.storePickArr = this.form.storeJson.storeName; //自提门店
				this.coupTempName = this.form.coupName; //优惠券

				this.form.applyOrg = JSON.stringify(this.form.applyOrg);
				this.form.salePrice = this.form.salePrice+'';
				this.form.totalNum =this.form.totalNum+'';
				this.form.restrictNum = this.form.restrictNum+'';
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
			},
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	.el-dsh-form{
		width: 46%;
		margin-left: 26%;
	}
	.el-tabs {
		margin-bottom: 10px;
	}
	.tableSelect{
		width:120px;
		margin: 0 10px
	}
	.inlineFormItem {
		width: 130px;
	}
	
	.inlineItemInput {
		width: rem(510px);
	}
	
	.radio {
		position: relative;
		width: 100%;
	}
	
	.radioInfo {
		position: absolute;
		left: 24px;
		top: -8px;
	}
	.el-button-upload {
		margin-left: 5px;
		margin-bottom: 5px;
	}
	/*弹出窗*/
	
	.searchContent {
		width: 202px;
		margin-bottom: 10px;
	}
	
	.Store .el-dialog .el-form {
		position: inherit;
	}
	
	.Store .el-dialog .role {
		height: 400px;
		width: 100%;
	}
	
	.search {
		position: relative;
	}
	
	.activityContainerM {
		margin-top: 20px;
	}
	/*上传图片*/
	.el-radio-group{
		padding-top: 10px;
	}
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
	
	.componentBox {
		width: 426px
	}
	
	.component {
		position: relative;
		width: 140px;
		height: 140px;
		margin-right: 8px;
		margin-bottom: 8px;
		float: left;
	}
	
	.componentDelete {
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
		height: 140px;
		line-height: 140px;
		text-align: center;
		float: left;
		cursor: pointer;
	}
	
	.avatar {
		display: block;
		width: 140px;
		height: 140px;
		border: 1px dashed #d9d9d9;
		border-radius: 8px;
		float: left;
		cursor: pointer;
	}
	
	.avatar:hover {
		border-color: #409EFF;
	}
	
	table {
		border-top: 1px solid #ebebeb;
		border-left: 1px solid #ebebeb;
		thead {
			background: #f5f7fa;
		}
		th,
		td {
			height: 60px;
			border-bottom: 1px solid #ebebeb;
			border-right: 1px solid #ebebeb;
			text-align: center;
		}
		tr td:last-child {
			width: 100px;
		}
		.el-input {
			width: 60%;
		}
	}
	
	.el-radio {
		float: left;
		margin-left: 0px;
	}
	.paddingTop0{
		padding-top:0;
	}
	.marginLeft40{
		margin-left: 40px;
	}
	.el-form--inline .el-form-item {
		margin-right: 0;
	}
	.activitySpan {
		display: block;
		color: #AEAEAE;
	}
	.width280{
		width: 280px;
	}
	.card-radio{
		width: auto!important;
		margin-left: -100px;
		margin-top: 30px;
	}
	.height30{
		height: 30px;
	}
	.width70{
		width: 70%;
	}
	.width280{
		width: 280px;
	}
	.width200{
		width: 200px;
	}
	.marginTop30{
		margin-top: 30px;
	}
</style>