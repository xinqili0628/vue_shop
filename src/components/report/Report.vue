<template>
    <div class=''>
        <my-bread secondName="数据统计" threeName="数据报表"></my-bread>
        <el-card>
            <!--2. 为 ECharts 准备一个定义了宽高的 DOM -->
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
//import x from ''
// 1.导入echatrs
import * as echarts from 'echarts';
export default {
    components: {},
    data() {
        return {
            // 需要合并的对象
            options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        };
    },
    computed: {},
    created() { },
    // 此时页面上的元素已经被初始化完毕
    async mounted() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        const { data: res } = await this.$axios.get('reports/type/1')
        if (res.meta.status != 200) {
            return this.$message.error('获取折线图数据失败！')
        }
        // 准备数据
        const result ={...this.options,...res.data}
        // 展示数据
        myChart.setOption(result);
    },
    methods: {

    },
}
</script>

<style lang='less' scoped>
</style>