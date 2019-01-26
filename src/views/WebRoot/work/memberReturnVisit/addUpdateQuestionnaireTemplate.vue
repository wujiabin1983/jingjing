<!--回访任务列表-->
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
					<el-table-column prop="createdBy" label="操作者"></el-table-column>
					<el-table-column prop="taskDate" label="回访时间">
            <template  slot-scope="scope">
              {{scope.row.taskDate.taskDateBegin}}-{{scope.row.taskDate.taskDateEnd}}
            </template>
          </el-table-column>
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
							<el-tooltip class="item" content="修改" placement="top" v-if="roleBtn.updateMemberReturnTask ">
								<icon-svg icon-class="xiugai" id="icon-xiugai" @click.native.prevent="updateTask(scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="确认" placement="top" v-if="roleBtn.forbiddenMemberReturnTask">
								<icon-svg icon-class="queren" id="icon-queren" @click.native.prevent="changeTaskStatus(scope.row)" />
							</el-tooltip>
							<el-tooltip class="item" content="删除" placement="top" v-if="roleBtn.deleteMemberReturnTask">
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
