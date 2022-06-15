<template>
    <div class=''>
        <my-bread secondName="订单管理" threeName="订单列表"></my-bread>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="queryValBtn"
                        @keyup.enter.native="queryValBtn">
                        <el-button slot="append" icon="el-icon-search" @click="queryValBtn"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="orderList" border stripe style="width: 100%">
                <el-table-column type="index" label="#" width="50"></el-table-column>
                <el-table-column prop="order_number" label="订单编号" width="380"></el-table-column>
                <el-table-column prop="order_price" label="订单价格(元)" width="120"></el-table-column>
                <el-table-column prop="order_pay" label="是否付款" width="100">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.order_pay === '1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
                <el-table-column prop="create_time" label="下单时间" width="200">
                    <!-- 使用过滤器将时间戳转换为年月日 -->
                    <template slot-scope="scope">
                        {{ scope.row.create_time | filter_formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="修改订单地址" :enterable="false" placement="top">
                            <el-button type="primary" icon="el-icon-edit" size="small" @click="editBtn(scope.row)">
                            </el-button>
                        </el-tooltip>

                        <el-tooltip class="item" effect="dark" content="查看物流" :enterable="false" placement="top">
                            <el-button type="success" icon="el-icon-location" size="small"
                                @click="showProgressBtn(scope.row)"></el-button>
                        </el-tooltip>

                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 20, 50]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 修改物流地址弹窗 -->
        <el-dialog title="修改地址" modal :close-on-click-modal="false" :visible.sync="editDialogVisible" width="50%"
            @close="closeEditDialog">
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader v-model="addressForm.address1" :options="cityData" :props="{ expandTrigger: 'hover' }">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 展示物流进度 -->
        <el-dialog title="物流进度" modal :close-on-click-modal="false" :visible.sync="showProgressDialogVisible"
            width="50%">
            <el-timeline :reverse="false">
                <el-timeline-item v-for="(item, index) in processInfo" :key="index" :timestamp="item.time">
                    {{ item.context }}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
//import x from ''
import cityData from './citydata.js'
import processInfo from './ProgressInfo.js';
export default {
    components: {},
    data() {
        return {
            // 属性值和属性名一样的话可以简写
            // cityData:cityData,
            cityData,
            processInfo,
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            total: 0,
            // 订单列表数据
            orderList: [],
            // 修改地址弹窗
            editDialogVisible: false,
            addressForm: {
                address1: [],
                address2: ''
            },
            addressFormRules: {
                address1: [
                    { required: true, message: '请选择省市区/县', trigger: 'blur' }
                ],
                address2: [
                    { required: true, message: '请填写详细地址', trigger: 'blur' }
                ]
            },
            // 物流进度弹窗
            showProgressDialogVisible: false

        };
    },
    computed: {},
    created() {
        this.getOrderList()
    },
    methods: {
        queryValBtn() {
            this.getOrderList()
        },
        async getOrderList() {
            const { data: res } = await this.$axios.get('orders', { params: this.queryInfo })
            if (res.meta.status != 200) {
                return this.$message.error('订单列表获取失败')
            }
            this.orderList = res.data.goods
            this.total = res.data.total
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getOrderList()
        },
        editBtn(orderInfo) {
            this.editDialogVisible = true
        },
        closeEditDialog() {
            this.editDialogVisible = false
            this.$refs.addressFormRef.resetFields()
        },
        async showProgressBtn(row) {
            this.showProgressDialogVisible = true
        },
    },
}
</script>

<style lang='less' scoped>
.el-cascader {
    width: 100%;
}
</style>