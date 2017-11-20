<!-- 折叠面板（仅查看） -->
<template>
  <div>
    <div class="fh-panel-header" @click="handleSwitchPanel">
      {{datas.name}}
      <span v-if="isOpen" class="icon icon-up fh-right-icon"></span>
      <span v-else class="icon icon-right fh-right-icon"></span>
    </div>
    <transition name="fade">
      <div v-if="isOpen" class="fh-panel-content">{{datas.content}}</div>
    </transition>
  </div>
</template>

<script type="text/javascript">
  export default {
    props: ['datas'],
    data() {
      return {
        isOpen: false
      }
    },
    mounted() {
    },
    methods: {
      handleSwitchPanel() {
        this.isOpen = !this.isOpen;
      }
    }
  }
</script>

<style scoped lang="less">
  .fh-panel-header {
    border-top: 1px solid #E6E6E6;
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    position: relative;
    color: #000;
    &:active {
      background-color: #E6E6E6;
      transition: .8s;
    }
    .fh-right-icon {
      position: absolute;
      top: 0;
      right: 15px;
    }
  }
  .fh-panel-content {
    padding: 5px 15px;
    color: #666;
  }
</style>