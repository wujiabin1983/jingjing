<template>
  <el-row class="panel-group" :gutter="16">
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="salejine" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">粉丝<br />数量</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="100000" :duration="2600"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="salejine" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">会员<br/>数量</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="8000" :duration="3000"></count-to>
          <div class="card-panel-progress">
            <div class="card-panel-progress-bg">
              <span class="card-panel-progress-pro card-panel-progress-b" style="width: 60%;"></span>
            </div>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="salejine" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">入会<br />已消费</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="1600" :duration="3200"></count-to>
          <div class="card-panel-progress">
            <div class="card-panel-progress-bg">
              <span class="card-panel-progress-pro card-panel-progress-c" style="width: 20%;"></span>
            </div>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <svg-icon icon-class="salejine" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">入会<br />未消费</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="6400" :duration="3600"></count-to>
          <div class="card-panel-progress">
            <div class="card-panel-progress-bg">
              <span class="card-panel-progress-pro card-panel-progress-d" style="width: 80%;"></span>
            </div>
          </div>
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
    margin-bottom: 16px;
  }
  .card-panel {
    border-radius: 8px;
    height: 85px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
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
    .icon-people {
      color: #2ec7c9;
    }
    .icon-message {
      color: #b6a2d4;
    }
    .icon-money {
      color: #5ab1ef;
    }
    .icon-shoppingCard {
      color: #ffb980
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 0;
      padding: 5px;
      transition: all 0.38s ease-out;
      --border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 75px;
    }
    .card-panel-description {
      float: left;
      font-weight: bold;
      margin-top: 25px;
      margin-left: 5px;
      margin-right: 3px;
      .card-panel-text {
        width: 55px;
        float: left;
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 10px;
        margin-bottom: 5px;
      }
      .card-panel-num {
        margin-top: 5px;
        font-size: 20px;
        float: right;
      }
      .card-panel-progress {
        margin-top: 40px;
        width: 135px;
        height: 8px;
        --background: yellow;
        position: relative;
        .card-panel-progress-bg {
          position: absolute;
          z-index: 1001;
          float: left;
          width: 100%;
          height: 6px;
          margin: 0;
          background: #ebebeb;
          border-left: 1px solid transparent;
          border-right: 1px solid transparent;
          border-radius: 10px;
          overflow: hidden;
          .card-panel-progress-pro {
            position: absolute;
            z-index: 1002;
            float: left;
            margin: 0 -1px;
            height: 6px;
            text-align: right;
            background: #cccccc;
            border-radius: 10px;
          }
          .card-panel-progress-b {
            background: #b6a2d4;
          }
          .card-panel-progress-c {
            background: #5ab1ef;
          }
          .card-panel-progress-d {
            background: #ffb980;
          }
        }
      }
    }
  }
}
</style>
