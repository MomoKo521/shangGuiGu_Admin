<template>
  <div style="margin-top: 10px">
    <!-- 搜索 -->
    <div>
      <el-input
        style="width: 200px; margin-right: 10px"
        v-model="tempsearchObj.username"
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
        style="width: 100%; margin-top: 10px"
        border
        :data="useLits"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="width"> </el-table-column>
        <el-table-column label="序号" type="index" width="80" align="center">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="width">
        </el-table-column>
        <el-table-column prop="nickName" label="用户昵称" width="width">
        </el-table-column>
        <el-table-column prop="roleName" label="权限列表" width="width">
        </el-table-column>
        <el-table-column prop="gmtCreate" label="创建时间" width="width">
        </el-table-column>
        <el-table-column prop="gmtModified" label="更新时间" width="width">
        </el-table-column>
        <el-table-column label="操作" width="width">
          <template slot-scope="scoped">
            <el-button
              type="info"
              icon="el-icon-user-solid"
              size="mini"
              @click="showAddRole(scoped.row)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showdilog(scoped.row)"
            ></el-button>
            <!-- 删除 -->
            <el-popconfirm
              title="确定删除吗？"
              style="margin-left: 10px"
              @onConfirm="deleteuser(scoped.row.id)"
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
      :page-sizes="[3, 4, 5, 6]"
      :page-size="limite"
      layout=" prev, pager, next, jumper,->,sizes, total"
      :total="Total"
    >
    </el-pagination>
    <!-- 添加 | 修改 用户对话框 -->
    <!--  :before-close="handleClose" -->
    <el-dialog
      :title="addOrUpdateUserInfo.id ? '修改用户' : '添加用户'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <!-- 表单 -->
      <el-form
        ref="form"
        :rules="addOrupdaterules"
        :model="addOrUpdateUserInfo"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addOrUpdateUserInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="addOrUpdateUserInfo.nickName"></el-input>
        </el-form-item>
        <el-form-item
          label="用户密码"
          prop="password"
          v-if="!addOrUpdateUserInfo.id"
        >
          <el-input v-model="addOrUpdateUserInfo.password"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="addOrupdateUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置角色对话框 -->
    <el-dialog title="设置角色" :visible.sync="isShowaddRole" width="40%">
      <el-form ref="roleFrom" label-width="80px">
        <el-form-item label="用户名">
          <el-input :placeholder="username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <!-- -->
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
        </el-form-item>
        <el-form-item label="">
          <el-checkbox-group
            v-model="assignRoles"
            @change="handleCheckedChange"
          >
            <el-checkbox
              v-for="role in roleList"
              :key="role.id"
              :label="role.id"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowaddRole = false">取 消</el-button>
        <el-button type="primary" @click="addUserRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "user",
  data() {
    return {
      page: 1,
      limite: 3,
      Total: 0,
      useLits: [], //存储用户列表数据
      tempsearchObj: {
        username: "",
      }, //临时查询关键字
      shearchObj: {
        username: "",
      }, //查询关键字
      // 收集添加用户或者修改用户信息
      addOrUpdateUserInfo: {
        //id: "string",
        nickName: "",
        password: "",
        username: "",
      },
      addOrupdaterules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输密码", trigger: "blur" },
          { min: 6, message: "密码不能小于6位", trigger: "blur" },
        ],
        nickName: [],
      },
      // 是否展示添加 | 修改 对话窗口
      dialogVisible: false,
      // 是否展示设置角色对话窗口
      isShowaddRole: false,
      //给用户添加角色
      roleList: [], //存储角色列表
      assignRoles: [], //存储用户的角色id列表
      isIndeterminate: false, // 是否是不确定的
      username: "", //存储要添加角色的用户名称
      userId: "", //存储要添加角色的用户id
      idList: [], //存储批量删除的id
      checkAll: false, // 是否全选
    };
  },
  methods: {
    // 用户列表数据
    async getUSerList() {
      let refult = await this.$API.user.reqGteUserList(
        this.page,
        this.limite,
        this.shearchObj
      );
      // console.log(refult);
      if (refult.code == 20000) {
        this.useLits = refult.data.items;
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
      this.shearchObj.username = "";
      this.tempsearchObj.username = "";
      this.getUSerList();
    },
    // 用户点击请求添加按钮清空数据
    cancle() {
      this.dialogVisible = false;
      // 重置表单数据数据
      this.$refs.form.resetFields();
    },
    // 用户点击确定 添加或者修改 user
    async addOrupdateUser() {
      this.$refs.form.validate(async (item) => {
        //console.log(item);
        if (item) {
          // 隐藏对话窗口
          this.dialogVisible = false;
          if (!this.addOrUpdateUserInfo.id) {
            // 没有id执行添加操作
            let refult = await this.$API.user.reqAddUser(
              this.addOrUpdateUserInfo
            );
            if (refult.code == 20000) {
              this.$message.success("添加成功");
              // 重置表单数据数据
              this.$refs.form.resetFields();
              // 刷新数据
              this.getUSerList();
            }
          } else {
            // 修改
            let refult = await this.$API.user.reqUPdateUser(
              this.addOrUpdateUserInfo
            );

            if (refult.code == 20000) {
              this.$message.success("修改成功");
              this.dialogVisible = false;
              // 重置form表单数据
              delete this.addOrUpdateUserInfo.id;
              this.addOrUpdateUserInfo.nickName = "";
              this.addOrUpdateUserInfo.username = "";

              // 刷新数据
              this.getUSerList();
            } else {
              this.$message.error("修改失败");
              this.dialogVisible = false;
            }
          }
        }
      });
    },
    // 用户点击修改
    showdilog(row) {
      this.addOrUpdateUserInfo.id = row.id;
      this.addOrUpdateUserInfo.nickName = row.nickName;
      this.addOrUpdateUserInfo.username = row.username;
      // 展示修改对话框
      this.dialogVisible = true;
    },
    // 用户点击设置角色
    async showAddRole(row) {
      // 收集数据
      this.username = row.username;
      this.userId = row.id;
      this.isShowaddRole = true;
      // 获取当前用户的角色
      let refult = await this.$API.user.reqGetUserRole(row.id);
      // console.log(refult);
      if (refult.code == 20000) {
        this.roleList = refult.data.allRolesList;
        // 获取当前用户以及用于角色的id列表
        this.assignRoles = refult.data.assignRoles.map((item) => item.id);
        // 如果长度一种那么一开始就全选
        this.checkAll = this.assignRoles.length == this.roleList.length;
      }
    },
    // 角色多选框变化
    handleCheckedChange(value) {
      //  console.log(value);
      //value  多选框最新的被勾选的角色id列表数组
      // 角色多选框发生改变判断是否全部选中了 如果是那么全选多选框就要自动勾选  否则就取消勾选
      if (value.length < this.roleList.length) {
        this.checkAll = false;
      } else {
        this.checkAll = true;
      }
    },
    // 角色全选框发生变化
    handleCheckAllChange(value) {
      // value  全选框  状态 ture  false
      if (value) {
        let orleIds = [];
        this.roleList.forEach((item) => {
          orleIds.push(item.id);
        });
        // 如果是全选 那么就获取角色列表id 赋值给 以选中的角色id列表
        this.assignRoles = orleIds;
      } else {
        // 取消全选就情况 以选中的角色id列表
        this.assignRoles = [];
      }
      //console.log(this.assignRoles);
    },
    // 用户点击确定 设置角色
    async addUserRole() {
      //console.log(this.assignRoles, this.userId);
      let roleId = this.assignRoles.join(",");
      let reuflt = await this.$API.user.reqAssignRole(this.userId, roleId);
      if (reuflt.code == 20000) {
        this.$message.success("分配角色成功");
        this.isShowaddRole = false;
        // 刷新数据
        this.getUSerList();
      }
    },
    // 用户点击确定删除角色
    async deleteuser(id) {
      let refult = await this.$API.user.reqDeleteUser(id);
      if (refult.code == 20000) {
        this.$message.success("删除成功");
        // 刷新数据
        this.getUSerList();
      }
    },
    // 表格单选框发生变化
    handleSelectionChange(val) {
      // 多选框发生变化后 分别选中的属性值
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
      let refult = await this.$API.user.reqDeleteAllUser(this.idList);
      if (refult.code == 20000) {
        this.$message.success("批量删除成功");
        // 刷新数据
        this.getUSerList();
      }
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



