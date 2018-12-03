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
      default: '290px'
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
          text: '会员注册渠道占比',
          subtext: '',
          x: 'center'
        },
        tooltip: {
          show: false,
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          align: 'left',
          orient: 'vertical',
          right: 40,
          y: 58,
          itemGap: 15,
          itemHeight: 20,
          itemWidth: 20,
          textStyle: {
            fontSize: 16,
            color: '#004D99'
          },
          data: ['主动搜索', '邀请入会', '券关注', '扫码领取', '微信领卡', '支付宝领卡', '小程序领卡']
        },
        calculable: true,
        series: [
          {
            name: '会员注册渠道占比',
            type: 'pie',
            radius: [85, 110],
            center: ['38%', '55%'],
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
              { value: 320,
                name: '主动搜索',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    }
                  }
                }
              },
              { value: 240,
                name: '邀请入会',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    }
                  }
                }
              },
              { value: 149,
                name: '券关注',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    }
                  }
                }
              },
              { value: 100,
                name: '扫码领取',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    }
                  }
                }
              },
              { value: 59,
                name: '支付宝领卡',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    }
                  }
                }
              },
              { value: 30,
                name: '小程序领卡',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    }
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
