<template>
    <div class="app-main">
        <el-form autoComplete="on" ref="loginForm" label-position="left"
             class="card-box login-form">
            <h3 class="title">账号选择</h3>
            <el-table
                border
                ref="singleTable"
                :data="tableData"
                highlight-current-row
                @current-change="handleCurrentChange">
                <el-table-column
                type="index"
                width="50">
                </el-table-column>
                <el-table-column
                property="accountNum"
                label="账号"
                width="120">
                </el-table-column>
                <el-table-column
                property="jobNum"
                label="员工工号"
                width="120">
                </el-table-column>
                <el-table-column
                property="userName"
                label="用户名">
                </el-table-column>
                <el-table-column
                property="role"
                label="角色">
                </el-table-column>
                <el-table-column
                property="address"
                label="所属门店">
                </el-table-column>
            </el-table>
            <div class="marginTop10">
                <el-button type="primary" @click="setCurrent(tableData[1])">选中第二行</el-button>
                <el-button @click="setCurrent()">取消选择</el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
name: 'forgetPass'
export default {
    data() {
        return {
            tableData: [{
                accountNum: '账号',
                jobNum: '员工工号',
                userName: '用户名',
                role: '角色',
                address: '上海市普陀区金沙江路 1518 弄',
            },{
                accountNum: '账号',
                jobNum: '员工工号',
                userName: '用户名',
                role: '角色',
                address: '上海市普陀区金沙江路 1518 弄',
            }],
            currentRow: null
        }
    },
    methods: {
        setCurrent(row) {
            this.$refs.singleTable.setCurrentRow(row);
        },
        handleCurrentChange(val) {
            this.currentRow = val;
        }
    }
}
</script>
<style rel="stylesheep/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";
    @import "src/styles/_function.scss";
    // 登陆框
    .login-form {
      position: absolute;
      top: 50%;
      left: 50%;
      width: rem(1000px);
    //   min-width: 226px;
      height: rem(355px);
      transform: translate(-50%, -50%);
      padding: 0 rem(45px) 0 rem(45px);
      background: rgba(225, 225, 225, 0.8);
      border-radius: rem(15px);
      z-index: 1000;
    }
    // 标题 - 系统登录
    .title {
      // color: #1d368d;
      color: #1d368d;
      margin: rem(0px) auto 0 auto;
      text-align: left;
      line-height: rem(98px);
      font-size: rem(24px);
      font-family: 'ios-bold';
    }
</style>
