<template>
    <div class="real-time-data-warp pane-warp">
        <div class="pane-title">组态数据</div>
        <div class="real-time-data-content">
            <p class="scene-name">{{props.sceneObj.scene_name || '--' }}</p>
            <div class="point-info-warp">
                <div class="point-info">
                    <p class="point-title">定绕组温度</p>
                    <div class="point-data">
                        <span class="value" :class="form.dtxwd1 > ratedTemp ? 'red' : 'green' ">{{ form.drzwd1 }}</span>
                        <span class="value" :class="form.drzwd2 > ratedTemp ? 'red' : 'green' ">{{ form.drzwd2 }}</span>
                        <span class="value" :class="form.drzwd3 > ratedTemp ? 'red' : 'green' ">{{ form.drzwd3 }}</span>
                    </div>
                </div>
                <div class="point-info">
                    <p class="point-title">定铁芯温度</p>
                    <div class="point-data">
                        <span class="value" :class="form.dtxwd1 > ratedTemp ? 'red' : 'green' ">{{ form.dtxwd1 }}</span>
                        <span class="value" :class="form.dtxwd2 > ratedTemp ? 'red' : 'green' ">{{ form.dtxwd2 }}</span>
                        <span class="value" :class="form.dtxwd3 > ratedTemp ? 'red' : 'green' ">{{ form.dtxwd3 }}</span>
                    </div>
                </div>
                <div class="point-info">
                    <p class="point-title">下轴瓦温度</p>
                    <div class="point-data">
                        <span class="value" :class="form.xzwwd1 > ratedTemp ? 'red' : 'green' ">{{ form.xzwwd1 }}</span>
                        <span class="value" :class="form.xzwwd2 > ratedTemp ? 'red' : 'green' ">{{ form.xzwwd2 }}</span>
                        <span class="value" :class="form.xzwwd3 > ratedTemp ? 'red' : 'green' ">{{ form.xzwwd3 }}</span>
                    </div>
                </div>
                <div class="point-info">
                    <p class="point-title">上轴瓦温度</p>
                    <div class="point-data">
                        <span class="value" :class="form.szwwd1 > ratedTemp ? 'red' : 'green' ">{{ form.szwwd1 }}</span>
                        <span class="value" :class="form.szwwd2 > ratedTemp ? 'red' : 'green' ">{{ form.szwwd2 }}</span>
                        <span class="value" :class="form.szwwd3 > ratedTemp ? 'red' : 'green' ">{{ form.szwwd3 }}</span>
                    </div>
                </div>
                <div class="point-info">
                    <p class="point-title">推力瓦温度</p>
                    <div class="point-data">
                        <span class="value" :class="form.tlwwd1 > ratedTemp ? 'red' : 'green' ">{{ form.tlwwd1 }}</span>
                        <span class="value" :class="form.tlwwd2 > ratedTemp ? 'red' : 'green' ">{{ form.tlwwd2 }}</span>
                        <span></span>
                    </div>
                </div>
                <div class="point-info">
                    <p class="point-title">油槽温度</p>
                    <div class="point-data">
                        <span class="value" :class="form.sycwd > ratedTemp ? 'red' : 'green' ">{{ form.sycwd }}</span>
                        <span class="value" :class="form.xycwd > ratedTemp ? 'red' : 'green' ">{{ form.xycwd }}</span>
                        <span></span>
                    </div>
                </div>
            </div>
            <div class="device-info-warp">
                <div class="device-info-left">
                    <div class="kpa-alarm">
                        <span class="kpa-alarm-info" :class="form.syzcxh ? 'green' : 'warn'">{{ form.syzcxh ? '水压正常' : '水压异常' }}</span>
                        <span class="kpa-alarm-info" :class="form.slzcxh ? 'green' : 'warn'">{{ form.slzcxh ? '水流正常' : '水流异常' }}</span>
                        <span class="angle-alarm-title">{{form.lqsy_name}}</span>
                        <span class="kpa-alarm-data">{{ form.lqsy }}</span>
                    </div>
                    <div class="angle-alarm">
                        <span class="angle-alarm-title">{{form.dqjdz_name}}</span>
                        <span class="angle-alarm-data">{{form.dqjdz}}</span>
                        <br/>
                        <span class="angle-alarm-title">{{form.jsjdz_name}}</span>
                        <span class="angle-alarm-data">{{form.jsjdz}}</span>
                    </div>
                </div>
                <div class="device-info-center">
                    暂无监控
                </div>
                <div class="device-info-right">
                    <div class="excitation-device-warp">
                        <p class="device-title">励磁装置</p>
                        <div class="voltage-warp">
                            <div class="voltage">
                                <img :src="voltageIconSvg">
                                <span class="value">{{ form.lcdy }}</span>
                            </div>
                            <div class="electric">
                                <img :src="electricIconSvg">
                                <span class="value">{{ form.lcdl }}</span>
                            </div>
                        </div>
                        <div class="voltage-tag">
                            <span class="tag" v-show="form.lczzyc != '--'" :class="form.lczzyc ? 'green': 'red'">{{form.lczzyc ? '远程' : '就地' }}</span>
                            <span class="tag" v-show="form.lczzdlqhw != '--'" :class="form.lczzdlqhw ? 'green': 'red'">{{form.lczzdlqhw ? '合闸' : '分闸'}}</span>
                            <span class="tag" v-show="form.lczzjx != '--'" :class="form.lczzjx ? 'green' : 'red'">{{ form.lczzjx ? '就绪' : '未绪' }}</span>
                            <span class="tag" v-show="form.lczzgz != '--'" :class="form.lczzgz ? 'red': 'green'">{{form.lczzgz ? '故障' : '正常'}}</span>
                        </div>
                    </div>
                    <div class="high-pressure-warp">
                        <p class="device-title">高压</p>
                        <div class="high-electric-warp">
                            <div class="high-electric-item">
                                <span>&nbsp;</span>
                                <span class="value">
                                    <img :src="voltageIconSvg">&nbsp;
                                    {{ form.dyU }}
                                </span>
                            </div><div class="high-electric-item">
                                <span>A相</span>
                                <span class="value">
                                    <img :src="electricIconSvg">
                                    {{ form.Axdl }}
                                </span>
                            </div><div class="high-electric-item">
                                <span>B相</span>
                                <span class="value">
                                    <img :src="electricIconSvg">
                                    {{ form.Bxdl }}
                                </span>
                            </div><div class="high-electric-item">
                                <span>C相</span>
                                <span class="value">
                                    <img :src="electricIconSvg">
                                    {{ form.Cxdl }}
                                </span>
                            </div>
                        </div>
                        <div class="starter-warp">
                            <div class="starter-item">
                                <span class="title">软启器</span>
                                <div class="starter-tag">
                                    <span class="tag" v-if="form.rqdqdd != '--'" :class="form.rqdqdd ? 'green': 'red'">{{form.rqdqdd ? '得点' : '失电'}}</span>
                                    <span class="tag" v-if="form.rqdqbt != '--'" :class="form.rqdqbt ? 'green' : 'red'">{{form.rqdqbt ? '备妥' : '未妥'}}</span>
                                    <span class="tag" v-if="form.rqdqyx != '--'" :class="form.rqdqyx ? 'green' : 'red'">{{ form.rqdqyx ?  '运行' : '停止' }}</span>
                                    <span class="tag" v-if="form.rqdqgz != '--'" :class="form.rqdqgz ? 'red': 'green'">{{form.rqdqgz ? '故障': '正常'}}</span>
                                </div>
                            </div>
                            <div class="starter-item">
                                <span class="title">断路器</span>
                                <div class="starter-tag">
                                    <span class="tag" v-if="form.dlqyc != '--'" :class="form.dlqyc ? 'green' : 'red'">{{form.dlqyc ? '远程' : '就地'}}</span>
                                    <span class="tag" v-if="form.dlqhw != '--'" :class="form.dlqhw ? 'green' : 'red'">{{form.dlqhw ? '合闸' : '分闸'}}</span>
                                    <span class="tag" v-if="form.dlqgz != '--'" :class="form.dlqgz ? 'red' : 'green'">{{form.dlqgz ? '故障' : '正常'}}</span>
                                    <span class="tag" v-if="form.dlqgz != '--'"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import electricIconSvg from '@/assets/svg/electric-icon.svg'
import voltageIconSvg from '@/assets/svg/voltage-icon.svg'
import { defineProps, watchEffect, watch, ref, computed, onMounted } from 'vue'
import { toPicMap } from '../toPicMap'

const props = defineProps({
    mqttMsgObj: {
        type: Object,
        default: () => ({})
    },
    sceneObj: {
        type: Object,
        default: () => ({})
    }
})

// 设备温度健康标准值
const ratedTemp = ref(40)

const form = ref({})
watch(props.mqttMsgObj, () => {
    Object.keys(toPicMap).forEach((key) => {
        if (!toPicMap[key] || !toPicMap[key][props.sceneObj.id]) {
            form.value[key] = '--'
        } else {
            const [topic, pointId] = toPicMap[key][props.sceneObj.id].split(':')
            if (props.mqttMsgObj[topic] && props.mqttMsgObj[topic].points) {
                props.mqttMsgObj[topic].points.forEach((point) => {
                    if (point.point_id == pointId) {
                        form.value[key] = point.value
                        form.value[`${key}_name`] = point.point_name
                    }
                })
            }
        }
    })
},
{ deep: true });

watch([() => props.sceneObj], () => {
    Object.keys(toPicMap).forEach((key) => {
        form.value[key] = '--'
        form.value[`${key}_name`] = '--'
    })
},
{ deep: true })




</script>
<style lang="less">
    .real-time-data-warp {
        height: 5.5rem;
        flex-shrink: 0;
        .real-time-data-content {
            display: flex;
            flex-direction: column;
            height: calc(100% - 0.18rem);
            .scene-name {
                height: 0.58rem;
                line-height: 0.46rem;
                color: #E0E0E0;
                font-size: 0.32rem;
                margin: 0;
                padding: 0;
                text-align: center;
            }
            .point-info-warp {
                width: 100%;
                height: 0.76rem;
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
                overflow: hidden;
                margin-right: 0.2rem;
                margin-left: 0.1rem;
                padding-right: 0.19rem;
                .point-info {
                    width: 17%;
                    display: flex;
                    flex-direction: column;
                    box-sizing: border-box;
                    border-radius: 6px;
                    padding: 0.12rem;
                    border: 1px solid #22A2CC;
                    box-shadow: inset -10px -10px 20px -10px rgba(17, 48, 244, 0.3),inset 10px 10px 20px -10px rgba(17, 48, 244, 0.3);
                    margin-right: 0.12rem;
                    &:last-of-type {
                        margin-right: 0;
                    }
                    .point-title {
                        font-size: 0.14rem;
                        line-height: 1;
                    }
                    .point-data {
                        display: flex;
                        justify-content: space-between;
                        .value {
                            font-size: 0.16rem;
                            font-weight: bold;
                            margin-right: 0.08rem;
                            &::after {
                                content: '℃';
                                color: #9E9E9E;
                                font-size: 0.1rem;
                                font-weight: 400;
                                margin-left: 0.04rem;
                            }
                            &:last-of-type {
                                margin: 0;
                            }
                            &.green {
                                color: #1FE88B
                            }
                            &.red {
                                color: #EA0000
                            }
                        }
                    }
                }
            }
            .device-info-warp {
                height: calc(100% - 1.5rem );
                display: flex;
                margin: 0.2rem 0.1rem 0;
                .device-info-left {
                    width: 1.1rem;
                    display: flex;
                    flex-direction: column;
                    .kpa-alarm {
                        display: flex;
                        flex-direction: column;
                        .kpa-alarm-info {
                            width: 0.76rem;
                            display: inline-block;
                            color: #078937;
                            font-size: 0.14rem;
                            line-height: 0.2rem;
                            border-radius: 0.2rem;
                            border: 1px solid #078937;
                            padding: 0 0.08rem;
                            flex-shrink: 0;
                            margin-bottom: 0.2rem;
                            &.warn {
                                color: #F2C94C;
                                border: 1px solid #F2C94C;
                                animation: blink 1s infinite;
                            }
                            &.green {
                                color: #078937;
                                border: 1px solid #078937;
                            }
                        }
                        .kpa-alarm-data {
                            font-size: 0.28rem;
                            font-weight: bold;
                            line-height: 1;
                            &::after {
                                content: 'Mpa';
                                font-size: 0.1rem;
                                font-weight: 400;
                            }
                        }
                    }
                    .angle-alarm {
                        display: flex;
                        flex-direction: column;
                        margin-top: 0.5rem;
                        .angle-alarm-title {
                            color: #F2C94C;
                            font-size: 0.14rem;
                        }
                        .angle-alarm-data {
                            font-size: 0.28rem;
                            font-weight: bold;
                            &::after {
                                content: 'Deg';
                                font-size: 0.1rem;
                                font-weight: 400;
                                margin-left: 0.02rem;
                            }
                        }
                    }
                }
                .device-info-right {
                    height: 100%;
                    width: 2.7rem;
                    margin-left: 0.3rem;
                    .excitation-device-warp {
                        padding: 0.12rem 0.24rem;
                        border-radius: 0.06rem;
                        border: 1px solid #22A2CC;
                        box-shadow: inset -10px -10px 20px -10px rgba(17, 48, 244, 0.3),inset 10px 10px 20px -10px rgba(17, 48, 244, 0.3);
                        z-index: 0;
                        .device-title {
                            font-size: 0.14rem;
                            color: #E0E0E0;
                            line-height: 1;
                        }
                        .voltage-warp {
                            display: flex;
                            justify-content: space-between;
                            .value {
                                color: #1FE88B;
                                font-size: 0.16rem;
                                margin-left: 0.08rem;
                            }
                            .voltage {
                                display: flex;
                                align-items: center;
                                img {
                                    width: 0.14rem;
                                    height: 0.14rem;
                                }
                                .value::after {
                                    content: 'V';
                                    font-size: 0.1rem;
                                    color: #E0E0E0;
                                    margin-left: 0.04rem;
                                }
                            }
                            .electric {
                                display: flex;
                                align-items: center;
                                img {
                                    width: 0.14rem;
                                    height: 0.14rem;
                                }
                                .value::after {
                                    content: 'A';
                                    font-size: 0.1rem;
                                    color: #E0E0E0;
                                    margin-left: 0.04rem;
                                }
                            }
                        }
                        .voltage-tag {
                            display: flex;
                            justify-content: space-between;
                            margin-top: 0.16rem;
                            min-height: 0.26rem;
                            .tag {
                                display: inline-flex;
                                width: 0.3rem;
                                height: 0.3rem;
                                line-height: 1;
                                font-size: 0.1rem;
                                color: #C5C5C5;
                                align-items: center;
                                justify-content: center;
                                border-radius: 0.3rem;
                            }
                            .green {
                                background: radial-gradient(81% 81% at 10% 28%, #A3FABF 0%, #078937 95%);
                            }
                            .red {
                                background: radial-gradient(69% 69% at 18% 38%, #F44B45 20%, #DC0202 100%);
                            }
                        }
                    }
                    .high-pressure-warp {
                        height: calc(100% - 1.45rem);
                        margin-top: 0.2rem;
                        padding: 0.12rem 0.24rem 0.16rem;
                        border-radius: 0.06rem;
                        border: 1px solid #22A2CC;
                        box-shadow: inset -10px -10px 20px -10px rgba(17, 48, 244, 0.3),inset 10px 10px 20px -10px rgba(17, 48, 244, 0.3);
                        z-index: 0;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        .device-title {
                            margin-bottom: 0;
                            font-size: 0.14rem;
                            color: #E0E0E0;
                            line-height: 1
                        }
                        .high-electric-warp {
                            display: flex;
                            justify-content: space-between;
                            .high-electric-item {
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                span {
                                    font-size: 0.14rem;
                                }
                                .value {
                                    color: #1FE88B;
                                    font-size: 0.14rem;
                                    display: flex;
                                    align-items: center;
                                    img {
                                        width: 0.14rem;
                                        height: 0.14rem;
                                        margin-right: 0.06rem;
                                    }
                                }
                            }
                        }
                        .starter-warp {
                            height: 0.76rem;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                                .starter-item {
                                    display: flex;
                                    align-items: center;
                                    .title {
                                        font-size: 0.12rem;
                                        color: #E0E0E0;
                                        display: inline-block;
                                        width: 0.52rem;
                                        flex-shrink: 0;
                                    }
                                    .starter-tag {
                                        width: 100%;
                                        display: flex;
                                        justify-content: space-between;
                                        .tag {
                                            display: inline-flex;
                                            width: 0.3rem;
                                            height: 0.3rem;
                                            line-height: 1;
                                            font-size: 0.1rem;
                                            color: #C5C5C5;
                                            align-items: center;
                                            justify-content: center;
                                            border-radius: 0.3rem;
                                        }
                                        .green {
                                            background: radial-gradient(81% 81% at 10% 28%, #A3FABF 0%, #078937 95%);
                                        }
                                        .red {
                                            background: radial-gradient(69% 69% at 18% 38%, #F44B45 20%, #DC0202 100%);
                                        }
                                    }
                                }
                            }
                    }
                }
                .device-info-center {
                    width: calc(100% - 3.9rem);
                    border: 1px solid #22A2CC;
                    border-radius: 0.06rem;
                    background-color: #666;
                    background-image: url('@/assets/bg-001.png');
                    background-size: cover;
                }
            }
        }
    }

    @keyframes blink {
        0% {
            opacity: 1;
            color: #F2C94C;
        }
        50% {
            opacity: 0;
            color: blue;
        }
        80% {
            opacity: 1;
            color:  #F2C94C;
        }
        100% {
            opacity: 1;
            color:  #F2C94C;
        }
    }
</style>
