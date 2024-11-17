<template>
    <a-modal v-model:visible="props.visibleModal" :closable="false" :footer="null" :bodyStyle="bodyStyle" :width="680"
        class="common-modal">
        <div class="header">
            <p class="title">{{props.isEdit ? '修改数据点' : '添加数据点'}}</p>
            <span class="icon-close" @click="handleBack"></span>
        </div>
        <a-form ref="dataPointFormRef" :model="dataPointForm" class="data-point-form" :rules="dataPointFormRules"
            :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <div style="width: 50%;">
                <a-form-item label="数据点名称：" name="point_name">
                    <a-input v-model:value="dataPointForm.point_name" placeholder="请输入数据点名称" />
                </a-form-item>
                <a-form-item label="归属设备：" name="device_id">
                    <a-select v-model:value="dataPointForm.device_id" show-search optionFilterProp="label" placeholder="请选择归属设备">
                        <a-select-option v-for="device in deviceOptions"  :key="device.id" :value="String(device.id)" :label="device.device_name">{{device.device_name}}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="功能码：" name="function_code">
                    <a-select v-model:value="dataPointForm.function_code" placeholder="请选择功能码" @change="funcCodeLinkage">
                        <a-select-option v-for="funcCode in funcCodeOptions" :value="String(funcCode.value)"
                            :key="funcCode.value">
                            {{ funcCode.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="数据类型：" name="data_type">
                    <a-select v-model:value="dataPointForm.data_type" placeholder="请选择数据类型">
                        <a-select-option v-for="dataType in dataTypeOptions" :disabled="dataType.disabled"
                            :value="String(dataType.value)" :key="dataType.value">
                            {{ dataType.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="保存数据：" name="storable">
                    <a-switch v-model:checked="dataPointForm.storable" @change="handleStorableChange" />
                </a-form-item>
                <a-form-item label="小数点位数：" name="description">
                    <a-select v-model:value="dataPointForm.precision" :disabled="funcCodeFlag" placeholder="请选择小数点位数">
                        <a-select-option v-for="precision in floatOptions" :value="precision" :key="precision">{{
                            precision }}</a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div style="width: 50%;">
                <a-form-item label="单位符号：" name="unit_symbol">
                    <a-input v-model:value="dataPointForm.unit_symbol" placeholder="请输入单位符号" />
                </a-form-item>
                <a-form-item label="转换系数：" name="scale">
                    <a-input v-model:value="dataPointForm.scale" placeholder="请输入转换系数" />
                </a-form-item>
                <a-form-item label="寄存器地址：" name="register_addr">
                    <a-input v-model:value="dataPointForm.register_addr" placeholder="请输入寄存器地址" />
                </a-form-item>
                <a-form-item label="字节顺序：" name="byte_order">
                    <a-select v-model:value="dataPointForm.byte_order" placeholder="请选择字节顺序">
                        <a-select-option v-for="byte in byteOptions" :value="String(byte.value)" :key="byte.value">
                            {{ byte.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="存储频率：" name="frequency" v-if="dataPointForm.storable">
                    <div class="frequency-item">
                        <span style="">间隔</span>
                        <a-input style="width: 42px" v-model:value="dataPointForm.frequency" placeholder="请输入存储频率" />

                        <a-select style="width: 78px;" v-model:value="dataPointForm.time_unit" placeholder="请选择存储频率单位">
                            <a-select-option v-for="timeUnit in timeUnitOptions" :value="String(timeUnit.value)"
                                :key="timeUnit.value">{{ timeUnit.label }}</a-select-option>
                        </a-select>
                        <span>保存一次</span>
                    </div>
                </a-form-item>
            </div>
        </a-form>
        <div class="common-tool-warp">
            <a-button class="cancel-btn" type="default" @click="handleBack">取消</a-button>
            <a-button :loading="submitLoading" @click="handleVerifiFiled" class="confirm-btn" type="primary">{{props.isEdit ? '保存修改': '保存添加'}}</a-button>
        </div>
    </a-modal>
</template>
<script setup>
import { ref, defineProps, defineEmits, onMounted, watchEffect } from 'vue'
import { getDeviceList, setDataPoint, editDataPoint } from '@/api/deviceManage'
import { isNumeric } from '@/utils/validate'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
const route = useRoute()
const props = defineProps({
    visibleModal: {
        type: Boolean,
        default: false
    },
    deviceId: {
        type: [String, Number],
        default: ''
    },
    dataPoint: {
        type: Object,
        default: {}
    },
    isEdit: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['update:visible', 'update:dataPoint'])

const bodyStyle = {
    width: '680px',
    height: '454px'
}

const registerAddrValidator = (rule, value) => {
    return new Promise((resolve, reject) => {
        if (!value) {
            reject(new Error("请输入寄存器地址"))
            return
        }
        if (!isNumeric(value)) {
            reject("请输入数字格式的寄存器地址")
            return
        }

        if (value) {
            if (Number(value) > 65535 || value < 1) {
                reject("寄存器地址区间在[1~65535]")
                return
            }
        }
        resolve()
    })
}

const unitSymbolValidator = (rule, value) => {
    return new Promise((resolve, reject) => {
        if (!value) return reject('请输入单位符号')
        if (!isNaN(Number(value))) return reject('单位符号不能为数字')
        resolve()
    })

}
const dataPointFormRules = ref({
    point_name: [
        { required: true, message: '请输入数据点名称', trigger: 'blur' }
    ],
    device_id: [
        { required: true, message: '请选择归属设备', trigger: 'change' }
    ],
    function_code: [
        { required: true, message: '请选择功能码', trigger: 'change' }
    ],
    data_type: [
        { required: true, message: '请选择数据类型', trigger: 'change' }
    ],
    register_addr: [
        { required: true, validator: registerAddrValidator, trigger: 'blur' },
    ],
    byte_order: [
        { required: true, message: '请选择字节顺序', trigger: 'change' }
    ],
    frequency: [
        { required: true, message: '请输入存储频率', trigger: 'blur' }
    ],
    unit_symbol: [
        { required: true, validator: unitSymbolValidator, trigger: 'blur' }
    ]
})

const dataPointForm = ref({
    unit_symbol: '',
    device_id: String(props.deviceId),
    function_code: '',
    register_addr: '',
    data_type: '',
    byte_order: '',
    precision: '',
    storable: true,
    frequency: '10',
    time_unit: 'minutes',
    scale: '1'
})

// 归属设备列表
const deviceOptions = ref([])
const handleGetdeviceOptions = () => {
    getDeviceList({page: 0}).then((res) => {
        deviceOptions.value = res.data
    })
}

//功能码列表
const funcCodeOptions = ref([
    { label: '1(COILS)', value: 1 },
    { label: '2(DISCRETE_INPUT)', value: 2 },
    { label: '3(Holding Register)', value: 3 },
    { label: '4(Input Register)', value: 4 }
])

//数据类型
const dataTypeOptions = ref([
    { label: '32位浮点数', value: 'FLOAT32', disabled: false },
    { label: '16位整型', value: 'INT16', disabled: false },
    { label: '32位整型', value: 'INT32', disabled: false },
    { label: '布尔值', value: 'BOOLEAN', disabled: false }
])

// 字节顺序
const byteOptions = ref([
    { label: 'AB', value: 'AB' },
    { label: 'BA', value: 'BA' },
    { label: 'CDAB', value: 'CDAB' },
    { label: 'ABCD', value: 'ABCD' },
    { label: 'DCBA', value: 'DCBA' },
    { label: 'BADC', value: 'BADC' },
])

// 时间单位
const timeUnitOptions = ref([
    { label: '分钟', value: 'minutes' },
    { label: '小时', value: 'hours' },
    { label: '天', value: 'days' },
])

// 浮点位数
const floatOptions = ref([0, 1, 2, 3, 4])

// 功能码选择器联动  1|2为true 3|4为false
const funcCodeFlag = ref(false)
const funcCodeLinkage = (editType) => {
    const map = ['1', '2']
    console.log('dataPointForm.value.function_code', dataPointForm.value.function_code)
    funcCodeFlag.value = map.includes(dataPointForm.value.function_code)
    console.log('funcCodeFlag.value', funcCodeFlag.value)
    dataTypeOptions.value.forEach((data_type) => {
        if (data_type.value == 'BOOLEAN') {
            data_type.disabled = !funcCodeFlag.value
        } else {
            data_type.disabled = funcCodeFlag.value
        }
    })

    if (!editType) return
    // 功能选中1|2 时主动把数据类型设置为Boolean
    dataPointForm.value.data_type = funcCodeFlag.value ? 'BOOLEAN' : ''
}

// 保存数据change
const handleStorableChange = () => {
    // 自动赋初始值
    if (dataPointForm.value.frequency == 'undefined') {
        dataPointForm.value.frequency = '1'
        dataPointForm.time_unit = 'hours'
    }
}

watchEffect(() => {
})

onMounted(() => {
    handleGetdeviceOptions()

    // 在修改数据点环境下 props.dataPoint存在有值
    if (!props.isEdit) return
    const dataPoint = { ...props.dataPoint }
    dataPoint.device_id = String(dataPoint.device_id)
    dataPoint.function_code = String(dataPoint.function_code)
    dataPoint.register_addr = String(dataPoint.register_addr)
    dataPoint.frequency = String(dataPoint.storage_strategy?.frequency)
    dataPoint.time_unit = dataPoint.storage_strategy?.time_unit
    dataPointForm.value = dataPoint
    // 触发修改联动
    funcCodeLinkage(false)

})


const handleBack = () => {
    emit('update:visible', false)
}

const submitLoading = ref(false)
const dataPointFormRef = ref()
const handleVerifiFiled = () => {
    submitLoading.value = true
    dataPointFormRef.value.validate().then(vaild => {
        // 调整数据结构
        const params = Object.assign({}, dataPointForm.value)
        for (let key in params) {
            const value = Number(params[key])
            if (typeof value == 'number' && !isNaN(value) && key != 'storable') {
                params[key] = value
            }
        }
        const storage_strategy = {
            time_unit: params.time_unit,
            frequency: params.frequency
        }

        if (params.storable) {
            params.storage_strategy = storage_strategy
        } else {
            delete params.storage_strategy
            delete params.frequency
            delete params.time_unit
        }

        handleMap[Number(props.isEdit)](params)
    }).catch(() => {
        submitLoading.value = false
    })
}

const handleMap = {
    0: (params) => {// 新增数据点接口
        setDataPoint(params).then(() => {

            if (route.name == 'editDevice') {
                emit('update:dataPoint')
                handleBack()
            }
        }).finally(() => {
            submitLoading.value = false
        })
    },
    1: (params) => {
        editDataPoint(params).then(() => {
            message.success('修改成功')
            emit('update:dataPoint')
            handleBack()
        }).finally(() => {
            submitLoading.value = false
        })
    }
}




</script>

<style lang="less">
.data-point-form {
    display: flex;
    border-bottom: 1px solid #E5E6EB;

    .frequency-item {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .ant-input {
            min-height: 24px;
        }

        .ant-select-selector {
            height: 26px !important;

            .ant-select-selection-item {
                line-height: 26px;
            }

            .ant-select-selection-placeholder {
                line-height: 24px;
            }
        }
    }
}
</style>
