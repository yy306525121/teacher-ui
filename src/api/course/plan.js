import request from '@/utils/request'

export function list(data) {
    return request({
        url: '/course/plan/list',
        method: 'post',
        data: data
    })
}

