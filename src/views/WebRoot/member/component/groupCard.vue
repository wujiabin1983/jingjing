// 会员分组 - 我的分组 - 分组卡片组件
<template>
    <div class="card">
        <div class="card-header" :style="cardHeaderBg">
            <img class="icon" :src="setImg" alt="">
            <span class="name">{{childData.groupName}}</span>
            <span class="icon-setting">
                <el-checkbox v-if="childPageName == '分组查看'" v-model="childData.selected" @change="handleCheckbox"></el-checkbox>
                <el-dropdown trigger="click" @command="handleCommand" v-if="childPageName != '分组查看'">
                    <span class="el-dropdown-link">
                       <img :src="img.shezhi" alt="">
                    </span>
                    <el-dropdown-menu slot="dropdown" >
                        <el-dropdown-item command="查看分组信息">查看分组信息</el-dropdown-item>
                        <el-dropdown-item command="查看分组详情">查看分组详情</el-dropdown-item>
                        <el-dropdown-item command="复制" v-if="childPageName != '所有分组' && childCopy && (childData.groupType == '预置分组' || childData.groupType == '共享分组' || childData.groupType == '我的分组')">复制</el-dropdown-item>
                        <el-dropdown-item command="从当前分组移除" v-if="childPageName != '所有分组' && childRemove && (childData.groupType == '品牌分组' || childData.groupType == '我的分组')">从当前分组移除</el-dropdown-item>
                        <!-- <el-dropdown-item command="是否在APP中显示" v-if="childIfShow && (childData.groupType == '品牌分组' || childData.groupType == '我的分组')">是否在APP中显示</el-dropdown-item> -->
                        <el-dropdown-item command="编辑" v-if="childPageName != '所有分组' && childUpdate && (childData.groupType == '品牌分组')">编辑</el-dropdown-item>
                        <el-dropdown-item command="共享" v-if="childPageName != '所有分组' && childShare && (childData.groupType == '我的分组')">共享</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </span>
        </div>
        <div class="card-container">
            <span class="num">{{childData.appUserCount}}<i> 人</i></span>
            <div class="app-radio-info">
                <span class="app-radio">
                    <i class="app-text" v-if="childData.isAppShow === '是' ? true : false">APP</i>
                    <el-switch :width="43" v-model="childData.isAppShow" active-color="#13ce66" active-value="是" inactive-value="否" @change="handleSwitch" :disabled="childPageName == '分组查看' || childPageName == '所有分组' || childPageName == '预置分组' || childPageName == '共享分组'"></el-switch>
                </span>
                <span class="app-info">
                    <el-tooltip effect="dark" placement="bottom" popper-class="app-popper">
                        <groupCardDetailInfo :childData="childData" slot="content"></groupCardDetailInfo>
                        <!-- <div slot="content">
                            <table>
                                <tr>
                                    <td>性别</td>
                                    <td>男</td>
                                </tr>
                                <tr>
                                    <td>最后一次</td>
                                    <td>100</td>
                                    <td>200</td>
                                </tr>
                            </table>
                        </div> -->
                        <span>分组条件</span>
                    </el-tooltip>
                </span>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import groupCardDetailInfo from './groupCardDetailInfo.vue'
import fenzu1 from '@/assets/images/fenzu1.png'
import fenzu2 from '@/assets/images/fenzu2.png'
import fenzu3 from '@/assets/images/fenzu3.png'
import shezhi from '@/assets/images/shezhi.png'
import { 
		selectGroupAll, searchListGroupAll, searchAnalyzeGroupAll,
		selectGroupInit, searchListGroupInit, searchAnalyzeGroupInit, removeGroupBrand, editGroupBrand,
		selectGroupBrand, searchListGroupBrand, searchAnalyzeGroupBrand,
		selectGroupShare, searchListGroupShare, searchAnalyzeGroupShare,
		selectGroupMine, searchListGroupMine, searchAnalyzeGroupMine, addGroupMine, removeGroupMine, shareGroupMine, editGroupMine,
		GroupCondition 
	} from '@/api/member/group'
export default {
    data() {
        return {
            // 数据
            isShow: false,
            img: {
                fenzu1: fenzu1,
                fenzu2: fenzu2,
                fenzu3: fenzu3,
                shezhi: shezhi
            },
        }
    },
    components: { groupCardDetailInfo },
    props: {
        'childData': {}, 
        'childPageName': {}, 
        // 复制
        'childCopy': { 
            type: Boolean,
            default: false
        },
        // 从当前分组移除
        'childRemove': { 
            type: Boolean,
            default: false
        },
        // 是否在APP中显示
        'childIfShow': { 
            type: Boolean,
            default: false
        },
        // 编辑
        'childUpdate': { 
            type: Boolean,
            default: false
        },
        // 共享
        'childShare': { 
            type: Boolean,
            default: false
        },
    },
    methods: {
        // 方法
        // 用于群发消息，查看
        handleCheckbox(str) {
            this.$emit('emitSelected', this.childData);
        },
        // 是否在app中显示
        handleSwitch(str) {
            let that = this;
            if(this.childPageName === '我的分组') {
                let params = {
                    userId: this.userInfo.userCode,
                    id: that.childData.id,
                    isAppShow: str,
                    version: this.childData.version
                }
                editGroupMine(params) 
                    .then(res => {
                        let data = JSON.parse(Base64.decode(res.data)),
                            code = data.messageType,
                            msg = data.messageContent,
                            val = data.valueObj;
                        if(code == 'SUCCESS') {
                            // that.$message.success(msg);
                            that.$emit('childReload', 'app');
                            this.$router.push({
                                name: '我的分组'
                            });
                        }else {
                            // that.$message.error(msg);
                            that.childData.isAppShow = str == '是' ? '否' : '是';
                        }
                    })
                    .catch()
            }else if(this.childPageName === '品牌分组') {
                let params = {
                    "userId": this.userInfo.userCode,//隐藏
                    "id": this.childData.id,//隐藏
                    "version": this.childData.version,
                    "groupId": this.childData.groupId,
                    "groupName": this.childData.groupName,
                    "dateBrand": this.childData.dateBrand, // "日期纬度（json字符串）"
                    "memBrand": this.childData.memBrand,
                    "memIndex": this.childData.memIndex,
                    "fixedBrandMulti": this.childData.fixedBrandMulti,
                    "fixedBrandRadio": this.childData.fixedBrandRadio,
                    "defineJson1": this.childData.defineJson1,
                    "isAppShow": str
                    // "levalExpDate": !formData.levalExpDate ? '' :formData.levalExpDate // "等级有效期(json格式)"					
                }
                editGroupBrand(params)
                    .then(res => {
                        let data = JSON.parse(Base64.decode(res.data)),
                            code = data.messageType,
                            msg = data.messageContent,
                            val = data.valueObj;
                        if(code == 'SUCCESS') {
                            // this.$message.success(msg);
                            that.$emit('childReload', 'app');
                            this.$router.push({
                                name: '品牌分组'
                            });
                        }else {
                            // this.$message.error(msg);
                            that.childData.isAppShow = str == '是' ? '否' : '是';
                        }
                    })
                    .catch();
            }
        },
        // 选择菜单
        handleCommand(command) {
            if(command == '查看分组信息') {
                this.handleShowInfo();
            }
            if(command == '查看分组详情') {
                this.handleShowDetail();
            }
            if(command == '复制') {
                this.handleCopy();
            }
            if(command == '从当前分组移除') {
                this.handleRemove();
            }
            if(command == '是否在APP中显示') {
                this.handleWhether();
            }
            if(command == '编辑') {
                this.handleEdit();
            }
            if(command == '共享') {
                this.handleShare();
            }
        },
        // 查看分组信息
        handleShowInfo () {
            // console.log('查看分组信息');
            this.$router.push({
                name: '所有分组-分组详情',
                params: {
                    pageType: '查看',
                    pageName: this.childPageName,
                    formData: JSON.stringify(this.childData)
                }
            });
        },
        // 查看分组详情
        handleShowDetail () {
            if(this.childPageName == '所有分组') {
                this.$router.push({
                    name: '所有分组-系统分析',
                    params: {
                        pageType: '查看',
                        pageName: this.childPageName,
                        formData: JSON.stringify(this.childData)
                    }
                });
            }else if(this.childPageName == '预置分组') {
                this.$router.push({
                    name: '预置分组-系统分析',
                    params: {
                        pageType: '查看',
                        pageName: this.childPageName,
                        formData: JSON.stringify(this.childData)
                    }
                });
            }else if(this.childPageName == '品牌分组') {
                this.$router.push({
                    name: '品牌分组-系统分析',
                    params: {
                        pageType: '查看',
                        pageName: this.childPageName,
                        formData: JSON.stringify(this.childData)
                    }
                });
            }else if(this.childPageName == '共享分组') {
                this.$router.push({
                    name: '共享分组-系统分析',
                    params: {
                        pageType: '查看',
                        pageName: this.childPageName,
                        formData: JSON.stringify(this.childData)
                    }
                });
            }else if(this.childPageName == '我的分组') {
                this.$router.push({
                    name: '我的分组-系统分析',
                    params: {
                        pageType: '查看',
                        pageName: this.childPageName,
                        formData: JSON.stringify(this.childData)
                    }
                });
            }
        },
        // 复制
        handleCopy () {
            // console.log('复制');
            let that = this;
            this.$prompt('分组名称', '设置基本信息', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                if(this.childPageName === '我的分组' || this.childPageName === '所有分组') {
                    let params = {
                        "userId" : that.userInfo.userCode,
                        "dateBrand": that.childData.dateBrand,
                        "memBrand": that.childData.memBrand,
                        "memIndex": that.childData.memIndex,
                        "fixedBrandMulti": that.childData.fixedBrandMulti,
                        "fixedBrandRadio": that.childData.fixedBrandRadio,
                        "defineJson1": that.childData.defineJson1,
                        "groupName": value
                    }
                    addGroupMine(params)
                        .then((res) => {
                            let data = JSON.parse(Base64.decode(res.data)),
                                code = data.messageType,
                                msg = data.messageContent,
                                val = data.valueObj;
                            if(code == 'SUCCESS') {
                                that.$message.success(msg);
                                that.$emit('childReload', '复制');
                            }else {
                                that.$message.error(msg);
                            }
                        })
                        .catch()
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });       
            });
        },
        // 从当前分组移除
        handleRemove () {
            let that = this;
            // console.log('从当前分组移除');
            this.$confirm('您确定要删除吗, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(this.childPageName === '我的分组') {
                    let params = {
                        "userId" : this.userInfo.userCode,
                        "id": this.childData.id,
                    }
                    removeGroupMine(params)
                        .then(res => {
                            let data = JSON.parse(Base64.decode(res.data)),
                                code = data.messageType,
                                msg = data.messageContent,
                                val = data.valueObj;
                            if(code === 'SUCCESS') {
                                that.$message.success(msg);
                                that.$emit('childReload', '移除');
                            }else {
                                that.$message.error(msg);
                            }
                        })
                        .catch();
                }else if(this.childPageName == '品牌分组') {
                    let params = {
                        "userId" : this.userInfo.userCode,
                        "id": this.childData.id,
                    }
                    removeGroupBrand(params)
                        .then(res => {
                            let data = JSON.parse(Base64.decode(res.data)),
                                code = data.messageType,
                                msg = data.messageContent,
                                val = data.valueObj;
                            if(code === 'SUCCESS') {
                                that.$message.success(msg);
                                that.$emit('childReload', '移除');
                            }else {
                                that.$message.error(msg);
                            }
                        })
                        .catch();
                }
            });
        },
        // 是否在APP中显示
        handleWhether () {
            this.isShow = !this.isShow;
        },
        // 编辑
        handleEdit () {
            if(this.childPageName == '品牌分组') {
                this.$router.push({
                    name: '品牌分组-系统分析',
                    params: {
                        pageType: '编辑',
                        pageName: this.childPageName,
                        formData: JSON.stringify(this.childData)
                    }
                });
            }
        },
        // 共享
        handleShare () {
            let that = this;
            // console.log('共享');
            if(this.childPageName === '我的分组') {
                // console.log(this.childData);
                let params = {
                    "userId": this.userInfo.userCode,
                    "id": this.childData.id,
                    "groupId": this.childData.groupId,
                    "groupName": this.childData.groupName,
                    isAppShow: this.childData.isAppShow
                }
                // console.log(params);
                shareGroupMine(params)
                    .then(res => {
                        let data = JSON.parse(Base64.decode(res.data)),
                            code = data.messageType,
                            msg = data.messageContent,
                            val = data.valueObj;
                        if(code === 'SUCCESS') {
                            that.$message.success(msg);
                            that.$emit('childReload', '共享');
                        }else {
                            that.$message.error(msg);
                        }
                        
                    })
                    .catch();
            }
        },
    },
    created() {
        // 钩子函数 -- 初始化
//         console.log(JSON.stringify(this.childData));
    },
    computed: {
        // 计算属性
        ...mapGetters([
            'userInfo',
        ]),
        setImg () {
            if(this.childData.groupType == '所有分组' || this.childData.groupType == '预置分组') {
                return fenzu1
            }else if (this.childData.groupType == '品牌分组') {
                return fenzu2
            }else if (this.childData.groupType == '共享分组' || this.childData.groupType == '我的分组') {
                return fenzu3
            }
        },
        cardHeaderBg () {
            if(this.childData.groupType == '所有分组' || this.childData.groupType == '预置分组') {
                return {
                    'background': '#00a0e9'
                }
            }else if (this.childData.groupType == '品牌分组') {
                return {
                    'background': '#22ac38'
                }
            }else if (this.childData.groupType == '共享分组' || this.childData.groupType == '我的分组') {
                return {
                    'background': '#f39800'
                }
            }

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
.card {
    // width: rem(300px);
    background: #FFF;
    border-radius: rem(8px);
    margin-bottom: rem(42px);
    // overflow: hidden;
    box-shadow: rem(2px) rem(2px) rem(9px) rgba(0, 0, 0, 0.22);
    .card-header {
        position: relative;
        width: 100%;
        height: rem(45px);
        border-top-left-radius: rem(8px);
        border-top-right-radius: rem(8px);
        .icon {
            position: absolute;
            left: rem(15px);
            top: rem(-2px);
            width: rem(50px);
            height: rem(50px);
        }
        .name {
            margin-left: rem(79px);
            height: rem(45px);
            line-height: rem(45px);
            font-size: 16px;
            color: #FFF;
        }
        .icon-setting {
            position: absolute;
            top: rem(11px);
            right: rem(17px);
            // width: rem(24px);
            // height: rem(21px);
            cursor: pointer;
            img {
                width: rem(24px);
                height: rem(21px);
            }
        }
    }
    .card-container {
        display: flex;
        justify-content: space-between;
        height: rem(95px);
        .num {
            width: rem(218px);
            height: rem(95px);
            line-height: rem(95px);
            margin-left: rem(15px);
            font-size: rem(30px);
            i {
                font-style: normal;
                font-size: rem(20px);
            }
        }
        .app-radio-info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: rem(80px);
            height: rem(93px);
            margin: rem(1px);
            span {
                display: inline-block;
                background: #f6f6f6;
            }
            .app-radio {
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                width: rem(80px);
                height: rem(46px);
                line-height: rem(46px);
                text-align: center;
                .app-text {
                    position: absolute;
                    left: rem(20px);
                    font-size: rem(10px);
                    z-index: 99;
                    font-style: normal;
                    color: #FFF;
                }
            }
            .app-info {
                width: rem(80px);
                height: rem(46px);
                line-height: rem(46px);
                font-size: rem(14px);
                color: #a0a0a0;
                text-align: center;
                cursor: pointer;
                .app-info-card {
                    max-height: rem(200px);
                    overflow: scroll;
                }
            }
        }
    }
    .el-tooltip__popper[x-placement^="bottom"] .popper__arrow {
        border-bottom-color: rgba(0, 0, 0, 0.6)!important;
    }
    .el-tooltip__popper[x-placement^="bottom"] .popper__arrow::after {
        border-bottom-color: rgba(0, 0, 0, 0.6)!important;
    }
    .el-tooltip__popper.is-dark {
        background: rgba(0, 0, 0, 0.6)!important;
    }
}

</style>
