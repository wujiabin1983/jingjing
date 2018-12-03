// 数据定义
<template>
	<el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn['master-6-2-1'] || roleBtn['master-6-2-2'] || roleBtn['master-6-2-3']">
				<el-radio-group v-model="radioInfo" @change="handleRedioInfo">
                    <!-- <el-radio-button v-for="item in radioInfoData" :key="item" :label="item.label">{{item.msg}}</el-radio-button> -->
                    <el-radio-button label="生命周期" v-if="roleBtn['master-6-2-1']">生命周期</el-radio-button>
                    <el-radio-button label="维度设置" v-if="roleBtn['master-6-2-2']">维度设置</el-radio-button>
                    <el-radio-button label="扩展字段" v-if="roleBtn['master-6-2-3']">扩展字段</el-radio-button>
                </el-radio-group>
			</el-card>
		</el-header>
		<el-main>
            <data-define-a v-if="roleBtn['master-6-2-1'] && this.radioInfo == '生命周期'"></data-define-a>
            <data-define-b v-if="roleBtn['master-6-2-2'] && this.radioInfo == '维度设置'"></data-define-b>
            <data-define-c v-if="roleBtn['master-6-2-3'] && this.radioInfo == '扩展字段'"></data-define-c>
		</el-main>
	</el-container>
</template>
<script>
    import { permission } from '@/utils'
    /**
     * 接口信息
     */
    // import { getPermissions, saveClubCardInfo } from '@/api/base/merchantManagerUser'
    import dataDefineA from './component/dataDefineA.vue'
    import dataDefineB from './component/dataDefineB.vue'
    import dataDefineC from './component/dataDefineC.vue'
    import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
                roleBtn: {
                    'master-6-2-1': false,
                    'master-6-2-2': false,
                    'master-6-2-3': false
                },
                // 选项卡
                radioInfo: '维度设置', // 选项卡切换
                radioInfoData: [ // 选项卡数据
                    {
                        label: '生命周期',
                        msg: '生命周期'
                    }, {
                        label: '维度设置',
                        msg: '维度设置'
                    }, {
                        label: '扩展字段',
                        msg: '扩展字段'
                    }
                ],

			}
		},
		methods: {
            // 单选组切换
            handleRedioInfo(val) {

            }
		},
        components: {
            dataDefineA,
            dataDefineB,
            dataDefineC
        },
		created() {
            // 权限
            this.roleBtn = permission(this.roleBtn);
//          console.log(JSON.stringify(this.roleBtn))
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
