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
          text: '消费时间',
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
          data: ['>=12', '9-11', '6-8', '3-5', '1-2', '0'],
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
          barWidth: 25,
          data: [15, 4, 23, 27, 17, 13],
          type: 'bar',
          itemStyle: {
            normal: {
              barBorderRadius: [3, 3, 0, 0],
              color: function(params) {
                // build a color map as your need.
                var colorList = [
                  '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                  '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                  '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                  '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ]
                return colorList[params.dataIndex]
              },
              label: {
                show: true,
                position: 'right',
                formatter: '{c}'
              }
            }
          },
          animationDuration
        }]
      })
    }
  }
}
</script>
