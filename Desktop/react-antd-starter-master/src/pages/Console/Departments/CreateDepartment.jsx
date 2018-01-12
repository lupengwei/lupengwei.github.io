import React from 'react';
import QueueAnim from 'rc-queue-anim';
import Cookies from 'js-cookie';

import { createOrganize } from '../../../services/api';

import { Form, Input, Button, message, Checkbox, Icon, Spin } from 'antd';

//ant
const FormItem = Form.Item;

//main
let CreateDepartment = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState() {
    return {
      loading: false, //提交进度
    };
  },
  handleSubmit(e) {
    e.preventDefault();
    var formDatas = this.props.form.getFieldsValue(),
        _self = this;
    
    if(!formDatas.name || !formDatas.number || !formDatas.fullname || !formDatas.sszgs) return message.error('请将信息填写完善，一个都不能少');

    var datas = {
      name: formDatas.name,
      description: formDatas.description,
      number: formDatas.number,
      fullname: formDatas.fullname,
      sszgs: formDatas.sszgs,
      type: 'department'
    };

    this.setState({ loading: true });

    createOrganize(JSON.stringify(datas)).then(function(res){
      let projectDatas = res.jsonResult.project;
      message.success('项目创建成功');
      setTimeout(function(){
	      _self.setState({ loading: false });
        Cookies.set('presentBelongProjectName', projectDatas.name);
        Cookies.set('presentBelongProjectId', projectDatas.id);
        Cookies.set('presentProjectStatus', projectDatas.status);
        Cookies.set('presentProjectType', projectDatas.type);
        _self.context.router.push('/console/department/setPersons');
      },500);
    });
  },
  render() {
    var state = this.state,
        props = this.props,
        _self = this;

    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <QueueAnim delay={100} type="bottom" >
        <Spin spinning={state.loading}>
          <Form key="a" horizontal onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="部门名称"
            >
              <Input type="text" placeholder="请输入新部门名称，如：综合管理部" {...getFieldProps('name', { initialValue: '' })} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="部门全称"
            >
              <Input type="text" placeholder="请输入部门全称，如：综合管理部" {...getFieldProps('fullname', { initialValue: '' })} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="部门编号"
            >
              <Input type="text" placeholder="请输入新部门编号，如：1401-CQ-BAA" {...getFieldProps('number', { initialValue: '' })} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="上级部门"
            >
              <Input type="text" placeholder="请输入所属子公司，如：重庆子公司" {...getFieldProps('sszgs', { initialValue: '' })} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="部门简介"
            >
              <Input type="textarea" placeholder="请输入部门简介（选填）" autosize={{ minRows: 6, maxRows: 6 }} {...getFieldProps('description', { initialValue: '' })} />
            </FormItem>
            <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
              <Button type="primary" htmlType="submit">确认并提交</Button>
            </FormItem>
          </Form>
        </Spin>
      </QueueAnim>
    );
  },
});

CreateDepartment = Form.create()(CreateDepartment);

export default CreateDepartment;