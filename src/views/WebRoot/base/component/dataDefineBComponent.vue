<!--扩展字段-维度设置-dimensionConfiguration.vue的子组件  -->
<template>
    <div class="dsh-container">
        <span class="centerTitle" v-if="!noTitle">维度设置</span>
        <el-form ref="form" :model="form" label-width="120px" :inline="true">
            <el-row :gutter="20" v-for="(item, index) in form.main" :key="item.key">
                <el-col :span="8">
                    <el-form-item label="" v-if="index == 0" :prop="'main.' + index + '.value'" :rules="[
                        {required: true, message: '维度不能为空', trigger: 'blur'}
                    ]">
                        <span>x &lt;</span>
                        <el-input ref="handleIpt" v-model="item.value" class="wid100" :disabled="index < form.main.length-2" @change="handleChange"></el-input>
                    </el-form-item>
                    <el-form-item label="" v-else-if="index == form.main.length-1" :prop="'main.' + index + '.value'">
                        <span>x ≥ </span>
                        <el-input ref="handleIpt" v-model="form.main[index-1].value" class="wid100" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="" v-else :prop="'main.' + index + '.value'" :rules="[
                        { required: true, message: '维度不能为空', trigger: 'blur' }
                    ]">
                        <span>{{ form.main[index - 1].value }}</span>
                        <span v-if="index != 0">{{ '≤ ' }}</span>
                        <span>{{ 'x &lt;' }}</span>
                        <el-input ref="handleIpt" v-model="item.value" class="wid100" :disabled="index < form.main.length-2" @change="handleChange"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <p class="textInfo" v-if="index == 0">
                        <span>{{ 'x &lt; ' + form.main[index].value }}</span>
                    </p>
                    <p class="textInfo" v-else-if="index == form.main.length-1">
                        <span>{{ 'x ≥ ' + form.main[index-1].value }}</span>
                    </p>
                    <p class="textInfo" v-else>
                        <span>{{ form.main[index-1].value + ' - ' + (parseInt(!form.main[index].value ? 1 : form.main[index].value)) }}</span>
                    </p>
                </el-col>
                <el-col :span="8">
                    <p class="textInfo" v-if="index < form.main.length-1 && index > 0 || index < form.main.length-1 && form.main.length == 2">
                        <el-tooltip class="iconItem toolButton" content="删除" placement="top">
                            <icon-svg icon-class="shanchu" @click.native.prevent="handleDelete(index)" />
                        </el-tooltip>
                    </p>
                </el-col>
            </el-row>
        </el-form>
        <div @click="handleAdd" class="btnAdd" v-if="add">
            <i class="el-icon-plus"></i>
        </div>
    </div>
</template>
<script>
export default {
    props: ['childForm', 'childRef', 'childMax', 'childName', 'noTitle','childDateType'],
    data() {
        return {
            add: true
        }
    },
    computed: {
        form() {
            return this.childForm;
        }
    },
    watch: {
        'form.main': function(val, oldVal) {
//          console.log(JSON.stringify(val));
            // this.$set(this.form.main, this.form.main.length-1, {
            //     value: str
            // })
        },
        deep: true
    },
    methods: {
        handleChange(str) {
            this.$set(this.form.main, this.form.main.length-1, {
                value: str
            })
        },
        // 添加
        handleAdd() {
//                      	console.log(JSON.stringify(this.form.main))
//          var reg =/^[0-9]*[1-9][0-9]*$/;
	 		var reg =/^\d+(\.\d{1,2})?$/
            var count = 0;
            this.$refs.form.validate((valid) => {
                if(valid) {
                	this.form.main.forEach((val,index)=>{
                		if(!reg.test(val.value)){
                            count++;
                		}
                	})
                	if(count>0){
	                	this.$message.warning('请输入有效数字！');
    	                return false;
                	}
                	let isNext=true;
                	if(this.childDateType=="日"){
	                	this.form.main.forEach((val,index)=>{
	                		if(val.value>31){
			                	this.$message.warning('最大值不能超过31！');
			                	isNext=false;
	                		}
	                	})
                	}
                	if(!isNext){
	                	return false;
                	}
                    if(this.form.main.length == 0) {
                        this.form.main.push({
                            value: ''
                        }, {
                            value: ''
                        });
                        this.add = true;
                    } else if(this.form.main.length <= 2) {
                        if(!isNaN(parseInt(this.form.main[0].value))) {
                            if(parseInt(this.form.main[0].value) > 0) {
                                this.form.main.splice(this.form.main.length-1, 0, {
                                    value: ''
                                });
                                this.$refs.handleIpt[this.$refs.handleIpt.length-1].focus();
                            } else {
                                this.$message.warning(`${this.childName}的最小值需大于0`);
                                return false;
                            }
                        } else {
                            this.$message.warning('请输入有效数字');
                            return false;
                        }
                    } else if(this.form.main.length > 2) {
                        if(parseInt(this.form.main[this.form.main.length - 2].value) > parseInt(this.form.main[this.form.main.length - 3].value)) {
                            if(this.form.main.length < (parseInt(this.childMax) - 1)) {
                                this.form.main.splice(this.form.main.length-1, 0, {
                                    value: ''
                                });
                            } else {
                                this.form.main.splice(this.form.main.length-1, 0, {
                                    value: ''
                                });
                                this.add = false;
                                return false;
                            }
                        } else {
                            this.$message.warning('该维度值需大于上个维度值');
                            return false;
                        }
                    }
                }
            });
        },
        // 保存
        handleSave() {
            let formData = [];
        	let isNext=true;
            this.form.main.forEach((val, index) => {
            	if(this.childDateType=="日"){
	        		if(val.value>31){
	                	this.$message.warning('最大值不能超过31！');
	                	isNext=false;
	        		}
            	}
//          	console.log(JSON.stringify(val),index,this.form.main.length)
                if(index == 0) {
                    formData.push(`<${val.value}`);
                } else if(index > 0 && val.value != ''&&index !=this.form.main.length-1) {
                    formData.push(`${this.form.main[index-1].value}-${val.value}`);
                } else if(index ==this.form.main.length-1) {
                	if(val.value==''){
                		formData.push(`≥${this.form.main[index-1].value}`);
                	}else{
                		formData.push(`≥${val.value}`);
                	}
                }
            });
        	if(!isNext){
            	return '';
        	}
            if( this.form.main.length ==0){
            	return formData;
            }else if( this.form.main.length > 0 &&  this.form.main[0].value == '') {
				return '1';
            }else{
            	return formData;
            }
        },
        // 删除
        handleDelete(index) {
            this.add = true;
            // console.log(this.form);
            this.form.main.splice(index, 1);
            if(parseInt(index) == 0) {
                this.$set(this.form.main, 0, {value: ''});
                this.$set(this.form.main, 1, {value: ''});
            }
            this.$set(this.form.main, this.form.main.length-1, {
                value: this.form.main[this.form.main.length-2].value
            })
            // this.$emit('parentDelete', {
            //     type: this.childRef,
            //     index: index
            // });
        },
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
	}
	.wid100{
		width: 100px;
	}
	.el-form {
		// width: rem(700px);
		min-width: 500px;
	}

	.el-form-item {
		display: block;
		padding: 10px 0;
		padding-bottom: 15px;
		margin-bottom: 0;
		text-align: center;
	}

	.el-select {
		width: 100%;
	}

	// 行内文本 span
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

	.noPadding .el-card__body {
		padding: 0!important;
	}

	p {
		text-align: center;
	}

	.textInfo {
		height: 53px;
		line-height: 53px;
	}

	.btnAdd {
		width: 100%;
		height: 40px;
		border: 1px solid #D2d2d2;
		text-align: center;
		line-height: 40px;
		cursor: pointer;
	}


	.el-collapse-item {
		position: relative;
		.centerTitle {
			position: absolute;
			top: 0;
			left: 50%;
			margin-left: -22px;
			line-height: 48px;
		}
	}
	.toolButton{
		cursor: pointer;
		font-size: 20px;
	}
	.dsh-container{
		border: 1px solid transparent;
	}
</style>

