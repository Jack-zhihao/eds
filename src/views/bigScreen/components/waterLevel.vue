<template>
  <div class="water-level-warp pane-warp">
    <div class="pane-title">水位</div>
    <div class="chart" id="screenWaterLevelChart"></div>
  </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref, defineProps, watchEffect } from 'vue';
const props = defineProps({
  scale: {
    type: Number,
    defaule: 1
  },
  message90: {
    type: [Array, Object],
    default: () => ({})
  },
  message84: {
    type: [Array, Object],
    default: () => ({})
  }
})

const _option = ref({})
let timer = null
let value = []
// 刷新太频繁导致卡顿,设置节流
const handleRanderChart = () => {
  if (props.message90.points && props.message84.points) {
        const message90Value = props.message90.points.map((point) => point.value)
        const message84Value = props.message84.points.map((point) => point.value)
        value = [...message90Value, ...message84Value]
  }
  if (!timer) {
    timer = setTimeout(() => {
      if (props.message90.points && props.message84.points) {
        _option.value = {
          series: [{
            data: [
              { value: value[0], itemStyle: { color: '#1FE88B' } },
              { value: value[1], itemStyle: { color: '#F2C94C' } },
              { value: value[2], itemStyle: { color: '#165DFF' } }
            ]
          }]
        }
        myChart && myChart.setOption(_option.value)
        myChart && myChart.resize()
      }
      timer = null
    }, 1000)
  }
}

watchEffect(handleRanderChart)

onMounted(handleRanderChart)

const option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'none'
    },
    formatter([data]) {
      const { marker, name, value } = data
      return `${marker} ${name}&nbsp;&nbsp;&nbsp;&nbsp;${value}米`
    }
  },
  grid: {
    left: '10%',
    right: '0%',
    bottom: '10%'
  },
  xAxis: [
    {
      show: true,
      type: 'category',
      data: ['内河', '外河', '水池'],
      axisLabel: {
        show: true,
        fontSize: 12 * props.scale
      },
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisLabel: {
        show: true,
        textStyle: {
          fontSize: 12 * props.scale
          // color: '#E0E0E0'  // 设置 y 轴标签的颜色为紫色
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          // color: '#E0E0E0'  // 设置 y 轴轴线的颜色为橄榄色
        }
      },
      axisTick: {
        show: true,
        inside: true,
        lineStyle: {
          // color: '#E0E0E0'  // 设置 y 轴刻度线的颜色为青绿色
        }
      },
      splitLine: {
        show: false
      }
    }
  ],
  series: [{
    barWidth: 50,
    barGap: '50',
    data: [
      { value: 0, itemStyle: { color: '#1FE88B' } },  // 第一个柱子为红色
      { value: 0, itemStyle: { color: '#F2C94C' } },  // 第二个柱子为绿色
      { value: 0, itemStyle: { color: '#165DFF' } }   // 第三个柱子为蓝色
    ],
    type: 'bar'
  }]
}


// 刷新图表
let myChart = null
const handleReflashChart = () => {
  myChart && myChart.resize();
}

let resizeObserver = null
onMounted(() => {
  myChart = echarts.init(document.getElementById('screenWaterLevelChart'));
  myChart.setOption(option);
  resizeObserver = new ResizeObserver(handleReflashChart).observe(document.body);
})
onUnmounted(() => {
  resizeObserver && resizeObserver.disconnect()
})
</script>
<style lang="less">
.water-level-warp {
  height: calc(100% - 5.7rem);
  margin: 0.1rem 0;
  display: flex;
  flex-direction: column;

  .pane-title {
    flex-shrink: 0;
  }

  .chart {
    height: calc(100% - 0.18rem);
  }
}
</style>
