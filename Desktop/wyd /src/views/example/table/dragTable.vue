]
<template>
	<div class="container">
    	<div class="button-group">
				<!-- <el-button class="filter-item" type="primary" icon="document">导出</el-button> -->
      <el-button style="margin-top:0px;float:right;" :loading="loading" type="primary" @click="open2">点击上传添加月表信息</el-button>
		</div>
		
			<!-- 模态框表单 -->
	
    <upload-excel @on-selected-file='selected'></upload-excel>
		<el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
			<el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
			</el-table-column>
		</el-table>
	</div>
</template>
<script type="text/javascript">
import uploadExcel from "components/UploadExcel/index.vue";
import _ from "lodash";
export default {
  components: {
    uploadExcel
  },
  data() {
    return {
      loading: false,
      dataSources: [],
      tableData: [],
      tableHeader: [],
      dataColumns: [],
      dialogFormVisible: false,
      formLabelWidth: "80px",
      formDatas: {
        line: "",
        type: "",
        project: "",
        standard: "",
        day_1: "",
        day_2: "",
        day_3: "",
        day_4: "",
        day_5: "",
        day_6: "",
        day_7: "",
        day_8: "",
        day_9: "",
        day_10: "",
        day_11: "",
        day_12: "",
        day_13: "",
        day_14: "",
        day_15: "",
        day_16: "",
        day_17: "",
        day_18: "",
        day_19: "",
        day_20: "",
        day_21: "",
        day_22: "",
        day_23: "",
        day_24: "",
        day_25: "",
        day_26: "",
        day_27: "",
        day_28: "",
        day_29: "",
        day_30: "",
        day_31: "",
        contractor: "",
        time: "",
        cycle: "",
        remarks: ""
      }
    };
  },
  created() {
    this.handleInitTable();
  },
  methods: {
    selected(data) {
      console.log("ddd");
      console.log(this.tableData);
      this.tableData = data.results;
      this.tableHeader = data.header;
      let tempArr = [];
      this.tableData.map(data => {
        let tempObj = {};
        tempObj["name"] = data["设备名称"];
        tempObj["project"] = data["检修项目"];
        tempObj["standard"] = data["检修标准"];
        tempObj["data"] = {
          "1": data["1"],
          "2": data["2"],
          "3": data["3"],
          "4": data["4"],
          "5": data["5"],
          "6": data["6"],
          "7": data["7"],
          "8": data["8"],
          "9": data["9"],
          "10": data["10"],
          "11": data["11"],
          "12": data["12"],
          "13": data["13"],
          "14": data["14"],
          "15": data["15"],
          "16": data["16"],
          "17": data["17"],
          "18": data["18"],
          "19": data["19"],
          "20": data["20"],
          "21": data["21"],
          "22": data["22"],
          "23": data["23"],
          "24": data["24"],
          "25": data["25"],
          "26": data["26"],
          "27": data["27"],
          "28": data["28"],
          "29": data["29"],
          "30": data["30"],
          "31": data["31"]
        };
        tempObj["facility_category"] = {
          repair_cycle: data["周期"],
          name: data["设备"]
        };
        tempObj["type_cd"] = "month";
        tempObj["remark"] = data["备注"];
        tempArr.push(tempObj);
        console.log(this.tempArr);
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
      console.log(axios);
    },
    handleInitTable() {
      // 设置默认初始数据，可为空
      let tempTableDatas = [
        {
          index: "",
          line: " ",
          type: " ",
          project: "",
          standard: "",
          day_1: "",
          day_2: "",
          day_3: "",
          day_4: "",
          day_5: "",
          day_6: "",
          day_7: "",
          day_8: "",
          day_9: "",
          day_10: "",
          day_11: "",
          day_12: "",
          day_13: "",
          day_14: "",
          day_15: "",
          day_16: "",
          day_17: "",
          day_18: "",
          day_19: "",
          day_20: "",
          day_21: "",
          day_22: "",
          day_23: "",
          day_24: "",
          day_25: "",
          day_26: "",
          day_27: "",
          day_28: "",
          day_29: "",
          day_30: "",
          day_31: "",
          contractor: " ",
          time: " ",
          cycle: " ",
          remarks: " "
        }
      ];
      // 设置列
      let tempDataColumns = [
        {
          title: "序号",
          name: "index"
        },
        {
          title: "线路",
          name: "line"
        },
        {
          title: "设备",
          name: "type"
        },
        {
          title: "检修项目",
          name: "project"
        },
        {
          title: "检修标准",
          name: "standard"
        },
        {
          title: "1",
          name: "day_1"
        },
        {
          title: "2",
          name: "day_2"
        },
        {
          title: "3",
          name: "day_3"
        },
        {
          title: "4",
          name: "day_4"
        },
        {
          title: "5",
          name: "day_5"
        },
        {
          title: "6",
          name: "day_6"
        },
        {
          title: "7",
          name: "day_7"
        },
        {
          title: "8",
          name: "day_8"
        },
        {
          title: "9",
          name: "day_9"
        },
        {
          title: "10",
          name: "day_10"
        },
        {
          title: "11",
          name: "day_11"
        },
        {
          title: "12",
          name: "day_12"
        },
        {
          title: "13",
          name: "day_13"
        },
        {
          title: "14",
          name: "day_14"
        },
        {
          title: "15",
          name: "day_15"
        },
        {
          title: "16",
          name: "day_16"
        },
        {
          title: "17",
          name: "day_17"
        },
        {
          title: "18",
          name: "day_18"
        },
        {
          title: "19",
          name: "day_19"
        },
        {
          title: "20",
          name: "day_20"
        },
        {
          title: "21",
          name: "day_21"
        },
        {
          title: "22",
          name: "day_22"
        },
        {
          title: "23",
          name: "day_23"
        },
        {
          title: "24",
          name: "day_24"
        },
        {
          title: "25",
          name: "day_25"
        },
        {
          title: "26",
          name: "day_26"
        },
        {
          title: "27",
          name: "day_27"
        },
        {
          title: "28",
          name: "day_28"
        },
        {
          title: "29",
          name: "day_29"
        },
        {
          title: "30",
          name: "day_30"
        },
        {
          title: "31",
          name: "day_31"
        },

        {
          title: "承包人",
          name: "contractor"
        },
        {
          title: "维护周期",
          name: "cycle"
        },
        {
          title: "备注",
          name: "remarks"
        }
      ];
      this.dataColumns = tempDataColumns;
      this.dataSources = tempTableDatas;
    },
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("vendor/Export2Excel");
        const tHeader = [
          "线路",
          "类型",
          "工作项目",
          "检查项目",
          "1月",
          "2月",
          "3月",
          "4月",
          "1月",
          "1月",
          "1月",
          "1月",
          "1月",
          "1月",
          "1月",
          "1月",
          "1月",
          "1月",
          "周期",
          ""
        ];
        const filterVal = [
          "timestamp",
          "province",
          "type",
          "title",
          "importance"
        ];
        export_json_to_excel(tHeader, filterVal, " ");
      });
    },
    handleSubmit(values) {
      // 表单提交处理
      let tempDatas = _.cloneDeep(this.dataSources); // 获取现有数据
      let tempJson = _.cloneDeep(values);
      tempJson.index = tempDatas.length + 1;
      tempDatas.push(tempJson);
      this.dataSources = tempDatas;
      this.dialogFormVisible = false;
      this.handleMessage("提交成功！");
    },
    handleMessage(value) {
      // 封装的提示
      this.$message({
        showClose: true,
        message: value
      });
    },
    // selected(data) {
    // 	this.tableData = data.results;
    // 	this.tableHeader = data.header;
    // },
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
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      setTimeout(() => {
        loading.close();
      }, 1000);
    }
  }
};
</script>
<style scoped>
.container {
  padding: 15px;
}

.button-group {
  margin-bottom: 10px;
}
</style>
