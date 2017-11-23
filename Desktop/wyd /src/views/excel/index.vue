<template>
	<div class="app-container calendar-list-container">
		<div class="filter-container">
			<el-select clearable style="width: 160px" class="filter-item" v-model="listQuery.circuit" placeholder="线路">
				<el-option v-for="item in circuitOptions" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>

			<el-select clearable style="width: 160px" class="filter-item" v-model="listQuery.station" placeholder="站名">
				<el-option v-for="item in stationOptions" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
			<el-select clearable style="width: 160px" class="filter-item" v-model="listQuery.area" placeholder="工区">
				<el-option v-for="item in areaOptions" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
			<el-select clearable style="width: 160px" class="filter-item" v-model="listQuery.contractor" placeholder="承包人">
				<el-option v-for="item in contractorOptions" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
			<el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索选择的数据</el-button>

			<el-select @change='handleFilter' style="width: 120px margin-left:120px;" class="filter-item" v-model="listQuery.sort" placeholder="排序">
				<el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
				</el-option>
			</el-select>
			<el-button style="margin-left:9px;" class="filter-item" type="primary" icon="document" @click="handleDownload">导出设备数据表</el-button>
		</div>
		<el-table :data='currentList' border height="610">
			<!-- <el-table-column width="120%" align="center" label="ID">
				<template scope="scope">
						{{scope.row.facility_category.id}}
				</template>
			</el-table-column> -->
			<el-table-column width="190" prop="name" label="设备名称">
			</el-table-column>
			<el-table-column width="80" align="center" label="月维修计划">
				<template scope="scope">
					<div @click="showDialog_month(scope.row.facility_category.id)" class="remont">
						月计划
					</div>
				</template>
			</el-table-column>
			<el-table-column width="80" align="center" label="年维修计划">
				<template scope="scope">
					<div @click="showDialog(scope.row.facility_category.id)" class="remont">
						年计划
					</div>
				</template>
			</el-table-column>
			<el-table-column width="120" align="center" label="设备类型">
				<template scope="scope">		
						{{scope.row.facility_category.name}}
				</template>
			</el-table-column>
			<el-table-column width="117" align="center" prop="facility_category.id" label="设备编号">
			</el-table-column> 
			<el-table-column width="117" align="center" prop="number" label="设备编号">
			</el-table-column> 
			<el-table-column width="110" align="center" prop="department" label="项目部">
			</el-table-column>
			<el-table-column width="80" align="center" prop="circuit" label="线路">
			</el-table-column>
			<el-table-column width="110" prop="area" align="center" label="工区">
			</el-table-column>
			<el-table-column width="80" align="center" prop="station" label="站点">
			</el-table-column>
			<el-table-column width="100" align="center" prop="distribution" label="设备分布">
			</el-table-column>
			<el-table-column width="80" align="center" prop="replacement_cycle" label="更换周期">
			</el-table-column>
			<el-table-column width="120" align="center" prop="active_date" label="启用时间">
			</el-table-column>
			<el-table-column width="80" align="center" prop="contractor" label="承包人">
			</el-table-column>
		</el-table>

		<el-dialog title="年维修计划" :visible.sync="dialogTableVisible" :fullscreen="true"  size="large" width="100%" >
			<el-table :data='message_shebei' border height="310">
				<el-table-column width="170" prop="project" label="检修项目">
				</el-table-column>
				<el-table-column width="147" align="center" prop="standard" label="检修标准">
				</el-table-column>
				<el-table-column width="100" align="center" prop="facility_category.repair_cycle" label="维修周期">
				</el-table-column>
				<el-table-column width="70" align="center" prop="data.1月" label="1月">
				</el-table-column>
				<el-table-column width="70" align="center" prop="data.2月" label="2月">
				</el-table-column>
				<el-table-column width="70" align="center" prop="data.3月" label="3月">
				</el-table-column>
				<el-table-column width="70" align="center" prop="data.4" label="4月">
				</el-table-column>
				<el-table-column width="70" align="center" prop="data.5月" label="5月">
				</el-table-column>
				<el-table-column width="70" align="center" prop="data.7月" label="6月">
				</el-table-column>
				<el-table-column width="70" align="center" prop="data.6月" label="7月">
				</el-table-column>
				<el-table-column width="70" align="center" prop="data.8月" label="8月">
				</el-table-column>
				<el-table-column width="70" align="center" prop="data.9月" label="9月">
				</el-table-column>
				<el-table-column width="70" align="center" prop="data.10月" label="10月">
				</el-table-column>
				<el-table-column width="70" align="center" prop="data.11月" label="11月">
				</el-table-column>
				<el-table-column width="70" align="center" prop="data.12月" label="12月">
				</el-table-column>				
			</el-table>
		</el-dialog>
		<el-dialog title="月维修计划" :visible.sync="dialogTableVisible1" :fullscreen="true"  size="large" width="100%" >
			<el-table :data='message_shebei_month' border height="310">
					<el-table-column width="170" prop="project" label="检修项目">
					</el-table-column>
					<el-table-column width="147" align="center" prop="standard" label="检修标准">
					</el-table-column>
					<el-table-column width="90" align="center" prop="facility_category.repair_cycle" label="维修周期">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.1" label="1">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.2" label="2">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.3" label="3">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.4" label="4">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.5" label="5">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.7" label="6">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.6" label="7">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.8" label="8">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.9" label="9">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.10" label="10">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.11" label="11">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.12" label="12">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.13" label="13">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.14" label="14">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.15" label="15">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.17" label="16">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.16" label="17">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.18" label="18">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.19" label="19">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.20" label="20">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.21" label="21">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.22" label="22">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.23" label="23">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.24" label="24">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.25" label="25">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.27" label="26">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.26" label="27">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.28" label="28">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.29" label="29">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.30" label="30">
					</el-table-column>
					<el-table-column width="70" align="center" prop="data.31" label="31">
					</el-table-column>
								
				</el-table>
		</el-dialog>

		<div v-show="listLoading" class="pagination-container">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
			    :page-sizes="[60]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
import waves from "@/directive/waves/index.js"; // 水波纹指令
import { parseTime } from "@/utils";

export default {
  name: "table_demo",
  directives: {
    waves
  },
  data() {
    return {
      list: [],
      message_shebei: [],
      message_shebei_month: [],
      a: "1",
      url: null,
      acilitycategory: [],
      currentList: [],
      row: "",

      total: null,
      name1: [],
      dialogTableVisible: false,
      dialogTableVisible1: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px",
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 300,
        sort: "+id",
        area: null,
        circuit: null,
        contractor: null,
        department: null,
        distribution: null,
        facility_category: null,
        id: null,
        name: null,

        replacement_cycle: null,
        station: null,
        totalPage: 1
      },

      circuitOptions: [],
      areaOptions: [],
      contractorOptions: [],
      departmentOptions: [],
      distributionOptions: [],
      facility_categoryOptions: [],
      nameOptions: [],
      stationOptions: [],
      sortOptions: [
        {
          label: "按ID升序列",
          key: "+id"
        },
        {
          label: "按ID降序",
          key: "-id"
        }
      ]
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  created() {
    this.getList();
    this.getType();
  },
  methods: {
    showDialog(msg) {
      this.dialogTableVisible = true;

      axios
        .get("/api/maintain_schedules?facility_category_id=" + msg)
        .then(data1 => {
          this.message_shebei = data1["data"]["maintain_schedules"];
          //   alert(this.message_shebei);
        })
        .catch(e => {
          console.log(e);
        });
    },
    showDialog_month(msg) {
      this.dialogTableVisible1 = true;

      axios
        .get(
          "/api/maintain_schedules?facility_category_id=" +
            msg +
            "&type_cd=month"
        )
        .then(data1 => {
          this.message_shebei_month = data1["data"]["maintain_schedules"];
          //   alert(this.message_shebei);
        })
        .catch(e => {
          console.log(e);
        });
    },
    getList() {
      this.listLoading = true;
      axios
        .get("api/facilities?page=" + this.listQuery.page)
        .then(data1 => {
          this.list = data1["data"]["facilities"];
          //   this.acilitycategory =
          //     data1["data"]["facilities"]["12"]["facility_category"]["id"];
          //   alert(this.acilitycategory);
          // console.log(this.list);
          this.currentList = this.list;
          this.total = data1["data"]["meta"]["count"];
          this.name1 = data1["data"]["facilities"][""]["facility_category"];
          // console.log(this.name1);
        })
        .catch(e => {
          console.log(e);
        });
    },
    getType() {
      this.listLoading = true;
      axios
        .get("/api/enums?type=types")
        .then(data1 => {
          this.areaOptions = data1["data"]["areas"];
          this.circuitOptions = data1["data"]["circuits"];
          this.contractorOptions = data1["data"]["contractors"];
          this.contractorOptions = data1["data"]["contractors"];
          this.stationOptions = data1["data"]["stations"];
          console.log(this.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    handleFilter() {
      this.listLoading = true;
      var url = "api/facilities";
      if (
        this.listQuery.station != null ||
        this.listQuery.circuits != null ||
        this.listQuery.contractor != null ||
        this.listQuery.area != null
      ) {
        url = url + "?";
      }
      if (this.listQuery.area !== null && this.listQuery.area !== "") {
        url = url + "&area=" + this.listQuery.area;
      }
      if (
        this.listQuery.contractor !== null &&
        this.listQuery.contractor !== ""
      ) {
        url = url + "&contractor=" + this.listQuery.contractor;
      }
      if (this.listQuery.circuit !== null && this.listQuery.circuit !== "") {
        url = url + "&circuit=" + this.listQuery.circuit;
      }
      if (this.listQuery.station !== null && this.listQuery.station !== "") {
        url = url + "&station=" + this.listQuery.station;
      }
      decodeURI(url);

      alert(url);
      axios
        .get(url)
        .then(data1 => {
          this.list = data1["data"]["facilities"];
          this.currentList = this.list;
        })
        .catch(e => {
          console.log(e);
        });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 0,
        remark: "",
        timestamp: 0,
        title: "",
        status: "published",
        type: ""
      };
    },
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("vendor/Export2Excel");
        const tHeader = [
          "序号",
          "设备编号",
          "设备类型",
          "项目部",
          "线路",
          "工区",
          "站点",
          "设备分布",
          "更换周期",
          "启用时间",
          "承包人",
          "备注"
        ];
        const filterVal = [
          "id",
          "number",
          "name",
          "area",
          "circuit",
          "department",
          "station",
          "distribution",
          "replacement_cycle",
          "active_date",

          "contractor"
        ];
        const data = this.formatJson(filterVal, this.list);
        export_json_to_excel(tHeader, data, "table数据");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
<style>
.remont {
  color: blue;
}
.dialog {
  width: 1900px;
  float: auto;
}
</style>

