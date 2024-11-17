import request from '@/utils/request.js'

/** 设备列表 */
export function getDeviceList(data) {
    return request({
        url: '/devices',
        method: 'get',
        params: data,
    })
}
/** 添加设备 **/
export function addDevices(data) {
    return request({
        url: '/devices',
        method: 'post',
        data,
    })
}
/** 设备详情 **/
export function getDeviceDetail(data) {
    return request({
        url: `/devices/${data.id}`,
        method: 'get'
    })
}

/** 更新设备 **/
export function updateDevices(data) {
    return request({
        url: `/devices/${data.id}`,
        method: 'put',
        data,
    })
}

/** 删除设备 **/
export function deleteDevices(data) {
    return request({
        url: `/devices/${String(data.id)}`,
        method: 'delete'
    })
}
/** 批量删除设备 **/
export function multDeleteDevices(data) {
    return request({
        url: `/devices/batch`,
        method: 'delete',
        data
    })
}

/** 数据点列表 */
export function getPointsList(data) {
    return request({
        url: '/points',
        method: 'get',
        params: data,
    })
}

/** 数据点详情 */
export function getDataPoint(id) {
    return request({
        url: `/points/${id}`,
        method: 'get'
    })
}

/** 添加数据点 */
export function setDataPoint(data) {
    return request({
        url: '/points',
        method: 'post',
        data: data,
    })
}

/** 修改数据点 */
export function editDataPoint(data) {
    return request({
        url: `/points/${data.id}`,
        method: 'put',
        data: data,
    })
}


/** 删除数据点 */
export function delDataPoint(data) {
    return request({
        url: `/points/${data.id}`,
        method: 'delete',
    })
}

/** 批量删除数据点 */
export function multDelDataPoints(data) {
    return request({
        url: `/points/batch`,
        method: 'delete',
        data: data,
    })
}

