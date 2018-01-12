/**
 * 间接费（风险）
 */
import React from 'react';
import { Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import { Modal, Table, Form, Input, Icon, Spin, Popconfirm, Button, message } from 'antd';
import styles from '../Common.less';

import {
  showProject,
  getBudgetSummaryTables,
  updateIndirectCostQualities
} from '../../../../services/api';

//ant
const FormItem = Form.Item;

//main
let RiskCost = React.createClass({
  getInitialState() {
    return {
      visible: false,
      loading: true,
      projectDatas: {
        htqdnArray: [],
        zbqArray: []
      },
      dataSource: [],
      columns: [],
      budgetSummaryDatas: {
        BudgetPaymentPlan: {}
      }, //预算汇总数据
      moneyDatas: {}, //金额数据
    };
  },
  componentDidMount() {
    this.showProjectInfo();
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

      _self.setState({ projectDatas: datas });

      //获取汇总信息
      _self.showBudgetSummaryTables();

    })
  },
  showBudgetSummaryTables() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("请选择归属项目或部门！");

    //获取已知数据
    getBudgetSummaryTables(projectId).then((res) => {
      let datas = res.jsonResult.budgetTable;

      let tempContractArr = [];
      let tempQualityArr = [];
      let tempJson = {};

      if(datas.IndirectCostQuality.contractArr) {

        tempContractArr = datas.IndirectCostQuality.contractArr.split(',');

        _self.state.projectDatas.htqdnArray.map((item, key) => {
          tempJson['合同'+item.toString()] = tempContractArr[key];
        })

      }

      if(datas.IndirectCostQuality.qualityArr) {

        tempQualityArr = datas.IndirectCostQuality.qualityArr.split(',');

        _self.state.projectDatas.zbqArray.map((item, key) => {
          tempJson['质保'+item.toString()] = tempQualityArr[key];
        })

      }

      _self.setState({
        budgetSummaryDatas: datas,
        moneyDatas: tempJson
      });

      //获取表信息
      _self.showTableInfo();

    })
  },
  showTableInfo() {
    let _self = this;

    /****** 表行 ******/
    let tempDataSource = [];
    let tempTotal = 0;
    let tempDataSourceJson = {
      key: 1,
      type: '间接费（风险）',
      total: '',
    };

    /****** 表列 ******/
    let tempColumns = [{
      title: '费用类型',
      dataIndex: 'type',
      key: 'type',
      className: styles.textAlignCenter
    }, {
      title: '合计',
      dataIndex: 'total',
      key: 'total',
      render: (text, record) => {
        return (
          <center>￥
            {
              text ? <span>{desp_toThousands(text)}</span> : '0.00'
            }
          </center>
        );
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
        return (
          <center>
            {
              text ? <span>￥{desp_toThousands(text)}</span> : '/'
            }
          </center>
        );
      }

      tempDataSourceJson[tempField] = _self.state.moneyDatas[tempField] || 0; //合同表行数据
      tempTotal += parseFloat(tempDataSourceJson[tempField]); //合同合计

      tempColumns.push(tempJson);
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
        return (
          <center>
            {
              text ? <span>￥{desp_toThousands(text)}</span> : '/'
            }
          </center>
        );
      }

      tempDataSourceJson[tempField] = _self.state.moneyDatas[tempField] || 0; //质保表行数据
      tempTotal += parseFloat(tempDataSourceJson[tempField]); //质保合计

      tempColumns.push(tempJson);
    })

    //操作
    let tempOptions = {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => {
        return (
          <center>
            <Button onClick={_self.showModal} type="primary" size="small">编辑</Button>
          </center>
        )
      }
    };

    tempColumns.push(tempOptions);

    //合并记录
    tempDataSourceJson.total = tempTotal; //合计金额
    tempDataSource.push(tempDataSourceJson);

    _self.setState({
      columns: tempColumns,
      dataSource: tempDataSource,
      loading: false
    });

  },
  showModal() {
    this.setState({ visible: true });
  },
  handleCancel() {
    this.setState({ visible: false });
  },
  handleSubmit() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("获取项目失败，请切换项目！");

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      //检查indirectCostQualityId是否存在
      let indirectCostQualityId = _self.state.budgetSummaryDatas.IndirectCostQuality.id || 0;
      if(!indirectCostQualityId) return message.warning("获取质保期材料费信息失败！");

      let tempContractStr = '';
      let tempQualityStr = '';

      _.map(formDatas, (item, key) => {

        switch(key.substr(0, 2)) {
          case '合同':
            tempContractStr += ',' + item || 'noValue';
          break;
          case '质保':
            tempQualityStr += ',' + item || 'noValue';
          break;
        }

      })

      //去掉字符串首字符（逗号）
      let datas = {
        contractArr: tempContractStr.substr(1, tempContractStr.length-1),
        qualityArr: tempQualityStr.substr(1, tempQualityStr.length-1)
      };

      _self.setState({ loading: true });

      updateIndirectCostQualities(projectId, indirectCostQualityId, JSON.stringify(datas)).then((res) => {

        if(res.jsonResult.code < 0) return message.warning(res.jsonResult.msg);

        message.success("费用信息添加成功！");
        _self.setState({ visible: false, loading: false });
        _self.showProjectInfo();

      })

    });
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    const { getFieldProps } = props.form;

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };

    return (
      <div>

        <Table
          dataSource={state.dataSource}
          columns={state.columns}
          pagination={false}
          loading={state.loading}
          bordered
        />

        <Modal
          title="编辑风险间接费"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer=""
        >
          <Form horizontal form={props.form}>
            {
              _.map(state.projectDatas.htqdnArray, (item, key) => {
                let field = "合同"+item.toString();
                return (
                  <FormItem
                    key={field}
                    {...formItemLayout}
                    label={field+'年'}
                  >
                    <Input {...getFieldProps(field, {initialValue: state.moneyDatas[field] || '',rules:[{pattern: /^(([1-9][0-9]{0,20})|([0-9]+\.[0-9]{1,2}))$/,type:'string',message:'合同金额(元)，注意格式'}]})} placeholder={field+'年'} />
                  </FormItem>
                )
              })
            }

            {
              state.projectDatas.zbqArray.map((item) => {
                let field = "质保"+item.toString();
                return (
                  <FormItem
                    key={field}
                    {...formItemLayout}
                    label={field+'年'}
                  >
                    <Input {...getFieldProps(field, {initialValue: state.moneyDatas[field] || '',rules:[{pattern: /^(([1-9][0-9]{0,20})|([0-9]+\.[0-9]{1,2}))$/,type:'string',message:'保函金额(元)，注意格式'}]})} placeholder={field+'年'} />
                  </FormItem>
                )
              })
            }

            <center>
              <Popconfirm title="确定立即提交信息吗？" onConfirm={this.handleSubmit}>
                <Button type="primary">确认并提交</Button>
              </Popconfirm>
            </center>
          </Form>
        </Modal>

      </div>
    );
  }
});

RiskCost = Form.create()(RiskCost);

export default RiskCost;