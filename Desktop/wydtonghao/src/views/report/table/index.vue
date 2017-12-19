<template>
  <div class="container">
    <div class="button-group">
      <el-button type="primary" icon="edit" @click="dialogFormVisible = true">添加一条月表记录</el-button>
      <el-button class="filter-item" type="primary" icon="document" >导出</el-button>
    </div>
    <el-table   border 
      :data="dataSources"
      style="width: 100%">
      <el-table-column align="center" v-for="(item, key) in dataColumns" key="key" :prop="item.name" :label="item.title" >
      </el-table-column>
    </el-table>
    <el-button style="margin-top:30px;float:right;"  type="primary" @click="open2">点击上传创建信息</el-button>
   
    <!-- 模态框表单 -->
    <el-dialog title="新增维修计划记录" style="width:100%;" :visible.sync="dialogFormVisible">
      <el-form :model="formDatas">
        <el-form-item label="线路" :label-width="formLabelWidth">
          <el-select v-model="formDatas.line" placeholder="请选择线路">
            <el-option label="北京7号线" value="北京7号线" />
            <el-option label="北京14号线" value="北京14号线" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备" :label-width="formLabelWidth">
          <el-select v-model="formDatas.type" placeholder="请选择类型">
            <el-option label="车载电台设备" value="车载电台设备" />
            <el-option label="列检库DCS网管子系统设备" value="列检库DCS网管子系统设备" />
            <el-option label="列检库配电箱（柜）" value="列检库配电箱（柜）" />
            <el-option label="列检库电源设备" value="列检库电源设备" />
            <el-option label="车载设备" value="车载设备" />
          </el-select>
        </el-form-item>
        <el-form-item label="检修项目" :label-width="formLabelWidth">
          <el-select v-model="formDatas.project" placeholder="请选择类型">
            <el-option label="车载机柜及分盘、继电器清扫测试检查" value="车载机柜及分盘、继电器清扫测试检查" />
            <el-option label="人机界面清扫测试检查" value="人机界面清扫测试检查" />
            <el-option label="无线天线清扫测试检查" value="无线天线清扫测试检查" />
            <el-option label="测速电机清扫测试检查" value="测速电机清扫测试检查" />
            <el-option label="多普勒清扫测试检查" value="多普勒清扫测试检查" />
          </el-select>
        </el-form-item>
        <el-form-item label="检修标准" :label-width="formLabelWidth">
          <el-select v-model="formDatas.standard" placeholder="请选择类型">
            <el-option label="按检修作业程序及技术标准" value="按检修作业程序及技术标准" />
            
          </el-select>
        </el-form-item>
        <el-form-item label="1" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_1" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="2" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_2" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="3" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_3" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="4" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_4" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="5" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_5" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="6" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_6" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="7" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_7" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="8" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_8" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="9" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_9" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="10" :label-width="formLabelWidth">
          <el-select v-model="formDatas.mday10" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="11" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_11" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="12" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_12" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="13" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_13" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="14" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_14" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="15" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_15" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="16" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_16" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="17" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_17" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="18" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_18" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="19" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_19" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="20" :label-width="formLabelWidth">
          <el-select v-model="formDatas.mday_20" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="21" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_21" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="22" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_22" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="23" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_23" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="24" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_24" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="25" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_25" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="26" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_26" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="27" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_27" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="28" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_28" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="29" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_29" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="30" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_10" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="31" :label-width="formLabelWidth">
          <el-select v-model="formDatas.day_31" placeholder="请选择是否检修">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="承包人" :label-width="formLabelWidth">
          <el-select v-model="formDatas.contractor" placeholder="请选择承包人">
            <el-option label="陈媛" value="陈媛" />
            <el-option label="王悦" value="王悦" />
            <el-option label="崔岩" value="崔岩" />
            <el-option label="张子航" value="张子航" />
            <el-option label="杭宝国" value="杭宝国" />
            <el-option label="齐鑫" value="齐鑫" />
            <el-option label="赵宇飞" value="赵宇飞" />
            <el-option label="高远" value="高远" />
            <el-option label="秦鹏" value="秦鹏" />
            <el-option label="李笑阳" value="李笑阳" />
            <el-option label="刘冠辰" value="刘冠辰" />
          </el-select>
        </el-form-item>
        <el-form-item label="维护周期" :label-width="formLabelWidth">
          <el-select v-model="formDatas.cycle" placeholder="请选择维护周期">
            <el-option label="每季度一次" value="每季度一次" />
            <el-option label="每半年一次" value="每半年一次" />
            <el-option label="每年一次" value="每年一次" />
            <el-option label="随厂修车计划" value="随厂修车计划" />
            <el-option label="根据需要" value="根据需要" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="formDatas.remarks" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit(formDatas)">确 定</el-button>
      </div>
    </el-dialog>
    <upload-excel @on-selected-file='selected'></upload-excel>
     
      <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
        <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
        </el-table-column>
      </el-table>
     <el-button style="margin-top:30px;float:right;"  :loading="loading" type="primary" @click="open2">点击上传导入数据</el-button>
  </div>
</template>
<script type="text/javascript">
import uploadExcel from "components/UploadExcel/index.vue";
import _ from "lodash";
import axios from 'axios'
export default {
  components: { uploadExcel },
  data() {
    return {
      dataSources: [],
      tableData: [],
      tableHeader: [],
      dataColumns: [],
      dialogFormVisible: false,
      formLabelWidth: "140px",
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
      this.tableData = data.results;
      this.tableHeader = data.header;
      console.log ( this.tableData);
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
        console.log(tempArr)
      });
      axios
        .post("api/maintain_schedules", {
          maintain_schedules: tempArr
        })
        .then(data1 => {
          console.log(data1);
        })
        .catch(e => {
          console.log(e);
        });
      console.log(axios)
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
    selected(data) {
      this.tableData = data.results;
      this.tableHeader = data.header;
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
      // const loading = this.$loading({
      //   lock: true,
      //   text: "Loading",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)"
      // });
      // setTimeout(() => {
      //   loading.close();
      // }, 1000);
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