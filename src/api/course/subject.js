import request from '@/utils/request'

export function getInfo(id) {
    return request({
        url: '/course/subject/' + id,
        method: 'get'
    })
}
export function page(data) {
    return request({
        url: '/course/subject/page',
        method: 'post',
        data: data
    })
}

export function list(data) {
    return request({
        url: '/course/subject/list',
        method: 'post',
        data: data
    })
}

export function addSubject(data) {
    return request({
        url: '/course/subject/add',
        method: 'post',
        data: data
    })
}

export function updateSubject(data) {
    return request({
        url: '/course/subject/update',
        method: 'post',
        data: data
    })
}

export function delSubject(ids) {
    return request({
        url: '/course/subject/' + ids,
        method: 'delete'
    })
}
