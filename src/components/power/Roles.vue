<template>
    <div class=''>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="rolesList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
                            v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row, item1.id)"> {{ item1.authName }}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环嵌套渲染二级权限 -->
                                <el-row v-for="(item2, i2) in item1.children" :key="item2.id"
                                    :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">
                                            {{
                                                    item2.authName
                                            }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18" class="vcenter">
                                        <el-tag closable v-for="(item3) in item2.children" :key="item3.id"
                                            type="warning" @close="removeRightById(scope.row, item3.id)"> {{
                                                    item3.authName
                                            }}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" icon="el-icon-edit" @click="editRolesBtn(scope.row)">编辑
                        </el-button>
                        <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteRoles(scope.row)">删除
                        </el-button>
                        <el-button size="small" type="warning" icon="el-icon-s-tools"
                            @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色弹窗 -->
        <el-dialog :title="addRolesForm.id ? '编辑角色信息' : '添加角色'" modal :visible.sync="addDialogVisible" width="50%"
            @close="closeAddDialog" :close-on-click-modal="false">
            <!-- 内容主体区 -->
            <el-form :model="addRolesForm" label-width="80px" :rules="addRolesFormRules" ref="addRolesFormRef">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRolesForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRolesBtn()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色权限弹窗 -->
        <el-dialog title="分配角色权限" modal :close-on-click-modal="false" :visible.sync="setRightDialogVisible" width="50%"
            @close="closeSetRightDialog">
            <!-- 树形控件 -->
            <el-tree :data="rightsTree" show-checkbox default-expand-all node-key="id" ref="setRightTreeRef"
                highlight-current :props="defaultProps" :default-checked-keys="defKeys">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRightBtn()">确 定</el-button>
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
            // 角色列表
            rolesList: [],
            // 角色信息表单
            addRolesForm: {
                roleName: '',
                roleDesc: '',
            },
            // 添加角色表单的验证规则
            addRolesFormRules: {
                roleName: [
                    { required: true, message: "角色名称不能为空", trigger: "blur" },
                ],
                roleDesc: [
                    { required: true, message: "角色描述不能为空", trigger: "blur" },
                ]
            },
            // 添加角色弹窗
            addDialogVisible: false,
            // 分配权限弹窗
            setRightDialogVisible: false,
            rightsTree: [],
            defaultProps: {
                children: 'children',
                label: 'authName',
            },
            // 默认选中的数组
            defKeys: [],
            // 点击分配权限按钮，将用户id保存起来，保存时接口需要该值
            roleId: ''
        };
    },
    computed: {},
    created() {
        // 获取权限列表
        this.getRolesList()
        // 获取权限树
        this.getRightTree()
    },
    methods: {
        // 获取角色列表
        async getRolesList() {
            const { data: res } = await this.$axios.get('/roles')
            this.rolesList = res.data
        },
        // 提交角色信息
        addRolesBtn() {
            this.$refs.addRolesFormRef.validate(async valid => {
                if (!valid) return
                // 如果不存在id字段，表示添加用户
                if (!this.addRolesForm.id) {
                    const { data: res } = await this.$axios.post('/roles', this.addRolesForm)
                    if (res.meta.status != 201) {
                        return this.$message.error('创建用户角色失败')
                    }
                    this.$message.success('创建角色成功')
                    this.addDialogVisible = false
                    this.getRolesList()
                } else {
                    // 表示编辑用户信息
                    const { data: res } = await this.$axios.put(`/roles/${this.addRolesForm.id}`, {
                        roleName: this.addRolesForm.roleName,
                        roleDesc: this.addRolesForm.roleDesc,
                    })
                    if (res.meta.status != 200) {
                        return this.$message.error('保存用户角色失败')
                    }
                    this.$message.success('修改成功')
                    this.addDialogVisible = false
                    this.getRolesList()
                }

            })
        },
        // 关闭添加角色弹窗后重置表单
        closeAddDialog() {
            this.$refs.addRolesFormRef.resetFields()
            this.addRolesForm = {
                roleName: '',
                roleDesc: '',
            }
        },
        // 编辑角色信息按钮
        editRolesBtn(rolesInfo) {
            // console.log(rolesInfo)
            this.addDialogVisible = true
            this.addRolesForm = JSON.parse(JSON.stringify(rolesInfo))
        },
        // 删除角色
        deleteRoles(rolesInfo) {
            // console.log(rolesInfo)
            // 删除用户信息按钮
            this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$axios.delete(`/roles/${rolesInfo.id}`)
                if (res.meta.status != 200) {
                    return this.$message.error('删除失败')
                }
                this.$message.success('删除成功')
                this.getRolesList()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 根据id删除对应的权限
        removeRightById(role, rightId) {
            // 弹窗提示用户是否删除
            this.$confirm('此操作将永久删除该角色权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
                if (res.meta.status != 200) {
                    return this.$message.error('删除失败')
                }
                this.$message.success('删除成功')

                // 不建议重新获取数据，会导致页面重新渲染。导致展开列合上，体验不好。
                // this.getRolesList()
                // 这个delete接口返回值是最新数据，只要将返回值重新赋值即可
                role.children = res.data
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 获取权限树
        async getRightTree() {
            const { data: res } = await this.$axios.get('/rights/tree')
            if (res.meta.status != 200) {
                return this.$message.error('权限列表获取失败')
            }
            this.rightsTree = res.data
        },
        // 展示角色权限对话框
        showSetRightDialog(rightInfo) {
            this.roleId = rightInfo.id
            this.setRightDialogVisible = true
            console.log(rightInfo)
            this.getLeafNode(rightInfo, this.defKeys)
        },
        // 通过递归的形式，获取角色下所有的三级权限额id，并保存在defKeys中
        getLeafNode(node, res) {
            // 只需要拿到所有三级节点的id
            // 如果node节点没有children表示他是三级节点
            if (!node.children) {
                return res.push(node.id)
            }
            node.children.forEach(item => {
                this.getLeafNode(item, res)
            })
        },
        closeSetRightDialog() {
            // 关闭弹窗时清空所有选中状态
            this.$refs.setRightTreeRef.setCheckedKeys([])
            this.defKeys.length = 0
        },
        // 点击为角色分配权限
        async setRightBtn() {
            let keys = []
            // 获取半选中状态id
            let halfChecked = this.$refs.setRightTreeRef.getHalfCheckedKeys()
            //  获取全选中的id
            let AllChecked = this.$refs.setRightTreeRef.getCheckedKeys()
            keys = [...halfChecked, ...AllChecked]
            const idStr = keys.join(',')
            const { data: res } = await this.$axios.post(`/roles/${this.roleId}/rights`, { rids: idStr })
            if(res.meta.status != 200) {
                return this.$message.error('分配权限失败')
            }
            this.$message.success('权限分配成功')
            this.getRolesList()
            this.setRightDialogVisible = false

        }
    },
}
</script>

<style lang='less' scoped>
.el-tag {
    margin: 10px 10px;
}

// 上边框线
.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

// 垂直方向上子元素居中对齐
.vcenter {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
</style>