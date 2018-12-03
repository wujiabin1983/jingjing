<template>
	<el-table :data="childData" class="sortBox" border v-loading="tableLoading">
		<el-table-column prop="name" label="导航民成"></el-table-column>
		<el-table-column prop="name" label="是否必填">
			<template slot-scope="scope">
				<el-checkbox v-model="scope.row.isRequired">必填</el-checkbox>
			</template>
		</el-table-column>
		<el-table-column prop="sort" label="排序" width="60">
			<template slot-scope="scope">
				<el-tooltip class="item" content="排序" placement="top">
					<i class="el-icon-rank icon-rank"></i> - {{ scope.row.id }}
				</el-tooltip>
			</template>
		</el-table-column>
		<el-table-column prop="remove" label="排序" width="60">
			<template slot-scope="scope">
				<el-tooltip class="item" content="排序" placement="top">
					<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="iconShanchu(scope.$index, scope.row)" />
				</el-tooltip>
			</template>
		</el-table-column>
	</el-table>
</template>
<script>
	import { selectUserGroupInfo, addUserGroupInfo, updateUserGroupInfo, deleteUserGroupInfo } from '@/api/platform/userGroup'
	import { mapGetters } from 'vuex'
	import Sortable from 'sortablejs' // 排序
	export default {
		data() {
			return {
				// 数据
				// 拖拽排序对象
				sortable: null,

			}
		},
		props: ['childData'],
		methods: {
			// 排序
			setSort() { // 排序
				const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
				this.sortable = Sortable.create(el, {
					// ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
					setData: function(dataTransfer) {
						dataTransfer.setData('Text', '')
						// to avoid Firefox bug
						// Detail see : https://github.com/RubaXa/Sortable/issues/1012
					},
					onEnd: evt => {
						// this.sortOldIndex = evt.oldIndex;
						// this.sortNewIndex = evt.newIndex;
						// let targetRow = this.tableData.splice(evt.oldIndex, 1)[0];
						// this.tableData.splice(evt.newIndex, 0, targetRow);
					}
				});
				//          console.log();
			},
		},
		created() {
			// 钩子函数 -- 初始化
			this.$nextTick(() => {
				this.setSort(); // 拖拽排序
			});
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
	.el-table{
		width:60%
	}
	.el-form {
		display: inline-block;
		position: absolute;
		margin-left: rem(20px);
	}
</style>