import request from '@/utils/request'

export function list(data) {
    return request({
        url: '/course/plan/list',
        method: 'post',
        data: data
    })
}

export function change(data) {
    return request({
        url: '/course/plan/change',
        method: 'post',
        data: data
    })
}

