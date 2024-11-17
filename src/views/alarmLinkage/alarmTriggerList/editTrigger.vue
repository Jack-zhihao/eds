<><template>
    <a-modal v-model:visible="props.visibleModal" :closable="false" :footer="null" :bodyStyle="{ width: '630px', height: '750px' }" :width="630"
        class="common-modal edit-trigger-modal">
        <div class="header">
            <p class="title">{{props.isEdit ? '修改触发器' : '添加触发器'}}</p>
            <span class="icon-close" @click="handleBack"></span>
        </div>
        <a-form ref="modalFormRef" :model="modalForm" :rules="modalFormRules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-form-item label="触发器名称：" name="trigger_name">
                    <a-input v-model:value="modalForm.trigger_name" placeholder="请输入触发器名称" />
                </a-form-item>
                <a-form-item  label="所属组织：" name="organization_id">
                    <a-select v-model:value="modalForm.organization_id" placeholder="请选择所属组织"  @change="handleOrgChange">
                        <a-select-option v-for="org in props.orgOptions" :value="String(org.id)" :key="org.id">{{ org.organization_name }}</a-select-option>
                    </a-select>
                </a-form-item>
                <div class="custom-form-item">
                    <a-form-item label="所属设备：" name="device_id" :label-col="{ span: 7 }" :wrapper-col="{ span:  16 }">
                        <a-select v-model:value="modalForm.device_id" show-search optionFilterProp="label" placeholder="请选择所属设备"  @change="handleDeviceChange">
                        <a-select-option v-for="device in deviceOptions"  :key="device.id" :value="String(device.id)" :label="device.device_name">{{device.device_name}}</a-select-option>
                    </a-select>
                    </a-form-item>
                    <a-form-item label="" name="point_id" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                        <a-select v-model:value="modalForm.point_id" placeholder="请选择数据点" @change="handleDataPointChange">
                            <a-select-option v-for="dataPoint in dataPointOptions" :value="String(dataPoint.id)" :key="String(dataPoint.id)">{{ dataPoint.point_name }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </div>
                <div class="custom-form-item">
                    <a-form-item label="触发条件：" name="condition_identifier" :label-col="{ span: 7 }" :wrapper-col="{ span:  16 }">
                        <a-select v-model:value="modalForm.condition_identifier" placeholder="请选择触发条件">
                            <a-select-option v-for="condition in conditionOptions" :value="condition.value" :key="condition.value">{{ condition.label }}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="" name="threshold_max" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" v-if="['GT'].includes(modalForm.condition_identifier)">
                        <a-input v-model:value="modalForm.threshold_max" placeholder="请输入阈值B的值"/>
                    </a-form-item>
                    <a-form-item label="" name="threshold_min" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" v-if="['LT', 'EQ'].includes(modalForm.condition_identifier)">
                        <a-input v-model:value="modalForm.threshold_min" placeholder="请输入阈值A的值" />
                    </a-form-item>
                </div>
                <a-form-item label="启用报警：" name="enable_alarm">
                    <a-switch v-model:checked="modalForm.enable_alarm" />
                </a-form-item>
                <template v-if="modalForm.enable_alarm">
                    <a-form-item label="报警推送内容：" name="alarm_push_text">
                        <a-textarea v-model:value="modalForm.alarm_push_text" :rows="3" placeholder="请输入报警推送内容" />
                    </a-form-item>
                    <a-form-item label="恢复正常内容：" name="return_normal_text">
                        <a-textarea v-model:value="modalForm.return_normal_text" :rows="3" placeholder="请输入恢复正常内容" />
                    </a-form-item>
                </template>
                <a-form-item label="启用联动：" name="enable_linkage">
                    <a-switch v-model:checked="modalForm.enable_linkage" />
                </a-form-item>
                <template v-if="modalForm.enable_linkage">
                    <a-form-item label="联动类型：" name="linkage_type">
                        <a-select v-model:value="modalForm.linkage_type" placeholder="请选择联动类型">
                            <a-select-option value="read">采集</a-select-option>
                            <a-select-option value="write">控制</a-select-option>
                        </a-select>
                    </a-form-item>
                    <div class="custom-form-item">
                        <a-form-item label="联动变量：" name="linkage_meta_device_id" :label-col="{ span: 7 }" :wrapper-col="{ span:  16 }">
                            <a-select v-model:value="modalForm.linkage_meta_device_id" placeholder="请选择设备" @change="handleLinkageDeviceChange">
                                <a-select-option v-for="device in deviceOptions" :value="String(device.id)" :key="String(device.id)">{{ device.device_name }}</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="" name="linkage_meta_point_id" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                            <a-select v-model:value="modalForm.linkage_meta_point_id" placeholder="请选择变量">
                                <a-select-option v-for="dataPoint in linkageDataPointOptions" :value="String(dataPoint.id)" :key="String(dataPoint.id)">{{ dataPoint.point_name }}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </div>
                    <a-form-item label="下发的数据：" name="write_data" v-if="modalForm.linkage_type == 'write'">
                        <a-input v-model:value="modalForm.write_data" placeholder="请输入下发的数据" />
                    </a-form-item>
                </template>
            </a-form>
        <div class="common-tool-warp">
            <a-button class="cancel-btn" type="default" @click="handleBack">取消</a-button>
            <a-button :loading="submitLoading" @click="handleVerifiFiled" class="confirm-btn" type="primary">{{ props.isEdit ? '保存修改' : '保存添加'}}</a-button>
        </div>
    </a-modal>
</template>
<script setup>
import { defineEmits, defineProps, ref, onMounted } from 'vue'
import { getDeviceDetail, getDeviceList, getDataPoint } from '@/api/deviceManage'
import { addTriggers, editTriggers } from '@/api/alarmLinkage'
import { message } from 'ant-design-vue'
const props = defineProps({
    visibleModal: {
        type: Boolean,
        default: false
    },
    isEdit: {
        type: Boolean,
        default: false
    },
    orgOptions: {
        type: Array,
        default: () => []
    },
    trigger: {
        type: Object,
        default: () => {}
    }
})

const emit = defineEmits(['update:visible', 'update:trigger'])

const vaildNumber = (rules, value) => {
    return new Promise((resolve, reject) => {
        if (isNaN(Number(value))) return reject('请输入数字格式')
        resolve()
    })
}
const modalFormRules = ref({
    trigger_name: [
        { required: true, message: '请输入触发器名称', trigger: 'blur' }
    ],
    organization_id: [
        { required: true, message: '请选择所属组织', trigger: 'change' }
    ],
    device_id: [
        { required: true, message: '请选择所属设备', trigger: 'change' }
    ],
    point_id: [
        { required: true, message: '请选择数据点', trigger: 'change' }
    ],
    condition_identifier: [
        { required: true, message: '请选择触发条件', trigger: 'change' }
    ],
    threshold_max: [
        { required: true, message: '请输入阈值B的值', trigger: 'change' },
        { validator: vaildNumber, trigger: 'change' }
    ],
    threshold_min: [
        { required: true, message: '请输入阈值A的值', trigger: 'change' },
        { validator: vaildNumber, trigger: 'change' }
    ],
    linkage_type: [
        { required: true, message: '请选择联动类型', trigger: 'change' }
    ],
    linkage_meta_device_id: [
        { required: true, message: '请选择联动设备', trigger: 'change' }
    ],
    linkage_meta_point_id: [
        { required: true, message: '请选择变量', trigger: 'change' }
    ],
    write_data: [
        { required: true, message: '请输入下发内容', trigger: 'change' },
        { validator: vaildNumber, trigger: 'change' }
    ],
    alarm_push_text: [
        { required: true, message: '请输入报警推送内容', trigger: 'change' },
    ],
    return_normal_text: [
        { required: true, message: '请输入回复正常内容', trigger: 'change' },
    ]
})
const modalForm = ref({
    device_id: null,
    point_id: null,
    trigger_name: null,
    condition_identifier: null,
    threshold_min: 0,
    threshold_max: 0,
    enable_alarm: false,
    alarm_push_text: '',
    return_normal_text: '',
    enable_linkage: false,
    linkage_type: null,
    linkage_meta_device_id: null,
    linkage_meta_point_id: null,
    write_data: null,
})

// 组织机构和设备联动
const deviceOptions = ref([])
const handleOrgChange = (organization_id) => {
    getDeviceList({page: 0, organization_id}).then((res) => {
        deviceOptions.value = res.data
        // 更改组织所属时，所属设备和数据点和触发条件置空
        modalForm.value.device_id = null
        modalForm.value.point_id = null
        modalForm.value.condition_identifier = null
        modalForm.value.threshold_min = null
        modalForm.value.threshold_max = null

        modalForm.linkage_meta_device_id = null
        modalForm.linkage_meta_point_id = null
    })
}

// 所属设备和数据点联动
const dataPointOptions = ref([])
const handleDeviceChange = (device_id) => {
    getDeviceDetail({id: device_id}).then((res) => {
        dataPointOptions.value = res.data.points
        // 更改所属设备时，数据点置空
        modalForm.value.point_id = null
        modalForm.value.condition_identifier = null
        modalForm.value.threshold_min = null
        modalForm.value.threshold_max = null
    })
}
// 设备数据点和触发条件联动
const currentDataPoint = ref({})
const handleDataPointChange = (dataPoint_id) => {
    currentDataPoint.value = dataPointOptions.value.find((dataPoint) => dataPoint.id == dataPoint_id)
    modalForm.value.condition_identifier = null
    modalForm.value.threshold_min = null
    modalForm.value.threshold_max = null
    reponseDeviceChange()
}

// 设备功能码和触发条件联动
const conditionOptions12 = [{label: '当开关为ON', value: 'ON'}, {label: '当开关为OFF',value: 'OFF'}]
const conditionOptions34 = [{label: '当值大于B', value: 'GT'}, {label: '当值小于A',value: 'LT'},  {label: '当值等于A',value: 'EQ'}]

const conditionOptions = ref([])
const reponseDeviceChange = () => {
    const func_code_map = [1,2]
    if (!currentDataPoint.value.function_code) {
        conditionOptions.value = []
        return
    }
    if (func_code_map.includes(currentDataPoint.value.function_code)) {
        conditionOptions.value = conditionOptions12
    } else {
        conditionOptions.value = conditionOptions34
    }
}

// 联动变量的设备和数据点个组织联动
const linkageDataPointOptions = ref([])
const handleLinkageDeviceChange = (device_id) => {
    getDeviceDetail({id: device_id}).then((res) => {
        linkageDataPointOptions.value = res.data.points
    })
}


const handleBack = () => {
    emit('update:visible', false)
}

const modalFormRef = ref()
const submitLoading = ref(false)
const handleVerifiFiled = () => {
    submitLoading.value = true
    modalFormRef.value.validate().then((valid) => {
        const params = formatParams({...modalForm.value})
        handleMap[Number(props.isEdit)](params)
    }).catch(() => {
        submitLoading.value = false
    })
}

// 整理数据提交
const formatParams = (params) => {
    params.threshold_min = Number(params.threshold_min)
    params.threshold_max = Number(params.threshold_max)

    if (params.enable_alarm) {
        params.alarm_meta = {
            alarm_push_text: params.alarm_push_text,
            return_normal_text: params.return_normal_text
        }
    }

    if (params.enable_linkage) {
        params.linkage_meta = {
            linkage_type: params.linkage_type,
            point_id: params.linkage_meta_point_id,
            write_data: params.write_data
        }
    }

    delete params.alarm_push_text
    delete params.return_normal_text
    delete params.linkage_type
    delete params.linkage_meta_device_id
    delete params.linkage_meta_point_id
    delete params.write_data
    return params
}

// 整理数据回显
const formatParamsView = (params) => {
    console.log('params', params)
    params.point_id = String(params.point_id)
    if (params.alarm_meta) {
        params.alarm_push_text = params.alarm_meta.alarm_push_text
        params.return_normal_text = params.alarm_meta.return_normal_text
    }
    if (params.linkage_meta) {
        params.linkage_meta_point_id = params.linkage_meta.point_id
        params.write_data = params.linkage_meta.write_data
        params.linkage_type = params.linkage_meta.linkage_type
    }

    params.threshold_max = String(params.threshold_max)
    params.threshold_min = String(params.threshold_min)

    delete params.alarm_meta
    delete params.linkage_meta
    return params
}

// 异步初始化回显
const asyncParamsView= () => {
    // 初始化机构
    const org = props.orgOptions.find((item) => item.organization_name === modalForm.value.organization_name)
    modalForm.value.organization_id = String(org.id)
    // 初始化所属设备
    getDeviceList({page: 0, organization_id: org.id}).then((res) => {
        deviceOptions.value = res.data
    })
    // 初始化所属数据点
    getDataPoint(modalForm.value.point_id).then((point) => {
        if([1,2].includes(point.data.function_code)) {
            conditionOptions.value = conditionOptions12
        } else {
            conditionOptions.value = conditionOptions34
        }
        getDeviceDetail({id: modalForm.value.device_id ||  modalForm.value.devicd_id}).then((device) => {
            dataPointOptions.value = device.data.points
        })
    })

    // 初始化联动变量
    if (modalForm.value.linkage_meta_point_id) {
        getDataPoint(modalForm.value.linkage_meta_point_id).then((point) => {
            modalForm.value.linkage_meta_device_id = String(point.data.device_id)
            getDeviceDetail({id: point.data.device_id}).then((device) => {
                linkageDataPointOptions.value = device.data.points
            })
        })
    }

}


const handleMap = {
    0: (params) => {// 新增数据点接口
        addTriggers(params).then(() => {
            emit('update:trigger')
            handleBack()
        }).finally(() => {
            submitLoading.value = false
        })
    },
    1: (params) => {
        editTriggers(params).then(() => {
            message.success('修改成功')
            emit('update:trigger')
            handleBack()
        }).finally(() => {
            submitLoading.value = false
        })
    }
}


onMounted(() => {
    if (!props.isEdit) return
    console.log('props.trigger', props.trigger)
    modalForm.value = formatParamsView({...props.trigger})
    asyncParamsView()
})
</script>

<style lang="less">
.edit-trigger-modal {
    .ant-modal-body {
        padding-bottom: 56px;
        box-sizing: border-box;
    }

    .header {
        flex-shrink: 0;
    }
    .ant-form {
        height: 650px;
        overflow-y: auto
    }
}

.custom-form-item {
    display: flex;
    // .ant-form-item-control-input-content {
    //     display: flex;
    //     & > div:first-of-type {
    //         margin-right: 20px;
    //         width: calc(50% - 10px);
    //         flex-shrink: 0;
    //     }
    // }
    .ant-row {
        &:last-of-type {
            width: 43%;
        }
        &:first-of-type {
            width: 57%;
            flex-shrink: 0;
        }
    }
}
</style>
