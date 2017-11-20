<!-- 突发事件 -->
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
          name: 'Ⅳ级突发事件',
          content: '中心领导、中心值班领导（抢险队长）视情况赶赴现场，安技室安质管理、轮值工程师（当日）、相应区域包保工班长60分钟内赶赴现场，相应区域应急抢险队、应急值守人员30分钟内赶赴现场'
        }, {
          name: 'Ⅲ级突发事件',
          content: '中心领导，中心值班领导（抢险队长）立即赶赴现场，车间主任立即赶赴现场并组织车间所有人员全部上岗，安技室安质管理、相应区域包保工班长60分钟内赶赴现场，相应区域应急抢险队、轮值工程师（当日）、应急值守人员30分钟内赶赴现场'
        }, {
          name: 'Ⅱ级突发事件',
          content: '中心领导视情况赶赴现场，中心值班领导（抢险队长）立即赶赴现场，安技室安质管理、轮值工程师（当日）、相应区域包保工班长60分钟内赶赴现场，相应区域应急抢险队、应急值守人员30分钟内赶赴现场'
        }, {
          name: 'Ⅰ级突发事件',
          content: '中心领导，中心值班领导（抢险队长）立即赶赴现场，车间主任立即赶赴现场并组织车间所有人员全部上岗，安技室安质管理、相应区域包保工班长60分钟内赶赴现场，相应区域应急抢险队、轮值工程师（当日）、应急值守人员30分钟内赶赴现场'
        }]
      }
    },
    mounted() {
      document.title = '突发事件';
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