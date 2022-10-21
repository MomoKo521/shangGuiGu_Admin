// 导入axios实列
import request from '@/utils/request'

// 获取用户列表数据 /admin/acl/user/{page}/{limit} get
export const reqGteUserList = (page, limit, shearchObj) => {
        return request({
            url: `/admin/acl/user/${page}/${limit}`,
            method: 'get',
            params: shearchObj,
        })
    }
    // 新增用户 /admin/acl/user/save post
export const reqAddUser = (data) => {
        return request({
            url: '/admin/acl/user/save',
            method: 'post',
            data
        })

    }
    // 修改 /admin/acl/user/update put
export const reqUPdateUser = (data) => {

        return request({
            url: '/admin/acl/user/update',
            method: 'put',
            data: data
        })
    }
    // 删除用户 /admin/acl/user/remove/{id} delete
export const reqDeleteUser = (id) => {
        return request({
            url: `/admin/acl/user/remove/${id}`,
            method: 'delete'
        })
    }
    // 批量删除用户 /admin/acl/user/batchRemove  delete

export const reqDeleteAllUser = (idList) => {
        return request({
            url: '/admin/acl/user/batchRemove',
            method: 'delete',
            data: idList

        })
    }
    // 获取 某个用户的 所有角色  /admin/acl/user/toAssign/{userId} get
export const reqGetUserRole = (userId) => {
        return request({
            url: `/admin/acl/user/toAssign/${userId}`,
            method: 'get',
        })
    }
    // 给某个用户设置角色 /admin/acl/user/doAssign post

export const reqAssignRole = (userId, roleId) => {
    // console.log(userId, roleId);
    return request({
        url: '/admin/acl/user/doAssign',
        method: 'post',
        params: {
            userId,
            roleId
        }
    })
}