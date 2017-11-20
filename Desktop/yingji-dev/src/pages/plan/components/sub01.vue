<!-- 防汛预警 -->
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
          name: '蓝色预警',
          content: '中心领导、中心值班领导（抢险队长）视情况赶赴现场，安技室安质管理、轮值工程师（当日）、相应区域包保工班长60分钟内赶赴现场，相应区域应急抢险队、应急值守人员30分钟内赶赴现场'
        }, {
          name: '黄色预警',
          content: '中心领导、相应区域应急抢险队视情况赶赴现场，中心值班领导担任（抢险队长）、轮值工程师（当日）、相应区域包保工班长待命，安技室安质管理随时待命，应急值守人员立即响应。'
        }, {
          name: '橙色预警',
          content: '中心领导、中心值班领导（抢险队长）、安技室安质管理、轮值工程师（当日）、相应区域包保工班长30分钟内赶赴现场，相应区域应急抢险队、应急值守人员30分钟内赶赴现场。'
        }, {
          name: '红色预警',
          content: '中心领导、中心值班领导（抢险队长）、安技室安质管理、轮值工程师（当日）、相应区域包保工班长30分钟内赶赴现场，相应区域应急抢险队、应急值守人员30分钟内赶赴现场。'
        }]
      }
    },
    mounted() {
      document.title = '防汛预警';
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