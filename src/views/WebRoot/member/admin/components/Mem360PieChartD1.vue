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
          text: '客单价',
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
          align: 'left',
          orient: 'vertical',
          right: 0,
          y: 'center',
          data: ['<500', '501-800', '801-1000', '1001-1200', '1201-1500', '1501-200'],
          itemWidth: 15,
          itemHeight: 11,
          textStyle: {
            fontSize: 12
          }
        },
        calculable: true,
        series: [
          {
            name: '会员注册渠道占比',
            type: 'pie',
            radius: [0, 70],
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
              { value: 320,
                name: '<500',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    }
                  }
                }
              },
              { value: 240,
                name: '501-800',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    }
                  }
                }
              },
              { value: 149,
                name: '801-1000',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    }
                  }
                }
              },
              { value: 100,
                name: '1001-1200',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    }
                  }
                }
              },
              { value: 59,
                name: '1201-1500',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    }
                  }
                }
              },
              { value: 30,
                name: '1501-2000',
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
