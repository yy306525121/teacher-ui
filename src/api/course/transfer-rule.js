import request from '@/utils/request'

// 查询部门列表
export function page(data) {
    return request({
        url: '/course/transferRule/page',
        method: 'post',
        data: data
    })
}

export function getInfo(id) {
    return request({
        url: '/course/transferRule/' + id,
        method: 'get'
    })
}

export function add(data) {
    return request({
        url: '/course/transferRule/add',
        method: 'post',
        data: data
    })
}

export function edit(data) {
    return request({
        url: '/course/transferRule/edit',
        method: 'post',
        data: data
    })
}


export function del(ids) {
    return request({
        url: '/course/transferRule/delete/' + ids,
        method: 'delete'
    })
}