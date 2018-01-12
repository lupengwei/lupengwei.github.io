import React from 'react';
import moment from 'moment';
import Cookies from 'js-cookie';

import { Form, Input, Button, Select, Icon, message, Spin, DatePicker, Popconfirm } from 'antd';

import styles from '../Common.less';

import {
  showProject,
  createDefaultNormalTaskForIpd
} from '../../../services/api';

/**
 * props
 * initialChecked、stage
 */

//ant组件
const FormItem    = Form.Item;
const Option      = Select.Option;
const RangePicker = DatePicker.RangePicker;

// 子组件-添加通用任务
let CreateNormalTask = React.createClass({
  getInitialState() {
    return {
      loading: true,
      reloadChecked: this.props.initialChecked || 0, // 用于父组件更新
      userChildren: [],
      isLandmarkTask: false, // 是否为里程碑任务
      levelFourStageId: this.props.levelFourStageId,
      levelTwoDatas: this.props.levelTwoDatas, // 四级工作项的二级工作项
      levelThreeDatas: this.props.levelThreeDatas, // 四级工作项的三级工作项
      levelFourDatas: this.props.levelFourDatas, // 同级四级工作项
    };
  },
  componentDidMount() {
    this.getUsersOfProject();
  },
  componentWillReceiveProps(nextProps) {
    if(nextProps.initialChecked != this.props.initialChecked) this.setState({ reloadChecked: nextProps.initialChecked });
    if(nextProps.levelFourStageId != this.props.levelFourStageId) this.setState({ levelFourStageId: nextProps.levelFourStageId });
    if(nextProps.levelFourDatas != this.props.levelFourDatas) this.setState({ levelFourDatas: nextProps.levelFourDatas });
    if(nextProps.levelThreeDatas != this.props.levelThreeDatas) this.setState({ levelThreeDatas: nextProps.levelThreeDatas });
    if(nextProps.levelTwoDatas != this.props.levelTwoDatas) this.setState({ levelTwoDatas: nextProps.levelTwoDatas });
  },
  handleSubmit(e){
    let _self    = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("获取项目信息失败，请重新获取！");
    if(!_self.state.levelFourStageId) return message.warning("获取四级工作项失败，请重新获取！");

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      // 简单表单判断
      if(!formDatas.user || !formDatas.name || !formDatas.description) return message.warning("请完善任务详情，一个也不能少");

      if(_.size(formDatas.levelFourStageIds) == 0) return message.warning("请先选择四级工作项！");

      // 里程碑计划时间判断
      if(formDatas.landmarkType) {

        if(!formDatas.times[0] && !formDatas.times[1]) return message.warning("请输入任务的计划时间");

        // 检查时间是否在二级范围内及三级结束时间内
        if(!_self.state.levelTwoDatas) return message.warning("获取二级工作项信息失败，无法限制时间！");
        if(!_self.state.levelThreeDatas) return message.warning("获取三级工作项信息失败，无法限制时间！");

        let tempTwoBeginDate = _self.state.levelTwoDatas.beginTime;
        let tempTwoEndDate = _self.state.levelTwoDatas.endTime;
        let tempThreeEndDate = _self.state.levelThreeDatas.endTime;
        // 1、二级时间范围内
        if(moment(formDatas.times[0]).isBefore(moment(tempTwoBeginDate).format('YYYY-MM-DD 00:00:00')) || moment(formDatas.times[1]).isAfter(moment(tempTwoEndDate).format('YYYY-MM-DD 23:59:59'))) {
          return message.warning("当前计划时间不在二级工作项时间范围，建议时间："+moment(tempTwoBeginDate).format('YYYY-MM-DD')+' ~ '+moment(tempTwoEndDate).format('YYYY-MM-DD'), 3);
        }
        // 2、开始时间在三级结束时间内
        if(formDatas.landmarkType == '开始里程碑' && moment(formDatas.times[0]).isAfter(moment(tempThreeEndDate).format('YYYY-MM-DD 23:59:59'))) {
          return message.warning("当前计划【开始时间】不在三级工作项时间范围内，开始里程碑建议时间："+moment(tempTwoBeginDate).format('YYYY-MM-DD')+" ~ "+moment(tempThreeEndDate).format('YYYY-MM-DD'), 3);
        }
        // 3、结束时间在三级结束时间内
        if(formDatas.landmarkType == '结束里程碑' && moment(formDatas.times[1]).isAfter(moment(tempThreeEndDate).format('YYYY-MM-DD 23:59:59'))) {
          return message.warning("当前计划【结束时间】不在三级工作项时间范围内，结束里程碑建议时间："+moment(tempTwoBeginDate).format('YYYY-MM-DD')+" ~ "+moment(tempThreeEndDate).format('YYYY-MM-DD'), 3);
        }

      }

      // 获取所有四级工作项
      let tempLevelFourStageIds = '';
      _.map(formDatas.levelFourStageIds, (item) => {
        tempLevelFourStageIds += item.split('__')[0]+',';
      })

      tempLevelFourStageIds = tempLevelFourStageIds.substr(0, tempLevelFourStageIds.length - 1);

      let datas = {
        name: formDatas.name,
        description: formDatas.description,
        ownerId: formDatas.user.split('__')[0],
        isLandmark: formDatas.landmarkType ? 'true' : 'false',
        landmarkType: formDatas.landmarkType, // 重大节点
        startTime: formDatas.times ? formDatas.times[0] : null,
        endTime: formDatas.times ? formDatas.times[1] : null,
        levelFourStageIds: tempLevelFourStageIds,
      };

      let newState = ++_self.state.reloadChecked;

      _self.setState({ reloadChecked: newState, loading: true });

      createDefaultNormalTaskForIpd(projectId, JSON.stringify(datas)).then(function(res){
        message.success("该通用任务创建成功！");
        _self.props.callbackParent(newState);
        _self.props.form.resetFields(); //重置表单
        _self.setState({ loading: false });
      });
      
    })

  },
  getUsersOfProject(){
    let _self     = this;
    let children  = []; //用于中转复制，直接赋值重新渲染会有Select key重复警告
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("获取项目信息失败，请重新获取！");

    showProject(projectId).then(function(res) {

      let usersArray = res.jsonResult.project.Users;

      _.map(usersArray, function(item, key){
        let temp = item.id +'__'+ item.pinyin + item.suoxie + item.name + '__' + item.UserProjects.role;
        children.push(<Option key={key} value={temp}>{item.name + '-' + item.UserProjects.role}</Option>);
      })

      _self.setState({
        userChildren: children,
        loading: false
      });

    });
  },
  handleLandmark(e) {
    let tempIsLandmarkTask = e ? true : false;
    this.setState({ isLandmarkTask: tempIsLandmarkTask });
  },
  render(){
    let state = this.state,
        props = this.props,
        _self = this;

    const { getFieldProps } = props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };

    return (
      <Spin spinning={state.loading} size="large">
        <div className={styles["desp-modal-task-title"]}><Icon className="text-danger" type="pushpin" /> 新增通用任务</div>
        <div className={styles["desp-modal-content"]}>
          <Form horizontal form={props.form}>
            <FormItem
              {...formItemLayout}
              label="负责人"
            >
              <Select
                showSearch
                optionFilterProp="children"
                notFoundContent="无法找到，请输入名字部分搜索"
                style={{ width: '100%', height: '32px' }}
                placeholder="如：王浩*"
                filterOption={desp_selectFilter}
                {...getFieldProps('user', {rules: [{required: true, message:'请选择任务负责人'}] })}
              >
                { state.userChildren }
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              style={{marginBottom: 10}}
              label="任务名"
            >
              <Input {...getFieldProps('name', {rules: [{required: true, message:'请输入任务名'}] })} placeholder="请输入任务名" />
            </FormItem>
            <FormItem
              {...formItemLayout}
              style={{marginBottom: 10}}
              label="任务描述"
            >
              <Input type="textarea" {...getFieldProps('description', {rules: [{required: true, message:'请输入任务描述'}] })} placeholder="请输入任务描述" />
            </FormItem>
            <FormItem
              {...formItemLayout}
              style={{marginBottom: 10}}
              label="任务属性"
            >
              <Select {...getFieldProps('landmarkType', {onChange: _self.handleLandmark})} placeholder="请选择任务属性（选填）" >
                <Option value="">无</Option>
                <Option value="开始里程碑">开始里程碑</Option>
                <Option value="结束里程碑">结束里程碑</Option>
              </Select>
            </FormItem>
            {
              state.isLandmarkTask ?
                <FormItem
                  {...formItemLayout}
                  style={{marginBottom: 10}}
                  label="起止时间"
                >
                  <RangePicker format="yyyy-MM-dd" {...getFieldProps('times', {rules: [{required:true,type:'array',message:'请选择起止时间'}] })} />
                </FormItem>
              :
                null
            }
            <FormItem
              {...formItemLayout}
              style={{marginBottom: 10}}
              label="关联四级工作项"
            >
              <Select
                multiple
                placeholder="请选择四级工作项"
                {...getFieldProps('levelFourStageIds')}
              >
                {/* 全部为opened状态的四级工作项 */
                  _.map(state.levelFourDatas, (item, key) => {
                    return (
                      <Option key={key} value={item.id+'__'+item.name}>{item.name}</Option>
                    );
                  })
                }
              </Select>
            </FormItem>
            <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
              <Popconfirm title="确定要提交该通用任务吗？" onConfirm={this.handleSubmit}>
                <Button type="primary">确定新增通用任务</Button>
              </Popconfirm>
            </FormItem>
          </Form>
        </div>
      </Spin>
    );
  }
});

CreateNormalTask = Form.create()(CreateNormalTask);

export default CreateNormalTask;