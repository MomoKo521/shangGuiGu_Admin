<template>
  <div>
    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="clearfix">
        <!-- tab栏切换 -->
        <!--  @tab-click="handleClick" -->
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="first"></el-tab-pane>
          <el-tab-pane label="访问量" name="second"></el-tab-pane>
        </el-tabs>
        <!-- 日期 -->
        <div class="tiem">
          <span @click="setday">今日</span><span @click="setweek">本周</span
          ><span @click="setmonth">本月</span><span @click="setyear">本年</span>
          <!--   -->
          <el-date-picker
            type="daterange"
            v-model="data"
            size="mini"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>
      <!-- 内容区域 -->
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <div class="myecharts" ref="myecharts"></div>
          </el-col>
          <el-col :span="6"
            ><div class="right">
              <h3>门店{{ title }}排名</h3>
              <ul>
                <li>
                  <span class="rindex">1</span><span>肯德基</span
                  ><span class="ralue">212.12</span>
                </li>
                <li>
                  <span class="rindex">2</span><span>肯德基</span
                  ><span class="ralue">212.12</span>
                </li>
                <li>
                  <span class="rindex">3</span><span>肯德基</span
                  ><span class="ralue">212.12</span>
                </li>
                <li>
                  <span>4</span><span>肯德基</span
                  ><span class="ralue">212.12</span>
                </li>
                <li>
                  <span>5</span><span>肯德基</span
                  ><span class="ralue">212.12</span>
                </li>
                <li>
                  <span>6</span><span>肯德基</span
                  ><span class="ralue">212.12</span>
                </li>
                <li>
                  <span>7</span><span>肯德基</span
                  ><span class="ralue">212.12</span>
                </li>
              </ul>
            </div></el-col
          >
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
// 引入 dayjs插件
import dayjs from "dayjs";
export default {
  data() {
    return {
      activeName: "first", // table栏目切换
      myEcharts: null, //echatss实列
      data: [], // 收集日期
    };
  },
  methods: {
    // 本日
    setday() {
      // 当前本日事件
      const day = dayjs().format("YYYY-MM-DD");
      // 更新 日期
      this.data = [day, day];
    },
    // 本周
    setweek() {
      // 获取本周的第一天是多少号
      const start = dayjs().day(1).format("YYYY-MM-DD");
      // 获取本周的最后一天是多少号
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.data = [start, end];
    },
    // 本月
    setmonth() {
      // 获取本月的第一天是多少号
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      // 获取本月的最后一天是多少号
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.data = [start, end];
    },
    // 本年
    setyear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.data = [start, end];
    },
  },
  mounted() {
    this.myEcharts = echarts.init(this.$refs.myecharts);
    this.myEcharts.setOption({
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220, 145, 400, 145, 20, 250],
        },
      ],
    });
  },
  computed: {
    title() {
      return this.activeName == "first" ? "销售额" : "访问量";
    },
  },
  // 监听属性
  watch: {
    // 监听title属性  如果title发送变化  重置echarts图标的标题
    title() {
      this.myEcharts.setOption({
        title: {
          text: this.title + "趋势",
        },
      });
    },
  },
};
</script>

<style scoped>
.clearfix {
  display: flex;
  position: relative;
}
.tiem {
  position: absolute;
  right: 0;
}
.tiem span {
  margin: 0 10px;
}
.tab {
  width: 100%;
}
>>> .el-card__header {
  border-bottom: none;
}
.el-date-editor {
  width: 300px !important;
}
.myecharts {
  width: 100%;
  height: 300px;
}
ul {
  padding: 0;
  list-style: none;
  width: 100%;
  height: 300px;
}
ul li {
  height: 8%;
  margin: 10px 0;
}
.right span {
  margin: 0 10px;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
  color: white;
  text-align: center;
}

.ralue {
  float: right;
}
</style>