<template>
  <el-row class="panel-group" :gutter="8">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-kedan">
          <svg-icon icon-class="kedan" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">同 
              <svg-icon icon-class="gao" class-name="card-panel-icon-green" />
          <font style='color:#555;'>10%</font></div>
          <div class="card-panel-text">环 
              <svg-icon icon-class="di" class-name="card-panel-icon-red" />
          <font style='color:#555;'>-5%</font></div>
        </div>
        <div class="card-panel-description1">
          <div class="card-panel-text">客单价</div>
          <div class="card-panel-num">￥899</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-jiandan">
          <svg-icon icon-class="jiandan" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">同
            <svg-icon icon-class="di" class-name="card-panel-icon-red" />
            <font style='color:#555;'>-3%</font>
          </div>
          <div class="card-panel-text">环
            <svg-icon icon-class="di" class-name="card-panel-icon-red" />
            <font style='color:#555;'>-5%</font>
          </div>
        </div>
        <div class="card-panel-description1">
          <div class="card-panel-text">件单价</div>
          <div class="card-panel-num">￥599</div>
        </div>

      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-liandai">
          <svg-icon icon-class="liandai" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">同
            <svg-icon icon-class="gao" class-name="card-panel-icon-green" />
            <font style='color:#555;'>2%</font>
          </div>
          <div class="card-panel-text">环
            <svg-icon icon-class="di" class-name="card-panel-icon-red" />
            <font style='color:#555;'>-3%</font>
          </div>
        </div>
        <div class="card-panel-description1">
          <div class="card-panel-text">连带率</div>
          <div class="card-panel-num">1.7</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-zeko">
          <svg-icon icon-class="zeko" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">同
            <svg-icon icon-class="di" class-name="card-panel-icon-red" />
            <font style='color:#555;'>-5%</font>
          </div>
          <div class="card-panel-text">环
            <svg-icon icon-class="gao" class-name="card-panel-icon-green" />
            <font style='color:#555;'>7%</font>
          </div>
        </div>
        <div class="card-panel-description1">
          <div class="card-panel-text">折扣</div>
          <div class="card-panel-num">88%</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 0px;
  .card-panel-col{
    margin-bottom: 8px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper .svg-icon{
        color: #fff;
      }
      .icon-kedan {
         background: #d87a80;
      }
      .icon-jiandan {
        background: #8d98b3;
      }
      .icon-liandai {
        background: #e5cf0d;
      }
      .icon-zeko {
        background: #97b552;
      }
    }
    .icon-kedan .svg-icon{
      color: #d87a80;
    }
    .icon-jiandan .svg-icon{
      color: #8d98b3;
    }
    .icon-liandai .svg-icon{
      color: #e5cf0d;
    }
    .icon-zeko .svg-icon{
      color: #97b552
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      width: 40px;
      height: 40px;
      float: left;
      font-size: 32px;
    }
    .card-panel-icon-red {
      margin-left: 5px;
      color: #f56c6c;
      width: 13px;
      height: 13px;
    }
    .card-panel-icon-green {
      margin-left: 5px;
      color: #67c23a;
      width: 13px;
      height: 13px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 12px;
      }
    }
    .card-panel-description1 {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 16px;
      }
    }
  }
}
</style>
