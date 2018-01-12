import React from 'react';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import {
  getMyFileTasks,
  showProject,
  createMyFileTask,
  deleteFileTaskById,
  comfirmMyFileTaskList,
  getProjectStageDefaultTasks,
  getMyFileTaskFileListStatus,
  getFileTaskById,
  modifyFileTask
} from '../../../services/api';

import { message, Icon, Select, Button, Row, Col, Spin, Collapse, Popconfirm, Tooltip, Modal, Form, Input, DatePicker, Popover } from 'antd';

import styles from '../Common.less';

//ant
const createForm  = Form.create;
const FormItem    = Form.Item;
const Option      = Select.Option;
const RangePicker = DatePicker.RangePicker;
const Panel       = Collapse.Panel;

//main
let EditFileList = React.createClass({
  getInitialState: function() {
    return {
      loading: false,
      projectId: Cookies.get('presentBelongProjectId'),
      reloadChecked: 0, //检查渲染条件
      formDatas: '',
      taskFileList: '', //任务文件清单
      isComfirm: false,
      refusedMsg: '' //拒绝理由
    };
  },
  componentDidMount: function() {
    this.getMyFileTask();
    this.getMyFileTaskFileListStatus();
  },
  componentWillUpdate: function(nextProps, nextState) {
    if(nextState.reloadChecked != this.state.reloadChecked) return this.getMyFileTask();
  },
  onChildChanged: function(newState){
    //监听子组件的状态变化
    this.setState({ reloadChecked: newState });
  },
  getMyFileTask: function(){
    var _self = this;

    getMyFileTasks(_self.state.projectId).then(function(res){
      console.log(res.jsonResult.defaultTasks)
      _self.setState({ formDatas: res.jsonResult.defaultTasks });
    });
  },
  deleteMyFileTask: function(taskId, counts){
    var _self = this;

    if(counts != 0) return message.warning("本文件任务下挂有文件，无法删除！");

    deleteFileTaskById(taskId).then(function(res){
      _self.getMyFileTask();
      message.success("删除文件任务清单成功");
    })
  },
  comfirmMyFileTaskList: function(){
    var _self = this;

    comfirmMyFileTaskList(_self.state.projectId).then(function(res){
      _self.getMyFileTask();
      _self.getMyFileTaskFileListStatus();
      message.success("确认文件任务清单成功");
    })
  },
  getMyFileTaskFileListStatus: function(){
    var _self = this;

    getMyFileTaskFileListStatus(_self.state.projectId).then(function(res){
      var temp = res.jsonResult.comfirmationForm;
      _self.setState({ isComfirm: temp.isComfirm, refusedMsg: temp.reason });
    })
  },
  render: function() {
    var props  = this.props,
        state  = this.state,
        _self  = this,
        counts = 0;

    return (
      <QueueAnim delay={100} type="bottom">
        {
          state.refusedMsg ?
            <div style={{textAlign:'center'}}>
              <Popover content={state.refusedMsg} trigger="hover">
                <span className="text-danger">您提交的清单审核已被拒绝 <Icon type="question-circle-o" /></span>
              </Popover>
            </div>
          :
            null
        }

        <div style={{padding:10}}>当前配置项目：{Cookies.get('presentBelongProjectName')}</div>

        <Collapse defaultActiveKey={['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14']}>
          {
            _.map(state.formDatas, function(item1, key1){
              counts++;
              let taskName = key1;
              if(key1 == 'undefined') taskName = <span className="text-danger">未挂任何任务的文件</span>;
              return (
                  <Panel header={taskName} key={counts}>
                    {
                      _.map(item1, function(item2, key2){
                        if(item2.isNecessary) {
                          return (
                            <div className={styles['desp-card']} key={item2.id}>
                              <ModifyFileTask name={item2.name} taskId={item2.id} callbackParent={_self.onChildChanged} initialChecked={_self.state.reloadChecked} />
                              <div className={styles['option']}>
                                <Popconfirm title="确认要删除该文件任务吗？" placement="left" onConfirm={_self.deleteMyFileTask.bind(null, item2.id, item2.Files.length)}>
                                  <Icon type="cross-circle-o" style={{marginLeft:8,cursor:'pointer'}} title="删除"/>
                                </Popconfirm>
                              </div>
                            </div>
                          )
                        }else {
                          return null
                        }
                      })
                    }
                  </Panel>
                )
            })
          }
        </Collapse>
        <div>
          {
            state.isComfirm ?
              <div style={{textAlign:'center',margin:15}}>
                <span className="text-success"><Icon type="check-circle" /> 文件清单已确认成功</span>
              </div>
            :
              <div style={{margin:'10px auto', width:'100%'}}>
                <Row>
                  <Col span={12} style={{textAlign:'right',paddingRight:15}}>
                    <CreateFileTaskItem task={state.formDatas} callbackParent={_self.onChildChanged} initialChecked={_self.state.reloadChecked} />
                  </Col>
                  <Col span={12}>
                    <Popconfirm title="确认提交您当前的任务清单吗？" onConfirm={_self.comfirmMyFileTaskList}>
                      <Button type="dashed" style={{width:120}}>确认清单</Button>
                    </Popconfirm>
                  </Col>
                </Row>
              </div>
          }
        </div>
      </QueueAnim>
    );
  }
});

//新增文件任务
let CreateFileTaskItem = React.createClass({
  getInitialState: function() {
    return {
      visible: false,
      loading: false,
      reloadChecked: this.props.initialChecked, //用于父组件更新
      projectId: Cookies.get('presentBelongProjectId'),
      userChildren: [],
      assocDefaultTasks: [], //关联默认任务
      defaultTaskItem: '', //选中的P'任务
      ownerId: '',
      auditorId: '',
      approverId: '',
      taskSelectLevel: '2.1级', //默认是文件等级
    };
  },
  getUsersOfProject: function(){
    var projectId = Cookies.get('presentBelongProjectId'),
        _self     = this,
        children  = []; //用于中转复制，直接赋值重新渲染会有Select key重复警告

    showProject(projectId).then(function(res) {
      let usersArray = res.jsonResult.project.Users;
      _.map(usersArray, function(item, key){
        var temp = item.id +'__'+ item.pinyin + item.suoxie + item.name + item.UserProjects.role;
        children.push(<Option key={key} value={temp}>{item.name + '-' + item.UserProjects.role}</Option>);
      })
      _self.setState({ userChildren: children, loading: false });
    });
  },
  getStageDefaultTasks: function(){
    var taskArray     = [],
        taskTempArray = [],
        _self         = this;

    getProjectStageDefaultTasks(_self.state.projectId).then(function(res){
      var datas = res.jsonResult.defaultTasks;

      _.map(datas, function(item1, key1){
        if(item1.StageNewItem){
          //已在项目阶段
          var temp  = item1.id+'__'+item1.stageOriginItemId+'__'+item1.stageNewItemId;
          var title = 'P ：'+item1.StageOriginItem.name+'\nP\'：'+ item1.StageNewItem.name;
          var tempJson = {};

          tempJson.name  = item1.name;
          tempJson.title = title;
          tempJson.value = temp;

          return taskTempArray.push(tempJson);
        }
      })

      //任务去重
      taskTempArray = _.uniqWith(taskTempArray, _.isEqual);

      //组装
      _.map(taskTempArray, function(item, key){
        return taskArray.push(<Option key={key} value={item.value} title={item.title}>{item.name}</Option>);
      })

      _self.setState({ assocDefaultTasks: taskArray });
    })
  },
  showModal: function() {
    this.setState({ visible: true, loading: true });
    this.getStageDefaultTasks();
    this.getUsersOfProject();
  },
  handleCancel: function() {
    this.setState({ visible: false });
  },
  handleChangeDefaultTask: function(e){
    if(e) return this.setState({ defaultTaskItem: e });
  },
  handleChangeTaskLevel: function(e){
    if(e) return this.setState({ taskSelectLevel: e });
  },
  handleChangeAuditor: function(e){
    if(this.state.taskSelectLevel == '1级'){
      // 1类文件
      var auditorIds = '',
          _self      = this;

      e.map(item => {
        auditorIds += ','+item.split('__')[0];
      })

      auditorIds = auditorIds.substr(1, auditorIds.length);

      this.setState({ auditorId: auditorIds });
    }else {
      // 2类、3类文件
      var auditorId = e.split('__')[0];
      if(e) return this.setState({ auditorId: auditorId });
    }
  },
  handleChangeApprover: function(e){
    if(e) return this.setState({ approverId: e.split('__')[0] });
  },
  handleChangeOwner: function(e){
    if(e) return this.setState({ ownerId: e.split('__')[0] });
  },
  handleSubmit: function(e) {

    var formData   = this.props.form.getFieldsValue(),
        auditorId  = null,
        approverId = null,
        datas      = '';

    //简单表单判断
    if(!formData.name || !this.state.defaultTaskItem || !this.state.approverId || !this.state.taskSelectLevel || !formData.code) return message.warning("请完善任务详情，不要偷懒，一个也不能少");

    switch(this.state.taskSelectLevel){
      case '1级':
        if(!this.state.ownerId || !this.state.auditorId || !this.state.approverId) return message.warning("请完善人员选择（或许是编写人与审核人相同），不要偷懒撒");

        var auditorIds = this.state.auditorId.split(','),
            _self = this;

        message.info("审核人已过虑重复人员，实际只有"+auditorIds.length+"人");

        auditorId  = this.state.auditorId,
        approverId = this.state.approverId;
      break;
      case '2.1级':
        if(!this.state.ownerId || !this.state.auditorId || !this.state.approverId) return message.warning("请完善人员选择（或许是编写人与审核人相同），不要偷懒撒");
        auditorId  = this.state.auditorId,
        approverId = this.state.approverId;
        //判断审核人员个数，防止由1类切换到其他的时候，人员个数未变
        if(_.size(auditorId.split(',')) > 1) return message.error("请重新选择审核人员，由切换文件等级引起");
      break;
      case '3级':
        if(!this.state.ownerId || !this.state.auditorId) return message.warning("请完善人员选择（或许是编写人与审核人相同），不要偷懒撒");
        auditorId  = this.state.auditorId;
        //判断审核人员个数，防止由1类切换到其他的时候，人员个数未变
        if(_.size(auditorId.split(',')) > 1) return message.error("请重新选择审核人员，由切换文件等级引起");
      break;
    }

    // 1类文件审核人auditorIds 其他为auditorId
    // approverId 3类文件此字段为null
    if(this.state.taskSelectLevel == '1级'){
      datas = {
        name: formData.name,
        description: formData.description,
        ownerId: this.state.ownerId,
        auditorIds: auditorId,
        approverId: approverId,
        level: this.state.taskSelectLevel,
        code: formData.code,
        defaultTaskId: this.state.defaultTaskItem.split('__')[0],
        stageOriginItemId: this.state.defaultTaskItem.split('__')[1],
        stageNewItemId: this.state.defaultTaskItem.split('__')[2]
      };
    }else {
      datas = {
        name: formData.name,
        description: formData.description,
        ownerId: this.state.ownerId,
        auditorId: auditorId,
        approverId: approverId,
        level: this.state.taskSelectLevel,
        code: formData.code,
        defaultTaskId: this.state.defaultTaskItem.split('__')[0],
        stageOriginItemId: this.state.defaultTaskItem.split('__')[1],
        stageNewItemId: this.state.defaultTaskItem.split('__')[2]
      };
    }

    var _self    = this,
        newState = ++_self.state.reloadChecked;
    _self.setState({ reloadChecked: newState });

    createMyFileTask(_self.state.projectId, JSON.stringify(datas)).then(function(res){
      if(res.jsonResult.code < 0) {
        message.warning(res.jsonResult.msg + '，不能重复创建文件任务！');
      }else {
        _self.setState({ visible: false });
        _self.props.callbackParent(newState);
        message.success("新增文件任务成功");
      }
    })
  },
  filter: function(inputValue, option) {
    if(option.props.value.indexOf(inputValue) > 0) {
      return true;
    }else {
      return false
    }
  },
  render: function() {
    var props = this.props,
        state = this.state,
        _self = this;

    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };

    return (
      <div>
        <Button type="primary" style={{width:270}} onClick={this.showModal}><Icon type="plus-circle-o" />新增文件任务</Button>
        <Modal ref="modal"
          visible={this.state.visible}
          title="新增文件任务" onOk={this.handleOk} onCancel={this.handleCancel}
          footer=""
        >
          <Form horizontal form={this.props.form}>
            <FormItem
              {...formItemLayout}
              style={{marginBottom: 10}}
              label="任务名称"
            >
              <Input {...getFieldProps('name', { initialValue: '' })} placeholder="请输入任务名称" />
            </FormItem>
            <FormItem
              {...formItemLayout}
              style={{marginBottom: 10}}
              label="任务描述"
            >
              <Input type="textarea" placeholder="请输入任务描述" {...getFieldProps('description', { initialValue: '' })} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              style={{marginBottom: 10}}
              label="文件编号"
            >
              <Input placeholder="请输入文件编号" {...getFieldProps('code', { initialValue: '' })} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              style={{marginBottom: 10}}
              label="关联任务"
            >
              <Select
                placeholder="请选择关联任务"
                style={{height: '32px'}}
                showSearch
                optionFilterProp="children"
                notFoundContent="未找到相应结果，请输入任务名称搜索"
                onChange={this.handleChangeDefaultTask}
              >
                { state.assocDefaultTasks }
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              style={{marginBottom: 10}}
              label="文件等级"
            >
              <Select style={{width:100}} defaultValue={state.taskSelectLevel} onChange={this.handleChangeTaskLevel}>
                <Option value="1级">1级</Option>
                <Option value="2.1级">2级</Option>
                <Option value="3级">3级</Option>
              </Select>
              <Popover placement="right" content="分别对应1类、2类、3类文件" trigger="hover"><Icon type="question-circle-o" style={{marginLeft:10,color:'#FF753A'}}/></Popover>
            </FormItem>
            <FormItem
              labelCol={{ span: 6 }}
              style={{marginBottom: 10}}
              label="编写人"
            >
              <Select
                showSearch
                optionFilterProp="children"
                notFoundContent="无法找到，请输入名字部分搜索"
                style={{ width: '50%', height: '32px' }}
                placeholder="如：张 ~"
                filterOption={desp_selectFilter}
                onChange={this.handleChangeOwner}
              >
                { state.userChildren }
              </Select>
            </FormItem>
            <FormItem
              labelCol={{ span: 6 }}
              style={{marginBottom: 10}}
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
                    onChange={this.handleChangeAuditor}
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
                    onChange={this.handleChangeAuditor}
                  >
                    { state.userChildren }
                  </Select>
              }
            </FormItem>
            {/* 3类文件的批准人 后台是存在auditorId里面的 */
              state.taskSelectLevel != '3级' ?
                <FormItem
                  labelCol={{ span: 6 }}
                  label="批准人"
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    notFoundContent="无法找到，请输入名字部分搜索"
                    style={{ width: '50%', height: '32px' }}
                    placeholder="如：李 ~"
                    filterOption={desp_selectFilter}
                    onChange={this.handleChangeApprover}
                  >
                    { state.userChildren }
                  </Select>
                </FormItem>
              :
                null
            }
            <FormItem
              {...formItemLayout}
              style={{marginBottom: 10}}
              label="审核结束时间"
            >
              <DatePicker disabled style={{width:150}} onChange={this.handleDatePicker} placeholder="请输入审核结束时间" />
            </FormItem>
            <FormItem
              {...formItemLayout}
              style={{marginBottom: 10}}
              label="起止时间"
            >
              <RangePicker disabled format="yyyy-MM-dd" {...getFieldProps('times', { initialValue: '' })}/>
            </FormItem>

            <FormItem
              wrapperCol={{ span: 12, offset: 10 }}
            >
              <Popconfirm title="确定要新增该文件任务吗？" onConfirm={this.handleSubmit}>
                <Button type="primary">提交新增</Button>
              </Popconfirm>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
});

//修改文件任务
let ModifyFileTask = React.createClass({
  getInitialState() {
    return {
      loading: true,
      visible: false,
      reloadChecked: this.props.initialChecked, //用于父组件更新
      taskId: this.props.taskId,
      userChildren: [],
      taskDatas: {
        name: '',
        description: '',
        Owner: {
          name: '',
          UserProjects: {
            role: ''
          }
        },
        Approver: {
          name: '',
          UserProjects: {
            role: ''
          }
        },
        Auditor: {
          name: '',
          UserProjects: {
            role: ''
          }
        },
        Files: [],
        Project: {
          name: ''
        },
        AuditorsLists: [],
        DefaultTask: {
          id: '',
          stageOriginItemId: '',
          stageNewItemId: ''
        }
      },
      assocDefaultTasks: '',
    }
  },
  componentWillReceiveProps(nextProps) {
    if(this.props.taskId != nextProps.taskId) return switchProps(nextProps.taskId);
  },
  switchProps(taskId) {
    this.setState({ taskId: taskId });
  },
  showFileTaskById(taskId) {
    let _self = this;
    getFileTaskById(taskId).then((res) => {
      _self.setState({ taskDatas: res.jsonResult.fileTask })
    })
  },
  getUsersOfProject() {
    let projectId = Cookies.get('presentBelongProjectId'),
        _self     = this,
        children  = []; //用于中转复制，直接赋值重新渲染会有Select key重复警告

    showProject(projectId).then((res) => {
      let usersArray = res.jsonResult.project.Users;
      _.map(usersArray, (item, key) => {
        let temp = item.id +'__'+ item.pinyin + item.suoxie + item.name + item.UserProjects.role;
        children.push(<Option key={key} value={temp}>{item.name + '-' + item.UserProjects.role}</Option>);
      })
      _self.setState({ userChildren: children, loading: false });
    });
  },
  getStageDefaultTasks() {
    let taskArray     = [],
        taskTempArray = [],
        projectId     = Cookies.get('presentBelongProjectId'),
        _self         = this;

    getProjectStageDefaultTasks(projectId).then((res) => {
      let datas = res.jsonResult.defaultTasks;

      _.map(datas, (item1, key1) => {
        if(item1.StageNewItem){
          //已在项目阶段
          let temp  = item1.id+'__'+item1.stageOriginItemId+'__'+item1.stageNewItemId;
          let title = 'P ：'+item1.StageOriginItem.name+'\nP\'：'+ item1.StageNewItem.name;
          let tempJson = {};

          tempJson.name  = item1.name;
          tempJson.title = title;
          tempJson.value = temp;

          return taskTempArray.push(tempJson);
        }
      })

      //任务去重
      taskTempArray = _.uniqWith(taskTempArray, _.isEqual);

      //组装
      _.map(taskTempArray, (item, key) => {
        return taskArray.push(<Option key={key} value={item.value} title={item.title}>{item.name}</Option>);
      })

      _self.setState({ assocDefaultTasks: taskArray });
    })
  },
  showModal() {
    this.setState({ visible: true });
    this.showFileTaskById(this.state.taskId);
    this.getUsersOfProject();
    this.getStageDefaultTasks();
  },
  handleOk() {
    this.setState({ visible: false });
  },
  handleCancel() {
    this.setState({ visible: false });
  },
  handleSubmit() {
    let formData   = this.props.form.getFieldsValue();

    let auditorId  = null, //1级实际为 auditorIds
        approverId = null,
        presentLevel = this.state.taskDatas.level,
        datas = '';

    if(presentLevel == '1级') {
      if(!formData.ownerId || formData.auditorIds.length == 0 || !formData.approverId) return message.warning("请完善人员选择，不要偷懒撒");

      let auditorIds = '';

      formData.auditorIds.map((item) => {
        auditorIds += ','+item.split('__')[0];
      })

      auditorIds = auditorIds.substr(1, auditorIds.length);

      auditorId  = auditorIds,
      approverId = formData.approverId.split('__')[0];
    }

    if(presentLevel == '2级' || presentLevel == '2.1级') {
      if(!formData.ownerId || !formData.auditorId || !formData.approverId) return message.warning("请完善人员选择，不要偷懒撒");
      auditorId  = formData.auditorId.split('__')[0],
      approverId = formData.approverId.split('__')[0];
    }

    if(presentLevel == '3级') {
      if(!formData.ownerId || !formData.auditorId) return message.warning("请完善人员选择，不要偷懒撒");
      auditorId  = formData.auditorId.split('__')[0];
    }

    if(presentLevel == '1级'){
      datas = {
        name: formData.name,
        description: formData.description,
        ownerId: formData.ownerId.split('__')[0],
        auditorIds: auditorId,
        approverId: approverId,
        code: formData.code,
        defaultTaskId: formData.defaultTaskItem.split('__')[0],
        stageOriginItemId: formData.defaultTaskItem.split('__')[1],
        stageNewItemId: formData.defaultTaskItem.split('__')[2]
      };
    }else {
      datas = {
        name: formData.name,
        description: formData.description,
        ownerId: formData.ownerId.split('__')[0],
        auditorId: auditorId,
        approverId: approverId, //3级文件为null
        code: formData.code,
        defaultTaskId: formData.defaultTaskItem.split('__')[0],
        stageOriginItemId: formData.defaultTaskItem.split('__')[1],
        stageNewItemId: formData.defaultTaskItem.split('__')[2]
      };
    }

    let _self = this,
        newState = ++_self.state.reloadChecked;

    _self.setState({ reloadChecked: newState, loading: true });

    modifyFileTask(_self.state.taskId, JSON.stringify(datas)).then(function(res){
      _self.props.callbackParent(newState);
      message.success("该任务修改成功");
      setTimeout(() => {
        _self.setState({ loading: false, visible: false })
      }, 1000)
    });

  },
  render() {
    let state = this.state,
        props = this.props;

    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };

    //1类文件审核人员
    let auditorsLists = [];
    _.map(state.taskDatas.AuditorsLists, function(item){
      var temp = item.id +'__'+ item.pinyin + item.suoxie + item.name + item.UserProjects.role;
      auditorsLists.push(temp);
    })

    //已关联的默认任务
    let assocHasDefaultTasks = [];
    if(state.taskDatas.stageNewItemId) {
      assocHasDefaultTasks = state.taskDatas.defaultTaskId +'__'+ state.taskDatas.stageOriginItemId +'__'+ state.taskDatas.stageNewItemId;
    }

    return (
      <span>
        <a onClick={this.showModal}>{props.name}</a>
        <Modal
          visible={state.visible}
          title="新增文件任务" onOk={this.handleOk} onCancel={this.handleCancel}
          footer=""
        >
          <Spin spinning={state.loading}>
            <Form horizontal form={this.props.form}>
              <FormItem
                {...formItemLayout}
                style={{marginBottom: 10}}
                label="任务名称"
              >
                <Input type="textarea" {...getFieldProps('name', { initialValue: state.taskDatas.name })} placeholder="请输入任务名称" />
              </FormItem>
              <FormItem
                {...formItemLayout}
                style={{marginBottom: 10}}
                label="任务描述"
              >
                <Input type="textarea" placeholder="请输入任务描述" {...getFieldProps('description', { initialValue: state.taskDatas.description || '' })} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                style={{marginBottom: 10}}
                label="文件编号"
              >
                <Input type="textarea" placeholder="请输入文件编号" {...getFieldProps('code', { initialValue: state.taskDatas.code || '' })} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                style={{marginBottom: 10}}
                label="关联任务"
              >
                <Select
                  placeholder="请选择关联任务"
                  style={{height: '32px'}}
                  showSearch
                  optionFilterProp="children"
                  notFoundContent="未找到相应结果，请输入任务名称搜索"
                  {...getFieldProps('defaultTaskItem', { initialValue: assocHasDefaultTasks })}
                >
                  { state.assocDefaultTasks }
                </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                style={{marginBottom: 10}}
                label="文件等级"
              >
                {state.taskDatas.level}
              </FormItem>
              <FormItem
                labelCol={{ span: 6 }}
                style={{marginBottom: 10}}
                label="编写人"
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  notFoundContent="无法找到，请输入名字部分搜索"
                  style={{ width: '50%', height: '32px' }}
                  placeholder="如：张 ~"
                  filterOption={desp_selectFilter}
                  {...getFieldProps('ownerId', { initialValue: state.taskDatas.Owner.id +'__'+ state.taskDatas.Owner.pinyin + state.taskDatas.Owner.suoxie + state.taskDatas.Owner.name + state.taskDatas.Owner.UserProjects.role })}
                >
                  { state.userChildren }
                </Select>
              </FormItem>
              <FormItem
                labelCol={{ span: 6 }}
                style={{marginBottom: 10}}
                label={state.taskDatas.level == '3级' ? '批准人' : '审核人'}
              >
                {/* 1级文件类型 有多个审核人 */
                  state.taskDatas.level == '1级' ?
                    <Select
                      multiple
                      optionFilterProp="children"
                      notFoundContent="无法找到，请输入名字部分搜索"
                      style={{ width: '50%' }}
                      placeholder="如：张三、李四、王五"
                      filterOption={desp_selectFilter}
                      {...getFieldProps('auditorIds', { initialValue: auditorsLists })}
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
                      {...getFieldProps('auditorId', { initialValue: state.taskDatas.Auditor.id +'__'+ state.taskDatas.Auditor.pinyin + state.taskDatas.Auditor.suoxie + state.taskDatas.Auditor.name + state.taskDatas.Auditor.UserProjects.role })}
                    >
                      { state.userChildren }
                    </Select>
                }
              </FormItem>
              {/* 3类文件的批准人 后台是存在auditorId里面的 */
                state.taskDatas.level != '3级' ?
                  <FormItem
                    labelCol={{ span: 6 }}
                    label="批准人"
                  >
                    <Select
                      showSearch
                      optionFilterProp="children"
                      notFoundContent="无法找到，请输入名字部分搜索"
                      style={{ width: '50%', height: '32px' }}
                      placeholder="如：李 ~"
                      filterOption={desp_selectFilter}
                      {...getFieldProps('approverId', { initialValue: state.taskDatas.Approver.id +'__'+ state.taskDatas.Approver.pinyin + state.taskDatas.Approver.suoxie + state.taskDatas.Approver.name + state.taskDatas.Approver.UserProjects.role })}
                    >
                      { state.userChildren }
                    </Select>
                  </FormItem>
                :
                  null
              }
              <FormItem
                wrapperCol={{ span: 12, offset: 10 }}
              >
                <Popconfirm title="确定要修改该文件任务吗？" onConfirm={this.handleSubmit}>
                  <Button type="primary">提交修改</Button>
                </Popconfirm>
              </FormItem>
            </Form>
          </Spin>
        </Modal>
      </span>
    )
  }
});

ModifyFileTask = createForm()(ModifyFileTask);
CreateFileTaskItem = createForm()(CreateFileTaskItem);

export default EditFileList;