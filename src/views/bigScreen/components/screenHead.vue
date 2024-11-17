<><template>
    <div class="big-screen-head">
        <div class="date-warp">
            <p class="time">{{dateTimeObj.timeText}}</p>
            <p class="date">{{dateTimeObj.dateText}} {{dateTimeObj.weekText}}</p>
        </div>
        <div class="center-warp">
            <span class="tag" :style="{backgroundImage: `url(${screenLTagSvg})`}">系统总览</span>
            <span class="title">电排站组态数据大屏</span>
            <span class="tag" :style="{backgroundImage: `url(${screenRTagSvg})`}">数据监控</span>
        </div>
        <div class="weather-warp">
            <span class="addr">{{weather.name}}</span>&nbsp;&nbsp;
            <span class="rain">{{weather.text}}</span>&nbsp;&nbsp;
            <span class="addr">{{weather.temperature}}℃</span>&nbsp;&nbsp;
            <span class="addr">小时降雨量 {{mmText}}</span>
        </div>
    </div>
</template>
<script setup>
import screenLTagSvg from '@/assets/svg/screen-head-l-tag.svg'
import screenRTagSvg from '@/assets/svg/screen-head-r-tag.svg'
import {ref, defineProps, watch, onMounted} from 'vue'
import axios from 'axios'
import moment from 'moment'

const props = defineProps({
    message89: {
        type: [Array, Object],
        default: () => []
    }
})
const mmText = ref('')
watch([() => props.message89], () => {
    props.message89.points.forEach((point) => {
        if (point.point_id == '295') {
            mmText.value = `${point.value}${point.unit_symbol}`
        }
    })
})

// 请求天气预报
const weather = ref({})
const key = import.meta.env.VITE_WEATHER_KEY
const weather_url = `https://api.seniverse.com/v3/weather/now.json?key=${key}&location=guangzhou&language=zh-Hans&unit=c`
axios.get(weather_url).then((res) => {
    if (res.status != 200) {
        // todo
        return
    }
    const data = res.data.results[0] || {};
    weather.value = {...data.location, ...data.now}
})

const dateTimeObj = ref({
    dateText: '--',
    timeText: '--',
    weekText: '--',
})
const weekMap = {
    0: '日',
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六'
}
const handleDateTime = () => {
    const _ = new Date()

    dateTimeObj.value.dateText = moment(_).format('YYYY-MM-DD')
    dateTimeObj.value.timeText = moment(_).format('HH:mm:ss')
    dateTimeObj.value.weekText = '星期' + weekMap[moment(_).day()]
}

onMounted(() => {
    setInterval(handleDateTime, 1000)
})
</script>
<style lang="less">
.big-screen-head {
    height: 0.7rem;
    background: #060931;
    box-shadow: inset -10px -10px 20px -10px rgba(17, 48, 244, 0.3),inset 10px 10px 20px -10px rgba(17, 48, 244, 0.3);
    flex-shrink: 0;
    margin-bottom: 0.1rem;
    position: relative;
    color: #E0E0E0;
    line-height: 1;
    .date-warp {
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: 0.2rem;
        .time {
            font-size: 0.24rem;
            margin-bottom: 0.06rem;
        }
        .date {
            font-size: 0.12rem;
            margin: 0px;
        }
    }
    .center-warp {
        height: 100%;
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        display: flex;
        align-items: center;

        .title {
            font-size: 0.3rem;
            margin: 0 0.65rem;
            width: 2.7rem;
        }
        .tag {
            display: inline-flex;
            width: 1rem;
            height: 0.32rem;
            align-items: center;
            justify-content: center;
            font-size: 0.14rem;
            background-size: 100% 100%;
        }
    }
    .weather-warp {
        max-width: 3.2rem;
        width: auto;
        height: 100%;
        position: absolute;
        right: 0.2rem;
        top: 0;
        font-size: 0.18rem;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        overflow: hidden;
    }
}
</style>
