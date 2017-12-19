<template>
    <div>
      <el-menu theme="#13CE66":default-active="activeIndex2" class="el-menu-demo" mode="horizontal">
        <el-menu-item @click="tabClick(1)"index="1">年表</el-menu-item>
        <el-menu-item @click="tabClick(2)"index="2">月表</el-menu-item>
      </el-menu>
      <div v-if="a == 1" >
        <!-- <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.importance" placeholder="重要性">
          <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
          </el-option>
        </el-select> -->

        <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="线路">
          <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
          </el-option>
        </el-select>
           <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="工区">
          <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
          </el-option>
        </el-select>
           <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="设备">
          <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
          </el-option>
        </el-select>

        <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>

          <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">点击查找</el-button>

          <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
        
        <el-table  border :key='tableKey' :data="list"  border fit highlight-current-row style="width: 100%">

          <el-table-column align="center" label="序号" width="65">
            <template scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="60px" label="修订内容">
            <template scope="scope">
            
              <el-tag>{{scope.row.type | typeFilter}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="center" label="时间">
            <template scope="scope">
              <span>{{scope.row.timestamp}}</span>
            </template>
          </el-table-column>
          <el-form-item width="110px" align="center" label="修订内容">
              <el-select class="filter-item" v-model="temp.status">
                <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          <el-table-column width="110px" align="center" label="修订人">
            <template scope="scope">
              <span>{{scope.row.author}}</span>
            </template>
          </el-table-column>

        </el-table>
      </div>
      <div v-if="a == 2" >
        月表
      </div>
    </div>
</template>

<script>
export default {
  name: "table_demo",
  // directives: {
  //   waves
  // },
  data() {
    return {
      list: null,
      total: null,
      a: 1,
      a: 1,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        valuebanci: "",
        valuepeople: "",
        valuestade: "",
        valuegongqu: "",
        valuenianbaio: "",
        valuezuoye: "",
        valueyuebiao: "",
        valueshebei: "",
        banci: [
          {
            value: "选项1",
            label: "甲班"
          },
          {
            value: "选项2",
            label: "乙班"
          },
          {
            value: "选项3",
            label: "丙班"
          },
          {
            value: "选项4",
            label: "日勤"
          },
          {
            value: "选项5",
            label: "替岗"
          }
        ],
        nowstate: [
          {
            value: "选项1",
            label: "是"
          },
          {
            value: "选项2",
            label: "否"
          }
        ],
        gongqu: [
          {
            value: "选项1",
            label: "第6综合维修部"
          },
          {
            value: "选项2",
            label: "第7综合维修部"
          },
          {
            value: "选项3",
            label: "第8综合维修部"
          },
          {
            value: "选项4",
            label: "第9综合维修部"
          },
          {
            value: "选项5",
            label: "第3车维修部"
          }
        ],
        shebei: [
          {
            value: "选项1",
            label: "室内设备"
          },
          {
            value: "选项2",
            label: "室外设备"
          },
          {
            value: "选项3",
            label: "车载设备"
          }
        ],
        zuoye: [
          {
            value: "选项1",
            label: "是"
          },
          {
            value: "选项2",
            label: "否"
          }
        ],
        people: [
          {
            value: "选项1",
            label: "陈媛"
          },
          {
            value: "选项2",
            label: "王悦"
          },
          {
            value: "选项3",
            label: "崔岩"
          },
          {
            value: "选项4",
            label: "张子航"
          },
          {
            value: "选项5",
            label: "韩宝国"
          },
          {
            value: "选项6",
            label: "齐鑫"
          },
          {
            value: "选项7",
            label: "赵宇飞"
          },
          {
            value: "选项8",
            label: "高远"
          },
          {
            value: "选项9",
            label: "秦鹏"
          },
          {
            value: "选项10",
            label: "李笑阳"
          },
          {
            value: "选项11",
            label: "刘冠辰"
          }
        ],
        stade: [
          {
            value: "选项1",
            label: "是"
          },
          {
            value: "选项2",
            label: "否"
          }
        ],

        selectedOptions: [],
        selectedOptions2: [],
        sort: "+id"
      },
      temp: {
        id: undefined,
        importance: 0,
        remark: "",
        timestamp: 0,
        title: "",
        type: "",
        status: "一个月"
      },
      importanceOptions: [1, 2, 3],
      statusOptions: ["三个月", "一个月", "一年"],
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
        this.list = [];
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    tabClick(val) {
      this.a = val;
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
    create() {
      this.temp.id = parseInt(Math.random() * 100) + 1024;
      this.temp.timestamp = +new Date();
      this.temp.author = "原创作者";
      this.list.unshift(this.temp);
      this.dialogFormVisible = false;
      this.$notify({
        title: "成功",
        message: "创建成功",
        type: "success",
        duration: 2000
      });
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
        const tHeader = [
          "线路",
          "类型",
          "工作项目",
          "检查工作项目",
          "1月",
          "2月",
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
