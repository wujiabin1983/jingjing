<!--问卷列表-->
<template>
  <el-container class="app-container">
		<el-header>
			<el-card v-if="roleBtn.addQuestionnaireTemplate">
        <el-button type="primary" @click="addTask" v-if="roleBtn.addQuestionnaireTemplate">新建模版</el-button>
			</el-card>
		</el-header>
		<el-main>
			<el-card>
				<el-table ref="tableData" v-loading="this.tableLoading" :data="tableData">
					<el-table-column prop="createOn"  label="创建时间"></el-table-column>
					<el-table-column prop="templateName"  label="模版名称"></el-table-column>
					<el-table-column prop="createdBy" label="创建人"></el-table-column>
					<el-table-column prop="templateDesc" label="模版说明"></el-table-column>
					<el-table-column prop="action" label="操作">
						<template slot-scope="scope">
							<el-tooltip class="item" content="查看" placement="top">
								<icon-svg icon-class="chakan" id="icon-chakan" @click.native.prevent="viewTask(scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="修改" placement="top" v-if="roleBtn.updateQuestionnaireTemplate">
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="updateTask(scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="确认" placement="top" v-if="roleBtn.forbiddenQuestionnaireTemplate">
								<icon-svg icon-class="queren" id="icon-queren" @click.native.prevent="changeTaskStatus(scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="删除" placement="top" v-if="roleBtn.apiDeleteQuestionnaireTemplate">
								<icon-svg icon-class="shanchu" id="icon-shanchu" @click.native.prevent="deleteTask(scope.row)" />
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<!-- 分页 -->
				<el-footer v-if="count != 0">
          <el-pagination background class="pagination" layout="prev, pager, next, jumper" :page-size="search.limit" :total="count" @current-change="handleCurrentChange">
          </el-pagination>
				</el-footer>
			</el-card>
		</el-main>
	</el-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { permission } from '@/utils'
import { apiGetQuestionnaireTemplateList, apiDeleteQuestionnaireTemplate, apiStartQuestionnaireTemplate, apiStopQuestionnaireTemplate } from '@/api/work/memberReturnVisit.js'
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
        addQuestionnaireTemplate: true,
        updateQuestionnaireTemplate: true,
        forbiddenQuestionnaireTemplate: true,
        apiDeleteQuestionnaireTemplate: true,
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
      apiGetQuestionnaireTemplateList(params).then((res)=> {
        let result = JSON.parse(Base64.decode(res.data));
        console.log(result)
        // if(data.messageType=='SUCCESS') {

          this.count = result.count;
          this.tableData = result.data;
        // } else {
        //   this.$message({
        //     message: result.messageContent,
        //     type: 'warning'
        //   });
        // }
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
        path:'/work/work-memberReturnVisit/addUpdateQuestionnaireTemplate'
      })
    },
    // 图标 - 查看
    viewTask(row) {
      
    },
    updateTask(row) {
      var data = JSON.stringify(row);
      this.$router.push({
        path:`/work/work-memberReturnVisit/addUpdateQuestionnaireTemplate/${row.id}`
      })
    },
    changeTaskStatus(row){
      let taskStatus = row.taskStatus
      let params = {
        userId:this.userInfo.userCode,
        id:row.id,
        templateName:row.templateName,
        version:row.version
      }
      if(taskStatus==0){ //禁止
        this.stopTask(params)
      }else{
        this.startTask(params)
      }
    },
    stopTask(){
      apiStopQuestionnaireTemplate(params).then((res)=> {
        let result = JSON.parse(Base64.decode(res.data));
        console.log(result)
        if(data.messageType=='SUCCESS') {
          this.$message({
            message: '停止成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: result.messageContent,
            type: 'warning'
          });
        }
        this.tableLoading = false;
      }).catch((err)=> {
        console.log(err);
        this.tableLoading = false;
      });
    },
    startTask(){
      apiStartQuestionnaireTemplate(params).then((res)=> {
        let result = JSON.parse(Base64.decode(res.data));
        console.log(result)
        if(data.messageType=='SUCCESS') {
          this.$message({
            message: '开启成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: result.messageContent,
            type: 'warning'
          });
        }
        this.tableLoading = false;
      }).catch((err)=> {
        console.log(err);
        this.tableLoading = false;
      });
    },
    deleteTask(row){
      let params={
        userId:this.userInfo.userCode,
        id:row.id,
        templateName:row.templateName
      }
      apiDeleteQuestionnaireTemplate(params).then((res)=> {
        let result = JSON.parse(Base64.decode(res.data));
        console.log(result)
        if(data.messageType=='SUCCESS') {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: result.messageContent,
            type: 'warning'
          });
        }
        this.tableLoading = false;
      }).catch((err)=> {
        console.log(err);
        this.tableLoading = false;
      });
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
