// 把管理的接口汇总统一暴露出去
// 商品管理
import * as tradeMark from './product/tradeMark.js'; //导入商品管理/品牌管理接口文件
import * as attr from './product/attr.js'; //导入商品管理/平台属性接口文件
import * as sku from './product/sku.js'; //导入商品管理/sku接口文件
import * as spu from './product/spu.js'; //导入商品管理/spu接口文件




// 权限管理模块接口
import * as user from './power/user.js' //导入权限管理/用户管理接口文件
import * as role from './power/role.js' //导入权限管理/角色管理接口文件
import * as menu from './power/menu.js' //导入权限管理/菜单管理接口文件

export default {
    tradeMark,
    attr,
    sku,
    spu,
    user,
    role,
    menu
}