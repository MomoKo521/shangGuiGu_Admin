<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" cont="￥126560">
            <template slot="cart">
              <span
                >周同比 56.67%
                <i class="el-icon-caret-top" style="color: red"></i>
              </span>
              <span
                >日同比 19.16
                <i class="el-icon-caret-bottom" style="color: green"></i
              ></span>
            </template>
            <template slot="footer"> 日销售额 ￥ 12423</template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" cont="88460">
            <template slot="footer"> 日访问量 1234 </template>
            <template slot="cart">
              <lineChart></lineChart>
            </template>
          </Detail> </el-card
      ></el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" cont="88460">
            <template slot="footer"> 转化率 65% </template>
            <template slot="cart">
              <dar></dar>
            </template>
          </Detail> </el-card
      ></el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" cont="78%">
            <template slot="footer">
              同周比 12%
              <i class="el-icon-caret-top" style="color: red"></i> 日同比 11%
              <i class="el-icon-caret-bottom" style="color: green"></i>
            </template>
            <template slot="cart"> <progressa></progressa></template>
          </Detail> </el-card
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
// 折线图组件
import lineChart from "./lineChart";
//柱状图
import dar from "./darCharts";
// 进度条
import progressa from "./progressaa/index";
export default {
  components: {
    Detail,
    lineChart,
    dar,
    progressa,
  },
  name: "card",
};
</script>

<style>
.el-row {
  margin-top: 10px;
}
</style>