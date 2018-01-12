import React from 'react';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import {
  getAllUsers,
  updateLevelTwoStageForIpd
} from '../../../services/api';

import { message, Spin, Icon, Button, Modal, Switch, Form, Input, DatePicker, Select, Popconfirm, Tooltip } from 'antd';

import styles from '../Common.less';

//ant
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

//main
let ModifyLevelTwoStage = React.createClass({
  getInitialState() {
    return {
      loading: false,
      reloadChecked: this.props.initialChecked || 0, //用于父组件更新
      userChildren: [],
      taskDatas: this.props.taskDatas,
      isSelected: this.props.taskDatas.opened,
      allUserDatas: this.props.projectUsers,
      projectUsers: this.props.projectUsers
    };
  },
  componentDidMount() {
    this.showProjectUsers();
  },
  componentWillReceiveProps(nextProps) {
    if(nextProps.initialChecked != this.props.initialChecked || nextProps.taskDatas.id != this.props.taskDatas.id || nextProps.projectUsers != this.props.projectUsers) {
      this.setState({
        reloadChecked: nextProps.initialChecked,
        taskDatas: nextProps.taskDatas,
        isSelected: nextProps.taskDatas.opened,
        allUserDatas: nextProps.projectUsers,
        projectUsers: nextProps.projectUsers,
      });
    }
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
  handleActiveTask(e) {
    this.setState({ isSelected: e});
  },
  handleModifySubmit() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    let levelTwoStageId = _self.state.taskDatas.id;

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      let datas = {};

      if(_self.state.isSelected) {

        if(!formDatas.fzr ||!formDatas.times[0] || !formDatas.times[1]) return message.warning('请完善已启用的任务信息！');

        datas = {
          opened: 'true',
          index: formDatas.index,
          masterId: formDatas.fzr.split('__')[0],
          beginTime: moment(formDatas.times[0]).format('YYYY-MM-DD'),
          endTime: moment(formDatas.times[1]).format('YYYY-MM-DD')
        };

      }else {

        if(!formDatas.closeComment) return message.warning('请完善关闭信息！');

        datas = {
          opened: 'false',
          closeComment: formDatas.closeComment
        };

      }

      let newState = ++_self.state.reloadChecked;

      updateLevelTwoStageForIpd(projectId, levelTwoStageId, JSON.stringify(datas)).then((res) => {

        if(res.jsonResult.code < 0) return message.warning(res.jsonResult.msg);

        message.success('数据更新成功！');
        _self.setState({ reloadChecked: newState });
        _self.props.callbackParent(newState);
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

    let beginTime = null;
    let endTime = null;
    let userInfo = null;

    beginTime = state.taskDatas.beginTime ? moment(state.taskDatas.beginTime).format('YYYY-MM-DD') : null;
    endTime = state.taskDatas.endTime ? moment(state.taskDatas.endTime).format('YYYY-MM-DD') : null;

    _.map(state.allUserDatas, (item) => {
      if(state.taskDatas.masterId == item.id) {
        userInfo = item.id +'__'+ item.pinyin + item.suoxie +'__'+ item.name;
      }
    })

    return (
      <Spin spinning={state.loading}>
        <div className="desp-modal-task-title">
          <Icon className="text-danger" type="pushpin" />&nbsp;
          <span>{state.taskDatas.name}<font style={{color:'#CCC',fontSize:12,fontWeight:400}}> . 二级工作项</font></span>
        </div>
        <Form horizontal form={props.form}>
          <FormItem
            label="是否启用此项"
            {...formItemLayout}
          >
            {
              state.isSelected ?
                <i onClick={this.handleActiveTask.bind(null, !state.isSelected)} className="iconfont icon-kaiguan11" style={{color:'#77CA56',fontSize:26}}></i>
              :
                <i onClick={this.handleActiveTask.bind(null, !state.isSelected)} className="iconfont icon-kaiguan1" style={{fontSize:26}}></i>
            }
          </FormItem>
          {
            state.isSelected ?
              <div>
                <FormItem
                  label="序号"
                  {...formItemLayout}
                >
                  <Input {...getFieldProps('index', {initialValue: state.taskDatas.index.toString() || '0', rules: [{required: true, message: '请输入排列序号' }]})} placeholder="请输入排列序号" />
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
                    {...getFieldProps('fzr', {initialValue: userInfo || null, rules: [{required: true, message: '请选择负责人' }]})}
                  >
                    { state.userChildren }
                  </Select>
                </FormItem>
                <FormItem
                  label="起止时间"
                  {...formItemLayout}
                >
                  <RangePicker format="yyyy-MM-dd" {...getFieldProps('times', {initialValue: [beginTime, endTime],rules: [{required: true, type:'array',message:'请选择起止时间'}] })}/>
                </FormItem>
              </div>
            :
              <FormItem
                label="关闭理由"
                {...formItemLayout}
              >
                <Input type="textarea" rows={4} {...getFieldProps('closeComment', {initialValue: state.taskDatas.closeComment})} placeholder="请输入关闭理由" />
              </FormItem>
          }
          <FormItem style={{ marginTop:24, textAlign:'center' }}>
            <Popconfirm title="确定要提交该信息吗？" onConfirm={this.handleModifySubmit}>
              <Button type="primary">确认并提交</Button>
            </Popconfirm>
          </FormItem>
        </Form>
      </Spin>
    )
  }
});

ModifyLevelTwoStage = Form.create()(ModifyLevelTwoStage);

export default ModifyLevelTwoStage;