<template>
  <div class="chart-warp water-level" id="waterLevelChartWarp">
    <p class="title">水位信息</p>
    <span class="date-type-warp">
      <a-select v-model:value="dateType" @change="handleDateChange">
        <a-select-option value="1">24小时数据</a-select-option>
        <a-select-option value="7">过去7天数据</a-select-option>
        <a-select-option value="15">过去15天数据</a-select-option>
        <a-select-option value="30">过去30天数据</a-select-option>
      </a-select>
    </span>
    <div class="waterLevelChart" id="waterLevelChart"></div>
  </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { onMounted, ref, inject } from 'vue';
import { getChartsData } from '@/api/chartApi'
import moment from 'moment';
const eventBus = inject('eventBus', (eventBus) => eventBus)

// 295
const formatTxt = 'YYYY-MM-DD HH:mm:ss'
const dateType = ref('7')
let start_time = ''
let end_time = ''
const handleDateChange = (days) => {
  if (days == '30') {
    start_time = moment().subtract(1, 'months').format(formatTxt)
  } else {
    start_time = moment().subtract(Number(days), 'days').format(formatTxt)
  }

  end_time = moment().format(formatTxt)
  handleGetChartsData({ start_time, end_time, point_ids: [282, 296, 297] })
}

// 获取水位信息
let label_unit_symbol = ''
let level_label = ref([])
let level_282 = ref([]) // 水池
let level_296 = ref([]) // 内河
let level_297 = ref([]) // 外河

const handleGetChartsData = (params) => {
  getChartsData(params).then((res) => {
    if (!res.data) return
    label_unit_symbol = res.data[0].unit_symbol
    // 24小时数据
    if (dateType.value == '1') {
      res.data.forEach((item, i) => {
        item.values = item.values.map((value) => value.toFixed(2))
        if (i == 0) {
          level_label.value = item.times.map((time) => moment(time).format('MM-DD HH:mm'))
          level_282.value = item.values
        }
        if (i == 1) {
          level_296.value = item.values
        }
        if (i == 2) {
          level_297.value = item.values
        }
      })
      handleChartInit()
      return
    }
    // 以天为数据
    const waterLevel = res.data.map((data) => {
      return formatDataInDay(data)
    })
    console.log('waterLevel', waterLevel)

    waterLevel.forEach((levelData, i) => {
      const values = Object.values(levelData)
      const keys = Object.keys(levelData)
      if (i == 0) {
        level_282.value = values
        level_label.value = keys
      }
      if (i == 1) {
        level_296.value = values
      }
      if (i == 2) {
        level_297.value = values
      }
    })

    handleChartInit()
  })
}

// 整理小时节点数据类型
const formatDataInDay = (res) => {
  const result = {}
  const days = {}
  res.times.forEach((time, i) => {
    const dateKey = moment(time).format('YYYY-MM-DD')
    if (days.hasOwnProperty(dateKey)) {
      days[String(dateKey)].push(res.values[i].toFixed(2))
    } else {
      days[String(dateKey)] = [res.values[i].toFixed(2)]
    }
  })
  Object.keys(days).forEach((key) => {
    result[key] = Math.max(...days[key])
  })
  return result
}

const theme = ref(localStorage.getItem('theme'))
eventBus.on('updateTheme', (_theme) => {
  theme.value = _theme
  handleChartInit()
})
let myChart = null
const handleChartInit = () => {
    myChart && myChart.dispose()
    const option = {
        color: ['#F2C94C', '#1862F9', '#34CD4D'],
        grid: {
        top: 40,
        left: '12%',
        right: '4%',
        bottom: 40
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
        icon: 'none',
        left: '0',
        align: 'center',
        formatter(name) {
            const legendMap = {
            '水池': `{b|${Math.max(...level_282.value)}}`,
            '内河': `{c|${Math.max(...level_296.value)}}`,
            '外河': `{d|${Math.max(...level_297.value)}}`,
            }
            return `{a|${name + ': '}}${legendMap[name]}`;
        },
        textStyle: {
            rich: {
            a: {
                display: 'inline-block',
                color:  theme.value == 'light' ? 'rgb(35 35 36)' : 'rgb(197 197 197)',
                fontSize: 12,
                align: 'center',
            },
            b: {
                fontSize: 14,
                color: '#F2C94C',
                lineHeight: 1,
                align: 'center',
            },
            c: {
                fontSize: 14,
                color: '#1862F9',
                lineHeight: 1,
                align: 'center',
            },
            d: {
                fontSize: 14,
                color: '#34CD4D',
                lineHeight: 1,
                align: 'center',
            }
            }
        }
        },
        xAxis: {
        show: true,
        type: 'category',
        axisTick: {
            alignWithLabel: true,
            lineStyle: {
            color: 'rgba(65, 97, 128, 0.45)'
            }
        },
        axisLabel: {
            color: theme.value == 'light' ? 'rgba(44, 53, 66, 0.45)' : 'rgb(197 197 197)',
            fontSize: 10,
            formatter: (label) => {
            if (dateType.value == '1') {
                const labelArr = label.split(' ')
                return `${labelArr[1]}\n${labelArr[0]}`
            } else {
                return label
            }

            }
        },
        axisLine: {
            lineStyle: {
            color: 'rgba(65, 97, 128, 0.45)'
            }
        },
        data: level_label.value
        },
        yAxis: {
        type: 'value',
        axisLabel: {
            formatter: `{value}${label_unit_symbol}`,
            color:  theme.value == 'light' ? 'rgba(44, 53, 66, 0.45)' : 'rgb(197 197 197)',
            fontSize: 10,
            splitLine: {
            show: true
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
            color: theme.value == 'light' ? 'rgba(44, 53, 66, 0.1) ' : 'rgb(65, 65, 73)'
            }
        }
        },
        series: [
        {
            name: '水池',
            data: level_282.value,
            type: 'line',
            smooth: true,
            showSymbol: false
        },
        {
            name: '内河',
            data: level_296.value,
            type: 'line',
            smooth: true,
            showSymbol: false
        },
        {
            name: '外河',
            data: level_297.value,
            type: 'line',
            smooth: true,
            showSymbol: false
        },

        ]
    }
    setTimeout(() => {
        const waterLevelChartWarp = document.getElementById('waterLevelChartWarp');
        const waterLevelChart = document.getElementById('waterLevelChart');
        waterLevelChart.style.width = (waterLevelChartWarp.offsetWidth - 32) + 'px';
        myChart = echarts.init(waterLevelChart);
        myChart.setOption(option);
    }, 500)
}


onMounted(() => {
  handleDateChange('7')
})

</script>
<style lang="less">
@import url('@/styles/theme.less');
.water-level {
  position: relative;

  .title {
    color: #232324;
    font-size: 14px;
    line-height: 1;
    flex-shrink: 0;
  }

  .date-type-warp {
    display: inline-block;
    color: #49CF4F;
    position: absolute;
    right: 10px;
    top: 10px;

    .ant-select-selector {
      border: 1px solid #49CF4F !important;
      background-color: @main-bg-color !important;
      color: @main-text-color;
    }

    .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
      border-color: #49CF4F;
      color: #49CF4F;
    }

    .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
      border: 1px solid #49CF4F !important;
      box-shadow: none;
    }
  }

  .waterLevelChart {
    width: 100%;
    height: 100%;
  }
}
</style>
