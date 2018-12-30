// 会员分组 - 我的分组 - 分组卡片组件
<template>
    <div class="group-card-detail-wrap">
        <el-table
            :data="tableData"
            header-cell-class-name="group-card-detail-cell"
            cell-class-name="group-card-detail-cell"
            row-class-name="group-card-detail-row"
            max-height="250">
            <el-table-column
                prop="name"
                label="条件名称"
               >
            </el-table-column>
            <el-table-column
                prop="value"
                label="数值"
                >
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            'dateBrand' : {  // 日期纬度（json字符串）
                "selectDateBegin" : "选择日期起", // 选择日期起
                "selectDateEnd" : "选择日期止",  // 选择日期止
                "day" : "近?天",  // 近？天
                "orderDay" :"距离最后一次消费时间？天"  // 距离最后一次消费时间？天
            },
            'memBrand' : { // 会员维度（json字符串） 
                "age" : '年龄', // 年龄 
                "sex" : '性别', // 性别
                "area" : '地域', // 地域 
                "day" : '入会?天会员', // 入会？天会员
                "new" : '新老会员', // 新老会员 
                "source" : '入会来源', // 入会来源
                "liveness" : '会员活跃度', // 会员活跃度
                "memberLevel" : '会员等级', // 会员等级 
                "lable" : '会员标签', // 会员标签 
            }, 
            'memIndex' : { // 会员指标（json字符串） 
                "secondCycle" : '会员二次消费周期', // 会员二次消费周期
                "lastDay" : '最近一次消费时间', // 最近一次消费时间
                "orderFrequency" : '累计消费频次', // 累计消费频次
                "totalOrderMoney" : '累计消费金额', // 累计消费金额
                "avgOrderMoney" : '平均消费折扣', // 平均消费折扣
                "orderCustomerPrice" : '消费客单价', // 消费客单价
                "orderUnitPrice" : '消费件单价', // 消费件单价
                "unitPrice" : '件单价', // 件单价
                "orderNum" : '交易单数', // 交易单数
                "orderCount" : '销售数量', // 销售数量
                "availableIntegral" :'会员有效积分' // 会员有效积分
            }, 
            'fixedBrandMulti' : { // 固定纬度（多选
                "noSecond" : "未及时二回会员", // 未及时二回会员(是/否)
                "noOrder" : "入会未消费", // 入会未消费(是/否) 
                "isFans" : "粉丝", // 粉丝(是/否)
                "noCard" : "未绑卡的会员" // 未绑卡的会员(是/否)
            }, 
            'fixedBrandRadio' : { // '固定纬度（单选)'
                "birthday" : '会员生日', // 会员生日 
                "anniversary" : '入会周年' // 入会周年
            }, 
            defineJson1:{},
        }
    },
    props: {
        'childData': {}, 
        
    },
    methods: {
        // 方法
        handleTransform(data, obj) {
            let that = this;
            let arr = [];
            if(obj=="defineJson1"){
            	let arrValue= [];
            	let arrName= [];
            	for(let item in data) {
            		if(item.indexOf('Name')< 0) {
            			arrValue.push(data[item]);
            		}else{
            			arrName.push(data[item]);
            		}
            	}
            	arrName.forEach((v,i)=>{
            		if(arrValue[i].length>0){
    	        		arr.push({
	    			        name: arrName[i],
    				        value:arrValue[i]+ ' '
    				    });
            		}
            	})
            }else{
            	for(let item in data) {
            	    if(data[item].length > 0) {
            	        arr.push({
            	            name: that[obj][item],
            	            value: data[item] + ' '
            	        });
            	    }
            	}
            }
            return arr;
        }
    },
    created() {
        // 钩子函数 -- 初始化
        // console.log(this.childData)
    },
    computed: {
        // 计算属性
        ...mapGetters([
            'userInfo',
        ]),
        tableData() {
        	let tableData = [];
            let dateBrand = this.childData.dateBrand;
            let memBrand = this.childData.memBrand;
            let memIndex = this.childData.memIndex;
            let fixedBrandMulti = this.childData.fixedBrandMulti;
            let fixedBrandRadio = this.childData.fixedBrandRadio;
            let defineJson1 = this.childData.defineJson1;
            if(this.handleTransform(dateBrand, 'dateBrand').length>0){
            	this.handleTransform(dateBrand, 'dateBrand').forEach((val,index)=>{
            		tableData.push(val);
            	})
            }
            if(this.handleTransform(memBrand, 'memBrand').length>0){
            	this.handleTransform(memBrand, 'memBrand').forEach((val,index)=>{
            		tableData.push(val);
            	})
            }
            if(this.handleTransform(memIndex, 'memIndex').length>0){
            	this.handleTransform(memIndex, 'memIndex').forEach((val,index)=>{
            		tableData.push(val);
            	})
            }
            if(this.handleTransform(fixedBrandMulti, 'fixedBrandMulti').length>0){
            	this.handleTransform(fixedBrandMulti, 'fixedBrandMulti').forEach((val,index)=>{
            		tableData.push(val);
            	})
            }
            if(this.handleTransform(fixedBrandRadio, 'fixedBrandRadio').length>0){
            	this.handleTransform(fixedBrandRadio, 'fixedBrandRadio').forEach((val,index)=>{
            		tableData.push(val);
            	})
            }
            if(this.handleTransform(defineJson1, 'defineJson1').length>0){
            	this.handleTransform(defineJson1, 'defineJson1').forEach((val,index)=>{
            		tableData.push(val);
            	})
            }
//          console.log(JSON.stringify(tableData))
            return tableData;
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/_function.scss";
@import "src/styles/mixin.scss";

.el-table tr{
  background: #eee;
}
.group-card-detail-wrap{
  padding:0 rem(10px);
  position: absolute;
  z-index: 1;
  top:rem(150px);
  left:50%;
  width:98%;
  transform: translateX(-50%);
  background-color: #eee;
  @include boxShadow(0,4px,15px,rgba(0, 0, 0, 0.2));
  @include borderRadius(6px);
  
}
.app-info-card {
    height: rem(200px);
    overflow: hidden;
}
// .miniTable{
//     max-height: rem(215px);
//     overflow-y: auto;
//     overflow-x: hidden;
// }
</style>
