<template>
    <div class="camera-list-warp common-warp">
        <div class="title">摄像头列表</div>
        <div class="search-form">
            <div class="search-form-row">
                <div class="search-form-item">
                    <span class="label">组织名称：</span>
                    <a-select v-model:value="searchForm.organization_id">
                        <a-select-option v-for="org in orgList" :value="String(org.id)" :key="org.id">{{ org.organization_name }}</a-select-option>
                    </a-select>
                </div>
                <div class="search-form-item">
                    <span class="label" style="width: 80px;">关联场景：</span>
                    <a-select v-model:value="searchForm.scene_id">
                        <a-select-option v-for="scene in sceneList" :value="String(scene.id)" :key="scene.id">{{ scene.scene_name }}</a-select-option>
                    </a-select>
                </div>
                <div class="search-form-item">
                    <span class="label" style="width: 80px;">摄像头名称：</span>
                    <a-input v-model:value="searchForm.camera_name"></a-input>
                </div>
                <div class="search-form-tool">
                    <a-button type="primary" @click.prevent="handleSearch"><template #icon><SearchOutlined /></template>查询</a-button>
                </div>
            </div>
            <div class="search-form-row">
                <div class="search-form-item">
                    <span class="label">IP地址：</span>
                    <a-input v-model:value="searchForm.ip"></a-input>
                </div>
                <div class="search-form-item">
                    <span class="label" style="width: 80px;">创建日期：</span>
                    <a-range-picker v-model:value="dateRange" valueFormat="YYYY-MM-DD" :disabledDate="(current) => current && current > moment().endOf('day')" @change="handleDateRange" />
                </div>
                <div class="search-form-item">
                    <span class="label" style="width: 80px;">摄像头状态：</span>
                    <a-select v-model:value="searchForm.online">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option value="true">在线</a-select-option>
                        <a-select-option value="false">离线</a-select-option>
                    </a-select>
                </div>
                <div class="search-form-tool">
                    <a-button type="default" @click.prevent="handleReset"><template #icon><RedoOutlined /></template>重置</a-button>
                </div>
            </div>
        </div>

        <div class="list-tool-warp">
            <a-button class="tool-btn" type="primary" @click.prevent="handleAddCamera"><template #icon><PlusOutlined /></template>添加摄像头</a-button>
            <a-button class="tool-btn" type="default" @click.prevent="handleMultDel" v-if="tableSelectedRows.length"><template #icon><DeleteOutlined /></template>批量删除</a-button>
        </div>
        <a-table :dataSource="dataSource" :columns="columns" :loading="tableToading" :pagination="paginationObj" :row-selection="rowSelection" :rowKey="(record, index) => String(record.uid)" @change="handleTableChange"  class="common-table deviceListTable" :rowClassName="() => 'common-table-row'" :scroll="scroll">
            <template #scenes="{record}">
                <div  class="scene-tag-warp">
                    <span class="scene-tag" v-for="(scene, index) in record.scenes" :key="index">{{ scene.scene_name }}</span>
                </div>
            </template>
            <template #online="{record}">
                <span>{{ record.online ? '在线' : '离线' }}</span>
            </template>
            <template #operation="{record}">
                <a @click="handleView(record)">查看</a>&nbsp;
                <a @click="handleEdit(record)">修改</a>&nbsp;
                <a @click="handleDel(record)">删除</a>
            </template>
        </a-table>
        <CameraModal v-if="visibleModal" :visibleModal="visibleModal" :isEdit="isEdit" :camera="currentCamera" :orgOptions="orgOptions" :sceneOptions="sceneOptions"  @update:visible="handleCameraVisible" @update:scene="handleCameraCallback" />
        <ViewModal  v-if="visibleCamera" :visibleCamera="visibleCamera" :camera="currentCamera" @update:visible="handleCameraVisible" />
    </div>
</template>
<script setup>
import OnlineTagSvg from '@/assets/svg/online_tag.svg'
import OfflineTagSvg from '@/assets/svg/offline_tag.svg'
import { PlusOutlined, SearchOutlined, RedoOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { ref, onMounted, createVNode } from 'vue'
import { getSceneList} from '@/api/scenesManage'
import { getCamerasList, delCameras, multDelCameras} from '@/api/secureManage'
import { message, Modal } from 'ant-design-vue'
import { getOrgList } from '@/api/organizationMange'
import CameraModal from './editCamera.vue'
import ViewModal from './viewCamera.vue'
import { uuid } from '@/utils'
import moment from 'moment'

const defaultForm = {
    organization_id: '',
    scene_id: '',
    camera_name: '',
    ip: '',
    online: '',
    time_start: '',
    time_end: ''
}
const searchForm = ref({...defaultForm})

// 日期区间数据处理
const dateRange = ref([])
const handleDateRange = (range) => {
    searchForm.value.time_start = range[0] || ''
    searchForm.value.time_end = range[1] || ''
}

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

// 请求场景列表
const defaultScene = {id: '', scene_name: '全部'}
const sceneList = ref([defaultOrg])
const sceneOptions = ref([])
const handleGetSceneList = () => {
    getSceneList({page: 0}).then((res) => {
        sceneOptions.value = [...res.data]
        sceneList.value = [defaultScene, ...res.data]
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
        width: 80
    },
    {
        title: '摄像头名称',
        dataIndex: 'camera_name',
        align: 'center'
    },
    {
        title: '厂商品牌',
        dataIndex: 'brand_name',
        align: 'center'
    },
    {
        title: 'IP地址',
        dataIndex: 'ip',
        align: 'center',
        width: 140
    },
    {
        title: '端口号',
        dataIndex: 'port',
        align: 'center',
        width: 100
    },
    {
        title: '设备账号',
        dataIndex: 'username',
        align: 'center',
    },
    {
        title: '关联摄像头',
        dataIndex: 'scenes',
        align: 'center',
        slots: { customRender: 'scenes' }
    },
    {
        title: '在线状态',
        dataIndex: 'online',
        align: 'center',
        width: 140,
        customRender: ({record}) => {
            const onlineMap = {
                false: () => createVNode('span', {}, [createVNode('img', {src: OfflineTagSvg}), ' 离线']),
                true: () => createVNode('span', {}, [createVNode('img', {src: OnlineTagSvg}), ' 在线']),
            }
            return onlineMap[record.online]()
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


// tables删除摄像头操作
const handleDel = (record) => {
    Modal.confirm({
        title: '温馨提示',
        content: '确定要删除摄像头吗?',
        onOk() {
            delCameras(record).then(() => {
                message.success('操作成功')
                const index = dataSource.value.findIndex((item) => item.id == record.id)
                dataSource.value.splice(index, 1);

                const index2 = tableSelectedRows.value.findIndex((item) => item.id == record.id)
                tableSelectedRows.value.splice(index2, 1);

                setTimeout(() => {
                    if (dataSource.value.length) return
                    if (paginationObj.value.current == 1) return
                    handleGetCameraList({...searchForm.value, page: paginationObj.value.current - 1})
                })
            })
        }
    })
}

// table 批量修改操作
const handleMultDel = () => {
    Modal.confirm({
        title: '温馨提醒',
        content: '确认批量删除所选摄像头吗?',
        onOk() {
          const ids = tableSelectedRows.value.map((row) => row.id)
          multDelCameras({ids}).then((res) => {
            message.success('操作成功')
            handleGetCameraList({...searchForm.value, page: 1})
          })
        }
    })
}
// 添加摄像头操作
const visibleModal = ref(false)
const handleAddCamera = () => {
    visibleModal.value = true
}
// 关闭modal回调
const handleCameraVisible = (flag) => {
    currentCamera.value = {}
    isEdit.value = false
    visibleModal.value = false
    visibleCamera.value = false
}

// 更新数据回调
const handleCameraCallback = () => {
    handleGetCameraList({...searchForm.value, page: paginationObj.current})
}

// table修改摄像头操作
const currentCamera = ref({})
const isEdit = ref(false)
const handleEdit = (record) => {
    currentCamera.value = {...record}
    isEdit.value = true
    visibleModal.value = true
}

// table查看摄像头详情操作
const visibleCamera = ref(false)
const handleView = (record) => {
    currentCamera.value = {...record}
    visibleCamera.value = true
}

// 数据处理
const tableToading = ref(false)
const handleGetCameraList = async (params) => {
    const onlineMap = {'true': 1, 'false': 0}
    params.online = onlineMap[params.online]
    tableToading.value = true
    const res = await getCamerasList(params).finally(() => {
        tableToading.value = false
    })

    if (!res) return message.error('数据异常！')
    if (!res.data) return message.error('数据为空！')
    dataSource.value = res.data.map((item) => {
        item.uid = uuid()
        return item
    })

    tableSelectedRows.value = []
    tableSelectedrowkeys.value = []
    // 分页数据
    paginationObj.value.total = res.meta.total
    paginationObj.value.current = res.meta.current_page
}

// 分页处理
const handleTableChange = ({current}) => {
    handleGetCameraList({...searchForm.value, page: current})
}

// 查询
const handleSearch = () => {
    console.log('searchForm', searchForm)
    handleGetCameraList({...searchForm.value, page: 1})
}
// 重置查询
const handleReset = () => {
    searchForm.value = defaultForm
    handleGetCameraList({...searchForm.value, page: 1})
}

onMounted(() => {
    handleGetOrgList()
    handleGetSceneList()

    handleGetCameraList(searchForm)
})

</script>
<style lang="less">
.camera-list-warp {
    .scene-tag-warp {
        display: flex;
        flex-wrap: wrap;
    }
    .scene-tag {
        display: inline-block;
        flex-shrink: 0;
        padding: 2px;
        text-wrap: nowrap;
        border: 1px solid #22C55E;
        border-radius: 2px;
        font-size: 10px;
        color: #22C55E;
        margin: 0 2px;
    }
}
</style>
