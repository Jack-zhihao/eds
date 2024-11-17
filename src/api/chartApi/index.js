import request from '@/utils/request'


/** 图标数据接口 */
export function getChartsData(data) {
    return request({
        url: '/chart/data',
        method: 'post',
        data: data
    })
}
