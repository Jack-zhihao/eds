import request from '@/utils/request.js'

/** 场景列表 */
export function getSceneList(data) {
    return request({
        url: '/scenes',
        method: 'get',
        params: data,
    })
}

/** 场景详情 */
export function getScene(data) {
    return request({
        url: `/scenes/${data.id}`,
        method: 'get'
    })
}

/** 添加场景 */
export function addScene(data) {
    return request({
        url: `/scenes`,
        method: 'post',
        data
    })
}

/** 修改场景 */
export function editScene(data) {
    return request({
        url: `/scenes/${data.id}`,
        method: 'put',
        data
    })
}

/** 删除场景 */
export function delScene(data) {
    return request({
        url: `/scenes/${data.id}`,
        method: 'delete'
    })
}

