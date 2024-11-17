<template>
    <div class="tasks-list-warp common-warp">
        <div class="title">定时任务列表</div>
        <div class="search-form">
            <div class="search-form-row">
                <div class="search-form-item">
                    <span class="label" style="width: 80px;">关联数据点：</span>
                    <a-input v-model:value="searchForm.point_name"></a-input>
                </div>
                <div class="search-form-item">
                    <span class="label" style="width: 80px;">任务名称：</span>
                    <a-input v-model:value="searchForm.task_name"></a-input>
                </div>
                <div class="search-form-item">
                    <span class="label">任务状态：</span>
                    <a-select v-model:value="searchForm.enabled">
                        <a-select-option :value="''">全部</a-select-option>
                        <a-select-option :value="true">启用</a-select-option>
                        <a-select-option :value="false">禁用</a-select-option>
                    </a-select>
                </div>
                <div class="search-form-tool">
                    <a-button type="primary" @click.prevent="handleSearch"><template #icon><SearchOutlined /></template>查询</a-button>
                </div>
            </div>
        </div>
        <a-table :dataSource="dataSource" :columns="columns" :loading="tableToading" :pagination="paginationObj" @change="handleTableChange" :rowKey="(record, index) => record.id"  class="common-table deviceListTable" :rowClassName="() => 'common-table-row'" :scroll="scroll">
           <template #enabled="{record}">
                <a-switch v-model:checked="record.enabled" @change="handleEnabledChange(record)"></a-switch>
           </template>
        </a-table>
    </div>
</template>
<script setup>
import { SearchOutlined } from '@ant-design/icons-vue'
import { ref, onMounted, createVNode } from 'vue'
import { getTasksList, editTasksStatus } from '@/api/scheduledManage'
import { message } from 'ant-design-vue'

const searchForm = ref({
    organization_id: '',
    tasks_name: '',
    enabled: ''
})


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
const triggerTypeMap = {
    interval: {className: 'tag green-tag', text: '间隔循环'},
    interval1: {className: 'tag blue-tag', text: '定期重复'},
    interval2: {className: 'tag red-tag', text: '单词执行'},
}
const columns = [
    {
        title: '任务ID',
        dataIndex: 'id',
        align: 'center',
        width: 80
    },
    {
        title: '任务名称',
        dataIndex: 'task_name',
        align: 'center',
        width: 240
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
        title: '执行方式',
        dataIndex: 'trigger_type',
        align: 'center',
        with: 200,
        customRender: ({record}) => {
           return createVNode('span', {class: triggerTypeMap[record.trigger_type].className}, triggerTypeMap[record.trigger_type].text)
        }
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        align: 'center',
    }
]
const dataSource = ref([])

// 表格操作
const scroll = ref({ y: 450 })
const handleEnabledChange = (record) => {
    console.log('record', record)
    editTasksStatus({id: record.id, enabled: record.enabled }).then(() => {
        message.success('操作成功')
        handleGetTasksList({...searchForm.value, page: paginationObj.value.current})
    })
}

// 数据处理
const tableToading = ref(false)
const handleGetTasksList = async (params) => {
    tableToading.value = true
    const res = await getTasksList(params).finally(() => {
        tableToading.value = false
    })

    if (!res) return message.error('数据异常！')
    if (!res.data) return message.error('数据为空！')
    dataSource.value = res.data
    // 分页数据
    paginationObj.value.total = res.meta.total
    paginationObj.value.current = res.meta.current_page
}

// 分页处理
const handleTableChange = ({current}) => {
    handleGetTasksList({...searchForm.value, page: current})
}

// 查询
const handleSearch = () => {
    console.log('searchForm', searchForm)
    handleGetTasksList({...searchForm.value, page: 1})
}

onMounted(() => {
    handleGetTasksList(searchForm)
})

</script>
<style lang="less">
.tasks-list-warp {
    .search-form {
        margin-bottom: 20px;
    }
    .tag {
        display: inline-block;
        border-radius: 4px;
        padding: 4px 10px;
        font-size: 12px;
        line-height: 1;
    }
    .green-tag {
        color: #22C55E;
        border: 1px solid #22C55E;
        background-color: #E8FFEA;
    }
    .blue-tag {
        color: #165DFF;
        border: 1px solid #165DFF;
        background-color: #E8F3FF;
    }
    .red-tag {
        color: #F53F3F;
        border: 1px solid #F53F3F;
        background-color: #FFECE8;
    }
}
</style>
