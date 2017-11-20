<template>
  <div class="content">
    <div class="content-block">
      <div class="row">
        <div class="col-33 fh-list-left">
          <i class="iconfont icon-zhinan" />
        </div>
        <div class="col-66 fh-list-right">
          <a class="button button-fill">处理指南</a>
        </div>
      </div>
      <div class="row">
        <div class="col-33 fh-list-left">
          <i class="iconfont icon-yujing" />
        </div>
        <div class="col-66 fh-list-right">
          <router-link to="/plan">
            <a class="button button-fill">应急预案</a>
          </router-link>
        </div>
      </div>
      <div class="row">
        <div class="col-33 fh-list-left">
          <i class="iconfont icon-shoucang" />
        </div>
        <div class="col-66 fh-list-right">
          <a class="button button-fill">我的收藏</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

  export default {
    data () {
      return {
      }
    },
    mounted() {
      document.title = '故障处理指南';
    },
    components: {
    }
  }
</script>

<style scoped lang="less">
  .fh-list-left {
    text-align: right;
    padding-right: 10%;
  }
  .fh-list-right {
    padding-top: 10px;
    .button {
      height: 40px;
      line-height: 40px;
    }
  }
  .row {
    margin: 25px;
    .iconfont {
      font-size: 40px;
      color: #2982D2;
    }
  }
</style>
