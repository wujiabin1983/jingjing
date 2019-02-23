<template>
  <el-dialog title="选择分组" :visible.sync="isShowDialog" :before-close="close" @open="open" width="800" class="select-group-wrap">
    <div class="search-box">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input v-model="search.groupName" placeholder="请输入分组名称"></el-input>
        </el-col>
        <el-col :span="12">
           <el-button type="primary" @click="getGroupList">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="scrm-table-wrap">
      <el-table class="scrm-table-wrap__table" ref="table" :data="groupList" v-loading="loading" border @selection-change="handleSelectionChange" >
        <el-table-column type="index" width="50" label="序号" ></el-table-column>
        <el-table-column type="selection" width="50" label="选择" :selectable="handleSelectable"></el-table-column>
        <el-table-column prop="groupName" label="分组名称"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="scrm-table-wrap__page" v-if="countGroup!=0">
        <el-pagination background class="pagination" layout="prev, pager, next, jumper" :page-size="search.limit" :total="countGroup" @current-change="groupChange">
        </el-pagination>
      </div>
    </div>
   
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="close()">取 消</el-button>
      <el-button size="medium" type="primary" @click="submit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { selectMemberGroup } from '@/api/member/group'
  export default {
    props: {
      isShowDialog: {
        type: Boolean,
        default: true
      },
      selectGroupInfo: {
      },
    },
    data() {
      return {
        search: {
          userId: '',
          page: 0, // 当前页
          limit: this.GLOBAL.limit // 条/页
        },
        groupList: [],
        pageGroup: 0,
        loading: false,
        groupForm: {
          groupName: ''
        },
        selectedGroup: [],
        countGroup: null,
      }
    },
    computed:{
      ...mapGetters([
        'userInfo',
      ]),
    },
    methods: {
      close() {
        this.$emit('update:isShowDialog', false)
      },
      open() {
        this.getGroupList()
      },
      handleSelectable(row, index){
        console.log('row.id='+row.id)
        if(this.selectedGroup &&this.selectedGroup.length>0){
          return row.id==this.selectedGroup[0].id 
        }
        return true
      },
      defaultSelectGroup(){
        let selected = this.groupList.find((v,i)=>{
          return v.id == this.selectGroupInfo.id
        })
        console.log(selected)
        this.$nextTick(()=>{
          this.$refs.table.toggleRowSelection(selected);
        })
      },
      submit() {
        this.$emit('update:isShowDialog', false)
        console.log(this.selectedGroup[0])
        this.$emit('update:selectGroupInfo', this.selectedGroup[0])
      },
      //会员分组选中的数据
      handleSelectionChange(val) {
        // this.groupList.map((v,i)=>{
        //   v.selection = val.id==v.id
        // })
        this.selectedGroup = val;
      },
      getGroupList() {
        let {
          page,
          limit,
          groupName
        } = this.search
        let params = {
          userId: this.userInfo.userCode,
          page,
          limit,
          groupName
        }
        selectMemberGroup(params).then((res) => {
            let {data,count} = JSON.parse(Base64.decode(res.data));
            console.log(data)
            // data.map((v,i)=>{
            //   v.selection = false
            // })
            this.groupList = data;
            this.countGroup = count;
            this.loading = false;
            if(this.groupList && this.groupList.length>0) {
              this.defaultSelectGroup()
            }
          }).catch((err) => {
            console.log(err);
          })
      },
      groupChange(val) {
        this.search.page = val;
        this.getGroupList();
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/_function.scss";
.select-group-wrap{
  .search-box{
    margin:0 0 rem(20px);
  }
}
.scrm-table-wrap__page{
  padding-bottom: 0;
}
</style>
