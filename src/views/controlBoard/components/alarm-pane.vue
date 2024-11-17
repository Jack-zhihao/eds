<template>
    <div class="control-info-pane" :style="{height: props.identifier == 'M01'? '250px' : '358px'}">
        <p class="pane-title">报警信息</p>
        <a-table :columns="columns" class="header-table" :bordered="false" :pagination="false" />
        <div class="info-scroll-warp">
            <Vue3SeamlessScroll :list="data" class="scroll-table" :limitScrollNum="7" :hover="true" :step="singleHeight" :singleHeight="singleHeight" :singleWaitTime="4000" >
                <a-table :columns="columns" :loading="tableToading" :showHeader="false" :bordered="false" :dataSource="data" :pagination="false"
                    size="small" :rowKey="(record) => record.index" :rowClassName="rowClassName">
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
    }
})

const singleHeight = 36.78



const columns = [{
    title: '序号',
    dataIndex: 'index',
    width: 60
}, {
    title: '采集时间',
    dataIndex: 'created_at',
    customRender: ({record}) => {
        return moment(record.created_at).format('MM-DD HH:mm:ss')
    },
    width: 60
}, {
    title: '发生设备',
    dataIndex: 'title',
    width: 60
}, {
    title: '当前值',
    dataIndex: 'curValue',
    width: 60
}, {
    title: '上限',
    dataIndex: 'max',
    width: 60
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
const data = ref([
    {
        index: 1,
        title: '一号机组上轴瓦温度1报警',
        created_at: '2024-06-26 14:24:02',
        curValue: 56,
        max: 40
    },
    {
        index: 2,
        title: '一号机组上轴瓦温度1报警',
        time: '2024-06-26 14:24:02',
        curValue: 56,
        max: 40
    },
    {
        index: 3,
        title: '一号机组上轴瓦温度1报警',
        time: '2024-06-26 14:24:02',
        curValue: 38,
        max: 40
    },
    {
        index: 4,
        title: '一号机组上轴瓦温度1报警',
        time: '2024-06-26 14:24:02',
        curValue: 56,
        max: 40
    },
    {
        index: 5,
        title: '一号机组上轴瓦温度1报警',
        time: '2024-06-26 14:24:02',
        curValue: 56,
        max: 40
    },
    {
        index: 6,
        title: '一号机组上轴瓦温度1报警',
        time: '2024-06-26 14:24:02',
        curValue: 56,
        max: 40
    },
    {
        index: 7,
        title: '一号机组上轴瓦温度1报警',
        time: '2024-06-26 14:24:02',
        curValue: 38,
        max: 40
    },{
        index: 8,
        title: '一号机组上轴瓦温度1报警',
        time: '2024-06-26 14:24:02',
        curValue: 38,
        max: 40
    },

])
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
    // tableToading.value = true
    // handleDealMqttClient()
})
onUnmounted(() => {
    // props.mqttClient && props.mqttClient.end()
})
</script>
<style lang="less">
@import url('@/styles/theme.less');
.control-info-pane {
    width: 100%;
    height: 320px;
    margin-bottom: 10px;
    background-color:  @main-bg-color;
    display: flex;
    flex-direction: column;

    .pane-title {
        flex-shrink: 0;
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
