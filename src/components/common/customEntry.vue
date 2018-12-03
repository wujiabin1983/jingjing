<template>
    <el-container class="app-container">
        <el-main>
            <el-row class="textCenter">
                <el-col :span="6" v-for="(item, index) in customLink" :key="item.name">
                    <span ref="href" class="href" :data-url="item.url" v-text="item.name" @click="handleSelect(index)"></span>
                </el-col>
            </el-row>
        </el-main>
  </el-container>
</template>
<script>
// import { selectUserGroupInfo, addUserGroupInfo, updateUserGroupInfo, deleteUserGroupInfo } from '@/api/platform/userGroup'
import { mapGetters } from 'vuex'
import { getCustomLinksConst } from '@/api/public'
export default {
    data() {
        return {
            // 数据
            customLink: [],
            selected: {}
        }
    },
    methods: {
        // 方法
        handleSelect(index) {
            this.$refs.href.forEach((val, index) => {
                val.style.color = "#000";
            });
            this.selected = this.customLink[index];
            this.$refs.href[index].style.color = 'blue';
        },
        handleAdd() {
            return this.selected;
        }
    },
    created() {
        // 自定义链接
        let params = {
            userId: this.userInfo.userCode
        }
        getCustomLinksConst(params).then((res) => {
            let data = JSON.parse(Base64.decode(res.data)),
                code = data.messageType,
                msg = data.messageContent,
                val = data.valueObj;
//              console.log(JSON.stringify(data))
            if(code == 'SUCCESS') {
                this.customLink = msg;
//              console.log(this.customLink);
            }else { 
                this.$message.error(msg);
            }
        })

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
.textCenter{
	text-align: center;
}
.href {
    cursor: pointer;
    display: block;
    line-height: 28px;
    border: 1px solid transparent;
    // border-radius: rem(5px);
}
.href:hover {
    border-bottom: 1px solid blue;
}
</style>