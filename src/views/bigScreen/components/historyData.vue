<template>
    <div class="history-data-warp pane-warp">
        <div class="pane-title">历史数据</div>
        <div class="filter-warp">
            <a-select v-model:value="form.device_id" show-search optionFilterProp="label" placeholder="选择设备"
                @change="handleDeviceChange" class="class-filter-select">
                <a-select-option v-for="device in deviceOptions" :key="device.id" :value="String(device.id)"
                    :label="device.device_name">{{ device.device_name }}</a-select-option>
            </a-select>
            <a-select v-model:value="form.point_ids" mode="multiple" class="class-filter-select" placeholder="选择数据点"
                @change="handlePointChange">
                <a-select-option v-for="item in pointOptions" :value="String(item.id)" :key="String(item.id)"
                    :disabled="item.disabled">{{ item.point_name }}</a-select-option>
            </a-select>
            <a-select v-model:value="form.date_type" class="date-type-filter-select" @change="handleDateTypeChange">
                <a-select-option v-for="item in dateTypeOptions" :value="item.value" :key="item.value">{{ item.label
                    }}</a-select-option>
            </a-select>
            <a-range-picker v-model:value="form.dateRange" @change="handleChangeDate" :valueFormat="formatTxt"
                class="date-range-filter-select">
                <template #suffixIcon>
                    <ClockCircleOutlined />
                </template>
            </a-range-picker>
        </div>
        <div class="chart" id="historyChart"></div>
    </div>
</template>
<script setup>
import { onMounted, ref, defineProps, defineEmits, onUnmounted} from 'vue'
import moment from 'moment'
import * as echarts from 'echarts'
import { ClockCircleOutlined } from '@ant-design/icons-vue'
import { getChartsData } from '@/api/chartApi'
import { getDeviceList, getPointsList, getDeviceDetail } from '@/api/deviceManage'
import { isObject } from '@/utils/validate'
const props = defineProps({
    scale: {
        type: Number,
        default: 1
    }
})
// 获取设备列表
const deviceOptions = ref([])
let isInit = true
const handleGetDeviceList = () => {
    getDeviceList({ page: 0 }).then((res) => {
        if (!res.data) return
        deviceOptions.value = res.data

        if (isInit) {
            form.value.device_id = String(res.data[0].id)
            handleDeviceChange(res.data[0].id)
        }
    })
}

// 设备列表与数据点联动
const pointOptions = ref([])
const handleDeviceChange = (device_id) => {
    getDeviceDetail({ id: device_id }).then((res) => {
        pointOptions.value = res.data.points.filter((data) => !!data.storable)
        // 初始化默认第一个设备-第一个数据点作为初始值
        if (isInit) {
            form.value.point_ids = [String(pointOptions.value[0].id)]
            const params = {
                start_time: form.value.start_time,
                end_time: form.value.end_time,
                point_ids: form.value.point_ids.map((point_id) => Number(point_id))
            }
            handleGetChartsData(params)
            isInit = false
        } else {
            form.value.point_ids = []
        }
    }).catch(() => {
        form.value.point_ids = []
    })
}

// 数据点选择联动
const handlePointChange = (point_ids) => {
    pointOptions.value = pointOptions.value.map((option) => {
        if (!point_ids.includes(String(option.id)) && point_ids.length >= 3) {
            option.disabled = true
        } else {
            option.disabled = false
        }
        return option
    })
    if (form.value.point_ids.length == 0) return

    // 选择数据点下拉框结束，判断是否已选择日期，有则开始请求数据
    if (!form.value.start_time || !form.value.end_time) return
    const params = {
        start_time: form.value.start_time,
        end_time: form.value.end_time,
        point_ids: form.value.point_ids.map((point_id) => Number(point_id))
    }
    handleGetChartsData(params)
}


const dateTypeOptions = [
    { label: '过去24小时', value: '1' },
    { label: '过去3天', value: '3' },
    { label: '过去7天', value: '7' },
    { label: '过去1个月', value: '30' },
    { label: '自定义日期', value: '0' },
]

const formatTxt = 'YYYY-MM-DD HH:mm:ss'
const currentDay = moment(new Date()).format(formatTxt)
const previousDay = moment(new Date()).subtract(1, 'days').format(formatTxt)
const form = ref({
    device_id: '',
    point_ids: ['1'],
    date_type: '1',
    dateRange: [previousDay, currentDay],
    start_time: previousDay,
    end_time: currentDay
})

const handleDateTypeChange = (days) => {
    if (days == '0') {
        form.value.dateRange = []
        form.value.start_time = ''
        form.value.end_time = ''
    } else {
        form.value.start_time = moment(new Date()).subtract(Number(days), 'days').format(formatTxt)
        form.value.end_time = currentDay
        form.value.dateRange = [form.value.start_time, form.value.end_time]

        if (!form.value.point_ids.length) return
        const params = {
            start_time: form.value.start_time,
            end_time: form.value.end_time,
            point_ids: form.value.point_ids.map((point_id) => Number(point_id))
        }
        handleGetChartsData(params)
    }

}


const handleChangeDate = (value) => {
    form.value.date_type = '0'
    const dateRange = [...form.value.dateRange ]
    form.value.start_time = dateRange[0]
    form.value.end_time = dateRange[1]

    if (form.value.point_ids.length == 0) return
    const params = {
        start_time: form.value.start_time,
        end_time: form.value.end_time,
        point_ids: form.value.point_ids.map((point_id) => Number(point_id))
    }
    handleGetChartsData(params)
}
// 获取水位信息
const chartUnitSymbol = ref([])
const chartSerieName = ref([])
const chartLabel = ref([])
const chartData = ref([])
const handleGetChartsData = (params) => {
    getChartsData(params).then((res) => {
        chartUnitSymbol.value = []
        chartLabel.value = []
        chartData.value = []
        chartSerieName.value = []
        if (!res.data) return
        // res.data为对象时
        if (isObject(res.data)) {
            res.data.values = res.data.values.map((value) => value.toFixed(2))
            chartLabel.value = res.data.times.map((time) => moment(time).format('MM-DD HH:mm'))
            chartUnitSymbol.value.push(res.data.unit_symbol)
            chartSerieName.value.push(res.data.point_name)
            chartData.value.push(res.data.values)
        } else {
            // res.data为数组
            res.data.forEach((data, i) => {
                data.values = data.values.map((value) => value.toFixed(2))
                if (!chartLabel.value.length) {
                    chartLabel.value = data.times.map((time) => moment(time).format('MM-DD HH:mm'))
                }
                chartSerieName.value.push(data.point_name)
                chartUnitSymbol.value.push(data.unit_symbol)
                chartData.value.push(data.values)
            })
        }
        handleChartInit()
    })
}

const chartSerieMap = [{
    name: '',
    type: 'line',
    smooth: true,
    lineStyle: {
        width: 1,
        color: 'rgba(232, 229, 11, 1)'
    },
    showSymbol: false,
    areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
                offset: 0,
                color: 'rgba(232, 229, 11, 0.47)'
            },
            {
                offset: 0.5,
                color: 'rgba(232, 229, 11, 0.2)'
            },
            {
                offset: 1,
                color: 'rgba(232, 229, 11, 0)'
            }
        ])
    },
    data: []
},
{
    name: '',
    type: 'line',
    smooth: true,
    lineStyle: {
        width: 1,
        color: 'rgba(7, 169, 130, 1)'
    },
    showSymbol: false,
    areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
                offset: 0,
                color: 'rgba(7, 169, 130, 0.47)'
            }, {
                offset: 0.5,
                color: 'rgba(136, 214, 195, 0.2)'
            },
            {
                offset: 1,
                color: 'rgba(232, 229, 11, 0)'
            }
        ])
    },
    data: []
},
{
    name: '',
    type: 'line',
    smooth: true,
    lineStyle: {
        width: 1,
        color: 'rgba(182, 6, 135, 1)'
    },
    showSymbol: false,
    areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
                offset: 0,
                color: 'rgba(182, 6, 135, 0.6)'
            },
            {
                offset: 0.5,
                color: 'rgba(182, 6, 135, 0.2)'
            },
            {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)'
            }
        ])
    },
    data: []
}
]


let myChart = null
const handleChartInit = () => {
    if (myChart) { myChart.dispose(); }
    const series = chartData.value.map((data, i) => {
        const serie = Object.assign({}, chartSerieMap[i])
        serie.name = chartSerieName.value[i]
        serie.data = [...data]
        return serie
    })
    const option = {
        color: ['rgba(232, 229, 11, 1)','rgba(7, 169, 130, 1)', 'rgba(182, 6, 135, 1)'],
        grid: {
            top: '5%',
            left: '30',
            right: '4%',
            bottom: '20%',
            show: false
        },
        tooltip: {
            trigger: 'axis',
            formatter(data) {
                const tipArr = data.map((item, i) => {
                    const {marker, seriesName, value}  = item
                   return `${marker} ${seriesName}&nbsp;&nbsp;&nbsp;&nbsp;${value}${chartUnitSymbol.value[i]}`
                })
                return `${data[0].name}<br/>${tipArr.join('<br/>')}`
            }
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                start: 30,
                end: 70,
                minSpan: '10',
                xAxisIndex: [0, 1]
            }],
        xAxis: [{
            type: 'category',
            offset: 10,
            boundaryGap: false,
            axisLabel: {
                show: true,
                formatter(name) {
                    const nameArr = name.split(' ')
                    return `${nameArr[1]}\n${nameArr[0]}`
                },
                fontSize: 12 * props.scale
            },
            axisTick: {
                show: true
            },
            axisLine: {
                onZero: true,
                show: true
            },
            data: [...chartLabel.value]
        }],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    show: true,
                    fontSize: 12 * props.scale
                },
                axisTick: {
                    show: true
                },
                axisLine: {
                    show: true
                },
                splitLine: {
                    show: false
                }
            }
        ],
        series: series
    }
    setTimeout(() => {
        myChart = echarts.init(document.getElementById('historyChart'));
        myChart.setOption(option);
    }, 500)
}
// 刷新图表
const handleReflashChart = () => {
    myChart && myChart.resize();
}

let resizeObserver = null
onMounted(() => {
    handleGetDeviceList()
    handleDateTypeChange(1)

    resizeObserver = new ResizeObserver(handleReflashChart).observe(document.body);
})
onUnmounted(() => {
    resizeObserver && resizeObserver.disconnect()
})
</script>
<style lang="less">
.history-data-warp {
    height: calc(100% - 5.7rem);
    margin: 0.1rem 0;

    .filter-warp {
        display: flex;
        align-items: center;
        margin-top: 0.2rem;
        margin-left: 0.1rem;
    }

    .chart {
        width: 100%;
        height: calc(100% - 0.9rem);
        margin-top: 0.2rem;
    }

    .class-filter-select {
        width: 2rem;
        margin-right: 0.15rem;
    }

    .date-type-filter-select {
        width: 1rem;
        margin-right: 0.15rem;
    }

    .date-range-filter-select {
        width: 2.85rem;
    }

    .ant-select-selector,
    .ant-select {
        border-color: #22A2CC !important;
        height: 0.32rem !important;
        line-height: 0.32rem !important;
        background-color: transparent !important;
    }

    .ant-select-single.ant-select-open .ant-select-selection-item,
    .ant-select-selection-item {
        color: #E0E0E0 !important;
        line-height: 0.32rem !important;
        font-size: 0.12rem;
    }
    .ant-select-single:not(.ant-select-customize-input) .ant-select-selector

    .ant-select:not(.ant-select-customize-input) .ant-select-selector {
        border-color: #22A2CC !important;
        box-shadow: none !important;
        padding: 0 0.1rem;
        height: 0.32rem !important;
    }

    .ant-select-selection-search-input {
        color: #E0E0E0 !important;
        font-size: 0.12rem !important;
        height: 0.32rem !important;
        line-height: 0.32rem !important;
    }

    .ant-select-arrow {
        color: #22A2CC !important;
        font-size: 0.14rem;
        right: 0.11rem;
        width: 0.12rem;
        height: 0.12rem;
        top: 50%;
        transform: translateY(-50%);
        margin-top: 0;
        .anticon {
            display: inline-block;
            width: 0.14rem;
            height: 0.14rem;
        }
    }

    .date-range-filter-select {
        color: #E0E0E0 !important;
        height: 0.32rem;
        line-height: 0.32rem;
    }

    .ant-calendar-range-picker-input {
        color: #E0E0E0 !important;
        font-size: 0.12rem;
        line-height: 0.24rem;
    }

    .ant-calendar-picker-input {
        background-color: transparent !important;
        border-color: #22A2CC !important;
        position: relative;
        padding-left: 0.25rem;
        font-size: 0.12rem;
        line-height: 0.24rem;
    }
    .anticon-close-circle {
        transform: translateY(-50%);
        margin-top: 0;
        display: inline-block;
            width: 0.12rem;
            height: 0.12rem;
        svg {
            display: inline-block;
            width: 0.12rem;
            height: 0.12rem
        }
    }
    .ant-calendar-picker-icon {
        color: #22A2CC !important;
        position: absolute;
        left: 0.1rem;
        width: 0.12rem;
        height: 0.12rem;
        transform: translateY(-50%);
        margin-top: 0;
        svg {
            display: inline-block;
            width: 0.12rem;
            height: 0.12rem
        }
    }

    .ant-calendar-range-picker-separator {
        color: transparent !important;

        &::after {
            content: '至';
            color: #E0E0E0;
            margin-left: -0.15rem;
        }
    }

    .ant-calendar-picker-clear {
        background-color: transparent !important;
        color: #22A2CC !important;
        .anticon {
            display: inline-block;
            width: 0.12rem;
            height: 0.12rem
        }
        .close-circle {
            display: inline-block;
            width: 0.12rem;
            height: 0.12rem
        }
    }

    .ant-select-selection-overflow {
        flex-wrap: nowrap;
        position: absolute;
        top: 0.02rem;
        left: 0.04rem;
    }

    .ant-select-selection-overflow-item {
        height: 0.2rem;
        .ant-select-selection-item {
            background: #165dff;
            border: none;
            border-radius: 0;
            font-size: 0.12rem;
            width: 0.48rem;
            height: 0.2rem;
        }
        .ant-select-selection-item-content {
            line-height: 0.2rem;
        }

        .ant-select-selection-item-remove {
            color: #E0E0E0 !important;
            font-size: 0.14rem;
            > .anticon {
                vertical-align: 0.02rem;
            }
        }
    }

    .ant-select-item-option-content {
        font-size: 0.12rem !important;
    }
    .ant-calendar-date {
        width: 0.24rem;
        height: 0.24rem;
        line-height: 0.22rem;
    }
}
/deep/.ant-select-item {
        min-height: 0.32rem;
        padding: 0.05rem 0.12rem;
        color: #232324;
        font-weight: normal;
        font-size: 0.12rem;
        line-height: 1.1;
    }
</style>
