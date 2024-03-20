import request from '@/utils/request'

// 查询部门列表
export function add(data) {
    return request({
        url: '/course/feeRule/add',
        method: 'post',
        data: data
    })
}

export function listFeeRule(data) {
    return request({
        url: '/course/feeRule/page',
        method: 'get',
        params: data
    })
}
