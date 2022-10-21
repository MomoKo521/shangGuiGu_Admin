<template>
  <div>
    <el-card>
      <div slot="header" class="Category_heard">
        <span>销售额类别占比</span>
        <el-radio-group v-model="radio1">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
      <div>
        <div class="myechatrs" ref="myecharts"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入echarts组件
import * as echarts from "echarts";
export default {
  data() {
    return {
      radio1: "",
    };
  },
  mounted() {
    let myechart = echarts.init(this.$refs.myecharts);
    myechart.setOption({
      title: {
        text: "视频",
        subtext: 1048,
        top: "center",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },

      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },

          data: [
            { value: 1048, name: "视频" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],
    });
    // echatrs 触摸事件
    myechart.on("mouseover", (parmas) => {
      const { value, name } = parmas.data;
      //更新echarts数据
      myechart.setOption({
        title: {
          text: value,
          subtext: name,
        },
      });
    });
  },
};
</script>

<style scoped>
.Category_heard {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.myechatrs {
  widows: 100%;
  height: 300px;
}
</style>