<template>
  <div>
    <div class="card-heard">
      {{ title }} <i class="el-icon-warning-outline"></i>
    </div>
    <div class="card-content">{{ cont }}</div>
    <div class="card-cart">
      <!-- 具名插槽 -->
      <slot name="cart"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "cont"],
};
</script>

<style scoped>
.card-heard {
  display: flex;
  justify-content: space-between;
  color: gray;
}
.card-content {
  font-size: 28px;
  margin: 5px 0;
}
.card-cart {
  height: 50px;
}
.card-footer {
  border-top: 1px solid gray;
  padding-top: 10px;
  margin-top: 10px;
}
</style>