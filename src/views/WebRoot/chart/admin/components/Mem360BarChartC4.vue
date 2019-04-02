<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

const animationDuration = 3000

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
      default: '250px'
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
        title: {
          text: '消费次数',
          subtext: '',
          itemGap: 5,
          x: 'center',
          textStyle: {
            color: '#000'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 50,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: [{
          type: 'category',
          data: ['>=10', '7-9', '5-6', '3-4', '1-2', '0'],
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        {
          type: 'category',
          data: [201, 500, 680, 900, 700, 850],
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        }],
        xAxis: [{
          type: 'value',
          max: 1000,
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          }
        }],
        series: [
          {
            name: 'none',
            // stack: 'sum',
            barGap: -1,
            barWidth: 21,
            data: [1000, 1000, 1000, 1000, 1000, 1000],
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#ededed'
              }
            },
            animationDuration: 0
          },
          {
            name: 'value',
            // stack: 'sum',
            barGap: -1,
            barWidth: 21,
            data: [200, 500, 680, 900, 700, 850],
            type: 'bar',
            animationDuration
          }
        ]
      })
    }
  }
}
</script>
