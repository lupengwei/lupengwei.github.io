<!-- 大风天气 -->
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
          content: '各类室外高空作业停止，严禁在易倾倒设备、临时搭建物等下方逗留，加强室外行车设备检查、巡视，持续跟进大风天气影响最新进展和变'
        }, {
          name: '黄色预警',
          content: '室外作业停止，人员进入室内安全环境躲避，加强室外行车设备检查、巡视，持续跟进大风天气影响最新进展和变'
        }, {
          name: '橙色预警',
          content: '高架、地面停运区段车站临时关站、接触网停电，加强室外行车设备检查、巡视，持续跟进大风天气影响最新进展和变'
        }, {
          name: '红色预警',
          content: '高架、地面停运区段车站临时关站、接触网停电，加强室外行车设备检查、巡视，持续跟进大风天气影响最新进展和变'
        }]
      }
    },
    mounted() {
      document.title = '大风天气';
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