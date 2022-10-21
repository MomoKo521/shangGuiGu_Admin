// 导入axios实列
import request from '@/utils/request'


// 获取菜单管理列表数据 /admin/acl/permission get
export const reqGetmenuList = () => {
        return request({
            url: '/admin/acl/permission',
            method: 'get'
        })
    }
    //  新增菜单 /admin/acl/permission/save post
    //参数:
    // {
    //     "code": "string",功能权限
    //     toCode：''  跳转路由权限
    //     "level": 0, //要做第几级目录添加
    //     "name": "string",//名称
    //     "pid": "string", 父级 id  表示在在这个父级下面添加菜单
    //     "type": 0
    // }
export const reqAddmenu = (data) => {
        return request({
            url: '/admin/acl/permission/save  ',
            method: 'post',
            data
        })

    }
    // 修改菜单  /admin/acl/permission/update put
export const reqUpdateMenu = (data) => {
        return request({
            url: '/admin/acl/permission/update',
            method: 'put',
            data
        })
    }
    // 删除菜单 /admin/acl/permission/remove/{id} delete
export const reqDeleteMenu = (id) => {
    return request({
        url: `/admin/acl/permission/remove/${id}`,
        method: 'delete'
    })
}