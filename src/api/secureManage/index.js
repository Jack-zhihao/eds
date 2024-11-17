import request from '@/utils/request.js'

/** 摄像头列表 */
export function getCamerasList(data) {
    return request({
        url: '/cameras',
        method: 'get',
        params: data,
    })
}

/** 摄像头详情 */
export function getCameras(data) {
    return request({
        url: `/cameras/${data.id}`,
        method: 'get'
    })
}

/** 添加摄像头 */
export function addCameras(data) {
    return request({
        url: `/cameras`,
        method: 'post',
        data
    })
}

/** 修改摄像头 */
export function editCameras(data) {
    return request({
        url: `/cameras/${data.id}`,
        method: 'put',
        data
    })
}

/** 删除摄像头 */
export function delCameras(data) {
    return request({
        url: `/cameras/${data.id}`,
        method: 'delete'
    })
}

/** 批量删除摄像头 */
export function multDelCameras(data) {
    return request({
        url: `/cameras/batch`,
        method: 'delete',
        data
    })
}

