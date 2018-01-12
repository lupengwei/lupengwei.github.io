/**
 * 预算设置人员权限
 * 注意：原本默认二次赋值采用Array的方式，在赋值之后选择人员时候，出现部分（2，3，4）select的change事件失败，目前采用Json
 */

import React from 'react';
import { Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import { Alert, Row, Col, Form, Input, Icon, Spin, Popconfirm, Button, Select, message, Tooltip } from 'antd';
import styles from '../Common.less';

import {
  showProject,
  getAllUsers,
  setBudgetRoles,
  getBudgetRoles
} from '../../../../services/api';

//ant
const FormItem = Form.Item;
const Option   = Select.Option;

//main
let BudgetSetAuthority = React.createClass({
  getInitialState() {
    return {
      loading: true,
      projectDatas: {},
      userChildren: [],
      moduleJsonDatas: {
        回款计划: '',
        项目管理费: '',
        硬件材料费: '',
        质保期材料费: '',
        风险间接费: '',
        认证费: '',
        实施人工费: '',
        质保期人工费: '',
        集成设计费: '',
        物流成本: '',
        财务成本: '',
      },
    };
  },
  componentDidMount() {
    this.showAllUsers();
  },
  showAllUsers() {
    let children = [],
        _self    = this;

    getAllUsers().then((res) => {
      let usersArray = res.jsonResult.users;
      children.push(<Option key='index' value=''>请选择配置人员</Option>);
      usersArray.map((item, key, index) => {
        let temp = item.id +'__'+ item.pinyin + item.suoxie +'__'+ item.name;
        children.push(<Option key={key+index} value={temp}>{item.name}</Option>);
      })

      _self.setState({ userChildren: children });
      //获取预算角色
      _self.showBudgetRoles();

    });
  },
  showBudgetRoles() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("获取项目失败，请切换项目！");

    getBudgetRoles(projectId).then((res) => {
      let datas = res.jsonResult.budgetRoles;

      //已经存在权限角色
      if(datas.length > 0) {

        let tempModuleJsonDatas = {};

        datas.map((item1) => {
          _.map(_self.state.moduleJsonDatas, (item2, key2) => {

            //找到对应模块信息 赋值重新构造数据结构
            if(item1.role == key2) {

              let tempStr = item1.User.id +'__'+ item1.User.pinyin + item1.User.suoxie +'__'+ item1.User.name;

              tempModuleJsonDatas[key2] = tempStr;

            }

          })
        })

        _self.setState({
          moduleJsonDatas: tempModuleJsonDatas,
          loading: false
        });

      }else {
        _self.setState({ loading: false });
      }

    })
  },
  handleSubmit() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("获取项目失败，请切换项目！");

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      let datas = {};

      //准备数据
      _.map(formDatas, (item, key) => {
        let userId = item.split('__')[0];

        datas[key] = userId;
      })

      _self.setState({ loading: true });


      setBudgetRoles(projectId, JSON.stringify(datas)).then((res) => {
        message.success("设置预算模块权限成功");
        _self.setState({ loading: false });

        setTimeout(() => {
          location.reload();
        }, 1000)

      })

    });
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 }
    };

    return (
      <div>
        <Spin spinning={state.loading}>
          <Alert message="项目全面预算编制权限设置" showIcon type="info" />

          <Form horizontal className="ant-advanced-search-form" form={this.props.form}>
            <Row gutter={12}>
              <Col sm={12}>
                <FormItem
                  {...formItemLayout}
                  label="回款计划"
                >
                  <Select
                    {...getFieldProps('回款计划', {initialValue: state.moduleJsonDatas['回款计划'],rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                    showSearch
                  >
                    {state.userChildren}
                  </Select>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem
                  {...formItemLayout}
                  label="项目管理费"
                >
                  <Select
                    {...getFieldProps('项目管理费', {initialValue: state.moduleJsonDatas['项目管理费'],rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                    showSearch
                  >
                    {state.userChildren}
                  </Select>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem
                  {...formItemLayout}
                  label="材料费（硬件）"
                >
                  <Select
                    {...getFieldProps('硬件材料费', {initialValue: state.moduleJsonDatas['硬件材料费'],rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                    showSearch
                  >
                    {state.userChildren}
                  </Select>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem
                  {...formItemLayout}
                  label="材料费（质保期）"
                >
                  <Select
                    {...getFieldProps('质保期材料费', {initialValue: state.moduleJsonDatas['质保期材料费'],rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                    showSearch
                  >
                    {state.userChildren}
                  </Select>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem
                  {...formItemLayout}
                  label="间接费（风险）"
                >
                  <Select
                    {...getFieldProps('风险间接费', {initialValue: state.moduleJsonDatas['风险间接费'],rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                    showSearch
                  >
                    {state.userChildren}
                  </Select>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem
                  {...formItemLayout}
                  label="认证费"
                >
                  <Select
                    {...getFieldProps('认证费', {initialValue: state.moduleJsonDatas['认证费'],rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                    showSearch
                  >
                    {state.userChildren}
                  </Select>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem
                  {...formItemLayout}
                  label="人工费（实施）"
                >
                  <Select
                    {...getFieldProps('实施人工费', {initialValue: state.moduleJsonDatas['实施人工费'],rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                    showSearch
                  >
                    {state.userChildren}
                  </Select>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem
                  {...formItemLayout}
                  label="人工费（质保期）"
                >
                  <Select
                    {...getFieldProps('质保期人工费', {initialValue: state.moduleJsonDatas['质保期人工费'],rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                    showSearch
                  >
                    {state.userChildren}
                  </Select>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem
                  {...formItemLayout}
                  label="集成设计费"
                >
                  <Select
                    {...getFieldProps('集成设计费', {initialValue: state.moduleJsonDatas['集成设计费'],rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                    showSearch
                  >
                    {state.userChildren}
                  </Select>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem
                  {...formItemLayout}
                  label="物流成本"
                >
                  <Select
                    {...getFieldProps('物流成本', {initialValue: state.moduleJsonDatas['物流成本'],rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                    showSearch
                  >
                    {state.userChildren}
                  </Select>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem
                  {...formItemLayout}
                  label="财务成本"
                >
                  <Select
                    {...getFieldProps('财务成本', {initialValue: state.moduleJsonDatas['财务成本'],rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                    showSearch
                  >
                    {state.userChildren}
                  </Select>
                </FormItem>
              </Col>
              <Col sm={24} style={{textAlign:'center'}}>
                <Popconfirm title="确定提交当前人员设置吗？" onConfirm={this.handleSubmit}>
                  <Button type="primary">确认并提交</Button>
                </Popconfirm>
              </Col>
            </Row>
          </Form>
        </Spin>
      </div>
    )
  }
});

BudgetSetAuthority = Form.create()(BudgetSetAuthority);

export default BudgetSetAuthority;