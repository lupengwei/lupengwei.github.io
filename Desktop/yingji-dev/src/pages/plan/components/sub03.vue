<!-- 雷电预警 -->
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
          content: '雷电黄色预警，切断危险电源，严禁在树下、电线杆下、塔吊下避雨，严禁在空旷场地打伞，严禁把设备、工器具等扛在肩上，严禁接触天线、水管、铁丝网、金属门窗、建筑物外墙等，尽量不使用或远离无防雷装置或者防雷装置不完备带电设备和其他类似金属装置，中心各专业做好支援准备，注意防御雷电灾害，接报OCC支援命令时，立即组织人员、应急物资赶赴指定位置参与处置。'
        }, {
          name: '橙色预警',
          content: '停止露天高空作业，中心各专业做好支援准备，注意防御雷电灾害，接报OCC支援命令时，立即组织人员、应急物资赶赴指定位置参与处置。'
        }, {
          name: '红色预警',
          content: '停止所有露天作业，人员尽量躲入有防雷设施的建筑物内，中心各专业做好支援准备，注意防御雷电灾害，接报OCC支援命令时，立即组织人员、应急物资赶赴指定位置参与处置。'
        }]
      }
    },
    mounted() {
      document.title = '雷电预警';
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