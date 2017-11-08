<template>
  <div class="app-container calendar-list-container">
      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题" v-model="listQuery.title">
        </el-input>

        <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.importance" placeholder="重要性">
          <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>

        <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="类型">
          <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
          </el-option>
        </el-select>

        <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>

        <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>

        <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
        <el-checkbox class="filter-item" @change='tableKey=tableKey+1' v-model="showAuditor">显示审核人</el-checkbox>
      </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
       <el-table-column min-width="60px" label="标题">
        <template scope="scope">
        
          <el-tag>{{scope.row.type | typeFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="开始时间">
        <template scope="scope">
          <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
       <el-table-column width="180px" align="center" label="结束时间">
        <template scope="scope">
          <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-form-item label="状态">
          <el-select class="filter-item" v-model="temp.status">
            <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>

      <el-table-column width="110px" align="center" label="创建人">
        <template scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="90">
        <template scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>

    </el-table>
     <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    

  </div>
</template>

<script>
import { fetchList, fetchPv } from "@/api/article";
import waves from "@/directive/waves/index.js"; // 水波纹指令
import { parseTime } from "@/utils";

const calendarTypeOptions = [
  { key: "CN", display_name: "七号线" },
  { key: "US", display_name: "八号线" },
  { key: "JP", display_name: "九号线" },
  { key: "EU", display_name: "十号线" }
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
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id"
      },
      temp: {
        id: undefined,
        importance: 0,
        remark: "",
        timestamp: 0,
        title: "",
        type: "",
        status: "published"
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: "按ID升序列", key: "+id" },
        { label: "按ID降序", key: "-id" }
      ],
      statusOptions: ["未开始", "已完成", "已延期"],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },
      dialogPvVisible: false,
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
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
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

    update() {
      this.temp.timestamp = +this.temp.timestamp;
      for (const v of this.list) {
        if (v.id === this.temp.id) {
          const index = this.list.indexOf(v);
          this.list.splice(index, 1, this.temp);
          break;
        }
      }
      this.dialogFormVisible = false;
      this.$notify({
        title: "成功",
        message: "更新成功",
        type: "success",
        duration: 2000
      });
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
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("vendor/Export2Excel");
        const tHeader = ["时间11", "地区", "类型", "标题", "重要性"];
        const filterVal = [
          "timestamp",
          "province",
          "type",
          "title",
          "importance"
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
