<template>
  <div class="home">
    <el-container>
      <el-header>
        <div>
          <img src="../assets/logo.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <!-- 根据isCollapse的值动态改变el-aside的宽度 -->
        <el-aside :width="isCollapse ? '64px' : '200px'" >
          <div class="toggle_button" @click="toggleCollapse">|||</div>
          <!-- 菜单区 -->
          <!--  :default-active = 'this.$route.path 根据地址栏路由保持菜单高亮 -->
          <el-menu background-color="#333744" text-color="#fff" active-text-color="#359BFF" unique-opened
            :collapse='isCollapse' :collapse-transition = 'false' :router = 'true' :default-active = 'this.$route.path'>
            <!-- 一级菜单 -->
            <!-- 这里打开一个菜单所有菜单都打开是因为index值相同导致，使用:index动态绑定一个【字符串】就可以 -->
            <el-submenu :index="item.id + ''" v-for='item in menuList' :key="item.id">
              <!-- 一级菜单的模板区 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconsObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/' + subItem.path + ''" v-for="subItem in item.children" :key="subItem.id">
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
//import x from ''
export default {
  components: {},
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao',
      },
      // 默认不折叠菜单
      isCollapse: false
    };
  },
  computed: {},
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      //   清除token
      window.sessionStorage.removeItem("token");
      //   跳回到login页面
      this.$router.push("/login");
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$axios.get('/menus')
      if (res.meta.status != 200) return this.$message.error('res.meta.msg')
      this.menuList = res.data
      console.log(res)
    },
    // 店家按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
  },
};
</script>

<style lang='less' scoped>
.el-container {
  height: 100vh;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white;
  font-size: 20px;

  >div {
    display: flex;
    align-items: center;

    img {
      width: 40px;
      height: 40px;
    }

    span {
      margin-left: 10px;
    }
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    // 解决左侧菜单栏右边对不齐bug
    border-right: none;
  }

  .toggle_button {
    background-color: #475163;
    color: white;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    // 使三个竖线之间的距离变大
    letter-spacing: 0.3em;
    // 鼠标移动到该位置变成小手
    cursor: pointer;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}
</style>