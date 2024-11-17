<template>
    <div class="control-warp">
        <div class="control-left">
            <div class="control-preview">暂无监控信息
            </div>
            <div class="control-chart">
                <!-- 报警统计 -->
                <div class="control-chart-pane control-alarm">
                    <alarm-chart></alarm-chart>
                </div>
                <!-- 水位信息 -->
                <div class="control-chart-pane control-waterLevel">
                    <water-level-chart></water-level-chart>
                </div>
                <!-- 雨量监测 -->
                <div class="control-chart-pane control-rain">
                    <rain-level-chart></rain-level-chart>
                </div>
                <!-- 雨量监测 -->
                <div class="control-chart-pane control-rain">
                    <rain-level-chart2></rain-level-chart2>
                </div>
            </div>
        </div>
        <div class="control-middle">
            <component :is="DevicePane" identifier="M01" :mqttClient="mqttClient"></component>
            <component :is="DevicePane" identifier="M02" :mqttClient="mqttClient"></component>
            <component :is="DevicePane" identifier="M03" :mqttClient="mqttClient"></component>
        </div>
        <div class="control-right">
            <!-- 测缝监测 -->
            <component :is="InfoPane" identifier="M01" :mqttClient="mqttClient"></component>
            <!-- 渗压监测 -->
            <component :is="InfoPane" identifier="M02" :mqttClient="mqttClient"></component>
            <!-- 报警信息 -->
            <component :is="AlarmPane" :mqttClient="mqttClient"></component>
        </div>
    </div>
</template>
<script setup>
import DevicePane from './components/device-pane.vue'
import InfoPane from './components/info-pane.vue'
import AlarmPane from './components/alarm-pane.vue'
import AlarmChart from './components/alarm-chart.vue'
import WaterLevelChart from './components/waterLevel-chart.vue'
import RainLevelChart from './components/rainLevel-chart.vue'
import RainLevelChart2 from './components/rainLevel-chart2.vue'
import { ref, watchEffect, createVNode, onUnmounted, onMounted } from 'vue';
import Mqtt  from '@/utils/mqtt'
const mqttClient = ref(new Mqtt().connect())

const client = ref()
// onMounted(() => {
//     client.value = new Mqtt().connect()
//     client.value.on('connect', () => {
//         console.log('Mqtt链接成功')
//         client.value.subscribe('devices/1')
//     })
//     client.value.on('message', (topic, message) => {
//         const resp = client.value.formatMsg(message)
//         console.log('resp', resp)
//     })
// })
// onUnmounted(() => {
//     client.end()
// })
</script>
<style lang="less">
@import url('@/styles/theme.less');
.control-warp {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 0;
    box-sizing: border-box;

    .control-left {
        width: 50%;
        height: 100%;
        margin-right: 12px;

        .control-preview {
            height: 490px;
            background-color: rgba(0, 0, 0, 0.5);
            background-image: url('@/assets/bg-001.png');
            background-size: 100% 100%;
        }

        .control-chart {
            width: 100%;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-top: 10px;

            .control-alarm,
            .control-waterLevel {
                width: calc(50% - 5px);
                height: 260px;
                margin-bottom: 10px;
            }

            .control-rain {
                width: calc(50% - 5px);
                height: 216px;
                margin-bottom: 10px;
                background-color: @main-bg-color;
            }
        }
    }

    .control-middle {
        width: 25%;
        height: 100%;
        margin-right: 5px
    }

    .control-right {
        width: 25%;
        height: 100%;
        margin-left: 5px;
        margin-right: 4px;
    }

    // pane公共title样式
    .control-device-pane,
    .control-info-pane {
        padding: 20px;
        border-radius: 6px;
    }

    .pane-title {
        font-size: 14px;
        line-height: 1;

    }

    .control-device-pane {
        .device-title {
        }
    }
    .chart-warp {
        width: 100%;
        height: 100%;
        padding: 16px 16px 0;
        border-radius: 6px;
        box-sizing: border-box;
        background-color: @main-bg-color;
        display: flex;
        flex-direction: column;
    }

}
</style>
