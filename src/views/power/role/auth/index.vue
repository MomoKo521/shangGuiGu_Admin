<template>
  <div>
    <el-input
      :placeholder="roleName"
      :disabled="true"
      style="margin: 10px 0"
    ></el-input>
    <!-- tree-->
    <el-tree
      style="margin: 20px 0"
      ref="tree"
      :data="roleAuthList"
      node-key="id"
      show-checkbox
      default-expand-all
      :props="defaultProps"
    >
    </el-tree>
    <!--  -->
    <el-button :loading="loading" type="primary" @click="save">保存</el-button>
    <el-button @click="$router.replace({ name: 'Role' })">取消</el-button>
  </div>
</template>

<script>
export default {
  name: "auth",
  data() {
    return {
      roleId: "",
      roleName: "",
      roleAuthList: [], //存储树形菜单数据
      defaultProps: {
        //树形菜单属性值设置
        children: "children",
        label: "name",
      },
      loading: false, // 用来标识是否正在保存请求中的标识, 防止重复提交
    };
  },
  methods: {
    // 获取角色授权树形菜单数据
    async getauthList() {
      let refult = await this.$API.role.reqGetRoleAuth(this.roleId);
      // console.log(refult.data);
      if (refult.code == 20000) {
        this.roleAuthList = refult.data.children;
        // 获取 默认被勾选的四级树形菜单的id
        const checkedIds = this.getCheckedIds(refult.data.children);
        // console.log(checkedIds);
        // 通过 keys 设置目前勾选的节点， (keys, leafOnly) 接收两个参数，1. 勾选节点的 key 的数组
        this.$refs.tree.setCheckedKeys(checkedIds);
      }
    },

    /* 
      得到所有选中的id列表
      前提:我们当前数据最多4级菜单目录
      */
    getCheckedIds(auths, initArr = []) {
      // console.log(auths);
      // initArr 存储每次递归返回的被选中值的id数组
      return auths.reduce((pre, item) => {
        // item.level==4 最后一级
        // 思路:获取最后一级被勾选的id  为什么只需要获取最后一级?  因为子级有一个被勾选那么父级自动勾选
        if (item.select && item.level === 4) {
          pre.push(item.id);
        } else if (item.children) {
          // 递归  如果当前item存在children元素  那么就把递归一种循环到最后一级的tree菜单
          this.getCheckedIds(item.children, initArr);
        }
        // pre 存储上次循环返回的被勾选的四级菜单的id数组
        return pre;
      }, initArr);
    },
    // 用户点击保存
    async save() {
      //先获取被勾选的 三级和四级菜单di
      // getCheckedKeys 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
      let idlist = this.$refs.tree.getCheckedKeys().join(",");

      this.loading = true;
      // console.log(this.roleId);
      // console.log(idlist);
      let refult = await this.$API.role.reqAddRolepower(this.roleId, idlist);
      if (refult.code == 20000) {
        this.$message.success("授权成功");
        // 添加路由
        this.$router.push("/role/list");
      }
    },
  },
  mounted() {
    // 拿到router中的角色id 和 角色名称参数
    this.roleId = this.$route.params.id;
    this.roleName = this.$route.query.roleName;
    this.getauthList();
  },
};
</script>

<style>
</style>