<template>
    <div class="big-screen-warp">
        <screenHead :message89="mqttMsgObj['devices/89']"></screenHead>
        <div class="big-screen-content-warp">
            <div class="big-screen-left-warp">
                <sceneMenu @update:menu="handleUpdateToPic"></sceneMenu>
                <waterLevel :scale="windowSize.scale" :message90="mqttMsgObj['devices/90']" :message84="mqttMsgObj['devices/84']"></waterLevel>
            </div>
            <div class="big-screen-center-warp">
                <realTimeData :mqttMsgObj="mqttMsgObj" :sceneObj="sceneObj"></realTimeData>
                <historyData :scale="windowSize.scale" ref="historyDataRef"></historyData>
            </div>
            <div class="big-screen-right-warp">
                <alarmList></alarmList>
                <creviceTest :message125="mqttMsgObj['devices/125']" :scale="windowSize.scale"></creviceTest>
                <pressureTest :message123="mqttMsgObj['devices/123']" :message124="mqttMsgObj['devices/124']" :scale="windowSize.scale"></pressureTest>
            </div>
        </div>
    </div>
</template>
<script setup>
import screenHead from './components/screenHead.vue';
import sceneMenu from './components/sceneMenu.vue';
import waterLevel from './components/waterLevel.vue';
import realTimeData from './components/realTimeData.vue';
import historyData from './components/historyData.vue';
import alarmList from './components/alarmList.vue';
import creviceTest from './components/creviceTest.vue';
import pressureTest from './components/pressureTest.vue';
import Mqtt from '@/utils/mqtt'
import { onMounted, onUnmounted, ref, defineEmits, provide  } from 'vue';
import { getScene } from '@/api/scenesManage'
import {message} from 'ant-design-vue'
import { toPicMap } from './toPicMap'
// Mqtt订阅规则,以tpPic为key保存数据
const commonToPics = ref(['devices/123','devices/124','devices/125', 'devices/89', 'devices/90', 'devices/84'])
const mqttMsgObj = ref({})
const mqttClient =  new Mqtt().connect()

// 当前场景id | 所需points订阅
const sceneObj = ref({})
const curToPics = ref([])
const handleUpdateToPic = (scene) => {
    sceneObj.value = scene
    if (curToPics.value.length) {
       // 取消之前订阅
       curToPics.value.forEach((toPic) => {
            mqttClient.unsubscribe(toPic)
            delete mqttMsgObj[toPic]
       })
    }

    setTimeout(() => {
        curToPics.value = Object.values(toPicMap).map((item) => item[sceneObj.value.id].split(':')[0])
        mqttClient.subscribe([...curToPics.value])
    }, 500)
}

let resizeObserver = null
const windowSize = ref({
    width: 1920,
    height: 1080,
    scale: 1
})
const handleListenWindowSize = (entries) => {
    const { width, height } = entries[0].contentRect
    const width_scale = width / windowSize.value.width
    const height_scale = height / windowSize.value.height
    windowSize.value.scale = width_scale > height_scale ? height_scale : width_scale
    document.documentElement.style.fontSize = (100 * windowSize.value.scale) + 'px'
}

onMounted(() => {
    mqttClient.on('message', (toPic, msg) => {
        mqttMsgObj.value[toPic] = mqttClient.formatMsg(msg)
    })

    mqttClient.on('connect', () => {
        console.log('Mqtt connected success!')
        // 发起订阅
        commonToPics.value.forEach((toPic) => mqttClient.subscribe(toPic))
    })

    // 给html标签100px用于rem单位计算
    document.documentElement.style.fontSize = '100px'
    resizeObserver = new ResizeObserver(handleListenWindowSize).observe(document.body)

})
onUnmounted(() => {
    mqttClient && mqttClient.end()
    resizeObserver && resizeObserver.disconnect()
    document.documentElement.style.fontSize = 'inherit'
})


</script>
<style lang="less">
.big-screen-warp {
    background-color: #060931;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    .big-screen-content-warp {
        height: calc(100% - 0.8rem);
        display: flex;
        .big-screen-left-warp {
            height: 100%;
            width: 4.1rem;
            display: flex;
            flex-direction: column;
            margin-left: 10px;
        }
        .big-screen-right-warp {
            height: 100%;
            width: 4.1rem;
            display: flex;
            flex-direction: column;
            margin-right: 0.1rem;
        }
        .big-screen-center-warp {
            height: 100%;
            width: calc(100% - 8.4rem);
            margin: 0 0.1rem;
            display: flex;
            flex-direction: column;
        }
    }
    .pane-warp {
        color: #E0E0E0;
        flex-shrink: 0;
        border-radius: 0.06rem;
        padding: 0.2rem;
        box-sizing: border-box;
        box-sizing: border-box;
        border: 1px solid #22A2CC;
        box-shadow: inset -10px -10px 20px -10px rgba(17, 48, 244, 0.3),inset 10px 10px 20px -10px rgba(17, 48, 244, 0.3);
    }
    .pane-title {
        color: #E0E0E0;
        font-size: 0.18rem;
        line-height: 1;
        margin-left: 0.1rem;
    }
}
</style>
