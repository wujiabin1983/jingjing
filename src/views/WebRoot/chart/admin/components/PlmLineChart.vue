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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHanlder)
    }

    // 监听侧边栏的变化
//  const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
//  sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }

//  const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
//  sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

    this.chart.dispose()
    this.chart = null
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  methods: {
    setOptions({ yuliushi, liushi, chenmo, huoyue, siumian } = {}) {
      this.chart.setOption({
        xAxis: {
          data: ['2018-02-07', '2018-02-08', '2018-02-09', '2018-02-10', '2018-02-11', '2018-02-12', '2018-02-13'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 60,
          containLabel: true
        },
        title: {
          text: '销售趋势',
          subtext: '单位(元)'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['流失会员', '预流失会员', '睡眠会员', '沉默会员', '活跃会员']
        },
        series: [{
          name: '流失会员',
          smooth: true,
          type: 'line',
          data: liushi,
          itemStyle: {
            normal: {
              color: '#7acf9f'
            }
          },
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '预流失会员',
          smooth: true,
          type: 'line',
          data: yuliushi,
          itemStyle: {
            normal: {
              color: '#6ac5e7'
            }
          },
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: '睡眠会员',
          smooth: true,
          type: 'line',
          data: siumian,
          itemStyle: {
            normal: {
              color: '#9795c5'
            }
          },
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: '沉默会员',
          smooth: true,
          type: 'line',
          data: chenmo,
          itemStyle: {
            normal: {
              color: '#f380a0'
            }
          },
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: '活跃会员',
          smooth: true,
          type: 'line',
          data: huoyue,
          itemStyle: {
            normal: {
              color: '#f4b95c'
            }
          },
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
