<template>
  <div class="app-container">
    <upload-excel @on-selected-file='selected'></upload-excel>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:10px;">
      <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
      </el-table-column>
    </el-table>
     <el-button style="margin-top:30px;float:right;" type="primary" @click="open2">点击上传</el-button>
      
  </div>
</template>

<script>
import uploadExcel from "components/UploadExcel/index.vue";

export default {
  components: { uploadExcel },
  data() {
    return {
      tableData: [],
      tableHeader: []
    };
  },
  created() {
    // aa(this.tableData);
    // axios
    //   .get("api/facilities")
    //   .then(function(response) {
    //     console.log(response);
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //   });
  },

  methods: {
    selected(data) {
      this.tableData = data.results;
      this.tableHeader = data.header;
      let tempArr = [];
      this.tableData.map(data => {
        let tempObj = {};
        tempObj["name"] = data["设备名称"];
        tempObj["department"] = data["项目部"];
        tempObj["circuit"] = data["线路"];
        tempObj["area"] = data["工区"];
        tempObj["station"] = data["站点"];
        tempObj["distribution"] = data["设备分布"];
        tempObj["replacement_cycle"] = data["更换周期"];
        tempObj["active_date"] = data["启用时间"];
        tempObj["contractor"] = data["承包人"];
        tempObj["facility_category"] = {
          name: data["设备"]
        };
        tempArr.push(tempObj);
      });
      axios
        .post("api/facilities/batch_create", {
          facilities: tempArr
          // [
          //   {
          //     name: 2,
          //     department: null,
          //     circuit: null,
          //     area: null,
          //     station: null,
          //     distributio: null,
          //     replacement_cycle: null,
          //     active_date: null,
          //     contracto: null,
          //     facility_category: {
          //       name: "111",
          //       repair_cycle: null,
          //       remark: null
          //     }
          //   }
          // ]
        })
        .then(data1 => {
          console.log(data1);
        })
        .catch(e => {
          console.log(e);
        });
      // console.log(axios)
    },

    open2() {
      this.$confirm("此操作将永久导入该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "成功导入!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消！请修改！！"
          });
        });
    }
  }
};
</script>
