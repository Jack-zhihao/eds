<template>
    <div class="scene-list-warp common-warp">
        <div class="title">场景列表</div>
        <div class="search-form">
            <div class="search-form-row">
                <div class="search-form-item">
                    <span class="label">组织名称：</span>
                    <a-select v-model:value="searchForm.organization_id">
                        <a-select-option v-for="org in orgList" :value="String(org.id)" :key="org.id">{{ org.organization_name }}</a-select-option>
                    </a-select>
                </div>
                <div class="search-form-item">
                    <span class="label" style="width: 80px;">场景名称：</span>
                    <a-input v-model:value="searchForm.scene_name"></a-input>
                </div>
                <div class="search-form-tool">
                    <a-button type="primary" @click.prevent="handleSearch"><template #icon><SearchOutlined /></template>查询</a-button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <a-button type="default" @click.prevent="handleReset"><template #icon><RedoOutlined /></template>重置</a-button>
                </div>
            </div>
        </div>

        <div class="list-tool-warp">
            <a-button class="tool-btn" type="primary" @click.prevent="handleAddScene"><template #icon><PlusOutlined /></template>添加场景</a-button>
        </div>
        <a-table :dataSource="dataSource" :columns="columns" :loading="tableToading" :pagination="paginationObj" @change="handleTableChange" :rowKey="(record, index) => record.id"  class="common-table deviceListTable" :rowClassName="() => 'common-table-row'" :scroll="scroll">
            <template #saveFunction="record">
                <span>{{ record.storage_strategy_text }}</span>
            </template>
            <template #operation="{record}">
                <a @click="handleView(record)">查看</a>&nbsp;
                <a @click="handleEdit(record)">修改</a>&nbsp;
                <a @click="handleDel(record)">删除</a>
            </template>
        </a-table>
        <SceneModal v-if="visibleModal" :visibleModal="visibleModal" :isEdit="isEdit" :scene="currentScene" :orgOptions="orgOptions"  @update:visible="handleSceneVisible" @update:scene="handleSceneCallback" />
        <ViewModal  v-if="visibleScene" :visibleScene="visibleScene" :scene="currentScene" @update:visible="handleSceneVisible" />
    </div>
</template>
<script setup>
import { PlusOutlined, SearchOutlined, RedoOutlined } from '@ant-design/icons-vue'
import { ref, onMounted } from 'vue'
import { getSceneList, delScene} from '@/api/scenesManage'
import { message, Modal } from 'ant-design-vue'
import { getOrgList } from '@/api/organizationMange'
import { getDeviceList } from '@/api/deviceManage'
import SceneModal from './editScene.vue'
import ViewModal from './viewScene.vue'

const searchForm = ref({
    organization_id: '',
    scene_name: '',
})

// 请求组织列表
const defaultOrg = {id: '', organization_name: '全部'}
const orgList = ref([defaultOrg])
const orgOptions = ref([])
const handleGetOrgList = () => {
    getOrgList({page: 0}).then((res) => {
        orgOptions.value = [ ...res.data ]
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
        title: '场景状态',
        dataIndex: 'scene_status',
        align: 'center',
        width: 80
    },
    {
        title: '所属组织',
        dataIndex: 'organization_name',
        align: 'center'
    },
    {
        title: '分类标签',
        dataIndex: 'category_name',
        align: 'center'
    },
    {
        title: '场景名称',
        dataIndex: 'scene_name',
        align: 'center',
        width: 140
    },
    {
        title: '关联设备数',
        dataIndex: 'devices_count',
        align: 'center',
        width: 100
    },
    {
        title: '关联摄像头',
        dataIndex: 'cameras_count',
        align: 'center',
        width: 120
    },
    {
        title: '场景描述',
        dataIndex: 'storage_strategy',
        align: 'center',
        width: 140
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

// 添加场景操作
const visibleModal = ref(false)
const handleAddScene = () => {
    visibleModal.value = true
}
// 关闭modal回调
const handleSceneVisible = (flag) => {
    currentScene.value = {}
    isEdit.value = false
    visibleModal.value = flag
    visibleScene.value = flag
}

// 更新数据回调
const handleSceneCallback = () => {
    handleGetSceneList({...searchForm.value, page: paginationObj.current})
}

// table修改场景操作
const currentScene = ref({})
const isEdit = ref(false)
const handleEdit = (record) => {
    currentScene.value = {...record}
    isEdit.value = true
    visibleModal.value = true
}

// table查看场景详情操作
const visibleScene = ref(false)
const handleView = (record) => {
    currentScene.value = {...record}
    visibleScene.value = true
}

// tables删除场景操作
const handleDel = (record) => {
    Modal.confirm({
        title: '温馨提醒',
        content: '确认删除?',
        onOk() {
            delScene(record).then(() => {
                message.success('操作成功')
                const index = dataSource.value.findIndex((item) => item.id == record.id)
                dataSource.value.splice(index, 1);

                setTimeout(() => {
                    if (dataSource.value.length) return
                    if (paginationObj.value.current == 1) return
                    handleGetSceneList({...searchForm.value, page: paginationObj.value.current - 1})
                })
            })
        }
    })
}


// 数据处理
const tableToading = ref(false)
const handleGetSceneList = async (params) => {
    tableToading.value = true
    const res = await getSceneList(params).finally(() => {
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
    handleGetSceneList({...searchForm.value, page: current})
}

// 查询
const handleSearch = () => {
    console.log('searchForm', searchForm)
    handleGetSceneList({...searchForm.value, page: 1})
}
// 重置查询
const handleReset = () => {
    searchForm.value.organization_id = ''
    searchForm.value.scene_name = ''
    handleGetSceneList({...searchForm.value, page: 1})
}

onMounted(() => {
    handleGetOrgList()
    handleGetSceneList(searchForm)
})

</script>
<style lang="less">
.scene-list-warp {
}
</style>
