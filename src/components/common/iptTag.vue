<template>
    <div class="tagArea" :style="{width: `${parseInt(width) + 45}px`}">
        <GeminiScrollbar class="my-scroll-bar" autoshow :style="{width: `${width}px`, height: `${height}px`}">
            <el-tag size="mini" closable v-for="(item, index) in tagListsName" :key="item"  @close="handleClose(item, index)">{{item}}</el-tag>
        </GeminiScrollbar>
        <el-dropdown class="drop-down" trigger="click" :hide-on-click="false" @command="handleCommand">
            <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="item" v-for="item in items" :key="item" :class="`drop-down-${name}`" :disabled="item == '暂无数据'">{{item}}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
// import { selectUserGroupInfo, addUserGroupInfo, updateUserGroupInfo, deleteUserGroupInfo } from '@/api/platform/userGroup'
import { mapGetters } from 'vuex'
import { getCustomLinksConst } from '@/api/public'
export default {
    data() {
        return {
            // 数据
            tagListsName: [],
            tagListsId: [],
        }
    },
    props: {
        width: {
            default: '200'
        },
        height: {
            default: '32'
        },
        name: {
            type: String,
            required: true,
            default: '未定义'
        },
        items: {
            type: Array,
            default: function() {
                return ['暂无数据']
            }
        }
    },
    methods: {
        // 方法
        // 关闭标签
        handleClose(tag, index) {
            this.tagListsName.splice(index, 1);
        },
        // 下拉菜单选中
        handleCommand(str) {
            this.tagListsName.push(str);
            this.tagListsName = Array.from(new Set(this.tagListsName));
        }
    },
    created() {
        // 自定义链接


    },
    computed: {
        // 计算属性
        ...mapGetters([
            'userInfo',
        ])
    },
    watch: {
        tagListsName: function (newVal, oldVal) {
            this.$emit(`selectTags`, {
                tags: this.tagListsName,
                name: this.name
            });
            let dropDownItems = document.querySelectorAll(`.drop-down-${this.name}`);
            dropDownItems.forEach((val, index) => {
                val.classList.remove('el-dropdown-menu__active');
            });
            newVal.forEach((val, index) => {
                dropDownItems.forEach((subVal, subIndex) => {
                    if(val == subVal.innerText) {
                        subVal.classList.add('el-dropdown-menu__active');
                    }
                });
            });
        }
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

.tagArea {
    display: inlline-block;
    width: auto;
    position: relative;
    border: 1px solid #d2d2d2;
    border-radius: 5px;
    padding: 0 30px 0 5px;
    .my-scroll-bar {
        height: 20px;
        white-space: nowrap;
        .el-tag {
            margin-right: 5px;
        }
    }
    .drop-down {
        position: absolute;
        right: 0;
        top: 5px;
        cursor: pointer;
    }
}
.el-dropdown-link {
    padding: 10px;
}
.el-dropdown-menu__active {
    background: #e6f5fc;
}
.wrapper {
    width: 300px;
    height: 300px;
}
</style>
