<template>
  <div>
    <template>
      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-top: 20px"
          @click="showDialog"
          >添加</el-button
        >
        <!-- 表格 -->
        <el-table
          border
          style="width: 100%; margin-top: 10px"
          :data="markList.records"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60px"
          >
          </el-table-column>
          <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
          <el-table-column prop="name" label="品牌LOGO">
            <template slot-scope="scope">
              <img
                :src="scope.row.logoUrl"
                alt="品牌logo"
                style="width: 60px; height: 70px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="updeDate(scope.row)"
                >操作</el-button
              >
              <el-button
                type="danger"
                size="mini"
                @click="deleteDate(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          style="text-align: center; margin-top: 10px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[3, 4, 5]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->,sizes,total"
          :total="markList.total"
        >
        </el-pagination>
        <!-- 添加对话框 -->
        <el-dialog
          :title="this.tdmfrom.id ? '修改品牌' : '添加品牌'"
          :visible.sync="dialogFormVisible"
        >
          <el-form
            :rules="rules"
            ref="ruleForm"
            style="width: 80%"
            :model="tdmfrom"
            label-width="100px"
          >
            <el-form-item label="品牌名称" prop="tmName">
              <el-input v-model="tdmfrom.tmName"></el-input>
            </el-form-item>
            <el-form-item label="品牌名称" prop="logoUrl">
              <!-- 上传图片 -->
              <!-- 
                action 图片上传到服务器的地址接口
               -->
              <el-upload
                class="avatar-uploader"
                action="/api/admin/product/fileUpload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="tdmfrom.logoUrl"
                  :src="tdmfrom.logoUrl"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addAndUpdateTradeMark"
              >确 定</el-button
            >
          </div>
        </el-dialog>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      page: 1,
      limit: 3,
      // 品牌数据
      markList: {},
      // 是否显示对话框
      dialogFormVisible: false,
      //  收起添加和修改表单数据
      tdmfrom: {
        logoUrl: "",
        tmName: "",
      },
      // 表单效验规则
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 3,
            max: 5,
            message: "长度在 3 到 5 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [{ required: true, message: "请上传图片", trigger: "change" }],
      },
    };
  },
  methods: {
    // 获取数据
    async getDate() {
      const { page, limit } = this;
      // console.log(this.$API);
      let refult = await this.$API.tradeMark.reqgetAttrList(page, limit);
      //console.log(refult);
      if (refult.code == 200) {
        this.markList = refult.data;
      } else {
        this.$message.error("获取数据失败");
      }
    },
    //size发生改变
    handleSizeChange(newlimit) {
      this.limit = newlimit;
      //拿到最新limit重新获取数据
      this.getDate();
    },
    //page发生改变
    handleCurrentChange(newpage) {
      //拿到最新page重新获取数据
      this.page = newpage;
      this.getDate();
    },
    // 展示对话框
    showDialog() {
      this.dialogFormVisible = true;
      // 每次显示对话框之前先重置一下表单
      this.tdmfrom.logoUrl = "";
      this.tdmfrom.tmName = "";
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res 图片上传成功的回调
      // console.log(res);
      //res.data服务器真实图片地址
      this.tdmfrom.logoUrl = res.data;
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      //const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    // 点击对话框确定按钮 发送添加或者修改品牌管理
    addAndUpdateTradeMark() {
      // 表单验证
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          const { tdmfrom } = this;
          let refult = await this.$API.tradeMark.reqUpdate(tdmfrom);
          if (refult.code == 200) {
            this.$message.success(this.tdmfrom.id ? "修该成功" : "添加成功");
            this.dialogFormVisible = false;
            // 重新获取数据
            this.getDate();
          } else {
            this.$message.error(this.tdmfrom.id ? "修改失败" : "添加失败");
          }
        }
      });
    },
    // 点击修改按钮
    updeDate(row) {
      // row当前点击修改的数据
      // 展示对话框
      this.dialogFormVisible = true;
      // 把当前行的数据赋值给tdmfrom
      // 浅拷贝
      this.tdmfrom = { ...row };
    },
    // 点击删除按钮
    async deleteDate(id) {
      //  id 要删除的商品id
      const decision = await this.$confirm(
        "此操作将永久删除用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //console.log(decision);
      //decision 用户点击的结果 值=confirm  用户点击了确定  值=cancel  用户点击了取消
      if (decision == "cancel") {
        return this.$message("以取消操作");
      }
      // 发送删除品牌请求
      let refult = await this.$API.tradeMark.reqDeleteDate(id);
      if (refult.code == 200) {
        // 防止删除删完页码数还停留在空白页码数处
        if (this.markList.records.length == 1) {
          this.page = this.page - 1;
        }
        //  刷新数据
        this.getDate();
        this.$message.success("删除成功");
      } else {
        this.$message.error("删除失败");
      }
    },
  },
  mounted() {
    this.getDate();
  },
};
</script>

<style >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>