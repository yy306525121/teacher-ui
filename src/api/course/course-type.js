import request from '@/utils/request'


export function list() {
    return request({
        url: '/course/type/list',
        method: 'post'
    })
}
