// 完善资料 - 移动端
<template>
    <div class="app-container">
        <div>
            <div class="imgBox">
                <img :src="imgSrc" class="image" alt="">
            </div>
        </div>
        <div class="weui-cells__title">必填信息</div>
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell" v-for="item in childData" v-if="item.isRequired">
                <div class="weui-cell__hd"><label class="weui-label">{{ item.name }}</label></div>
                <div class="weui-cell__bd">
                    <input class="weui-input" :placeholder="`请输入${ item.name }`"/>
                </div>
            </div>
        </div>
        <div class="weui-cells__title">选填信息</div>
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell" v-for="item in childData" v-if="!item.isRequired">
                <div class="weui-cell__hd"><label class="weui-label">{{ item.name }}</label></div>
                <div class="weui-cell__bd">
                    <input class="weui-input" :placeholder="`请输入${ item.name }`"/>
                </div>
            </div>
        </div>
    </div><!--btn3-->
</template>
<script>
import { mapGetters } from "vuex";

export default {
    props: ['childData','imgSrc'],
    data() {
        return {
            
        };
    },
    methods: {
        // 方法
        
    },
    created() {
        // 钩子函数 -- 初始化
    },
    computed: {
        // 计算属性
        ...mapGetters(["userInfo"])
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
.app-container{
	padding: 0!important;
}
.image{
    width: 100%;
    height: 100%;
}
.dsh-center {
  display: flex;
  justify-content: center;
}

.dsh-vertical-center {
  display: flex;
  align-items: center;
}



.el-carousel__item {
    img {
        width: 100%;
        height: 100%;
    }
}

.imgBox {
    width: 100%;
    height: 50%;
}
.weui-cell {
    font-size: 12px;
}
</style>