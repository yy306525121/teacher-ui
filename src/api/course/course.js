import request from '@/utils/request'

// 查询部门列表
export function list(data) {
    return request({
        url: '/course/course/list',
        method: 'post'
    })
}
