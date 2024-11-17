import request from '@/utils/request.js'

/** 组织列表 */
export function getOrgList(data) {
    return request({
        url: '/organizations',
        method: 'get',
        params: data,
    })
}

/** 组织详情 */
export function getOrg(data) {
    return request({
        url: `/organizations/${data.id}`,
        method: 'get',
    })
}


/** 添加组织 */
export function addOrg (data) {
    return request({
        url: '/organizations',
        method: 'post',
        data: data,
    })
}


/** 修改组织 */
export function editOrg(data) {
    return request({
        url: `/organizations/${data.id}`,
        method: 'put',
        data: data,
    })
}


/** 删除组织 */
export function delOrg(data) {
    return request({
        url: `/organizations/${data.id}`,
        method: 'delete',
        data: data,
    })
}

