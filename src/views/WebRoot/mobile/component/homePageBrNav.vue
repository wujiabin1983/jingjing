<!-- 图片导航 - 表单 - 空白行 -->
<template>
    <div class="weui-flex brNavBox">
        
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Bus from '@/utils/eventBus.js'
export default {
    data() {
        return {
            // 数据
            'childNavBox': []
        }
    },
    props: ['childData'],
    methods: {
        // 方法
    },
    created() {
        // 钩子函数 -- 初始化
    },
    computed: {
        // 计算属性
        ...mapGetters([
            'userInfo',
        ]),
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

.brNavBox { // 导航盒子
    text-align: center;
    margin-top: 16px;
    height: 10px;
    background: #f1f1f0;
    // border: 1px dashed #ccc;
}

</style>
