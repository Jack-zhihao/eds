import request from '@/utils/request.js'

/** 列表 */
export function getTriggerList(data) {
    return request({
        url: '/triggers',
        method: 'get',
        params: data,
    })
}

/** 详情 */
export function getTriggers(data) {
    return request({
        url: `/triggers/${data.id}`,
        method: 'get'
    })
}

/** 添加 */
export function addTriggers(data) {
    return request({
        url: `/triggers`,
        method: 'post',
        data
    })
}

/** 修改 */
export function editTriggers(data) {
    return request({
        url: `/triggers/${data.id}`,
        method: 'put',
        data
    })
}

/** 删除场景 */
export function delTriggers(data) {
    return request({
        url: `/triggers/${data.id}`,
        method: 'delete'
    })
}


/** 批量删除 */
export function multDelTriggers(data) {
    return request({
        url: `/triggers/batch`,
        method: 'delete',
        data: data,
    })
}

