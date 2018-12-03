<template>
    <el-container class="app-container">
        <div id="qrcode" ref="qrcode"></div>
        <div class="marginTop10">{{qrcodeUrl}}</div>
        <div class="marginTop10">右击-图片另存为，可以保存二维码</div>
  </el-container>
</template>
<script>
// getComponentLoginPageUrl
// import { showQrcode } from '@/api/base/brandInfo'
import { mapGetters } from 'vuex'
import QRCode from 'qrcodejs2' // 二维码生成器
export default {
    data() {
        return {
            // 数据

        }
    },
    props: ['qrcodeUrl'],
    methods: {
        // 方法
        qrcode () {  // 生成二维码
        	$("#qrcode").html("");
            let qrcode = new QRCode(this.$refs.qrcode, {  
                width: 200,  
                height: 200, // 高度  
                text: '', // 二维码内容  
                render: 'canvas', // 设置渲染方式（有两种方式 table和canvas，默认是canvas）  
                background: '#f0f',  
                foreground: '#ff0'
            }) 
            qrcode.clear();
            qrcode.makeCode(this.qrcodeUrl);
        },
    },
    created() {
        // 钩子函数 -- 初始化
//      this.$nextTick(() => {
//      	this.qrcode();  
//      });
    },
    mounted () {  
        // this.qrcode(); 
        const that = this;
        setTimeout(function() {
            // that.$refs.qrcodeUrl.dispatchEvent(new MouseEvent('click')); 
        }, 1000);
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
.app-container {
    width: 100%;
    display: flex;
    flex-direction: column ;
    align-items: center;
}
.qrcodeStr {
	float: left;
    font-size: 16px;
    color:#555;
    margin-bottom: 10px;
}

#qrcode {
    width: 200px;
    height: 200px;
}
.marginTop10{
	margin-top: 10px;
}
</style>