<template>
   <el-dialog title="回访详情" :visible.sync="isShowDialog" :before-close="close" @open="open" width="800" class="m-return-record-details-modal">
    <!-- 表格 -->
    <div class="scrm-table-wrap">
      <el-table class="scrm-table-wrap__table" ref="table" :data="tableData" v-loading="loading" border>
       	<el-table-column prop="returnVisitItem"  label="回访任务项"></el-table-column>
        <el-table-column prop="returnVisitItemDesc"  label="回访话术"></el-table-column>
        <el-table-column prop="customerSatisfaction" label="满意程度"></el-table-column>
        <el-table-column prop="customerFeedback" label="顾客反馈"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="scrm-table-wrap__page" v-if="count!=0">
        <el-pagination background class="pagination" layout="prev, pager, next, jumper" :page-size="search.limit" :total="count" @current-change="handleChangePage">
        </el-pagination>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="close()">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { apiGetMemberReturnRecord } from '@/api/work/memberReturnVisit.js'
import { mapGetters } from 'vuex'
export default {
  props:{
    isShowDialog: {
      type: Boolean,
      default: true
    },
    current:{}
  },
  data() {
    return {
      search: {
        userId: '',
        id:'',
        userCode : "",//会员编号
        page: 0, // 当前页
        limit: this.GLOBAL.limit // 条/页
      },
      loading:false,
      count:0,
      tableData:[]
    }
  },
  computed:{
    // 计算属性
			...mapGetters([
				'userInfo',
			]),
  },
  methods: {
    open(){
      console.log(this.current)
      let { id,userCode } = this.current
      this.search =  {
        userId:this.userInfo.userCode,
        id,
        userCode,//会员编号
        page: 0, // 当前页
        limit: this.GLOBAL.limit // 条/页
      },
      this.getMemberReturnRecord()
    },
    close() {
      this.$emit('update:isShowDialog', false)
    },
    //获取某会员的回访详情
    getMemberReturnRecord(){
      apiGetMemberReturnRecord(this.search).then((res)=> {
        let {data,count,code} = JSON.parse(Base64.decode(res.data));
        // if(code=='SUCCESS'){
          this.tableData = data
          this.count = count
        // }else{
        //   this.$message({
        //     message: code,
        //     type: 'warning'
        //   });
        // }
      }).catch((err)=> {
        this.$message({
          message: code,
          type: 'warning'
        });
      });
    },
    handleChangePage(val){
      this.search.page = val;
      this.getMemberReturnRecord();
    },

  },
}
</script>

<style lang="scss" scoped>

</style>
