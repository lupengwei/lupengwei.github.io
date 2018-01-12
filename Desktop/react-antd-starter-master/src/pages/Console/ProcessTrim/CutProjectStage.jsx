import React from 'react';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import Cookies from 'js-cookie';

import { showProject, createProjectStage, getProjectStage, destroyStageItem, showProjectStandardStage, confirmProjectStage, modifyCutStage } from '../../../services/api';

import { message, Icon, Form, Button, Modal, Input, InputNumber, Tooltip, Row, Col, Popconfirm, Spin, Collapse, Popover } from 'antd';

import styles from '../Common.less';

//ant
const FormItem = Form.Item;
const Panel    = Collapse.Panel;

//main
let CutProjectStage = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      loading: false,
      isSubmitDisabled: true,
      reloadChecked: 0, //检查渲染条件
      projectId: Cookies.get('presentBelongProjectId'),
      formDatas: '',
      stageName: '',
      stageIndex: '',
      standardStageDatas: '',
      projectInfo: { //项目信息
        qpSuggestion: ''
      },
    };
  },
  componentDidMount: function() {
    this.getProjectStage();
    this.showProjectStandardStage();
    this.getProjectInfo();
  },
  componentWillUpdate: function(nextProps, nextState) {
    if(nextState.reloadChecked != this.state.reloadChecked) return this.getProjectStage();
  },
  onChildChanged: function(newState){
    //监听子组件的状态变化
    this.setState({ reloadChecked: newState });
  },
  showProjectStandardStage: function(){
    var _self = this;
    showProjectStandardStage(this.state.projectId).then(function(res){
      console.log(res);
      _self.setState({ standardStageDatas: res.jsonResult.StageOriginItem });
    });
  },
  getProjectStage: function(){
    if(!this.state.projectId) return message.error("请先选择将要配置的项目");

    var _self = this;

    _self.setState({ loading: true });
    getProjectStage(this.state.projectId).then(function(res){

      let datas = res.jsonResult.StageNewItems;

      //排序
      _.sortBy(datas, (item) => { return item.index });

      _self.setState({
        formDatas: datas,
        loading: false,
        stageIndex: datas.length + 1
      });
    });
  },
  destroyStageItem: function(stageId){
    var _self = this;
    destroyStageItem(stageId).then(function(res){
      _self.getProjectStage();
      message.success("阶段删除成功");
    });
  },
  changeAddStage: function(e){
    e.target.value ? this.setState({ stageName: e.target.value, isSubmitDisabled: false }) : this.setState({ isSubmitDisabled: true });
  },
  changeAddStageIndex: function(e){
    this.setState({ stageIndex: e.target.value });
  },
  handleSubmit: function(){
    var _self = this,
        datas = {
          name: this.state.stageName,
          index: this.state.stageIndex
        };

    if(!this.state.projectId) return message.warning("请先选择将要配置的项目");
    if(!this.state.stageIndex) return message.warning("请输入阶段序号");

    createProjectStage(this.state.projectId, JSON.stringify(datas)).then(function(res){
      _self.getProjectStage();
      _self.setState({ isSubmitDisabled: true });
      message.success("阶段添加成功");
    });
  },
  confirmProjectStage: function(){
    
    if(_.size(this.state.formDatas) < 1) return message.error("阶段为空不能进行确认，请先创建项目阶段");

    let _self = this;

    confirmProjectStage(this.state.projectId).then(function(res){
      message.success("阶段确认成功");
      _self.getProjectInfo();
      setTimeout(function(){
        _self.context.router.push('/console/projects/assocTasks');
      }, 1000)
    });
  },
  getProjectInfo: function(){
    if(!this.state.projectId) return message.error("请先选择将要配置的项目");
    var _self = this;

    showProject(_self.state.projectId).then(function(res){
      let datas = res.jsonResult.project;

      Cookies.set('presentProjectStatus', datas.status);

      _self.setState({ projectInfo: datas });
    })
  },
  render: function(){
    var props = this.props,
        state = this.state,
        _self = this;

    return (
      <QueueAnim delay={100} type="bottom" style={{display:'inline-flex',height:'100%'}}>
        <div key="a" style={{width:350,margin:'0 15px 0 0'}} className={styles['desp-board-box']}>
          <div className={styles['desp-board-header']}>
            <div className={styles['title']}>标准阶段<span style={{fontWeight:400}}>（Standard stage）</span></div>
            <div style={{padding:10,textAlign:'center'}}>当前配置项目：{Cookies.get('presentBelongProjectName')}</div>
          </div>

          <div className={styles['desp-board-content']}>
            <Collapse accordion>
              {
                _.map(state.standardStageDatas, function(item1, key1){
                  return (
                      <Panel header={item1.name} key={key1}>
                        {
                          _.size(item1.DefaultTasks) > 0 ?
                            <ul>
                              {
                                _.map(item1.DefaultTasks, function(item2, key2){
                                  return (
                                      <li key={key2}>{key2+1}、{item2.name}</li>
                                    )
                                })
                              }
                            </ul>
                          : 
                            <div className={styles['no-content-tips']}>本阶段暂无任务</div>
                        }
                      </Panel>
                    )
                })
              }
            </Collapse>
          </div>
        </div>

        <div key="b" style={{width:350,margin:'0 15px 0 0'}} className={styles['desp-board-box']}>
          <Spin spinning={state.loading}>
            <div className={styles['desp-board-header']}>
              <div className={styles['title']}>项目阶段<span style={{fontWeight:400}}>（Cutting stage）</span></div>
              <div style={{textAlign:'center',margin:'5px 0'}}>
                {
                  state.projectInfo.qpSuggestion ?
                    <div style={{marginTop:10}}>
                      <Popover content={state.projectInfo.qpSuggestion} trigger="hover">
                        <span className="text-danger">您提交的审核已被拒绝 <Icon type="question-circle-o" /></span>
                      </Popover>
                    </div>
                  :
                    null
                }
              </div>
            </div>
            <div className={styles['desp-board-content']} style={{marginTop:5}}>
              {
                _.map(state.formDatas, function(item, key){
                  return (
                      <div key={key} className={styles['desp-card']}>
                        <Tooltip placement="left" title={"序号 " + item.index || 0}>
                          <span style={{paddingRight:5}} className="text-warning">[{item.index || 0}]</span>
                        </Tooltip>
                        <ModifyStageInfo stage={item} callbackParent={_self.onChildChanged} initialChecked={_self.state.reloadChecked} />
                        <div className={styles['option']}>
                          <Popconfirm title="确认当前的阶段划分吗？" onConfirm={_self.destroyStageItem.bind(null, item.id)}>
                            <Icon type="cross-circle-o" style={{marginLeft:8,cursor:'pointer'}} />
                          </Popconfirm>
                        </div>
                      </div>
                    )
                })
              }

              <Form horizontal form={this.props.form}>
                <Row style={{marginTop:5}}>
                  <Col span={4} offset={1}>
                    <Input defaultValue={state.stageIndex} type="number" min={0} max={20} onChange={this.changeAddStageIndex}/>
                  </Col>
                  <Col span={13} style={{paddingLeft:5}}>
                    <Input placeholder="新的阶段名称" onChange={this.changeAddStage}/>
                  </Col>
                  <Col span={3} offset={1}>
                    <Popconfirm title="确认新增阶段吗？" onConfirm={this.handleSubmit}>
                      <Button disabled={state.isSubmitDisabled} type="primary">提交</Button>
                    </Popconfirm>
                  </Col>
                </Row>
              </Form>

              <div style={{width:'100%',padding:'15px 5px 5px 5px',textAlign:'center'}}>
                <Popconfirm title="确认当前的阶段划分吗？" onConfirm={this.confirmProjectStage}>
                  <Button type="dashed" style={{width:'100%'}}>确认阶段划分</Button>
                </Popconfirm>
              </div>
            </div>
          </Spin>
        </div>

      </QueueAnim>
    );
  }
});

//修改阶段信息
let ModifyStageInfo = React.createClass({
  getInitialState() {
    return {
      visible: false,
      reloadChecked: this.props.initialChecked, //用于父组件更新
      stage: this.props.stage,
    }
  },
  componentWillReceiveProps(nextProps) {
    if(this.props.stage != nextProps.stage) return this.switchProps(nextProps.stage);
  },
  switchProps(newProps) {
    this.setState({ stage: newProps });
  },
  showModal() {
    this.setState({ visible: true });
  },
  handleOk(e) {
    this.setState({ visible: false });
  },
  handleCancel(e) {
    this.setState({ visible: false });
  },
  handleSubmit(stageId) {
    let formData   = this.props.form.getFieldsValue();

    if(!stageId) return message.warning("获取阶段ID失败");
    if(!formData.index || !formData.name) return message.warning("获取修改信息失败，请重新尝试");

    let _self = this,
        newState = ++_self.state.reloadChecked,
        datas = {
          index: formData.index,
          name: formData.name
        };

    _self.setState({ reloadChecked: newState });

    modifyCutStage(stageId, JSON.stringify(datas)).then((res) => {
      _self.props.callbackParent(newState);
      _self.setState({ visible: false });
      message.success("修改阶段信息成功");
    })
  },
  render() {
    let props = this.props,
        state = this.state,
        _self = this;

    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };

    return (
      <span>
        <span onClick={this.showModal} style={{cursor:'pointer'}}>{state.stage.name}</span>
        <Modal title="修改阶段信息"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer=""
        >
          <Form horizontal form={this.props.form}>
            <FormItem
              {...formItemLayout}
              style={{marginBottom: 10}}
              label="序号"
            >
              <Input {...getFieldProps('index', { initialValue: state.stage.index })} type="number" min={0} max={20} size="small" style={{width:40,marginRight:5}} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              style={{marginBottom: 10}}
              label="任务名称"
            >
              <Input {...getFieldProps('name', { initialValue: state.stage.name })} />
            </FormItem>
            <FormItem
              {...formItemLayout}
            >
              <Row>
                <Col span={8} offset={12}>
                  <Popconfirm title="确认修改当前阶段信息吗？" onConfirm={this.handleSubmit.bind(null, props.stage.id)}>
                    <Button type="primary">提交修改</Button>
                  </Popconfirm>
                </Col>
              </Row>
            </FormItem>
          </Form>
        </Modal>
      </span>
    )
  }
});

ModifyStageInfo = Form.create()(ModifyStageInfo);
CutProjectStage = Form.create()(CutProjectStage);

export default CutProjectStage;