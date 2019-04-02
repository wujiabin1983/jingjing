<template>
  <div class="dashboard-editor-container">
    <panel-group></panel-group>
    <el-row :gutter="16">
      <el-col :xs="24" :sm="24" :lg="16">
        <div class="chart-wrapper">
          <MapCharts></MapCharts>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <BarCharts></BarCharts>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <PieChartsA1></PieChartsA1>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <PieChartsA2></PieChartsA2>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <PieChartsA3></PieChartsA3>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <PieChartsA4></PieChartsA4>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <BarChartsB1></BarChartsB1>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <PieChartsB2></PieChartsB2>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <PieChartsB3></PieChartsB3>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <BarChartsB4></BarChartsB4>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <BarChartsC1></BarChartsC1>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <BarChartsC2></BarChartsC2>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <BarChartsC3></BarChartsC3>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <BarChartsC4></BarChartsC4>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <PieChartsD1></PieChartsD1>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <PieChartsD2></PieChartsD2>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <PieChartsD3></PieChartsD3>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="chart-wrapper">
          <PieChartsD4></PieChartsD4>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import PanelGroup from './components/Mem360PanelGroup'
import MapCharts from './components/Mem360Map'
import BarCharts from './components/Mem360BarChart'
import PieChartsA1 from './components/Mem360PieChartA1'
import PieChartsA2 from './components/Mem360PieChartA2'
import PieChartsA3 from './components/Mem360PieChartA3'
import PieChartsA4 from './components/Mem360PieChartA4'
import BarChartsB1 from './components/Mem360BarChartB1'
import PieChartsB2 from './components/Mem360PieChartB2'
import PieChartsB3 from './components/Mem360PieChartB3'
import BarChartsB4 from './components/Mem360BarChartB4'
import BarChartsC1 from './components/Mem360BarChartC1'
import BarChartsC2 from './components/Mem360BarChartC2'
import BarChartsC3 from './components/Mem360BarChartC3'
import BarChartsC4 from './components/Mem360BarChartC4'
import PieChartsD1 from './components/Mem360PieChartD1'
import PieChartsD2 from './components/Mem360PieChartD2'
import PieChartsD3 from './components/Mem360PieChartD3'
import PieChartsD4 from './components/Mem360PieChartD4'

export default {
  name: 'dashboard-admin',
  components: {
    PanelGroup,
    MapCharts,
    BarCharts,
    PieChartsA1,
    PieChartsA2,
    PieChartsA3,
    PieChartsA4,
    BarChartsB1,
    PieChartsB2,
    PieChartsB3,
    BarChartsB4,
    BarChartsC1,
    BarChartsC2,
    BarChartsC3,
    BarChartsC4,
    PieChartsD1,
    PieChartsD2,
    PieChartsD3,
    PieChartsD4
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 16px;
  background-color: #f0f0f0;
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 16px;
    border-radius: 8px;
  }
}
</style>
