import request from '@/utils/request'

// 查询部门列表
export function page(data) {
    return request({
        url: '/course/fee/page',
        method: 'post',
        data: data
    })
}

export function calculate(data) {
    return request({
        url: '/course/fee/calculate',
        method: 'post',
        data: data
    })
}

export function detail(data) {
    return request({
        url: '/course/fee/detail',
        method: 'post',
        data: data
    })
}
