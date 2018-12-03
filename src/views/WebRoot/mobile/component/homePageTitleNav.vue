<!-- 图片导航 - 标题 -->
<template>
    <article class="weui-article titleNavBox">
        <h1 class="title">{{childData.navSet[0].title}}</h1>
    </article>
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

.titleNavBox { // 导航盒子
    // background: #FFF;
    padding: 0;
    // margin-top: 10px;
    // height: 40px;
    // border: 1px dashed #ccc;
}

</style>
