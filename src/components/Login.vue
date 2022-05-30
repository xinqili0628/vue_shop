<!-- 组件说明 -->
<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区 -->
      <el-form
        class="login_form"
        :model="loginFrom"
        :rules="loginFromRules"
        ref="loginFromRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginFrom.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginFrom.password"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//import x from ''
export default {
  components: {},
  data() {
    return {
      loginFrom: {
        username: "admin",
        password: "123456",
      },
      //   表单的验证规则
      loginFromRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 10 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {},
  methods: {
    //   重置表单操作
    resetLoginFrom() {
      //   console.log(this)
      this.$refs.loginFromRef.resetFields();
    },
    login() {
      //   给登录按钮添加预验证，validate接收一个回调函数，返回值是一个布尔值
      this.$refs.loginFromRef.validate(async (valid) => {
        //   console.log(valid)
        if (!valid) return;
        // 因为返回时数据是promise数据类型，所以用async/await来简化此次操作，
        // await智能用在被async修饰的方法中，所以在紧挨着await的箭头函数前加上async
        const { data: res } = await this.$axios.post("/login", this.loginFrom);
        if (res.meta.status != 200) return this.$message.error("登录失败！");
        this.$message.success("登录成功");
        //1.将登陆成功后的token，保存到客户端的sessionStorage中
        //   1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
        //  1.2 token只应在网站打开期间生效，所以将token保存在sessionStorage中
        console.log(res);
        window.sessionStorage.setItem("token", res.data.token);
        //2. 通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang='less' scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    width: 130px;
    height: 130px;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.btns {
  display: flex;
  justify-content: right;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>