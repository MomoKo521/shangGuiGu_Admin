<template>
  <div>
    <!-- :model="form" -->
    <el-form ref="form" :model="spu" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option
            v-for="item in tradeMarKList"
            :key="item.id"
            :label="item.tmName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片 -->
        <!-- 
          file-list:照片墙需要展示的数据【数组：数组里面的元素务必要有name,url属性】
          on-preview：图片预览触发
          on-remove：图片删除触发
          on-success:图片上传成功
          -->
        <el-upload
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlesuccess"
          :file-list="spuImage"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unselectSaleAttr.length}未选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            v-for="item in unselectSaleAttr"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}:${item.name}`"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- 表格 -->
        <el-table :data="spu.spuSaleAttrList" style="width: 100%" border>
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150px">
          </el-table-column>
          <el-table-column prop="" label="属性值名称列表" width="width">
            <template slot-scope="scope">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in scope.row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="scope.row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!--  @keyup.enter.native="handleInputConfirm"
                -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(scope.row)"
                >+ 添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="150px">
            <template slot-scope="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice(scope.$index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "spuForm",
  data() {
    return {
      dialogImageUrl: "", //图片预览时的图片真实路径
      dialogVisible: false, //是否展示图片预览窗口
      //收集 添加 | 修改spu接口请求参数
      spu: {
        //存储spu信息
        // 三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台id
        tmId: "",
        //收集SPU图片信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      tradeMarKList: [], //存储品牌信息
      spuImage: [], //存储图标
      baseSaleAttrList: [], //存储销售属性信息
      // 收集  销售属性 参数
      attrIdAndAttrName: "", //收集未选择的销售属性的id and 收集添加销售属性的name
    };
  },
  methods: {
    //图片删除触发
    handleRemove(file, fileList) {
      // file 被删除的图片信息
      //fileList 照片墙删除某一张图片后，甚剩余的其他的图片信息
      //console.log(file, fileList);
      //收集照片墙的数据
      // 把被删除后的最新照片墙数据 更新到存储照片墙数据中
      this.spuImage = fileList;
    },
    //图片预览触发
    handlePictureCardPreview(file) {
      //获取要预览的图片路径
      this.dialogImageUrl = file.url;
      //显示图片预览窗口
      this.dialogVisible = true;
    },
    // 图片上传成功
    handlesuccess(response, file, fileList) {
      // response 图片上传成功后服务器返回的回调
      // file 上传成功的图片信息
      //fileList 上传成功后最新的照片墙数组
      // console.log(response, file, fileList);
      // 更新上传成功后的照片墙数据
      this.spuImage = fileList;
    },
    // 发送请求重置数据
    async initSpuData(row) {
      // 获取spu信息
      let spu = await this.$API.spu.reqspu(row.id);
      if (spu.code == 200) {
        this.spu = spu.data;
      }
      // 获取品牌数据
      let tradeMarKList = await this.$API.spu.reqTradeMarKList();
      if (tradeMarKList.code == 200) {
        this.tradeMarKList = tradeMarKList.data;
      }
      // 获取 spu 图标
      let spuImage = await this.$API.spu.reqSpuImageList(row.id);
      if (spuImage.code == 200) {
        let listArr = spuImage.data;
        // 由于elmente ui 照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
        //需要把服务器返回的数据进行修改
        listArr.forEach((element) => {
          element.name = element.imgName;
          element.url = element.imgUrl;
        });
        // 把整理好的数据赋值给
        this.spuImage = listArr;
      }
      //获取销售属性
      let baseSaleAttrList = await this.$API.spu.reqBaseSaleAttrList();
      if (baseSaleAttrList.code == 200) {
        //console.log(baseSaleAttrList);
        this.baseSaleAttrList = baseSaleAttrList.data;
      }
    },
    //===============收集销售属性
    // 添加新的销售属性
    addSaleAttr() {
      //已经收集需要的销售的信息
      //吧收集的销售属性数据进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      //向spu对象的 spuSaleAttrList 属性里面添加新的销售属性
      this.spu.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      });

      //点击添加属性按钮后 需要把双向绑定的值清空
      this.attrIdAndAttrName = "";
    },
    // 点击添加属性值的回调
    addSaleAttrValue(row) {
      // 添加按钮 和input切换 展示input inputVisible 为true展示input 否则展示按钮
      // 添加响应式数据
      this.$set(row, "inputVisible", true);
      //  inputValue 通过响应式数据inputValue收集新增的销售属性值
      this.$set(row, "inputValue", "");
    },
    //失去添加销售属性值input焦点
    handleInputConfirm(row) {
      //失去要把用户输入的销售属性值添加到  spuSaleAttrValueList 销售属性值数组中
      const { baseSaleAttrId, inputValue } = row;
      // 效验用户输入的值
      // 不能为空
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      // 不能重复
      let result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      );
      // result 为false 说明重复了
      if (!result) return;

      //向spuSaleAttrValueList添加属性值
      row.spuSaleAttrValueList.push({
        baseSaleAttrId,
        saleAttrValueName: inputValue,
      });
      // 修改 inputVisible 为false 展示添加按钮
      row.inputVisible = false;
    },
    // 点击保存按钮执行 添加 | 修改 请求接口
    async addOrUpdateSpu() {
      // 整理请求参数： 照片墙的数据
      // 携带参数：对于图片，需要携带imageName于imageUrl 字段
      this.spu.spuImageList = this.spuImage.map((item) => {
        return {
          imgName: item.name,
          // 如果存在 那么就是用户新增的图片 item.response 那么图片的路径就在 item.response.data中  如果没有 那么就是本来的数据 在item.url中
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      //console.log(this.spu.spuImageList);
      //发送请求
      try {
        let refult = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
        if (refult.code == 200) {
          this.$message.success("保存成功");
          // 展示 spu数据展示盒子
          this.$emit("changeScene", {
            scene: 0,
            flag: this.spu.id ? "修改" : "添加",
          });
          // 清空spu数据
          // Object.assign:es6新增的方法  可以合并对象
          // 组件实列this._data，可以操作data当中的效应式数据
          // this.$options.data()可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
          Object.assign(this._data, this.$options.data());
        }
      } catch (error) {}
    },
    // 用户点击取消按钮
    cancel() {
      // 展示数据列表
      this.$emit("changeScene", {
        scene: 0,
        flag: "",
      });
      // 清空spu数据
      Object.assign(this._data, this.$options.data());
    },
    // 用户点击添加spu属性按钮
    async addSpuDate(category3Id) {
      // 获取三级下拉框数据
      this.spu.category3Id = category3Id;
      // 获取品牌数据
      let tradeMarKList = await this.$API.spu.reqTradeMarKList();
      if (tradeMarKList.code == 200) {
        this.tradeMarKList = tradeMarKList.data;
      }
      //获取销售属性
      let baseSaleAttrList = await this.$API.spu.reqBaseSaleAttrList();
      if (baseSaleAttrList.code == 200) {
        //console.log(baseSaleAttrList);
        this.baseSaleAttrList = baseSaleAttrList.data;
      }
    },
  },
  computed: {
    // 获取未选中的销售属性
    unselectSaleAttr() {
      let result = this.baseSaleAttrList.filter((item) => {
        // everys数组的方法，会返回一个布尔值【真 假】
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
};
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>