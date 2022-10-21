<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <search></search>
      </el-col>
      <el-col :span="12"> <category></category></el-col>
    </el-row>
  </div>
</template>

<script>
// 热门搜索组件
import category from "./Category";
// 销售额组件
import search from "./Search";
export default {
  components: {
    category,
    search,
  },
};
</script>

<style>
</style>