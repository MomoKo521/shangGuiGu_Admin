import request from '@/utils/fack.js'
//商品管理/品牌管理接口
// 获取 品牌数据 GET /admin/product/baseTrademark/{page}/{limit}
export const reqgetAttrList = (page, limit) => {
    return request({
        url: `/admin/product/baseTrademark/${page}/${limit}`,
        method: 'get'
    })
}

//修改品牌管理和添加品牌商品数据
export const reqUpdate = (tradeMark) => {
        if (tradeMark.id) {
            // 如果存在id说明是修改品牌请求
            return request({
                url: '/admin/product/baseTrademark/update',
                method: 'put',
                data: tradeMark
            })
        } else {
            // 新增商品
            return request({
                url: '/admin/product/baseTrademark/save',
                method: 'post',
                data: tradeMark
            })
        }
    }
    //删除品牌信息
export const reqDeleteDate = (id) => {
    return request({
        url: `/admin/product/baseTrademark/remove/${id}`,
        method: 'delete'
    })
}