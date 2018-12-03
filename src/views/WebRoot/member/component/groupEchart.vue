// 会员分组 - 我的分组 - 分组卡片组件
<template>
    <div :ref="childId">
        
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            // 数据

        }
    },
    props: ['childId', 'childOption'],
    methods: {
        initEcharts(childOption,childId){
	        // 钩子函数 -- 初始化
	        let echarts = require('echarts');
	        // 实例化
	        let myChart = echarts.init(this.$refs[childId]);
	        // 绘制图表
	        myChart.setOption(childOption);
        }
    },
    mounted() {
        this.initEcharts(this.childOption,this.childId);
    },
    created() {
    },
    computed: {
        // 计算属性
        ...mapGetters([
            'userInfo',
        ])
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/_function.scss";
.el-card {
    width: 100%;
}
.el-form {
    display: inline-block;
    position: absolute;
    margin-left: rem(20px);
}
.card {
    width: 100%;
    height: 100%;
}

</style>
