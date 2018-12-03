<template>
  <el-row class="panel-group">
    <el-col class="card-panel-col card-panel-width">
      <div class='card-panel card-panel-bg-1' @click="handleSetLineChartData('newVisitis')" style="margin-left: 0px;">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="salejine" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">流失会员</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="102400" :duration="2600"></count-to>
        </div>
      </div>
    </el-col>
    <el-col class="card-panel-col card-panel-width">
      <div class="card-panel card-panel-bg-2" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="huiyuan" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">预流会员</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="81212" :duration="3000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col class="card-panel-col card-panel-width">
      <div class="card-panel card-panel-bg-3" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="suliang" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">睡眠会员</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="9280" :duration="3200"></count-to>
        </div>
      </div>
    </el-col>
    <el-col class="card-panel-col card-panel-width">
      <div class="card-panel card-panel-bg-4" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="dansu" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">沉默会员</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="13600" :duration="3600"></count-to>
        </div>
      </div>
    </el-col>
    <el-col class="card-panel-col card-panel-width">
      <div class="card-panel card-panel-bg-5" @click="handleSetLineChartData('shoppings')" style="margin-right: 0px;">
        <div class="card-panel-icon-wrapper">
          <svg-icon icon-class="dansu" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">活跃会员</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="13600" :duration="3600"></count-to>
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
  .card-panel-width{
    width: 20%;
  }
  .card-panel-bg-1{
    background: #58c386;
  }
  .card-panel-bg-2{
    background: #45b6e1;
  }
  .card-panel-bg-3{
    background: #7d7ab6;
  }
  .card-panel-bg-4{
    background: #f06088;
  }
  .card-panel-bg-5{
    background: #f39c12;
  }
  .card-panel {
    margin: 4px;
    height: 90px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    .card-panel-icon-wrapper {
      background: rgba(255, 255, 255, 0.3);
      float: right;
      margin: 0;
      padding: 9px;
      --opacity: 0.5;
      transition: all 0.38s ease-out;
      --border-radius: 6px;
    }
    .card-panel-icon {
      color: #fff;
      float: right;
      font-size: 72px;
      opacity: 1;
    }
    .card-panel-description {
      float: left;
      font-weight: bold;
      margin-left: 10px;
      margin-top: 10px; 
      .card-panel-text {
        line-height: 18px;
        color: rgba(255, 255, 255, 1);
        font-size: 14px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
        color: rgba(255, 255, 255, 1);
      }
    }
  }
}
</style>
