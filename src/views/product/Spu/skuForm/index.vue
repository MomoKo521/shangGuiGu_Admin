<template>
  <div>
    <!-- from -->
    <el-form ref="form" :model="skuInfo" label-width="80px">
      <el-form-item label="SPU名称">
        <span>{{ spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          type="number"
          v-model="skuInfo.price"
          placeholder="价格(元)"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          v-model="skuInfo.skuDesc"
          type="textarea"
          rows="4"
          placeholder="规格描述"
        ></el-input>
      </el-form-item>
      <!-- 平台属性 -->
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item
            :label="item.attrName"
            v-for="item in attrInfoList"
            :key="item.id"
          >
            <el-select placeholder="请选择" v-model="item.attrIdAndValueId">
              <el-option
                v-for="Attrvalue in item.attrValueList"
                :key="Attrvalue.id"
                :label="Attrvalue.valueName"
                :value="`${item.id}:${Attrvalue.id}`"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <el-form label-width="80px" :inline="true">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in spuSaleAttr"
            :key="saleAttr.id"
          >
            <el-select
              placeholder="请选择"
              v-model="saleAttr.saleAttrIdAndsaleAttrValueId"
            >
              <el-option
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%; margin-bottom: 20px"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="图片" width="width">
            <template slot-scope="scope">
              <img
                :src="scope.row.imgUrl"
                style="height: 100px; width: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column label="名称" width="width" prop="imgName">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                v-if="scope.row.isDefault == 0"
                @click="changeDefault(scope.row)"
                >设置为默认</el-button
              >
              <el-tag type="success" v-else>默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <!-- button -->
        <el-button type="primary" @click="saveSkuInfo">保存</el-button>
        <el-button @click="cenle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "skuForm",
  data() {
    return {
      spuSaleAttr: [], //存储销售属性数
      spuImageList: [], //存储图片列表数据
      attrInfoList: [], //存储平台属性数据
      //存储点击保存按钮提交服务器的数据
      skuInfo: {
        // 第一类数据  收集父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类   需要通过双向绑定的收集数据
        price: 0, //价格
        weight: "", //重量
        skuDesc: "", //描述
        skuName: "", //skuname
        skuDefaultImg: "", //默认图片
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        // 收集 图片的字段
        skuImageList: [
          // {
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   spuImgId: 0,
          // },
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      // 暂时存储用户勾选的图片列表信息
      imageList: [],
      //spuname
      spuName: "",
    };
  },
  methods: {
    // 获取skufrom数据
    async getDate(row, form) {
      // 收集已有的数据
      this.skuInfo.category3Id = row.category3Id;
      this.skuInfo.spuId = row.id;
      this.skuInfo.tmId = row.tmId;
      this.spuName = row.spuName;
      // row 当前用户点击的那行数据信息
      // from 三级下拉框的 id
      // 获取销售属性
      let spuSaleAttr = await this.$API.spu.reqgetSpuSaleAttrList(row.id);
      if (spuSaleAttr.code == 200) {
        this.spuSaleAttr = spuSaleAttr.data;
      }

      // 获取 平台属性
      let attrInfoList = await this.$API.spu.reqGetAttrInfoList(
        form.category1Id,
        form.category2Id,
        row.category3Id
      );
      if (attrInfoList.code == 200) {
        this.attrInfoList = attrInfoList.data;
      }
      // 获取图片列表
      let spuImageList = await this.$API.spu.reqGetspuImageList(row.id);
      //console.log(spuImageList);
      if (spuImageList.code == 200) {
        let ImageList = spuImageList.data;
        ImageList.forEach((element) => {
          // 图片列表返回的参数中没有isDefault属性 但保存添加sku请求需要isDefault参数
          element.isDefault = 0;
        });
        this.spuImageList = ImageList;
      }
    },
    // 排他  点击设置默认
    changeDefault(row) {
      // 图片列表的数据isDefault字段变为0
      this.spuImageList.forEach((elemt) => {
        elemt.isDefault = 0;
      });
      // 点击的那个图片变为1
      row.isDefault = 1;
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // table表格复选框按钮事件 用户点击某个复选框或者点击全选框触发
    handleSelectionChange(selection) {
      //selection  用户点击某个复选框或者点击全选框 勾选的参数信息
      //console.log(selection);
      // 把用户勾选的图片列表数据存储在imageList中
      this.imageList = selection;
    },
    // 用户点击 取消按钮 切换场景
    cenle() {
      this.$emit("changeScene", 0);
      // 重置sku 组件data数据
      Object.assign(this._data, this.$options.data());
    },
    // 用户点击保存按钮 提交数据添加sku
    async saveSkuInfo() {
      // 整理平台属性数据
      this.attrInfoList.forEach((item) => {
        // 如果存在attrIdAndValueId 说明用户选择了平台属性
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          this.skuInfo.skuAttrValueList.push({
            attrId,
            valueId,
          });
          // console.log("push成功", this.skuInfo.skuAttrValueList);
        }
      });
      // 整理销售属性
      this.spuSaleAttr.forEach((item) => {
        // 如果存在saleAttrIdAndsaleAttrValueId 说明用户选择了销售属性
        if (item.saleAttrIdAndsaleAttrValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.saleAttrIdAndsaleAttrValueId.split(":");
          this.skuInfo.skuSaleAttrValueList.push({
            saleAttrId,
            saleAttrValueId,
          });
          //console.log("push成功", this.skuInfo.skuSaleAttrValueList);
        }
      });
      //  整理图片的字段
      this.skuInfo.skuImageList = this.imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      //console.log(this.skuInfo);
      //发送保存请求;
      let refult = await this.$API.spu.reqSaveSkuInfo(this.skuInfo);
      if (refult.code == 200) {
        this.$message.success("保存成功");
        // 切换为spu列表
        this.$emit("changeScene", 0);
        // 重置sku 组件data数据
        Object.assign(this._data, this.$options.data());
      }
    },
  },
};
</script>

<style>
</style>