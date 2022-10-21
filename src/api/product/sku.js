//导入axios实列
import request from '@/utils/fack.js'
// 获取 sku列表数据 /admin/product/list/{page}/{limit} get
export const reqGetSkuList = (page, limit) => {
        return request({
            url: `/admin/product/list/${page}/${limit}`,
            method: 'get'
        })
    }
    // 上架 /admin/product/onSale/{skuId} get
export const reqSale = (skuId) => {
        return request({
            url: `/admin/product/onSale/${skuId}`,
            method: 'get'
        })
    }
    // 下架 /admin/product/cancelSale/{skuId} get
export const reqCancaelSale = (skuId) => {
        return request({
            url: `/admin/product/cancelSale/${skuId}`,
            method: 'get'
        })
    }
    ///获取sku详情 admin/product/getSkuById/{skuId} get
export const reqGetSkuInfo = (skuId) => {
        return request({
            url: `admin/product/getSkuById/${skuId}`,
            method: 'get'
        })
    }
    // 删除sku /admin/product/deleteSku/{skuId} delete
export const reqDeleteSku = (skuId) => {
    return request({
        url: `/admin/product/deleteSku/${skuId}`,
        method: 'delete'
    })
}