// 会员首页 - 导航
<template>
	<div class="app-container">
		<el-card>
			<el-form :model="form" ref="form" label-width="120px" class="demo-form">
				<el-row>
                    <el-col :span="18">
                        <el-form-item label="标题">
                            <el-input v-model="form.title" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
			</el-form>
		</el-card>
	</div>
</template>
<script>
	import { mapGetters } from "vuex";
	import { uploadImg } from '@/api/base/brandInfo'
	import Cookie from 'js-cookie'
	export default {
		props: ['childData'],
		data() {
			return {
				form: {
					title: ''
				},
				dialogImageLoading: false,

				
			};
		},
		methods: {
			// 方法
			
		},
		created() {
            // 钩子函数 -- 初始化
		},
		computed: {
			// 计算属性
			...mapGetters(["userInfo"]),
            returnChildData() {
				if(!this.childData) {
					this.form = {
						title: ''
					}
				}else {
					this.form = {
						title: this.childData.title
					}
				}
				return !this.childData ? [] : this.childData;
			}
		},
		watch: {
			'returnChildData': function(val, oldVal) {

			},
			deep: true
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 80%;
	}
	
	.dsh-center {
		display: flex;
		justify-content: center;
	}
	
	.dsh-input-inline {
		display: inline-block;
		width: 130px;
	}
</style>