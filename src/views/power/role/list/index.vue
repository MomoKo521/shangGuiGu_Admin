<template>
  <div style="margin-top: 10px">
    <!-- 搜索 -->
    <div>
      <el-input
        style="width: 200px; margin-right: 10px"
        v-model="tempsearchObj.roleName"
      ></el-input>
      <el-button type="primary" icon="el-icon-search" @click="serachName"
        >查询</el-button
      >
      <el-button @click="removeName">清空</el-button>
    </div>
    <!-- 表格 -->
    <div class="usertable">
      <el-button type="primary" @click="dialogVisible = true">添加</el-button>
      <el-popconfirm
        title="确定批量删除删除吗？"
        style="margin-left: 10px"
        @onConfirm="deleteAllUser"
      >
        <el-button type="danger" slot="reference" :disabled="idList.length < 1"
          >批量删除</el-button
        >
      </el-popconfirm>
      <el-table
        style="width: 60%; margin-top: 10px"
        border
        :data="roleLits"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50px"> </el-table-column>
        <el-table-column label="序号" type="index" width="80" align="center">
        </el-table-column>
        <el-table-column label="角色名称" width="width">
          <template slot-scope="scoped">
            <div v-if="!scoped.row.flag">{{ scoped.row.roleName }}</div>
            <div v-else>
              <el-input
                v-model="addOrUpdateUserInfo.roleName"
                size="mini"
                style="width: 80%; margin-right: 10px"
              ></el-input
              ><el-button
                type="warning"
                icon="el-icon-refresh"
                size="mini"
                @click="scoped.row.flag = false"
                >取消</el-button
              >
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200px">
          <template slot-scope="scoped">
            <el-button
              type="info"
              icon="el-icon-user-solid"
              size="mini"
              @click="toRoleauth(scoped.row)"
              title="角色授权"
            ></el-button>
            <el-button
              v-if="!scoped.row.flag"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showdilog(scoped.row)"
            ></el-button>
            <!-- 确定修改角色名称按钮 -->
            <el-button
              v-else
              type="primary"
              icon="el-icon-check"
              size="mini"
              @click="updateRole(scoped.row)"
            ></el-button>
            <!-- 删除 -->
            <el-popconfirm
              title="确定删除吗？"
              style="margin-left: 10px"
              @onConfirm="deleteRole(scoped.row.id)"
            >
              <el-button
                slot="reference"
                type="danger"
                icon="el-icon-delete-solid"
                size="mini"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 6, 7, 8]"
      :page-size="limite"
      layout=" prev, pager, next, jumper,->,sizes, total"
      :total="Total"
    >
    </el-pagination>
    <!-- 添加 | 修改 用户对话框 -->
    <!--  :before-close="handleClose" -->
    <el-dialog
      :title="addOrUpdateUserInfo.id ? '修改角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <!-- 表单 -->
      <el-form ref="form" :model="addOrUpdateUserInfo" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="addOrUpdateUserInfo.roleName"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="addOrupdateRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "role",
  data() {
    return {
      page: 1,
      limite: 5,
      Total: 0,
      roleLits: [], //存储用户列表数据
      tempsearchObj: {
        roleName: "",
      }, //临时查询关键字
      shearchObj: {
        roleName: "",
      }, //查询关键字
      // 收集添加用户或者修改用户信息
      addOrUpdateUserInfo: {
        //id: "",
        roleName: "",
      },

      // 是否展示添加 | 修改 对话窗口
      dialogVisible: false,

      idList: [], //存储批量删除的id
    };
  },
  methods: {
    // 角色列表数据
    async getUSerList() {
      let refult = await this.$API.role.reqGetRoleList(
        this.page,
        this.limite,
        this.shearchObj
      );
      // console.log(refult);
      if (refult.code == 20000) {
        this.roleLits = refult.data.items;
        // 添加标记
        this.roleLits.forEach((item) => {
          // 记住必须使用$set添加双向绑定数据

          this.$set(item, "flag", false);
        });
        this.Total = refult.data.total;
      }
    },
    // size 发生变化
    handleSizeChange(size) {
      this.limite = size;
      // 更新数据
      this.getUSerList();
    },
    // page 发生变化
    handleCurrentChange(page) {
      this.page = page;
      // 更新数据
      this.getUSerList();
    },
    // 搜索关键字
    serachName() {
      this.shearchObj = { ...this.tempsearchObj };
      // console.log(this.shearchObj);
      this.getUSerList();
    },
    //清空关键字
    removeName() {
      this.shearchObj.roleName = "";
      this.tempsearchObj.roleName = "";
      this.getUSerList();
    },
    // 用户点击请求添加按钮清空数据
    cancle() {
      this.dialogVisible = false;
      // 重置表单数据数据
      this.$refs.form.resetFields();
    },
    // 用户点击确定 添加角色
    async addOrupdateRole() {
      // 隐藏对话窗口
      this.dialogVisible = false;

      // 没有id执行添加操作
      let refult = await this.$API.role.reqAddRole(this.addOrUpdateUserInfo);
      //console.log(refult);
      if (refult.code == 20000) {
        this.$message.success("添加成功");
        // 重置表单数据数据
        this.addOrUpdateUserInfo.roleName = "";
        // 刷新数据
        this.getUSerList();
      }
    },
    // 修改角色
    async updateRole(row) {
      // 修改
      let refult = await this.$API.role.reqUpdateRole(this.addOrUpdateUserInfo);
      // console.log(refult);
      if (refult.code == 20000) {
        this.$message.success("修改成功");
        row.flag = false;
        // 重置一下收集的数据
        this.addOrUpdateUserInfo.roleName = "";
        delete this.addOrUpdateUserInfo.id;
        // 刷新数据
        this.getUSerList();
      } else {
        this.$message.error("修改失败");
        this.dialogVisible = false;
      }
    },
    // 用户点击修改
    showdilog(row) {
      // 排他  只能一次修改一个角色
      this.roleLits.forEach((item) => {
        item.flag = false;
      });
      this.addOrUpdateUserInfo.id = row.id;
      this.addOrUpdateUserInfo.roleName = row.roleName;
      row.flag = true;
    },

    // 用户点击确定删除角色
    async deleteRole(id) {
      let refult = await this.$API.role.reqDeleteRole(id);
      if (refult.code == 20000) {
        this.$message.success("删除成功");
        // 刷新数据
        this.getUSerList();
      }
    },
    // 表格单选框发生变化
    handleSelectionChange(val) {
      // 多选框发生变化后 别选中的属性值
      //console.log(val);
      // 重置收集勾选中的id数组
      this.idList = [];
      // 整理数据
      val.forEach((element) => {
        this.idList.push(element.id);
      });
      // console.log(this.idList);
    },
    // 用户点击批量删除
    async deleteAllUser() {
      // console.log(this.idList);
      let refult = await this.$API.role.reqDeleteAllRole(this.idList);
      if (refult.code == 20000) {
        this.$message.success("批量删除成功");
        // 刷新数据
        this.getUSerList();
      }
    },
    // 用户角色授权按钮
    toRoleauth(row) {
      //console.log(row);
      this.$router.push({
        name: "RoleAuth",
        params: { id: row.id },
        query: { roleName: row.roleName },
      });
    },
  },
  mounted() {
    this.getUSerList();
  },
};
</script>

<style scoped>
.usertable {
  margin: 20px 0;
}
</style>



