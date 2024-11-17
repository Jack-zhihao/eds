<template>
    <div class="chart-warp" id="alarmChartWarp">
        <p class="title">报警统计</p>
        <div class="alarm-chart" id="alarmChart"></div>
    </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { onMounted, ref, computed, watch, watchEffect, inject} from 'vue';
import { useStore } from 'vuex'
const Store = useStore()

const eventBus = inject('eventBus', (eventBus) => eventBus)

const chartData = ref([
    { value: 1048, name: '一号机组', id: 0 },
    { value: 735, name: '二号机组', id: 1 },
    { value: 580, name: '三号机组', id: 2 },
])

watch(() => Store.state.appInfo.theme, (val) => {
    console.log(val)
}, {deep: true})

const formatValue = (name) => {
    const current = chartData.value.find((data) => data.name == name)
    const dataMap = [`{b|${current.value}}\n`, `{c|${current.value}}\n`, `{d|${current.value}}\n`]
    return dataMap[current.id]
}

let myChart = null
const handleChart = (theme) => {
    myChart && myChart.dispose()
    const option = {
        color: ['#F2C94C', '#1862F9', '#34CD4D'],
        grid: {
            left: 'right',
            right: '80'
        },
        tooltip: {
            trigger: 'item',
            formatter: (v) => {
                return `${v.marker} ${v.name} ${v.value}`;
            }
        },
        legend: {
            icon: 'none',
            orient: 'ertical',
            right: '10%',
            align: 'left',
            formatter(name) {

                return `{a|${name}}\n\n` + formatValue(name);
            },
            textStyle: {
                rich: {
                    a: {
                        color: theme == 'light' ? 'rgb(35 35 36)' : 'rgb(197 197 197)',
                        // color: 'rgb(197 197 197)',
                        fontSize: 14,
                        width: 40,
                        paddingBottom: '16px'
                    },
                    b: {
                        fontSize: 18,
                        width: 70,
                        color: '#F2C94C'
                    },
                    c: {
                        fontSize: 18,
                        width: 70,
                        color: '#1862F9'
                    },
                    d: {
                        fontSize: 18,
                        width: 70,
                        color: '#34CD4D'
                    }
                }
            }
        },
        series: [
            {
                name: 'alarm',
                type: 'pie',
                radius: ['45%', '80%'],
                avoidLabelOverlap: false,
                center: ['38%', '45%'],
                label: {
                    show: false,
                    position: 'right'
                },
                emphasis: {
                    disabled: false
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 1048, name: '一号机组' },
                    { value: 735, name: '二号机组' },
                    { value: 580, name: '三号机组' },
                ]
            }
        ]
    }
    setTimeout(() => {
        const alarmChartWarp = document.getElementById('alarmChartWarp');
        const alarmChart = document.getElementById('alarmChart');
        alarmChart.style.width = (alarmChartWarp.offsetWidth - 32) + 'px'
        myChart = echarts.init(alarmChart);
        myChart.setOption(option)
    }, 300)
}


eventBus.on('updateTheme', (theme) => {
    handleChart(theme)
})
onMounted(() => {
    handleChart(Store.getters.theme)
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

    .alarm-chart {
        width: 100%;
        height: 100%;
    }
}
</style>
