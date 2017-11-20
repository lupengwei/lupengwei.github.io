<!-- 冰雹天气 -->
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
          name: '橙色预警',
          content: '白天10-16时尽量减少烈日下作业，室外作业时应做好防雹和防雷电准备，应妥善安置易受冰雹影响的室外物品、设备等，中心组织各车间加强室外行车设备检查、巡视，持续跟进冰雹天气影响最新进展和变化，接到抢修、抢险指令，组织相关抢险队伍赶赴现场处置'
        }, {
          name: '红色预警',
          content: '户外作业人员应立即到安全的地方暂避，中心组织各车间加强室外行车设备检查、巡视，持续跟进冰雹天气影响最新进展和变化，接到抢修、抢险指令，组织相关抢险队伍赶赴现场处置'
        }]
      }
    },
    mounted() {
      document.title = '冰雹天气';
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