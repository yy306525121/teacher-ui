import request from '@/utils/request'

// 查询部门列表
export function page(data) {
    return request({
        url: '/course/teacher/page',
        method: 'post',
        data: data
    })
}

export function addTeacher(data) {
    return request({
        url: '/course/teacher/add',
        method: 'post',
        data: data
    })
}

export function updateTeacher(data) {
    return request({
        url: '/course/teacher/update',
        method: 'post',
        data: data
    })
}

export function getTeacherInfo(id) {
    return request({
        url: '/course/teacher/' +id,
        method: 'get'
    })
}

export function delTeacher(ids) {
    return request({
        url: '/course/teacher/' + ids,
        method: 'delete'
    })
}
