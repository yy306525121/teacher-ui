import request from '@/utils/request'

// 查询部门列表
export function page(data) {
    return request({
        url: '/course/course-setting/page',
        method: 'get',
        data: data
    })
}

export function addCourseSetting(data) {
    return request({
        url: '/course/course-setting',
        method: 'post',
        data: data
    })
}

export function updateCourseSetting(data) {
    return request({
        url: '/course/course-setting',
        method: 'put',
        data: data
    })
}

export function current() {
    return request({
        url: '/course/course-setting/current',
        method: 'get',
    })
}
