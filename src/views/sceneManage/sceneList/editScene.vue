<template>
    <a-modal v-model:visible="props.visibleModal" :closable="false" :footer="null" :bodyStyle="{ width: '600px', height: '350px' }" :width="600"
        class="common-modal">
        <div class="header">
            <p class="title">{{props.isEdit ? '修改场景' : '添加场景'}}</p>
            <span class="icon-close" @click="handleBack"></span>
        </div>
        <a-form ref="sceneFormRef" :model="sceneForm" :rules="sceneFormRules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-form-item label="场景名称：" name="scene_name">
                    <a-input v-model:value="sceneForm.scene_name" placeholder="请输入场景名称" />
                </a-form-item>
                <a-form-item  label="所属组织：" name="organization_id">
                    <a-select v-model:value="sceneForm.organization_id" placeholder="请选择所属组织">
                        <a-select-option v-for="org in props.orgOptions" :value="String(org.id)" :key="org.id">{{ org.organization_name }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="分类标签：" name="category_name">
                    <a-select v-model:value="sceneForm.category_name" placeholder="请选择分类标签">
                        <a-select-option v-for="category in categoryOptions" :value="category" :key="category">{{ category }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="场景描述：" name="description">
                    <a-input v-model:value="sceneForm.description" placeholder="请输入场景描述" />
                </a-form-item>
            </a-form>
        <div class="common-tool-warp">
            <a-button class="cancel-btn" type="default" @click="handleBack">取消</a-button>
            <a-button :loading="submitLoading" @click="handleVerifiFiled" class="confirm-btn" type="primary">保存添加</a-button>
        </div>
    </a-modal>
</template>
<script setup>
import { defineEmits, defineProps, ref, onMounted } from 'vue'
import { addScene, editScene } from '@/api/scenesManage'
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
    scene: {
        type: Object,
        default: () => {}
    }
})
const emit = defineEmits(['update:visible'])

const categoryOptions = ['机组', '栏污闸', '防洪闸']

const sceneFormRules = ref({
    scene_name: [
        { required: true, message: '请输入场景名称', trigger: 'blur' }
    ],
    organization_id: [
        { required: true, message: '请选择所属组织', trigger: 'change' }
    ],
    category_name: [
        { required: true, message: '请选择归类标签', trigger: 'change' }
    ],
    description: [
    { required: true, message: '请输入场景描述', trigger: 'change' }
    ]
})
const sceneForm = ref({
    organization_id: '',
    scene_name: '',
    category_name: '',
    description: ''
})


const handleBack = () => {
    emit('update:visible', false)
}

const sceneFormRef = ref()
const submitLoading = ref(false)
const handleVerifiFiled = () => {
    submitLoading.value = true
    sceneFormRef.value.validate().then((valid) => {
        handleMap[Number(props.isEdit)](sceneForm.value)
    }).catch(() => {
        submitLoading.value = false
    })
}


const handleMap = {
    0: (params) => {// 新增数据点接口
        addScene(params).then(() => {
            handleBack()
        }).finally(() => {
            submitLoading.value = false
        })
    },
    1: (params) => {
        editScene(params).then(() => {
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
    sceneForm.value = props.scene
    sceneForm.value.organization_id = String(props.scene.organization_id)
})
</script>
