<template>
  <div class="container">
    <div class="button-group">
      <el-button type="primary" icon="edit" @click="dialogFormVisible = true">添加22一条记录</el-button>
      <el-button class="filter-item" type="primary" icon="document" >导出</el-button>
    </div>
    <el-table
      :data="dataSources"
      style="width: 100%">
       <el-table-column width="180px" align="center" label="线路">
        <template scope="scope">
          <span>{{line}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="序号">
        <template scope="scope">
          <span>{{index}}</span>
        </template>
      </el-table-column>
      <el-table-column  width="180px" align="center"  v-for="(item, key) in dataColumns" key="key" :prop="item.name" :label="item.title" />
    </el-table>
    <!-- 模态框表单 -->
    <el-dialog title="新增维修计划记录" :visible.sync="dialogFormVisible">
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
        <el-form-item label="1月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_1" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="2月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_2" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="3月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_3" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="4月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_4" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="5月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_5" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="6月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_6" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="7月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_7" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="8月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_8" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="9月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_9" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="10月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_10" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="11月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_11" placeholder="请选择类型">
            <el-option label="*" value="*" />
            <el-option label=" " value=" " />
          </el-select>
        </el-form-item>
        <el-form-item label="12月" :label-width="formLabelWidth">
          <el-select v-model="formDatas.month_12" placeholder="请选择类型">
            <el-option label="*" value="*"/>
            <el-option label=" " value=" "/>
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
  </div>
</template>
<script type="text/javascript">
import _ from "lodash";
export default {
  data() {
    return {
      dataSources: [],
      dataColumns: [],
      dialogFormVisible: false,
      formLabelWidth: "130px",
      formDatas: {
        line: "",
        type: "",
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
  },
  methods: {
    handleInitTable() {
      // 设置默认初始数据，可为空
      let tempTableDatas = [
        {
          index: 1,
          line: "北京7号线",
          type: "车载电台设备",
          project: "",
          standard: "",
          month_1: "*",
          month_2: "*",
          month_3: "*",
          month_4: "*",
          month_5: "*",
          month_6: "*",
          month_7: "*",
          month_8: "*",
          month_9: "*",
          month_10: "*",
          month_11: "*",
          month_12: "*",
          contractor: "sss",
          time: "sss",
          cycle: "sss",
          remarks: "sss"
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