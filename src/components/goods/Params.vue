<template>
    <div class=''>
        <my-bread secondName="商品管理" threeName="分类参数"></my-bread>
        <el-card>
            <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>
            <!-- 选择商品分类区域 -->
            <el-row :gutter="20">
                <el-col>
                    <span>选择商品分类：</span>
                    <el-cascader v-model="selectKeys" :options="cateList" :props="cascaderProps" @change="handleChange">
                    </el-cascader>
                </el-col>
                <el-col>
                    <el-tabs v-model="activeName" @tab-click="handleTabClick">
                        <el-tab-pane label="动态参数" name="many">
                            <el-button type="primary" :disabled="isBtnDisable" @click="addDialogVisible = true">添加参数
                            </el-button>
                            <!-- 动态参数表格 -->
                            <el-table :data="manyTableData" border stripe>
                                <!-- 展开行 -->
                                <el-table-column type="expand">
                                    <template slot-scope="scope">
                                        <!-- 循环渲染tag标签 -->
                                        <el-tag closable :disable-transitions="false"
                                            @close="handleClose(index, scope.row)" size="small"
                                            v-for="(item, index) in scope.row.attr_vals" :key="index">{{
                                                    item
                                            }}</el-tag>
                                        <!-- 输入的文本框 -->
                                        <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                            v-model.trim="scope.row.inputValue" ref="saveTagInput" size="mini"
                                            @keyup.enter.native="handleInputConfirm(scope.row)"
                                            @blur="handleInputConfirm(scope.row)">
                                        </el-input>
                                        <!-- 添加的按钮 -->
                                        <el-button v-else class="button-new-tag" size="mini"
                                            @click="newTagBtn(scope.row)">+ New Tag</el-button>
                                    </template>
                                </el-table-column>
                                <!-- 索引列 -->
                                <el-table-column label="#" type="index"></el-table-column>
                                <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="primary" icon="el-icon-edit" size="small"
                                            @click="editBtn(scope.row)">编辑</el-button>
                                        <el-button type="danger" icon="el-icon-delete" size="small"
                                            @click="deleteBtn(scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="静态属性" name="only">
                            <el-button type="primary" :disabled="isBtnDisable" @click="addDialogVisible = true">添加属性
                            </el-button>
                            <el-table :data="onlyTableData" border stripe>
                                <!-- 展开行 -->
                                <el-table-column type="expand">
                                    <template slot-scope="scope">
                                        <!-- 循环渲染tag标签 -->
                                        <el-tag closable :disable-transitions="false"
                                            @close="handleClose(index, scope.row)" size="small"
                                            v-for="(item, index) in scope.row.attr_vals" :key="index">{{
                                                    item
                                            }}</el-tag>
                                        <!-- 输入的文本框 -->
                                        <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                            v-model.trim="scope.row.inputValue" ref="saveTagInput" size="mini"
                                            @keyup.enter.native="handleInputConfirm(scope.row)"
                                            @blur="handleInputConfirm(scope.row)">
                                        </el-input>
                                        <!-- 添加的按钮 -->
                                        <el-button v-else class="button-new-tag" size="mini"
                                            @click="newTagBtn(scope.row)">+ New Tag</el-button>
                                    </template>
                                </el-table-column>
                                <!-- 索引列 -->
                                <el-table-column label="#" type="index"></el-table-column>
                                <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="primary" icon="el-icon-edit" size="small"
                                            @click="editBtn(scope.row)">编辑</el-button>
                                        <el-button type="danger" icon="el-icon-delete" size="small"
                                            @click="deleteBtn(scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
            </el-row>
        </el-card>
        <!-- 添加参数的对话框 -->
        <el-dialog :title="active + titleText" :visible.sync="addDialogVisible" width="50%" @close="closeDialog">
            <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="addFromRules">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAddFromBtn">确 定</el-button>
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
            active: '添加',
            cateList: [],
            selectKeys: [],
            // 级联选择框的配置对象
            cascaderProps: {
                expandTrigger: 'hover',
                value: 'cat_id', //选中的值
                label: 'cat_name', //用户看到的值
                children: 'children', //父子节点的嵌套属性
            },
            //被激活的页签名称
            activeName: 'many',
            // 动态参数的数据
            manyTableData: [],
            // 静态属性的数据
            onlyTableData: [],
            addDialogVisible: false,
            // 添加参数的的表单数据对象
            addForm: {
                attr_name: '',
                attr_sel: '',
                attr_vals: ''
            },
            addFromRules: {
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: "blur" },
                ]
            },
        };
    },
    computed: {
        // 如果按钮需要被禁用则返回true，否则false
        isBtnDisable() {
            if (this.selectKeys.length != 3) {
                return true
            }
            return false
        },
        // 当前选中的三级分类的id
        cateId() {
            if (this.selectKeys.length == 3) {
                return this.selectKeys[2]
            }
            return null
        },
        // 动态计算dialog弹窗的title
        titleText() {
            if (this.activeName === 'many') {
                return '动态参数'
            } else {
                return '静态属性'
            }
        }
    },
    created() {
        this.getCateList()
    },
    mounted() { },
    methods: {
        // 获取商品列表，级联选择器使用
        async getCateList() {
            const { data: res } = await this.$axios.get('categories')
            if (res.meta.status != 200) {
                return this.$message.error('获取商品分类失败')
            }
            this.cateList = res.data
            console.log(this.cateList)
        },
        // 级联选择器中选项变化。会触发这个函数
        handleChange() {
            // console.log(this.selectKeys)
            // 证明选中的不是三级分类。该需求是只能选择三级节点
            if (this.selectKeys.length != 3) {
                this.selectKeys = []
                this.manyTableData = []
                this.onlyTableData = []
                this.$message.warning('只允许为三级分类设置参数')
                return
            }
            // 证明选择的是三级分类 
            // 根据所选分类的Id，和当前所处的面板获取对应的参数
            this.getParamsApi()
        },
        // tab页签点击的处理函数
        handleTabClick() {
            if (this.selectKeys.length != 3) {
                this.$message.warning('请先选择商品分类')
                return
            }
            this.getParamsApi()
        },
        //请求参数列表数据的API
        async getParamsApi() {
            const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
            if (res.meta.status != 200) {
                this.$message.error('参数列表获取失败')
            }
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                // 控制文本框的显示与隐藏
                item.inputVisible = false
                // 文本框中输入的值
                item.inputValue = ''
            })
            if (this.activeName === 'many') {
                this.manyTableData = res.data
            } else {
                this.onlyTableData = res.data
            }
            console.log(res.data)
        },
        closeDialog() {
            this.$refs.addFormRef.resetFields()
            this.active = '添加'
        },
        // 提交添加参数的表单
        saveAddFromBtn() {
            this.$refs.addFormRef.validate(valid => {
                if (!valid) return
                this.addForm.attr_sel = this.activeName
                this.addApi()
                this.addDialogVisible = false
            })
        },
        // 添加参数的API
        async addApi() {
            const { data: res } = await this.$axios.post(`categories/${this.cateId}/attributes`, this.addForm)
            if (res.meta.status != 201) {
                return this.$message.error('添加参数失败')
            }
            this.$message.success('添加参数成功')
            this.getParamsApi()
        },
        editBtn(paramsInfo) {
            this.active = '编辑'
            console.log(paramsInfo)
            this.addDialogVisible = true
            this.addForm.attr_name = paramsInfo.attr_name
        },
        deleteBtn(paramsInfo) {
            this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let attrid = paramsInfo.attr_id
                this.deleteParamsApi(attrid)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        async deleteParamsApi(attrid) {
            const { data: res } = await this.$axios.delete(`categories/${this.cateId}/attributes/${attrid}`)
            if (res.meta.status != 200) {
                return this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            this.getParamsApi()

        },
        async handleInputConfirm(row) {
            if (row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            // 如果没有return，则证明输入了内容
            row.attr_vals.push(row.inputValue)
            console.log(row)

            row.inputVisible = false
            // console.log(this.manyTableData)
            row.inputValue = ''
            this.saveAttrVals(row)
        },
        // 将对attr.vals的操作保存到数据库
        async saveAttrVals(row) {
            const { data: res } = await this.$axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join(','),
            })
            if (res.meta.status != 200) {
                return this.$message.error('更新参数项失败')
            }

            this.$message.success('修改参数项成功')
        },
        newTagBtn(row) {
            // 点击按钮文本框自动获得焦点
            // $nextTick方法中的作用，就是当页面元素被重新渲染之后才会执行回调函数中的代码
            row.inputVisible = true
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 点击标签的关闭按钮触发的事件
        handleClose(index, row) {
            // console.log(row.attr_vals)
            // console.log(index)
            row.attr_vals.splice(index, 1)
            this.saveAttrVals(row)
        }
    },
}
</script>

<style lang='less' scoped>
.el-alert {
    margin-bottom: 10px;
}

.el-tag {
    margin: 0 10px
}

.input-new-tag {
    width: 100px;
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
}
</style>