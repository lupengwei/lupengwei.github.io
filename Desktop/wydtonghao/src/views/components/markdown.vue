<template>
  <div class="container">
    <div class="button-group">
      <el-button type="primary" icon="edit" @click="dialogFormVisible = true">添加一条记录</el-button>
      <el-button class="filter-item" type="primary" icon="document" >导出</el-button>
      <el-button style="margin-top:0px;float:right;" :loading="loading" type="primary" @click="open">点击上传创建信息</el-button>
 
    </div>
   <el-table :data='message_shebei' border height="610">
          <el-table-column width="170" prop="plan_date" label="计划时间">
					</el-table-column>
     	    <el-table-column width="170" prop="facility_category.name" label="设备">
					</el-table-column>
					<el-table-column width="170" prop="project" label="检修项目">
					</el-table-column>
					<el-table-column width="147" align="center" prop="standard" label="检修标准">
					</el-table-column>
					<el-table-column width="90" align="center" prop="facility_category.repair_cycle" label="维修周期">
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
          <el-table-column width="70" align="center" prop="remark" label="备注">
					</el-table-column>
				</el-table>
    <!-- 模态框表单 -->
    <el-dialog title="新增年表维修计划记录" :visible.sync="dialogFormVisible" size="large">
      <el-form :model="formDatas">
        
        <el-col :span="6">
          <el-form-item label="设备类型" :label-width="formLabelWidth">
          <el-select v-model="formDatas.type" placeholder="请选择类型">
            <el-option label="车载电台设备" value="车载电台设备" />
            <el-option label="列检库DCS网管子系统设备" value="列检库DCS网管子系统设备" />
            <el-option label="列检库配电箱（柜）" value="列检库配电箱（柜）" />
            <el-option label="列检库电源设备" value="列检库电源设备" />
            <el-option label="车载设备" value="车载设备" />
          </el-select>
       </el-form-item>
		   </el-col>
        <el-col :span="6">
          <el-form-item label="检修项目" :label-width="formLabelWidth">
          <el-select v-model="formDatas.project" placeholder="请选择类型">
            <el-option label="车载机柜及分盘、继电器清扫测试检查" value="车载机柜及分盘、继电器清扫测试检查" />
            <el-option label="人机界面清扫测试检查" value="人机界面清扫测试检查" />
            <el-option label="无线天线清扫测试检查" value="无线天线清扫测试检查" />
            <el-option label="测速电机清扫测试检查" value="测速电机清扫测试检查" />
            <el-option label="多普勒清扫测试检查" value="多普勒清扫测试检查" />
          </el-select>
       </el-form-item>
		   </el-col>
        <el-col :span="6">
          <el-form-item label="检修标准" :label-width="formLabelWidth">
          <el-select v-model="formDatas.standard" placeholder="请选择类型">
            <el-option label="按检修作业程序及技术标准" value="按检修作业程序及技术标准" />
            
          </el-select>
       </el-form-item>
		   </el-col>
        <el-col :span="6">
          <el-form-item label="1月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_1" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
       </el-form-item>
		   </el-col>
        <el-col :span="6">
          <el-form-item label="2月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_2" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
       </el-form-item>
		   </el-col>
        <el-col :span="6">
          <el-form-item label="3月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_3" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
       </el-form-item>
		   </el-col>
        <el-col :span="6">
          <el-form-item label="4月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_4" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
       </el-form-item>
		   </el-col>
        <el-col :span="6">
          <el-form-item label="5月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_5" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
       </el-form-item>
		   </el-col>
        <el-col :span="6">
          <el-form-item label="6月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_6" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
       </el-form-item>
		   </el-col>
        <el-col :span="6">
          <el-form-item label="7月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_7" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
       </el-form-item>
		   </el-col>
        <el-col :span="6">
          <el-form-item label="8月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_8" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
       </el-form-item>
		   </el-col>
        <el-col :span="6">
          <el-form-item label="9月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_9" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
       </el-form-item>
		   </el-col>
        <el-col :span="6">
          <el-form-item label="10月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_10" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
       </el-form-item>
		   </el-col>
        <el-col :span="6">
          <el-form-item label="11月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_11" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
       </el-form-item>
		   </el-col>
        <el-col :span="6">
          <el-form-item label="12月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_12" placeholder="请选择类型">
            <el-option label="*" value="*"/>
            <el-option label=" " value=" "/>
          </el-select>
       </el-form-item>
		   </el-col>
        
		   </el-col>
        <el-col :span="6">
          <el-form-item label="维护周期" :label-width="formLabelWidth">
          <el-select v-model="formDatas.cycle" placeholder="请选择维护周期">
            <el-option label="每季度一次" value="每季度一次" />
            <el-option label="每半年一次" value="每半年一次" />
            <el-option label="每年一次" value="每年一次" />
            <el-option label="随厂修车计划" value="随厂修车计划" />
            <el-option label="根据需要" value="根据需要" />
          </el-select>
       </el-form-item>
		   </el-col>
        <el-col :span="24">
          <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="formDatas.remarks" auto-complete="off"></el-input>
       </el-form-item>
		   </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit(formDatas)">确 定</el-button>
      </div>
    </el-dialog>
    <div v-show="listLoading" class="pagination-container">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
			    :page-sizes="[60]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
  </div>
</template>
<script type="text/javascript">
import axios from 'axios'
import uploadExcel from "components/UploadExcel/index.vue";
import _ from "lodash";
export default {
  components: { uploadExcel },
  data() {
    return {
      dataSources: [],

      total: null,
      loading: false,
      message_shebei: [],
      tableData: [],
      tableHeader: [],
      dataColumns: [],
      dialogFormVisible: false,

      formLabelWidth: "120px",
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 300
      },
      formDatas: {
        project: "",
        standard: "",
        month_1: "",
        month_2: "",
        month_3: "",
        month_4: "",
        month_5: "",
        month_6: "",
        month_7: "",
        month_8: "",
        month_9: "",
        month_10: "",
        month_11: "",
        month_12: "",
        contractor: "",
        time: "",
        cycle: "",
        remarks: ""
      }
    };
  },
  created() {
    this.handleInitTable();
    this.showDialog();
  },
  methods: {
    handleSubmit(data) {
      this.dialogFormVisible = false;
      let tempObj = {};
      tempObj["name"] = data["type"];
      tempObj["project"] = data["project"];
      tempObj["standard"] = data["standard"];
      tempObj["data"] = {
        "1月": data["month_1"],
        "2月": data["month_2"],
        "3月": data["month_3"],
        "4月": data["month_4"],
        "5月": data["month_5"],
        "6月": data["month_6"],
        "7月": data["month_7"],
        "8月": data["month_8"],
        "9月": data["month_9"],
        "10月": data["month_10"],
        "11月": data["month_11"],
        "12月": data["month_12"]
      };
      tempObj["type_cd"] = "year";
      tempObj["remark"] = data["remarks"];
      tempObj["facility_category"] = {
        repair_cycle: data["cycle"],
        name: data["type"]
      };
      axios
        .post("api/maintain_schedules", {
          maintain_schedules: tempObj
        })
        .then(data1 => {
          console.log(data1);
        })
        .catch(e => {
          console.log(e);
        });
      // console.log(axios)
    },
    showDialog() {
      axios
        .get(
          "/api/maintain_schedules?page=" +
            this.listQuery.page +
            "&type_cd=year"
        )
        .then(data1 => {
          this.message_shebei = data1["data"]["maintain_schedules"];
          this.total = data1["data"]["meta"]["count"];

          // alert(this.message_shebei);
        })
        .catch(e => {
          console.log(e);
        });
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.showDialog();
    },
    tabClick(val) {
      this.a = val;
      // var ual = "/api/maintain_schedules";
    },
    open(data) {
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
    },

    handleInitTable() {
      // 设置默认初始数据，可为空
      let tempTableDatas = [
        {
          type: " ",
          project: "",
          standard: "",
          month_1: " ",
          month_2: " ",
          month_3: " ",
          month_4: " ",
          month_5: " ",
          month_6: " ",
          month_7: " ",
          month_8: " ",
          month_9: " ",
          month_10: " ",
          month_11: " ",
          month_12: " ",
          contractor: " ",
          time: " ",
          cycle: " ",
          remarks: " "
        }
      ];
      // 设置列
      let tempDataColumns = [
        // {
        //   title: "序号",
        //   name: "index"
        // },

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
          title: "1月",
          name: "month_1"
        },
        {
          title: "2月",
          name: "month_2"
        },
        {
          title: "3月",
          name: "month_3"
        },
        {
          title: "4月",
          name: "month_4"
        },
        {
          title: "5月",
          name: "month_5"
        },
        {
          title: "6月",
          name: "month_6"
        },
        {
          title: "7月",
          name: "month_7"
        },
        {
          title: "8月",
          name: "month_8"
        },
        {
          title: "9月",
          name: "month_9"
        },
        {
          title: "10月",
          name: "month_10"
        },
        {
          title: "11月",
          name: "month_11"
        },
        {
          title: "12月",
          name: "month_12"
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
      console.log(this.dataColumns);
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
    // handleSubmit(values) {
    //   // 表单提交处理
    //   let tempDatas = _.cloneDeep(this.dataSources); // 获取现有数据
    //   let tempJson = _.cloneDeep(values);
    //   tempJson.index = tempDatas.length + 1;
    //   tempDatas.push(tempJson);
    //   this.dataSources = tempDatas;
    //   console.log(this.tempDatas);
    //   this.dialogFormVisible = false;
    //   this.handleMessage("提交成功！");

    // },
    handleMessage(value) {
      // 封装的提示
      this.$message({
        showClose: true,
        message: value
      });
    },
    selected(data) {
      this.tableData = data.results;
      this.tableHeader = data.header;
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