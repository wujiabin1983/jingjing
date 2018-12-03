<!-- 图片导航 - 表单 -->
<template>
        <div class="weui-cells wordNavBox">
            <a class="weui-cell weui-cell_access" :data-href="item.link" v-for="item in childData.navSet" :key="item">
                <div class="weui-cell__hd">
                    <img :src="item.picture" alt="" class="image">
                </div>
                <div class="weui-cell__bd">
                    <p>{{ item.name }}</p>
                </div>
                <div class="weui-cell__ft"></div>
            </a>
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
.image{
	width:20px;
	margin-right:5px;
	display:block
}
.wordNavBox { // 导航盒子
    margin-top: 10px;
    height: 40px;
    background: transparent;
}
.weui-cells:before {
    border-top: none;
}
.weui-cells:after {
    border-bottom: none;
}

</style>
