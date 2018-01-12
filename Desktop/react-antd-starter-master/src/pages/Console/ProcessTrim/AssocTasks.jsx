import React from 'react';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import Cookies from 'js-cookie';

import {
  getProjectStage,
  allotStageTask,
  showProjectStandardStage,
  createProjectTask,
  deleteTaskById,
  deleteAssocOfTaskById
} from '../../../services/api';

import { message, Icon, Select, Button, Collapse, Popconfirm, Form, Modal, Input, Tooltip, Badge, notification } from 'antd';

import styles from '../Common.less';

//ant
const Option   = Select.Option;
const FormItem = Form.Item;
const Panel    = Collapse.Panel;

//main
let AssocTasks = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      visible: false,
      projectId: Cookies.get('presentBelongProjectId'),
      formDatas: '', //项目P'阶段
      standardStageDatas: '', //标准阶段数据
      currentSatge: '', //当前选中的阶段
      showStageDatas: {}, //
      standardStage: '', //新增任务使用
      addNewTaskName: '', //新增任务名称
      addNewTaskOfOriginStageId: '', //新增任务，标准阶段id
    };
  },
  componentDidMount: function() {
    this.showProjectStage();
    this.showProjectStandardStage();
  },
  componentWillUpdate: function(nextProps, nextState){
    //更新组件
    if(nextState.reloadChecked != this.state.reloadChecked) {
      this.showProjectStage();
      this.showProjectStandardStage();
    }
  },
  showProjectStandardStage: function(){
    let _self = this;
    showProjectStandardStage(this.state.projectId).then(function(res){
      let datas = res.jsonResult.StageOriginItem;
      _self.setState({ standardStageDatas: datas });
    });
  },
  showProjectStage: function(){
    if(!this.state.projectId) return message.error("请先选择将要配置的项目", 2);

    let _self = this;

    _self.setState({ loading: true });
    getProjectStage(this.state.projectId).then(function(res){
      let datas = res.jsonResult.StageNewItems;
      let showStageDatas = {};

      //构造成显示需要的hash ==> showStageDatas {xxx:[{},{},...]}
      _.map(datas, function(item, key){
        showStageDatas[item.name] = datas[key].DefaultTasks;
      })

      _self.setState({
        formDatas: datas,
        showStageDatas: showStageDatas, //重新渲染
        loading: false
      });

    });
  },
  handleSelectChange: function(e){
    this.setState({ currentSatge: e });
  },
  createStageTaskHash: function(value){
    if(!this.state.currentSatge) return message.error("请先选择项目阶段，再关联阶段任务", 2);

    var stageName = this.state.currentSatge.split('__')[1], //获取阶段名称
        flag      = false,
        temp      = this.state.showStageDatas[stageName] ? this.state.showStageDatas[stageName] : [];

    //阶段任务去重 任务只能选在一个阶段
    _.map(this.state.showStageDatas, function(item1){
      if(_.size(item1) > 0){
        _.map(item1, function(item2){
          if(item2.id === value.id) flag = true;
        })
      }
    })

    flag ? message.warning("该任务已经被选过，请仔细检查项目阶段任务") : temp.push(value);

    this.state.showStageDatas[stageName] = temp; //关联本阶段任务  不会render
    this.setState({ showStageDatas: this.state.showStageDatas }); //为了重新render
  },
  deleteStageTaskItem: function(value){
    var _self = this;

    notification['warning']({
      message: 'DES提示',
      description: '为了数据完整性，标准阶段的任务拒绝删除',
    });

    // deleteTaskById(value.id).then(function(res){
    //   _self.showProjectStage();
    //   _self.showProjectStandardStage();
    //   message.success("P阶段任务删除成功");
    // })
  },
  deleteAssocOfTaskItem: function(value){
    var _self = this;
    var datas = this.state.showStageDatas[this.state.currentSatge.split('__')[1]]; //获取当前选中阶段的任务

    deleteAssocOfTaskById(value.id).then(function(res){
      message.success("P`阶段任务删除成功");
      //本地数据删除
      var tempArray = [];
      datas.map((item) => {
        if(item.id != value.id) return tempArray.push(item);
      })

      _self.state.showStageDatas[_self.state.currentSatge.split('__')[1]] = tempArray;

      _self.setState({ showStageDatas: _self.state.showStageDatas }); //重新赋值
    })
  },
  submitStageTask: function(){
    //构造成后端的hash结构
    var _self    = this,
        tempJSON = {},
        datas    = {hash: {}};

    _.map(_self.state.formDatas, function(item1){
      _.map(_self.state.showStageDatas[item1.name], function(item2){
        if(item2) datas.hash[item2.id] = item1.id.toString();
      })
    })

    allotStageTask(this.state.projectId, JSON.stringify(datas)).then(function(res){
      message.success("关联阶段任务成功");
      setTimeout(function(){
        _self.context.router.push('/console/projects/checkStageTask');
      }, 1000)
    });

  },
  showModal: function(){
    this.setState({ visible: true });
  },
  handleCancel: function(e){
    this.setState({ visible: false });
  },
  handleTaskChange: function(e){
    this.setState({ addNewTaskName: e.target.value });
  },
  handleStageChange: function(e){
    this.setState({ addNewTaskOfOriginStageId: e });
  },
  handleSubmit: function(e){
    if(!this.state.projectId) return message.error("请先选择将要配置的项目", 2);
    let _self = this,
        stageName = _self.state.currentSatge.split('__')[1],
        datas = {
          stageOriginItemId: _self.state.addNewTaskOfOriginStageId,
          stageNewItemId: _self.state.currentSatge.split('__')[0],
          name: _self.state.addNewTaskName
        };

    if(!datas.name || !datas.stageOriginItemId) return message.error("请将信息填写完整", 2);
    if(!_self.state.currentSatge)               return message.error("当前项目阶段未获取", 2);

    //任务去重
    var falg = false;
    _.map(_self.state.formDatas, function(item1){
      _.map(item1.DefaultTasks, function(item2){
        if(_self.state.addNewTaskName == item2.name) falg = true;
      })
    })

    if(falg) return message.error("当前任务名已存在，请重新命名");

    createProjectTask(_self.state.projectId, JSON.stringify(datas)).then(function(res){

      //新增任务结束 挂在当前选中的项目阶段
      let temp = _self.state.showStageDatas[stageName] ? _self.state.showStageDatas[stageName] : [];
      temp.push(res.jsonResult.defaultTask);
      _self.state.showStageDatas[stageName] = temp; //关联本阶段任务  不会render
      _self.setState({ visible: false, showStageDatas: _self.state.showStageDatas }); //为了重新render

      _self.showProjectStandardStage();
      message.success("新增任务成功");
    })
  },
  render: function() {
    var props = this.props,
        state = this.state,
        _self = this;

    var stageName = this.state.currentSatge.split('__')[1];

    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

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
                  let title = <span>{item1.name} <Badge style={{ backgroundColor: '#fff', color: '#999', borderColor: '#d9d9d9' }} count={item1.DefaultTasks.length} /></span>;
                  return (
                      <Panel header={title} key={key1}>
                        {
                          _.size(item1.DefaultTasks) > 0 ?
                            <div>
                              {
                                _.map(item1.DefaultTasks, function(item2, key2){
                                  let tagHtml = '';
                                  if(item2.StageNewItemId) tagHtml = <Tooltip placement="top" title="已选择"><Icon type="check-circle" className="text-success" /></Tooltip>;
                                  return (
                                      <div key={key2} className={styles['desp-card']}>
                                        <a style={{color:'#000'}} onClick={_self.createStageTaskHash.bind(null, item2)}>{key2+1}、{item2.name} {tagHtml}</a>
                                        <div className={styles['option']}>
                                          <Popconfirm title="删除后不能恢复，确认要删除该任务吗？" onConfirm={_self.deleteStageTaskItem.bind(null, item2)}>
                                            <Icon type="cross-circle-o" style={{marginLeft:8,cursor:'pointer'}} />
                                          </Popconfirm>
                                        </div>
                                      </div>
                                    )
                                })
                              }
                            </div>
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
          <div className={styles['desp-board-header']}>
            <div className={styles['title']}>项目阶段<span style={{fontWeight:400}}>（Cutting stage）</span></div>
            <div style={{width:'100%',padding:5}}>
              <Popconfirm title="确认当前阶段的关联任务吗？" onConfirm={this.submitStageTask}>
                <Button type="dashed" style={{width:'100%'}}><Icon type="share-alt" />确认阶段任务</Button>
              </Popconfirm>
            </div>
            <div style={{padding:5}}>
              <Select
                style={{width:'100%'}}
                placeholder="请选择项目阶段"
                onChange={this.handleSelectChange}
              >
              {
                _.map(state.formDatas, function(item, key){
                  let tempValue = item.id+'__'+item.name;
                  return (
                      <Option key={key} value={tempValue}>{item.name}</Option>
                    )
                })
              }
              </Select>
            </div>
          </div>
          <div className={styles['desp-board-content']} style={{marginTop:5}}>
            {
              state.currentSatge ?
                <div style={{width:'100%',padding:5}}>
                  {
                    _.size(state.showStageDatas[stageName]) == 0 ?
                      <div className={styles['no-content-tips']} style={{marginBottom:10}}>本阶段暂无关联任务</div>
                    :
                      <div style={{marginBottom:10}}>
                        {
                          _.map(state.showStageDatas[stageName], function(item, key){
                            return (
                                <div className={styles['desp-card']} key={key}>
                                  <a style={{color:'#000'}}>{key+1}、{item.name}</a>
                                  <div className={styles['option']}>
                                    <Popconfirm title="确认要删除该任务吗？" onConfirm={_self.deleteAssocOfTaskItem.bind(null, item)}>
                                      <Icon type="cross-circle-o" style={{marginLeft:8,cursor:'pointer'}} />
                                    </Popconfirm>
                                  </div>
                                </div>
                              )
                          })
                        }
                      </div>
                  }
                  <Button style={{width:'100%'}} type="primary" onClick={this.showModal}><Icon type="plus"/>新增阶段任务</Button>
                </div>
              :
                <div className={styles['no-content-tips']}>请先选择对应的项目阶段</div>
            }

          </div>
        </div>

      {/* 新增任务 */}

        <Modal
          title="新增项目阶段任务"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer=''
        >
          <Form horizontal>
            <FormItem
              {...formItemLayout}
              label="任务名称"
            >
              <Input placeholder="任务名称" onChange={this.handleTaskChange} />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="所属标准阶段"
            >
              <Select
                size="large"
                style={{ width: 300 }}
                placeholder="请选择标准项目阶段"
                onChange={this.handleStageChange}
              >
                {
                  _.map(state.standardStageDatas, function(item, key){
                    //value 的值应该是string
                    return (
                        <Option key={key} value={item.id.toString()}>{item.name}</Option>
                      )
                  })
                }
              </Select>
            </FormItem>
            <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
              <Button type="primary" onClick={this.handleSubmit} >提交阶段任务</Button>
            </FormItem>
          </Form>

        </Modal>

      </QueueAnim>
    );
  }
});

AssocTasks = Form.create()(AssocTasks);

export default AssocTasks;