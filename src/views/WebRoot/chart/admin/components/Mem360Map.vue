<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
require('echarts/map/js/china')
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
      default: '380px'
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
      this.chart = echarts.init(this.$el)
      setTimeout(() => {
        this.chart.setOption({
          title: {
            text: '全国会员分布情况',
            subtext: '纯属虚构',
            x: 'center',
            textStyle: {
              color: '#000'
            }
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            show: false,
            orient: 'vertical',
            x: 'left',
            data: ['iphone3']
          },
          visualMap: [
            {
              min: 0,
              max: 2500,
              x: 'left',
              y: 'bottom',
              text: ['高', '低'],
              calculable: true,
              inRange: {
                color: ['#e7dbc3', '#e01f54']
              }
            }
          ],
          toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'center',
            feature: {
              mark: {
                show: true
              },
              dataView: {
                show: true,
                readOnly: false
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          roamController: {
            show: true,
            x: 'right',
            mapTypeControl: {
              'china': true
            }
          },
          series: [
            {
              name: 'iphone3',
              type: 'map',
              mapType: 'china',
              roam: false,
              itemStyle: {
                normal: {
                  label: {
                    show: true
                  }
                },
                emphasis: {
                  label: {
                    show: true
                  }
                }
              },
              data: [
                { name: '北京', value: Math.round(Math.random() * 1000) },
                { name: '天津', value: Math.round(Math.random() * 1000) },
                { name: '上海', value: Math.round(Math.random() * 1000) },
                { name: '重庆', value: Math.round(Math.random() * 1000) },
                { name: '河北', value: Math.round(Math.random() * 1000) },
                { name: '河南', value: Math.round(Math.random() * 1000) },
                { name: '云南', value: Math.round(Math.random() * 1000) },
                { name: '辽宁', value: Math.round(Math.random() * 1000) },
                { name: '黑龙江', value: Math.round(Math.random() * 1000) },
                { name: '湖南', value: Math.round(Math.random() * 1000) },
                { name: '安徽', value: Math.round(Math.random() * 1000) },
                { name: '山东', value: Math.round(Math.random() * 1000) },
                { name: '新疆', value: Math.round(Math.random() * 1000) },
                { name: '江苏', value: Math.round(Math.random() * 1000) },
                { name: '浙江', value: Math.round(Math.random() * 1000) },
                { name: '江西', value: Math.round(Math.random() * 1000) },
                { name: '湖北', value: Math.round(Math.random() * 1000) },
                { name: '广西', value: Math.round(Math.random() * 1000) },
                { name: '甘肃', value: Math.round(Math.random() * 1000) },
                { name: '山西', value: Math.round(Math.random() * 1000) },
                { name: '内蒙古', value: Math.round(Math.random() * 1000) },
                { name: '陕西', value: Math.round(Math.random() * 1000) },
                { name: '吉林', value: Math.round(Math.random() * 1000) },
                { name: '福建', value: Math.round(Math.random() * 1000) },
                { name: '贵州', value: Math.round(Math.random() * 1000) },
                { name: '广东', value: Math.round(Math.random() * 1000) },
                { name: '青海', value: Math.round(Math.random() * 1000) },
                { name: '西藏', value: Math.round(Math.random() * 1000) },
                { name: '四川', value: Math.round(Math.random() * 1000) },
                { name: '宁夏', value: Math.round(Math.random() * 1000) },
                { name: '海南', value: Math.round(Math.random() * 1000) },
                { name: '台湾', value: Math.round(Math.random() * 1000) },
                { name: '香港', value: Math.round(Math.random() * 1000) },
                { name: '澳门', value: Math.round(Math.random() * 1000) }
              ]
            }
          ]
        })
      }, 0)
    }
  }
}
</script>
