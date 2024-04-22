import request from '@/utils/request'

// 查询部门列表
export function page(data) {
    return request({
        url: '/course/holidayRule/page',
        method: 'post',
        data: data
    })
}

export function getInfo(id) {
    return request({
        url: '/course/holidayRule/' + id,
        method: 'get'
    })
}

export function add(data) {
    return request({
        url: '/course/holidayRule/add',
        method: 'post',
        data: data
    })
}

export function edit(data) {
    return request({
        url: '/course/holidayRule/edit',
        method: 'post',
        data: data
    })
}


export function delHolidayRule(ids) {
    return request({
        url: '/course/holidayRule/delete/' + ids,
        method: 'delete'
    })
}
