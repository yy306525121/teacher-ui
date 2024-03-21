import request from '@/utils/request'

// 查询部门列表
export function add(data) {
    return request({
        url: '/course/feeRule/add',
        method: 'post',
        data: data
    })
}

export function edit(data) {
    return request({
        url: '/course/feeRule',
        method: 'put',
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

export function getFeeRule(id) {
    return request({
        url: '/course/feeRule/' + id,
        method: 'get'
    })
}

export function delFeeRule(id) {
    return request({
        url: '/course/feeRule/' + userId,
        method: 'delete'
    })
}
