<template>
    <div class=''>
        <my-bread secondName="商品管理" threeName="添加商品"></my-bread>
        <el-card>
            <!-- 提示区域 -->
            <el-alert title="添加商品信息" type="info" :closable="false" center show-icon>
            </el-alert>
            <!-- 步骤条 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs tab-position="left" v-model="activeIndex" :before-leave='beforeTabLeave'
                    @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_name">
                            <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cascaderProps"
                                @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染表单的item项 -->
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border size="small" :label="item" v-for="(item, index) in item.attr_vals"
                                    :key="index"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- 上传图片 -->
                        <!-- action：图片要上传到的后台API接口地址 -->
                        <el-upload :headers="headerObj" :action="$axios.defaults.baseURL + 'upload'"
                            :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture"
                            :on-success="uploadSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <!-- 添加商品按钮 -->
                        <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 预览图片 -->
        <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
            <img :src="picSrc" alt="" class="previewImg">
        </el-dialog>

    </div>
</template>

<script>
//import x from ''
export default {
    components: {},
    data() {
        return {
            activeIndex: '0',
            // 添加商品的表单对象
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                // 商品所属的分类
                goods_cat: [],
                // 图片的数组
                pics: [],
                // 商品的详情描述
                goods_introduce: '',
                attrs: []
            },
            addFormRules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' }
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' }
                ],
                goods_cat: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' }
                ],
            },
            cateList: [],
            selectKeys: [],
            // 级联选择框的配置对象
            cascaderProps: {
                expandTrigger: 'hover',
                value: 'cat_id', //选中的值
                label: 'cat_name', //用户看到的值
                children: 'children', //父子节点的嵌套属性
            },
            // 动态列表
            manyTableData: [],
            // 静态属性列表
            onlyTableData: [],
            // 图片上传组件的headers请求头对象
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            // 控制预览弹窗的显示与隐藏
            previewDialogVisible: false,
            picSrc: ''

        };
    },
    computed: {
        cateId() {
            if (this.addForm.goods_cat.length == 3) {
                return this.addForm.goods_cat[2]
            }
            return null
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$axios.get('categories')
            if (res.meta.status != 200) {
                return this.$message.error('获取分类列表失败')
            }
            this.cateList = res.data
        },
        // 级联选择器中选项变化。会触发这个函数
        handleChange() {
            // 证明选中的不是三级分类。该需求是只能选择三级节点
            if (this.addForm.goods_cat.length != 3) {
                this.addForm.goods_cat = []
                this.$message.warning('只允许为三级分类设置参数')
                return
            }
        },
        beforeTabLeave(activeName, oldActiveName) {
            if (oldActiveName === '0' && this.addForm.goods_cat.length != 3) {
                this.$message.error('请先选择商品分类')
                return false
            }
        },
        // 处理图片预览效果
        handlePreview(file) {
            console.log(file)

            // this.picSrc= file.url
            this.picSrc = file.response.data.url
            this.previewDialogVisible = true
        },
        // 处理移除图片的操作
        handleRemove(file, fileList) {
            console.log(file)

            // 1.获取将要删除的图片的临时路径
            const tmp_path = file.response.data.tmp_path
            // 2.从pics数组中，找到这个图片对应的索引值
            const i = this.addForm.pics.findIndex(item => item.pic === tmp_path)
            // 3. 调用数组的splice方法，把对应的图片信息对象从pics数组中移除  
            this.addForm.pics.splice(i, 1)
            console.log(this.addForm)
        },
        // 监听图片上传成功的函数
        uploadSuccess(response, file, fileList) {
            console.log(response)
            // 1.拼接得到一个图片信息对象
            const picInfo = {
                pic: response.data.tmp_path
            }
            // 2.将图片信息对象，push到pics数组中
            this.addForm.pics.push(picInfo)
            console.log(this.addForm.pics)
        },
        add() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) {
                    this.$message.error('请填写必要的表单项')
                    return
                }
                // 执行添加业务逻辑
                // 处理动态参数
                this.manyTableData.forEach(item => {
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item. attr_vals.join(',')
                    }
                    this.addForm.attrs.push(newInfo)
                })
                // 处理静态属性
                this.onlyTableData.forEach(item => {
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.vals
                    }
                    this.addForm.attrs.push(newInfo)
                })
                //  this.addForm.goods_cat = this.addForm.goods_cat.join(',') 该行代码执行会报错因为goods_cats是一个数组，双向绑定到基本信息中的级联选择器上了。这样转成字符串级联选择器就会报错
                //  要先把addFrom深拷贝一下再操作
                // 调用lodash包=====> cloneDeep(obj) 深拷贝
                const newAddForm = JSON.parse(JSON.stringify(this.addForm))
                newAddForm.goods_cat = newAddForm.goods_cat.join(',')

                // 发起请求添加商品
                // 商品名称必须是唯一的
               const {data : res} = await this.$axios.post('goods',newAddForm)
               if(res.meta.status != 201) {
                   return this.$message.error('添加商品失败')
               }
               this.$message.success('添加商品成功')
               this.$router.push('/goods')
            })
        },
        async tabClicked() {
            // 证明访问的动态参数面板
            if (this.activeIndex === '1') {
                const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
                if (res.meta.status != 200) {
                    return this.$message.error('获取动态参数列表失败')
                }
                console.log(res.data)
                res.data.forEach(item => {
                    item.attr_vals.length === 0 ? [] : item.attr_vals = item.attr_vals.split(',')
                })
                this.manyTableData = res.data
            } else if (this.activeIndex === '2') {
                const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
                if (res.meta.status != 200) {
                    return this.$message.error('获取静态属性列表失败')
                }
                console.log(res.data)
                this.onlyTableData = res.data
            }
        }
    }
}
</script>

<style lang='less' scoped>
.el-checkbox {
    margin: 0 5px 0 0 !important;
}

.previewImg {
    width: 100%;
}

.addBtn {
    float: right;
}
</style>