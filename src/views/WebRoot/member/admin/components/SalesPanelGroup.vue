<template>
  <el-row class="panel-group" :gutter="8">
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="salejine" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">销售金额(元)</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="102400" :duration="2600"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="huiyuan" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">会员贡献(元)</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="81212" :duration="3000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="suliang" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">销售数量</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="9280" :duration="3200"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <svg-icon icon-class="dansu" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">交易单数</div>
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
      .icon-people {
         background: #2ec7c9;
      }
      .icon-message {
        background: #b6a2d4;
      }
      .icon-money {
        background: #5ab1ef;
      }
      .icon-shoppingCard {
        background: #ffb980;
      }
    }
    .icon-people .svg-icon{
      color: #2ec7c9;
    }
    .icon-message .svg-icon{
      color: #b6a2d4;
    }
    .icon-money .svg-icon{
      color: #5ab1ef;
    }
    .icon-shoppingCard .svg-icon{
      color: #ffb980
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 0;
      padding: 16px;
      transition: all 0.38s ease-out;
      --border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 75px;
    }
    .card-panel-description {
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
        font-size: 20px;
      }
    }
  }
}
</style>
