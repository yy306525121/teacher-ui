import request from '@/utils/request'

export function list(data) {
    return request({
        url: '/course/timeSlot/list',
        method: 'post',
        data: data
    })
}

