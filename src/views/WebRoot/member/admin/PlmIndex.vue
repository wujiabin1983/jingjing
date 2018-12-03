<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group>
    <el-row :gutter="8">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <bar-chart></bar-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData"></line-chart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import PanelGroup from './components/PlmPanelGroup'
import LineChart from './components/PlmLineChart'
import BarChart from './components/PlmBarChart'

const lineChartData = {
  newVisitis: {
    liushi: [10000, 7901, 12799, 6100, 1462, 18346, 23432],
    yuliushi: [26000, 10411, 37472, 12100, 21245, 26000, 34234],
    siumian: [37501, 26341, 52164, 34537, 36225, 38346, 52260],
    chenmo: [45347, 33657, 75123, 34351, 36454, 43564, 66542],
    huoyue: [87423, 69853, 87835, 44572, 52000, 56000, 84234]
  }
}

export default {
  name: 'dashboard-admin',
  components: {
    PanelGroup,
    LineChart,
    BarChart
  },
  data() {
    return {
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
