// 会员权益
<template>
	<el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn['master-6-1-1'] || roleBtn['master-6-1-2']|| roleBtn['master-6-1-3']|| roleBtn['master-6-1-4']">
                <el-radio-group v-model="radioInfo">
                    <el-radio-button label="会员卡" v-if="roleBtn['master-6-1-1']">会员卡</el-radio-button>
                    <el-radio-button label="等级" v-if="roleBtn['master-6-1-2']">等级</el-radio-button>
                    <el-radio-button label="等级" v-if="roleBtn['master-6-1-3']">等级</el-radio-button> 
                    <el-radio-button label="积分" v-if="roleBtn['master-6-1-4']">积分</el-radio-button>
                </el-radio-group>
			</el-card>
		</el-header>
		<el-main>
			<merchant-manager-user-a v-if="roleBtn['master-6-1-1'] && this.radioInfo == '会员卡'"></merchant-manager-user-a>
			<merchant-manager-user-b v-if="roleBtn['master-6-1-2'] && this.radioInfo == '等级'"></merchant-manager-user-b>
			<merchant-manager-user-c v-if="roleBtn['master-6-1-3'] && this.radioInfo == '等级'"></merchant-manager-user-c> 
			<merchant-manager-user-d v-if="roleBtn['master-6-1-4'] && this.radioInfo == '积分'"></merchant-manager-user-d>
		</el-main>
	</el-container>
</template>
<script>
	import { permission } from '@/utils'
	/**
	 * 接口信息
	 * 获取用户品牌信息
	 */
	import { getPermissions } from '@/api/base/merchantManagerUser'
	import { mapGetters } from 'vuex'
	import { merchantManagerUserA, merchantManagerUserB, merchantManagerUserC, merchantManagerUserD } from '@/views/WebRoot/base'
	export default {
		data() {
			return {
                // 权限
                roleBtn: {
                    'master-6-1-1': false,
                    'master-6-1-2': false,
                    'master-6-1-3': false,
                    'master-6-1-4': false
                },
                // 选项卡
                radioInfo: '会员卡', // 选项卡切换
                // radioInfoData: [ // 选项卡数据
                //     {
                //         label: '会员卡',
                //         msg: '会员卡',
                //         isShow: roleBtn.selectCardConfigInfo
                //     }, {
                //         label: '等级1',
                //         msg: '等级'
                //     }
                // ],
                membershipCardForm: {
                    cardDigitNumber: '', // 卡号位数
                    cardDigitBegin: '', // 卡号起始位
                    charPrefixBegin: '', // 编码前缀字符
                    charPrefixEnd: '', // 编码后缀字符
                    cardType: '', // 类型
                    status: '', // 状态
                },
                rules: {
                    cardDigitNumber: [ // 卡号位数
                        { required: true, message: '请选择卡号位数', trigger: 'change'  },
                        { max: 100, message: '最大长度不能超过100', trigger: 'change' }
                    ],
                    cardDigitBegin: [ // 卡号起始位
                        { required: true, message: '请选择卡号起始位', trigger: 'change'  },
                        { max: 100, message: '最大长度不能超过100', trigger: 'change' }
                    ],
                    charPrefixBegin: [ // 编码前缀字符
                        { required: true, message: '请选择编码前缀字符', trigger: 'change'  },
                        { max: 100, message: '最大长度不能超过100', trigger: 'change' }
                    ],
                    charPrefixEnd: [ // 编码后缀字符
                        { required: true, message: '请选择编码后缀字符', trigger: 'change'  },
                        { max: 100, message: '最大长度不能超过100', trigger: 'change' }
                    ],
                    cardType: [ // 类型
                        { required: true, message: '请选择类型', trigger: 'change'  },
                        { max: 100, message: '最大长度不能超过100', trigger: 'change' }
                    ]
                }
			}
		},
		methods: {
			// 单选组切换
			handleRedioInfo(val) {

			}
		},
		components: {
			merchantManagerUserA,
			merchantManagerUserB,
			merchantManagerUserC,
			merchantManagerUserD
		},
		created() {
			// 钩子函数 -- 初始化
			this.roleBtn = permission(this.roleBtn);
//	        console.log(JSON.stringify(this.roleBtn));

			this.$nextTick(_ => {
				if(document.querySelector('.el-radio-button')){
					document.querySelector('.el-radio-button').dispatchEvent(new MouseEvent('click'));
				}
			});
		},
		computed: {
			// 计算属性
		},
	};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/_function.scss";
	.el-card {
		width: 100%;
		text-align: center;
	}

	.el-form {
		width: rem(700px);
		min-width: 500px;
	}

	.el-form-item {
		display: block;
	}

	.el-select {
		width: 100%;
	}

	// 行内文本 span
	.formText {
		display: inline;
		line-height: rem(30px);
	}
</style>
