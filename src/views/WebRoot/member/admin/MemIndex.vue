<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="8">
      <el-col :xs="24" :sm="12" :lg="4" class="card-panel-col">
        <div class="chart-wrapper">
          <div class="biaoti">90天新增会员</div>
          <div class="suzhi">2344</div>
          <PieChartA></PieChartA>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="16">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartDataA"></line-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="4" class="card-panel-col">
        <div class="chart-wrapper">
          <div class="biaoti">90天新增消费会员</div>
          <div class="suzhi2">127</div>
          <PieChartB></PieChartB>
        </div>
      </el-col>
    </el-row>


    <el-row :gutter="8">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart></pie-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart></bar-chart>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import LineChart from './components/MemLineChart'
import PieChart from './components/MemPieChart'
import BarChart from './components/MemBarChart'
import PieChartA from './components/MemPieChartA'
import PieChartB from './components/MemPieChartB'

const lineChartDataA = {
  newVisitis: {
    expectedData: [3901, 5354, 6034, 7999, 8231, 9500, 12260]
  }
}

export default {
  name: 'dashboard-admin',
  components: {
    LineChart,
    PieChart,
    BarChart,
    PieChartA,
    PieChartB
  },
  data() {
    return {
      lineChartDataA: lineChartDataA.newVisitis
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
    padding: 16px;
    margin-bottom: 0px;
  }
  .card-panel-col {
    padding-left: 10px;
    margin-bottom: 8px;
  }
  .biaoti {
  margin: 15px 0;
  font-size: 18px;
  color: #666;
  text-align: center;
}
.suzhi {
  font-size: 30px;
  color: #b6a2de;
  text-align: center;
}
.suzhi2 {
  font-size: 30px;
  color: #5ab1ef;
  text-align: center;
}
}
</style>
