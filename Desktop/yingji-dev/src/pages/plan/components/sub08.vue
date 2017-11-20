<!-- 冰雪天气预警 -->
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
          name: '冰雪天气',
          content: '白天10-16时尽量减少烈日下作业，室外作业时应各部门加强室外行车设备检查、巡视，持续跟进冰雪天气影响最新进展和变化，视情况发布抢修、抢险指令，组织相关抢险队伍赶赴现场处置'
        }]
      }
    },
    mounted() {
      document.title = '冰雪天气预警';
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