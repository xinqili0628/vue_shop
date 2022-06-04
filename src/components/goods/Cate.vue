<template>
    <div Cate=''>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addCateDialogBtn">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="cateList" border stripe row-key="cat_id" :tree-props="{ children: 'children' }">
                <!-- 索引列 -->
                <el-table-column type="index" label="#">
                    <template slot-scope="scope">
                        <span>{{ scope.row.index }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="cat_name" label="分类名称"></el-table-column>
                <el-table-column prop="cat_name" label="是否有效">
                    <template slot-scope="scope">
                        <i class="el-icon-success" v-if="scope.row.cat_deleted == false" style="color:lightgreen"></i>
                        <i class="el-icon-error" v-else style="color:red"></i>
                    </template>
                </el-table-column>
                <el-table-column prop="cat_level" label="排序">
                    <template slot-scope="scope">
                        <el-tag size="small" v-if="scope.row.cat_level === 0">一级</el-tag>
                        <el-tag size="small" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                        <el-tag size="small" type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" icon="el-icon-edit" @click="editBtn(scope.row)">编辑
                        </el-button>
                        <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteBtn(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 20]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类弹窗 -->
        <el-dialog :title="addOrEdit == 'add' ? '添加分类' : '编辑分类'" modal :close-on-click-modal="false"
            :visible.sync="addCateDialogVisible" width="50%" @close="closeAddDialog" ref="dialogRef">
            <!-- 内容主体区 -->
            <el-form ref="cateFromRef" :model="cateFrom" :rules="cateFromRules" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="cateFrom.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：" v-if="this.addOrEdit == 'add'">
                    <!-- options用来指定数据源 -->
                    <!-- props用来指定配置对象【必须要有】 -->
                    <el-cascader clearable v-model="selectedKeys" :options="selectList" @change="handleChange"
                        :props="cascaderProps"></el-cascader>
                </el-form-item>
            </el-form>
            <pre>{{ cateFrom }}</pre>
            <!-- 底部按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveClassBtn()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
//import x from ''
export default {
    components: {},
    data() {
        return {
            // 分页信息
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 存放总的数据条数
            total: 0,
            // 控制添加分类弹窗的显示与隐藏
            addCateDialogVisible: false,
            // 商品分类的数据列表
            cateList: [],
            cateFrom: {
                cat_pid: 0,
                cat_name: '',
                // 分类的等级，默认要添加的是1级分类
                cat_level: 0,
            },
            cateFromRules: {
                cat_name: [
                    { required: true, message: "分类名称不能为空", trigger: "blur" },
                ],
            },
            selectList: [],
            // 指定级联选择器额配置对象
            cascaderProps: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly: true
            },
            // 选中的父级分类
            selectedKeys: [],
            addOrEdit: ''
        };
    },
    computed: {},
    created() {
        this.getCateList()
    },
    methods: {
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        // 监听pagenum的改变
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        async getCateList() {
            const { data: res } = await this.$axios.get('categories', { params: this.queryInfo })
            if (res.meta.status != 200) {
                return this.$message.error('获取商品分类失败')
            }
            console.log(res.data)
            // 把数据列表赋值给cateList
            this.cateList = res.data.result
            // 给数据源的第一层对象添加index属性，用处：渲染表格时只第一层显示索引
            for (let i = 0; i < this.cateList.length; i++) {
                this.cateList[i].index = i + 1;
            }
            this.total = res.data.total
        },
        addCateDialogBtn() {
            this.addOrEdit = 'add'
            this.addCateDialogVisible = true
            this.getAllCateList()
        },
        // 获取所有的分类列表。级联选择器使用
        async getAllCateList() {
            const { data: res } = await this.$axios.get('categories', { params: { type: 2 } })
            if (res.meta.status != 200) {
                return this.$message.error('获取失败')
            }
            this.selectList = res.data
        },
        // 关闭添加分类弹窗时的操作
        closeAddDialog() {
            this.$refs.cateFromRef.resetFields()
            this.selectedKeys = []
            this.cateFrom = {
                cat_pid: 0,
                cat_name: '',
                cat_level: 0,
            }
        },
        // 编辑按钮
        editBtn(cateInfo) {
            console.log(cateInfo)
            this.addOrEdit = 'edit'
            this.addCateDialogVisible = true
            this.getAllCateList()
            this.cateFrom = {
                cat_pid: cateInfo.cat_id,
                cat_name: cateInfo.cat_name,
                cat_level: cateInfo.cat_level,
            }
            this.selectedKeys = []
        },
        // 删除按钮
        deleteBtn(cateInfo) {
            console.log(cateInfo.cat_id)
            this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteCateApi(cateInfo.cat_id)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //级联选择器发生变化触发这个函数
        handleChange() {
            let res = [...this.selectedKeys]
            console.log(this.selectedKeys)
            // 如果selectedKeys数组的length大于0说明选中了父级分类
            // 反之，就说明没有选中任何父级分类。创建的事一级分类
            this.cateFrom.cat_pid = res[res.length - 1] || 0
            this.cateFrom.cat_level = res.length ? res.length : 0
        },
        // 点击按钮提交新建的分类
        saveClassBtn() {
            this.$refs.cateFromRef.validate(valid => {
                if (!valid) return
                // 走添加的接口
                if (this.addOrEdit === 'add') {
                    this.newCateApi()
                } else {
                    // 走修改编辑的接口
                    this.editCateApi()
                }
                this.addCateDialogVisible = false

            })

        },
        // 新建分类的接口
        async newCateApi() {
            const { data: res } = await this.$axios.post('categories', this.cateFrom)
            if (res.meta.status != 201) {
                return this.$message.error('分类创建失败')
            }
            this.$message.success('分类创建成功')
            this.getCateList()
        },
        // 编辑分类的接口
        async editCateApi() {
            const { data: res } = await this.$axios.put(`categories/${this.cateFrom.cat_pid}`, { cat_name: this.cateFrom.cat_name })
            if (res.meta.status != 200) {
                return this.$message.error('分类修改失败')
            }
            this.$message.success('分类修改成功')
            this.getCateList()
        },
        // 删除分类接口
        async deleteCateApi(id) {
            const {data: res} = await this.$axios.delete(`categories/${id}`)
            if(res.meta.status != 200) {
                return this.$message.error('删除失败')
            }
            this.getCateList()
            this.$message.success('删除成功')
        }
    },
}
</script>

<style lang='less' scoped>
.el-cascader {
    width: 100%
}
</style>