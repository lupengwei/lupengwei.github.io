import React from 'react';
import Cookies from 'js-cookie';
import moment from 'moment';
import _ from 'lodash';

import {
  showProject,
  getFileTaskById,
  modifyFileTask
} from '../../../../services/api';

import { Icon, message, Tooltip, Spin, Form, Input, Select, DatePicker, Popconfirm, Button, Popover } from 'antd';

import Warning from '../../../Common/Warning';

import styles from './Common.less';

// ant
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

// main
let ModifyFileTaskForIpd = React.createClass({
  getInitialState() {
    return {
      loading: true,
      reloadChecked: this.props.initialChecked || 0, //用于父组件更新
      projectUsers: [],
      userChildren: [],
      taskDatas: {
        id: '',
        name: '',
        description: '',
        Owner: {
          name: ''
        },
        Approver: {
          name: ''
        },
        Auditor: {
          name: ''
        },
        Files: [],
        Comments: []
      },
      selectedLevelFourStages: [], // 已经选择的四级工作项
      levelFourDatas: this.props.levelFourDatas,
      levelThreeStage: this.props.levelThreeStage,
      levelTwoStage: this.props.levelTwoStage,
    };
  },
  componentDidMount() {
    this.showFileTask(this.props.taskid);
  },
  componentWillReceiveProps(nextProps) {
    if(nextProps.taskid != this.props.taskid) this.showFileTask(nextProps.taskid);
    if(nextProps.levelFourDatas != this.props.levelFourDatas) this.setState({ levelFourDatas: nextProps.levelFourDatas });
    if(nextProps.levelThreeStage != this.props.levelThreeStage) this.setState({ levelThreeStage: nextProps.levelThreeStage });
    if(nextProps.levelTwoStage != this.props.levelTwoStage) this.setState({ levelTwoStage: nextProps.levelTwoStage });
  },
  showProjectInfo() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("若需配置项目，请先选择将要配置的组织");

    showProject(projectId).then((res) => {

      let datas = res.jsonResult.project;

      let children = [];

      _.map(datas.Users, (item, key, index) => {
        let temp = item.id +'__'+ item.pinyin + item.suoxie +'__'+ item.name;
        children.push(<Option key={key+index} value={temp}>{item.name}</Option>);
      })

      _self.setState({
        projectUsers: datas.Users,
        userChildren: children,
        loading: false
      });

    })
  },
  showFileTask(taskid){
    let _self = this;

    getFileTaskById(taskid).then((res) => {
      let datas = res.jsonResult.fileTask;

      // 文件等级及人员
      let tempTaskLevel = null;
      let tempOwner = '';
      let tempAuditor = '';
      let tempAuditors = [];
      let tempApprover = '';

      switch(datas.level) {
        case '1级':
          tempTaskLevel = '1级';
          tempOwner = datas.Owner.id +'__'+ datas.Owner.pinyin + datas.Owner.suoxie +'__'+ datas.Owner.name;
          // 一堆审核人
          _.map(datas.AuditorsLists, (item) => {
            let tempStr = item.id +'__'+ item.pinyin + item.suoxie +'__'+ item.name;
            tempAuditors.push(tempStr);
          })
          tempApprover = datas.Approver.id +'__'+ datas.Approver.pinyin + datas.Approver.suoxie +'__'+ datas.Approver.name;
        break;
        case '2级':
          tempTaskLevel = '2级';
          tempOwner = datas.Owner.id +'__'+ datas.Owner.pinyin + datas.Owner.suoxie +'__'+ datas.Owner.name;
          tempAuditor = datas.Auditor.id +'__'+ datas.Auditor.pinyin + datas.Auditor.suoxie +'__'+ datas.Auditor.name;
          tempApprover = datas.Approver.id +'__'+ datas.Approver.pinyin + datas.Approver.suoxie +'__'+ datas.Approver.name;
        break;
        case '2.1级':
          tempTaskLevel = '2级';
          tempOwner = datas.Owner.id +'__'+ datas.Owner.pinyin + datas.Owner.suoxie +'__'+ datas.Owner.name;
          tempAuditor = datas.Auditor.id +'__'+ datas.Auditor.pinyin + datas.Auditor.suoxie +'__'+ datas.Auditor.name;
          tempApprover = datas.Approver.id +'__'+ datas.Approver.pinyin + datas.Approver.suoxie +'__'+ datas.Approver.name;
        break;
        case '3级':
          tempTaskLevel = '3级';
          tempOwner = datas.Owner.id +'__'+ datas.Owner.pinyin + datas.Owner.suoxie +'__'+ datas.Owner.name;
          tempAuditor = datas.Auditor.id +'__'+ datas.Auditor.pinyin + datas.Auditor.suoxie +'__'+ datas.Auditor.name;
        break;
      }

      // 组装关联的四级工作项
      let tempArray = [];
      _.map(datas.LevelFourStages, (item) => {
        let tempStr = item.id+'__'+item.name;
        tempArray.push(tempStr);
      })

      _self.setState({
        taskDatas: datas,
        taskLevel: tempTaskLevel,
        ownerStr: tempOwner,
        auditorStr: tempAuditor,
        auditorArr: tempAuditors,
        approverStr: tempApprover,
        selectedLevelFourStages: tempArray
      });

      _self.showProjectInfo();

    });
  },
  handleSubmit() {
    let _self = this;

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      // 简单判断
      if(!formDatas.name || !formDatas.description || !formDatas.times[0] || !formDatas.times[1] || !formDatas.auditorDeadLineDate) return message.warning("请完善任务详情，一个也不能少");

      // 检查时间是否在二级范围内及三级结束时间内
      if(!_self.state.levelTwoStage) return message.warning("获取二级工作项信息失败，无法限制时间！");
      if(!_self.state.levelThreeStage) return message.warning("获取三级工作项信息失败，无法限制时间！");

      let tempTwoBeginDate = _self.state.levelTwoStage.beginTime;
      let tempTwoEndDate = _self.state.levelTwoStage.endTime;
      let tempThreeEndDate = _self.state.levelThreeStage.endTime;

      // 1、二级时间范围内
      if(moment(formDatas.times[0]).isBefore(moment(tempTwoBeginDate).format('YYYY-MM-DD 00:00:00')) || moment(formDatas.times[1]).isAfter(moment(tempTwoEndDate).format('YYYY-MM-DD 23:59:59'))) {
        return message.warning("当前计划时间不在二级工作项时间范围，建议时间："+moment(tempTwoBeginDate).format('YYYY-MM-DD')+' ~ '+moment(tempTwoEndDate).format('YYYY-MM-DD'), 3);
      }

      if(formDatas.landmarkType) {

        // 2、开始时间在三级结束时间内
        if(formDatas.landmarkType == '开始里程碑' && moment(formDatas.times[0]).isAfter(moment(tempThreeEndDate).format('YYYY-MM-DD 23:59:59'))) {
          return message.warning("当前计划【开始时间】不在三级工作项时间范围内，开始里程碑建议时间："+moment(tempTwoBeginDate).format('YYYY-MM-DD')+" ~ "+moment(tempThreeEndDate).format('YYYY-MM-DD'), 3);
        }
        // 3、结束时间在三级结束时间内
        if(formDatas.landmarkType == '结束里程碑' && moment(formDatas.times[1]).isAfter(moment(tempThreeEndDate).format('YYYY-MM-DD 23:59:59'))) {
          return message.warning("当前计划【结束时间】不在三级工作项时间范围内，结束里程碑建议时间："+moment(tempTwoBeginDate).format('YYYY-MM-DD')+" ~ "+moment(tempThreeEndDate).format('YYYY-MM-DD'), 3);
        }

      }else if(moment(formDatas.times[1]).isAfter(moment(tempThreeEndDate).format('YYYY-MM-DD 23:59:59'))) {
        //非里程碑

        return message.warning("当前计划【起止时间】不在三级工作项时间范围内，结束里程碑建议时间："+moment(tempTwoBeginDate).format('YYYY-MM-DD')+" ~ "+moment(tempThreeEndDate).format('YYYY-MM-DD'), 3);

      }

      // 审核时间检查
      if(moment(formDatas.auditorDeadLineDate).isBefore(moment(formDatas.times[0]).add(-1, 'days'))) return message.warning("审批时间不能小于开始时间");

      let datas;

      // 获取所有四级工作项
      let tempLevelFourStageIds = '';
      _.map(formDatas.levelFourStageIds, (item) => {
        tempLevelFourStageIds += item.split('__')[0]+',';
      })

      tempLevelFourStageIds = tempLevelFourStageIds.substr(0, tempLevelFourStageIds.length - 1);

      switch(_self.state.taskDatas.level) {
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
            level: _self.state.taskDatas.level,
            code: formDatas.code,
            isLandmark: formDatas.landmarkType ? 'true' : 'false',
            landmarkType: formDatas.landmarkType, // 重大节点
            beginDate: formDatas.times ? formDatas.times[0] : null,
            endDate: formDatas.times ? formDatas.times[1] : null,
            auditorDeadLineDate: formDatas.auditorDeadLineDate,
            levelFourStageIds: tempLevelFourStageIds,
          };
        break;
        case '2.1级':
          datas = {
            name: formDatas.name,
            description: formDatas.description,
            ownerId: formDatas.owner.split('__')[0],
            auditorId: formDatas.auditor.split('__')[0],
            approverId: formDatas.approver.split('__')[0],
            level: _self.state.taskDatas.level,
            code: formDatas.code,
            isLandmark: formDatas.landmarkType ? 'true' : 'false',
            landmarkType: formDatas.landmarkType, // 重大节点
            beginDate: formDatas.times ? formDatas.times[0] : null,
            endDate: formDatas.times ? formDatas.times[1] : null,
            auditorDeadLineDate: formDatas.auditorDeadLineDate,
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
            level: _self.state.taskDatas.level,
            code: formDatas.code,
            isLandmark: formDatas.landmarkType ? 'true' : 'false',
            landmarkType: formDatas.landmarkType, // 重大节点
            beginDate: formDatas.times ? formDatas.times[0] : null,
            endDate: formDatas.times ? formDatas.times[1] : null,
            auditorDeadLineDate: formDatas.auditorDeadLineDate,
            levelFourStageIds: tempLevelFourStageIds,
          };
        break;
      }

      let newState = ++_self.state.reloadChecked;
      _self.setState({ reloadChecked: newState, loading: true });

      modifyFileTask(_self.state.taskDatas.id, JSON.stringify(datas)).then((res) => {
        message.success("修改文件任务成功！");
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

    // 初始化时间
    let beginDate = null;
    let endDate = null;
    let auditorDeadLineDate = null;

    beginDate = state.taskDatas.beginDate ? moment(state.taskDatas.beginDate).format('YYYY-MM-DD') : null;
    endDate = state.taskDatas.endDate ? moment(state.taskDatas.endDate).format('YYYY-MM-DD') : null;
    auditorDeadLineDate = state.taskDatas.auditorDeadLineDate ? moment(state.taskDatas.auditorDeadLineDate).format('YYYY-MM-DD') : null;

    let t_twoBeginDate = moment(state.levelTwoStage.beginTime).format('YYYY-MM-DD');
    let t_twoEndDate = moment(state.levelTwoStage.endTime).format('YYYY-MM-DD');
    let t_threeEndDate = moment(state.levelThreeStage.endTime).format('YYYY-MM-DD');

    return (
      <Spin spinning={state.loading} size="large">
        <div className="desp-modal-task-title">
          <span className="text-danger">❖</span> {state.taskDatas.name}
        </div>
        <div className="desp-modal-content">
          <Form horizontal form={props.form}>
            <FormItem
              label="任务名称"
              {...formItemLayout}
            >
              <Input {...getFieldProps('name', {initialValue: state.taskDatas.name, rules: [{required: true, message: '请输入任务名称' }]})} placeholder="请输入任务名称" />
            </FormItem>
            <FormItem
              label="任务描述"
              {...formItemLayout}
            >
              <Input type="textarea" {...getFieldProps('description', {initialValue: state.taskDatas.description, rules: [{required: true, message: '请输入任务描述' }]})} placeholder="请输入任务描述" />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="文件等级"
            >
              {state.taskLevel}
              <Popover placement="right" content="分别对应1类、2类、3类文件" trigger="hover"><Icon type="question-circle-o" style={{marginLeft:10,color:'#FF753A'}}/></Popover>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="编写人"
            >
              <Select
                showSearch
                optionFilterProp="children"
                notFoundContent="无法找到，请输入名字部分搜索"
                style={{height: '32px' }}
                placeholder="如：王 ~"
                filterOption={desp_selectFilter}
                {...getFieldProps('owner', {initialValue: state.ownerStr || null, rules: [{required: true, message:'请选择编写人'}] })}
              >
                { state.userChildren }
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={state.taskDatas.level == '3级' ? '批准人' : '审核人'}
            >
              {/* 1级文件类型 有多个审核人 */
                state.taskDatas.level == '1级' ?
                  <Select
                    multiple
                    optionFilterProp="children"
                    notFoundContent="无法找到，请输入名字部分搜索"
                    placeholder="如：张三、李四、王五"
                    filterOption={desp_selectFilter}
                    {...getFieldProps('auditors', {initialValue: state.auditorArr || null, rules: [{required: true, message:'请选择审核人'}] })}
                  >
                    { state.userChildren }
                  </Select>
                :
                  <Select
                    showSearch
                    optionFilterProp="children"
                    notFoundContent="无法找到，请输入名字部分搜索"
                    style={{height: '32px' }}
                    placeholder="如：张 ~"
                    filterOption={desp_selectFilter}
                    {...getFieldProps('auditor', {initialValue: state.auditorStr || null, rules: [{required: true, message:'请选择审核人'}] })}
                  >
                    { state.userChildren }
                  </Select>
              }
            </FormItem>
            {/* 3类文件的批准人 后台是存在auditorId里面的 */
              state.taskDatas.level != '3级' ?
                <FormItem
                  {...formItemLayout}
                  label="批准人"
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    notFoundContent="无法找到，请输入名字部分搜索"
                    style={{height: '32px' }}
                    placeholder="如：李 ~"
                    filterOption={desp_selectFilter}
                    {...getFieldProps('approver', {initialValue: state.approverStr || null, rules: [{required: true, message:'请选择批准人'}] })}
                  >
                    { state.userChildren }
                  </Select>
                </FormItem>
              :
                null
            }
            <FormItem
              label="文件编号"
              {...formItemLayout}
            >
              <Input {...getFieldProps('code', {initialValue: state.taskDatas.code, rules: [{required: true, message: '请输入文件编号' }]})} placeholder="请输入文件编号" />
            </FormItem>
            <FormItem
              {...formItemLayout}
              style={{marginBottom: 10}}
              label="审核结束时间（必选）"
            >
              <DatePicker {...getFieldProps('auditorDeadLineDate', {initialValue: auditorDeadLineDate })} placeholder="请选择审核结束时间" />
            </FormItem>
            <FormItem
              label="计划时间（必选）"
              {...formItemLayout}
            >
              <RangePicker format="yyyy-MM-dd" {...getFieldProps('times', {initialValue: [beginDate, endDate] })}/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              style={{marginBottom: 10}}
              label="任务属性"
            >
              <Select {...getFieldProps('landmarkType', {initialValue: state.taskDatas.landmarkType || ''})} placeholder="请选择任务属性（选填）" >
                <Option value="">无</Option>
                <Option value="开始里程碑">开始里程碑</Option>
                <Option value="结束里程碑">结束里程碑</Option>
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              style={{marginBottom: 10}}
              label="四级工作项"
            >
              <Select
                multiple
                placeholder="请选择四级工作项"
                {...getFieldProps('levelFourStageIds', {initialValue: state.selectedLevelFourStages || null, rules: [{required: true, type:'array', message: '请选择四级工作项' }]})}
              >
                {
                  _.map(state.levelFourDatas, (item, key) => {
                    let tempValue = item.id+'__'+item.name;
                    return (
                      <Option key={key} value={tempValue}>{item.name}</Option>
                    );
                  })
                }
              </Select>
            </FormItem>
            <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
              <Popconfirm title="确定要修改该文件任务吗？" onConfirm={this.handleSubmit}>
                <Button type="primary">确定修改文件任务</Button>
              </Popconfirm>
            </FormItem>
          </Form>

          <div className="desp-tips-block-box">
            <div className="desp-tips-title">dES提示：</div>
            <div className="desp-tips-item">二级工作项起止时间：{ t_twoBeginDate } ~ { t_twoEndDate }</div>
            <div className="desp-tips-item">三级工作项结束时间：* ~ { t_threeEndDate }</div>
          </div>

        </div>
      </Spin>
    );
  }
});

ModifyFileTaskForIpd = Form.create()(ModifyFileTaskForIpd);

export default ModifyFileTaskForIpd;