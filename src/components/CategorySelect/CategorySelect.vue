<template>
  <div>
    <el-form :inline="true" :model="cfrom" class="demo-form-inline">
      <!-- 一级分类 -->
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cfrom.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="item1.name"
            :value="item1.id"
            v-for="item1 in CategoryList1"
            :key="item1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 二级分类 -->
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cfrom.category2Id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            :label="item2.name"
            :value="item2.id"
            v-for="item2 in CategoryList2"
            :key="item2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 三级分类 -->
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cfrom.category3Id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            :label="item3.name"
            :value="item3.id"
            v-for="item3 in CategoryList3"
            :key="item3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["show"],
  data() {
    return {
      // 一级分类数据
      CategoryList1: [],
      // 二级分类数据
      CategoryList2: [],
      // 三级分类数据
      CategoryList3: [],
      // 下拉框选中的值
      cfrom: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    // 获取一级菜单数据
    async getCategoryList() {
      let refult = await this.$API.attr.reqCategory1();
      if (refult.code == 200) {
        this.CategoryList1 = refult.data;
      }
    },
    // 当一级下拉框发送改变
    async handler1() {
      let { category1Id } = this.cfrom;
      // 当一级下拉框数据发送变化 二、三级下拉框数据得清空
      this.CategoryList2 = [];
      this.CategoryList3 = [];
      this.cfrom.category2Id = "";
      this.cfrom.category3Id = "";
      // 发送获取二级菜单请求
      let refult = await this.$API.attr.reqCategory2(category1Id);
      if (refult.code == 200) {
        this.CategoryList2 = refult.data;
      }
    },
    // 当二级下拉框发送改变
    async handler2() {
      // 当二级下拉框发生改变 三级下拉框数据得清空
      this.CategoryList3 = [];
      this.cfrom.category3Id = "";
      let { category2Id } = this.cfrom;
      // 发送获取三级菜单请求
      let refult = await this.$API.attr.reqCategory3(category2Id);
      if (refult.code == 200) {
        this.CategoryList3 = refult.data;
      }
    },
    // 当三级下拉框发生改变
    handler3() {
      // 三级下拉框发生改变 想要把下拉框选中的值id传给父组件
      this.$emit("select3", this.cfrom);
    },
  },
  mounted() {
    this.getCategoryList();
  },
};
</script>

<style>
</style>