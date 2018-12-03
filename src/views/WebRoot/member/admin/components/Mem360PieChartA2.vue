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
          text: '年龄分布',
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
          right: 5,
          y: 'center',
          data: ['<30', '30-34', '35-39', '40-44', '45-49', '>50'],
          itemWidth: 15,
          itemHeight: 11,
          textStyle: {
            fontSize: 12
          }
        },
        calculable: true,
        series: [
          {
            name: '年龄分布',
            type: 'pie',
            clockWise: false,
            radius: [0, 70],
            center: ['35%', '50%'],
            roseType: 'area',
            label: {
              normal: {
                show: false,
                position: 'outer'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '12',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: true,
                length: 2
              }
            },
            data: [
              { value: 250,
                name: '<30',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    }
                  }
                }
              },
              { value: 240,
                name: '30-34',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    }
                  }
                }
              },
              { value: 149,
                name: '35-39',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    }
                  }
                }
              },
              { value: 162,
                name: '40-44',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    }
                  }
                }
              },
              { value: 120,
                name: '45-49',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{d}% \n {b}'
                    }
                  }
                }
              },
              { value: 100,
                name: '>50',
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
