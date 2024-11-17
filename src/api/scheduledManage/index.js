import request from '@/utils/request.js'

/** 任务列表 */
export function getTasksList(data) {
    return request({
        url: '/schedule_tasks',
        method: 'get',
        params: data,
    })
}

/** 任务详情 */
export function getTasks(data) {
    return request({
        url: `/schedules/${data.id}`,
        method: 'get'
    })
}

/** 修改任务状态 */
export function editTasksStatus(data) {
    return request({
        url: `/schedule_tasks/${data.id}/status`,
        method: 'put',
        data: {
            enabled: data.enabled
        }
    })
}


