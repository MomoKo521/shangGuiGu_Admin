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
        // 最小值与最大值的设置
        min: 0,
        max: 100,
      },
      yAxis: {
        // 隐藏y轴
        type: "category",
        show: false,
      },
      //系列
      series: [
        {
          // 折线图
          type: "bar",
          // 数据
          data: [70],
          // 柱状图的宽度
          barWidth: 10,
          color: "yellowgreen",
          // 背景颜色设置
          showBackground: true,
          backgroundStyle: {
            color: "#eee",
          },
          // 文本
          label: {
            show: true,
            formatter: "|",
            position: "right",
          },
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