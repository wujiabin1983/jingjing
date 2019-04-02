<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

const animationDuration = 6000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '289px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['钻石卡', '金卡', '银卡', '普卡']
        },
        title: {
          text: '会员销售',
          subtext: '单位(万元)'
        },
        grid: {
          top: 60,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: [{
          type: 'category',
          data: ['2018-02-07', '2018-02-08', '2018-02-09', '2018-02-10', '2018-02-11', '2018-02-12', '2018-02-13'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        xAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '钻石卡',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [250, 290, 200, 334, 390, 330, 220],
          animationDuration
        }, {
          name: '金卡',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [240, 280, 200, 334, 390, 330, 220],
          animationDuration
        }, {
          name: '银卡',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [190, 210, 200, 334, 390, 330, 220],
          animationDuration
        }, {
          name: '普卡',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [310, 170, 200, 334, 390, 330, 220],
          animationDuration
        }]
      })
    }
  }
}
</script>
