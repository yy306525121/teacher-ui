import request from '@/utils/request'

// 查询部门列表
export function tree(data) {
    return request({
        url: '/course/class/tree',
        method: 'post'
    })
}

export function getList(data) {
    return request({
        url: '/course/class/list',
        method: 'post',
        data: data
    })
}

export function addClass(data) {
    return request({
        url: '/course/class/add',
        method: 'post',
        data: data
    })
}

export function updateClass(data) {
    return request({
        url: '/course/class/update',
        method: 'post',
        data: data
    })
}
