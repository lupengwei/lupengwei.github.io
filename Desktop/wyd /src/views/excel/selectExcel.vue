<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
    
      <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.importance" placeholder="重要性">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.circuit" placeholder="线路">
        <el-option v-for="item in circuitOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

       <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.station" placeholder="站名">
        <el-option v-for="item in stationOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
       <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.station" placeholder="站名">
        <el-option v-for="item in stationOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
       <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.station" placeholder="站名">
        <el-option v-for="item in stationOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      

      <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
      
    </div>
    <el-table :data='currentList' border  height="250">
      <!-- <el-table-column type="selection" align="center"></el-table-column> -->

      <el-table-column align="center"prop="id"  label="序号" width="55">
       
      </el-table-column>
  
      <el-table-column width="80" prop="name" label="设备名称">
  
      </el-table-column>

      <el-table-column width="80" align="center"prop="number"  label="设备编号">
       
      </el-table-column>

      <el-table-column width="80" align="center"prop="facility_category.name"  label="设备类型">
       
      </el-table-column>

      <el-table-column width="110" align="center"prop="department"  label="项目部">
        
      </el-table-column>

      <el-table-column width="80" align="center"prop="circuit"  label="线路">
       
      </el-table-column>

      <el-table-column width="110" prop="area"  align="center"  label="工区">
       
      </el-table-column>

       <el-table-column width="80" align="center"prop="station"  label="站点">
       
      </el-table-column>

      <el-table-column width="80" align="center"prop="distribution"  label="设备分布">
       
      </el-table-column>

      <el-table-column width="80" align="center"prop="replacement_cycle"  label="更换周期">
       
      </el-table-column>

      <el-table-column width="122" align="center"prop="active_date"  label="启用时间">
       
      </el-table-column>

      <el-table-column width="80" align="center"prop="contractor"  label="承包人">
        
      </el-table-column>

      <!-- <el-table-column class-name="status-col" label="状态" width="90">
        <template scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center"prop=""  label="操作" width="150">
        <template scope="scope">
          <el-button v-if="scope.row.status!='published'" size="small" type="success" @click="handleModifyStatus(scope.row,'published')">发布
          </el-button>
          <el-button v-if="scope.row.status!='draft'" size="small" @click="handleModifyStatus(scope.row,'draft')">草稿
          </el-button>
          <el-button v-if="scope.row.status!='deleted'" size="small" type="danger" @click="handleModifyStatus(scope.row,'deleted')">删除
          </el-button>
        </template>
      </el-table-column> -->

    </el-table>


    <div v-show="listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 60]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="类型">
          <el-select class="filter-item" v-model="temp.type" placeholder="请选择">
            <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select class="filter-item" v-model="temp.status" placeholder="请选择">
            <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时间">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="标题">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>

        <el-form-item label="重要性">
          <el-rate style="margin-top:8px;" v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
        </el-form-item>

        <el-form-item label="点评">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="temp.remark">
          </el-input>
        </el-form-item>
      </el-form>
     
    </el-dialog> -->

    <!-- <el-dialog title="阅读数统计" :visible.sync="dialogPvVisible" size="small">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="渠道"> </el-table-column>
        <el-table-column prop="pv" label="pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->

  </div>
</template>

<script>
import { fetchList, fetchPv } from "@/api/article";
import waves from "@/directive/waves/index.js"; // 水波纹指令
import { parseTime } from "@/utils";

const calendarTypeOptions = [
  { key: "CN", display_name: "中国" },
  { key: "US", display_name: "美国" },
  { key: "JP", display_name: "日本" },
  { key: "EU", display_name: "欧元区" }
];

// arr to obj
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "table_demo",
  directives: {
    waves
  },
  data() {
    return {
      list: [],
      currentList: [],
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        circuit: undefined,
        title: undefined,
        type: undefined,
        sort: "+id",
        area: undefined,
        circuit: undefined,
        contractor: undefined,
        department: undefined,
        distribution: undefined,
        facility_category: undefined,
        id: undefined,
        name: undefined,
        number: undefined,
        replacement_cycle: undefined,
        station: undefined,
        totalPage: 1
      },
      temp: {
        id: undefined,
        importance: 0,
        circuit: "",
        remark: "",
        timestamp: 0,
        title: "",
        type: "",
        status: "发布",
        area: undefined,
        circuit: undefined,
        contractor: undefined,
        department: undefined,
        distribution: undefined,
        facility_category: undefined,
        id: undefined,
        name: undefined,
        number: undefined,
        replacement_cycle: undefined,
        station: undefined
      },
      importanceOptions: [1, 2, 3],
      circuitOptions: ["北京7号线", "北京14号线"],
      calendarTypeOptions,
      areaOptions: [],
      contractorOptions: [],
      departmentOptions: [],
      distributionOptions: [],
      facility_categoryOptions: [],
      idOptions: [],
      nameOptions: [],
      numberOptions: [],
      replacement_cycleOptions: [],
      stationOptions: ["湾子站", "北京西站"],
      sortOptions: [
        { label: "按ID升序列", key: "+id" },
        { label: "按ID降序", key: "-id" }
      ],
      statusOptions: ["发布", "draft", "deleted"],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },
      pvData: [],
      showAuditor: false,
      tableKey: 0
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
    // this.getChoseList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      axios
        .get("api/facilities")
        .then(data => {
          this.list = data["data"]["facilities"];
          this.currentList = this.list;
          this.total = currentList.data.meta.count;
          console.log(this.currentList);
        })
        .catch(e => {
          console.log(e);
        });
    },
    // getChoseList() {
    //   this.listLoading = true;
    //   axios
    //     .get("/api/enums?type=types")
    //     .then(data => {
    //       this.circuitOptions = data["data"][stations];

    //       console.log(this.circuitOptions);
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // },

    handleFilter() {
      this.listQuery.page = 1;
      this.currentList = this.list.filter(data => {
        return data.station == this.listQuery.station;
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
    timeFilter(time) {
      if (!time[0]) {
        this.listQuery.start = undefined;
        this.listQuery.end = undefined;
        return;
      }
      this.listQuery.start = parseInt(+time[0] / 1000);
      this.listQuery.end = parseInt((+time[1] + 3600 * 1000 * 24) / 1000);
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success"
      });
      row.status = status;
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
    handleDelete(row) {
      this.$notify({
        title: "成功",
        message: "删除成功",
        type: "success",
        duration: 2000
      });
      const index = this.list.indexOf(row);
      this.list.splice(index, 1);
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
    // handleFetchPv(pv) {
    //   fetchPv(pv).then(currentList => {
    //     this.pvData = response.data.pvData;
    //     this.dialogPvVisible = true;
    //   });
    // },
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("vendor/Export2Excel");
        const tHeader = [
          "序号",
          "设备名称",
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
          "department",
          "circuit",
          "area",
          "station",
          "distribution",
          "replacement_cycle",
          "active_date",
          "contractor",
          "facility_category.name",
          "facility_category.repair_cycle"
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
