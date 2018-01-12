/**
 * 项目管理费
 */
import React from 'react';
import { Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import { Modal, Table, Form, Input, Icon, Spin, Popconfirm, Button, message, DatePicker, Tabs, Tooltip, Radio, Popover } from 'antd';
import styles from '../Common.less';

import {
  showProject,
  getBudgetSummaryTables,
  createManagerCosts,
  updateManagerCost,
  deleteManagerCost,
  updateManagerCostsTable,
  createManagerCostMuti
} from '../../../../services/api';

//ant

const FormItem    = Form.Item;
const confirm     = Modal.confirm;
const RangePicker = DatePicker.RangePicker;
const TabPane     = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup  = Radio.Group;
const ButtonGroup = Button.Group;

//init
let initDatas = [{
  id: '1',
  name: '项目部建设费用',
  isMuti: false,
  subItems: [{
    id: '1.1',
    name: '装修费用'
  }, {
    id: '1.2',
    name: '家具费用'
  }, {
    id: '1.3',
    name: '办公设备费用'
  }]
}, {
  id: '2',
  name: '项目部运营费用',
  isMuti: false,
  subItems: [{
    id: '2.1',
    name: '办公场地租金'
  }, {
    id: '2.2',
    name: '宽带网络、固定电话'
  }, {
    id: '2.3',
    name: '办公费用（包含快递费、清洁维修费、打印费、辅材费）'
  }, {
    id: '2.4',
    name: '物业、水电暖'
  }, {
    id: '2.5',
    name: '劳氏项目部租金'
  }]
}, {
  id: '3',
  name: '车辆费用',
  isMuti: false,
  subItems: [{
    id: '3.1',
    name: '购置及租赁费用'
  }, {
    id: '3.2',
    name: '车辆费-汽油'
  }, {
    id: '3.3',
    name: '车辆费-临时租车费'
  }, {
    id: '3.4',
    name: '车辆费-维修保养费'
  }, {
    id: '3.5',
    name: '车辆费-停车过路费'
  }, {
    id: '3.6',
    name: '车辆费-税费及保险费'
  }]
}, {
  id: '4',
  name: '劳保用品',
  isMuti: false,
  subItems: [{
    id: '4.1',
    name: '安全帽'
  }, {
    id: '4.2',
    name: '绝缘鞋'
  }, {
    id: '4.3',
    name: '反光背心'
  }, {
    id: '4.4',
    name: '耐磨手套'
  }, {
    id: '4.5',
    name: '口罩'
  }, {
    id: '4.6',
    name: '背包'
  }, {
    id: '4.7',
    name: '头灯手电'
  }, {
    id: '4.8',
    name: '工服（春夏工装、冬季冲锋衣）'
  }]
}, {
  id: '5',
  name: '项目日常费用',
  isMuti: false,
  subItems: [{
    id: '5.1',
    name: '通信费'
  }, {
    id: '5.2',
    name: '交通费-出租车'
  }, {
    id: '5.3',
    name: '交通费-飞机火车'
  }, {
    id: '5.4',
    name: '住宿费'
  }, {
    id: '5.5',
    name: '会议费'
  }, {
    id: '5.6',
    name: '餐费（含工作餐）'
  }, {
    id: '5.7',
    name: '慰问品'
  }, {
    id: '5.8',
    name: '出差补助'
  }, {
    id: '5.9',
    name: '租房补助'
  }, {
    id: '5.10',
    name: '高温补助'
  }, {
    id: '5.11',
    name: '母公司人员补助'
  }, {
    id: '5.12',
    name: '其他费用（含北京报销、员工福利费、日常培训费）'
  }]
}, {
  id: '6',
  name: '设计联络',
  isMuti: true,
  subItems: [{
    id: '6.1',
    name: '交通费-飞机火车'
  }, {
    id: '6.2',
    name: '住宿费'
  }, {
    id: '6.3',
    name: '会议费'
  }, {
    id: '6.4',
    name: '餐费'
  }, {
    id: '6.5',
    name: '咨询费'
  }, {
    id: '6.6',
    name: '旅游费'
  }, {
    id: '6.7',
    name: '出差补助'
  }, {
    id: '6.8',
    name: '印刷费'
  }]
}, {
  id: '7',
  name: '与其他专业设计联络',
  isMuti: true,
  subItems: [{
    id: '7.1',
    name: '交通费-飞机火车'
  }, {
    id: '7.2',
    name: '住宿费'
  }, {
    id: '7.3',
    name: '会议费'
  }, {
    id: '7.4',
    name: '餐费'
  }, {
    id: '7.5',
    name: '咨询费'
  }, {
    id: '7.6',
    name: '出差补助'
  }]
}, {
  id: '8',
  name: '工厂监造',
  isMuti: true,
  subItems: [{
    id: '8.1',
    name: '交通费-飞机火车'
  }, {
    id: '8.2',
    name: '住宿费'
  }, {
    id: '8.3',
    name: '会议费'
  }, {
    id: '8.4',
    name: '餐费'
  }, {
    id: '8.5',
    name: '咨询费'
  }, {
    id: '8.6',
    name: '出差补助'
  }]
}, {
  id: '9',
  name: '工厂验收',
  isMuti: true,
  subItems: [{
    id: '9.1',
    name: '交通费-飞机火车'
  }, {
    id: '9.2',
    name: '住宿费'
  }, {
    id: '9.3',
    name: '会议费'
  }, {
    id: '9.4',
    name: '餐费'
  }, {
    id: '9.5',
    name: '咨询费'
  }, {
    id: '9.6',
    name: '出差补助'
  }]
}, {
  id: '10',
  name: '国内培训费',
  isMuti: true,
  subItems: [{
    id: '10.1',
    name: '交通费-飞机火车'
  }, {
    id: '10.2',
    name: '住宿费'
  }, {
    id: '10.3',
    name: '会议费'
  }, {
    id: '10.4',
    name: '餐费'
  }, {
    id: '10.5',
    name: '培训杂费'
  }]
}, {
  id: '11',
  name: '国外培训费',
  isMuti: true,
  subItems: [{
    id: '11.1',
    name: '交通费-飞机火车'
  }, {
    id: '11.2',
    name: '住宿费'
  }, {
    id: '11.3',
    name: '会议费'
  }, {
    id: '11.4',
    name: '餐费'
  }, {
    id: '11.5',
    name: '培训杂费'
  }]
}];

//main
let ProjectManageCost = React.createClass({
  getInitialState() {
    return {
      loading: true,
      visible: false,
      reloadChecked: 0, //检查渲染条件
      projectDatas: {
        htkssj: null,
        htzzsj: null
      },
      managerCostsTableId: '', //管理费主键
      selectedItem: '', //被选中的条目
      subModal: '',
      startDate: new Date('2015-02-08'),
      endDate: new Date('2019-03-09'),
      endOpen: false,
      dataSource: [],
      columnDatas: [],
      budgetCostDatas: {}, //预算费
      monthDetailContent: '', //月份内详情
    };
  },
  componentDidMount() {
    this.showProjectInfo();
    this.showBudgetSummaryTables();
  },
  componentWillUpdate(nextProps, nextState) {
    //更新组件
    if(nextState.reloadChecked != this.state.reloadChecked) {
      this.setState({ loading: true });
      this.showBudgetSummaryTables();
    }
  },
  onChildChanged(newState){
    //监听子组件的状态变化
    this.setState({ reloadChecked: newState });
  },
  showProjectInfo() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("获取项目失败，请切换项目！");

    showProject(projectId).then((res) => {

      let datas = res.jsonResult.project;
      if(!datas.htkssj || !datas.htzzsj || !datas.zbq) return message.warning("获取合同起止时间失败，请联系项目管理工程师！");

      let tempStartDate = moment(datas.htkssj).format('YYYY') + '-01-01';
      let tempEndDate = moment(datas.htzzsj).add(datas.zbq, 'y').format('YYYY') + '-12-31';

      let tempProjectDatas = {
        htkssj: new Date(tempStartDate),
        htzzsj: new Date(tempEndDate)
      };

      _self.setState({ projectDatas: tempProjectDatas });

    })
  },

  /* 时间范围开始 */
  //周期范围在合同起止时间年度及质保期以内（2015-01-01 到 2019-12-31）
  disabledStartDate(startValue) {
    if (!startValue || !this.state.endDate) {
      return false;
    }
    return startValue.getTime() >= this.state.endDate.getTime() || startValue.getTime() <= this.state.projectDatas.htkssj.getTime();
  },
  disabledEndDate(endValue) {
    if (!endValue || !this.state.startDate) {
      return false;
    }
    return endValue.getTime() <= this.state.startDate.getTime() || endValue.getTime() >= this.state.projectDatas.htzzsj.getTime();
  },
  handleBudgetDateChange(field, value) {
    let _self = this;

    if(field == 'startDate') {

      _self.setState({ startDate: value });

    }else if(field == 'endDate') {

      _self.setState({ endDate: value });

      setTimeout(() => {
        if(_self.state.startDate && _self.state.endDate) {

          confirm({
            title: 'dES提示',
            content: '确定需要改变预算周期吗？',
            onOk() {
              setTimeout(() => {
                _self.setState({ loading: true });
                _self.modifyManagerCostsDateRange();
              }, 500)
            },
            onCancel() {},
          });

        }
      }, 500)

    }

  },
  handleHandleToggle(value, { open }) {
    if(value == 'startDate' && !open) this.setState({ endOpen: true });
    if(value == 'endDate') this.setState({ endOpen: open });
  },
  /* 时间范围结束 */

  modifyManagerCostsDateRange() {
    let _self = this;

    if(!_self.state.managerCostsTableId) return message.warning("获取管理费主键失败！");
    if(!_self.state.startDate || !_self.state.endDate) return message.warning("获取预算周期失败！");

    let tempStartDate = moment(_self.state.startDate).format('YYYY-MM-DD') + ' 08:00:00'; //从选择的当天开始
    let tempEndDate = moment(_self.state.endDate).format('YYYY-MM-DD') + ' 23:59:59';

    let datas = {
      beginDate: tempStartDate,
      endDate: tempEndDate
    };

    updateManagerCostsTable(_self.state.managerCostsTableId, JSON.stringify(datas)).then((res) => {
      message.success('修改【项目管理费】预算周期成功！');
      _self.showTableHeader(); //直接用本地数据渲染，不用再获取一次
    })
  },
  showBudgetSummaryTables() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("请选择归属项目或部门！");

    //获取已知数据
    getBudgetSummaryTables(projectId).then((res) => {
      let datas = res.jsonResult.budgetTable.ManagerCostsTable;

      let tempGroupByLevelOne = _.groupBy(datas.ManagerCosts, (item) => {return item.levelOneName});

      let tempGroupByLevelTwo = {};
      _.map(tempGroupByLevelOne, (item, key) => {
        let tempArray = _.groupBy(item, (l) => {return l.levelTwoName});
        tempGroupByLevelTwo[key] = tempArray;
      })

      /**
       * 每一项按月份输出
       * @type {Array}
       * [{
       *   一级类别: {
       *     二级类别: [{
       *       2016年02月: '',
       *       ...
       *     }]
       *     ...
       *   }
       *   ...
       * }]
       */

      // console.log('tempGroupByLevelTwo', tempGroupByLevelTwo)

      let tempLists = [];

      _.map(tempGroupByLevelTwo, (item1, key1) => {
        //二级类别下的所有产生的费用（日期）
        let tempLevelOneJson = {};
        let tempListJson = {};

        _.map(item1, (item2, key2) => {

          let tempListArray = [];

          _.map(item2, (item3, key3) => {
            //查询在预算周期里的费用

            if(item3.type == '单次') {
              //检查时间是否在预算的起止时间内
              if(moment(item3.startDate).isBefore(datas.beginDate) || moment(item3.startDate).isAfter(datas.endDate)) return false;

              let tempJson = {};

              tempJson.type = item3.type;
              tempJson.levelOneName = item3.levelOneName;
              tempJson.levelTwoName = item3.levelTwoName;
              tempJson.cost = item3.cost;
              tempJson.period = item3.period;
              tempJson.interval = item3.interval;
              tempJson.startDate = moment(item3.startDate).format('YYYY-MM-DD');
              tempJson.endDate = item3.endDate;
              tempJson.realStartDate = item3.startDate;
              tempJson.realEndDate = item3.endDate;
              tempJson.realId = item3.id;
              tempJson.note = item3.note;

              tempListArray.push(tempJson);

            }else if(item3.type == '周期') {

              let lastDate = item3.startDate;
              let endDate = item3.endDate;

              if(item3.period == 'day') {

                while(1) {
                  //检查时间是否在预算的起止时间内
                  if(moment(lastDate).isBefore(datas.beginDate) || moment(lastDate).isAfter(datas.endDate)) break;

                  let tempJson = {};

                  tempJson.type = item3.type;
                  tempJson.levelOneName = item3.levelOneName;
                  tempJson.levelTwoName = item3.levelTwoName;
                  tempJson.cost = item3.cost;
                  tempJson.period = item3.period;
                  tempJson.interval = item3.interval;
                  tempJson.startDate = moment(lastDate).format('YYYY-MM-DD');
                  tempJson.endDate = lastDate;
                  tempJson.realStartDate = item3.startDate;
                  tempJson.realEndDate = item3.endDate;
                  tempJson.realId = item3.id;
                  tempJson.note = item3.note;

                  tempListArray.push(tempJson);

                  lastDate = moment(lastDate).add(item3.interval, 'd');

                  if(moment(lastDate).isAfter(endDate)) break;
                }

              }else if(item3.period == 'month') {

                 while(1) {
                  //检查时间是否在预算的起止时间内
                  if(moment(lastDate).isBefore(datas.beginDate) || moment(lastDate).isAfter(datas.endDate)) break;

                  let tempJson = {};

                  tempJson.type = item3.type;
                  tempJson.levelOneName = item3.levelOneName;
                  tempJson.levelTwoName = item3.levelTwoName;
                  tempJson.cost = item3.cost;
                  tempJson.period = item3.period;
                  tempJson.interval = item3.interval;
                  tempJson.startDate = moment(lastDate).format('YYYY-MM-DD');
                  tempJson.endDate = lastDate;
                  tempJson.realStartDate = item3.startDate;
                  tempJson.realEndDate = item3.endDate;
                  tempJson.realId = item3.id;
                  tempJson.note = item3.note;

                  tempListArray.push(tempJson);

                  lastDate = moment(lastDate).add(item3.interval, 'M');

                  if(moment(lastDate).isAfter(endDate)) break;
                }

              }

            }

          })

          tempListJson[item2[0].levelTwoName] = tempListArray;

        })

        tempLevelOneJson[key1] = tempListJson;
        tempLists.push(tempLevelOneJson);

      })

      // console.log('tempLists', tempLists)

      //类别按照（一级:二级:月份）输出
      let tempBudgetLevelOneJson = {};

      _.map(tempLists, (list1, key1) => {
        //一级
        _.map(list1, (list2, key2) => {
          //二级
          let tempBudgetLevelTwoJson = {};

          _.map(list2, (list3, key3) => {

            let tempGroupByMonth = _.groupBy(list3, (item) => {return moment(item.startDate).format('YYYY年MM月') });

            tempBudgetLevelTwoJson[key3] = tempGroupByMonth;
          })

          tempBudgetLevelOneJson[key2] = tempBudgetLevelTwoJson;

        })
      })

      // console.log('tempBudgetLevelOneJson', tempBudgetLevelOneJson)

      _self.setState({
        managerCostsTableId: datas.id,
        budgetCostDatas: tempBudgetLevelOneJson,
        startDate: new Date(datas.beginDate),
        endDate: new Date(datas.endDate)
      });

      //显示表头
      _self.showTableHeader();

    })
  },
  showModalContainerAtMuti(value, initValues) {
    //initValues ==> initDatas
    //重大活动
    let rangeDate = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    };

    this.setState({
      subModal: <CreateMutiBudget datas={value} rangeDate={rangeDate} initValues={initValues} visible={true} callbackParent={this.onChildChanged} initialChecked={this.state.reloadChecked} />
    });
  },
  showModalContainer(value) {
    this.setState({
      subModal: <CreateBudget datas={value} visible={true} callbackParent={this.onChildChanged} initialChecked={this.state.reloadChecked} />
    });
  },
  showTableHeader() {
    let _self = this;

    //检查表列显示条件
    if(!_self.state.startDate && !_self.state.endDate) return message.warning("请选择预算时间范围！");

    let startDate = moment(_self.state.startDate).format('YYYY-MM-DD');
    let endDate = moment(_self.state.endDate).format('YYYY-MM-DD');

    let tempColumnDatas = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      className: styles.width50,
      // fixed: 'left',
      render: (text, record) => {
        if(record.levelOne) {
          return <b className="text-warning">{text}</b>;
        }else {
          return text;
        }
      }
    }, {
      title: '项目',
      dataIndex: 'type',
      key: 'type',
      className: styles.width150,
      // fixed: 'left',
      render: (text, record) => {
        if(record.levelOne || record.isSumShow) {
          if(record.levelOne && record.isMuti) {
            //一级分类（重大活动）
            return (
              <div>
                <Tooltip placement="left" title="新增预算">
                  <a onClick={_self.showModalContainerAtMuti.bind(null, record, initDatas)}><Icon type="plus-circle" /></a>
                </Tooltip>&nbsp;
                <b className="text-warning">{text}</b>
              </div>
            );
          }
          //一级分类（非重大活动）
          return <b className="text-warning">{text}</b>;

        }else if(!record.levelOne && !record.isMuti) {
          //二级分类（非重大活动）
          return (
            <div>
              <Tooltip placement="left" title="新增预算">
                <a onClick={_self.showModalContainer.bind(null, record)}><Icon type="plus-circle" /></a>
              </Tooltip>&nbsp;
              {text}
            </div>
          );
        }else {
          //二级分类（重大活动）
          return text;
        }
      }
    }];

    //时间差
    let monthDiff = desp_dateDiffForMonths(startDate, endDate);

    //月份列
    for (var i = 0; i < monthDiff; i++) {

      let tempJson = {};

      let lastDate = moment(startDate).add(i, 'M');
      let lastYear = moment(lastDate).format('YYYY');
      let lastMonth = moment(lastDate).format('MM');

      let tempField = lastYear+'年'+lastMonth+'月';

      tempJson.title = tempField;
      tempJson.dataIndex = tempField;
      tempJson.key = tempField;
      tempJson.render = (text, record) => {
        if(record.levelOne || record.isSumShow) {
          return <center><b className="text-warning">{text ? '￥'+desp_toThousands(text) : '/'}</b></center>;
        }else {

          return (
            <center>
              {
                text ?
                  <Popover content={_self.state.monthDetailContent} trigger="hover">
                    <span onMouseOver={_self.showDetailForMonth.bind(null, record, tempField)} className="desp-link" title="查看详情">￥{desp_toThousands(text)}</span>
                  </Popover>
                :
                  '/'
              }
            </center>
          );
        }
      };

      tempColumnDatas.push(tempJson);

      //年度合计
      if(moment(lastDate).format('MM') == 12) {

        let tempTotalJson = {};
        let tempTotalField = lastYear+'年合计';

        tempTotalJson.title = tempTotalField;
        tempTotalJson.dataIndex = tempTotalField;
        tempTotalJson.key = tempTotalField;
        tempTotalJson.render = (text, record) => {
          if(record.levelOne || record.isSumShow) {
            return <center><b className="text-warning">{text ? '￥'+desp_toThousands(text) : '/'}</b></center>;
          }else {
            return <center><b>{text ? '￥'+desp_toThousands(text) : '/'}</b></center>
          }
        };

        tempColumnDatas.push(tempTotalJson);
      }else if(i == monthDiff - 1) {
        //最后一年的合计
        let tempTotalJson = {};
        let tempTotalField = lastYear+'年合计';

        tempTotalJson.title = tempTotalField;
        tempTotalJson.dataIndex = tempTotalField;
        tempTotalJson.key = tempTotalField;
        tempTotalJson.render = (text, record) => {
          if(record.levelOne || record.isSumShow) {
            return <center><b className="text-warning">{text ? '￥'+desp_toThousands(text) : '/'}</b></center>;
          }else {
            return <center><b>{text ? '￥'+desp_toThousands(text) : '/'}</b></center>
          }
        };

        tempColumnDatas.push(tempTotalJson);
      }

    }

    _self.setState({ columnDatas: tempColumnDatas });

    setTimeout(() => {
      _self.showTableBody();
    }, 500)
  },
  showDetailForMonth(value, field) {
    let _self = this;
    let tempMonthArray;

    _.map(_self.state.budgetCostDatas, (item1, key1) => {
      if(key1 == value.levelOneName) {
        _.map(item1, (item2, key2) => {
          if(key2 == value.levelTwoName) {
            _.map(item2, (item3, key3) => {
              if(key3 == field) tempMonthArray = item3;
            })
          }
        })
      }
    })

    let content = (
          <div>
            <div style={{marginBottom:10}}>
              <b>{value.levelOneName}&nbsp;-&nbsp;{value.levelTwoName}&nbsp;-&nbsp;{field}</b>
            </div>
            <ul>
              {
                _.map(tempMonthArray, (item, key) => {
                  let tempPeriod;

                  switch(item.period) {
                    case 'day':
                      tempPeriod = '天';
                    break;
                    case 'month':
                      tempPeriod = '个月';
                    break;
                  }

                  return (
                    <li key={key}>
                      <div className={styles['desp-budget-mask-container']}>
                        <div className={styles['icon-box']}>
                          <Icon onClick={_self.modifyRecordItem.bind(null, item)} className={styles['icon']} type="edit" />
                          <Icon onClick={_self.deleteRecordItem.bind(null, item)} className={styles['icon']} type="cross-circle" />
                        </div>
                        {key+1}、
                        <b>{'￥'+desp_toThousands(item.cost)}</b>&nbsp;
                        {
                          item.type == '单次'?
                            <span>
                              单次<span className="text-gray">【{moment(item.realStartDate).format('YYYY.MM.DD')}】</span>
                            </span>
                          :
                            <span>
                              周期（{item.interval+tempPeriod}）
                              <span className="text-gray">【{moment(item.realStartDate).format('YYYY.MM.DD')} - {moment(item.realEndDate).format('YYYY.MM.DD')}】</span>
                            </span>
                        }
                        <p className="text-gray">{item.note}</p>
                      </div>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        );

    this.setState({
      monthDetailContent: content
    });
  },
  showTableBody() {
    let _self = this;
    let tempDataSource = [];
    let tempColumns = {};

    //月份及年度合计 列
    _.map(_self.state.columnDatas, (item, key) => {
      if(key > 1) tempColumns[item.dataIndex] = '';
    })

    // console.log(_self.state.budgetCostDatas)

    /**
     * 1、横向数据处理（月合计、年度合计）
     */

    //初始数据（一级）
    _.map(initDatas, (initItem1) => {

      let tempArrayOfLevelOne = [];
      let tempArrayOfLevelTwo = [];

      //初始数据（二级）
      _.map(initItem1.subItems, (initItem2) => {

        let tempJsonOfLevelTwo = desp_deepCopy(tempColumns); //赋值表列

        //汇总记录（二级）
        tempJsonOfLevelTwo.id = initItem2.id;
        tempJsonOfLevelTwo.type = initItem2.name;
        tempJsonOfLevelTwo.levelOne = '';
        tempJsonOfLevelTwo.isMuti = initItem1.isMuti; //继承父（重大活动标识）
        tempJsonOfLevelTwo.levelOneName = initItem1.name;
        tempJsonOfLevelTwo.levelTwoName = initItem2.name;

        //查找对应的记录
        _.map(_self.state.budgetCostDatas, (item1, key1) => {
          //一级
          if(initItem1.name == key1) {
            _.map(item1, (item2, key2) => {
              //二级
              if(initItem2.name == key2) {
                
                let totalMoneyByLevelOneYear = 0; //年度合计
                let tempJson = desp_deepCopy(tempColumns);

              _.map(tempJson, (item11, key11) => {

                _.map(item2, (item3, key3) => {
                  //输出每月的费用数组

                    if(key3 == key11) {
                      //月合计

                      let totalMoneyByLevelOneMonth = 0; //月份合计
                      _.map(item3, (item4, key4) => {
                        //计算每月的花费金额
                        totalMoneyByLevelOneMonth += parseFloat(item4.cost);
                      })

                      tempJsonOfLevelTwo[key3] = totalMoneyByLevelOneMonth; //覆盖，重新赋值
                      totalMoneyByLevelOneYear += totalMoneyByLevelOneMonth; //年度合计累加

                    }

                  })

                  if(key11.substr(key11.length - 3, 3) == '年合计') {
                    //年度合计
                    tempJsonOfLevelTwo[key11] = totalMoneyByLevelOneYear;
                    totalMoneyByLevelOneYear = 0;
                  }

                })

              }
            }) //二级
          }

        }) //一级

        tempArrayOfLevelTwo.push(tempJsonOfLevelTwo); //二级合计

      })

      tempDataSource = _.concat(tempDataSource, tempArrayOfLevelTwo);

    })

    /**
     * 2、纵向数据处理（一级合并、纵向列总计）
     */
    
    let tempSource = [];

    _.map(initDatas, (item1) => {
      //分类（初始数据）

      let tempLevelOneArray = [];
      let tempLevelOneJson = desp_deepCopy(tempColumns); //赋值表列

      let tempLevelTwoArray = [];

      _.map(tempDataSource, (item2) => {
        //一级分类开始

        if(item1.name == item2.levelOneName) {

          //循环查找一级分类每列的合计
          let tempJson = desp_deepCopy(tempColumns); //赋值表列

          _.map(tempJson, (item3, key3) => {

            //1、
            let tempLevelTwoTotalNumber; //过渡防止值为空字符
            item2[key3] ? tempLevelTwoTotalNumber = parseFloat(item2[key3]): tempLevelTwoTotalNumber = 0;

            //2、
            let tempLevelOneTotalNumber;//过渡防止值为空字符
            tempLevelOneJson[key3] ? tempLevelOneTotalNumber = parseFloat(tempLevelOneJson[key3]) : tempLevelOneTotalNumber = 0;
            tempLevelOneTotalNumber += tempLevelTwoTotalNumber;

            //一级分类每列合计
            tempLevelOneJson[key3] = tempLevelOneTotalNumber;

          })

          tempLevelTwoArray.push(item2);

        }

      }) //一级分类结束


      //汇总记录（一级）
      tempLevelOneJson.id = item1.id;
      tempLevelOneJson.type = item1.name;
      tempLevelOneJson.levelOne = item1.name;
      tempLevelOneJson.isMuti = item1.isMuti; //重大活动操作标识
      tempLevelOneJson.levelOneName = item1.name;
      tempLevelOneJson.levelTwoName = '';

      tempLevelOneArray.push(tempLevelOneJson);

      tempSource = _.concat(tempSource, _.concat(tempLevelOneArray, tempLevelTwoArray))
    })

    //总合计（里面只有一条数据）
    let tempTotalSumJson = desp_deepCopy(tempColumns); //赋值表列

    _.map(initDatas, (item1) => {
      _.map(tempSource, (item2, key2) => {
        if(item1.name == item2.levelOne) {
          _.map(item2, (item3, key3) => {

            if(key3.substr(key3.length - 1, 1) == '月' || key3.substr(key3.length - 3, 3) == '年合计') {

              let tempTotalNumber = 0;
              item3 ? tempTotalNumber += parseFloat(item3) : null;

              let tempSumTotalNumber = tempTotalSumJson[key3];
              tempSumTotalNumber ? tempSumTotalNumber = parseFloat(tempSumTotalNumber) + tempTotalNumber : tempSumTotalNumber = tempTotalNumber;

              tempTotalSumJson[key3] = tempSumTotalNumber;

            }

          })
        }
      })
    })

    tempTotalSumJson.type = '合计'; //总合计初始值
    tempTotalSumJson.isSumShow = true;

    //总合计处理结果
    tempSource.push(tempTotalSumJson);

    _self.setState({
      dataSource: tempSource,
      loading: false
    });
  },
  modifyRecordItem(value) {
    let rangeDate = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    };
    this.setState({
      subModal: <ModifyBudget datas={value} rangeDate={rangeDate} visible={true} callbackParent={this.onChildChanged} initialChecked={this.state.reloadChecked} />
    });
  },
  deleteRecordItem(value) {
    let _self = this;
    if(!value.realId) return message.warning('获取预算记录信息失败！');

    confirm({
      title: 'dES提示',
      content: '若是周期预算，将会删除整个周期的预算，确定还需要删除【'+value.levelOneName+' - '+value.levelTwoName+'】预算吗？',
      onOk() {

        deleteManagerCost(value.realId).then((res) => {
          message.success('删除预算成功！');
          setTimeout(() => {
            _self.setState({ loading: true });
            _self.showBudgetSummaryTables(); //直接用本地数据渲染，不用再获取一次
          }, 500)
        })

      },
      onCancel() {},
    });
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    return (
      <div>

        <div>
          预算周期：
          <DatePicker
            disabledDate={this.disabledStartDate}
            value={this.state.startDate}
            placeholder="开始日期"
            onChange={this.handleBudgetDateChange.bind(null, 'startDate')}
            toggleOpen={this.handleHandleToggle.bind(null, 'startDate')}
          />
          <DatePicker
            disabledDate={this.disabledEndDate}
            value={this.state.endDate}
            placeholder="结束日期"
            onChange={this.handleBudgetDateChange.bind(null, 'endDate')}
            open={this.state.endOpen}
            toggleOpen={this.handleHandleToggle.bind(null, 'endDate')}
            style={{marginLeft:10}}
          />
        </div>

        <div style={{marginTop:15,color:'#CCC'}}>编制部门：{Cookies.get('presentBelongProjectName')}</div>

        <Table
          dataSource={state.dataSource}
          columns={state.columnDatas}
          loading={state.loading}
          pagination={false}
          size="middle"
          bordered
          scroll={{ x: state.columnDatas.length*100 }}
        />
        {/*
          state.columnDatas.length*100
          y: document.body.clientHeight - 130
        */}
        <div style={{margin:'15px 0'}}>当前共有记录 <span className="text-danger">{state.dataSource.length == 0 ? 0 : state.dataSource.length - 1}</span> 条</div>

        {state.subModal}

      </div>
    );
  }
});

//创建预算
let CreateBudget = React.createClass({
  getInitialState() {
    return {
      loading: false,
      reloadChecked: this.props.initialChecked || 0, //用于父组件更新
      visible: this.props.visible || true,
      budgetDatas: this.props.datas,
      selectedCycle: '月', //选择的周期
      startValue: null, //周期选择开始时间
      endValue: null, //周期选择结束时间
    };
  },
  componentDidMount() {
    this.setState({ budgetDatas: this.props.datas });
  },
  componentWillReceiveProps(nextProps) {
    this.setState({ visible: nextProps.visible });
    if(nextProps.initialChecked != this.props.initialChecked) this.setState({ reloadChecked: nextProps.initialChecked });
    if(nextProps.datas != this.props.datas) this.setState({ budgetDatas: nextProps.datas });
  },
  handleCancel() {
    this.setState({ visible: false });
  },
  selectCycle(e) {
    this.setState({ selectedCycle: e });
  },

  /* 时间选择开始 */
  disabledStartDate(startValue) {
    if (!startValue || !this.state.endValue) {
      return false;
    }
    return startValue.getTime() >= this.state.endValue.getTime();
  },
  disabledEndDate(endValue) {
    if (!endValue || !this.state.startValue) {
      return false;
    }
    return endValue.getTime() <= this.state.startValue.getTime();
  },
  handleCycleChange(field, value) {
    this.setState({
      [field]: value,
    });
  },
  handleStartToggle({ open }) {
    if (!open) {
      this.setState({ endOpen: true });
    }
  },
  handleEndToggle({ open }) {
    this.setState({ endOpen: open });
  },
  /* 时间选择结束 */

  handleSubmit(budgetType, submitType) {
    let _self = this;
    let presentProjectId = Cookies.get('presentBelongProjectId');
    if(!presentProjectId) return message.warning("获取项目失败，请切换项目！");

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      //获取预算时间范围，转成2017-01-01
      let tempBudgetRange = [];
      let tempArray = [];
      _.map(_self.state.budgetDatas, (item, key) => {
        if(key.substr(key.length - 1, 1) == '月') tempArray.push(key);
      })

      let tempStartDate = _.head(tempArray);
      let tempEndDate = _.last(tempArray);
      let tempDaysOfEndDate = moment(tempEndDate.substr(0,4)+'-'+tempEndDate.substr(5,2)).daysInMonth(); //最后一个月天数

      tempEndDate = tempEndDate.substr(0,4)+'-'+tempEndDate.substr(5,2)+'-'+tempDaysOfEndDate;

      tempBudgetRange.push(new Date(tempStartDate.substr(0,4)+'-'+tempStartDate.substr(5,2)+'-01')); //起始时间
      tempBudgetRange.push(new Date(tempEndDate)); //截止时间

      if(tempBudgetRange.length < 2) return message.warning("获取预算时间范围失败！");

      //周期类型
      let tempPeriod;
      let tempInterval = 0;

      switch(_self.state.selectedCycle) {
        case '日':
          tempPeriod = 'day';
        break;
        case '月':
          tempPeriod = 'month';
          tempInterval = 1;
        break;
        case '季度':
          tempPeriod = 'month';
          tempInterval = 3;
        break;
        case '半年':
          tempPeriod = 'month';
          tempInterval = 6;
        break;
        case '年':
          tempPeriod = 'month';
          tempInterval = 12;
        break;
      }

      //数据准备
      let datas = {};

      if(budgetType == 'onlyone') {

        if(!formDatas.note || !formDatas.money || !formDatas.dateTime) return message.warning("请完善相应信息！");
        if(moment(formDatas.dateTime).isBefore(tempBudgetRange[0]) || moment(formDatas.dateTime).isAfter(tempBudgetRange[1])) return message.warning("您的预算时间范围有误，请重新选择！");

        datas = {
          note: formDatas.note,
          type: '单次',
          period: tempPeriod,
          interval: 0,
          cost: formDatas.money,
          levelOneName: _self.state.budgetDatas.levelOneName,
          levelTwoName: _self.state.budgetDatas.levelTwoName,
          startDate: formDatas.dateTime,
          endDate: formDatas.dateTime
        };
      }else if(budgetType == 'more') {

        if(!formDatas.cycleNote || !_self.state.startValue || !_self.state.endValue || !formDatas.cycleMoney) return message.warning("请完善相应信息！");
        if(moment(_self.state.startValue).isBefore(tempBudgetRange[0]) || moment(_self.state.endValue).isAfter(tempBudgetRange[1])) return message.warning("您的预算时间范围有误，请重新选择！");

        datas = {
          note: formDatas.cycleNote,
          type: '周期',
          period: tempPeriod,
          interval: tempInterval,
          cost: formDatas.cycleMoney,
          levelOneName: _self.state.budgetDatas.levelOneName,
          levelTwoName: _self.state.budgetDatas.levelTwoName,
          startDate: _self.state.startValue,
          endDate: _self.state.endValue
        };
      }

      let newState = ++_self.state.reloadChecked;

      _self.setState({ reloadChecked: newState, loading: true });

      createManagerCosts(presentProjectId, JSON.stringify(datas)).then((res) => {
        message.success("预算添加成功！");
        _self.props.callbackParent(newState);
        _self.props.form.resetFields();
        submitType == 'next' ? _self.setState({ loading: false }) : _self.setState({ loading: false, visible: false });
      })

    })
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    const { getFieldProps } = props.form;
    const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 14 },
        };

    return (
      <span>
        <Modal
          ref="modal"
          title=''
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer=""
        >
          <Spin spinning={state.loading}>

            <div style={{marginBottom:15,fontSize:16,fontWeight:600}}>
              {state.budgetDatas.levelOneName} - {state.budgetDatas.levelTwoName}
              <span style={{fontSize:12,color:'#CCC',marginLeft:5}}>预算</span>
            </div>

            <Tabs type="card">
              <TabPane tab={<span style={{fontSize:13}}>单次预算</span>} key="1">

                <Form horizontal form={props.form}>
                  <FormItem
                    {...formItemLayout}
                    label="时间"
                  >
                    <DatePicker {...getFieldProps('dateTime')} />
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="金额"
                  >
                    <Input {...getFieldProps('money', {initialValue: '',rules: [{pattern: /^(([1-9][0-9]{0,20})|([0-9]+\.[0-9]{1,2}))$/,type:'string',message:'预算金额，注意格式：0.00'}]} )} placeholder="输入预算金额"/>
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="备注"
                  >
                    <Input type="textarea" {...getFieldProps('note', {initialValue: ''} )} placeholder="输入预算备注"/>
                  </FormItem>
                  <FormItem wrapperCol={{ span: 18, offset: 6 }} style={{ marginTop: 24 }}>
                    <Popconfirm title="确定要提交该预算吗？" onConfirm={this.handleSubmit.bind(null, 'onlyone', 'over')}>
                      <Button type="primary">提交预算</Button>
                    </Popconfirm>
                    <Popconfirm title="确定要提交该预算并继续创建下一条吗？" onConfirm={this.handleSubmit.bind(null, 'onlyone', 'next')}>
                      <Button type="dashed" style={{marginLeft:5}}>提交并创建下一条</Button>
                    </Popconfirm>
                  </FormItem>
                </Form>

              </TabPane>
              <TabPane tab={<span style={{fontSize:13}}>周期预算</span>} key="2">

                <div style={{paddingLeft:'13%',marginBottom:15}}>
                  <div>
                    起止时间：
                    <DatePicker
                      disabledDate={this.disabledStartDate}
                      value={this.state.startValue}
                      placeholder="开始日期"
                      onChange={this.handleCycleChange.bind(null, 'startValue')}
                      toggleOpen={this.handleStartToggle}
                      style={{width:120}}
                    />&nbsp;-&nbsp;
                    <DatePicker
                      disabledDate={this.disabledEndDate}
                      value={this.state.endValue}
                      placeholder="结束日期"
                      onChange={this.handleCycleChange.bind(null, 'endValue')}
                      open={this.state.endOpen}
                      toggleOpen={this.handleEndToggle}
                      style={{width:120}}
                    />
                  </div>
                  <div style={{marginTop:10,}}>
                    发生周期：
                    <ButtonGroup>
                      <Button onClick={this.selectCycle.bind(null, '日')} size="small" type={state.selectedCycle == '日' ? 'primary' : null}>日</Button>
                      <Button onClick={this.selectCycle.bind(null, '月')} size="small" type={state.selectedCycle == '月' ? 'primary' : null}>月</Button>
                      <Button onClick={this.selectCycle.bind(null, '季度')} size="small" type={state.selectedCycle == '季度' ? 'primary' : null}>季度</Button>
                      <Button onClick={this.selectCycle.bind(null, '半年')} size="small" type={state.selectedCycle == '半年' ? 'primary' : null}>半年</Button>
                      <Button onClick={this.selectCycle.bind(null, '年')} size="small" type={state.selectedCycle == '年' ? 'primary' : null}>年</Button>
                    </ButtonGroup>
                  </div>
                </div>

                <Form horizontal form={props.form}>
                  <FormItem
                    {...formItemLayout}
                    label="金额"
                  >
                    <Input {...getFieldProps('cycleMoney', {initialValue: '',rules: [{pattern: /^(([1-9][0-9]{0,20})|([0-9]+\.[0-9]{1,2}))$/,type:'string',message:'预算金额，注意格式：0.00'}]} )} placeholder="输入预算金额"/>
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="备注"
                  >
                    <Input type="textarea" {...getFieldProps('cycleNote', {initialValue: ''} )} placeholder="输入预算备注"/>
                  </FormItem>
                  <FormItem wrapperCol={{ span: 18, offset: 6 }} style={{ marginTop: 24 }}>
                    <Popconfirm title="确定要提交该预算吗？" onConfirm={this.handleSubmit.bind(null, 'more', 'over')}>
                      <Button type="primary">提交预算</Button>
                    </Popconfirm>
                    <Popconfirm title="确定要提交该预算并继续创建下一条吗？" onConfirm={this.handleSubmit.bind(null, 'more', 'next')}>
                      <Button type="dashed" style={{marginLeft:5}}>提交并创建下一条</Button>
                    </Popconfirm>
                  </FormItem>
                </Form>
              </TabPane>
            </Tabs>

          </Spin>
        </Modal>
      </span>
    )
  }
}); /****** 创建预算结束 ******/

//修改预算
let ModifyBudget = React.createClass({
  getInitialState() {
    return {
      loading: false,
      reloadChecked: this.props.initialChecked || 0, //用于父组件更新
      visible: this.props.visible || true,
      budgetDatas: this.props.datas,
      rangeDate: this.props.rangeDate,
      selectedCycle: '', //选择的周期
      startValue: null, //周期选择开始时间
      endValue: null, //周期选择结束时间
      selectedCycleHTML: '',
    };
  },
  componentDidMount() {
    this.setState({ budgetDatas: this.props.datas });
    this.handleInitState(this.props.datas);
  },
  componentWillReceiveProps(nextProps) {
    this.setState({ visible: nextProps.visible });
    if(nextProps.initialChecked != this.props.initialChecked) this.setState({ reloadChecked: nextProps.initialChecked });
    if(nextProps.datas != this.props.datas) {
      this.setState({ budgetDatas: nextProps.datas });
      this.handleInitState(nextProps.datas);
    }
    if(nextProps.rangeDate != this.props.rangeDate) this.setState({ rangeDate: nextProps.rangeDate });
  },
  handleCancel() {
    this.setState({ visible: false });
  },
  selectCycle(e) {
    this.setState({ selectedCycle: e });
  },
  handleInitState(datas) {
    let _self = this;
    let tempSelectedCycle;
    switch(datas.period) {
      case 'month':
        if(datas.interval == 3) {
          tempSelectedCycle = '季度';
        }else if(datas.interval == 6) {
          tempSelectedCycle = '半年';
        }else if(datas.interval == 12) {
          tempSelectedCycle = '年';
        }else {
          tempSelectedCycle = '月';
        }
      break;
      case 'day':
        tempSelectedCycle = '天';
      break;
    }

    _self.setState({
      startValue: new Date(datas.realStartDate),
      endValue: new Date(datas.realEndDate),
      selectedCycle: tempSelectedCycle,
    });

  },

  /* 时间选择开始 */
  disabledStartDate(startValue) {
    if (!startValue || !this.state.endValue) {
      return false;
    }
    return startValue.getTime() >= this.state.endValue.getTime();
  },
  disabledEndDate(endValue) {
    if (!endValue || !this.state.startValue) {
      return false;
    }
    return endValue.getTime() <= this.state.startValue.getTime();
  },
  handleCycleChange(field, value) {
    this.setState({
      [field]: value,
    });
  },
  handleStartToggle({ open }) {
    if (!open) {
      this.setState({ endOpen: true });
    }
  },
  handleEndToggle({ open }) {
    this.setState({ endOpen: open });
  },
  /* 时间选择结束 */

  handleSubmit(budgetType) {
    let _self = this;
    let presentProjectId = Cookies.get('presentBelongProjectId');
    if(!presentProjectId) return message.warning("获取项目失败，请切换项目！");

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      //周期类型
      let tempPeriod;
      let tempInterval = 0;

      switch(_self.state.selectedCycle) {
        case '日':
          tempPeriod = 'day';
        break;
        case '月':
          tempPeriod = 'month';
          tempInterval = 1;
        break;
        case '季度':
          tempPeriod = 'month';
          tempInterval = 3;
        break;
        case '半年':
          tempPeriod = 'month';
          tempInterval = 6;
        break;
        case '年':
          tempPeriod = 'month';
          tempInterval = 12;
        break;
      }

      //数据准备
      let datas = {};
      let startDate = new Date(_self.state.rangeDate.startDate);
      let endDate = new Date(_self.state.rangeDate.endDate);

      if(budgetType == 'onlyone') {

        if(!formDatas.note || !formDatas.money || !formDatas.dateTime) return message.warning("请完善相应信息！");

        if(moment(formDatas.dateTime).isBefore(startDate) || moment(formDatas.dateTime).isAfter(endDate)) return message.warning("您的预算时间范围有误，请重新选择！");

        datas = {
          note: formDatas.note,
          type: '单次',
          period: tempPeriod,
          interval: 0,
          cost: formDatas.money,
          levelOneName: _self.state.budgetDatas.levelOneName,
          levelTwoName: _self.state.budgetDatas.levelTwoName,
          startDate: formDatas.dateTime,
          endDate: formDatas.dateTime
        };
      }else if(budgetType == 'more') {

        if(!formDatas.cycleNote || !_self.state.startValue || !_self.state.endValue || !formDatas.cycleMoney) return message.warning("请完善相应信息！");

        if(moment(_self.state.startValue).isBefore(startDate) || moment(_self.state.endValue).isAfter(endDate)) return message.warning("您的预算时间范围有误，请重新选择！");

        datas = {
          note: formDatas.cycleNote,
          type: '周期',
          period: tempPeriod,
          interval: tempInterval,
          cost: formDatas.cycleMoney,
          levelOneName: _self.state.budgetDatas.levelOneName,
          levelTwoName: _self.state.budgetDatas.levelTwoName,
          startDate: _self.state.startValue,
          endDate: _self.state.endValue
        };
      }

      let newState = ++_self.state.reloadChecked;

      _self.setState({ reloadChecked: newState, loading: true });

      updateManagerCost(_self.state.budgetDatas.realId, JSON.stringify(datas)).then((res) => {
        message.success("预算修改成功！");
        _self.props.callbackParent(newState);
        _self.props.form.resetFields();
        _self.setState({ loading: false, visible: false });
      })

    })
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    const { getFieldProps } = props.form;
    const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 14 },
        };

    return (
      <Modal
        ref="modal"
        title=''
        visible={this.state.visible}
        onCancel={this.handleCancel}
        footer=""
      >
        <Spin spinning={state.loading}>
          <div style={{marginBottom:15,fontSize:16,fontWeight:600}}>
            {state.budgetDatas.levelOneName} - {state.budgetDatas.levelTwoName}
            <span style={{fontSize:12,color:'#CCC',marginLeft:5}}>预算</span>
          </div>

          {
            state.budgetDatas.type == '单次' ?
              <Form horizontal form={props.form}>
                <FormItem
                  {...formItemLayout}
                  label="时间"
                >
                  <DatePicker {...getFieldProps('dateTime', {initialValue: state.budgetDatas.startDate })} />
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="金额"
                >
                  <Input {...getFieldProps('money', {initialValue: state.budgetDatas.cost.toString() ,rules: [{pattern: /^(([1-9][0-9]{0,20})|([0-9]+\.[0-9]{1,2}))$/,type:'string',message:'预算金额，注意格式：0.00'}]} )} placeholder="输入预算金额"/>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="备注"
                >
                  <Input type="textarea" {...getFieldProps('note', {initialValue: state.budgetDatas.note } )} placeholder="输入预算备注"/>
                </FormItem>
                <FormItem wrapperCol={{ span: 18, offset: 6 }} style={{ marginTop: 24 }}>
                  <Popconfirm title="确定要提交该预算吗？" onConfirm={this.handleSubmit.bind(null, 'onlyone')}>
                    <Button type="primary">提交预算</Button>
                  </Popconfirm>
                </FormItem>
              </Form>
            :/* 周期 */
              <div>
                <div style={{paddingLeft:'13%',marginBottom:15}}>
                  <div>
                    起止时间：
                    <DatePicker
                      disabledDate={this.disabledStartDate}
                      value={this.state.startValue}
                      placeholder="开始日期"
                      onChange={this.handleCycleChange.bind(null, 'startValue')}
                      toggleOpen={this.handleStartToggle}
                      style={{width:120}}
                    />&nbsp;-&nbsp;
                    <DatePicker
                      disabledDate={this.disabledEndDate}
                      value={this.state.endValue}
                      placeholder="结束日期"
                      onChange={this.handleCycleChange.bind(null, 'endValue')}
                      open={this.state.endOpen}
                      toggleOpen={this.handleEndToggle}
                      style={{width:120}}
                    />
                  </div>
                  <div style={{marginTop:10,}}>
                    发生周期：
                    <ButtonGroup>
                      <Button onClick={this.selectCycle.bind(null, '日')} size="small" type={state.selectedCycle == '日' ? 'primary' : null}>日</Button>
                      <Button onClick={this.selectCycle.bind(null, '月')} size="small" type={state.selectedCycle == '月' ? 'primary' : null}>月</Button>
                      <Button onClick={this.selectCycle.bind(null, '季度')} size="small" type={state.selectedCycle == '季度' ? 'primary' : null}>季度</Button>
                      <Button onClick={this.selectCycle.bind(null, '半年')} size="small" type={state.selectedCycle == '半年' ? 'primary' : null}>半年</Button>
                      <Button onClick={this.selectCycle.bind(null, '年')} size="small" type={state.selectedCycle == '年' ? 'primary' : null}>年</Button>
                    </ButtonGroup>
                  </div>
                </div>

                <Form horizontal form={props.form}>
                  <FormItem
                    {...formItemLayout}
                    label="金额"
                  >
                    <Input {...getFieldProps('cycleMoney', {initialValue: state.budgetDatas.cost.toString() ,rules: [{pattern: /^(([1-9][0-9]{0,20})|([0-9]+\.[0-9]{1,2}))$/,type:'string',message:'预算金额，注意格式：0.00'}]} )} placeholder="输入预算金额"/>
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="备注"
                  >
                    <Input type="textarea" {...getFieldProps('cycleNote', {initialValue: state.budgetDatas.note } )} placeholder="输入预算备注"/>
                  </FormItem>
                  <FormItem wrapperCol={{ span: 18, offset: 6 }} style={{ marginTop: 24 }}>
                    <Popconfirm title="确定要提交该预算吗？" onConfirm={this.handleSubmit.bind(null, 'more')}>
                      <Button type="primary">提交预算</Button>
                    </Popconfirm>
                  </FormItem>
                </Form>
              </div>
          }

        </Spin>
      </Modal>
    )
  }
}); /****** 修改预算结束 ******/

//创建重大活动预算
let CreateMutiBudget = React.createClass({
  getInitialState() {
    return {
      loading: false,
      reloadChecked: this.props.initialChecked || 0, //用于父组件更新
      visible: this.props.visible || true,
      budgetDatas: this.props.datas,
      budgetInitDatas: this.props.initValues,
      rangeDate: this.props.rangeDate, //预算周期
      selectedCycle: '月', //选择的周期
      startValue: null, //周期选择开始时间
      endValue: null, //周期选择结束时间
      levelTwoLists: []
    };
  },
  componentDidMount() {
    this.setState({
      budgetDatas: this.props.datas,
      budgetInitDatas: this.props.initValues,
      rangeDate: this.props.rangeDate
    });
    this.handleLevelTwoLists(this.props.datas, this.props.initValues); //获取二级分类
  },
  componentWillReceiveProps(nextProps) {
    this.setState({ visible: nextProps.visible });
    if(nextProps.initialChecked != this.props.initialChecked) this.setState({ reloadChecked: nextProps.initialChecked });
    if(nextProps.datas != this.props.datas || nextProps.initValues != this.props.initValues) {
      this.setState({
        budgetDatas: nextProps.datas,
        budgetInitDatas: nextProps.initValues,
        rangeDate: nextProps.rangeDate
      });
      this.handleLevelTwoLists(nextProps.datas, nextProps.initValues); //获取二级分类
    }
  },
  handleCancel() {
    this.setState({ visible: false });
  },
  selectCycle(e) {
    this.setState({ selectedCycle: e });
  },
  handleLevelTwoLists(data1, data2) {
    let _self = this;
    _.map(data2, (item) => {
      if(item.name == data1.levelOne) {
        _self.setState({ levelTwoLists: item.subItems });
      }
    })
  },

  /* 时间选择开始 */
  disabledStartDate(startValue) {
    if (!startValue || !this.state.endValue) {
      return false;
    }
    return startValue.getTime() >= this.state.endValue.getTime();
  },
  disabledEndDate(endValue) {
    if (!endValue || !this.state.startValue) {
      return false;
    }
    return endValue.getTime() <= this.state.startValue.getTime();
  },
  handleCycleChange(field, value) {
    this.setState({
      [field]: value,
    });
  },
  handleStartToggle({ open }) {
    if (!open) {
      this.setState({ endOpen: true });
    }
  },
  handleEndToggle({ open }) {
    this.setState({ endOpen: open });
  },
  /* 时间选择结束 */

  handleSubmit(budgetType, submitType) {
    let _self = this;
    let presentProjectId = Cookies.get('presentBelongProjectId');
    if(!presentProjectId) return message.warning("获取项目失败，请切换项目！");

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      if(!formDatas.dateTime) return message.warning("请完善相应信息！");

      let startDate = new Date(_self.state.rangeDate.startDate);
      let endDate = new Date(_self.state.rangeDate.endDate);
      if(moment(formDatas.dateTime).isBefore(startDate) || moment(formDatas.dateTime).isAfter(endDate)) return message.warning("您的预算时间范围有误，请重新选择！");

      //初始数据结构
      let tempInitArray = [];
      let flag = false;
      _.map(_self.state.levelTwoLists, (item1) => {

        let tempJson = {};
        let tempField1 = item1.name+'__money';
        let tempField2 = item1.name+'__note';

        let tempMoney = formDatas[tempField1];
        if(tempMoney) {
          flag = true;

          tempJson.money = tempMoney;
          tempJson.note = formDatas[tempField2];
          tempJson.name = item1.name;

          tempInitArray.push(tempJson);
        }

      })

      if(!flag) return message.warning("请至少填写一项预算费用！");

      //组装数据
      let tempManagerCosts = [];

      _.map(tempInitArray, (item) => {

        let tempJson = {
          type: '单次',
          period: 'month',
          interval: 0,
          cost: parseFloat(item.money),
          levelOneName: _self.state.budgetDatas.levelOneName,
          levelTwoName: item.name,
          startDate: formDatas.dateTime,
          endDate: formDatas.dateTime,
          note: item.note
        };

        tempManagerCosts.push(tempJson);
      })

      //数据
      let datas = {
        managerCosts: tempManagerCosts
      };

      //刷新父组件准备
      let newState = ++_self.state.reloadChecked;

      _self.setState({ reloadChecked: newState });

      createManagerCostMuti(presentProjectId, JSON.stringify(datas)).then((res) => {
        message.success("预算添加成功！");
        _self.props.callbackParent(newState);
        _self.props.form.resetFields();
        submitType == 'next' ? _self.setState({ loading: false }) : _self.setState({ loading: false, visible: false });
      })

    })
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    const { getFieldProps } = props.form;

    return (
      <span>
        <Modal
          ref="modal"
          title=''
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer=""
        >
          <Spin spinning={state.loading}>
            <div style={{marginBottom:15,fontSize:16,fontWeight:600}}>
              {state.budgetDatas.levelOneName}
              <span style={{fontSize:12,color:'#CCC',marginLeft:5}}>预算</span>
            </div>

            <div>
              <Form horizontal form={props.form}>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  label="时间"
                >
                  <DatePicker {...getFieldProps('dateTime',{rules: [{required: true, message: '请输入预算时间'}]})} />
                </FormItem>
                {
                  state.levelTwoLists.map((item, key) => {
                    return (
                      <div key={key} style={{margin:'3px 0',padding:'5px 0', background:'#F3F3F3'}}>
                        <div style={{padding:'0 0 3px 3px'}}>{key+1}、{item.name}</div>
                        <FormItem
                          labelCol={{ span: 5 }}
                          wrapperCol={{ span: 8 }}
                          label="金额"
                        >
                          <Input {...getFieldProps(item.name+'__money', {initialValue: '',rules: [{pattern: /^(([1-9][0-9]{0,20})|([0-9]+\.[0-9]{1,2}))$/,type:'string',message:'预算金额，注意格式：0.00'}]} )} placeholder={"输入预算金额"}/>
                        </FormItem>
                        <FormItem
                          labelCol={{ span: 5 }}
                          wrapperCol={{ span: 15 }}
                          label="备注"
                        >
                          <Input type="textarea" {...getFieldProps(item.name+'__note', {initialValue: ''} )} placeholder={"输入预算备注"}/>
                        </FormItem>
                      </div>
                    )
                  })
                }
                <FormItem wrapperCol={{ span: 18, offset: 6 }} style={{ marginTop: 24 }}>
                  <Popconfirm title="确定要提交该预算吗？" onConfirm={this.handleSubmit.bind(null, 'onlyone', 'over')}>
                    <Button type="primary">提交预算</Button>
                  </Popconfirm>
                  <Popconfirm title="确定要提交该预算并继续创建下一条吗？" onConfirm={this.handleSubmit.bind(null, 'onlyone', 'next')}>
                    <Button type="dashed" style={{marginLeft:5}}>提交并创建下一条</Button>
                  </Popconfirm>
                </FormItem>
              </Form>
            </div>
          </Spin>
        </Modal>
      </span>
    )
  }
});

CreateBudget     = Form.create()(CreateBudget);
ModifyBudget     = Form.create()(ModifyBudget);
CreateMutiBudget = Form.create()(CreateMutiBudget);

export default ProjectManageCost;