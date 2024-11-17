<template>
    <div class="control-info-pane" :style="{height: props.identifier == 'M01'? '250px' : '358px'}">
        <p class="pane-title">{{Title}}</p>
        <a-table :columns="columns" class="header-table" :bordered="false" :pagination="false" />
        <div class="info-scroll-warp">
            <Vue3SeamlessScroll :list="data" class="scroll-table" :limitScrollNum="5" :hover="true" :step="singleHeight" :singleHeight="singleHeight" :singleWaitTime="4000" >
                <a-table :columns="columns" :loading="tableToading" :showHeader="false" :bordered="false" :dataSource="data" :pagination="false"
                    size="small" :rowKey="(record, i) => String(record.modulus + i)" :rowClassName="rowClassName">
                </a-table>
            </Vue3SeamlessScroll>
        </div>
    </div>
</template>
<script setup>
import ControlNormalSvg from '@/assets/svg/control-normal.svg'
import ControlWarnSvg from '@/assets/svg/control-warn.svg'
import ControlAlarmSvg from '@/assets/svg/control-alarm.svg'
import { ref, watchEffect, createVNode, defineProps, onMounted, onUnmounted, computed } from 'vue';
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import {flattenArray} from '@/utils'
import Mqtt from '@/utils/mqtt'
import moment from 'moment'
const props = defineProps({
    mqttClient: {
        type: Object,
        default: null
    },
    // 目前传入值只有M01，M02
    identifier: {
        type: String,
        default: ''
    }
})

const singleHeight = 36.78

const subscribeMap = ref({
    'M01': {
        title: '测缝监测',
        toPic: ['devices/125']
    },
    'M02': {
        title: '渗压监测',
        toPic: ['devices/123', 'devices/124']
    }
})

const Title = computed(() => subscribeMap.value[props.identifier].title)


const columns = [{
    title: '名称',
    dataIndex: 'point_name',
    width: 60
}, {
    title: '采集时间',
    dataIndex: 'created_at',
    customRender: ({record}) => {
        return moment(record.created_at).format('MM-DD HH:mm')
    },
    width: 60
}, {
    title: '实时状态',
    dataIndex: 'status',
    customRender: ({record}) => {
        const statusObj = {
           0: () => createVNode('img', { src: ControlNormalSvg }),
           1: () => createVNode('img', { src: ControlWarnSvg }),
        }
        return statusObj[record.status] && statusObj[record.status]()
    },
    width: 60
}, {
    title: '模数(F)',
    dataIndex: 'modulus',
    width: 60
}, {
    title: '温度(℃)',
    dataIndex: 'temperature',
    width: 60
}, {
    title:  subscribeMap.value[props.identifier] === 'M01' ? '位移(mm)': '压力(Kpa)',
    dataIndex: 'result_value',
    width: 60,
    customRender: ({record}) => {
        return record.result_value.toFixed(2)
    }
}];

const rowClassName = (record) => {
    const statusObjClass = {
        '正常': 'normal-row',
        '异常': 'warn-row',
        '告警': 'alarm-row'
    }
    return statusObjClass[record.status]
}

const tableToading = ref(false)
const data = ref()
let timer = null
// 处理mqtt-message，添加节流限制
const handleRanderTable = () => {
    if (!timer) {
        timer = setTimeout(() => {
            const msgList = Object.values(MqttMsg.value).map((list) => list)
            data.value = flattenArray(msgList)
            tableToading.value = false
            timer = null
        }, 300)
    }
}

// 开始使用父组件传入mqtt客户端进行订阅|发布
const MqttMsg = ref({})
const handleDealMqttClient = () => {
    const curToPic = subscribeMap.value[props.identifier].toPic
    props.mqttClient.subscribe(curToPic)
    props.mqttClient.on('message', (topic, message) => {
        if (curToPic.includes(topic)) {
            MqttMsg.value[topic] = props.mqttClient.formatMsg(message)
            handleRanderTable()
        }
    })
}

onMounted(() => {
    tableToading.value = true
    handleDealMqttClient()
})
onUnmounted(() => {
    props.mqttClient && props.mqttClient.end()
})
</script>
<style lang="less">
@import url('@/styles/theme.less');
.control-info-pane {
    width: 100%;
    height: 320px;
    margin-bottom: 10px;
    background-color: @main-bg-color;
    display: flex;
    flex-direction: column;

    .pane-title {
        flex-shrink: 0;
        color: @main-text-color;
    }

    .header-table {
        .ant-table-placeholder {
            display: none;
        }

        th {
            font-size: 12px;
            padding: 10px 0;
            border: none;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.02);
        }
    }

    .info-scroll-warp {
        width: 100%;
        height: 100%;
        overflow: hidden;

        .scroll-table {
            .warn-row {
                background-color: rgba(254, 250, 238, 1);
            }

            .alarm-row {
                background-color: rgba(237, 34, 34, 0.05);
            }

            td {
                font-size: 12px;
                padding: 4px 0 !important;
                border: none;
                text-align: center;
                line-height: 1.2;
            }
        }
    }
}
</style>
