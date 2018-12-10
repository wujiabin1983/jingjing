<template>
  <el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn.addMemberReturnTask">
        <el-button type="primary" @click="addTask" v-if="roleBtn.addMemberReturnTask">新建任务</el-button>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData">
					<el-table-column prop="operationDate"  label="创建时间"></el-table-column>
					<el-table-column prop="taskName"  label="回访标题"></el-table-column>
					<el-table-column prop="storeGroupId" label="操作者"></el-table-column>
					<el-table-column prop="taskDate" label="回访时间"></el-table-column>
					<el-table-column prop="visitedQty" label="回访人数">
            <template slot-scope="scope">
              {{scope.row.visitedQty}}/{{scope.row.ttlVisitedQty}}
            </template>
          </el-table-column>
					<el-table-column prop="taskStatus" label="任务状态"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<el-tooltip class="item" content="查看" placement="top">
								<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="viewTask(scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="修改" placement="top" v-if="roleBtn.updateStoreGroupInfo && !scope.row.isEdit">
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="updateTask(scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="确认" placement="top" v-if="roleBtn.forbiddenMemberReturnTask && scope.row.isEdit">
								<icon-svg icon-class="queren" id="icon-queren" @click.native.prevent="forbiddenTask(scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="删除" placement="top" v-if="roleBtn.deleteStoreGroupInfo">
								<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="deleteTask(scope.row)" />
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-footer v-if="count != 0">
					<el-pagination background  class="pagination" layout="count, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" :page-size="search.limit" :total="count" @current-change="handleCurrentChange">
					</el-pagination>
				</el-footer>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { permission } from '@/utils'
import { getMemberReturnVisitList } from '@/api/work/memberReturnVisit.js'
export default {
  data(){
    return{
      search:{
        userId: '',
        page: 0, // 当前页
				limit: this.GLOBAL.limit // 条/页
      },
      count:0,
      // 权限
      roleBtn: {
        addMemberReturnTask: true,
        updateMemberReturnTask: true,
        forbiddenMemberReturnTask: true,
        deleteMemberReturnTask: true,
      },
      tableLoading:false,
      // 表格数据
      tableData: [],
    }
  },
  computed:{
    // 计算属性
			...mapGetters([
				'userInfo',
			]),
  },
  created() {
    // this.roleBtn = permission(this.roleBtn);
    this.search.userId = this.userInfo.userCode
  },
  methods:{
    getTableData(){
      console.log(this.search)
      let params = this.$Lodash.cloneDeep(this.search)
      this.tableLoading = true;
      // 查询接口
      getMemberReturnVisitList(params).then((res)=> {
        let data = JSON.parse(Base64.decode(res.data));
        let result = [];
        if(data.messageType=='SUCCESS') {
          data.data.forEach((val, index) => {
            result.push({
              isEdit: false,
              ...val
            });
          })
          this.count = data.count;
          this.tableData = result;
        } else {
          this.$message({
            message: data.messageContent,
            type: 'warning'
          });
        }
        this.tableLoading = false;
      }).catch((err)=> {
        console.log(err);
        this.tableLoading = false;
      });
    },
    //修改每页条数
    handleSizeChange(val) {
      this.search.limit = val;
    },
    handleCurrentChange(val) {
      this.search.page = val;
    },
    addTask(){
      this.$router.push({
        path:'work-addMemberReturnTask'
      })
    },
    // 图标 - 查看
    viewTask(index, row) {
      var data = JSON.stringify(row);
      this.$router.push({
        name: '门店管理店组管理查询',
        params: {
          pageType: '查看',
          formData: data
        }
      });
    },
    updateTask(index, row) {
      var data = JSON.stringify(row);
      
    },
    forbiddenTask(index,row){

    },
    deleteTask(index,row){

    },
  },
  watch:{
    search: {
      handler(n, o) {
        this.getTableData()
      },
      deep: true
    },
  }
}
</script>
