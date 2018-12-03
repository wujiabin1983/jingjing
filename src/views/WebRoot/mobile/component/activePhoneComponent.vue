// 移动管理 - 自定义菜单
<template>
    <div class="app-container">
        <div>
            <div class="imgBox">
                <img :src="imgSrc" class="image" alt="">
            </div>
        </div>
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell" v-for="item in childData">
                <div class="weui-cell__hd"><label class="weui-label">{{ item.name }}</label></div>
                <div class="weui-cell__bd">
                    <input class="weui-input" :placeholder="`请输入${ item.name }号`"/>
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
.image{
	width: 100%;
    height: 100%;
    border-radius: 5px;
}
.el-form {
  display: inline-block;
  position: absolute;
  margin-left: rem(20px);
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
    height: 150px;
    padding: 5px;
}
</style>