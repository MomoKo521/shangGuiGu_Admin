<template>
  <div>
    <!-- 
        row-key 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。
        expand-row-keys 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。
    -->
    <el-table
      :data="menuList"
      style="width: 100%; margin-top: 10px"
      border
      row-key="id"
      :expand-row-keys="expandKeys"
    >
      <el-table-column label="名称" prop="name"> </el-table-column>
      <el-table-column label="权限值" prop="code"> </el-table-column>
      <el-table-column label="跳转值" prop="desc"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scoped">
          <el-button
            :disabled="scoped.row.level === 4"
            type="primary"
            :title="getTitle(scoped.row.level)"
            icon="el-icon-plus"
            size="mini"
            @click="addMenu(scoped.row)"
          ></el-button>
          <el-button
            :disabled="scoped.row.level === 1"
            type="primary"
            :title="scoped.row.level == 4 ? '修改功能' : '修改菜单'"
            icon="el-icon-edit"
            size="mini"
            @click="UpdateMenu(scoped.row)"
          ></el-button>
          <el-button
            :disabled="scoped.row.level === 1"
            type="danger"
            title="删除"
            icon="el-icon-delete"
            @click="deleteMenu(scoped.row.id)"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- dilog 添加 | 修改菜单对话框 -->
    <el-dialog :title="dilogTile" :visible.sync="dialogVisible" width="width">
      <!-- from 收集数据 -->
      <el-form
        ref="form"
        :model="permission"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item
          label="父级名称"
          v-if="permission.level > 2 && !permission.id"
        >
          <el-input :disabled="true" v-model="permission.pname"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="permission.name"></el-input>
        </el-form-item>
        <el-form-item label="功能权限值" prop="code">
          <el-input v-model="permission.code"></el-input>
        </el-form-item>
        <el-form-item label="跳转路由权限值" v-if="permission.level === 4">
          <el-input v-model="permission.toCode"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdatePermission"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "menus",
  data() {
    return {
      menuList: [], //存储菜单table数据
      expandKeys: [], // 需要自动展开的项
      permission: {
        // 要操作的菜单权限对象
        level: 0,
        name: "",
        code: "",
        toCode: "",
      },
      // 表单效验规则
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
      dialogVisible: false,
    };
  },
  methods: {
    // 获取菜单管理列表数据
    async getMenuList() {
      let refult = await this.$API.menu.reqGetmenuList();
      //console.log(refult);
      if (refult.code == 20000) {
        this.menuList = refult.data.children;
        this.expandKeys = [this.menuList[0].id];
      }
    },
    // 用户点击添加按钮
    addMenu(row) {
      this.dialogVisible = true;
      this.permission.pid = row.id;
      this.permission.level = row.level + 1;
      this.permission.pname = row.name;
      this.permission.type = this.permission.level === 4 ? 2 : 1;
    },
    // 获取用户当前点击的添加按钮是添加菜单还是添加功能标题
    getTitle(level) {
      if (level == 3) {
        return "添加功能";
      } else {
        return "添加菜单";
      }
    },
    //添加  或者  修改某个功能权限
    addOrUpdatePermission() {
      // 效验表单
      this.$refs.form.validate(async (flag) => {
        if (flag) {
          const { pname, ...perm } = this.permission; // pname不需要携带
          // console.log(perm);
          if (perm.id) {
            // 修改

            let refult = await this.$API.menu.reqUpdateMenu(perm);
            if (refult.code == 20000) {
              this.$message.success("修改成功");
              // 刷新数据
              this.getMenuList();
              // 重置数据
              this.resetFrom();
            }
          } else {
            //  添加
            let refult = await this.$API.menu.reqAddmenu(perm);
            if (refult.code == 20000) {
              this.$message.success("添加成功");
              // 刷新数据
              this.getMenuList();
              // 重置表单
              this.resetFrom();
            }
          }
        }
      });
    },
    // 修改菜单
    UpdateMenu(row) {
      // console.log(row);
      this.dialogVisible = true;
      this.permission = { ...row }; // 使用浅拷贝
      this.permission.type = this.permission.level === 4 ? 2 : 1;
    },
    //重置from
    resetFrom() {
      this.dialogVisible = false;
      // 重置数据
      this.permission = {
        level: 0,
        name: "",
        code: "",
        toCode: "",
      };
    },
    // 删除菜单
    async deleteMenu(id) {
      const flag = await this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);

      if (flag == "confirm") {
        // 确定删除
        let refult = await this.$API.menu.reqDeleteMenu(id);
        //console.log(refult);
        if (refult.code == 20000) {
          this.$message.success("删除成功");
          // 刷新数据
          this.getMenuList();
        }
      }
    },
  },
  mounted() {
    this.getMenuList();
  },
  computed: {
    // 计算机出当前dilog 标题是修改还是添加菜单
    dilogTile() {
      if (this.permission.id) {
        //修改
        return this.permission.level == 4 ? "修改" : "修改菜单";
      } else {
        //添加
        return this.permission.level == 4
          ? "添加功能"
          : `添加菜单${this.permission.level == 2 ? "一级" : "二级"}菜单`;
      }
    },
  },
};
</script>

<style>
</style>