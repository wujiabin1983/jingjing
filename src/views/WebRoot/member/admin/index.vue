<template>
  <div class="dashboard-editor-container">
    <!--<github-corner></github-corner>-->

    <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group>

    <panel-group2></panel-group2>
<!--
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"></line-chart>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData1"></line-chart>
    </el-row>
-->
    
    <el-row :gutter="8">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <line-chart0 :chart-data="lineChartDataA"></line-chart0>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <line-chart1 :chart-data="lineChartDataB"></line-chart1>
        </div>
      </el-col>
    </el-row>
  


<!--
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart></raddar-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart></pie-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart></bar-chart>
        </div>
      </el-col>
    </el-row>

-->

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:4px;margin-bottom:30px;">
        <div :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="width:100%;height:50px;background:#fff;padding:10px;">
          <div style="width:50%;float:left">
          <p style="height:30px;margin:5px;font-family:'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB'Microsoft YaHei','微软雅黑',Arial,sans-serif;font-size:18px;color:#409EFF;">会员业绩</p>
          </div>
          <div style="float:right">
            <el-button type="primary">会员等级</el-button>
            <el-button type="success">新老会员</el-button>
          </div>
        </div>
        <transaction-table></transaction-table>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:4px;margin-bottom:30px;">
        <div class="chart-wrapper">
          <bar-chart></bar-chart>
        </div>
      </el-col>
    </el-row>
<!--
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table></transaction-table>
      </el-col>
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 5}">
        <todo-list></todo-list>
      </el-col>
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 5}">
        <box-card></box-card>
      </el-col>
    </el-row>
-->
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/SalesPanelGroup'
import PanelGroup2 from './components/SalesPanelGroup2'
import LineChart0 from './components/SalesLineChart'
import LineChart1 from './components/SalesLineChart1'
import BarChart from './components/SalesBarChart'
import TransactionTable from './components/TransactionTable'

const lineChartDataA = {
  newVisitis: {
    expectedData: [37500, 35000, 40000, 11100, 42000, 16000, 12260],
    actualData: [66000, 61000, 52000, 37100, 69000, 26000, 22265]
  }
}

const lineChartDataB = {
  newVisitis: {
    expectedData: [-35, 60, 25, -15, -20, 30, 0],
    actualData: [50, -70, 20, 0, -9, 19, 10]
  }
}

const lineChartData = {
  newVisitis: {
    expectedData: [111, 120, 161, 134, 105, 160, 165],
    actualData: [130, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [190, 192, 120, 144, 160, 130, 140],
    actualData: [170, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [90, 100, 121, 104, 105, 90, 100],
    actualData: [110, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [120, 140, 141, 142, 145, 150, 160],
    actualData: [130, 82, 91, 154, 162, 140, 130]
  }
}
export default {
  name: 'dashboard-admin',
  components: {
    GithubCorner,
    PanelGroup,
    PanelGroup2,
    LineChart0,
    LineChart1,
    BarChart,
    TransactionTable
  },
  data() {
    return {
      lineChartDataA: lineChartDataA.newVisitis,
      lineChartDataB: lineChartDataB.newVisitis,
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 16px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 8px;
  }
}
</style>
