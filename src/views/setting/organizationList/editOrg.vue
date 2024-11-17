<template>
    <a-modal v-model:visible="props.visibleModal" :closable="false" :footer="null" :bodyStyle="{ width: '600px', height: '350px' }" :width="600"
        class="common-modal">
        <div class="header">
            <p class="title">{{props.isEdit ? '修改组织' : '添加组织'}}</p>
            <span class="icon-close" @click="handleBack"></span>
        </div>
        <a-form ref="orgFormRef" :model="sceneForm" :rules="orgFormRules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <a-form-item label="组织名称：" name="organization_name">
                    <a-input v-model:value="sceneForm.organization_name" placeholder="请输入组织名称" />
                </a-form-item>
                <a-form-item  label="所属组织：" name="parent_id">
                    <a-select v-model:value="sceneForm.parent_id" placeholder="请选择所属组织">
                        <a-select-option v-for="org in orgOptions" :value="String(org.id)" :key="org.id">{{ org.organization_name }}</a-select-option>
                    </a-select>
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
import { addOrg, editOrg } from '@/api/organizationMange'
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
    org: {
        type: Object,
        default: () => {}
    }
})
const emit = defineEmits(['update:visible', 'update:org'])

const orgFormRules = ref({
    organization_name: [
        { required: true, message: '请输入组织名称', trigger: 'blur' }
    ],
    parent_id: [
        { required: true, message: '请选择所属组织', trigger: 'change' }
    ]
})
const sceneForm = ref({
    organization_name: '',
    parent_id: ''
})


const handleBack = () => {
    emit('update:visible', false)
}

const orgFormRef = ref()
const submitLoading = ref(false)
const handleVerifiFiled = () => {
    submitLoading.value = true
    orgFormRef.value.validate().then((valid) => {
        handleMap[Number(props.isEdit)](sceneForm.value)
    }).catch(() => {
        submitLoading.value = false
    })
}


const handleMap = {
    0: (params) => {// 新增数据点接口
        addOrg(params).then(() => {
            emit('update:org')
            handleBack()
        }).finally(() => {
            submitLoading.value = false
        })
    },
    1: (params) => {
        editOrg(params).then(() => {
            message.success('修改成功')
            emit('update:org')
            handleBack()
        }).finally(() => {
            submitLoading.value = false
        })
    }
}
// 初始化组织选择
const orgOptions = ref([])
onMounted(() => {
    const allOrgs = [{'id': 0, organization_name: '无'}, ...props.orgOptions]
    if (!props.isEdit) {
        orgOptions.value = allOrgs
        return
    }

    // 修改操作时在所有组织中把当前组织去除
    const currentOrgIdx =  allOrgs.findIndex((item) => item.id === props.org.id)
    allOrgs.splice(currentOrgIdx, 1)
    orgOptions.value = allOrgs
    sceneForm.value = props.org
    sceneForm.value.parent_id = String(props.org.parent_id)
})
</script>
