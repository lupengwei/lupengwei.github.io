<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
      <el-checkbox class="filter-item" @change='tableKey=tableKey+1' v-model="showAuditor">显示审核人</el-checkbox>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="时间">
        <template scope="scope">
          <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="标题">
        <template scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
          <el-tag>{{scope.row.type | typeFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="创建人">
        <template scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
       <el-table-column class-name="status-col" label="维护周期" width="90">
        <template scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="类型">
          <el-select class="filter-item" v-model="temp.type" placeholder="请选择">
            <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="维护周期">
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
        <el-form-item label="设备分布">
           <el-select  v-model="valueshebei" placeholder="设备分布">
                        <el-option
                        v-for="item in shebei"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="重要性">
          <el-rate style="margin-top:8px;" v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
        </el-form-item>

        <el-form-item label="点评">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="temp.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="阅读数统计" :visible.sync="dialogPvVisible" size="small">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="渠道"> </el-table-column>
        <el-table-column prop="pv" label="pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确 定</el-button>
      </span>
    </el-dialog>

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
        options: [
          {
            value: "yiyue",
            label: "一月",
            children: [
              {
                value: "1",
                label: "1"
              },
              {
                value: "2",
                label: "2"
              },
              {
                value: "3",
                label: "3"
              },
              {
                value: "4",
                label: "4"
              },
              {
                value: "5",
                label: "5"
              },
              {
                value: "6",
                label: "6"
              },
              {
                value: "7",
                label: "7"
              },
              {
                value: "8",
                label: "8"
              },
              {
                value: "daohang",
                label: "9"
              },
              {
                value: "daohang",
                label: "10"
              },
              {
                value: "11",
                label: "11"
              },
              {
                value: "12",
                label: "12"
              },
              {
                value: "13",
                label: "13"
              },
              {
                value: "14",
                label: "14"
              },
              {
                value: "15",
                label: "15"
              },
              {
                value: "16",
                label: "16"
              },
              {
                value: "17",
                label: "17"
              },
              {
                value: "18",
                label: "18"
              },
              {
                value: "19",
                label: "19"
              },
              {
                value: "20",
                label: "20"
              },
              {
                value: "21",
                label: "21"
              },
              {
                value: "22",
                label: "22"
              },
              {
                value: "23",
                label: "23"
              },
              {
                value: "24",
                label: "24"
              },
              {
                value: "25",
                label: "25"
              },
              {
                value: "26",
                label: "26"
              },
              {
                value: "27",
                label: "27"
              },
              {
                value: "28",
                label: "28"
              },
              {
                value: "29",
                label: "29"
              },
              {
                value: "30",
                label: "30"
              },
              {
                value: "31",
                label: "31"
              }
            ]
          },
          {
            value: "eryue",
            label: "二月",
            children: [
              {
                value: "1",
                label: "1"
              },
              {
                value: "2",
                label: "2"
              },
              {
                value: "3",
                label: "3"
              },
              {
                value: "4",
                label: "4"
              },
              {
                value: "5",
                label: "5"
              },
              {
                value: "6",
                label: "6"
              },
              {
                value: "7",
                label: "7"
              },
              {
                value: "8",
                label: "8"
              },
              {
                value: "9",
                label: "9"
              },
              {
                value: "10",
                label: "10"
              },
              {
                value: "11",
                label: "11"
              },
              {
                value: "13",
                label: "12"
              },
              {
                value: "13",
                label: "13"
              },
              {
                value: "14",
                label: "14"
              },
              {
                value: "15",
                label: "15"
              },
              {
                value: "16",
                label: "16"
              },
              {
                value: "17",
                label: "17"
              },
              {
                value: "18",
                label: "18"
              },
              {
                value: "19",
                label: "19"
              },
              {
                value: "20",
                label: "20"
              },
              {
                value: "21",
                label: "21"
              },
              {
                value: "22",
                label: "22"
              },
              {
                value: "23",
                label: "23"
              },
              {
                value: "24",
                label: "24"
              },
              {
                value: "25",
                label: "25"
              },
              {
                value: "26",
                label: "26"
              },
              {
                value: "27",
                label: "27"
              },
              {
                value: "28",
                label: "28"
              },
              {
                value: "29",
                label: "29"
              }
            ]
          },
          {
            value: "sanyue",
            label: "三月",
            children: [
              {
                value: "1",
                label: "1"
              },
              {
                value: "2",
                label: "2"
              },
              {
                value: "3",
                label: "3"
              },
              {
                value: "4",
                label: "4"
              },
              {
                value: "5",
                label: "5"
              },
              {
                value: "6",
                label: "6"
              },
              {
                value: "7",
                label: "7"
              },
              {
                value: "8",
                label: "8"
              },
              {
                value: "daohang",
                label: "9"
              },
              {
                value: "daohang",
                label: "10"
              },
              {
                value: "11",
                label: "11"
              },
              {
                value: "12",
                label: "12"
              },
              {
                value: "13",
                label: "13"
              },
              {
                value: "14",
                label: "14"
              },
              {
                value: "15",
                label: "15"
              },
              {
                value: "16",
                label: "16"
              },
              {
                value: "17",
                label: "17"
              },
              {
                value: "18",
                label: "18"
              },
              {
                value: "19",
                label: "19"
              },
              {
                value: "20",
                label: "20"
              },
              {
                value: "21",
                label: "21"
              },
              {
                value: "22",
                label: "22"
              },
              {
                value: "23",
                label: "23"
              },
              {
                value: "24",
                label: "24"
              },
              {
                value: "25",
                label: "25"
              },
              {
                value: "26",
                label: "26"
              },
              {
                value: "27",
                label: "27"
              },
              {
                value: "28",
                label: "28"
              },
              {
                value: "29",
                label: "29"
              },
              {
                value: "30",
                label: "30"
              },
              {
                value: "31",
                label: "31"
              }
            ]
          },
          {
            value: "zhddinan",
            label: "四月",
            children: [
              {
                value: "1",
                label: "1"
              },
              {
                value: "2",
                label: "2"
              },
              {
                value: "3",
                label: "3"
              },
              {
                value: "4",
                label: "4"
              },
              {
                value: "5",
                label: "5"
              },
              {
                value: "6",
                label: "6"
              },
              {
                value: "7",
                label: "7"
              },
              {
                value: "8",
                label: "8"
              },
              {
                value: "daohang",
                label: "9"
              },
              {
                value: "daohang",
                label: "10"
              },
              {
                value: "11",
                label: "11"
              },
              {
                value: "12",
                label: "12"
              },
              {
                value: "13",
                label: "13"
              },
              {
                value: "14",
                label: "14"
              },
              {
                value: "15",
                label: "15"
              },
              {
                value: "16",
                label: "16"
              },
              {
                value: "17",
                label: "17"
              },
              {
                value: "18",
                label: "18"
              },
              {
                value: "19",
                label: "19"
              },
              {
                value: "20",
                label: "20"
              },
              {
                value: "21",
                label: "21"
              },
              {
                value: "22",
                label: "22"
              },
              {
                value: "23",
                label: "23"
              },
              {
                value: "24",
                label: "24"
              },
              {
                value: "25",
                label: "25"
              },
              {
                value: "26",
                label: "26"
              },
              {
                value: "27",
                label: "27"
              },
              {
                value: "28",
                label: "28"
              },
              {
                value: "29",
                label: "29"
              },
              {
                value: "daohang",
                label: "30"
              }
            ]
          },
          {
            value: "zhiddnan",
            label: "五月",
            children: [
              {
                value: "1",
                label: "1"
              },
              {
                value: "2",
                label: "2"
              },
              {
                value: "3",
                label: "3"
              },
              {
                value: "4",
                label: "4"
              },
              {
                value: "5",
                label: "5"
              },
              {
                value: "6",
                label: "6"
              },
              {
                value: "7",
                label: "7"
              },
              {
                value: "8",
                label: "8"
              },
              {
                value: "daohang",
                label: "9"
              },
              {
                value: "daohang",
                label: "10"
              },
              {
                value: "11",
                label: "11"
              },
              {
                value: "12",
                label: "12"
              },
              {
                value: "13",
                label: "13"
              },
              {
                value: "14",
                label: "14"
              },
              {
                value: "15",
                label: "15"
              },
              {
                value: "16",
                label: "16"
              },
              {
                value: "17",
                label: "17"
              },
              {
                value: "18",
                label: "18"
              },
              {
                value: "19",
                label: "19"
              },
              {
                value: "20",
                label: "20"
              },
              {
                value: "21",
                label: "21"
              },
              {
                value: "22",
                label: "22"
              },
              {
                value: "23",
                label: "23"
              },
              {
                value: "24",
                label: "24"
              },
              {
                value: "25",
                label: "25"
              },
              {
                value: "26",
                label: "26"
              },
              {
                value: "27",
                label: "27"
              },
              {
                value: "28",
                label: "28"
              },
              {
                value: "29",
                label: "29"
              },
              {
                value: "30",
                label: "30"
              },
              {
                value: "31",
                label: "31"
              }
            ]
          },
          {
            value: "zhddddddinan",
            label: "六月",
            children: [
              {
                value: "1",
                label: "1"
              },
              {
                value: "2",
                label: "2"
              },
              {
                value: "3",
                label: "3"
              },
              {
                value: "4",
                label: "4"
              },
              {
                value: "5",
                label: "5"
              },
              {
                value: "6",
                label: "6"
              },
              {
                value: "7",
                label: "7"
              },
              {
                value: "8",
                label: "8"
              },
              {
                value: "daohang",
                label: "9"
              },
              {
                value: "daohang",
                label: "10"
              },
              {
                value: "11",
                label: "11"
              },
              {
                value: "12",
                label: "12"
              },
              {
                value: "13",
                label: "13"
              },
              {
                value: "14",
                label: "14"
              },
              {
                value: "15",
                label: "15"
              },
              {
                value: "16",
                label: "16"
              },
              {
                value: "17",
                label: "17"
              },
              {
                value: "18",
                label: "18"
              },
              {
                value: "19",
                label: "19"
              },
              {
                value: "20",
                label: "20"
              },
              {
                value: "21",
                label: "21"
              },
              {
                value: "22",
                label: "22"
              },
              {
                value: "23",
                label: "23"
              },
              {
                value: "24",
                label: "24"
              },
              {
                value: "25",
                label: "25"
              },
              {
                value: "26",
                label: "26"
              },
              {
                value: "27",
                label: "27"
              },
              {
                value: "28",
                label: "28"
              },
              {
                value: "29",
                label: "29"
              },
              {
                value: "daohang",
                label: "30"
              }
            ]
          },
          {
            value: "qiyue",
            label: "七月",
            children: [
              {
                value: "1",
                label: "1"
              },
              {
                value: "2",
                label: "2"
              },
              {
                value: "3",
                label: "3"
              },
              {
                value: "4",
                label: "4"
              },
              {
                value: "5",
                label: "5"
              },
              {
                value: "6",
                label: "6"
              },
              {
                value: "7",
                label: "7"
              },
              {
                value: "8",
                label: "8"
              },
              {
                value: "daohang",
                label: "9"
              },
              {
                value: "daohang",
                label: "10"
              },
              {
                value: "11",
                label: "11"
              },
              {
                value: "12",
                label: "12"
              },
              {
                value: "13",
                label: "13"
              },
              {
                value: "14",
                label: "14"
              },
              {
                value: "15",
                label: "15"
              },
              {
                value: "16",
                label: "16"
              },
              {
                value: "17",
                label: "17"
              },
              {
                value: "18",
                label: "18"
              },
              {
                value: "19",
                label: "19"
              },
              {
                value: "20",
                label: "20"
              },
              {
                value: "21",
                label: "21"
              },
              {
                value: "22",
                label: "22"
              },
              {
                value: "23",
                label: "23"
              },
              {
                value: "24",
                label: "24"
              },
              {
                value: "25",
                label: "25"
              },
              {
                value: "26",
                label: "26"
              },
              {
                value: "27",
                label: "27"
              },
              {
                value: "28",
                label: "28"
              },
              {
                value: "29",
                label: "29"
              },
              {
                value: "30",
                label: "30"
              },
              {
                value: "31",
                label: "31"
              }
            ]
          },
          {
            value: "bayue",
            label: "八月",
            children: [
              {
                value: "1",
                label: "1"
              },
              {
                value: "2",
                label: "2"
              },
              {
                value: "3",
                label: "3"
              },
              {
                value: "4",
                label: "4"
              },
              {
                value: "5",
                label: "5"
              },
              {
                value: "6",
                label: "6"
              },
              {
                value: "7",
                label: "7"
              },
              {
                value: "8",
                label: "8"
              },
              {
                value: "9",
                label: "9"
              },
              {
                value: "10",
                label: "10"
              },
              {
                value: "11",
                label: "11"
              },
              {
                value: "12",
                label: "12"
              },
              {
                value: "13",
                label: "13"
              },
              {
                value: "14",
                label: "14"
              },
              {
                value: "15",
                label: "15"
              },
              {
                value: "16",
                label: "16"
              },
              {
                value: "17",
                label: "17"
              },
              {
                value: "18",
                label: "18"
              },
              {
                value: "19",
                label: "19"
              },
              {
                value: "20",
                label: "20"
              },
              {
                value: "21",
                label: "21"
              },
              {
                value: "22",
                label: "22"
              },
              {
                value: "23",
                label: "23"
              },
              {
                value: "24",
                label: "24"
              },
              {
                value: "25",
                label: "25"
              },
              {
                value: "26",
                label: "26"
              },
              {
                value: "27",
                label: "27"
              },
              {
                value: "28",
                label: "28"
              },
              {
                value: "29",
                label: "29"
              },
              {
                value: "30",
                label: "30"
              },
              {
                value: "31",
                label: "31"
              }
            ]
          },
          {
            value: "jiuyue",
            label: "九月",
            children: [
              {
                value: "1",
                label: "1"
              },
              {
                value: "2",
                label: "2"
              },
              {
                value: "3",
                label: "3"
              },
              {
                value: "4",
                label: "4"
              },
              {
                value: "5",
                label: "5"
              },
              {
                value: "6",
                label: "6"
              },
              {
                value: "7",
                label: "7"
              },
              {
                value: "8",
                label: "8"
              },
              {
                value: "daohang",
                label: "9"
              },
              {
                value: "daohang",
                label: "10"
              },
              {
                value: "11",
                label: "11"
              },
              {
                value: "12",
                label: "12"
              },
              {
                value: "13",
                label: "13"
              },
              {
                value: "14",
                label: "14"
              },
              {
                value: "15",
                label: "15"
              },
              {
                value: "16",
                label: "16"
              },
              {
                value: "17",
                label: "17"
              },
              {
                value: "18",
                label: "18"
              },
              {
                value: "19",
                label: "19"
              },
              {
                value: "20",
                label: "20"
              },
              {
                value: "21",
                label: "21"
              },
              {
                value: "22",
                label: "22"
              },
              {
                value: "23",
                label: "23"
              },
              {
                value: "24",
                label: "24"
              },
              {
                value: "25",
                label: "25"
              },
              {
                value: "26",
                label: "26"
              },
              {
                value: "27",
                label: "27"
              },
              {
                value: "28",
                label: "28"
              },
              {
                value: "29",
                label: "29"
              },
              {
                value: "30",
                label: "30"
              },
              {
                value: "31",
                label: "31"
              }
            ]
          },
          {
            value: "shiyue",
            label: "十月",
            children: [
              {
                value: "1",
                label: "1"
              },
              {
                value: "2",
                label: "2"
              },
              {
                value: "3",
                label: "3"
              },
              {
                value: "4",
                label: "4"
              },
              {
                value: "5",
                label: "5"
              },
              {
                value: "6",
                label: "6"
              },
              {
                value: "7",
                label: "7"
              },
              {
                value: "8",
                label: "8"
              },
              {
                value: "daohang",
                label: "9"
              },
              {
                value: "daohang",
                label: "10"
              },
              {
                value: "11",
                label: "11"
              },
              {
                value: "12",
                label: "12"
              },
              {
                value: "13",
                label: "13"
              },
              {
                value: "14",
                label: "14"
              },
              {
                value: "15",
                label: "15"
              },
              {
                value: "16",
                label: "16"
              },
              {
                value: "17",
                label: "17"
              },
              {
                value: "18",
                label: "18"
              },
              {
                value: "19",
                label: "19"
              },
              {
                value: "20",
                label: "20"
              },
              {
                value: "21",
                label: "21"
              },
              {
                value: "22",
                label: "22"
              },
              {
                value: "23",
                label: "23"
              },
              {
                value: "24",
                label: "24"
              },
              {
                value: "25",
                label: "25"
              },
              {
                value: "26",
                label: "26"
              },
              {
                value: "27",
                label: "27"
              },
              {
                value: "28",
                label: "28"
              },
              {
                value: "29",
                label: "29"
              },
              {
                value: "30",
                label: "30"
              },
              {
                value: "31",
                label: "31"
              }
            ]
          },
          {
            value: "shiyiyue",
            label: "十一月",
            children: [
              {
                value: "1",
                label: "1"
              },
              {
                value: "2",
                label: "2"
              },
              {
                value: "3",
                label: "3"
              },
              {
                value: "4",
                label: "4"
              },
              {
                value: "5",
                label: "5"
              },
              {
                value: "6",
                label: "6"
              },
              {
                value: "7",
                label: "7"
              },
              {
                value: "8",
                label: "8"
              },
              {
                value: "daohang",
                label: "9"
              },
              {
                value: "daohang",
                label: "10"
              },
              {
                value: "11",
                label: "11"
              },
              {
                value: "12",
                label: "12"
              },
              {
                value: "13",
                label: "13"
              },
              {
                value: "14",
                label: "14"
              },
              {
                value: "15",
                label: "15"
              },
              {
                value: "16",
                label: "16"
              },
              {
                value: "17",
                label: "17"
              },
              {
                value: "18",
                label: "18"
              },
              {
                value: "19",
                label: "19"
              },
              {
                value: "20",
                label: "20"
              },
              {
                value: "21",
                label: "21"
              },
              {
                value: "22",
                label: "22"
              },
              {
                value: "23",
                label: "23"
              },
              {
                value: "24",
                label: "24"
              },
              {
                value: "25",
                label: "25"
              },
              {
                value: "26",
                label: "26"
              },
              {
                value: "27",
                label: "27"
              },
              {
                value: "28",
                label: "28"
              },
              {
                value: "29",
                label: "29"
              },
              {
                value: "30",
                label: "30"
              },
              {
                value: "31",
                label: "31"
              }
            ]
          },
          {
            value: "shieryue",
            label: "十二月",
            children: [
              {
                value: "1",
                label: "1"
              },
              {
                value: "2",
                label: "2"
              },
              {
                value: "3",
                label: "3"
              },
              {
                value: "4",
                label: "4"
              },
              {
                value: "5",
                label: "5"
              },
              {
                value: "6",
                label: "6"
              },
              {
                value: "7",
                label: "7"
              },
              {
                value: "8",
                label: "8"
              },
              {
                value: "daohang",
                label: "9"
              },
              {
                value: "daohang",
                label: "10"
              },
              {
                value: "11",
                label: "11"
              },
              {
                value: "12",
                label: "12"
              },
              {
                value: "13",
                label: "13"
              },
              {
                value: "14",
                label: "14"
              },
              {
                value: "15",
                label: "15"
              },
              {
                value: "16",
                label: "16"
              },
              {
                value: "17",
                label: "17"
              },
              {
                value: "18",
                label: "18"
              },
              {
                value: "19",
                label: "19"
              },
              {
                value: "20",
                label: "20"
              },
              {
                value: "21",
                label: "21"
              },
              {
                value: "22",
                label: "22"
              },
              {
                value: "23",
                label: "23"
              },
              {
                value: "24",
                label: "24"
              },
              {
                value: "25",
                label: "25"
              },
              {
                value: "26",
                label: "26"
              },
              {
                value: "27",
                label: "27"
              },
              {
                value: "28",
                label: "28"
              },
              {
                value: "29",
                label: "29"
              },
              {
                value: "30",
                label: "30"
              },
              {
                value: "31",
                label: "31"
              }
            ]
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
