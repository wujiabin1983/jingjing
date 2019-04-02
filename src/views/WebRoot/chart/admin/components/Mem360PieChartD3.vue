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
          text: '折率',
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
          data: ['100', '99-90', '89-80', '79-70', '69-60', '59-50', '<50'],
          itemWidth: 15,
          itemHeight: 11,
          textStyle: {
            fontSize: 12
          }
        },
        calculable: true,
        series: [
          {
            name: '折率',
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
                show: true
              }
            },
            data: [
              { value: 280,
                name: '100',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{b} \n {d}%'
                    }
                  }
                }
              },
              { value: 240,
                name: '99-90',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{b} \n {d}%'
                    }
                  }
                }
              },
              { value: 220,
                name: '89-80',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{b} \n {d}%'
                    }
                  }
                }
              },
              { value: 210,
                name: '79-70',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{b} \n {d}%'
                    }
                  }
                }
              },
              { value: 200,
                name: '69-60',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{b} \n {d}%'
                    }
                  }
                }
              },
              { value: 190,
                name: '59-50',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{b} \n {d}%'
                    }
                  }
                }
              },
              { value: 180,
                name: '<50',
                itemStyle: {
                  normal: {
                    label: {
                      formatter: '{b} \n {d}%'
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
