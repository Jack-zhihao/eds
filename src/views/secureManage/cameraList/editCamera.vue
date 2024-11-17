<template>
    <a-modal v-model:visible="props.visibleModal" :closable="false" :footer="null" :bodyStyle="{ width: '680px', height: '500px' }" :width="680"
        class="common-modal">
        <div class="header">
            <p class="title">{{props.isEdit ? '修改摄像头' : '添加摄像头'}}</p>
            <span class="icon-close" @click="handleBack"></span>
        </div>
        <a-form ref="cameraFormRef" class="camera-edit-warp" :model="cameraForm" :rules="cameraFormRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
            <div class="camera-edit-content">
                <div class="camera-edit-pane">
                    <a-form-item label="摄像头名称：" name="camera_name">
                        <a-input v-model:value="cameraForm.camera_name" placeholder="请输入摄像头名称" />
                    </a-form-item>
                    <a-form-item  label="所属组织：" name="organization_id">
                        <a-select v-model:value="cameraForm.organization_id" placeholder="请选择所属组织">
                            <a-select-option v-for="org in props.orgOptions" :value="String(org.id)" :key="org.id">{{ org.organization_name }}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="用户名：" name="username">
                        <a-input v-model:value="cameraForm.username" placeholder="请输入登录用户名" />
                    </a-form-item>
                    <a-form-item label="设备IP：" name="ip">
                        <a-input v-model:value="cameraForm.ip" placeholder="请输入设备IP" />
                    </a-form-item>
                    <a-form-item label="流媒体协议：" name="protocol">
                        <a-select v-model:value="cameraForm.protocol" placeholder="请选择流媒体协议">
                            <a-select-option v-for="protocol in protocolOptions" :value="protocol" :key="protocol">{{ protocol }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </div>
                <div class="camera-edit-pane">
                    <a-form-item label="厂商品牌：" name="brand_name">
                        <a-select v-model:value="cameraForm.brand_name" placeholder="请选择厂商品牌">
                            <a-select-option v-for="brand in cameraBrandOptions" :value="brand" :key="brand">{{ brand }}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item  label="安装位置：" name="install_position">
                        <a-input v-model:value="cameraForm.install_position" placeholder="请输入安装位置" />
                    </a-form-item>
                    <a-form-item label="用户密码：" name="password">
                        <a-input v-model:value="cameraForm.password" placeholder="请输入用户密码" />
                    </a-form-item>
                    <a-form-item label="端口号：" name="port">
                        <a-input v-model:value="cameraForm.port" placeholder="请输入端口号" />
                    </a-form-item>
                    <a-form-item label="关联场景：" name="scenes">
                        <a-select v-model:value="cameraForm.scenes" mode="multiple" placeholder="请选择关联场景">
                            <a-select-option v-for="scene in props.sceneOptions" :value="String(scene.id)" :key="scene.id">{{ scene.scene_name }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </div>
            </div>

            <a-form-item label="主码流地址：" name="main_stream" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                <a-input v-model:value="cameraForm.main_stream" placeholder="请输入主码流地址" />
            </a-form-item>

            <a-form-item label="子码流地址：" name="sub_stream" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                <a-input v-model:value="cameraForm.sub_stream" placeholder="请输入子码流地址" />
            </a-form-item>
        </a-form>
        <div class="common-tool-warp">
            <a-button class="cancel-btn" type="default" @click="handleBack">取消</a-button>
            <a-button :loading="submitLoading" @click="handleVerifiFiled" class="confirm-btn" type="primary">保存添加</a-button>
        </div>
    </a-modal>
</template>
<script setup>
import { defineEmits, defineProps, ref, onMounted, createVNode } from 'vue'
import { addCameras, editCameras } from '@/api/secureManage'
import { message } from 'ant-design-vue'
import { DownOutlined } from '@ant-design/icons-vue'
import { isValidIPv4 } from '@/utils/validate'
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
    sceneOptions: {
        type: Array,
        default: () => []
    },
    camera: {
        type: [Object, String, Number],
        default: () => {}
    }
})
const emit = defineEmits(['update:visible'])

// 流媒体协议
const protocolOptions = ['rtsp', 'rtmp', 'webRtc', 'rtp', 'hls', 'http-flv', 'hds', 'mpeg-dash']

// 摄像头厂家
const cameraBrandOptions = ['海康', '大华', '普联']

const validIPv4 = (rule, value) => {
    return new Promise((resolve, reject) => {
        if (!value) {
            reject(new Error("请输入摄像头IP地址"))
            return
        }
        if (!isValidIPv4(value)) {
            reject("请输入正确格式的IP地址")
            return
        }
        resolve()
    })
}
const cameraFormRules = ref({
    camera_name: [
        { required: true, message: '请输入摄像头名称', trigger: 'blur' }
    ],
    organization_id: [
        { required: true, message: '请选择所属组织', trigger: 'change' }
    ],
    username: [
        { required: true, message: '请输入登录用户名', trigger: 'blur' }
    ],
    ip: [
        { required: true, validator: validIPv4, trigger: 'blur' }
    ],
    protocol: [
        { required: true, message: '请选择流媒体协议', trigger: 'blur' }
    ],
    main_stream: [
        { required: true, message: '请输入主码流地址', trigger: 'blur' }
    ],
    sub_stream: [
        { required: true, message: '请输入子码流地址', trigger: 'blur' }
    ],
    brand_name: [
        { required: true, message: '请选择厂商品牌', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入用户密码', trigger: 'blur' }
    ],
    port: [
        { required: true, message: '请输入端口号', trigger: 'blur' }
    ],
    install_position: [
        { required: true, message: '请输入安装位置', trigger: 'blur' }
    ]
})
const cameraForm = ref({
    brand_name: '',
    camera_name: '',
    install_position: '',
    ip: '',
    main_stream: '',
    organization_id: '',
    port: '',
    protocol: '',
    scenes: [],
    sub_stream: '',
    username: ''
})


const handleBack = () => {
    emit('update:visible', false)
}

const cameraFormRef = ref()
const submitLoading = ref(false)
const handleVerifiFiled = () => {
    submitLoading.value = true
    cameraFormRef.value.validate().then((valid) => {
        console.log(valid)
        handleMap[Number(props.isEdit)](cameraForm.value)
    }).catch(() => {
        submitLoading.value = false
    })
}


const handleMap = {
    0: (params) => {// 新增数据点接口
        addCameras(params).then(() => {
            handleBack()
        }).finally(() => {
            submitLoading.value = false
        })
    },
    1: (params) => {
        editCameras(params).then(() => {
            message.success('修改成功')
            emit('update:scene')
            handleBack()
        }).finally(() => {
            submitLoading.value = false
        })
    }
}


onMounted(() => {
    if (!props.isEdit) return
    const params = {...props.camera}
    params.organization_id = params.organization_id && String(params.organization_id)
    params.port = String(params.port)
    params.scenes = params.scenes ? params.scenes.map((scene) => String(scene.id)) : []
    cameraForm.value = params
})
</script>
<style lang="less">
.camera-edit-warp {
    display: flex;
    flex-direction: column;

    .camera-edit-content {
        display: flex;

    }
    .camera-edit-pane {
        width: 50%;

    }
    .ant-form-item {
        margin-bottom: 20px !important;
        &.ant-form-item-with-help {
            margin: 0 !important;
        }
    }
    .ant-form-item-explain, .ant-form-item-extra {
        min-height: 20px !important;
    }
    .ant-select-selector {
        padding-right: 20px;
    }
    .ant-select-selection-overflow {
        flex-wrap: nowrap;
        overflow: hidden;
    }
}
</style>
