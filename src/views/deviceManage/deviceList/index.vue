<template>
    <div class="device-list-warp common-warp">
        <div class="title">设备管理</div>
        <div class="search-form">
            <div class="search-form-row">
                <div class="search-form-item">
                    <span class="label">组织名称：</span>
                    <a-select v-model:value="searchForm.organization_id">
                        <a-select-option v-for="org in orgList" :value="String(org.id)" :key="org.id">{{ org.organization_name }}</a-select-option>
                    </a-select>
                </div>
                <div class="search-form-item">
                    <span class="label">设备名称：</span>
                    <a-input v-model:value="searchForm.device_name"></a-input>
                </div>
                <div class="search-form-item">
                    <span class="label">设备状态：</span>
                    <a-select v-model:value="searchForm.online">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option value="true">在线</a-select-option>
                        <a-select-option value="false">离线</a-select-option>
                    </a-select>
                </div>
                <div class="search-form-tool">
                    <a-button type="primary" @click.prevent="handleSearch"><template #icon><SearchOutlined /></template>查询</a-button>
                </div>
            </div>
        </div>

        <div class="list-tool-warp">
            <a-button class="tool-btn" type="primary" @click.prevent="handleAddDevice"><template #icon><PlusOutlined /></template>添加设备</a-button>
            <a-button class="tool-btn" type="default" @click.prevent="handleMultDel" v-if="tableSelectedRows.length"><template #icon><DeleteOutlined /></template>批量删除</a-button>
        </div>
        <a-table :dataSource="dataSource" :columns="columns" :loading="tableToading" :row-selection="rowSelection" :rowKey="(record, index) => String(record.uid)" :pagination="paginationObj" @change="handleTableChange"  class="common-table deviceListTable" :rowClassName="() => 'common-table-row'" :scroll="scroll">
            <template #operation="{record}">
                <a @click="handleView(record)">查看</a>&nbsp;
                <a @click="handleEdit(record)">修改</a>&nbsp;
                <a @click="handleDel(record)">删除</a>
            </template>
        </a-table>
        <!-- 删除提示框 -->

    </div>
</template>
<script setup>
import OnlineTagSvg from '@/assets/svg/online_tag.svg'
import OfflineTagSvg from '@/assets/svg/offline_tag.svg'
import { PlusOutlined, UploadOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { ref, reactive, onMounted, createVNode, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDeviceList, deleteDevices, multDeleteDevices } from '@/api/deviceManage'
import { getOrgList } from '@/api/organizationMange'
import { message, Modal } from 'ant-design-vue'
import { uuid } from '@/utils'

const router = useRouter()
const searchForm = ref({
    organization_id: '',
    device_name: '',
    online: '',
})

// 请求组织列表
const defaultOrg = {id: '', organization_name: '全部'}
const orgList = ref([defaultOrg])
const handleGetOrgList = () => {
    getOrgList({pageSize: 999}).then((res) => {
        orgList.value = [defaultOrg, ...res.data ]
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

const columns = [
    {
        title: '设备状态',
        dataIndex: 'online',
        align: 'center',
        width: 80,
        customRender: ({record}) => {
            const onlineMap = {
                false: () => createVNode('span', {}, [createVNode('img', {src: OfflineTagSvg}), ' 离线']),
                true: () => createVNode('span', {}, [createVNode('img', {src: OnlineTagSvg}), ' 在线']),
            }
            return onlineMap[record.online]()
        }
    },
    {
        title: '设备ID',
        dataIndex: 'id',
        align: 'center'
    },
    {
        title: '设备名称',
        dataIndex: 'device_name',
        align: 'center'
    },
    {
        title: '所属组织',
        dataIndex: 'organization_name',
        align: 'center'
    },
    {
        title: '串口服务器地址',
        dataIndex: 'modbus_host',
        align: 'center'
    },
    {
        title: '数据点数量',
        dataIndex: 'points_count',
        align: 'center',
        width: 80
    },
    {
        title: '订阅地址',
        dataIndex: 'mqtt_topic',
        align: 'center'
    },
    {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        align: 'center',
        slots: { customRender: 'operation' }
    },
]
const dataSource = ref([])

// 表格操作
const scroll = ref({ y: 450 })
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
          multDeleteDevices({ids}).then((res) => {
            message.success('操作成功')
            getDeviceLlist({...searchForm.value, page: 1})
          })
        }
    })
}
// table修改操作
const handleEdit = (record) => {
    router.push({name: 'editDevice', query: {id: record.id}})
}

// table查看详情
const handleView = (record ) => {
    router.push({name: 'deviceDetail', query: {id: record.id}})
}

const handleDel = (record) => {
    Modal.confirm({
        title: '温馨提醒',
        content: '确认删除?',
        onOk() {
            deleteDevices(record).then(() => {
                message.success('操作成功')
                const index = dataSource.value.findIndex((item) => item.id == record.id)
                dataSource.value.splice(index, 1);

                const index2 = tableSelectedRows.value.findIndex((item) => item.id == record.id)
                tableSelectedRows.value.splice(index2, 1);

                setTimeout(() => {
                    console.log(dataSource.value.length, dataSource.value)
                    if (dataSource.value.length) return
                    if (paginationObj.value.current == 1) return
                    getDeviceLlist({...searchForm.value, page: paginationObj.value.current - 1})
                })
            })
        }
    })
}

// 数据处理
const tableToading = ref(false)
const getDeviceLlist = async (params) => {
    tableToading.value = true
    const res = await getDeviceList(params).finally(() => {
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
    getDeviceLlist({...searchForm.value, page: current})
}

// 查询
const handleSearch = () => {
    console.log('searchForm', searchForm)
    getDeviceLlist({...searchForm.value, page: 1})
}

// 添加设备
const handleAddDevice = () => {
    router.push({path: '/addDevice'})
}

onMounted(() => {
    handleGetOrgList()
    getDeviceLlist(searchForm)

    // MqttClient.subscribe('devices/1', (error) => {
    //     // if (error) message.error(error)
    // })
    // MqttClient.on('message', (topic, message) => {
    //     const resp = MqttClient.JSONFunction(message)
    //     console.log('resp', resp)
    // })
})
onUnmounted(() => {
    // MqttClient.unsubscribe('devices/1')
})



</script>
<style lang="less">
.device-list-warp {
}
</style>
