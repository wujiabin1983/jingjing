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
          data: ['流失会员', '预流失会员', '睡眠会员', '沉默会员', '活跃会员']
        },
        title: {
          text: '会员生命周期占比分布',
          subtext: '比率'
        },
        grid: {
          top: 60,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: [{
          type: 'value',
          max: 100,
          axisTick: {
            alignWithLabel: true
          }
        }],
        xAxis: [{
          type: 'category',
          data: ['2018-02-07', '2018-02-08', '2018-02-09', '2018-02-10', '2018-02-11', '2018-02-12', '2018-02-13'],
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '流失会员',
          type: 'bar',
          stack: 'vistors',
          barWidth: '50%',
          itemStyle: {
            normal: {
              color: '#7acf9f'
            }
          },
          data: [10, 20, 20, 17, 21, 17, 21],
          animationDuration
        }, {
          name: '预流失会员',
          type: 'bar',
          stack: 'vistors',
          barWidth: '50%',
          itemStyle: {
            normal: {
              color: '#6ac5e7'
            }
          },
          data: [20, 10, 17, 32, 32, 20, 17],
          animationDuration
        }, {
          name: '睡眠会员',
          type: 'bar',
          stack: 'vistors',
          barWidth: '50%',
          itemStyle: {
            normal: {
              color: '#9795c5'
            }
          },
          data: [32, 17, 10, 20, 10, 21, 10],
          animationDuration
        }, {
          name: '沉默会员',
          type: 'bar',
          stack: 'vistors',
          barWidth: '50%',
          itemStyle: {
            normal: {
              color: '#f380a0'
            }
          },
          data: [17, 32, 21, 10, 20, 32, 32],
          animationDuration
        }, {
          name: '活跃会员',
          type: 'bar',
          stack: 'vistors',
          barWidth: '50%',
          itemStyle: {
            normal: {
              color: '#f4b95c'
            }
          },
          data: [21, 21, 32, 21, 17, 10, 20],
          animationDuration
        }]
      })
    }
  }
}
</script>
