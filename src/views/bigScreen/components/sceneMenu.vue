<template>
    <div class="scene-menu-warp pane-warp ">
        <div class="pane-title">场景</div>
        <div class="pane-content g-scrollbar-y">
            <a-tree v-if="isLoad" class="draggable-tree" :tree-data="gData" v-model:expandedKeys="expandedKeys"
                v-model:selectedKeys="selectedKeys" @select="handleSlect"
                :autoExpandParent="true" :showIcon="true" >
                <template #switcherIcon>
                    <!-- 占位 -->
                    <span></span>
                </template>
            </a-tree>
        </div>
    </div>
</template>
<script setup>
import { defineEmits, ref, createVNode, onMounted } from 'vue';
import { getSceneList } from '@/api/scenesManage'
import { getOrgList } from '@/api/organizationMange'

const isLoad = ref(false)
const gData = ref([])
const expandedKeys = ref(['0-0', '0-0-0']);
const selectedKeys = ref(['0-0-0-0']);


let sceneList = []
const handleGetSceneList = () => {
    getSceneList({ page: 0 }).then((res) => {
        if (!res.data) return
        sceneList = res.data
        handleGetOrgList()
    })
}
const handleGetOrgList = () => {
    getOrgList({ page: 0 }).then((res) => {
        gData.value = formatMenu(generateTree(res.data))
        isLoad.value = true
        handleSlect(selectedKeys.value)
    })
}

const generateTree = (orgData) => {
    let map = {};
    const tree = [];

    // 按照category_name分类场景
    const category = {}
    sceneList.forEach((scene) => {
        if (category[scene.category_name]) {
            category[scene.category_name].push(scene)
        } else {
            category[scene.category_name] = [scene]
        }
    })

    orgData.forEach(item => {
        map[item.id] = { ...item, children: []};
        Object.keys(category).forEach((category_name) => {
            const curOrgScene = category[category_name].filter((scene) => scene.organization_id == item.id)
            if (!curOrgScene.length) return
            map[item.id].children.push({
                title: category_name,
                children: [...curOrgScene]
            })
        })
    })

    orgData.forEach(item => {
        if (map[item.parent_id]) {
            map[item.parent_id].children.push(map[item.id]);
        } else {
            tree.push(map[item.id]);
        }
    });
    map = {}
    return tree;
}

const formatMenu = (tree, tip = '0') => {
    return tree.map((menu, i) => {
        menu.key = tip + '-' + String(i)
        menu.title = menu.title || menu.scene_name || menu.organization_name
        menu.class = !!menu.mqtt_topic ? 'no-child-node' : ''
        menu.disabled = !menu.mqtt_topic
        if (menu.children && menu.children.length > 0) {
            menu.children = formatMenu(menu.children, menu.key)
        }
        return menu
    })
}

// 解构获取节点数据
const getTreeNodeData = (data, nodeKey, resolve) => {
    if (!nodeKey) return
    data.forEach((item) => {
        if (item.key == nodeKey) {
            resolve(item)
        } else {
            if (item.children && item.children.length) {
                getTreeNodeData(item.children, nodeKey, resolve)
            }
        }
    })
}

const emit  = defineEmits(['update:menu'])
const handleSlect = ([key]) => {
    new Promise((resolve) => {
        getTreeNodeData(gData.value, key, resolve)
    }).then(node => {
        emit('update:menu', node)
    })
}

onMounted(() => {
    handleGetSceneList()
})
</script>
<style lang="less">
.scene-menu-warp {
    height: 5.5rem;
    background: #060931;
    display: flex;
    flex-direction: column;

    .ant-tree li .ant-tree-node-content-wrapper {
        color: #E0E0E0;
    }

    .pane-content {
        height: calc(100% - 0.6rem);
        margin-top: 0.2rem;
        overflow-y: auto;
    }
}

.draggable-tree {}

.ant-tree li .ant-tree-node-content-wrapper {
    height: 0.32rem;
    line-height: 0.26rem;
}

.ant-tree-node-content-wrapper {
    padding: 0 0.16rem !important;

    .ant-tree-title {
        color: #E0E0E0 !important;
        font-size: 0.14rem;
    }
}

.no-child-node {
    .ant-tree-node-content-wrapper {
        padding-left: 0.1rem !important;

        .ant-tree-title {
            color: #E0E0E0 !important;
        }
    }
}

.ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: transparent;
    color: rgba(22, 93, 255, 1);

    .ant-tree-title {
        color: rgba(22, 93, 255, 1) !important;
    }
}

.ant-tree li .ant-tree-node-content-wrapper:hover {
    background-color: transparent;
}

.ant-tree-switcher {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 0.24rem !important;
    height: 0.24rem !important;

    .ant-tree-switcher-icon {
        display: none;
    }
}

.ant-tree-switcher_open {
    position: relative;

    &::after {
        content: '';
        display: inline-block;
        width: 0.14rem;
        height: 0.14rem;
        background-size: 100% 100%;
        background-image: url('@/assets/svg/tree-open.svg');
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
}

.ant-tree-switcher_close {
    position: relative;
    &::after {
        content: '';
        display: inline-block;
        width: 0.14rem;
        height: 0.14rem;
        background-size: 100% 100%;
        background-image: url('@/assets/svg/tree-close.svg');
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>
