import request from '@/utils/request'

// 查询部门列表
export function page(data) {
    return request({
        url: '/course/teacher/page',
        method: 'post',
        data: data
    })
}
