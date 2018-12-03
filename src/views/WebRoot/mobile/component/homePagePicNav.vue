<!-- 图片导航 - 表单 - 文字导航 -->
<template>
        <article class="picNavBox">
            <img :src="childData.navSet[0].picture" alt="">
        </article>
</template>
<script>
import { mapGetters } from 'vuex'
// import Bus from '@/utils/eventBus.js'
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

.picNavBox { // 导航盒子
    background: transparent;
    margin-top: 10px;
    // height: 40px;
    // border: 1px dashed #ccc;
    img {
        border-radius: 5px;
        // height: 40px;
        width: 100%;
    }
}

</style>
