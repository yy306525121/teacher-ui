import request from '@/utils/request'

export function list(data) {
    return request({
        url: '/course/courseplan/list',
        method: 'post',
        data: data
    })
}

