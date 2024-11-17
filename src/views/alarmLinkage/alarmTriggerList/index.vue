<template>
    <div class="alarm-trigger-warp common-warp">
        <div class="title">报警触发器列表</div>
        <div class="search-form">
            <div class="search-form-row">
                <div class="search-form-item">
                    <span class="label">关联设备：</span>
                    <a-select v-model:value="searchForm.device_id" show-search optionFilterProp="label">
                        <a-select-option v-for="device in deviceList"  :key="device.id" :value="String(device.id)" :label="device.device_name">{{device.device_name}}</a-select-option>
                    </a-select>
                </div>
                <div class="search-form-item">
                    <span class="label">数据点名称：</span>
                    <a-input v-model:value="searchForm.point_name" placeholder="请输入数据点名称"></a-input>
                </div>
                <div class="search-form-item">
                    <span class="label">触发器名称：</span>
                    <a-input v-model:value="searchForm.trigger_name" placeholder="请输入触发器名称"></a-input>
                </div>
                <div class="search-form-tool">
                    <a-button type="primary" @click.prevent="handleSearch"><template #icon><SearchOutlined /></template>查询</a-button>
                </div>
            </div>
            <div class="search-form-row">
                <div class="search-form-item">
                    <span class="label">启用状态：</span>
                    <a-select v-model:value="searchForm.enabled">
                        <a-select-option  value="">全部</a-select-option>
                        <a-select-option  :value="true">启用</a-select-option>
                        <a-select-option  :value="false">关闭</a-select-option>
                    </a-select>
                </div>
                <div class="search-form-item">

                </div>
                <div class="search-form-item">

                </div>
                <div class="search-form-tool">
                    <a-button type="default" @click.prevent="handleReset"><template #icon><RedoOutlined /></template>重置</a-button>
                </div>
            </div>
        </div>

        <div class="list-tool-warp">
            <a-button class="tool-btn" type="primary" @click.prevent="handleAddTrigger"><template #icon><PlusOutlined /></template>添加触发器</a-button>
            <a-button class="tool-btn" type="default" @click.prevent="handleMultDel" v-if="tableSelectedRows.length"><template #icon><DeleteOutlined /></template>批量删除</a-button>
        </div>
        <a-table :dataSource="dataSource" :columns="columns" :loading="tableToading" :row-selection="rowSelection" :rowKey="(record, index) => String(record.uid)" :pagination="paginationObj" @change="handleTableChange"  class="common-table deviceListTable" :rowClassName="() => 'common-table-row'" :scroll="scroll">
            <template #enabled="{record}">
                <a-switch v-model:checked="record.enabled" :disabled="true"></a-switch>
            </template>
            <template #operation="{record}">
                <a @click="handleView(record)">查看</a>&nbsp;
                <a @click="handleEdit(record)">修改</a>&nbsp;
                <a @click="handleDel(record)">删除</a>
            </template>
        </a-table>
        <EditTrigger v-if="visibleModal" :visibleModal="visibleModal" :isEdit="isEdit" :orgOptions="orgOptions" :trigger="currentTrigger"  @update:visible="handleTriggerVisible" @update:trigger="handleTriggerCallback" />
        <ViewTrigger v-if="visibleTrigger" :visibleTrigger="visibleTrigger" :trigger="currentTrigger" @update:visible="handleTriggerVisible" />
    </div>
</template>
<script setup>
import '@/styles/common.less'
import OnlineTagSvg from '@/assets/svg/online_tag.svg'
import OfflineTagSvg from '@/assets/svg/offline_tag2.svg'
import { PlusOutlined, SearchOutlined, DeleteOutlined, RedoOutlined } from '@ant-design/icons-vue'

import { ref, onMounted, onUnmounted, createVNode } from 'vue'
import { getTriggerList, delTriggers, multDelTriggers } from '@/api/alarmLinkage'
import { getDeviceList } from '@/api/deviceManage'
import { getOrgList } from '@/api/organizationMange'
import { message, Modal } from 'ant-design-vue'
import { uuid } from '@/utils'
import EditTrigger from './editTrigger.vue'
import ViewTrigger from './viewTrigger.vue'

const defaultForm = {
    device_id: '',
    point_name: '',
    trigger_name: '',
    enabled: '',
    created_at: ''
}
const searchForm = ref({...defaultForm})

// 请求设备列表
const defaultDevice = { id: '', device_name: '全部' }
const deviceList = ref([defaultDevice])
const handleGetDeviceList = () => {
    getDeviceList({page: 0}).then((res) => {
        deviceList.value = [defaultDevice, ...res.data ]
    })
}

// 请求组织列表
const orgOptions = ref([])
const handleGetOrgList = () => {
    getOrgList({page: 0}).then((res) => {
        orgOptions.value = [ ...res.data ]
    })
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

const enableMap = {
    false: () => createVNode('span', {}, [createVNode('img', {src: OfflineTagSvg}), ' 禁用']),
    true: () => createVNode('span', {}, [createVNode('img', {src: OnlineTagSvg}), ' 启用']),
}

const columns = [
    {
        title: '触发器名称',
        dataIndex: 'trigger_name',
        align: 'center',
    },
    {
        title: '所属组织',
        dataIndex: 'organization_name',
        align: 'center'
    },
    {
        title: '触发设备',
        dataIndex: 'device_name',
        align: 'center'
    },
    {
        title: '关联数据点',
        dataIndex: 'point_name',
        align: 'center'
    },
    {
        title: '启用状态',
        dataIndex: 'enabled',
        align: 'center',
        slots: { customRender: 'enabled' }
    },
    {
        title: '触发条件',
        dataIndex: 'display_condition',
        align: 'center'
    },
    {
        title: '报警状态',
        dataIndex: 'enable_alarm',
        align: 'center',
        customRender: ({record}) => {
            return enableMap[record.enable_alarm]()
        }
    },
    {
        title: '联动状态',
        dataIndex: 'enable_linkage',
        align: 'center',
        customRender: ({record}) => {
            return enableMap[record.enable_linkage]()
        }
    },
    {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        slots: { customRender: 'operation' }
    },
]
const dataSource = ref([])

// 表格操作
const scroll = ref({ y: 420 })
const tableSelectedRows = ref([])
const tableSelectedrowkeys = ref([])
const rowSelection = {
  onSelect: (record, selected, selectedRows) => {
    tableSelectedRows.value = selectedRows
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    tableSelectedRows.value = selectedRows
  },
  onChange: (selectedrowkeys, selectedrows) => {
    tableSelectedrowkeys.value = selectedrowkeys;
  }
};
// table 批量修改操作
const handleMultDel = () => {
    Modal.confirm({
        title: '温馨提醒',
        content: '确认批量删除所选项?',
        onOk() {
          const ids = tableSelectedRows.value.map((row) => row.id)
          multDelTriggers({ids}).then((res) => {
            message.success('操作成功')
            handleGetTriggerLlist({...searchForm.value, page: 1})
          })
        }
    })
}


// 更新tirger回调
const handleTriggerCallback = () => {
    handleGetTriggerLlist({...searchForm.value, page: paginationObj.value.current})
}

// 关闭modal回调
const handleTriggerVisible = (flag) => {
    currentTrigger.value = {}
    isEdit.value = false
    visibleModal.value = flag
    visibleTrigger.value = flag
}

// 添加触发器
const visibleModal = ref(false)
const handleAddTrigger = () => {
    visibleModal.value = true
}

// table修改操作
const currentTrigger = ref({})
const isEdit = ref(false)
const handleEdit = (record) => {
    currentTrigger.value = {...record}
    isEdit.value = true
    visibleModal.value = true
}

// table查看详情
const visibleTrigger = ref(false)
const handleView = (record) => {
    visibleTrigger.value = true
    currentTrigger.value = {...record}
}

// table删除
const handleDel = (record) => {
    Modal.confirm({
        title: '温馨提醒',
        content: '确认删除?',
        onOk() {
            delTriggers(record).then(() => {
                message.success('操作成功')
                const index = dataSource.value.findIndex((item) => item.id == record.id)
                dataSource.value.splice(index, 1);

                const index2 = tableSelectedRows.value.findIndex((item) => item.id == record.id)
                tableSelectedRows.value.splice(index2, 1);

                setTimeout(() => {
                    console.log(dataSource.value.length, dataSource.value)
                    if (dataSource.value.length) return
                    if (paginationObj.value.current == 1) return
                    handleGetTriggerLlist({...searchForm.value, page: paginationObj.value.current - 1})
                })
            })
        }
    })
}

// 数据处理
const tableToading = ref(false)
const handleGetTriggerLlist = async (params) => {
    tableToading.value = true
    const res = await getTriggerList(params).finally(() => {
        tableToading.value = false
    })

    if (!res) return message.error('数据异常！')
    if (!res.data) return message.error('数据为空！')
    // 遍历调整数据展示
    const devices = res.data.map((item, key) => {
        item.uid = uuid(8, 16);
        return item
    })
    dataSource.value = devices
    tableSelectedRows.value = []
    tableSelectedrowkeys.value = []
    // 分页数据
    paginationObj.value.total = res.meta.total
    paginationObj.value.current = res.meta.current_page
}

// 分页处理
const handleTableChange = ({current}) => {
    handleGetTriggerLlist({...searchForm.value, page: current})
}

// 查询
const handleSearch = () => {
    console.log('searchForm', searchForm)
    handleGetTriggerLlist({...searchForm.value, page: 1})
}
// 重置
const handleReset = () => {
    paginationObj.value.current = 1
    searchForm.value = {...defaultForm}
    handleGetTriggerLlist({...searchForm.value, page: 1})
}

onMounted(() => {
    handleGetOrgList()
    handleGetDeviceList()
    handleGetTriggerLlist(searchForm.value)

})
onUnmounted(() => {
})



</script>
<style lang="less">
.alarm-trigger-warp {
    .search-form .search-form-item .label {
        width: 80px;
    }
}
</style>
