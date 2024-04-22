import request from '@/utils/request'

// 查询部门列表
export function page(data) {
    return request({
        url: '/course/examRule/page',
        method: 'post',
        data: data
    })
}

export function getInfo(id) {
    return request({
        url: '/course/examRule/' + id,
        method: 'get'
    })
}

export function add(data) {
    return request({
        url: '/course/examRule/add',
        method: 'post',
        data: data
    })
}

export function edit(data) {
    return request({
        url: '/course/examRule/edit',
        method: 'post',
        data: data
    })
}


export function del(ids) {
    return request({
        url: '/course/examRule/delete/' + ids,
        method: 'delete'
    })
}
