<!-- 图片导航 - 表单 - 辅助线 -->
<template>
    <div class="weui-flex hrNavBox">
        <div class="line"></div>
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

.hrNavBox { // 导航盒子
    text-align: center;
    margin-top: 10px;
    height: 20px;
    background: transparent;
    // border: 1px dashed #ccc;
}
.line{
    margin: 8px auto 0;
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #000;
}

</style>
