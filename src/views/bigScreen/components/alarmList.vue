<template>
    <div class="alarm-list-warp pane-warp">
        <div class="pane-title">报警信息</div>
        <div class="filter-warp">
            <a-input-search v-model:value="searchValue" placeholder="请输入数据点名称" @blur="isScroll = true" @focus="isScroll = false" style="width: 3.6rem" @search="onSearch">
                <template #suffix>
                    <img :src="searchIconSvg">
                </template>
            </a-input-search>
        </div>
        <div class="alarm-list-content">
            <Vue3SeamlessScroll v-model="isScroll" :list="data" class="scroll-table" :limitScrollNum="6" :hover="true" :step="0.3">
                <div class="alarm-list-item" v-for="item in data">
                    <div class="item-top">
                        <span class="title">报警数据点：{{item.title}}</span>
                        <span class="time">{{item.time}}</span>
                    </div>
                    <div class="item-content">
                        <!-- 报警内容：上轴瓦温度1超过上限<span class="green">70</span>°C，当前值<span class="red">90</span>°C -->
                        报警内容：{{ item.content }}
                    </div>
                </div>
            </Vue3SeamlessScroll>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import searchIconSvg from '@/assets/svg/search-icon.svg'
const searchValue = ref('')
const onSearch = (val) => {
    data.value = defaultData.filter((item) => item.title.includes(val))
}

const isScroll = ref(false)
const defaultData = [
    {
        title: '一号机组上轴瓦温度1报警',
        time: '2024-06-26 14:24:02',
        content: '上轴瓦温度1超过上限70°C，当前值90°C'
    },
    {
        title: '一号机组上轴瓦温度2报警',
        time: '2024-06-26 14:24:02',
        content: '上轴瓦温度1超过上限70°C，当前值90°C'
    },
    {
        title: '一号机组上轴瓦温度3报警',
        time: '2024-06-26 14:24:02',
        content: '上轴瓦温度1超过上限70°C，当前值90°C'
    },
    {
        title: '一号机组上轴瓦温度4报警',
        time: '2024-06-26 14:24:02',
        content: '上轴瓦温度1超过上限70°C，当前值90°C'
    },
    {
        title: '一号机组上轴瓦温度4报警',
        time: '2024-06-26 14:24:02',
        content: '上轴瓦温度1超过上限70°C，当前值90°C'
    },
    {
        title: '一号机组上轴瓦温度4报警',
        time: '2024-06-26 14:24:02',
        content: '上轴瓦温度1超过上限70°C，当前值90°C'
    },
    {
        title: '一号机组上轴瓦温度4报警',
        time: '2024-06-26 14:24:02',
        content: '上轴瓦温度1超过上限70°C，当前值90°C'
    }
]
const data = ref(defaultData)
onMounted(() => {
    isScroll.value = true
})
</script>
<style lang="less">
    .alarm-list-warp {
        height: 3.7rem;
        flex-shrink: 0;
        padding: 0.2rem;
        .pane-title {
            margin-left: 0 !important;
        }
        .filter-warp {
            margin-top: 0.2rem;
            padding-bottom: 0.2rem;
            .ant-input-affix-wrapper {
                border-color: #22A2CC;
                background-color: transparent ;
                >.ant-input {
                    background-color: transparent !important;
                    color: #E0E0E0 !important;
                }
                .ant-input-search-icon {
                    color: #22A2CC !important;
                    font-size: 0.16rem !important;
                    display: none;
                }
            }
        }
        .alarm-list-content {
            display: flex;
            flex-direction: column;
            height: calc(100% - 0.9rem);
            overflow: hidden;
            .scroll-table {
                height: 100%;
                width: 100%;
            }
            .alarm-list-item {
                color: #E0E0E0;
                font-size: 0.1rem;
                margin-bottom: 0.2rem;
                .item-top {
                    display: flex;
                    justify-content: space-between;
                    .time {
                        color: #BDBDBD;
                        width: 1.15rem;
                        flex-shrink: 0;
                    }
                    .title {
                        width: calc(100% - 1.15rem);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis
                    }
                }
                .green {
                    color: #22C55E;
                }
                .red {
                    color: #EB2828;
                }
            }
        }
    }
</style>
