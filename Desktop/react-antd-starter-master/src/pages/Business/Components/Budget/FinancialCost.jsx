/**
 * 财务成本
 * 区别控制：保函比例，保证金比例，手续费率
 */
import React from 'react';
import { Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import { Modal, Table, Form, Input, Icon, Spin, Popconfirm, Button, message, Tooltip, Select } from 'antd';
import styles from '../Common.less';

import {
  showProject,
  getBudgetSummaryTables,
  createFinanceItems,
  updateFinanceItem,
  deleteFinanceItem
} from '../../../../services/api';

//ant
const FormItem = Form.Item;
const Option   = Select.Option;
const confirm  = Modal.confirm;

//main
let FinancialCost = React.createClass({
  getInitialState() {
    return {
      loading: true,
      dataSource: [],
      columns: [],
      financeTableDatas: [],
      initDatas: ['预付款保函','履约保函','质量保证金','审计预留金','印花税'],
      subModal: '',
      projectDatas: {
        htje: ''
      },
    };
  },
  componentDidMount() {
    this.showTableHeader();
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
  showBudgetSummaryTables() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("请选择归属项目或部门！");

    //获取已知数据
    getBudgetSummaryTables(projectId).then((res) => {
      let datas = res.jsonResult.budgetTable.FinanceTable;

      _self.setState({ financeTableDatas: datas });

      _self.showProjectInfo();

    })
  },
  showProjectInfo() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("请选择归属项目或部门！");

    showProject(projectId).then((res) => {
      let datas = res.jsonResult.project;
      if(!datas.htje) return message.warning("获取合同金额失败，请联系项目管理工程师！");

      _self.setState({ projectDatas: datas });

      setTimeout(() => {
        _self.showTablebody();
      }, 300)

    })
  },
  showTableHeader() {
    let _self = this;

    let tempColumns = [{
      title: '费用类型',
      dataIndex: 'name',
      key: 'name',
      className: styles.textAlignCenter,
      render: (text) => {
        return text ? text : '/';
      }
    }, {
      title: '保函比例',
      dataIndex: 'bhbl',
      key: 'bhbl',
      className: styles.textAlignCenter,
      render: (text) => {
        return text ? <span>{text}%</span> : <center>/</center>;
      }
    }, {
      title: '保函金额',
      dataIndex: 'bhje',
      key: 'bhje',
      className: styles.textAlignCenter,
      render: (text) => {
        return text ? '￥'+desp_toThousands(text) : '/';
      }
    }, {
      title: '保函有效期（季度）',
      dataIndex: 'bhyxq',
      key: 'bhyxq',
      className: styles.width50,
      render: (text) => {
        return text ? <center>{text}</center> : <center>/</center>;
      }
    }, {
      title: '保证金比例',
      dataIndex: 'bzjbl',
      key: 'bzjbl',
      className: styles.width50,
      render: (text) => {
        return text ? <center>{text}%</center> : <center>/</center>;
      }
    }, {
      title: '保证金金额',
      dataIndex: 'bzjje',
      key: 'bzjje',
      className: styles.textAlignCenter,
      render: (text) => {
        return text ? '￥'+desp_toThousands(text) : '/';
      }
    }, {
      title: '手续费率（%）',
      dataIndex: 'sxfl',
      key: 'sxfl',
      className: styles.width50,
      render: (text) => {
        return text ? <center>{text}%</center> : <center>/</center>;
      }
    }, {
      title: '预算成本',
      dataIndex: 'yscb',
      key: 'yscb',
      className: styles.textAlignCenter,
      render: (text) => {
        return text ? '￥'+desp_toThousands(text) : '/';
      }
    }, {
      title: '备注',
      dataIndex: 'remask',
      key: 'remask',
      className: styles.maxWidth200
    }, {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => {
        if(record.name == '合计') return false;
        return (
          <center>
            {
              record.total ?
                <Button disabled type="primary" size="small"><Icon type="edit" /></Button>
              :
                <Tooltip title="编辑" placement="top">
                  <Button onClick={_self.showModalForUpdate.bind(null, record)} type="primary" size="small"><Icon type="edit" /></Button>
                </Tooltip>
            }
            {
              !record.total && (record.bhbl || record.bzjbl || record.sxfl)  ?
                <Tooltip title="删除" placement="top">
                  <Button onClick={_self.deleteCostItem.bind(null, record)} type="dashed" size="small" style={{marginLeft:5}}><Icon type="cross-circle-o" /></Button>
                </Tooltip>
              :
                <Button disabled type="dashed" size="small" style={{marginLeft:5}}><Icon type="cross-circle-o" /></Button>
            }
          </center>
        )
      }
    }];

    _self.setState({ columns: tempColumns });

  },
  showTablebody() {
    let _self = this;
    let tempDataSource = [];

    let tempTotalJson = {
      name: '合计',
      bhje: 0,
      bzjje: 0,
      yscb: 0,
      total: true
    };

    let tempHtje = parseFloat(_self.state.projectDatas.htje);

    _self.state.initDatas.map((item1) => {
      let flag = false;
      let tempJson = {};

      _.map(_self.state.financeTableDatas.FinanceItems, (item2) => {
        if(item1 == item2.name) {
          flag = true;

          let tempYscb;

          if(!item2.bhbl && !item2.bzjbl && item2.sxfl) {
            //印花税（只有手续费率）
            tempYscb = item2.sxfl*tempHtje/100; //手续费率*合同金额
          }

          if(item2.bhbl && item2.bhyxq && item2.sxfl) {
            //保函（存在且有手续费率）
            tempYscb = item2.bhbl*item2.sxfl*item2.bhyxq*tempHtje/100; //手续费率*有效期*合同金额
          }

          if(item2.bzjbl && item2.bhyxq && item2.sxfl) {
            //保证金（存在且有手续费率）
            tempYscb = item2.bzjbl*item2.sxfl*item2.bhyxq*tempHtje/100; //手续费率*有效期*合同金额
          }

          //合计（保函金额）
          let tempSumNumbers_bhje = tempTotalJson.bhje || 0;
          item2.bhbl ? tempSumNumbers_bhje += item2.bhbl*tempHtje/100: null;
          tempTotalJson.bhje = tempSumNumbers_bhje;

          //合计（保证金金额）
          let tempSumNumbers_bzjje = tempTotalJson.bzjje || 0;
          item2.bzjbl ? tempSumNumbers_bzjje += item2.bzjbl*tempHtje/100: null;
          tempTotalJson.bzjje = tempSumNumbers_bzjje;

          //合计（预算成本）
          let tempSumNumbers_yscb = tempTotalJson.yscb || 0;
          tempYscb ? tempSumNumbers_yscb += parseFloat(tempYscb): null;
          tempTotalJson.yscb = tempSumNumbers_yscb;

          tempJson.name = item2.name;
          tempJson.bhbl = item2.bhbl;
          tempJson.bhje = item2.bhje ? item2.bhje : item2.bhbl*tempHtje/100;
          tempJson.bzjbl = item2.bzjbl;
          tempJson.bzjje = item2.bzjje ? item2.bzjje : item2.bzjbl*tempHtje/100;
          tempJson.bhyxq = item2.bhyxq;
          tempJson.sxfl = item2.sxfl;
          tempJson.yscb = tempYscb;
          tempJson.ssnd = item2.ssnd;
          tempJson.remask = item2.note;
          tempJson.item = item2;

          tempDataSource.push(tempJson);

        }
      })

      if(!flag) {
        tempJson.name = item1;

        tempDataSource.push(tempJson);
      }

    })

    //输出新增的预算记录项（接在初始数据之后）
    _.map(_self.state.financeTableDatas.FinanceItems, (item1, key1) => {

      let flag = false;

      _.map(_self.state.initDatas, (item2) => {
        if(item1.name == item2) flag = true;
      })

      if(!flag) {
        let tempJson = {};

        let tempYscb;

        if(!item1.bhbl && !item1.bzjbl && item1.sxfl) {
          //印花税（只有手续费率）
          tempYscb = item1.sxfl*tempHtje/100; //手续费率*合同金额
        }

        if(item1.bhbl && item1.bhyxq && item1.sxfl) {
          //保函（存在且有手续费率）
          tempYscb = item1.bhbl*item1.sxfl*item1.bhyxq*tempHtje/100; //手续费率*有效期*合同金额
        }

        if(item1.bzjbl && item1.bhyxq && item1.sxfl) {
          //保证金（存在且有手续费率）
          tempYscb = item1.bzjbl*item1.sxfl*item1.bhyxq*tempHtje/100; //手续费率*有效期*合同金额
        }

        //合计（保函金额）
        let tempSumNumbers_bhje = tempTotalJson.bhje || 0;
        item1.bhbl ? tempSumNumbers_bhje += item1.bhbl*tempHtje/100: null;
        tempTotalJson.bhje = tempSumNumbers_bhje;

        //合计（保证金金额）
        let tempSumNumbers_bzjje = tempTotalJson.bzjje || 0;
        item1.bzjbl ? tempSumNumbers_bzjje += item1.bzjbl*tempHtje/100: null;
        tempTotalJson.bzjje = tempSumNumbers_bzjje;

        //合计（预算成本）
        let tempSumNumbers_yscb = tempTotalJson.yscb || 0;
        tempYscb ? tempSumNumbers_yscb += parseFloat(tempYscb): null;
        tempTotalJson.yscb = tempSumNumbers_yscb;

        tempJson.name = item1.name;
        tempJson.bhbl = item1.bhbl;
        tempJson.bhje = item1.bhje ? item1.bhje : item1.bhbl*tempHtje/100;
        tempJson.bzjbl = item1.bzjbl;
        tempJson.bzjje = item1.bzjje ? item1.bzjje : item1.bzjbl*tempHtje/100;
        tempJson.bhyxq = item1.bhyxq;
        tempJson.sxfl = item1.sxfl;
        tempJson.yscb = tempYscb;
        tempJson.ssnd = item1.ssnd;
        tempJson.remask = item1.note;
        tempJson.item = item1;

        tempDataSource.push(tempJson);
      }
    })

    tempDataSource.push(tempTotalJson);

    _self.setState({
      dataSource: tempDataSource,
      loading: false
    });
  },
  showModalForUpdate(value) {
    if(value.bhbl || value.bzjbl || value.sxfl) {
      //修改
      this.setState({
        subModal: <ModifyFinancialCost modifyItem={value} visible={true} callbackParent={this.onChildChanged} initialChecked={this.state.reloadChecked} />
      });
    }else {
      //新增
      this.setState({
        subModal: <CreateFinancialCost name={value.name} datas={this.state.financeTableDatas} visible={true} callbackParent={this.onChildChanged} initialChecked={this.state.reloadChecked} />
      });
    }
  },
  showModalForNew() {
    this.setState({
      subModal: <CreateFinancialCost datas={this.state.financeTableDatas} visible={true} callbackParent={this.onChildChanged} initialChecked={this.state.reloadChecked} />
    });
  },
  deleteCostItem(value) {
    let _self = this;

    if(!value.item.id) return message.warning("获取记录信息失败！");

    confirm({
      title: 'dES提示',
      content: '您确定需要删除【'+value.name+'】的预算吗？',
      onOk() {
        deleteFinanceItem(value.item.id).then((res) => {
          message.success("删除成功！");
          _self.setState({ loading: true });
          _self.showBudgetSummaryTables();
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

        <Table
          dataSource={state.dataSource}
          columns={state.columns}
          loading={state.loading}
          pagination={false}
          bordered
        />
        <div style={{margin:'15px 0'}}>
          <div style={{float:'left'}}><Button onClick={this.showModalForNew} type="primary" size="small"><Icon type="plus-circle-o" />新增预算</Button></div>
          <div style={{float:'right'}}>当前共有记录 <span className="text-danger">{state.dataSource.length ? state.dataSource.length - 1 : 0}</span> 条</div>
        </div>

        {state.subModal}

      </div>
    )
  }
});

//新增预算
let CreateFinancialCost = React.createClass({
  getInitialState() {
    return {
      loading: true,
      reloadChecked: this.props.initialChecked || 0, //用于父组件更新
      visible: this.props.visible || true,
      financialName: this.props.name || '',
      selectData: {
        type: ''
      },
      costType: '',
      projectDatas: {
        effectiveYearArray: []
      }, //项目信息
      financialDatas: this.props.datas,
    };
  },
  componentDidMount() {
    this.showProjectInfo();
  },
  componentWillReceiveProps(nextProps) {
    this.setState({ visible: nextProps.visible });
    if(nextProps.initialChecked != this.props.initialChecked) this.setState({ reloadChecked: nextProps.initialChecked });
    if(nextProps.datas != this.props.datas) this.setState({ financialDatas: nextProps.datas });
    if(nextProps.name != this.props.name) this.setState({ financialName: nextProps.name });
  },
  showProjectInfo() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("请选择归属项目或部门！");

    showProject(projectId).then((res) => {
      let datas = res.jsonResult.project;
      let tempEffectiveYearArray = [];
      let tempHtqdnArray = [];

      //合同起止时间与质保期必须有
      if(datas.htkssj && datas.htzzsj && datas.zbq) {

        let startDate = moment(datas.htkssj).format('YYYY-MM-DD');
        let endDate = moment(datas.htzzsj).format('YYYY-MM-DD');

        let startYear = parseInt(moment(startDate).format('YYYY'));
        let endYear = parseInt(moment(endDate).format('YYYY'));

        let yearDiffCounts = (endYear+1) - startYear; //至少保证有一年

        //组装合同签订年
        for(let i = 0; i < yearDiffCounts; i++) {
          tempHtqdnArray.push(startYear+i);
        }

        //赋值
        tempEffectiveYearArray = tempHtqdnArray;
        datas.effectiveYearArray = tempEffectiveYearArray;

      }else {
        message.warning("请在项目静态信息里面完善合同起止时间与质保期！");
      }

      _self.setState({
        projectDatas: datas,
        loading: false
      });

    })
  },
  handleCancel() {
    this.setState({ visible: false });
  },
  handleCostType(e) {
    this.setState({ costType: e });
  },
  handleSubmit() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("获取项目失败，请切换项目！");

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      if(!_self.state.costType) return message.warning("请选择对应的费用类别！");

      let hasName = false;
      _.map(_self.state.financialDatas.FinanceItems, (item) => {
        if(formDatas.name == item.name) hasName = true;
      })
      if(hasName) return message.warning("该费用名称已存在！");


      let datas = {};

      switch(_self.state.costType) {
        case '保函':
          datas = {
            name: formDatas.name,
            bhbl: formDatas.bhbl,
            bhyxq: formDatas.bhyxq,
            sxfl: formDatas.sxfl,
            ssnd: formDatas.ssnd,
            note: formDatas.note
          };
        break;
        case '保证金':
          datas = {
            name: formDatas.name,
            bzjbl: formDatas.bzjbl,
            bhyxq: formDatas.bhyxq,
            sxfl: formDatas.sxfl,
            ssnd: formDatas.ssnd,
            note: formDatas.note
          };
        break;
        case '其他税':
          datas = {
            name: formDatas.name,
            sxfl: formDatas.qtsbl,
            ssnd: formDatas.ssnd,
            note: formDatas.note
          };
        break;
      }

      let newState = ++_self.state.reloadChecked;

      _self.setState({ reloadChecked: newState, loading: true });

      createFinanceItems(projectId, JSON.stringify(datas)).then((res) => {
        message.success("数据添加成功！");
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
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };

    return (
      <div>
        <Modal
          title="新增财务成本"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer=""
        >
          <Spin spinning={state.loading}>
            <Form horizontal form={props.form}>
              <FormItem
                key="费用名称"
                {...formItemLayout}
                label="费用名称"
              >
                {/* init新增 */
                  state.financialName ?
                    <Input disabled={state.financialName ? true : false} {...getFieldProps('name', {initialValue: state.financialName || '', rules:[{required:true, message:'费用名称'}]})} placeholder="请输入费用名称" />
                  :
                    <Input {...getFieldProps('name', {initialValue: '', rules:[{required:true, message:'费用名称'}]})} placeholder="请输入费用名称" />
                }
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="所属年度"
              >
                <Select
                  placeholder="请选择所属年度"
                  {...getFieldProps('ssnd', {rules:[{required:true, message:'所属年度'}]})}
                >
                  {
                    _.map(state.projectDatas.effectiveYearArray, (item, key) => {
                      return <Option key={key} value={item.toString()}>{item}</Option>
                    })
                  }
                </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="费用类别"
              >
                <Select onChange={this.handleCostType} placeholder="请选择选择费用类型">
                  <Option value="保函">保函（预付款\履约）</Option>
                  <Option value="保证金">质量保证金\审计预留金</Option>
                  <Option value="其他税">其他税</Option>
                </Select>
              </FormItem>
              {
                state.costType == '保函' ?
                  <div>
                    <FormItem
                      {...formItemLayout}
                      label="保函比例（%）"
                    >
                      <Input {...getFieldProps('bhbl', {rules:[{required:true,pattern: /^(([1-9]{1,2})|([1-9][0-9]+\.[0-9]{1,4})|([0-9]+\.[0-9]{1,4}))$/,message:'保函比例（%）'}]})} placeholder="请输入保函比例" />
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="保函有效期（季度）"
                    >
                      <Input {...getFieldProps('bhyxq', {rules:[{required:true,pattern: /^[1-9](\d)*$/,message:'保函有效期（季度）'}]})} placeholder="请输入保函有效期" />
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="手续费率（%）"
                    >
                      <Input {...getFieldProps('sxfl', {rules:[{required:true,pattern: /^(([1-9]{1,2})|([1-9][0-9]+\.[0-9]{1,4})|([0-9]+\.[0-9]{1,4}))$/, message:'手续费率（%）'}]})} placeholder="请输入手续费率" />
                    </FormItem>
                  </div>
                :
                  null
              }
              {/* 保证金与保函字段一致：2017-03-14 */
                state.costType == '保证金' ?
                  <div>
                    <FormItem
                      {...formItemLayout}
                      label="保证金比例（%）"
                    >
                      <Input {...getFieldProps('bzjbl', {rules:[{required:true,pattern: /^(([1-9]{1,2})|([1-9][0-9]+\.[0-9]{1,4})|([0-9]+\.[0-9]{1,4}))$/,message:'保证金比例（%）'}]})} placeholder="请输入保证金比例" />
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="保证金有效期（季度）"
                    >
                      <Input {...getFieldProps('bhyxq', {rules:[{required:true,pattern: /^[1-9](\d)*$/,message:'保证金有效期（季度）'}]})} placeholder="请输入保证金有效期" />
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="手续费率（%）"
                    >
                      <Input {...getFieldProps('sxfl', {rules:[{required:true,pattern: /^(([1-9]{1,2})|([1-9][0-9]+\.[0-9]{1,4})|([0-9]+\.[0-9]{1,4}))$/, message:'手续费率（%）'}]})} placeholder="请输入手续费率" />
                    </FormItem>
                  </div>
                :
                  null
              }
              {
                state.costType == '其他税' ?
                  <div>
                    <FormItem
                      {...formItemLayout}
                      label="其他税比例（%）"
                    >
                      <Input {...getFieldProps('qtsbl', {rules:[{required:true,pattern: /^(([1-9]{1,2})|([1-9][0-9]+\.[0-9]{1,4})|([0-9]+\.[0-9]{1,4}))$/,message:'其他税比例（%）'}]})} placeholder="请输入其他税比例" />
                    </FormItem>
                  </div>
                :
                  null
              }
              <FormItem
                {...formItemLayout}
                label="备注"
              >
                <Input type="textarea" {...getFieldProps('note')} defaultValue="备注（选填）" />
              </FormItem>
              <FormItem>
                <center>
                  <Popconfirm title="确定立即提交信息吗？" onConfirm={this.handleSubmit}>
                    <Button type="primary">确认并提交</Button>
                  </Popconfirm>
                </center>
              </FormItem>
            </Form>
          </Spin>
        </Modal>
      </div>
    )
  }
});

//修改预算
let ModifyFinancialCost = React.createClass({
  getInitialState() {
    return {
      loading: true,
      reloadChecked: this.props.initialChecked || 0, //用于父组件更新
      visible: this.props.visible || true,
      selectData: {
        type: ''
      },
      projectDatas: {
        effectiveYearArray: []
      }, //项目信息
      modifyData: this.props.modifyItem,
    };
  },
  componentDidMount() {
    this.showProjectInfo();
  },
  componentWillReceiveProps(nextProps) {
    this.setState({ visible: nextProps.visible });
    if(nextProps.initialChecked != this.props.initialChecked) this.setState({ reloadChecked: nextProps.initialChecked });
    if(nextProps.modifyItem != this.props.modifyItem) this.setState({ modifyData: nextProps.modifyItem });
  },
  showProjectInfo() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("请选择归属项目或部门！");

    showProject(projectId).then((res) => {
      let datas = res.jsonResult.project;
      let tempEffectiveYearArray = [];
      let tempHtqdnArray = [];

      //合同起止时间与质保期必须有
      if(datas.htkssj && datas.htzzsj && datas.zbq) {

        let startDate = moment(datas.htkssj).format('YYYY-MM-DD');
        let endDate = moment(datas.htzzsj).format('YYYY-MM-DD');

        let startYear = parseInt(moment(startDate).format('YYYY'));
        let endYear = parseInt(moment(endDate).format('YYYY'));

        let yearDiffCounts = (endYear+1) - startYear; //至少保证有一年

        //组装合同签订年
        for(let i = 0; i < yearDiffCounts; i++) {
          tempHtqdnArray.push(startYear+i);
        }

        //赋值
        tempEffectiveYearArray = tempHtqdnArray;
        datas.effectiveYearArray = tempEffectiveYearArray;

      }else {
        message.warning("请在项目静态信息里面完善合同起止时间与质保期！");
      }

      _self.setState({
        projectDatas: datas,
        loading: false
      });

    })
  },
  handleCancel() {
    this.setState({ visible: false });
  },
  handleSubmit() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("获取项目失败，请切换项目！");

    let financeItemId = _self.state.modifyData.item.id;

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      if(!financeItemId) return message.warning("获取修改记录信息失败！");

      let datas = {};

      if(_self.state.modifyData.bhbl) {
        //保函
        datas = {
          name: formDatas.name,
          bhbl: formDatas.bhbl,
          bhyxq: formDatas.bhyxq,
          sxfl: formDatas.sxfl,
          ssnd: formDatas.ssnd,
          note: formDatas.note
        };
      }
      if(_self.state.modifyData.bzjbl) {
        //保证金
        datas = {
          name: formDatas.name,
          bzjbl: formDatas.bzjbl,
          bhyxq: formDatas.bhyxq,
          sxfl: formDatas.sxfl,
          ssnd: formDatas.ssnd,
          note: formDatas.note
        };
      }
      if(!_self.state.modifyData.bhbl && !_self.state.modifyData.bzjbl && _self.state.modifyData.sxfl) {
        //其他税
        datas = {
          name: formDatas.name,
          sxfl: formDatas.qtsbl,
          ssnd: formDatas.ssnd,
          note: formDatas.note
        };
      }

      let newState = ++_self.state.reloadChecked;

      _self.setState({ reloadChecked: newState, loading: true });

      updateFinanceItem(financeItemId, JSON.stringify(datas)).then((res) => {
        message.success("数据修改成功！");
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
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };

    let tempCostType;
    let tempCostTypeHTML;

    if(state.modifyData.bhbl) {
      tempCostType = "保函";
      tempCostTypeHTML = (
        <Select disabled value={tempCostType} placeholder="请选择选择费用类型">
          <Option value="保函">保函（预付款\履约）</Option>
          <Option value="保证金">质量保证金\审计预留金</Option>
          <Option value="其他税">其他税</Option>
        </Select>
      );
    }
    if(state.modifyData.bzjbl) {
      tempCostType = "保证金";
      tempCostTypeHTML = (
        <Select disabled value={tempCostType} placeholder="请选择选择费用类型">
          <Option value="保函">保函（预付款\履约）</Option>
          <Option value="保证金">质量保证金\审计预留金</Option>
          <Option value="其他税">其他税</Option>
        </Select>
      );
    }
    if(!state.modifyData.bhbl && !state.modifyData.bzjbl && state.modifyData.sxfl) {
      tempCostType = "其他税";
      tempCostTypeHTML = (
        <Select disabled value={tempCostType} placeholder="请选择选择费用类型">
          <Option value="保函">保函（预付款\履约）</Option>
          <Option value="保证金">质量保证金\审计预留金</Option>
          <Option value="其他税">其他税</Option>
        </Select>
      );
    }

    return (
      <div>
        <Modal
          title="修改财务成本"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer=""
        >
          <Spin spinning={state.loading}>
            <Form horizontal form={props.form}>
              <FormItem
                key="费用名称"
                {...formItemLayout}
                label="费用名称"
              >
                <Input disabled {...getFieldProps('name', {initialValue: state.modifyData.name || '', rules:[{required:true, message:'费用名称'}]})} placeholder="请输入费用名称" />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="所属年度"
              >
                <Select
                  placeholder="请选择所属年度"
                  {...getFieldProps('ssnd', {initialValue: state.modifyData.ssnd || null, rules:[{required:true, message:'所属年度'}]})}
                >
                  {
                    _.map(state.projectDatas.effectiveYearArray, (item, key) => {
                      return <Option key={key} value={item.toString()}>{item}</Option>
                    })
                  }
                </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="费用类别"
              >
                {tempCostTypeHTML}
              </FormItem>
              {
                tempCostType == '保函' ?
                  <div>
                    <FormItem
                      {...formItemLayout}
                      label="保函比例（%）"
                    >
                      <Input {...getFieldProps('bhbl', {initialValue: state.modifyData.bhbl, rules:[{required:true,pattern: /^(([1-9]{1,2})|([1-9][0-9]+\.[0-9]{1,4})|([0-9]+\.[0-9]{1,4}))$/,message:'保函比例（%）'}]})} placeholder="请输入保函比例" />
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="保函有效期（季度）"
                    >
                      <Input {...getFieldProps('bhyxq', {initialValue: state.modifyData.bhyxq, rules:[{required:true,pattern: /^[1-9](\d)*$/,message:'保函有效期（季度）'}]})} placeholder="请输入保函有效期" />
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="手续费率（%）"
                    >
                      <Input {...getFieldProps('sxfl', {initialValue: state.modifyData.sxfl, rules:[{required:true,pattern: /^(([1-9]{1,2})|([1-9][0-9]+\.[0-9]{1,4})|([0-9]+\.[0-9]{1,4}))$/, message:'手续费率（%）'}]})} placeholder="请输入手续费率" />
                    </FormItem>
                  </div>
                :
                  null
              }
              {
                tempCostType == '保证金' ?
                  <div>
                    <FormItem
                      {...formItemLayout}
                      label="保证金比例（%）"
                    >
                      <Input {...getFieldProps('bzjbl', {initialValue: state.modifyData.bzjbl, rules:[{required:true,pattern: /^(([1-9]{1,2})|([1-9][0-9]+\.[0-9]{1,4})|([0-9]+\.[0-9]{1,4}))$/,message:'保证金比例（%）'}]})} placeholder="请输入保证金比例" />
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="保证金有效期（季度）"
                    >
                      <Input {...getFieldProps('bhyxq', {initialValue: state.modifyData.bhyxq || 0.00, rules:[{required:true,pattern: /^[1-9](\d)*$/,message:'保证金有效期（季度）'}]})} placeholder="请输入保证金有效期" />
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="手续费率（%）"
                    >
                      <Input {...getFieldProps('sxfl', {initialValue: state.modifyData.sxfl || 0.00, rules:[{required:true,pattern: /^(([1-9]{1,2})|([1-9][0-9]+\.[0-9]{1,4})|([0-9]+\.[0-9]{1,4}))$/, message:'手续费率（%）'}]})} placeholder="请输入手续费率" />
                    </FormItem>
                  </div>
                :
                  null
              }
              {
                tempCostType == '其他税' ?
                  <div>
                    <FormItem
                      {...formItemLayout}
                      label="其他税比例（%）"
                    >
                      <Input {...getFieldProps('qtsbl', {initialValue: state.modifyData.sxfl, rules:[{required:true,pattern: /^(([1-9]{1,2})|([1-9][0-9]+\.[0-9]{1,4})|([0-9]+\.[0-9]{1,4}))$/,message:'其他税比例（%）'}]})} placeholder="请输入其他税比例" />
                    </FormItem>
                  </div>
                :
                  null
              }
              <FormItem
                {...formItemLayout}
                label="备注"
              >
                <Input type="textarea" {...getFieldProps('note', {initialValue: state.modifyData.remask || ''})} defaultValue="备注（选填）" />
              </FormItem>
              <FormItem>
                <center>
                  <Popconfirm title="确定立即提交信息吗？" onConfirm={this.handleSubmit}>
                    <Button type="primary">确认并提交</Button>
                  </Popconfirm>
                </center>
              </FormItem>
            </Form>
          </Spin>
        </Modal>
      </div>
    )
  }
});

CreateFinancialCost = Form.create()(CreateFinancialCost);
ModifyFinancialCost = Form.create()(ModifyFinancialCost);

export default FinancialCost;