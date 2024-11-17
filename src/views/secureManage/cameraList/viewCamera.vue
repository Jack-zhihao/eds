<template>
    <a-modal v-model:visible="props.visibleCamera" :centered="true" :closable="false" :footer="null"
        :bodyStyle="{ width: '680px', height: '500px' }" :width="680" class="common-modal">
        <div class="header">
            <p class="title">画面</p>
            <span class="icon-close" @click="handleBack"></span>
        </div>
        <div class="view-camera-content">
            <video class="demo-video" ref="videoRef" id="videoRef" muted autoplay></video>
        </div>

        <div class="camera-tool-warp">
            <a-button class="cancel-btn" type="primary" @click="handleBack">关闭预览</a-button>
        </div>
    </a-modal>
</template>
<script setup>
import { defineEmits, defineProps, ref, onMounted } from 'vue'
import flvjs from 'flv.js'
const props = defineProps({
    visibleCamera: {
        type: Boolean,
        default: false
    },
    camera: {
        type: Object,
        default: () => { }
    }
})
const cameraUrl = ref({
    main_stream: '',
    sub_stream: ''
})
const emit = defineEmits(['update:visible'])
const handleBack = () => {
    emit('update:visible', false)
}

const videoRef = document.getElementById('videoRef')
const player = ref()
const play = () => {
    if (flvjs.isSupported()) {
        player.value = flvjs.createPlayer({
        type: 'flv',
        url: cameraUrl.value.main_stream
      });
      console.log('player', player.value)
      player.value.attachMediaElement(videoRef);
      player.value.load();
      player.value.play();
    } else {
      console.error('不支持FLV.js');
    }
}

onMounted(() => {
    cameraUrl.value.main_stream = props.camera.main_stream
    cameraUrl.value.sub_stream = props.camera.sub_stream
})

</script>
<style lang="less">
.view-camera-content {
    display: flex;
    width: 620px;
    height: 330px;
    padding-bottom: 20px;
    border-bottom: 1px solid #E5E6EB;
    #camera {
        width: 620px;
        height: 330px;
        border: 1px solid #22A2CC;
        border-radius: 6px;
        background-color: #22A2CC;
    }

}
.camera-tool-warp{
        height: 52px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

</style>
