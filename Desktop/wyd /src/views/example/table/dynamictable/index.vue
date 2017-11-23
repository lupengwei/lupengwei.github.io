<template>
  <div class="app-container">
    <upload-excel @on-selected-file='selected'></upload-excel>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:10px;">
      <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
      </el-table-column>
    </el-table>
     <el-button style="margin-top:30px;float:right;" type="primary" @click="open2">点击ewrfwr上传</el-button>
      
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
        tempObj["project"] = data["检修项目"];
        tempObj["standard"] = data["检修标准"];
        tempObj["data"] = {
          "1月": data["1月"],
          "2月": data["2月"],
          "3月": data["3月"],
          "4月": data["4月"],
          "5月": data["5月"],
          "6月": data["6月"],
          "7月": data["7月"],
          "8月": data["8月"],
          "9月": data["9月"],
          "10月": data["10月"],
          "11月": data["11月"],
          "12月": data["12月"]
        };
        tempObj["type_cd"] = "year";
        tempObj["remark"] = data["备注"];
        tempObj["facility_category"] = {
          repair_cycle: data["周期"],
          name: data["设备"]
        };

        tempArr.push(tempObj);
      });
      axios
        .post("api/maintain_schedules/batch_create", {
          maintain_schedules: tempArr
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
