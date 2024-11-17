<template>
    <div class="data-point-list-warp common-warp">
        <div class="title">数据点列表</div>
        <div class="search-form">
            <div class="search-form-row">
                <div class="search-form-item">
                    <span class="label">选择设备：</span>
                    <a-select v-model:value="searchForm.device_id" show-search optionFilterProp="label">
                        <a-select-option v-for="device in deviceList"  :key="device.id" :value="String(device.id)" :label="device.device_name">{{device.device_name}}</a-select-option>
                    </a-select>
                </div>
                <div class="search-form-item">
                    <span class="label" style="width: 80px;">数据点名称：</span>
                    <a-input v-model:value="searchForm.point_name"></a-input>
                </div>
                <div class="search-form-item">
                    <span class="label" style="width: 100px;">数据保存状态：</span>
                    <a-select v-model:value="searchForm.storable">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option value="true">已保存</a-select-option>
                        <a-select-option value="false">未保存</a-select-option>
                    </a-select>
                </div>
                <div class="search-form-tool">
                    <a-button type="primary" @click.prevent="handleSearch"><template #icon><SearchOutlined /></template>查询</a-button>
                </div>
            </div>
        </div>

        <div class="list-tool-warp">
            <a-button class="tool-btn" type="primary" @click.prevent="handleAddDataPoint"><template #icon><PlusOutlined /></template>添加数据点</a-button>
            <a-button class="tool-btn" type="default" @click.prevent="handleSearch"><template #icon><UploadOutlined /></template>批量导入</a-button>
            <a-button class="tool-btn" type="default" @click.prevent="handleMultDel" v-if="tableSelectedRows.length"><template #icon><DeleteOutlined /></template>批量删除</a-button>
        </div>
        <a-table :dataSource="dataSource" :columns="columns" :loading="tableToading" :row-selection="rowSelection" :rowKey="(record, index) => String(record.uid)" :pagination="paginationObj" @change="handleTableChange"  class="common-table deviceListTable" :rowClassName="() => 'common-table-row'" :scroll="scroll">
            <template #operation="{record}">
                <a @click="handleEdit(record)">修改</a>&nbsp;
                <a @click="handleDel(record)">删除</a>&nbsp;
                <!-- <a @click="handleView(record)">详情</a> -->
            </template>
        </a-table>
        <!-- 删除提示框 -->
        <DataPoint v-if="visibleModal" :visibleModal="visibleModal" :dataPoint="currentDataPoint" :isEdit="isEdit" @update:visible="handleDataPointModal" @update:dataPoint="handleGetPointsList({...searchForm, page: paginationObj.current})" />
    </div>
</template>
<script setup>
import { PlusOutlined, UploadOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { ref, reactive, onMounted, createVNode, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDeviceList, getPointsList, multDelDataPoints, delDataPoint } from '@/api/deviceManage'
import { message, Modal } from 'ant-design-vue'
import { uuid } from '@/utils'
import DataPoint from './editDataPoint.vue'
import CutomSelect from '@/components/global/cutomSelect.vue'

const router = useRouter()
const searchForm = ref({
    device_id: '',
    storable: '',
    point_name: '',
})

const filterOption = (input, option) => {
    console.log(input, option)
    return  option.value.includes(input)
}

// 请求设备列表
const defaultDevice = {id: '', device_name: '全部'}
const deviceList = ref([defaultDevice])
const handleGetDeviceList = () => {
    getDeviceList({page: '0'}).then((res) => {
        deviceList.value = [defaultDevice, ...res.data ]
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
        title: 'ID',
        dataIndex: 'id',
        align: 'center',
        width: 60
    },
    {
        title: '所属设备',
        dataIndex: 'device_name',
        align: 'center'
    },
    {
        title: '所属设备ID',
        dataIndex: 'device_id',
        align: 'center'
    },
    {
        title: '数据点名称',
        dataIndex: 'point_name',
        align: 'center'
    },
    {
        title: '当前值',
        dataIndex: 'measured_value',
        align: 'center',
        width: 140,
        customRender: ({record}) => {
            return record.measured_value || '--'
        }
    },
    {
        title: '数据类型',
        dataIndex: 'data_type',
        align: 'center',
        width: 140
    },
    {
        title: '字节序',
        dataIndex: 'byte_order',
        align: 'center',
        width: 120,
        customRender: ({record}) => {
            return record.byte_order || '--'
        }
    },
    {
        title: '保存策略',
        dataIndex: 'storage_strategy_text',
        align: 'center',
        width: 140
    },
    {
        title: '最后刷新时间',
        dataIndex: 'updated_at',
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
// table 批量删除操作
const handleMultDel = () => {
    Modal.confirm({
        title: '温馨提醒',
        content: '确认批量删除所选项?',
        onOk() {
          const ids = tableSelectedRows.value.map((row) => row.id)
          multDelDataPoints({ids}).then((res) => {
            message.success('操作成功')
            handleGetPointsList({...searchForm.value, page: 1})
          })
        }
    })
}

// 添加数据点操作
const visibleModal = ref(false)
const handleAddDataPoint = () => {
    visibleModal.value = true
}

// 添加|修改数据点回调
const handleDataPointModal = (flag) => {
    currentDataPoint.value = {}
    isEdit.value = false
    visibleModal.value = flag
}

// table修改数据点操作
const currentDataPoint = ref({})
const isEdit = ref(false)
const handleEdit = (record) => {
    currentDataPoint.value = record
    isEdit.value = true
    visibleModal.value = true
}

// tables删除操作
const handleDel = (record) => {
    Modal.confirm({
        title: '温馨提醒',
        content: '确认删除?',
        onOk() {
            delDataPoint(record).then(() => {
                message.success('操作成功')
                const index = dataSource.value.findIndex((item) => item.id == record.id)
                dataSource.value.splice(index, 1);

                const index2 = tableSelectedRows.value.findIndex((item) => item.id == record.id)
                tableSelectedRows.value.splice(index2, 1);

                setTimeout(() => {
                    console.log(dataSource.value.length, dataSource.value)
                    if (dataSource.value.length) return
                    if (paginationObj.value.current == 1) return
                    handleGetPointsList({...searchForm.value, page: paginationObj.value.current - 1})
                })
            })
        }
    })
}

// 数据点操作回调
const handleDataPointCallback = () => {
    console.log('数据点操作回调')
    handleGetPointsList({...searchForm.value, page: paginationObj.current})
}

// 数据处理
const tableToading = ref(false)
const handleGetPointsList = async (params) => {
    tableToading.value = true
    const res = await getPointsList(params).finally(() => {
        tableToading.value = false
    })

    if (!res) return message.error('数据异常！')
    if (!res.data) return message.error('数据为空！')
    // 遍历调整数据展示
    const time_unit_map = {minutes: '分钟', hours: '小时', days: '天'}
    const dataPoints = res.data.map((item, key) => {
        item.uid = uuid(8, 16);
        const {frequency, time_unit} = item.storage_strategy || {}
        item.storage_strategy_text = item.storable ? `间隔${frequency}${time_unit_map[time_unit]}` : '不保存'
        return item
    })
    dataSource.value = dataPoints
    console.log('dataPoints', dataSource.value)
    tableSelectedRows.value = []
    tableSelectedrowkeys.value = []
    // 分页数据
    paginationObj.value.total = res.meta.total
    paginationObj.value.current = res.meta.current_page
}

// 分页处理
const handleTableChange = ({current}) => {
    handleGetPointsList({...searchForm.value, page: current})
}

// 查询
const handleSearch = () => {
    handleGetPointsList({...searchForm.value, page: 1})
}

onMounted(() => {
    handleGetDeviceList()
    handleGetPointsList(searchForm)
})

</script>
<style lang="less">
.data-point-list-warp {
}
</style>
