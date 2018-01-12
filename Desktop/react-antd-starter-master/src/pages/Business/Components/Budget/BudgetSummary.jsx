/**
 * 预算汇总
 */

import React from 'react';
import { Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import { Alert, Table, Form, Input, Icon, Modal, Spin, Tag, Popconfirm, Button, Select, message, Tooltip, Switch } from 'antd';
import styles from '../Common.less';

import {
  showProject,
  getBudgetRoles,
  getBudgetSummaryTables
} from '../../../../services/api';

//ant
const FormItem = Form.Item;
const Option   = Select.Option;

//main
let BudgetSummary = React.createClass({
  getInitialState() {
    return {
      loading: true,
      isOpenProjectDetail: false, //隐藏项目概况
      projectDatas: {
        fullname: '',
        htlx: '',
        xlcd: '',
        htje: '',
        htgq: '',
        htqsrq: '',
        sszgs: '',
        Phases: [],
        htqdnArray: [],
        zbqArray: []
      },
      budgetDatas: {
        BudgetPaymentPlan: {
          contractArr: [],
          qualityArr: []
        },
        CertificationCost: {
          contractArr: [],
          qualityArr: []
        },
        DesignCost: {
          contractArr: [],
          qualityArr: []
        },
        IndirectCostQuality: {
          contractArr: [],
          qualityArr: []
        },
        LabourCostQuality: {
          contractArr: [],
          qualityArr: []
        },
        MaterialCostQuality: {
          contractArr: [],
          qualityArr: []
        },
        LabourImplements: [],
        TransportCosts: [],
        FinanceTable: {
          FinanceItems: [],
        },
        ManagerCostsTable: {
          ManagerCosts: []
        },
        HardwareCostTable: {
          HardwareCostItems: []
        }
      },
      moduleDetailDatas: [
        {name: '项目管理费',type: '项目管理费'},
        {name: '硬件材料费',type: '材料费（硬件）'},
        {name: '质保期材料费',type: '材料费（质保）'},
        {name: '风险间接费',type: '风险间接费'},
        {name: '认证费',type: '认证费'},
        {name: '实施人工费',type: '实施人工费'},
        {name: '质保期人工费',type: '质保期人工费'},
        {name: '集成设计费',type: '集成设计费'},
        {name: '物流成本',type: '物流成本'},
        {name: '财务成本',type: '财务成本'}
      ],
      sumDataSource: [],
      sumColumns: [],
      detailDataSource: [],
      detailColumns: [],
    };
  },
  componentDidMount() {
    this.showBudgetRoles();
    this.showBudgetSummaryTables();
  },
  showBudgetRoles() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("获取项目失败，请切换项目！");

    getBudgetRoles(projectId).then((res) => {
      let datas = res.jsonResult.budgetRoles;

      //已经存在权限角色
      if(datas.length > 0) {

        let tempArray = [];

        datas.map((item1) => {
          _.map(_self.state.moduleDetailDatas, (item2) => {
            if(item1.role == item2.name) {
              let tempJson = {};

              tempJson.name = item2.name;
              tempJson.type = item2.type;
              tempJson.userName = item1.User.name;

              tempArray.push(tempJson);
            }
          })
        })

        _self.setState({ moduleDetailDatas: tempArray });
      }

    })
  },
  showBudgetSummaryTables() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("请选择归属项目或部门！");

    getBudgetSummaryTables(projectId).then((res) => {
      let datas = res.jsonResult.budgetTable;

      _self.setState({ budgetDatas: datas });

      //获取项目信息
      _self.showProjectInfo();

    })
  },
  showProjectInfo() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("请选择归属项目或部门！");

    showProject(projectId).then((res) => {
      let datas = res.jsonResult.project;
      let tempHtqdnArray = [];
      let tempZbqArray = [];

      //合同起止时间与质保期必须有
      if(datas.htkssj && datas.htzzsj && datas.zbq) {

        let startDate = moment(datas.htkssj).format('YYYY-MM-DD');
        let endDate = moment(datas.htzzsj).format('YYYY-MM-DD');
        let zbqYears = parseInt(datas.zbq); //质保期 年

        let startYear = parseInt(moment(startDate).format('YYYY'));
        let endYear = parseInt(moment(endDate).format('YYYY'));

        let yearDiffCounts = (endYear+1) - startYear; //至少保证有一年

        //组装合同签订年
        for(let i = 0; i < yearDiffCounts; i++) {
          tempHtqdnArray.push(startYear+i);
        }
        //组装质保期
        let tempEndYear = parseInt(moment(endDate).format('YYYY'));
        for(let j = 0; j <= zbqYears; j++) {
          tempZbqArray.push(tempEndYear+j);
        }

        //赋值
        datas.htqdnArray = tempHtqdnArray;
        datas.zbqArray = tempZbqArray;

      }else {
        message.warning("请在项目静态信息里面完善合同起止时间与质保期！");
        //赋空值
        datas.htqdnArray = [];
        datas.zbqArray = [];
      }

      if(!datas.htje) message.warning('获取合同金额失败！')

      _self.setState({ projectDatas: datas });

      setTimeout(() => {
        _self.showDetailTableInfo();
      }, 300)

    })
  },
  showSummaryTableInfo() {
    let _self = this;
    let tempHtje = _self.state.projectDatas.htje || 0;

    /****** 表列 ******/
    let tempSumColumns = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      className: styles.textAlignCenter
    }, {
      title: '财务指标',
      dataIndex: 'cwzb',
      key: 'cwzb',
      className: styles.textAlignCenter
    }, {
      title: '编制人',
      dataIndex: 'userName',
      key: 'userName',
      className: styles.textAlignCenter
    }, {
      title: '合计',
      dataIndex: 'total',
      key: 'total',
      className: styles.textAlignCenter,
      render: (text, record) => {
        if(record.isPercent) return text+'%';
        return text ? '￥'+desp_toThousands(text) : '/';
      }
    }];

    //合同签署年
    _self.state.projectDatas.htqdnArray.map((item, key) => {
      let tempJson = {};

      tempJson.title = item.toString()+'年';
      tempJson.dataIndex = '合同'+item.toString();
      tempJson.key = '合同'+item.toString();
      tempJson.className = styles.textAlignCenter;
      tempJson.render = (text, record) => {
        if(record.isPercent && text) return text+'%';
        return text ? '￥'+desp_toThousands(text) : '/';
      };

      tempSumColumns.push(tempJson);
    })

    //质保期
    _self.state.projectDatas.zbqArray.map((item, key) => {
      let tempJson = {};

      tempJson.title = '质保期.'+item.toString()+'年';
      tempJson.dataIndex = '质保'+item.toString();
      tempJson.key = '质保'+item.toString();
      tempJson.className = styles.textAlignCenter;
      tempJson.render = (text,record) => {
        if(record.isPercent && text) return text+'%';
        return text ? '￥'+desp_toThousands(text) : '/';
      };

      tempSumColumns.push(tempJson);
    })

    /****** 表行 ******/
    let tempSumDataSource = [];
    let tempTotal = 0;

    let tempLists = [{
      name: '合同总金额（含税）',
      userName: '项目管理工程师'
    }, {
      name: '预计回款',
      userName: '商务经理'
    }, {
      name: '项目成本合计',
      userName: '商务经理'
    }, {
      name: '完工比例',
      userName: '商务经理'
    }, {
      name: '确认项目收入',
      userName: '商务经理'
    }, {
      name: '毛利率',
      userName: '商务经理'
    }];

    tempLists.map((item1, key1) => {
      let tempJson = {
        id: key1+1,
        key: key1+1,
        cwzb: item1.name,
        userName: item1.userName,
        total: 0
      };

      if(item1.name == '合同总金额（含税）') {
        //合同金额
        // tempJson[tempSumColumns[4].dataIndex] = tempHtje;
        tempJson.total = tempHtje

      }

      if(item1.name == '预计回款') {

        let tempBudgetPaymentPlan_ht_str = _self.state.budgetDatas.BudgetPaymentPlan.contractArr;
        let tempBudgetPaymentPlan_ht_arr = [];
         tempBudgetPaymentPlan_ht_str.length != 0 ? tempBudgetPaymentPlan_ht_arr = tempBudgetPaymentPlan_ht_str.split(',') : null;

        let tempBudgetPaymentPlan_zb_str = _self.state.budgetDatas.BudgetPaymentPlan.qualityArr;
        let tempBudgetPaymentPlan_zb_arr = [];
        tempBudgetPaymentPlan_zb_str.length != 0 ? tempBudgetPaymentPlan_zb_arr = tempBudgetPaymentPlan_zb_str.split(',') : null;

        //合同内成本
        let htqdnCounts = 0;
        _self.state.projectDatas.htqdnArray.map((item2, key2) => {
          let tempField = '合同'+item2.toString();

          tempJson[tempField] = tempBudgetPaymentPlan_ht_arr[htqdnCounts] || 0;
          tempTotal += parseFloat(tempJson[tempField]);

          ++htqdnCounts;
        })

        //质保期成本
        let zbqCounts = 0;
        _self.state.projectDatas.zbqArray.map((item2, key2) => {
          let tempField = '质保'+item2.toString();

          tempJson[tempField] = tempBudgetPaymentPlan_zb_arr[zbqCounts] || 0;
          tempTotal += parseFloat(tempJson[tempField]);

          ++zbqCounts;
        })

        tempJson.total = tempTotal; //回款合计

      }

      if(item1.name == '项目成本合计') {
        //每年各个成本详情之和
        _.map(_self.state.detailDataSource, (l1, k1) => {

          _self.state.projectDatas.htqdnArray.map((l2, k2) => {
            let tempField = '合同'+l2.toString();
            let tempTotalNumbers = 0;
            tempJson[tempField] ? tempTotalNumbers = parseFloat(tempJson[tempField]) : null ;
            tempTotalNumbers += parseFloat(l1[tempField]) || 0;
            tempJson[tempField] = tempTotalNumbers;
          })

          _self.state.projectDatas.zbqArray.map((l2, k2) => {
            let tempField = '质保'+l2.toString();
            let tempTotalNumbers = 0;
            tempJson[tempField] ? tempTotalNumbers = parseFloat(tempJson[tempField]) : null ;
            tempTotalNumbers += parseFloat(l1[tempField]) || 0;
            tempJson[tempField] = tempTotalNumbers;
          })

          tempJson.total += parseFloat(l1.total);

        })

      }

      if(item1.name == '完工比例') {
        //每年的成本占总成本比例

        tempJson.isPercent = true;

        _.map(tempSumDataSource, (l1) => {

          if(l1.cwzb == '项目成本合计' && l1.total != 0) {
            //项目成本必须已经存在

            let tempDenominator = l1.total || 1; //分母

            _self.state.projectDatas.htqdnArray.map((l2, k2) => {
              let tempField = '合同'+l2.toString();
              let tempNumerator = 0; //分子
              let tempResult = 0;

              if(l1[tempField]) {
                tempNumerator = parseFloat(l1[tempField]);
              }

              if(tempDenominator != 0) {
                tempResult = (100*tempNumerator / tempDenominator).toFixed(2);
              }

              tempJson[tempField] = tempResult;
              tempJson.total += parseFloat(tempResult);
            })

            _self.state.projectDatas.zbqArray.map((l2, k2) => {
              let tempField = '质保'+l2.toString();
              let tempNumerator = 0; //分子
              let tempResult = 0;

              if(l1[tempField]) {
                tempNumerator = parseFloat(l1[tempField]);
              }

              if(tempDenominator != 0) {
                tempResult = (100*tempNumerator / tempDenominator).toFixed(2);
              }

              tempJson[tempField] = tempResult;
              tempJson.total += parseFloat(tempResult);
            })

          }
        })

        //统一处理合计（百分比）
        let tempTotalPercent = tempJson.total;

        if(tempTotalPercent > 100) {
          tempJson.total = 100;
        }else {
          tempJson.total = tempTotalPercent.toFixed(2);
        }

      }

      if(item1.name == '确认项目收入') {
        //合计：合同金额/1.17，年度：合计*当年完工比例

        let tempTotal = tempHtje/1.17;

        tempJson.total = tempTotal.toFixed(2); //收入合计

        _.map(tempSumDataSource, (l1) => {

          if(l1.cwzb == '完工比例' && l1.total != 0) {
            //完工比例必须已经存在

            _self.state.projectDatas.htqdnArray.map((l2, k2) => {
              let tempField = '合同'+l2.toString();
              let tempResult = (tempTotal*parseFloat(l1[tempField])/100).toFixed(2);

              tempJson[tempField] = tempResult;
            })

            _self.state.projectDatas.zbqArray.map((l2, k2) => {
              let tempField = '质保'+l2.toString();
              let tempResult = (tempTotal*parseFloat(l1[tempField])/100).toFixed(2);

              tempJson[tempField] = tempResult;
            })

          }

        })

      }

      if(item1.name == '毛利率') {
        //(收入-成本)/收入

        tempJson.isPercent = true;

        let tempIncomeJson = {}; //收入
        let tempCostJson = {}; //成本

        _.map(tempSumDataSource, (l1) => {

          if(l1.cwzb == '确认项目收入') return tempIncomeJson = l1;
          if(l1.cwzb == '项目成本合计') return tempCostJson = l1;

        })

        _self.state.projectDatas.htqdnArray.map((l2, k2) => {
          let tempField = '合同'+l2.toString();
          let tempResult = 0;

          if(tempIncomeJson[tempField] && tempCostJson[tempField]) {
            tempResult = 100*(parseFloat(tempIncomeJson[tempField]) - parseFloat(tempCostJson[tempField]))/parseFloat(tempIncomeJson[tempField]);
          }

          tempJson[tempField] = tempResult.toFixed(2);
        })

        _self.state.projectDatas.zbqArray.map((l2, k2) => {
          let tempField = '质保'+l2.toString();
          let tempResult = 0;

          if(tempIncomeJson[tempField] && tempCostJson[tempField]) {
            tempResult = 100*(parseFloat(tempIncomeJson[tempField]) - parseFloat(tempCostJson[tempField]))/parseFloat(tempIncomeJson[tempField]);
          }

          tempJson[tempField] = tempResult.toFixed(2);
        })

        //毛利率合计
        if(tempIncomeJson.total != 0 && tempCostJson.total != 0) {
          let tempTotal = 100*(tempIncomeJson.total - tempCostJson.total)/tempIncomeJson.total;
          tempJson.total = tempTotal.toFixed(2);
        }

      }

      tempSumDataSource.push(tempJson);
    })

    _self.setState({
      sumColumns: tempSumColumns,
      sumDataSource: tempSumDataSource
    });

  },
  showDetailTableInfo() {
    let _self = this;
    let tempHtje = _self.state.projectDatas.htje || 0;

    /****** 项目成本详情（合同内）******/

    //1、认证费
    let tempCertificationCost_ht_str = _self.state.budgetDatas.CertificationCost.contractArr;
    let tempCertificationCost_ht_arr = [];
    _.size(tempCertificationCost_ht_str) != 0 ? tempCertificationCost_ht_arr = tempCertificationCost_ht_str.split(',') : null;
    //2、集成设计费
    let tempDesignCost_ht_str = _self.state.budgetDatas.DesignCost.contractArr;
    let tempDesignCost_ht_arr = [];
    _.size(tempDesignCost_ht_str) != 0 ? tempDesignCost_ht_arr = tempDesignCost_ht_str.split(',') : null;
    //3、风险间接费
    let tempIndirectCostQuality_ht_str = _self.state.budgetDatas.IndirectCostQuality.contractArr;
    let tempIndirectCostQuality_ht_arr = [];
    _.size(tempIndirectCostQuality_ht_str) != 0 ? tempIndirectCostQuality_ht_arr = tempIndirectCostQuality_ht_str.split(',') : null;
    //4、质保期人工费
    let tempLabourCostQuality_ht_str = _self.state.budgetDatas.LabourCostQuality.contractArr;
    let tempLabourCostQuality_ht_arr = [];
    _.size(tempLabourCostQuality_ht_str) != 0 ? tempLabourCostQuality_ht_arr = tempLabourCostQuality_ht_str.split(',') : null;
    //5、质保期材料费
    let tempMaterialCostQuality_ht_str = _self.state.budgetDatas.MaterialCostQuality.contractArr;
    let tempMaterialCostQuality_ht_arr = [];
    _.size(tempMaterialCostQuality_ht_str) != 0 ? tempMaterialCostQuality_ht_arr = tempMaterialCostQuality_ht_str.split(',') : null;
    //6、实施人工费
    let tempLabourImplement_ht_arr = [0,0,0,0,0,0,0,0,0,0]; //10年
    _.map(_self.state.budgetDatas.LabourImplements, (item1) => {
      let tempArray = [];
      _.size(item1.contractArr) != 0 ? tempArray = item1.contractArr.split(',') : null;

      _.map(tempArray, (item2, key2) => {
        if(item2) tempLabourImplement_ht_arr[key2] += parseFloat(item2);
      })

    })
    //7、物流成本
    let tempTransportCost_ht_arr = [0,0,0,0,0,0,0,0,0,0]; //10年
    _.map(_self.state.budgetDatas.TransportCosts, (item1) => {
      let tempArray = [];
      _.size(item1.contractArr) != 0 ? tempArray = item1.contractArr.split(',') : null;

      _.map(tempArray, (item2, key2) => {
        if(item2) tempTransportCost_ht_arr[key2] += parseFloat(item2);
      })

    })

    //8.财务成本
    let tempFinanceCost_ht_arr = [];
    let tempGroupBy_ssnd = _.groupBy(_self.state.budgetDatas.FinanceTable.FinanceItems, (item) => {return item.ssnd});

    _.map(tempGroupBy_ssnd, (item1, key1) => {
      let numbers = 0;
      _.map(item1, (item2, key2) => {
        let tempCosts = 0;
        if(!item2.bhbl && !item2.bzjbl && item2.sxfl) {
          //其他税
          tempCosts = item2.sxfl*tempHtje/100; //手续费率*合同金额
        }
        if(item2.bhbl && item2.bhyxq && item2.sxfl){
          //保函
          tempCosts = item2.bhbl*item2.sxfl*item2.bhyxq*tempHtje/100; //保函比例*手续费率*有效期*合同金额
        }
        if(item2.bzjbl && item2.bhyxq && item2.sxfl) {
          //保证金
          tempCosts = item2.bzjbl*item2.sxfl*item2.bhyxq*tempHtje/100; //保证金比例手续费率*有效期*合同金额
        }

        numbers += tempCosts;

      })

      tempFinanceCost_ht_arr.push(numbers);

    })

    /****** 项目成本详情（质保内）******/

    //1、认证费
    let tempCertificationCost_zb_str = _self.state.budgetDatas.CertificationCost.qualityArr;
    let tempCertificationCost_zb_arr = [];
    _.size(tempCertificationCost_zb_str) != 0 ? tempCertificationCost_zb_arr = tempCertificationCost_zb_str.split(',') : null;
    //2、集成设计费
    let tempDesignCost_zb_str = _self.state.budgetDatas.DesignCost.qualityArr;
    let tempDesignCost_zb_arr = [];
    _.size(tempDesignCost_zb_str) != 0 ? tempDesignCost_zb_arr = tempDesignCost_zb_str.split(',') : null;
    //3、风险间接费
    let tempIndirectCostQuality_zb_str = _self.state.budgetDatas.IndirectCostQuality.qualityArr;
    let tempIndirectCostQuality_zb_arr = [];
    _.size(tempIndirectCostQuality_zb_str) != 0 ? tempIndirectCostQuality_zb_arr = tempIndirectCostQuality_zb_str.split(',') : null;
    //4、质保期人工费
    let tempLabourCostQuality_zb_str = _self.state.budgetDatas.LabourCostQuality.qualityArr;
    let tempLabourCostQuality_zb_arr = [];
    _.size(tempLabourCostQuality_zb_str) != 0 ? tempLabourCostQuality_zb_arr = tempLabourCostQuality_zb_str.split(',') : null;
    //5、质保期材料费
    let tempMaterialCostQuality_zb_str = _self.state.budgetDatas.MaterialCostQuality.qualityArr;
    let tempMaterialCostQuality_zb_arr = [];
    _.size(tempMaterialCostQuality_zb_str) != 0 ? tempMaterialCostQuality_zb_arr = tempMaterialCostQuality_zb_str.split(',') : null;
    //6、实施人工费
    let tempLabourImplement_zb_arr = [0,0,0,0,0,0,0,0,0,0]; //10年
    _.map(_self.state.budgetDatas.LabourImplements, (item1) => {
      let tempArray = [];
      _.size(item1.qualityArr) != 0 ? tempArray = item1.qualityArr.split(',') : null;

      _.map(tempArray, (item2, key2) => {
        if(item2) tempLabourImplement_zb_arr[key2] += parseFloat(item2);
      })

    })
    //7、物流成本
    let tempTransportCost_zb_arr = [0,0,0,0,0,0,0,0,0,0]; //10年
    _.map(_self.state.budgetDatas.TransportCosts, (item1) => {
      let tempArray = [];
      _.size(item1.qualityArr) != 0 ? tempArray = item1.qualityArr.split(',') : null;

      _.map(tempArray, (item2, key2) => {
        if(item2) tempTransportCost_zb_arr[key2] += parseFloat(item2);
      })

    })

    /****** 表行 ******/
    //按照年份输出json对象

    let tempDetailDataSource = [];

    //成本明细表基本信息
    _.map(_self.state.moduleDetailDatas, (item1, key1) => {

      let tempJson = {};
      let tempTotal = 0;

      tempJson.id = key1+1;
      tempJson.key = key1+1;
      tempJson.type = item1.type;
      tempJson.name = item1.name;
      tempJson.userName = item1.userName;

      //合同内成本
      let htqdnCounts = 0;
      _self.state.projectDatas.htqdnArray.map((item2, key2) => {

        let tempField = '合同'+item2.toString();

        if(item1.name == '项目管理费') {

          let datas = _self.state.budgetDatas.ManagerCostsTable;
          let tempListArray = [];

          _.map(datas.ManagerCosts, (item3, key3) => {

            //预算的起止时间
            let tempRangeStartDate = _self.state.budgetDatas.ManagerCostsTable.beginDate;
            let tempRangeEndDate = _self.state.budgetDatas.ManagerCostsTable.endDate;

            if(item3.type == '单次') {
              //检查时间是否在预算的起止时间内
              if(moment(item3.startDate).isBefore(tempRangeStartDate) || moment(item3.startDate).isAfter(tempRangeEndDate)) return false;

              let tempJson = {};

              tempJson.type = item3.type;
              tempJson.levelOneName = item3.levelOneName;
              tempJson.levelTwoName = item3.levelTwoName;
              tempJson.cost = item3.cost;
              tempJson.startDate = moment(item3.startDate).format('YYYY-MM-DD');
              tempJson.endDate = item3.endDate;
              tempJson.realStartDate = item3.startDate;
              tempJson.realEndDate = item3.endDate;
              tempJson.occurYear = moment(item3.startDate).format('YYYY');

              tempListArray.push(tempJson);

            }else if(item3.type == '周期') {

              let lastDate = item3.startDate;
              let endDate = item3.endDate;

              if(item3.period == 'day') {

                while(1) {
                  //检查时间是否在预算的起止时间内
                  if(moment(lastDate).isBefore(tempRangeStartDate) || moment(lastDate).isAfter(tempRangeEndDate)) break;

                  let tempJson = {};

                  tempJson.type = item3.type;
                  tempJson.levelOneName = item3.levelOneName;
                  tempJson.levelTwoName = item3.levelTwoName;
                  tempJson.cost = item3.cost;
                  tempJson.startDate = moment(lastDate).format('YYYY-MM-DD');
                  tempJson.endDate = lastDate;
                  tempJson.realStartDate = item3.startDate;
                  tempJson.realEndDate = item3.endDate;
                  tempJson.occurYear = moment(lastDate).format('YYYY');

                  tempListArray.push(tempJson);

                  lastDate = moment(lastDate).add(item3.interval, 'd');

                  if(moment(lastDate).isAfter(endDate)) break;
                }

              }else if(item3.period == 'month') {

                 while(1) {
                  //检查时间是否在预算的起止时间内
                  if(moment(lastDate).isBefore(tempRangeStartDate) || moment(lastDate).isAfter(tempRangeEndDate)) break;

                  let tempJson = {};

                  tempJson.type = item3.type;
                  tempJson.levelOneName = item3.levelOneName;
                  tempJson.levelTwoName = item3.levelTwoName;
                  tempJson.cost = item3.cost;
                  tempJson.startDate = moment(lastDate).format('YYYY-MM-DD');
                  tempJson.endDate = lastDate;
                  tempJson.realStartDate = item3.startDate;
                  tempJson.realEndDate = item3.endDate;
                  tempJson.occurYear = moment(lastDate).format('YYYY');

                  tempListArray.push(tempJson);

                  lastDate = moment(lastDate).add(item3.interval, 'M');

                  if(moment(lastDate).isAfter(endDate)) break;
                }

              }

            } //周期

          }) //合同期

          //按照年份分组
          let tempGroupByDate = _.groupBy(tempListArray, (item) => {return item.occurYear});

          //获取项目管理预算起止时间
          let tempRealStartDate = moment(_self.state.budgetDatas.ManagerCostsTable.beginDate).format('YYYY');
          let tempRealEndDate = moment(_self.state.budgetDatas.ManagerCostsTable.endDate).format('YYYY');

          //计算年度费用，并过滤合理年份
          let tempProjectManageJson = {};
          _.map(tempGroupByDate, (l1, k1) => {

            let temp_htqdnArray = _self.state.projectDatas.htqdnArray;

            if(k1 >= tempRealStartDate && k1 <= tempRealEndDate) {
              let numbers = 0;
              tempProjectManageJson[k1] = 0;

              _.map(l1, (l2) => {
                numbers += l2.cost;
              })

              tempProjectManageJson[k1] = numbers;
            }

          })

          //分配费用（合同期与质保期，重合年放在前者）
          _.map(tempProjectManageJson, (l1, k1) => {
            _.map(_self.state.projectDatas.htqdnArray, (l2, k2) => {

              let temp_htqdnArray = _self.state.projectDatas.htqdnArray;

              if(temp_htqdnArray[temp_htqdnArray.length - 1] >= parseInt(k1)) {
                let tempSubField = '合同'+k1.toString();
                tempJson[tempSubField] = l1 || 0;
                tempTotal += parseFloat(tempJson[tempSubField]);
              }

              if(temp_htqdnArray[temp_htqdnArray.length - 1] < parseInt(k1)) {
                let tempSubField = '质保'+k1.toString();
                tempJson[tempSubField] = l1 || 0;
                tempTotal += parseFloat(tempJson[tempSubField]);
              }

            })
          })

        }

        if(item1.name == '硬件材料费') {

          let tempStartDate = _self.state.projectDatas.htqdnArray[0];

          let tempHardwareMaterialCostJson = {};

          _.map(_self.state.budgetDatas.HardwareCostTable.HardwareCostItems, (l1) => {
            let temp_zcbArr = [];
            l1.zcbArr ? temp_zcbArr = l1.zcbArr.split(',') : null;

            _.map(temp_zcbArr, (l2, k2) => {
              let tempSubField = parseInt(tempStartDate)+k2;

              let tempTotalNumbers = parseFloat(tempHardwareMaterialCostJson[tempSubField]) || 0;

              tempTotalNumbers += parseFloat(l2);
              tempHardwareMaterialCostJson[tempSubField] = tempTotalNumbers;

            })

          })

          //分配费用（合同期与质保期，重合年放在前者）(同项目管理费处理)
          _.map(tempHardwareMaterialCostJson, (l1, k1) => {
            _.map(_self.state.projectDatas.htqdnArray, (l2, k2) => {

              let temp_htqdnArray = _self.state.projectDatas.htqdnArray;

              if(temp_htqdnArray[temp_htqdnArray.length - 1] >= parseInt(k1)) {
                let tempSubField = '合同'+k1.toString();
                tempJson[tempSubField] = l1 || 0;
                tempTotal += parseFloat(tempJson[tempSubField]);
              }

              if(temp_htqdnArray[temp_htqdnArray.length - 1] < parseInt(k1)) {
                let tempSubField = '质保'+k1.toString();
                tempJson[tempSubField] = l1 || 0;
                tempTotal += parseFloat(tempJson[tempSubField]);
              }

            })
          })

        }

        if(item1.name == '认证费') {
          tempJson[tempField] = tempCertificationCost_ht_arr[htqdnCounts] || 0;
          tempTotal += parseFloat(tempJson[tempField]);
        }
        if(item1.name == '集成设计费') {
          tempJson[tempField] = tempDesignCost_ht_arr[htqdnCounts] || 0;
          tempTotal += parseFloat(tempJson[tempField]);
        }
        if(item1.name == '风险间接费') {
          tempJson[tempField] = tempIndirectCostQuality_ht_arr[htqdnCounts] || 0;
          tempTotal += parseFloat(tempJson[tempField]);
        }
        if(item1.name == '质保期人工费') {
          tempJson[tempField] = tempLabourCostQuality_ht_arr[htqdnCounts] || 0;
          tempTotal += parseFloat(tempJson[tempField]);
        }
        if(item1.name == '质保期材料费') {
          tempJson[tempField] = tempMaterialCostQuality_ht_arr[htqdnCounts] || 0;
          tempTotal += parseFloat(tempJson[tempField]);
        }
        if(item1.name == '实施人工费') {
          tempJson[tempField] = tempLabourImplement_ht_arr[htqdnCounts] || 0;
          tempTotal += parseFloat(tempJson[tempField]);
        }
        if(item1.name == '物流成本') {
          tempJson[tempField] = tempTransportCost_ht_arr[htqdnCounts] || 0;
          tempTotal += parseFloat(tempJson[tempField]);
        }
        if(item1.name == '财务成本') { //只有合同期内的费用
          tempJson[tempField] = tempFinanceCost_ht_arr[htqdnCounts] || 0;
          tempTotal += parseFloat(tempJson[tempField]);
        }

        ++htqdnCounts;
      })

      //质保期成本
      let zbqCounts = 0;
      _self.state.projectDatas.zbqArray.map((item2, key2) => {

        let tempField = '质保'+item2.toString();

        if(item1.name == '认证费') {
          tempJson[tempField] = tempCertificationCost_zb_arr[zbqCounts] || 0;
          tempTotal += parseFloat(tempJson[tempField]);
        }
        if(item1.name == '集成设计费') {
          tempJson[tempField] = tempDesignCost_zb_arr[zbqCounts] || 0;
          tempTotal += parseFloat(tempJson[tempField]);
        }
        if(item1.name == '风险间接费') {
          tempJson[tempField] = tempIndirectCostQuality_zb_arr[zbqCounts] || 0;
          tempTotal += parseFloat(tempJson[tempField]);
        }
        if(item1.name == '质保期人工费') {
          tempJson[tempField] = tempLabourCostQuality_zb_arr[zbqCounts] || 0;
          tempTotal += parseFloat(tempJson[tempField]);
        }
        if(item1.name == '质保期材料费') {
          tempJson[tempField] = tempMaterialCostQuality_zb_arr[zbqCounts] || 0;
          tempTotal += parseFloat(tempJson[tempField]);
        }
        if(item1.name == '实施人工费') {
          tempJson[tempField] = tempLabourImplement_zb_arr[zbqCounts] || 0;
          tempTotal += parseFloat(tempJson[tempField]);
        }
        if(item1.name == '物流成本') {
          tempJson[tempField] = tempTransportCost_zb_arr[htqdnCounts] || 0;
          tempTotal += parseFloat(tempJson[tempField]);
        }

        ++zbqCounts;
      })

      tempJson.total = tempTotal;

      tempDetailDataSource.push(tempJson);
    })

    /****** 表列 ******/

    let tempDetailColumns = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      className: styles.textAlignCenter
    }, {
      title: '会计科目',
      dataIndex: 'type',
      key: 'type',
      className: styles.textAlignCenter
    }, {
      title: '预算内容',
      dataIndex: 'name',
      key: 'name',
      className: styles.textAlignCenter
    }, {
      title: '编制人',
      dataIndex: 'userName',
      key: 'userName',
      className: styles.textAlignCenter
    }, {
      title: '合计',
      dataIndex: 'total',
      key: 'total',
      className: styles.textAlignRight,
      render: (text) => {
        return text ? <b>￥{desp_toThousands(text)}</b> : <center>/</center>;
      }
    }];

    //合同签署年
    _self.state.projectDatas.htqdnArray.map((item, key) => {
      let tempJson = {};
      let tempField = '合同'+item.toString();

      tempJson.title = item.toString()+'年';
      tempJson.dataIndex = tempField;
      tempJson.key = tempField;
      tempJson.className = styles.textAlignRight;
      tempJson.render = (text) => {
        return text ? '￥'+desp_toThousands(text) : <center>/</center>;
      };

      tempDetailColumns.push(tempJson);
    })

    //质保期
    _self.state.projectDatas.zbqArray.map((item, key) => {
      let tempJson = {};
      let tempField = '质保'+item.toString();

      tempJson.title = '质保期.'+item.toString()+'年';
      tempJson.dataIndex = tempField;
      tempJson.key = tempField;
      tempJson.className = styles.textAlignRight;
      tempJson.render = (text) => {
        return text ? '￥'+desp_toThousands(text) : <center>/</center>;
      };

      tempDetailColumns.push(tempJson);
    })

    _self.setState({
      detailColumns: tempDetailColumns,
      detailDataSource: tempDetailDataSource,
      loading: false
    });

    setTimeout(() => {
      _self.showSummaryTableInfo();
    }, 300)

  },
  switchDetail() {
    this.setState({ isOpenProjectDetail: !this.state.isOpenProjectDetail });
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    return (
      <div>
        <center style={{fontSize:26,marginBottom:15}}>{Cookies.get('presentBelongProjectName')}项目全面预算汇总</center>

        <div className="desp-gray-collapse" onClick={this.switchDetail}>
          <div className="desp-text">1、项目概况</div>
          <div className="desp-right-icon">
            {
              state.isOpenProjectDetail ?
                <Icon type="caret-up" />
              :
                <Icon type="caret-down" />
            }
          </div>
        </div>

        {
          state.isOpenProjectDetail ?
            <QueueAnim type="top">
              <table key="a" className={styles['budget-table-container']}>
                <tbody>
                  <tr>
                    <td className={styles['budget-table-left']}>项目名称：</td>
                    <td className={styles['budget-table-right']}>{state.projectDatas.fullname}</td>
                  </tr>
                  <tr>
                    <td className={styles['budget-table-left']}>项目类型：</td>
                    <td className={styles['budget-table-right']}>{state.projectDatas.htlx}</td>
                  </tr>
                  <tr>
                    <td className={styles['budget-table-left']}>线路长度：</td>
                    <td className={styles['budget-table-right']}>{state.projectDatas.xlcd}KM</td>
                  </tr>
                  <tr>
                    <td className={styles['budget-table-left']}>合同总金额：</td>
                    <td className={styles['budget-table-right']}>￥{desp_toThousands(state.projectDatas.htje)}</td>
                  </tr>
                  <tr>
                    <td className={styles['budget-table-left']}>工程周期：</td>
                    <td className={styles['budget-table-right']}>{state.projectDatas.htgq || 0}个月</td>
                  </tr>
                  <tr>
                    <td className={styles['budget-table-left']}>开始时间：</td>
                    <td className={styles['budget-table-right']}>{moment(state.projectDatas.htkssj).format('YYYY-MM-DD')}</td>
                  </tr>
                  <tr>
                    <td className={styles['budget-table-left']}>分段开通：</td>
                    <td className={styles['budget-table-right']}>{state.projectDatas.Phases.length || 1}段</td>
                  </tr>
                  <tr>
                    <td className={styles['budget-table-left']}>预算总体编制：</td>
                    <td className={styles['budget-table-right']}>{state.projectDatas.sszgs}</td>
                  </tr>
                </tbody>
              </table>
            </QueueAnim>
          :
            null
        }

        <div className="bg-gray">2、项目预算汇总表</div>
        <Table
          dataSource={state.sumDataSource}
          columns={state.sumColumns}
          pagination={false}
          bordered
          loading={state.loading}
          style={{marginBottom:30}}
        />

        <div className="bg-gray">3、项目成本明细</div>
        <Table
          dataSource={state.detailDataSource}
          columns={state.detailColumns}
          pagination={false}
          bordered
          loading={state.loading}
          style={{marginBottom:30}}
        />

      </div>
    )
  }
});

export default BudgetSummary;