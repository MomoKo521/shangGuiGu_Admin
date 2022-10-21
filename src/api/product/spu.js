//导入axios实列
import request from '@/utils/fack.js'
//获取spu 列表数据的接口
// /admin/product/{page}/{limit}  get请求 参数 page limit  category3Id
export const reqGetSpuAttr = (page, limit, category3Id) => {
        return request({
            url: `/admin/product/${page}/${limit}`,
            method: 'get',
            params: {
                category3Id
            }
        });
    }
    // 获取SPU信息
    // /admin/product/getSpuById/{spuId} get spuId
export const reqspu = (spuId) => {
        return request({
            url: `/admin/product/getSpuById/${spuId}`,
            method: 'get'
        })
    }
    //获取品牌信息 /admin/product/baseTrademark/getTrademarrKList  get
export const reqTradeMarKList = () => {
        return request({
            url: '/admin/product/baseTrademark/getTrademarkList',
            method: 'get'
        })
    }
    // 获取图标的接口  /admin/product/spuImageList/{spuId} get
export const reqSpuImageList = (spuId) => {
        return request({
            url: `/admin/product/spuImageList/${spuId}`,
            method: 'get'
        })
    }
    //获取平台全部销售属性----整个平台销售属性一共三个
    //GET  /admin/product/baseSaleAttrList 
export const reqBaseSaleAttrList = () => {
        return request({
            url: '/admin/product/baseSaleAttrList',
            method: 'get'
        })
    }
    // 添加 | 修改 spu属性 对于修改或者添加 携带给服务器的参数大致是一样的，唯一的区别在于参数是否带id
export const reqAddOrUpdateSpu = (spuInfo) => {
        if (spuInfo.id) {
            // 带有id参数执行修改spu属性操作
            return request({
                url: '/admin/product/updateSpuInfo',
                method: 'post',
                data: spuInfo
            })
        } else {
            //没有id参数执行添加spu属性操作
            return request({
                url: '/admin/product/saveSpuInfo',
                method: 'post',
                data: spuInfo
            })
        }
    }
    // 删除spu  /admin/product/deleteSpu/{spuId} delete
export const reqDeleteSpu = (spuId) => {
    return request({
        url: `/admin/product/deleteSpu/${spuId}`,
        method: 'delete'
    })
}

// 以下属性添加sku功能接口
//  获取销售属性 /admin/product/spuSaleAttrList/{spuId} get 
export const reqgetSpuSaleAttrList = (spuId) => {
        return request({
            url: `/admin/product/spuSaleAttrList/${spuId} `,
            method: 'get'
        })
    }
    // 获取 平台属性 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get
export const reqGetAttrInfoList = (category1Id, category2Id, category3Id) => {
        return request({
            url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
            method: 'get'
        })
    }
    // 获取图片列表 /admin/product/spuImageList/{spuId} get
export const reqGetspuImageList = (spuId) => {
        return request({
            url: `/admin/product/spuImageList/${spuId}`,
            method: 'get'
        })
    }
    // 点击保存按钮 添加sku /admin/product/saveSkuInfo post
export const reqSaveSkuInfo = (skuInfo) => {
        return request({
            url: '/admin/product/saveSkuInfo',
            method: 'post',
            data: skuInfo
        })
    }
    // 获取当前用户点击的spu的全部sku列表 /admin/product/findBySpuId/{spuId} get
export const reqGetFindBySpu = (spuId) => {
    return request({
        url: `/admin/product/findBySpuId/${spuId}`,
        method: 'get'
    })
}