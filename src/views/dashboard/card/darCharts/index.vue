<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
export default {
  name: "",
  mounted() {
    // 初始化echarts实列
    let lineChart = echarts.init(this.$refs.charts);
    // 配置数据
    lineChart.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        type: "category",
      },
      yAxis: {
        // 隐藏y轴
        show: false,
      },
      //系列
      series: [
        {
          // 折线图
          type: "bar",
          // 数据
          data: [10, 55, 15, 33, 44, 12, 14, 24, 17],
        },
      ],
      tooltip: {},
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 10,
        bottom: 10,
      },
    });
  },
};
</script>

<style  scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>