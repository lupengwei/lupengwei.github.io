import React from 'react';
import moment from 'moment';
import Cookies from 'js-cookie';

import { Form, Input, Button, Select, Icon, message, Spin, DatePicker, Popconfirm, Popover, notification } from 'antd';

import styles from '../Common.less';

import {
  showProject,
  createDefaultFileTaskForIpd,
} from '../../../services/api';

/**
 * props
 * initialChecked、stage
 */

// ant组件
const FormItem    = Form.Item;
const Option      = Select.Option;
const RangePicker = DatePicker.RangePicker;

// 子组件-添加文件任务
let CreateFileTask = React.createClass({
  getInitialState() {
    return {
      loading: true,
      reloadChecked: this.props.initialChecked || 0, // 用于父组件更新
      userChildren: [],
      ownerId: '',
      approverId: '',
      auditorId: '',
      auditorDeadLineDate: '',
      taskSelectLevel: '2.1级', // 默认文件等级
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
  handleChangeTaskLevel(e){
    if(e) return this.setState({ taskSelectLevel: e });
  },
  handleSubmit(e){
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("获取项目信息失败，请重新获取！");
    if(!_self.state.levelFourStageId) return message.warning("获取四级工作项失败，请重新获取！");

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      console.log(formDatas)

      if(_.size(formDatas.levelFourStageIds) == 0) return message.warning("请先选择四级工作项！", 3);

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

      let datas;
      let t_flag = false; // 终止标识

      switch(_self.state.taskSelectLevel){
        case '1级':
          let tempAuditorIds = '';

          _.map(formDatas.auditors, (item) => {
            tempAuditorIds += ','+item.split('__')[0];
          })

          tempAuditorIds = tempAuditorIds.substr(1, tempAuditorIds.length);

          datas = {
            name: formDatas.name,
            description: formDatas.description,
            ownerId: formDatas.owner.split('__')[0],
            auditorIds: tempAuditorIds,
            approverId: formDatas.approver.split('__')[0],
            level: _self.state.taskSelectLevel,
            code: formDatas.code,
            isLandmark: formDatas.landmarkType ? 'true' : 'false',
            landmarkType: formDatas.landmarkType, // 重大节点
            beginDate: formDatas.times ? formDatas.times[0] : null,
            endDate: formDatas.times ? formDatas.times[1] : null,
            levelFourStageIds: tempLevelFourStageIds,
          };

          // 审核人员为空
          if(!formDatas.auditors) t_flag = true;

        break;
        case '2.1级':
          datas = {
            name: formDatas.name,
            description: formDatas.description,
            ownerId: formDatas.owner.split('__')[0],
            auditorId: formDatas.auditor.split('__')[0],
            approverId: formDatas.approver.split('__')[0],
            level: _self.state.taskSelectLevel,
            code: formDatas.code,
            isLandmark: formDatas.landmarkType ? 'true' : 'false',
            landmarkType: formDatas.landmarkType, // 重大节点
            beginDate: formDatas.times ? formDatas.times[0] : null,
            endDate: formDatas.times ? formDatas.times[1] : null,
            levelFourStageIds: tempLevelFourStageIds,
          };
        break;
        case '3级':
          // 3级文件批准人存在auditorId里
          datas = {
            name: formDatas.name,
            description: formDatas.description,
            ownerId: formDatas.owner.split('__')[0],
            auditorId: formDatas.auditor.split('__')[0],
            approverId: null,
            level: _self.state.taskSelectLevel,
            code: formDatas.code,
            isLandmark: formDatas.landmarkType ? 'true' : 'false',
            landmarkType: formDatas.landmarkType, // 重大节点
            beginDate: formDatas.times ? formDatas.times[0] : null,
            endDate: formDatas.times ? formDatas.times[1] : null,
            levelFourStageIds: tempLevelFourStageIds,
          };
        break;
      }

      // 当不满足要求的时候，直接结束
      if(t_flag) {
        message.warning("当前审核人员为空，请再次确认审核人员！");
        return false;
      }

      let newState = ++_self.state.reloadChecked;
      _self.setState({ reloadChecked: newState, loading: true });

      createDefaultFileTaskForIpd(projectId, JSON.stringify(datas)).then(function(res){
        if(res.jsonResult.code < 0) {
          message.warning(res.jsonResult.msg + '，不能重复创建文件任务！', 3);
          _self.setState({ loading: false });
        }else {
          message.success("该任务创建成功");
          _self.props.callbackParent(newState);
          _self.props.form.resetFields(); // 重置表单
          _self.setState({ loading: false });
        }
      });

    })

  },
  getUsersOfProject(){
    let projectId = Cookies.get('presentBelongProjectId'),
        _self     = this,
        children  = []; // 用于中转复制，直接赋值重新渲染会有Select key重复警告

    showProject(projectId).then(function(res) {
      let usersArray = res.jsonResult.project.Users;
      _.map(usersArray, function(item, key){
        let temp = item.id +'__'+ item.pinyin + item.suoxie + item.name + '__' + item.UserProjects.role;
        children.push(<Option key={key} value={temp}>{item.name + '-' + item.UserProjects.role}</Option>);
      })
      _self.setState({ userChildren: children, loading: false });
    });
  },
  handleLandmark(e) {
    let tempIsLandmarkTask = e ? true : false;
    this.setState({ isLandmarkTask: tempIsLandmarkTask });
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    const { getFieldProps } = props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    const formItemLayoutBySelect = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };

    return (
      <Spin spinning={state.loading} size="large">
        <div className={styles["desp-modal-task-title"]}><Icon className="text-danger" type="pushpin" /> 新增文档任务</div>
        <div className={styles["desp-modal-content"]}>
          <Form horizontal form={props.form}>
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
              <Input type="textarea" placeholder="请输入任务描述" {...getFieldProps('description', {rules: [{required: true, message:'请输入任务描述'}] })} />
            </FormItem>
            <FormItem
              labelCol={{ span: 6 }}
              style={{marginBottom: 10}}
              label="文件等级"
            >
              <Select
                style={{width:100}}
                defaultValue={state.taskSelectLevel}
                onChange={this.handleChangeTaskLevel}
              >
                <Option value="1级">1级</Option>
                <Option value="2.1级">2级</Option>
                <Option value="3级">3级</Option>
              </Select>
              <Popover placement="right" content="分别对应1类、2类、3类文件" trigger="hover"><Icon type="question-circle-o" style={{marginLeft:10,color:'#FF753A'}}/></Popover>
            </FormItem>
            <FormItem
              {...formItemLayoutBySelect}
              label="编写人"
            >
              <Select
                showSearch
                optionFilterProp="children"
                notFoundContent="无法找到，请输入名字部分搜索"
                style={{ width: '50%', height: '32px' }}
                placeholder="如：王 ~"
                filterOption={desp_selectFilter}
                {...getFieldProps('owner', {rules: [{required: true, message:'请选择编写人'}] })}
              >
                { state.userChildren }
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayoutBySelect}
              label={state.taskSelectLevel == '3级' ? '批准人' : '审核人'}
            >
              {/* 1级文件类型 有多个审核人 */
                state.taskSelectLevel == '1级' ?
                  <Select
                    multiple
                    optionFilterProp="children"
                    notFoundContent="无法找到，请输入名字部分搜索"
                    style={{ width: '50%' }}
                    placeholder="如：张三、李四、王五"
                    filterOption={desp_selectFilter}
                    {...getFieldProps('auditors')}
                  >
                    { state.userChildren }
                  </Select>
                :
                  <Select
                    showSearch
                    optionFilterProp="children"
                    notFoundContent="无法找到，请输入名字部分搜索"
                    style={{ width: '50%', height: '32px' }}
                    placeholder="如：张 ~"
                    filterOption={desp_selectFilter}
                    {...getFieldProps('auditor', {rules: [{required: true, message:'请选择审核人'}] })}
                  >
                    { state.userChildren }
                  </Select>
              }
            </FormItem>
            {/* 3类文件的批准人 后台是存在auditorId里面的 */
              state.taskSelectLevel != '3级' ?
                <FormItem
                  {...formItemLayoutBySelect}
                  label="批准人"
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    notFoundContent="无法找到，请输入名字部分搜索"
                    style={{ width: '50%', height: '32px' }}
                    placeholder="如：李 ~"
                    filterOption={desp_selectFilter}
                    {...getFieldProps('approver', {rules: [{required: true, message:'请选择批准人'}] })}
                  >
                    { state.userChildren }
                  </Select>
                </FormItem>
              :
                null
            }
            {/*
              <FormItem
                {...formItemLayout}
                style={{marginBottom: 10}}
                label="审核结束时间"
              >
                <DatePicker {...getFieldProps('auditorDeadLineDate', {rules: [{required: true, message:'请选择审核结束时间'}] })} placeholder="请选择审核结束时间" />
              </FormItem>
            */}
            <FormItem
              {...formItemLayout}
              style={{marginBottom: 10}}
              label="文件编号"
            >
              <Input style={{width:'40%'}} placeholder="请输入文档编号" {...getFieldProps('code', {rules: [{required: true, message:'请输入文档编号'}] })} />
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
                  <RangePicker format="yyyy-MM-dd" {...getFieldProps('times', {rules: [{required: true, message:'请选择起止时间'}] })} />
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
              <Popconfirm title="确定要提交该文档任务吗？" onConfirm={this.handleSubmit}>
                <Button type="primary">确定新增文档任务</Button>
              </Popconfirm>
            </FormItem>
          </Form>
        </div>
      </Spin>
    );
  }
});

CreateFileTask = Form.create()(CreateFileTask);

export default CreateFileTask;