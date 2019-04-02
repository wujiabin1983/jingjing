<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

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
      default: '220px'
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
          text: '90天新增消费会员',
          textStyle: {
            fontSize: 15,
            color: '#5ab1ef'
          },
          subtext: '',
          x: 'center',
          y: '170px'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        calculable: true,
        series: [
          {
            name: '占90天新增会员比',
            type: 'pie',
            radius: [38, 58],
            center: ['50%', '45%'],
            data: [{
              value: 23.35,
              name: '占90天新增会员比',
              itemStyle: {
                normal: {
                  color: '#5ab1ef',
                  label: {
                    show: true,
                    position: 'center',
                    formatter: '{c}' + '%',
                    textStyle: {
                      fontSize: 16,
                      baseline: 'bottom'
                    }
                  },
                  labelLine: {
                    show: false
                  }
                }
              }
            },
            {
              value: 76.65,
              name: 'other',
              itemStyle: {
                normal: {
                  color: '#ccc',
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  }
                },
                emphasis: {
                  color: 'rgba(0,0,0,0)'
                }
              }
            }],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
