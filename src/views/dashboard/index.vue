<template>
  <div>
    <!-- 卡片区域 -->
    <card></card>
    <Sale></Sale>
    <footers></footers>
  </div>
</template>

<script>
// 头部
import card from "./card";
// 内容
import Sale from "./Sale";
// 底部
import footers from "./footer/index";
export default {
  components: {
    card,
    Sale,
    footers,
  },
  name: "home",
};
</script>

<style>
</style>