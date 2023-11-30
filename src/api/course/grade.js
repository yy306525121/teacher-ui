import request from '@/utils/request'

// 查询部门列表
export function tree(data) {
    return request({
        url: '/course/grade/tree',
        method: 'post'
    })
}
