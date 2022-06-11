<template>
    <div class='Breadcrumb'>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{secondName}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{threeName}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>

//import x from ''
export default {
    props: ['secondName','threeName'],
    components: {},
    data() {
        return {

        };
    },
    computed: {
    },
    created() { },
    methods: {

    },
}
</script>

<style lang='less' scoped>
</style>