<template>
    <div class="control-device-pane">
        <p class="pane-title">{{ name }}</p>
        <div class="device-pane device-run-time">
            <div class="device-title">运行时间</div>
            <div class="device-detail">
                <div class="detail">
                    <span>累计</span>
                    <div>
                        <span class="result">{{ timer.total }}</span>
                        <span class="unit">hr</span>
                    </div>
                </div>
                <div class="detail">
                    <span>单次</span>
                    <div>
                        <span class="result">{{ timer.single }}</span>
                        <span class="unit">hr</span>
                    </div>
                </div>
                <div class="detail">
                    <span>单次停止</span>
                    <div>
                        <span class="result">{{ timer.stop }}</span>
                        <span class="unit">hr</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="device-pane device-voltage-time">
            <div class="device-title">励磁配电</div>
            <div class="device-detail">
                <div class="detail">
                    <span>电压</span>
                    <div>
                        <span class="result">{{ excitationVoltage }}</span>
                        <span class="unit">V</span>
                    </div>
                </div>
                <div class="detail">
                    <span>电流</span>
                    <div>
                        <span class="result">{{ excitationCurrent }}</span>
                        <span class="unit">A</span>
                    </div>
                </div>
                <!-- <div class="detail">
                    <span>电流</span>
                    <div>
                        <span class="result">75</span>
                        <span class="unit">A</span>
                    </div>
                </div> -->
            </div>
        </div>
        <div class="device-pane device-height-voltage-time">
            <div class="device-title">高压配电</div>
            <div class="device-detail">
                <div class="detail">
                    <span>电压</span>
                    <div>
                        <span class="result">{{ softStarter.voltage }}</span>
                        <span class="unit">V</span>
                    </div>
                </div>
                <div class="detail">
                    <span>A相电流</span>
                    <div>
                        <span class="result">{{ softStarter.PACurrent }}</span>
                        <span class="unit">A</span>
                    </div>
                </div>
                <div class="detail">
                    <span>B相电流</span>
                    <div>
                        <span class="result">{{ softStarter.PBCurrent }}</span>
                        <span class="unit">A</span>
                    </div>
                </div>
                <div class="detail">
                    <span>C相电流</span>
                    <div>
                        <span class="result">{{ softStarter.PCCurrent }}</span>
                        <span class="unit">A</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, ref, onMounted, onUnmounted, defineProps } from 'vue'
const props = defineProps({
    identifier: String,
    mqttClient: {
        type: Object,
        default: null
    }
})
const timer = ref({
    'single': 0,
    'total': 0,
    'stop': 0,
})

const name = computed(()=>{
    switch (props.identifier){
        case "M01":
            return "1号机组"
        case "M02":
            return "2号机组"
        case "M03":
            return "3号机组"
    }
})
const excitationVoltage = ref(0)
const excitationCurrent = ref(0)
const softStarter = ref({
    'voltage':0,
    'PACurrent':0,
    'PBCurrent':0,
    'PCCurrent':0,
})
const subscribeMap = {
    'M01': [
        { device: 'excitationVoltage', topic: 'devices/5' },
        { device: 'excitationCurrent', topic: 'devices/6' },
        { device: 'timer', topic: 'devices/10' },
        { device: 'softStarter', topic: 'devices/101' },
    ],
    'M02': [
        { device: 'excitationVoltage', topic: 'devices/16' },
        { device: 'excitationCurrent', topic: 'devices/17' },
        { device: 'timer', topic: 'devices/21' },
        { device: 'softStarter', topic: 'devices/102' },
    ],
    'M03': [
        { device: 'excitationVoltage', topic: 'devices/27' },
        { device: 'excitationCurrent', topic: 'devices/28' },
        { device: 'timer', topic: 'devices/32' },
        { device: 'softStarter', topic: 'devices/103' },
    ],
}
const topics = ref([])

onMounted(() => {
    const mqttClient = props.mqttClient
    topics.value = subscribeMap[props.identifier].map(item => item.topic)
    mqttClient && mqttClient.subscribe(topics.value)
    mqttClient && mqttClient.on('message', (topic, message) => {
        if (topics.value.includes(topic)) {
            const payload = JSON.parse(message.toString())
            const result = subscribeMap[props.identifier].find(item => item.topic === topic)
            if (result.device === 'excitationVoltage') {
                excitationVoltage.value = payload.points[0].value
                return
            }
            if (result.device === 'excitationCurrent') {
                excitationCurrent.value = payload.points[0].value
                return
            }
            if (result.device === 'timer') {
                const pointSingleRuntime = payload.points.find(item => item.point_name === '单次运行时间')
                const pointStopRuntime = payload.points.find(item => item.point_name === '单次停止时间')
                const pointTotalRuntime = payload.points.find(item => item.point_name === '累计运行时间')
                timer.value.single = pointSingleRuntime.value
                timer.value.stop = pointStopRuntime.value
                timer.value.total = pointTotalRuntime.value
                return
            }

            if (result.device === 'softStarter') {
                const pointVoltage = payload.points.find(item => item.point_name === '电压U')
                const pointPACurrent = payload.points.find(item => item.point_name === 'A相电流')
                const pointPBCurrent = payload.points.find(item => item.point_name === 'B相电流')
                const pointPCCurrent = payload.points.find(item => item.point_name === 'C相电流')
                softStarter.value.voltage = pointVoltage.value
                softStarter.value.PACurrent = pointPACurrent.value
                softStarter.value.PBCurrent = pointPBCurrent.value
                softStarter.value.PCCurrent = pointPCCurrent.value
                return
            }
        }

    })
})

onUnmounted(() => {
    props.mqttClient && props.mqttClient.end()
})

</script>
<style lang="less">
@import url('@/styles/theme.less');
.control-device-pane {
    width: 100%;
    height: 322px;
    margin-bottom: 10px;
    background-color: @main-bg-color;

    > .device-pane {
        height: 80px;
        border-radius: 6px;
        margin-bottom: 10px;

        &:last-of-type {
            margin: 0;
        }

        display: flex;

        .device-title {
            width: 100px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: @main-text-color;
        }

        .device-detail {
            width: 100%;
            display: flex;
            justify-content: flex-start;
            margin: 0 5% 0 1%;

            .detail {
                width: 33.3%;
                flex-direction: column;
                justify-content: center;
                display: flex;

                > span {
                    font-size: 10px;
                    color: @main-text-color;
                }

                .result {
                    font-size: 20px;
                }

                .unit {
                    font-size: 10px;
                    color: @main-text-color;
                    margin-left: 6px
                }
            }
        }

    }

    .device-run-time {
        background: linear-gradient(180deg, @linear-gradient-color1 0%, @linear-gradient-color2 100%);

        .result {
            color: #72A7FF
        }
    }

    .device-voltage-time {
        background: linear-gradient(180deg, @linear-gradient-color3 0%, @linear-gradient-color4 100%);

        .result {
            color: #30BC46
        }
    }

    .device-height-voltage-time {
        background: linear-gradient(180deg, @linear-gradient-color5 0%, @linear-gradient-color6 100%);

        .result {
            color: #8D4EDA
        }
    }
}
</style>
