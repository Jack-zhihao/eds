<template>
    <div class="chart-warp" id="rainLevelChartWarp2">
        <p class="title">雨量监测</p>
        <div class="rainLevelChart" id="rainLevelChart2"></div>
    </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { onMounted, ref, defineProps, inject } from 'vue';

const eventBus = inject('eventBus', (eventBus) => eventBus)
const props = defineProps({
  mqttClient: {
    type: Object,
    default: null
  }
})

const theme = ref(localStorage.getItem('theme'))
eventBus.on('updateTheme', (_theme) => {
    theme.value = _theme
    handleChartInit()
})
let myChart = null
const handleChartInit = () => {
    myChart && myChart.dispose()
    const data = [10, 12, 11, 15, 60, 45, 60]
    const option = {
        color: ['#EB2828'],
        grid: {
                top: '15%',
                left: '13%',
                right: 10,
                bottom: '22%'
            },
            xAxis: {
            type: 'category',
            boundaryGap: true,
            axisTick: {
            alignWithLabel: true,
            lineStyle: {
                color: 'rgba(65, 97, 128, 0.45)'
            }
            },
            axisLabel: {
                color: theme.value == 'light' ? 'rgba(44, 53, 66, 0.45)' : 'rgb(197 197 197)',
                fontSize: 10
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(65, 97, 128, 0.45)'
                }
            },
            data: ['6/16', '6/17', '6.18', '6/19', '6/20', '6/21', '6/22']
        },
        yAxis: {
            type: 'value',
            minInterval: 15,
            axisLabel: {
                formatter: '{value}.0 %',
                color: theme.value == 'light' ? 'rgba(44, 53, 66, 0.45)' : 'rgb(197 197 197)',
                fontSize: 10
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
            data: data,
            type: 'line',
            smooth: true,
            symbol: function (value, {dataIndex}) {
                return dataIndex == data.length - 1 ? 'circle' : 'none'
                },
            symbolSize: 10,
            }
        ]
    }
     setTimeout(() => {
        const rainLevelChartWarp2 = document.getElementById('rainLevelChartWarp2');
        const rainLevelChart2 = document.getElementById('rainLevelChart2');
        rainLevelChart2.style.width = (rainLevelChartWarp2.offsetWidth - 32) + 'px'
        myChart = echarts.init(rainLevelChart2);
        myChart.setOption(option);
    }, 800)
}

onMounted(() => {
    handleChartInit()
})

</script>
<style lang="less">
@import url('@/styles/theme.less');
.chart-warp {
        .title {
            color: @main-text-color;
            font-size: 14px;
            line-height: 1;
            flex-shrink: 0;
        }
        .rainLevelChart {
            width: 100%;
            height: 100%;
        }
    }
</style>

