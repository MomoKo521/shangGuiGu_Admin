<template>
  <div>
    <!-- 卡片 下拉框-->
    <el-card style="margin: 20px 0px">
      <CategorySelect @select3="select3" :show="scene != 0"></CategorySelect>
    </el-card>
    <!-- 卡片  内容区-->
    <el-card>
      <!-- 底部这里是有三部分进行切换  -->
      <!-- spu展示列表数据 -->
      <div v-show="scene == 0">
        <!-- button -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          :disabled="!form.category3Id"
          @click="addspu"
          >添加spu</el-button
        >
        <!-- table 表格 -->
        <el-table :data="spuAttrList" style="width: 100%" border>
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="scope">
              <!-- 文字悬浮 -->
              <el-tooltip content="添加sku" placement="bottom" effect="light">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="addsku(scope.row)"
                ></el-button>
              </el-tooltip>

              <el-tooltip content="修改spu" placement="bottom" effect="light">
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  size="mini"
                  @click="updateSpu(scope.row)"
                ></el-button>
              </el-tooltip>

              <el-tooltip
                content="查看当前spu全部sku列表"
                placement="bottom"
                effect="light"
              >
                <el-button
                  type="info"
                  icon="el-icon-info"
                  size="mini"
                  @click="isShowdialogTable(scope.row)"
                ></el-button>
              </el-tooltip>

              <el-tooltip content="删除spu" placement="bottom" effect="light">
                <el-popconfirm
                  title="这是一段内容确定删除吗"
                  @onConfirm="deletespu(scope.row)"
                  style="margin-left: 10px"
                >
                  <el-button
                    type="danger"
                    icon="el-icon-delete-solid"
                    size="mini"
                    slot="reference"
                  ></el-button>
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 8]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->,sizes,total"
          :total="total"
        >
        </el-pagination>
        <!-- sku dilog对话框 -->
        <el-dialog
          :before-close="close"
          :title="`${spuTitleName}的sku列表`"
          :visible.sync="dialogTableVisible"
        >
          <el-table :data="FindBySpuList" v-loading="loading">
            <el-table-column property="skuName" label="名称" width="150">
            </el-table-column>
            <el-table-column
              property="price"
              label="价格"
              width="200"
            ></el-table-column>
            <el-table-column property="weight" label="重量"></el-table-column>
            <el-table-column label="默认图片">
              <template slot-scope="scope">
                <img
                  :src="scope.row.skuDefaultImg"
                  style="height: 100px; width: 100px"
                />
                <span v-if="!scope.row.skuDefaultImg">暂无图片</span>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </div>
      <!-- spu 添加|修改 数据 -->
      <div v-show="scene == 1">
        <spuForm @changeScene="changeScene" ref="spu"></spuForm>
      </div>
      <!--  添加sku-->
      <div v-show="scene == 2">
        <skuForm ref="sku" @changeScene="changeScene"></skuForm>
      </div>
    </el-card>
  </div>
</template>

<script>
import spuForm from "./spuForm";
import skuForm from "./skuForm";
export default {
  name: "SPU",
  components: {
    spuForm,
    skuForm,
  },
  data() {
    return {
      // //下拉框组件是否禁用
      // show: true,
      //下拉框组件 每个下拉框选中的id
      form: {},
      // 页码
      page: 1,
      // 页数
      limit: 3,
      //数据总数
      total: 0,
      spuAttrList: [],
      scene: 0, //0代表要展示spu列表数据 1添加spu|修改spu 2添加sku
      dialogTableVisible: false, //是否展示skudilog对话框 默认不展示
      FindBySpuList: [], //存储用户点击的查看当前spu的sku列表数据
      spuTitleName: "", //存储用户点击的查看当前spu的sku列表  点击的那个spu name
      loading: true, //加载数据时显示动画
    };
  },
  methods: {
    //当选三级下拉框发送变化触发 获取下拉框组件  每个下拉框选中的id
    select3(form) {
      this.form = form;
      //获取数据
      this.getSpuAttr();
    },
    //获取spu数据
    async getSpuAttr() {
      try {
        let refult = await this.$API.spu.reqGetSpuAttr(
          this.page,
          this.limit,
          this.form.category3Id
        );
        //console.log(refult);
        this.spuAttrList = refult.data.records;
        this.total = refult.data.total;
      } catch (error) {}
    },
    //分页limit发生变化
    handleSizeChange(limit) {
      this.limit = limit;
      // 刷新数据
      this.getSpuAttr();
    },
    //分页page发生变化
    handleCurrentChange(page) {
      this.page = page;
      // 刷新数据
      this.getSpuAttr();
    },

    // =====1 添加spu
    addspu() {
      //切换为展示添加spu
      this.scene = 1;
      this.$refs.spu.addSpuDate(this.form.category3Id);
    },
    // 自定义事件回调 (spufrom) 用户点击取消切换显示spu列表数据
    changeScene({ scene, flag }) {
      // flag: 判断用户执行的是什么操作  添加spu属性 就展示第一页数据  修改就停留在当前页
      this.scene = scene;
      // 刷新数据
      if (flag == "修改") {
        // 停留在当前页
        this.getSpuAttr(this.page);
      } else {
        this.getSpuAttr((this.page = 1));
      }
    },
    // =====2 修改spu
    updateSpu(row) {
      this.scene = 1;
      // 用户点击修改spu要发送四个请求获取修改的数据
      //但是此时不能子组件mounted触发请求接口函数 因为子组件是使用v-show 显示与隐藏的  盖子组件早就加载完毕了 不会触发mounted
      //解决办法在父组件触发子组件方法  在父组件中可以通过$ref获取子组件等等
      this.$refs.spu.initSpuData(row);
    },
    // =====3 添加sku
    addsku(row) {
      this.scene = 2;
      this.$refs.sku.getDate(row, this.form);
    },
    // sku 切换场景
    changeScene(scene) {
      this.scene = 0;
    },
    // 删除spu
    async deletespu(row) {
      try {
        await this.$API.spu.reqDeleteSpu(row.id);
        this.$message.success("删除成功");
        // 刷新数据
        this.getSpuAttr();
      } catch (error) {
        this.$message.error("删除失败");
      }
    },
    // 用户点击查看sku dilog对话框
    async isShowdialogTable(row) {
      this.spuTitleName = row.spuName;
      this.dialogTableVisible = true;
      // 获取当前用户点击的spu的sku列表数据
      let FindBySpuList = await this.$API.spu.reqGetFindBySpu(row.id);
      if (FindBySpuList.code == 200) {
        this.FindBySpuList = FindBySpuList.data;
        // 当sku table数据返回时关闭数据加载动画效果
        this.loading = false;
      }
    },
    // 用户点击按钮关闭sku dilog对话框
    close(done) {
      // 关闭时要把sku table 数据加载动画再次开启
      this.loading = true;
      // 且要把sku table 数据清空
      this.FindBySpuList = [];
      // 关闭 su dilog对话框
      done();
    },
  },
};
</script>

<style>
</style>