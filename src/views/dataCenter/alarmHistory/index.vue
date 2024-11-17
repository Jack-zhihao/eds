<template>
    <div class="common-warp">
        <div class="title">报警记录</div>
        <div class="search-form">
            <div class="search-form-row">
                <div class="search-form-item">
                    <span class="label">报警设备：</span>
                    <a-select v-model:value="searchForm.device_id" show-search optionFilterProp="label">
                        <a-select-option v-for="device in deviceList"  :key="device.id" :value="String(device.id)" :label="device.device_name">{{device.device_name}}</a-select-option>
                    </a-select>
                </div>
                <div class="search-form-item">
                    <span class="label" style="width: 80px;">数据点名称：</span>
                    <a-input v-model:value="searchForm.point_name"></a-input>
                </div>
                <div class="search-form-item">
                    <span class="label" style="width: 80px;">处理状态：</span>
                    <a-select v-model:value="searchForm.deal_status">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="true">已处理</a-select-option>
                        <a-select-option :value="false">未处理</a-select-option>
                    </a-select>
                </div>
                <div class="search-form-tool">
                    <a-button type="primary" @click.prevent="handleSearch"><template #icon><SearchOutlined /></template>查询</a-button>
                </div>
            </div>
            <div class="search-form-row">
                <div class="search-form-item">
                    <span class="label">报警类型：</span>
                    <a-select v-model:value="searchForm.alarm_type">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="true">已处理</a-select-option>
                        <a-select-option :value="false">未处理</a-select-option>
                    </a-select>
                </div>
                <div class="search-form-item">
                    <span class="label" style="width: 80px;">报警时间：</span>
                    <a-range-picker v-model:value="dateRange" valueFormat="YYYY-MM-DD" :disabledDate="(current) => current && current > moment().endOf('day')" @change="handleDateRange" />
                </div>
                <div class="search-form-item"></div>
                <div class="search-form-tool">
                    <a-button type="default" @click.prevent="handleReset"><template #icon><RedoOutlined /></template>重置</a-button>
                </div>
            </div>
        </div>

        <a-table :dataSource="dataSource" :columns="columns" :loading="tableToading" :pagination="paginationObj" @change="handleTableChange" :rowKey="(record, index) => record.id"  class="common-table" style="margin-top: 20px;" :rowClassName="() => 'common-table-row'" :scroll="scroll">
            <template #saveFunction="record">
                <span>{{ record.storage_strategy_text }}</span>
            </template>
            <template #operation="{record}">
                <a @click="handleView(record)">预览</a>&nbsp;
                <a @click="handleEdit(record)">编辑</a>&nbsp;
                <!-- <a @click="handleDel(record)">删除</a> -->
            </template>
        </a-table>
        <!-- <SceneModal v-if="visibleModal" :visibleModal="visibleModal" :scene="currentScene" :orgOptions="orgOptions"  @update:visible="handleSceneVisible" @update:scene="handleSceneCallback" />
        <ViewModal  v-if="visibleScene" :visibleScene="visibleScene" :scene="currentScene" @update:visible="handleSceneVisible" /> -->
    </div>
</template>
<script setup>
import { SearchOutlined, RedoOutlined } from '@ant-design/icons-vue'
import { ref, onMounted } from 'vue'
import { getSceneList, delScene} from '@/api/scenesManage'
import { message, Modal } from 'ant-design-vue'
import { getOrgList } from '@/api/organizationMange'
import { getDeviceList } from '@/api/deviceManage'
import moment from 'moment'

const dateRange = ref([])
const searchForm = ref({
    device_id: '',
    point_name: '',
    deal_status: '',
    alarm_type: '',
    time_start: '',
    time_end: ''
})

// 请求设备列表
const defaultDevice = {id: '', device_name: '全部'}
const deviceList = ref([defaultDevice])
const handleGetDeviceList = () => {
    getDeviceList({page: 0}).then((res) => {
        deviceList.value = [defaultDevice, ...res.data ]
    })
}

// 日期change
const handleDateRange = (dateRange) => {
    searchForm.value.time_start = dateRange[0] || ''
    searchForm.value.time_end = dateRange[1] || ''
}


// 分页处理
const paginationObj = ref({
    current: 1,
    defaultPageSize: 15,
    pageSize: 15,
    total: 0,
    itemRender: ({page, type}) => {
        const arrowMap = {
            next: '下一页',
            prev: '上一页',
            page: page,
        }
        return arrowMap[type]
    }
})

const columns = [
    {
        title: '设备名称',
        dataIndex: 'device_name',
        align: 'center',
        width: 80
    },
    {
        title: '数据点名称',
        dataIndex: 'point_name',
        align: 'center'
    },
    {
        title: '处理状态',
        dataIndex: 'deal_status',
        align: 'center'
    },
    {
        title: '报警类型',
        dataIndex: 'deal_status',
        align: 'center'
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        align: 'center',
        width: 160
    },
    {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        width: 140,
        slots: { customRender: 'operation' }
    },
]
const dataSource = ref([])

// 表格操作
const scroll = ref({ y: 450 })

// 关闭modal回调
const handleVisible = (flag) => {
    currentScene.value = {}
    isEdit.value = false
    visibleModal.value = flag
    visibleScene.value = flag
}

// 更新数据回调
const handleCallback = () => {
    // handleGetHistoryList({...searchForm.value, page: paginationObj.current})
}

// tables删除操作
const handleDel = (record) => {
    Modal.confirm({
        title: '温馨提醒',
        content: '确认删除?',
        onOk() {
            // delScene(record).then(() => {
            //     message.success('操作成功')
            //     const index = dataSource.value.findIndex((item) => item.id == record.id)
            //     dataSource.value.splice(index, 1);

            //     setTimeout(() => {
            //         if (dataSource.value.length) return
            //         if (paginationObj.value.current == 1) return
            //         handleGetSceneList({...searchForm.value, page: paginationObj.value.current - 1})
            //     })
            // })
        }
    })
}


// 数据处理
const tableToading = ref(false)
// const handleGetSceneList = async (params) => {
//     tableToading.value = true
//     const res = await getSceneList(params).finally(() => {
//         tableToading.value = false
//     })

//     if (!res) return message.error('数据异常！')
//     if (!res.data) return message.error('数据为空！')
//     dataSource.value = res.data
//     // 分页数据
//     paginationObj.value.total = res.meta.total
//     paginationObj.value.current = res.meta.current_page
// }

// 分页处理
const handleTableChange = ({current}) => {
    // handleGetSceneList({...searchForm.value, page: current})
}

// 查询
const handleSearch = () => {
    console.log('searchForm', searchForm.value)
    // handleGetSceneList({...searchForm.value, page: 1})
}
// 重置查询
const handleReset = () => {
    // handleGetSceneList({...searchForm.value, page: 1})
}

onMounted(() => {
    handleGetDeviceList()
})

</script>
<style lang="less">
.dataHistory-list-warp {
}
</style>
