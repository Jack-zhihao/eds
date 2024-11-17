<template>
    <a-modal v-model:visible="props.visibleHistory" :centered="true" :closable="false" :footer="null"
        :bodyStyle="{ width: '900px', height: '500px' }" :width="900" class="common-modal">
        <div class="header">
            <p class="title">历史数据</p>
            <span class="icon-close" @click="handleBack"></span>
        </div>
        <div class="search-form history-search">
            <div class="search-form-row">
                <div class="search-form-item">
                    <span class="label">设备名称：</span>
                    <a-select v-model:value="searchForm.device_id" @change="handleChangeDevice">
                        <a-select-option v-for="device in deviceList" :value="String(device.id)" :key="device.id">{{ device.device_name }}</a-select-option>
                    </a-select>
                </div>
                <div class="search-form-item">
                    <span class="label" >数据点：</span>
                    <a-select v-model:value="searchForm.point_id">
                        <a-select-option v-for="point in pointList" :value="String(point.id)" :key="point.id">{{ point.point_name }}</a-select-option>
                    </a-select>
                </div>
                <div class="search-form-item">
                    <span class="label" >日期区间：</span>
                    <a-range-picker v-model:value="dateRange" valueFormat="YYYY-MM-DD" :disabledDate="(current) => current && current > moment().endOf('day')" @change="handleDateRange" />
                </div>
                <div class="search-form-tool">
                    <a-button type="primary" @click.prevent="handleSearch"><template #icon><SearchOutlined /></template>查询</a-button>
                </div>
            </div>
        </div>
        <a-table :dataSource="dataSource" :columns="columns" :loading="tableToading" :pagination="false" :rowKey="(record, index) => record.key"  class="common-table" :rowClassName="() => 'common-table-row'" :scroll="{y: 310}">
         </a-table>
    </a-modal>
</template>
<script setup>
import { defineProps, defineEmits, onMounted, ref } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { getDeviceList, getPointsList } from '@/api/deviceManage'
import { getChartsData } from '@/api/chartApi'
import moment from 'moment'
const props = defineProps({
    visibleHistory: {
        type: Boolean,
        default: false
    },
    dataPoint: {
        type: Object,
        default: () => ({})
    }
})
const formatTxt = 'YYYY-MM-DD'
const searchForm = ref({
    device_id: '',
    point_id: '',
    start_time: moment().subtract(Number(7), 'days').format(formatTxt),
    end_time: moment().format(formatTxt)
})

// 日期区间数据处理
const dateRange = ref([searchForm.value.start_time, searchForm.value.end_time])
const handleDateRange = (range) => {
    searchForm.value.start_time = range[0] || ''
    searchForm.value.end_time = range[1] || ''
}


const emit = defineEmits(['update:visible'])
const handleBack = () => {
    emit('update:visible', false)
}
// 设备change回调，清除当前数据点
const handleChangeDevice = (device_id) => {
    searchForm.value.point_id = ''
    pointList.value = []
    handleGetPointList(device_id)
}

// 请求当前组织下的设备列表
const deviceList = ref([])
const handleGetDeviceList = () => {
    getDeviceList({organization_id: props.dataPoint.organization_id, page: 0}).then((res) => {
        deviceList.value = res.data
    })
}

// 请求当前设备下的数据点列表
const pointList = ref([])
const handleGetPointList = (device_id) => {
    getPointsList({device_id: device_id || props.dataPoint.device_id}).then((res) => {
        pointList.value = res.data
    })
}

const handleSearch = () => {
    const params = {
        point_ids: [searchForm.value.point_id],
        start_time: searchForm.value.start_time,
        end_time: searchForm.value.end_time
    }
    console.log('params', params)

    if (!searchForm.value.point_id) {
        message.warn('请选择数据点进行搜索')
        return
    }
    if (!params.start_time || !params.end_time) {
        message.warn('请选择日期进行搜索')
        return
    }
    tableToading.value = true
    getChartsData(params).then((res) => {
        dataSource.value = res.data.times.map((time, i) => {
            return {
                key: String(i),
                point_name: res.data.point_name,
                time: time,
                value: `${res.data.values[i]} ${res.data.unit_symbol}`
            }
        })
    }).finally(() => {

            tableToading.value = false
    })
}

// 列表数据
const columns = ref([
    {
        title: '数据点名称',
        dataIndex: 'point_name',
        align: 'center',
        width: 200
    },
    {
        title: '时间节点',
        dataIndex: 'time',
        align: 'center',
        width: 240
    },
    {
        title: '数据',
        dataIndex: 'value',
        align: 'center',
    },
])
const dataSource = ref([])
const tableToading = ref(false)

onMounted(() => {
    searchForm.value = Object.assign(searchForm.value, {
        device_id: String(props.dataPoint.device_id),
        point_id: String(props.dataPoint.id),
    })
    handleGetDeviceList()
    handleGetPointList()
    handleSearch()
})

</script>
<style lang="less">
.history-search {
    border: none;
    .search-form-item {
        margin-right: 10px;
    }
}
</style>
