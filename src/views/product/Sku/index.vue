<template>
  <div>
    <!-- 卡片 -->
    <el-card style="margin-top: 20px">
      <!-- table表格  -->
      <el-table style="width: 100%; margin: 20px 0" border :data="skuList">
        <el-table-column label="序号" type="index" align="center" width="80px">
        </el-table-column>
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="skuDesc" label="描述" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="130px" align="center">
          <template slot-scope="scope">
            <img
              :src="scope.row.skuDefaultImg"
              style="height: 100px; width: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量(KG)" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格(元)" width="80px">
        </el-table-column>
        <el-table-column label="名称操作" width="width" align="center">
          <template slot-scope="scope">
            <!-- button -->
            <!-- 上架 -->
            <el-button
              v-if="scope.row.isSale == 0"
              type="success"
              icon="el-icon-top"
              size="mini"
              @click="Sale(scope.row)"
            ></el-button>
            <!-- 下架 -->
            <el-button
              v-else
              type="info"
              icon="el-icon-bottom"
              size="mini"
              @click="canleSale(scope.row)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="developing"
            ></el-button>
            <el-button
              type="info"
              icon="el-icon-info"
              @click="getSkuInfo(scope.row)"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deletesku(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="text-align: center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 12, 14, 16]"
        :page-size="limit"
        layout=" prev, pager, next, jumper,->,sizes,total"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 抽屉效果 -->
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      :show-close="false"
      size="50%"
    >
      <!-- Layout 布局 -->
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16"
          ><el-tag
            type="success"
            v-for="item in skuInfo.skuAttrValueList"
            :key="item.id"
            style="margin: 0 10px"
            >{{ item.attrId }}-{{ item.valueId }}</el-tag
          ></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="12"
          ><el-carousel height="450px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" style="height: 100%" />
            </el-carousel-item> </el-carousel
        ></el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "SKU",
  data() {
    return {
      page: 1, //当前页码
      limit: 10, //当前页码展示的数据数量
      skuList: [], //存储sku列表数据
      total: 0, //存储sku列表总数据条数
      skuInfo: {}, //存储sku详细信息、
      drawer: false, //是否显示抽屉
      direction: "rtl", //抽屉 打开的方向 rtl 默认从右向左打开
    };
  },
  methods: {
    // 获取sku列表数据
    async getSKuList() {
      let skuList = await this.$API.sku.reqGetSkuList(this.page, this.limit);
      if (skuList.code == 200) {
        this.skuList = skuList.data.records;
        this.total = skuList.data.total;
      }
    },
    //limit发送变化
    handleSizeChange(limit) {
      this.limit = limit;
      // 刷新sku列表数据
      this.getSKuList();
    },
    // 当前page发送变化
    handleCurrentChange(page) {
      this.page = page;
      // 刷新sku列表数据
      this.getSKuList();
    },
    // 上架
    async Sale(row) {
      let refult = await this.$API.sku.reqSale(row.id);
      if (refult.code == 200) {
        this.$message.success("上架成功");
        row.isSale = 1;
      }
    },
    // 下架
    async canleSale(row) {
      let refult = await this.$API.sku.reqCancaelSale(row.id);
      if (refult.code == 200) {
        this.$message.success("下架成功");
        row.isSale = 0;
      }
    },
    // 功能开发中
    developing() {
      this.$message("功能开发中");
    },
    // 获取sku详细信息
    async getSkuInfo(row) {
      let refult = await this.$API.sku.reqGetSkuInfo(row.id);
      //console.log(refult);
      if (refult.code == 200) {
        this.skuInfo = refult.data;
        this.drawer = true;
      }
    },
    // 关闭抽屉效果
    handleClose(done) {
      done();
    },
    // 点击删除sku
    async deletesku(row) {
      let flag = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((erro) => erro);
      // console.log(flag);
      if (flag == "confirm") {
        let refult = await this.$API.sku.reqDeleteSku(row.id);
        if (refult.code == 200) {
          this.$message.success("删除成功");
          // 更新数据
          this.getSKuList();
        }
      }
    },
  },
  mounted() {
    this.getSKuList();
  },
};
</script>

<style  scoped>
.el-row .el-col-5 {
  text-align: right;

  font-weight: 700;
}
.el-col {
  font-size: 20px;
  margin: 10px;
}
.el-row .el-col-16 {
  color: gray;
}
</style>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.el-carousel__button {
  background-color: red;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
</style>