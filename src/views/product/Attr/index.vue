<template>
  <div>
    <!-- 卡片 -->
    <el-card style="margin-top: 20px">
      <!--下拉框组件 -->
      <CategorySelect @select3="select3" :show="!isShowTable"></CategorySelect>
    </el-card>
    <!-- 卡片 -->
    <el-card style="margin-top: 20px">
      <!-- 默认展示数据盒子 -->
      <div v-show="isShowTable">
        <!-- button按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!from.category3Id"
          @click="attr"
          >添加属性</el-button
        >
        <!-- 表格 -->
        <el-table
          :data="AttfoList"
          style="width: 100%; margin-top: 10px"
          border
        >
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="180">
          </el-table-column>
          <el-table-column prop="name" label="属性列表">
            <!-- 插槽 -->
            <template slot-scope="scope">
              <!-- tag组件 -->
              <el-tag
                type="success"
                v-for="item in scope.row.attrValueList"
                :key="item.id"
                style="margin-left: 10px"
                >{{ item.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(scope.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteAttr(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性 盒子 -->
      <div v-show="!isShowTable">
        <!-- from表单 -->
        <el-form ref="form" :model="attrInfo" :inline="true">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- button按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addattrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <!-- 表格 -->
        <el-table
          border
          style="margin: 20px 0px"
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            prop="date"
            type="index"
            label="序号"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="date" label="属性值名称">
            <template slot-scope="scope">
              <!-- 编辑模式 -->
              <el-input
                v-model="scope.row.valueName"
                placeholder="请输入数值名称"
                size="mini"
                v-if="scope.row.flag"
                @blur="toLook(scope.row)"
                @keyup.native.enter="scope.row.flag = false"
                :ref="scope.$index"
              ></el-input>
              <!--查看模式 -->
              <div v-else @click="toEdit(scope.row, scope.$index)">
                {{ scope.row.valueName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="操作">
            <template slot-scope="scope">
              <el-popconfirm
                :title="`您确定要删除${scope.row.valueName}`"
                @onConfirm="deleteAttrValue(scope.$index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- button按钮 -->
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "attr",
  data() {
    return {
      //CategorySelect 下拉框三个下拉框选中的id值
      from: {},
      // 表格数据
      AttfoList: [],
      // 添加数据盒子与数据展示盒子展示切换
      isShowTable: true,
      //收集新增属性 | 修改属性 数据
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值 因为属性值可以有多个因此用数组 每一个属性值都是一个对象需要attrId，valueName
          // {
          //   attrId: 0, //相应的属性名的id
          //   valueName: "", //属性值
          // },
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      },
    };
  },
  methods: {
    select3(cfrom) {
      //select3函数表达 CategorySelect下拉框组件三级下拉框发生了变化 此时父组件发生获取对应的数据
      // console.log(cfrom); cfrom 三个下拉框选中的id
      this.from = cfrom;
      // 发生请求
      this.getAttfoList();
    },
    // 获取表格数据接口
    async getAttfoList() {
      let refult = await this.$API.attr.reqGetAttfoList(this.from);
      if (refult.code == 200) {
        this.AttfoList = refult.data;
        //console.log(this.AttfoList);
      }
    },
    // 点击添加属性按钮 添加表单
    addattrValue() {
      this.attrInfo.attrValueList.push({
        //添加属性分为两种情况
        //1.添加属性 2.在修改的基础上添加属性
        //区别在于添加属性attrInfo没有id  点击修改按钮的基础上attrInfo有id
        //如果是在修改的基础上 那么给attrInfo添加id属性值 ，否则 this.attrInfo.id 就为undefined
        //attrId和属性名id是相同的
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true, //flag属性，给每一个用户天机一个标记flag，用户切换查看模式与编辑模式
      });

      //每次添加新的属性 最后一个表单主动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 点击 div  表单失去焦点事件---切换为查看模式 展示div
    toLook(row) {
      // 如果属性值为空不能作为新的属性值
      if (row.valueName.trim() == "") {
        this.$message("请输入一个正常值");
        return;
      }
      // 新增的属性值不能与已有属性值重复
      let isRedat = this.attrInfo.attrValueList.some((item) => {
        // 需要将row从数组里面判断的事件去除
        //row最新新增的属性值[数组的最后一项元素]
        //判断的时候,需要把已有的数组当中新增的这个属性值去除
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRedat) return;
      //row:形参是当前用户添加的最新的属性值
      //当前编辑模式变为查看模式
      row.flag = false;
    },
    //点击 div 添加 | 修改 属性盒子  隐藏div
    toEdit(row, index) {
      //隐藏div 展示input
      row.flag = true;

      //获取input 节点 实现自动聚焦
      //需要注意 虽然我们给input 设置的ref  但我们直接拿是拿不到的。因为我们点div 隐藏div显示input Dom元素是需要时间的
      // $nextTick 当元素加载完成会执行一次
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //点击删除按钮  且点击确定删除  触发回调函数 删除属性值
    deleteAttrValue(index) {
      //删除当前点击的attrInfo.attrValueList中的属性值
      //并不需要发送接口请求  用户点击保存才发起请求
      this.attrInfo.attrValueList.splice(index, 1);
    },

    //点击保存按钮 执行添加属性或者修改属性操作 发送接口请求
    async addOrUpdateAttr() {
      //要做三件事
      //第一件：过滤属性值为空的属性
      //第二件删除flag属性  因为接口不需要这个参数
      //第三件是 发送接口请求
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          //保留不为空的属性值
          if (item.valueName != "") {
            //删除flag属性
            delete item.flag;
            // return true  符合条件就保存下来
            return true;
          }
        }
      );
      //console.log(this.attrInfo.attrValueList);
      // 发送接口请求;
      try {
        await this.$API.attr.reqAddAttr(this.attrInfo);
        //切换显示
        this.isShowTable = true;
        this.$message.success("保存成功");
        //刷新数据
        this.getAttfoList();
      } catch (error) {
        this.$message.error("保存失败");
      }
    },
    //=======以下属于默认展示数据盒子中的方法
    // 点击添加属性回调
    attr() {
      // 显示添加属性盒子
      this.isShowTable = false;
      // 清空收集属性数据attrInfo 且把当前三级id赋值给attrInfo
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [
          //属性值 因为属性值可以有多个因此用数组 每一个属性值都是一个对象需要attrId，valueName
          // {
          //   attrId: 0, //相应的属性名的id
          //   valueName: "", //属性值
          // },
        ],
        categoryId: this.from.category3Id, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      };
    },
    // 点击修改属性按钮
    updateAttr(row) {
      //console.log(row);
      // 展示添加属性盒子
      this.isShowTable = false;
      // 把要修改的数据给 attrInfo 展示要修改的数据
      //不能直接赋值 why？ 如果用户点击取消按钮 为发送修改属性请求  因为数据是双向绑定  展示盒子的数据也会改变
      //为什么使用深拷贝而不是浅拷贝 数据太复杂 浅拷贝不能全部拷贝
      this.attrInfo = cloneDeep(row);

      // 在修改某一个属性的时候，将相应的属性值元素添加上flag这个标记
      //this.$set 作用：向响应式对象中添加一个property，并确保这个新property同样是响应是的，且触发视图更新。
      //this.$set  第一个参数：对象 第二个参数：添加新的响应式属性 第三个参数：新的属性的属性值
      //为什么不直接 item.flag=false？ 虽然属能添加进去 但是会发现视图不会跟着变化（因为flag不是响应式数据）
      //因为vue无法探测普通的新增 property对象， 这样书写的属性并非响应式属性
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    //删除属性
    async deleteAttr(row) {
      const decision = await this.$confirm(
        `此操作将永久删除${row.attrName}, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      //decision 用户点击的结果 值=confirm  用户点击了确定  值=cancel  用户点击了取消
      if (decision == "cancel") {
        return this.$message("以取消操作");
      }
      //发送接口删除属性
      try {
        let refult = await this.$API.attr.reqDeleteAttr(row.id);
        this.$message.success("删除成功");
        //刷新数据
        this.getAttfoList();
      } catch (error) {
        this.$message.error("删除失败");
      }
    },
  },
};
</script>

<style>
</style>