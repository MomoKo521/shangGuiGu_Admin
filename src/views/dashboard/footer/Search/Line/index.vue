<template>
  <div>
    <div style="color: gray">搜索用户数 <i class="el-icon-info"></i></div>
    <div class="line_cotnet">
      <span style="font-size: 20px"> 12313</span>
      <span style="margin-left: 30px">
        177.1 <i class="el-icon-caret-top" style="color: red"></i>
      </span>
    </div>
    <!-- echarts -->
    <div ref="myecharts" class="myecharts"></div>
  </div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
export default {
  name: "lines",
  mounted() {
    // 初始化echarts实列
    let lineChart = echarts.init(this.$refs.myecharts);
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
          type: "line",
          // 数据
          data: [10, 55, 15, 33, 44, 12],
          // 拐点的样式的设置
          itemStyle: {
            opacity: 0,
          },
          // 线条的样式
          lineStyle: {
            color: "blue",
          },
          // 填充颜色
          areaStyle: {
            color: {
              type: "line",

              x: 0, // 0.5为正中心，如果小于渐变中心靠左
              y: 0, // 0.5为正中心，如果小于渐变中心靠上
              x2: 0,
              y2: 1,

              colorStops: [
                {
                  offset: 0,
                  color: "skyblue", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "white", // 100% 处的颜色
                },
              ],

              global: false, // 缺省为 false
            },
          },
        },
      ],

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

<style scoped>
.myecharts {
  width: 100%;
  height: 50px;
}
.line_cotnet {
  margin: 20px 0;
}
</style>