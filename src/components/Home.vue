<template>
  <div class="">
      <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
//import x from ''
export default {
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
      logout() {
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
      }
  },
};
</script>

<style lang='' scoped>
</style>