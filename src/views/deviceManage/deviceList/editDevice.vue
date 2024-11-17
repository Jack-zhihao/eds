<template>
    <div class="add-device-warp common-warp">
        <div class="edit-warp">
            <div class="title">修改设备</div>
            <div class="device-info-warp">
                <div class="device-pane device-baseinfo">
                    <p class="title">基本信息</p>
                    <a-form ref="baseFormRef" :model="baseForm" :rules="baseFormRules" :label-col="labelCol"
                        :wrapper-col="wrapperCol">
                        <a-form-item  label="设备名称：" name="device_name">
                            <a-input v-model:value="baseForm.device_name" placeholder="请输入设备名称" />
                        </a-form-item>
                        <a-form-item  label="所属组织：" name="organization_id">
                            <a-select v-model:value="baseForm.organization_id" placeholder="请选择所属组织">
                                <a-select-option v-for="org in orgList" :value="String(org.id)" :key="org.id">{{ org.organization_name }}</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item  label="设备描述：" name="description">
                            <a-textarea v-model:value="baseForm.description" :rows="5" placeholder="请输入描述信息" />
                        </a-form-item>
                    </a-form>
                </div>
                <div class="device-pane device-pic">
                    <p class="title">设备图片</p>
                    <a-upload v-model:file-list="fileList" name="avatar" accept=".jpg,.png,jpeg" list-type="picture-card"
                        class="avatar-uploader" :show-upload-list="false" :customRequest="customRequest">
                        <img v-if="img_url" :src="img_url" alt="avatar" />
                        <div v-else>
                            <loading-outlined v-if="loading"></loading-outlined>
                            <plus-outlined v-else></plus-outlined>
                            <a-button class="upload-btn" type="primary" ghost v-else>
                                <template #icon>
                                    <UploadSvgIcon />
                                </template>&nbsp;点击上传
                            </a-button>
                        </div>
                    </a-upload>
                </div>
                <div class="device-pane device-address">
                    <p class="title">位置信息</p>
                    <a-form class="address-form" ref="addressFormRef" :model="addressForm" :rules="addressFormRules"
                        :label-col="labelCol" :wrapper-col="wrapperCol">
                        <a-form-item  label="经纬度：" name="geo_location">
                            <a-input v-model:value="addressForm.geo_location" placeholder="请输入经纬度" />
                        </a-form-item>
                        <a-form-item  label="地址：" name="address">
                            <a-input v-model:value="addressForm.address" placeholder="请输入地址" />
                        </a-form-item>
                    </a-form>
                    <div class="address-warp">
                        <Amap :lnglat="formatLnglat(addressForm.geo_location || '')" @update:lnglat="handleChildlnglat" />
                    </div>
                </div>
            </div>
            <div class="device-pane data-setting">
                <p class="title">数据源设置</p>
                <a-form ref="baseDataFormRef" class="data-setting-form" :model="baseDataForm" :rules="baseDataFormRules" :label-col="{ span: 6 }"
                        :wrapper-col="{ span: 18 }">
                        <a-form-item  label="串口服务器IP：" name="modbus_host">
                            <a-input v-model:value="baseDataForm.modbus_host" placeholder="请输入IP地址" />
                        </a-form-item>
                        <a-form-item  label="端口号：" name="port">
                            <a-input v-model:value="baseDataForm.port" placeholder="请输入端口号" />
                        </a-form-item>
                        <a-form-item  label="Slave设备地址：" name="slave">
                            <a-input v-model:value="baseDataForm.slave" placeholder="请输入Slave设备地址" />
                        </a-form-item>
                    </a-form>
            </div>
        </div>
        <div class="data-point-warp">
            <div class="title">设备数据点</div>
            <div class="data-point-tool">
                <a-button class="tool-btn" style="margin-right: 20px;" type="primary" @click.prevent="() => visibleModal = true"><template #icon><PlusOutlined /></template>添加数据点</a-button>
                <!-- <a-button class="tool-btn" type="default" @click.prevent="handleMultImport"><template #icon><UploadOutlined /></template>数据导入</a-button> -->
            </div>
            <a-table :dataSource="pointDataSource" :columns="pointDataColumns" :pagination="false"  class="common-table deviceInpoint-list-table" :rowClassName="() => 'common-table-row'">
                <template #operation="{record}">
                    <a @click="handleEdit(record)">修改</a>&nbsp;
                    <a @click="handleTrigger(record)">触发器</a>&nbsp;
                    <a @click="handleDel(record)">删除</a>
                </template>
            </a-table>
        </div>
        <DataPoint v-if="visibleModal" :visibleModal="visibleModal" :isEdit="isEdit" :dataPoint="dataPoint" :deviceId="baseForm.id" @update:visible="handleDataPointCallback" @update:dataPoint="handleGetDeviceDetail" />
        <ViewTrigger v-if="visibleTrigger" :visibleTrigger="visibleTrigger" :dataPoint="dataPoint" @update:visible="handleDataPointCallback" />
        <div class="common-tool-warp">
            <a-button class="cancel-btn" type="default" @click="handleBackList">返回列表</a-button>
            <a-button :loading="submitLoading" @click="handleVerifiFiled" class="confirm-btn" type="primary">提交保存</a-button>
        </div>
    </div>
</template>
<script setup>
import UploadSvg from '@/assets/svg/upload.svg'
import { PlusOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { defineComponent, ref, createVNode, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { upload } from '@/api/common'
import Amap from './amap.vue'
import { getDeviceDetail, updateDevices, delDataPoint } from '@/api/deviceManage'
import { getOrgList } from '@/api/organizationMange'
// 添加|修改数据点弹出框
import DataPoint from '../dataPointList/editDataPoint.vue';
import { formatLnglat } from '@/utils'
import ViewTrigger from './viewTrigger.vue'

const router = useRouter()
const route = useRoute()
// 基本信息
const labelCol = { span: 5 }
const wrapperCol = { span: 19 }
const baseFormRules = ref({
    device_name: [
        { required: true, message: '请输入设备名称', trigger: 'blur' },
        { min: 3, message: '设备名称不少于3位字符', trigger: 'blur' },
    ],
    organization_id: [{ required: true, message: '请选择所属组织', trigger: 'change' }],
    description: [
        // { required: true, message: '请输入设备描述', trigger: 'change' },
        { min: 4, message: '描述内容不少于4位字符', trigger: 'blur' },
    ]
})
const baseForm = ref({
    id: '',
    device_name: '',
    organization_id: '',
    description: ''
})
// 获取组织列表
const orgList = ref([])
const handleGetOrgList = () => {
    getOrgList().then((orgData) => {
        orgList.value = orgData.data.map((org) => {
            org.organization_id = String(org.organization_id)
            return org
        })
    })
}

// 设备图片
const UploadSvgIcon = createVNode('img', { src: UploadSvg, style: { width: '14px', height: '14px', marginRight: '4px', verticalAlign: 'sub' } })
const img_url = ref('')
const fileList = ref([])
const loading = ref(false)

const customRequest = (File) => {
    const formData = new FormData();
    formData.append('file', File.file)
    upload(formData).then((res) => {
        console.log(res)
        message.success('上传成功！')
        img_url.value = res.data.url
    }).catch((error) => {
        console.log(error)
        message.error('上传失败！')
    })
}

// 位置信息
const addressFormRules = ref({
    geo_location: [{ required: true, message: '请输入经纬度', trigger: 'blur' }],
    address: [
        { required: true, message: '请输入地址', trigger: 'blur' },
        { min: 6, message: '地址长度不少于6位字符', trigger: 'blur' },
    ]
})
const addressForm = ref({
    geo_location: '',
    address: ''
})
const handleChildlnglat = ({lng, lat}) => {
    addressForm.value.geo_location = `${lng},${lat}`
    console.log(addressForm.value.geo_location)
}

// 源数据设置
const baseDataFormRules = ref({
    modbus_host: [{required: true, message: '请输入IP地址', trigger: 'blur'}],
    port: [{required: true, message: '请输入端口号', trigger: 'blur'}],
    slave: [{required: true, message: '请输入Slave设备号', trigger: 'blur'}]
})
const baseDataForm = ref({
    modbus_host: '',
    port: '',
    slave: ''
})

// vaildFiled操作
const submitLoading = ref(false)
const baseFormRef = ref()
const addressFormRef = ref()
const baseDataFormRef = ref()
const handleVerifiFiled = () => {
    submitLoading.value = true
    const verfiFunction = [
        baseFormRef.value.validate(),
        addressFormRef.value.validate(),
        baseDataFormRef.value.validate(),
    ]
    Promise.all(verfiFunction).then(() => {
        if (!img_url.value) {
            submitLoading.value = false
            return  message.error('请上传设备图片')
        }
        saveDevices()
    }).catch((err) => {
        submitLoading.value = false
        console.log(err)
        message.error('请完善设备信息')
    })
}

// 数据点table
const pointDataSource = ref([])
const pointDataColumns = [{
        title: 'ID',
        dataIndex: 'id',
        align: 'center'
    },
    {
        title: '数据点名称',
        dataIndex: 'point_name',
        align: 'center'
    },
    {
        title: '功能码',
        dataIndex: 'function_code',
        align: 'center'
    },
    {
        title: '寄存器地址',
        dataIndex: 'modbus_host',
        align: 'center'
    },
    {
        title: '数据类型',
        dataIndex: 'data_type',
        align: 'center',
        width: 80
    },
    {
        title: '字节序',
        dataIndex: 'byte_order',
        align: 'center',
        customRender: ({record}) => {
            return record.byte_order || '--'
        }
    },
    {
        title: '单位符号',
        dataIndex: 'unit_symbol',
        align: 'center',
        customRender: ({record}) => {
            return record.unit_symbol || '--'
        }
    },

    {
        title: '数据保存频率',
        dataIndex: 'storage_strategy_text',
        align: 'center',
        customRender: ({record}) => {
            return record.storage_strategy_text || '--'
        }
    },
    {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        align: 'center',
        slots: { customRender: 'operation' }
    }]

// modal关闭回调操作
const visibleModal = ref(false)
const handleDataPointCallback = (flag) => {
    visibleModal.value = flag
    visibleTrigger.value = flag
    isEdit.value = false
    dataPoint.value = {}
}

// 数据点修改
const isEdit = ref(false)
const dataPoint = ref({})
const handleEdit = (record) => {
    isEdit.value = true
    visibleModal.value = true
    dataPoint.value = Object.assign({}, record)
}

// 数据点删除
const handleDel = (record) => {
    Modal.confirm({
        title: '温馨提醒',
        content: '确认删除?',
        onOk() {
            delDataPoint(record).then((res) => {
                message.success('操作成功')
                handleGetDeviceDetail()
                const index = pointDataSource.value.findIndex((item) => item.id == record.id)
                pointDataSource.value.splice(index, 1);
            })
        }
    })
}

// 触发器
const visibleTrigger = ref(false)
const handleTrigger = (record) => {
    visibleTrigger.value = true
    dataPoint.value = Object.assign({}, record)
}

// 获取设备详情
const time_unit_map = {minutes: '分钟', hours: '小时', days: '天'}
const handleGetDeviceDetail = () => {
    const id = route.query.id
    getDeviceDetail({id}).then((res) => {
        if (!res || !res.data) return

        const devices = res.data
        baseForm.value = {
            id: devices.id,
            device_name: devices.device_name,
            organization_id: String(devices.organization_id),
            description: devices.description
        }
        addressForm.value = {
            geo_location: devices.geo_location,
            address: devices.address,
        }

        baseDataForm.value = {
            modbus_host: devices.modbus_host,
            port: String(devices.port),
            slave: String(devices.slave)
        }
        img_url.value = devices.img_url

        pointDataSource.value = devices.points.map((item) => {
            item.key = item.id
            const {frequency, time_unit} = item.storage_strategy || {}
            item.storage_strategy_text = time_unit ? `间隔${frequency}${time_unit_map[time_unit]}` : ''
            return item
        })
    })
}

// 保存操作
const saveDevices = () => {
    const picObj = { img_url: img_url.value }
    const params = {...baseForm.value, ...addressForm.value, ...baseDataForm.value, ...picObj, organization_id: Number(baseForm.value.organization_id)}
    console.log('params', params)
    updateDevices(params).then((res) => {
        message.success('操作成功')
    }).finally(() => {
        submitLoading.value = false
    })
}

const handleBackList = () => {
    router.push({name: 'deviceList'})
}

onMounted(() => {
    handleGetOrgList()
    handleGetDeviceDetail()
})


</script>
<style lang="less">
@import url('@/styles/theme.less');

.add-device-warp {
    background-color: transparent;
    padding: 0;
    .edit-warp {
        background-color: @main-bg-color;
        padding: 20px 20px 0;
        box-sizing: border-box;
        height: auto;
    }
    .device-info-warp {
        display: flex;
        justify-content: space-between;
        padding: 0 20px 20px;
        box-sizing: border-box;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);

        .title {
            font-size: 14px;
            color: @main-text-color;
            font-weight: bold;
            flex-shrink: 0;
        }

        .device-pane {
            width: 33%;
            height: 260px;
            display: flex;
            flex-direction: column;
            margin: 10px;
        }

        .device-pic {
            width: 26%;
        }
    }

    .address-form {
        .ant-form-item {
            margin-bottom: 5px;

            .ant-form-item-explain {
                // display: none;
            }
        }
    }

    .address-warp {
        width: 100%;
        height: 200px
    }

    .data-setting {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px 30px 0;
        box-sizing: border-box;

        .title {
            font-size: 14px;
            color: @main-text-color;
            font-weight: bold;
            flex-shrink: 0;
        }
        .data-setting-form {
            width: 100%;
            display: flex;
            justify-content: space-between;
            .ant-form-item {
                width: 33%;
            }
        }
    }
}
.data-point-warp {
    background-color: @main-bg-color;
    padding: 20px 20px 30px;
    box-sizing: border-box;
    margin-top: 20px;
    .data-point-tool {
        margin-bottom: 20px;
    }
}

.avatar-uploader {
    height: calc(100% - 30px);
    width: 100%;
    display: flex;
    overflow: hidden;
    background-color: @main-bg-color;

    .ant-upload.ant-upload-select-picture-card {
        width: 100%;
        height: 100%;
        margin: 0;

        img {
            object-fit: cover;
            width: 100%;
            height: 100%;
        }

        .upload-btn {
            background-color: @hover-bg-color !important;
            border: none;
        }
    }
}

.deviceInpoint-list-table {
    padding-bottom: 0;
    height: auto
}
</style>
