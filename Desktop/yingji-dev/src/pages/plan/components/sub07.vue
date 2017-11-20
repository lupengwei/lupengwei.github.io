<!-- 地震预警 -->
<template>
  <div>
    <nv-only-view-collapse-panel v-for="(item, key) in datas" :key="key" :datas="item" />
  </div>
</template>

<script type="text/javascript">
  export default {
    data() {
      return {
        datas: [{
          name: 'Ⅲ级突发事件',
          content: '三级地震响应以注意观察为主，一般不采取紧急处置措施。'
        }, {
          name: 'Ⅱ级突发事件',
          content: '二级地震响应以列车限速（25km/h）运行、设备加强巡视为主，重点岗位人员到岗待命，必要时采取抢修、抢险措施。'
        }, {
          name: 'Ⅰ级突发事件',
          content: '一级地震响应以停运、清客为主，各级人员到岗或赶赴现场，全面开展抢救、抢险及设备恢复。'
        }]
      }
    },
    mounted() {
      document.title = '地震预警';
    },
    methods: {

    },
    components: {
      'nvOnlyViewCollapsePanel': require('../../../components/onlyViewCollapsePanel')
    }
  }
</script>

<style scoped lang="less">

</style>