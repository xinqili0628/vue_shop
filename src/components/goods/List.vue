<template>
    <div class=''>
        <my-bread secondName="商品管理" threeName="商品列表"></my-bread>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable
                        @clear="queryValBtn" @keyup.enter.native="queryValBtn">
                        <el-button slot="append" icon="el-icon-search" @click="queryValBtn"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table :data="goodsList" border stripe style="width: 100%">
                <el-table-column type="index" label="#" width="50"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称" width="580"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元)" width="120"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
                <el-table-column prop="add_time" label="创建时间">
                    <!-- 使用过滤器将时间戳转换为年月日 -->
                    <template slot-scope="scope">
                        {{scope.row.add_time | filter_formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="editBtn(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteBtn(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 20, 50]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

    </div>
</template>

<script>
//import x from ''
export default {
    components: {},
    data() {
        return {
            // 
            goodsList: [],
            // 搜索框
            goodsVal: '',
            // 数据
            total: 0,
            // 查询参数对象
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 6
            }
        };
    },
    // 过滤器 转换时间戳(这是局部过滤器，只在组件内有效)
    // 在main.js中定义了一个全局过滤器效果相同
    // filters: {
    //     filter_formatTime(time) {
    //         var now = new Date(time)
    //         var nian = now.getFullYear()
    //         var yue = (now.getMonth() + 1).toString().padStart(2, '0')
    //         var ri = now.getDate().toString().padStart(2, '0')
    //         var shi = now.getHours().toString().padStart(2, '0')
    //         var fen = now.getMinutes().toString().padStart(2, '0')
    //         var miao = now.getSeconds().toString().padStart(2, '0')
    //         return `${nian}-${yue}-${ri} ${shi}:${fen}:${miao}`
    //     }
    // },
    computed: {

    },
    created() {
        this.getGoodsList()
    },
    methods: {
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        // 监听pagenum的改变
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        // 获取商品列表
        async getGoodsList() {
            const { data: res } = await this.$axios.get('goods', { params: this.queryInfo })
            if (res.meta.status != 200) {
                return this.$message.error('获取商品列表失败')
            }
            this.goodsList = res.data.goods
            this.total = res.data.total

        },
        // 搜索框
        queryValBtn() {
            this.getGoodsList()
        },
        goAddPage() {
            this.$router.push('/goods/add')
        },
        deleteBtn(row) {
             // 弹窗提示用户是否删除
            this.$confirm('此操作将永久删除该角色权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$axios.delete(`goods/${row.goods_id}`)
                if (res.meta.status != 200) {
                    return this.$message.error('删除失败')
                }
                this.$message.success('删除成功')
                 this.getGoodsList()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });





        }
    },
}
</script>

<style lang='less' scoped>
</style>