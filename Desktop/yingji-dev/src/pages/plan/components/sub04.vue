<!-- 高温预警 -->
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
          name: '黄色预警',
          content: '白天10-16时尽量减少烈日下作业，室外作业时应戴上草帽，配备饮用水和防暑药品，做好防中暑措施，强设备巡查，掌握生产区域的高温环境，防止高温过热引发的设备故障'
        }, {
          name: '橙色预警',
          content: '白天10-16时尽量减少烈日下作业，室外作业时应戴上草帽，配备饮用水和防暑药品，做好防中暑措施，强设备巡查，掌握生产区域的高温环境，防止高温过热引发的设备故障'
        }, {
          name: '红色预警',
          content: '白天10-16时停止烈日下作业，强设备巡查，掌握生产区域的高温环境，防止高温过热引发的设备故障'
        }]
      }
    },
    mounted() {
      document.title = '高温预警';
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