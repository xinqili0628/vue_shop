<template>
    <div class=''>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card class="box-card">
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input v-model="queryInfo.query" placeholder="请输入内容" class="input-with-select" clearable
                        @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- table区域 -->
            <el-table :data="userList" border style="width: 100%">
                <!-- 索引列 -->
                <el-table-column type="index" label="#" width="50"></el-table-column>
                <el-table-column prop="username" label="姓名" min-width="80"></el-table-column>
                <el-table-column prop="email" label="邮箱" min-width="100"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" icon="el-icon-edit" @click="showEditDialog(scope.row)">
                        </el-button>
                        <el-button type="danger" size="small" icon="el-icon-delete" slot="reference"
                            @click="deleteUserBtn(scope.row)">
                        </el-button>
                        <!-- 添加enterable属性，防止下层的tooltip遮挡上层按钮 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" size="small" icon="el-icon-s-tools"
                                @click="showSetRoleDialog(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="closeAddDialog">
            <!-- 内容主体区 -->
            <el-form :model="addUserForm" label-width="80px" :rules="addUserFormRules" ref="addUserFormRef">
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="addUserForm.username"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="password">
                    <el-input v-model="addUserForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUserBtn">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户信息 -->
        <el-dialog title="编辑用户信息" modal :visible.sync="editDialogVisible" width="50%" @close="closeEditDialog"
            :close-on-click-modal="false">
            <!-- 内容主体区 -->
            <el-form :model="addUserForm" label-width="80px" :rules="addUserFormRules" ref="editUserFormRef">
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="addUserForm.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserBtn()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" modal :visible.sync="setRoleDialogVisible" width="50%" @close="closeSetRoleDialog"
            :close-on-click-modal="false">
            <!-- 内容主体区 -->
            <div>
                <p>当前用户：{{ userInfo.username }}</p>
                <p>当前角色：{{ userInfo.role_name }}</p>
                <p>分配新角色：
                    <el-select v-model="selectedRoleId" placeholder="请选择新角色">
                        <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </p>

            </div>
            <!-- 底部按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
//import x from ''
export default {
    components: {},
    data() {
        // 自定义校验规则，写在【data】中，【注意不是return里面】
        // 验证邮箱的规则
        var checkEmail = ((rule, value, callback) => {
            // 验证邮箱的正则表达式
            const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
            if (regEmail.test(value)) {
                return callback()
            }
            callback(new Error('请输入合法的邮箱'))
        })
        // 验证手机号
        var checkMobile = ((rule, value, callback) => {
            const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
            if (regMobile.test(value)) {
                return callback()
            }
            callback(new Error('请输入合法的手机号'))
        })
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                // 
                query: '',
                // 当前页数
                pagenum: 1,
                // 当期每页显示多少条
                pagesize: 2
            },
            //  
            userList: [],
            // 总页数
            total: 0,
            // 控制添加用户对话框的显示与隐藏
            addDialogVisible: false,
            // 添加用户信息表单
            addUserForm: {
                username: '',
                password: '',
                email: '',
                mobile: '',
            },
            // 添加用户信息表单验证规则
            addUserFormRules: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    { min: 3, max: 10, message: "用户名长度在 3 到 10 个字符", trigger: "blur" },
                ],
                password: [
                    { required: true, message: "密码不能为空", trigger: "blur" },
                    { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
                ],
                email: [
                    { required: true, message: "请输入邮箱", trigger: "blur" },
                    { validator: checkEmail, trigger: "blur" },
                ],
                mobile: [
                    { required: true, message: "请输入手机号", trigger: "blur" },
                    { validator: checkMobile, trigger: "blur" },
                ],
            },
            editDialogVisible: false,
            // 分配角色对话框
            setRoleDialogVisible: false,
            // 需要被分配角色的用户信息
            userInfo: {},
            // 所有角色的列表
            rolesList: [],
            // 已选中的角色Id值
            selectedRoleId: ''
        };
    },
    computed: {},
    created() {
        this.getUserList()
    },
    methods: {
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        // 监听页码值改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        async getUserList() {
            const { data: res } = await this.$axios.get('/users', { params: this.queryInfo })
            console.log(res)
            if (res.meta.status != 200) {
                return this.$message.error('获取用户列表失败')
            }
            this.userList = res.data.users
            this.total = res.data.total
        },
        // 监听switch开关状态的改变
        async userStateChange(userInfo) {
            const { data: res } = await this.$axios.put(`/users/${userInfo.id}/state/${userInfo.mg_state}`)
            if (res.meta.status != 200) {
                userInfo.mg_status = !userInfo.mg_status
                return this.$message.error('更新用户状态失败！')
            }
            this.$message.success('状态更新成功')
        },
        // 关闭添加用户弹窗，移除表单校验并置空
        closeAddDialog() {
            this.$refs.addUserFormRef.resetFields();
        },
        // 提交表单按钮
        addUserBtn() {
            // 添加表单预校验功能，当所有的表单项都通过了校验规则再发起网络请求。先通过this.$refs.addUserFormRef拿到表单的实例对象，再通过validate校验
            this.$refs.addUserFormRef.validate(async valid => {
                // console.log(valid)
                if (!valid) return
                const { data: res } = await this.$axios.post('/users', this.addUserForm)
                if (res.meta.status != 201) {
                    return this.$message.error('保存失败')
                }
                this.$message.success('添加用户成功')
                // 隐藏对话框
                this.addDialogVisible = false
                // 获取最新的表单数据
                this.getUserList()
            })
        },
        // 删除用户信息按钮
        deleteUserBtn(userInfo) {
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$axios.delete(`/users/${userInfo.id}`)
                if (res.meta.status != 200) {
                    return this.$message.error('删除失败')
                }
                this.$message.success('删除成功')
                this.getUserList()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 用户编辑的对话框
        showEditDialog(userInfo) {
            this.editDialogVisible = true
            // console.log(userInfo)
            this.addUserForm.username = userInfo.username
            this.addUserForm.email = userInfo.email
            this.addUserForm.mobile = userInfo.mobile
            this.addUserForm.id = userInfo.id
        },

        // 提交修改后的用户信息，确定按钮
        editUserBtn() {
            console.log(this.$refs.editUserFormRef)
            this.$refs.editUserFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$axios.put(`/users/${this.addUserForm.id}`, {
                    email: this.addUserForm.email,
                    mobile: this.addUserForm.mobile
                })
                if (res.meta.status != 200) {
                    return this.$message.error('修改用户信息失败')
                }
                this.$message.success('修改用户信息成功')
                this.editDialogVisible = false
                this.getUserList()
            })
        },
        // 关闭编辑用户信息弹窗，清空表单校验。
        closeEditDialog() {
            this.$refs.editUserFormRef.resetFields()
            this.addUserForm = {
                username: '',
                password: '',
                email: '',
                mobile: '',
            }
        },
        // 展示分配角色对话框
        async showSetRoleDialog(userInfo) {
            this.userInfo = userInfo
            this.setRoleDialogVisible = true
            // 在展示对话框时获取所有的角色信息

            const { data: res } = await this.$axios.get('/roles')
            if (res.meta.status != 200) {
                return this.$message.error('角色列表获取失败')
            }
            this.rolesList = res.data
        },
        // 关闭分配角色对话框时的操作
        closeSetRoleDialog() {
            this.selectedRoleId = ''
        },
        // 点击按钮分配用户角色
        async saveRoleInfo() {
            if (!this.selectedRoleId == true) {
                return this.$message.error('请选择要分配的角色')
            }
            const { data: res } = await this.$axios.put(`/users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
            if (res.meta.status != 200) {
                return this.$message.error('更新角色失败')
            }
            this.$message.success('更新角色成功')
            this.getUserList()
            this.setRoleDialogVisible = false
        }
    },
}
</script>

<style lang='less' scoped>
</style>