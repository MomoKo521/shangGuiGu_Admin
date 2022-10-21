// 导入axios实列
import request from '@/utils/request'

// 分页获取角色列表 /admin/acl/role/{page}/{limit} get
export const reqGetRoleList = (page, limit, roleName) => {
        return request({
            url: `/admin/acl/role/${page}/${limit}`,
            method: 'get',
            params: roleName
        })
    }
    // 添加 角色 /admin/acl/role/save post
export const reqAddRole = (data) => {

        return request({
            url: '/admin/acl/role/save',
            method: 'post',
            data
        })
    }
    // 修改角色 /admin/acl/role/update put
export const reqUpdateRole = (data) => {
        return request({
            url: '/admin/acl/role/update',
            method: 'put',
            data
        })
    }
    //删除角色 /admin/acl/role/remove/{id} delete
export const reqDeleteRole = (id) => {
        return request({
            url: `/admin/acl/role/remove/${id}`,
            method: 'delete'
        })
    }
    // 批量删除  /admin/acl/role/batchRemove delete
export const reqDeleteAllRole = (idList) => {
    return request({
        url: '/admin/acl/role/batchRemove',
        method: 'delete',
        data: idList
    })
}

// 获取角色授权 树形菜单数据 /admin/acl/permission/toAssign/{roleId}  get
export const reqGetRoleAuth = (roleId) => {
        return request({
            url: `/admin/acl/permission/toAssign/${roleId}`,
            method: 'get'
        })
    }
    // 给角色授予权限 /admin/acl/permission/doAssign post
export const reqAddRolepower = (roleId, permissionId) => {
    return request({
        url: '/admin/acl/permission/doAssign',
        method: 'post',
        params: { roleId, permissionId }

    })
}