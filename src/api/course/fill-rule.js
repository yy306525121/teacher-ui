import request from '@/utils/request'

// 查询部门列表
export function page(data) {
    return request({
        url: '/course/fillRule/page',
        method: 'post',
        data: data
    })
}

export function getInfo(id) {
    return request({
        url: '/course/fillRule/' + id,
        method: 'get'
    })
}

export function add(data) {
    return request({
        url: '/course/fillRule/add',
        method: 'post',
        data: data
    })
}

export function edit(data) {
    return request({
        url: '/course/fillRule/edit',
        method: 'post',
        data: data
    })
}


export function del(ids) {
    return request({
        url: '/course/fillRule/delete/' + ids,
        method: 'delete'
    })
}
