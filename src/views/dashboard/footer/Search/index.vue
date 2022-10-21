<template>
  <div>
    <el-card>
      <!-- card头部区域 -->
      <div slot="header" class="search_herad">
        <span> 线上热门搜索</span>

        <!-- 下拉菜单 -->
        <el-dropdown>
          <span>
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu>
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- card 内容区域 -->
      <div>
        <!-- line组件 -->
        <el-row :gutter="10">
          <el-col :span="12">
            <lines></lines>
          </el-col>
          <el-col :span="12">
            <lines></lines>
          </el-col>
        </el-row>
      </div>
      <!-- table -->
      <el-table
        border
        style="width: 100%"
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column prop="date" label="排名" width="180">
        </el-table-column>
        <el-table-column prop="name" label="搜索关键字" width="180">
        </el-table-column>
        <el-table-column prop="address" label="用户数" sortable>
        </el-table-column>
        <el-table-column prop="address" label="周涨幅" sortable>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="text-align: right; margin-top: 20px"
        layout="prev, pager, next"
        :total="1000"
      >
      </el-pagination>
    </el-card>
  </div>
</template>>

<script>
// 折线图组件
import lines from "./Line";

export default {
  components: {
    lines,
  },
};
</script>

<style scoped>
.search_herad {
  display: flex;
  justify-content: space-between;
}
</style>