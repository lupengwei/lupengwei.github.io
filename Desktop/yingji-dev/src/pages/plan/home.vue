<template>
  <div>
    <div class="row">
      <div class="col-33">
        <router-link to="/plan/sub01">
          <div class="fh-grids-box fh-button">
            <i class="iconfont icon-drops" />
            <div class="fh-text">防汛预警</div>
          </div>
        </router-link>
      </div>
      <div class="col-33">
        <router-link to="/plan/sub02">
        <div class="fh-grids-box fh-button">
          <i class="iconfont icon-yujing1" />
          <div class="fh-text">突发事件</div>
        </div>
        </router-link>
      </div>
      <div class="col-33">
        <router-link to="/plan/sub03">
        <div class="fh-grids-box fh-button">
          <i class="iconfont icon-leidian" />
          <div class="fh-text">雷电预警</div>
        </div>
        </router-link>
      </div>
    </div>
    <div class="row">
      <div class="col-33">
        <router-link to="/plan/sub04">
        <div class="fh-grids-box fh-button">
          <i class="iconfont icon-gaowen" />
          <div class="fh-text">高温预警</div>
        </div>
        </router-link>
      </div>
      <div class="col-33">
        <router-link to="/plan/sub05">
        <div class="fh-grids-box fh-button">
          <i class="iconfont icon-bingbao" />
          <div class="fh-text">冰雹天气 </div>
        </div>
        </router-link>
      </div>
      <div class="col-33">
        <router-link to="/plan/sub06">
        <div class="fh-grids-box fh-button">
          <i class="iconfont icon-gale" />
          <div class="fh-text">大风天气</div>
        </div>
        </router-link>
      </div>
    </div>
    <div class="row">
      <div class="col-33">
        <router-link to="/plan/sub07">
        <div class="fh-grids-box fh-button">
          <i class="iconfont icon-dizhen" />
          <div class="fh-text">地震预警</div>
        </div>
        </router-link>
      </div>
      <div class="col-33">
        <router-link to="/plan/sub08">
        <div class="fh-grids-box fh-button">
          <i class="iconfont icon-bingxue" />
          <div class="fh-text">冰雪天气预警 </div>
        </div>
        </router-link>
      </div>
      <div class="col-33">
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    data() {
      return {
      }
    },
    mounted() {
      document.title = '应急预案';
    },
    methods: {

    },
    components: {
    }
  }
</script>

<style scoped lang="less">
  .row {
    margin: 0;
  }
  .col-33 {
    margin: 0;
    width: 33%;
  }
  .fh-grids-box {
    margin: 0 auto;
    width: 100px;
    height: 100px;
    padding-top: 10px;
    text-align: center;
  }
  .iconfont {
    font-size: 36px;
  }
  .fh-text {
    color: #000;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .fh-button:active {
    background-color: #3EB7F6;
    transition: .2s;
    color: #FFF;
    border-radius: 5px;
    .fh-text {
      color: #FFF;
    }
  }
</style>