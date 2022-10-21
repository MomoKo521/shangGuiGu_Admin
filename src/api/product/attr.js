import request from '@/utils/fack.js'
// 获取一级下拉框菜单
export const reqCategory1 = () => {
        return request({
            url: '/admin/product/getCategory1',
            method: 'get'
        })
    }
    // 获取二级下拉框菜单
export const reqCategory2 = (category1Id) => {
        return request({
            url: `/admin/product/getCategory2/${category1Id}`,
            method: 'get'
        })
    }
    // 获取三级下拉框菜单
export const reqCategory3 = (category2Id) => {
        return request({
            url: `/admin/product/getCategory3/${category2Id}`,
            method: 'get'
        })
    }
    // 获取平台数据接口
export const reqGetAttfoList = (from) => {
        return request({
            url: `/admin/product/attrInfoList/${from.category1Id}/${from.category2Id}/${from.category3Id}`,
            method: "get"
        })
    }
    //添加属性与修改 属性值接口 /admin/product/saveAttrInfo
export const reqAddAttr = (data) => {
        return request({
            url: '/admin/product/saveAttrInfo',
            data,
            method: 'post'
        })
    }
    //删除属性 /admin/product/deleteAttr/{attrId} delete
export const reqDeleteAttr = (id) => {
    return request({
        url: `/admin/product/deleteAttr/${id}`,
        method: 'delete'
    })
}