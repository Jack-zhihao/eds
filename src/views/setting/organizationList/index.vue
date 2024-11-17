<template>
    <div class="org-list-warp common-warp">
        <div class="title">组织列表</div>
        <div class="search-form">
            <div class="search-form-row">
                <div class="search-form-item">
                    <span class="label" style="width: 80px;">组织名称：</span>
                    <a-input v-model:value="searchForm.organization_name"></a-input>
                </div>
                <div class="search-form-tool">
                    <a-button type="primary" @click.prevent="handleSearch"><template #icon><SearchOutlined /></template>查询</a-button>
                </div>
            </div>
        </div>

        <div class="list-tool-warp">
            <a-button class="tool-btn" type="primary" @click.prevent="handleAddOrg"><template #icon><PlusOutlined /></template>添加组织</a-button>
        </div>
        <a-table :dataSource="dataSource" :columns="columns" :loading="tableToading" :pagination="false" :rowKey="(record, index) => record.id"  class="common-table deviceListTable" :rowClassName="() => 'common-table-row'" :scroll="scroll">
            <template #saveFunction="record">
                <span>{{ record.storage_strategy_text }}</span>
            </template>
            <template #operation="{record}">
                <a @click="handleView(record)">查看</a>&nbsp;
                <a @click="handleEdit(record)">修改</a>&nbsp;
                <a @click="handleDel(record)">删除</a>
            </template>
        </a-table>
        <OrgModal v-if="visibleModal" :visibleModal="visibleModal" :isEdit="isEdit" :org="currentOrg" :orgOptions="dataSource" @update:visible="handleOrgVisible" @update:org="handleOrgCallback" />
        <ViewModal  v-if="visibleOrg" :visibleOrg="visibleOrg" :org="currentOrg" @update:visible="handleOrgVisible" />
    </div>
</template>
<script setup>
import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { ref, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { getOrgList, delOrg } from '@/api/organizationMange'
import moment from 'moment'
import OrgModal from './editOrg.vue'
import ViewModal from './viewOrg.vue'
console.log(moment(new Date('2024-07-25T10:08:29.000000Z')).format('YYYY-MM-DD HH:mm:ss'))

const searchForm = ref({
    organization_name: ''
})

const columns = [
    {
        title: '组织ID',
        dataIndex: 'id',
        align: 'center',
        width: 80
    },
    {
        title: '组织名称',
        dataIndex: 'organization_name',
        align: 'center'
    },
    {
        title: '上级组织',
        dataIndex: 'parent_id',
        align: 'center',
        customRender: ({record}) => {
            if (record.parent_id == 0) {
                return '无'
            } else {
                const parent_org = dataSource.value.find((org) => org.id == record.parent_id)
                return parent_org ? parent_org.organization_name : '无'
            }

        }
    },
    {
        title: '关联设备数',
        dataIndex: 'devices_count',
        align: 'center',
        width: 140
    },
    // {
    //     title: '位置经纬度',
    //     dataIndex: 'geo_location',
    //     align: 'center',
    //     width: 100,
    //     slots: { customRender: 'geo_location' }
    // },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        align: 'center',
        customRender: ({record}) => {
            const text = record.created_at ? moment(new Date(record.created_at)).format('YYYY-MM-DD HH:mm:ss') : ''
            return text
        }
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

// 添加组织操作
const visibleModal = ref(false)
const handleAddOrg = () => {
    visibleModal.value = true
}
// 关闭modal回调
const handleOrgVisible = (flag) => {
    currentOrg.value = {}
    isEdit.value = false
    visibleModal.value = flag
    visibleOrg.value = flag
}

// 更新数据回调
const handleOrgCallback = () => {
    handleGetOrgList({...searchForm.value})
}

// table修改场景操作
const currentOrg = ref({})
const isEdit = ref(false)
const handleEdit = (record) => {
    currentOrg.value = {...record}
    isEdit.value = true
    visibleModal.value = true
}

// table查看场景详情操作
const visibleOrg = ref(false)
const handleView = (record) => {
    currentOrg.value = {...record}
    visibleOrg.value = true
}

// tables删除场景操作
const handleDel = (record) => {
    Modal.confirm({
        title: '温馨提醒',
        content: '确认删除?',
        onOk() {
            delOrg(record).then(() => {
                message.success('操作成功')
                const index = dataSource.value.findIndex((item) => item.id == record.id)
                dataSource.value.splice(index, 1)
            })
        }
    })
}


// 数据处理
const tableToading = ref(false)
const handleGetOrgList = async (params) => {
    tableToading.value = true
    const res = await getOrgList(params).finally(() => {
        tableToading.value = false
    })

    if (!res) return message.error('数据异常！')
    if (!res.data) return message.error('数据为空！')
    dataSource.value = res.data
}

// 查询
const handleSearch = () => {
    handleGetOrgList({...searchForm.value})
}

onMounted(() => {

    handleGetOrgList({...searchForm.value})
})

</script>
<style lang="less">
.org-list-warp {
}
</style>
