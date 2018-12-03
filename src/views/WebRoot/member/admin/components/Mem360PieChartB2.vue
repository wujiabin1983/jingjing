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
          text: '会员活跃占比',
          subtext: '',
          x: 'center',
          textStyle: {
            color: '#000'
          }
        },
        tooltip: {
          show: false,
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 0,
          y: 'center',
          data: ['活跃会员', '沉默会员', '睡眠会员', '预流失会员'],
          itemWidth: 15,
          itemHeight: 11,
          textStyle: {
            fontSize: 12
          }
        },
        calculable: true,
        series: [
          {
            name: '会员活跃占比',
            type: 'pie',
            radius: [50, 70],
            center: ['35%', '50%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '16',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 10,
                name: '活跃会员',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    },
                    color: '#5ab1ef'
                  }
                }
              },
              { value: 20,
                name: '沉默会员',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    },
                    color: '#ffb980'
                  }
                }
              },
              { value: 30,
                name: '睡眠会员',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    },
                    color: '#d87a80'
                  }
                }
              },
              { value: 40,
                name: '预流失会员',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    },
                    color: '#8d98b3'
                  }
                }
              }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
