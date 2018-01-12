import React from 'react';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import {
  createLevelFourStageForIpd
} from '../../../services/api';

import { message, Spin, Icon, Button, Modal, Switch, Form, Input, DatePicker, Select, Popconfirm, Tooltip } from 'antd';

import styles from '../Common.less';

//ant
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

//main
let CreateLevelFourStage = React.createClass({
  getInitialState() {
    return {
      visible: false,
      loading: false,
      reloadChecked: this.props.initialChecked || 0, //用于父组件更新
      userChildren: [],
      levelThreeItemDatas: this.props.datas,
      projectUsers: this.props.projectUsers
    };
  },
  componentWillReceiveProps(nextProps) {
    if(nextProps.initialChecked != this.props.initialChecked) this.setState({ reloadChecked: nextProps.initialChecked });
    if(nextProps.datas != this.props.datas) this.setState({ levelThreeItemDatas: nextProps.datas });
    if(nextProps.projectUsers != this.props.projectUsers) this.setState({ projectUsers: nextProps.projectUsers });
  },
  showProjectUsers() {
    let _self = this;
    let children = [];

    _.map(_self.state.projectUsers, (item, key, index) => {
      let temp = item.id +'__'+ item.pinyin + item.suoxie +'__'+ item.name;
      children.push(<Option key={key+index} value={temp}>{item.name}</Option>);
    })

    _self.setState({
      userChildren: children,
      loading: false
    });
  },
  showModal() {
    this.setState({ loading: true, visible: true });
    this.showProjectUsers();
  },
  handleCancel(e) {
    this.setState({ visible: false });
  },
  handleSubmit() {
    let _self = this;

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      if(!_self.state.levelThreeItemDatas) return message.warning("获取三级工作项失败，尝试刷新页面重试！");
      // if(!formDatas.name || !formDatas.code || !formDatas.fzr ||!formDatas.times[0] || !formDatas.times[1]) return message.warning("请完善已启用的任务信息！");
      if(!formDatas.name || !formDatas.code || !formDatas.number || !formDatas.fzr) return message.warning("请完善已启用的任务信息！");

      let datas = {
        name: formDatas.name,
        code: formDatas.code,
        number: formDatas.number,
        masterId: formDatas.fzr.split('__')[0]
        // beginTime: moment(formDatas.times[0]).format('YYYY-MM-DD'),
        // endTime: moment(formDatas.times[1]).format('YYYY-MM-DD')
      };

      let newState = ++_self.state.reloadChecked;

      createLevelFourStageForIpd(_self.state.levelThreeItemDatas.id, JSON.stringify(datas)).then((res) => {
        if(res.jsonResult.code < 0) {
          message.warning(res.jsonResult.msg);
        }else {
          message.success("四级工作项创建成功！");
          _self.setState({ reloadChecked: newState });
          _self.props.callbackParent(newState);
          _self.setState({ visible: false });
          _self.props.form.resetFields();
        }
      })

    })
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };

    return (
      <div>
        <center style={{marginTop:15}}>
          <Button onClick={this.showModal} type="dashed"><Icon type="plus" />新增四级工作项</Button>
        </center>
        <Modal
          title="新增四级工作项"
          visible={state.visible}
          onCancel={this.handleCancel}
          footer=""
        >
          <Spin spinning={state.loading}>
            <Form horizontal form={props.form} >
              <FormItem
                label="名称"
                {...formItemLayout}
              >
                <Input {...getFieldProps('name', {rules: [{required: true, type:'string',message:'请输入工作项名称'}] })} placeholder="请输入工作项名称" />
              </FormItem>
              <FormItem
                label="编码"
                {...formItemLayout}
              >
                <Input {...getFieldProps('code', {rules: [{required: true,pattern: /^[a-z0-9_-]*$/ig,type:'string',message:'请填写工作项编码，注意格式'}] })} placeholder="请输入工作项编码，[A-Z、a-z、-、_]" />
              </FormItem>
              <FormItem
                label="序号"
                {...formItemLayout}
              >
                <Input {...getFieldProps('number', {rules: [{required: true,pattern: /^[a-z0-9_-]*$/ig,type:'string',message:'请填写工作项序号，注意格式'}] })} placeholder="请输入工作项序号，[A-Z、a-z、-、_]" />
              </FormItem>
              <FormItem
                label="负责人"
                {...formItemLayout}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  notFoundContent="无法找到，请输入名字部分搜索"
                  style={{ width: '100%'}}
                  placeholder="选择负责人"
                  filterOption={desp_selectFilter}
                  {...getFieldProps('fzr', {rules: [{required: true, message: '请选择负责人' }]})}
                >
                  { state.userChildren }
                </Select>
              </FormItem>
            {/*
              <FormItem
                label="起止时间"
                {...formItemLayout}
              >
                <RangePicker format="yyyy-MM-dd" {...getFieldProps('times', {required: true, rules: [{type:'array',message:'请选择起止时间'}] })}/>
              </FormItem>
            */}
              <FormItem style={{ marginTop:24, textAlign:'center' }}>
                <Popconfirm title="确定要提交该信息吗？" onConfirm={this.handleSubmit}>
                  <Button type="primary">确认并提交</Button>
                </Popconfirm>
              </FormItem>
            </Form>
          </Spin>
        </Modal>
      </div>
    )
  }
});

CreateLevelFourStage = Form.create()(CreateLevelFourStage);

export default CreateLevelFourStage;