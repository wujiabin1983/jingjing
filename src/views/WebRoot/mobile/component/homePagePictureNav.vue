<!-- 图片导航 - 表单 - 图片导航 -->
<template>
    <div class="weui-flex pictureNavBox">
        <span :data-href="item.link" class="weui-grid" v-for="item in childData.navSet" :key="item">
            <div class="weui-grid__icon">
                <img :src="item.picture" alt="">
            </div>
            <p class="weui-grid__label">
                {{ item.name }}
            </p>
        </span>
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

.pictureNavBox { // 导航盒子
    background: transparent;
    width: 100%;
    height: 70px;
    background: transparent;
    // border: 1px dashed #d2d2d2;
    // & > div {
    
    //     width: 13%;
    //     height: 70px;
    //     padding: 0;
    // }
    img {
        border: none;
    }
    .weui-grid {
        width: 25%;
        padding: 10px;
        height: 70px;
        border: none;
    }
    .weui-grid:before, .weui-grid:after {
        border: none;
    }
}

</style>
