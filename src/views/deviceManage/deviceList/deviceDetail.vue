<template>
    <div class="device-detail-warp common-warp">
        <div class="device-info-warp">
            <p class="title">设备详情</p>
            <div class="device-content">
                <div class="device-info">
                    <div class="img-url">
                        <img :src="device.img_url" alt="暂无图片" style="height: 100%;width: auto;line-height: 80px;">
                    </div>
                    <div class="base-info">
                        <p class="info-title">基本信息</p>
                        <div class="device-name">{{device.device_name}}</div>
                        <div class="device-code">00025001255440001</div>
                        <div class="device-ul">
                            <div class="device-li">
                                <span class="label">所属组织</span>
                                <span class="value">{{device.organization_name}}</span>
                            </div>
                            <div class="device-li">
                                <span class="label">串口服务器IP</span>
                                <span class="value">{{device.modbus_host}}</span>
                            </div>
                            <div class="device-li">
                                <span class="label">设备地址</span>
                                <span class="value">{{device.address}}</span>
                            </div>
                            <div class="device-li">
                                <span class="label">经纬度</span>
                                <span class="value">{{device.geo_location}}</span>
                            </div>
                            <div class="device-li">
                                <span class="label">设备描述</span>
                                <span class="value">{{device.description}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="device-address">
                    <Amap v-if="device.geo_location" :lnglat="formatLnglat(device.geo_location)" />
                </div>
            </div>
        </div>
        <div class="data-point-warp">
            <div class="title">设备数据点</div>
            <a-table :dataSource="pointDataSource" :columns="pointDataColumns" :pagination="false" :rowKey="(record) => String(record.id)"  class="common-table deviceListTable" :rowClassName="() => 'common-table-row'">
                <template #operation="{record}">
                    <a @click="handleViewHistory(record)">历史数据</a>&nbsp;
                    <a @click="handleTrigger(record)">触发器</a>&nbsp;
                </template>
            </a-table>
        </div>
        <ViewTriger v-if="visibleTrigger" :visibleTrigger="visibleTrigger" :dataPoint="dataPoint" @update:visible="handleModalCallback"  />
        <HistoryData v-if="visibleHistory" :visibleHistory="visibleHistory" :dataPoint="dataPoint" @update:visible="handleModalCallback"  />
        <div class="common-tool-warp">
            <a-button class="cancel-btn" type="default" @click="handleBackList">返回列表</a-button>
        </div>
    </div>
</template>
<script setup>
import {onMounted, ref} from 'vue'
import Amap from './amap.vue'
import { getDeviceDetail } from '@/api/deviceManage'
import { useRoute, useRouter } from 'vue-router'
import { formatLnglat } from '@/utils'
import ViewTriger from './viewTrigger.vue'
import HistoryData from './historyData.vue'

 const route = useRoute()
 const router = useRouter()

 const device = ref({})

// 数据点table
const pointDataSource = ref([])
const pointDataColumns = [{
        title: 'ID',
        dataIndex: 'id',
        align: 'center'
    },
    {
        title: '数据点名称',
        dataIndex: 'point_name',
        align: 'center'
    },
    {
        title: '功能码',
        dataIndex: 'function_code',
        align: 'center'
    },
    {
        title: '寄存器地址',
        dataIndex: 'modbus_host',
        align: 'center'
    },
    {
        title: '数据类型',
        dataIndex: 'data_type',
        align: 'center',
        width: 80
    },
    {
        title: '字节序',
        dataIndex: 'byte_order',
        align: 'center'
    },
    {
        title: '单位符号',
        dataIndex: 'unit_symbol',
        align: 'center'
    },

    {
        title: '数据保存频率',
        dataIndex: 'storage_strategy_text',
        align: 'center',
    },
    {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        align: 'center',
        slots: { customRender: 'operation' }
    }]

const visibleHistory = ref(false)
const handleViewHistory = (record) => {
    visibleHistory.value = true
    dataPoint.value = {...record, organization_id: device.value.organization_id}
}

const visibleTrigger = ref(false)
const dataPoint = ref({})
const handleTrigger = (record) => {
    visibleTrigger.value = true
    dataPoint.value = {...record}
}

const handleModalCallback = (flag) => {
    visibleTrigger.value = flag
    visibleHistory.value = flag
    dataPoint.value = {}
}

const time_unit_map = {minutes: '分钟', hours: '小时', days: '天'}
const handleGetDeviceDetail = () => {
    const id = route.query.id
    getDeviceDetail({id}).then((res) => {
        console.log(res)
        device.value = res.data
        pointDataSource.value = res.data.points.map((item) => {
            const {frequency, time_unit} = item.storage_strategy || {}
            item.storage_strategy_text = time_unit ? `间隔${frequency}${time_unit_map[time_unit]}` : ''
            return item
        })
    })
}

const handleBackList = () => {
    router.push({name: 'deviceList'})
}


onMounted(() => {
    handleGetDeviceDetail()
})

</script>
<style lang="less">
@import url('@/styles/theme.less');
.device-detail-warp {
    background-color: transparent !important;
    padding: 0 !important;
    .device-info-warp {
        height: 340px;
        background-color: @main-bg-color;
        padding: 20px;
        box-sizing: border-box;
    }
    .device-content {
        display: flex;
        .device-info {
            width: 560px;
            height: 240px;
            margin-right: 20px;
            display: flex;
            padding: 20px 10px;
            box-sizing: border-box;
            border: 1px solid @hover-bg-color;
            line-height: 1;
            .img-url {
                width: 145px;
                height: 85px;
                background-color:  @sub-bg-color;;
                flex-shrink: 0;
                display: flex;
                justify-content: center;
            }
            .base-info {
                width: 100%;
                margin-left: 40px;
                .info-title {
                    font-size: 12px;
                    color: @main-text-color;
                    font-weight: 600;
                    margin-bottom: 12px;
                }
                .device-name {
                    font-size: 14px;
                    color: @main-text-color;
                    font-weight: 600;
                    margin-bottom: 12px;
                    line-height: 1.5;
                }
                .device-code {
                    color: @text-gray-color;
                    padding-bottom: 12px;
                    border-bottom: 1px solid @hover-bg-color;
                }
                .device-ul {
                    .device-li {
                        display: flex;
                        margin-top: 12px;
                        line-height: 1;
                        .label {
                            display: block;
                            width: 72px;
                            flex-shrink: 0;
                            color: @main-text-color;;
                        }
                        .value {
                            width: 100%;
                            margin-left: 30px;
                            color: rgba(130, 130, 130, 1);
                        }
                    }
                }
            }
        }
        .device-address {
            width: 560px;
            height: 240px;
            background-color:  @sub-bg-color;;
        }
    }

    .data-point-warp {
        background-color:  @main-bg-color;
        padding: 20px 20px 0;
        box-sizing: border-box;
        margin-top: 20px;
        .data-point-tool {
            margin-bottom: 20px;
        }
    }
}
</style>
