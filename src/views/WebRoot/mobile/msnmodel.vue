// 模板消息
<template>
    <el-container class="app-container">
        <el-main class="overHidden" v-loading="enableLoading">
            <el-row :gutter="10" class="minHeight" v-loading="setloading">
                <el-col :span="8" v-for="item in tabelData" :key="item.id">
                    <el-card class="msnmodelCard" >
                        <div class="ms-head">
                            <span>{{item.title}}</span>
                            <el-switch
                            	@change="switchFn(item.index)"
                                v-model="item.isEnable"
                                :disabled="isEnableDisabled"
                                active-color="#13ce66"
                                inactive-color="#eee">
                            </el-switch>
                        </div>
                        <div class="ms-content">
                        	<p>{{item.tempDescFirst}}</p>
                            <div v-html="item.tempDesc"></div>
                        	<p>{{item.tempDescEnd}}</p>
                            <p class="setInput" v-if="item.isEnable"><a href="javascript:void(0)" @click="setInfo(item.index,'top')">{{item.btnInfo}}</a></p>
                        </div>
                        <div class="ms-footer">
                            <p>模板编号：{{item.wechatTmepId}}</p>
                            <p>模板名称：{{item.wechatTempName}}</p>
                            <p>模板ID：{{item.tempId}}</p>
                            <p>链接地址：{{item.linkAdd}}</p>
                            <p class="setInput"v-if="item.isEnable"><a href="javascript:void(0)" @click="setInfo(item.index,'bottom')">修改</a></p>
                        </div>
                    </el-card>
                </el-col>
                <p class="noData" v-if="noData">暂无数据</p>
            </el-row>
			<el-dialog title="修改" :visible.sync="handleDialog" class="handleInfoOther">
				<el-form :model="form" ref="form" v-loading="formLoading">
					<el-form-item v-if="type=='top'" label="消息头部" label-width="100px">
						<el-input v-model="form.first" placeholder="请输入消息头部"></el-input>
					</el-form-item>
					<el-form-item v-if="type=='top'" label="消息尾部" label-width="100px">
						<el-input v-model="form.last" placeholder="请输入消息尾部"></el-input>
						<p>可用变量：[[会员名称]]、[[会员等级]]、[[会员积分]]复制使用时包含[[]]</p>
					</el-form-item>
					<el-form-item v-if="type=='top'" label="文字颜色" label-width="100px">
				  		<el-color-picker v-model="form.attribute1"></el-color-picker>
					</el-form-item>
					<el-form-item v-if="type=='bottom'" label="链接地址" label-width="100px">
						<el-input v-model="form.linkAdd" placeholder="请输入链接地址"></el-input>
					</el-form-item>
					<el-form-item>
						<div class="el-footer-btn-con overHidden">
							<el-button @click="handleDialog = false">取 消</el-button>
							<el-button type="primary" @click="setInfoFn" class="marginRight10">确 定</el-button>
						</div>
					</el-form-item>
				</el-form>
			</el-dialog>
        </el-main>
  </el-container>
</template>
<script>
import { selectTemplate,setTemplate,statusTemplate} from '@/api/mobile/msnModel'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
        	form:{
        		first:'',
        		last:'',
        		linkAdd:'',
        		tempId:'',
        		attribute1:'#173177'
        	},
        	formLoading:false,
        	isEnableDisabled:false,
        	noData:false,
        	setloading:true,
        	enableLoading:false,
        	handleDialog:false,
            // 数据
			tabelData:[],
			// 分页
			limit:3,
			page: 1, // 当前页
			count:0, // 总条数
			index:'',
			type:''
        }
    },
    methods: {
    	//启用停用
    	switchFn(index){
			let that = this;
        	this.isEnableDisabled=true;
    		this.enableLoading=true;
    		let params={
				userId: this.userInfo.userCode,
				id:this.tabelData[index].id,
				version:this.tabelData[index].version,
				isEnable:this.tabelData[index].isEnable?'是':'否'
			}
//			console.log(JSON.stringify(params));
			statusTemplate(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
    				that.enableLoading=false;
        			that.isEnableDisabled=false;
//					console.log(data);
					if(data.messageType == 'SUCCESS') {
						that.$message.success(data.messageContent);
						that.showTable();
					} else {
						that.$message.warning(data.messageContent);
						that.showTable();
					}
				})
				.catch((err) => {
    				that.enableLoading=false;
        			that.isEnableDisabled=false;
//					console.log(err);
				})
    	},
    	//点击修改按钮
    	setInfo(index,type){
    		this.index=index;
    		this.type=type;
    		this.handleDialog=true;
			this.form.first=this.tabelData[index].tempDescFirst;
			this.form.last=this.tabelData[index].tempDescEnd;
			this.form.linkAdd=this.tabelData[index].linkAdd;
			this.form.tempId=this.tabelData[index].tempId;
			this.form.attribute1=this.tabelData[index].attribute1;
    	},
		//修改信息
		setInfoFn(dataForm){
			let index=this.index;
			let tempDesc='';
			let that = this;
			let params={};
			this.formLoading=true;
			if(this.type=='top'){
				if(this.form.first==""&&this.form.last==""){
					tempDesc=this.tabelData[index].tempDescText;
				}
				if(this.form.first!=""&&this.form.last==""){
					tempDesc=this.tabelData[index].tempDescText.replace("first.DATA",this.form.first);
				}
				if(this.form.first==""&&this.form.last!=""){
					tempDesc=this.tabelData[index].tempDescText.replace("remark.DATA",this.form.last);
				}
				if(this.form.first!=""&&this.form.last!=""){
					tempDesc=this.tabelData[index].tempDescText.replace("first.DATA",this.form.first);
					tempDesc=tempDesc.replace("remark.DATA",this.form.last);
				}
//				console.log(JSON.stringify(this.form))
				params={
					userId: this.userInfo.userCode,
					id:this.tabelData[index].id,
					version:this.tabelData[index].version,
					tempId:this.tabelData[index].tempId,
					linkAdd:this.tabelData[index].linkAdd,
					tempDesc:this.tabelData[index].tempDesc,
					tempDescFirst:this.form.first,
					tempDescEnd:this.form.last,
					attribute1:this.form.attribute1
				}
//				console.log(JSON.stringify(this.form))
			}
			
			if(this.type=='bottom'){
				params={
					userId: this.userInfo.userCode,
					id:this.tabelData[index].id,
					version:this.tabelData[index].version,
					tempId:this.form.tempId,
					linkAdd:this.form.linkAdd,
					tempDesc:this.tabelData[index].tempDesc
				}
			}
//			console.log(JSON.stringify(params));
			setTemplate(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
//					console.log(data);
					if(data.messageType == 'SUCCESS') {
						that.formLoading=false;
						that.handleDialog = false;
						that.$message.success(data.messageContent);
						that.showTable();
					} else {
						that.formLoading=false;
						that.$message.warning(data.messageContent);
						that.showTable();
					}
				})
				.catch((err) => {
//					console.log(err);
					that.formLoading=false;
				})
		},
		//请求数据
		showTable(){
			var params = {
				userId: this.userInfo.userCode
			}
			let arr = [];
			let that = this;
			let first = '';
			let last = '';
//			console.log(JSON.stringify(params))
			selectTemplate(params)
				.then((res) => {
					let data = JSON.parse(Base64.decode(res.data));
//	        		console.log(JSON.stringify(data.data));
	        		that.tabelData=[];
	        		if(data.data.length>0){
	        			that.count=data.count;
		        		data.data.forEach((value,index)=>{
		        			that.tabelData.push(value);
	        				that.tabelData[index].isEnable=value.isEnable=="是"?true:false;
	        				that.tabelData[index].index=index;
	    					that.tabelData[index].tempDescText=that.tabelData[index].tempDesc;
	        				if(that.tabelData[index].tempDesc!=""){
	        					that.tabelData[index].btnInfo="修改";
	        					arr = that.tabelData[index].tempDesc.split("\n");
	        					arr = arr.join("<br>");
	        					that.tabelData[index].tempDesc=arr;
	        				}
		        		})
	        			that.noData=false;
	        		}else{
	        			that.noData=true;
	        		}
	        		that.setloading=false;
//	        		console.log(JSON.stringify(that.tabelData));
				})
				.catch((err) => {
	        		that.setloading=false;
//					console.log(err);
				})
		},
    },
    created() {
        // 钩子函数 -- 初始化
        this.showTable();
    },
    computed: {
        // 计算属性
        ...mapGetters([
            'userInfo',
        ]),
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/_function.scss";
.el-card {
    width: 100%;
}
.el-form {
	.el-input{
		width:220px
	}
}
.minHeight{
	min-height: 468px;
}
.msnmodelCard {
    height: 450px;
    float: left;
    p{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		height: 24px;
		line-height: 24px;
    }
    .setInput{
    	height: auto;
    }
    a {
        color: #3399FF;
    }
    .el-card__body {
        padding: 0;
    }
    .ms-head, .ms-content, .ms-footer {
        padding: 10px;
        border-bottom: 1px solid #d2d2d2;
    }
    .ms-head .el-switch {
        float: right;
    }
    .ms-head span{
    	height: 20px;
    	display: inline-block;
    }
    .ms-footer {
        border-bottom: none;
    }
}
.noData{
	width:100%;
	height: 40px;
	line-height: 40px;
	text-align: center;
	font-size: 16px;
}
</style>