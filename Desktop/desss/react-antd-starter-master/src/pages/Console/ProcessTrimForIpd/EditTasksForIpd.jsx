import React from 'react';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import {
  getProjectStagesForIpd,
  getLevelFourStageAndTasksForIpd,
  completeLevelFourStageTrimForIpd,
  getMineCreateTasksForIpd,
  deleteNormalTaskById,
  deleteFileTaskById,
  getLevelFourStageForIpd
} from '../../../services/api';

import { message, Spin, Icon, Button, Modal, Switch, Form, Input, DatePicker, Select, Popconfirm, Tooltip, Tabs } from 'antd';

import styles from '../Common.less';

import Warning from '../../Common/Warning';

import ShowNormalTask from '../../Common/Tasks/ShowNormalTask';
import ShowFileTask from '../../Common/Tasks/ShowFileTask';
import CreateNormalTask from './CreateNormalTask';
import CreateFileTask from './CreateFileTask';

// ant
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

// main
let EditTasksForIpd = React.createClass({
  getInitialState() {
    return {
      loading: true,
      reLoading: false,
      subLoading: false,
      reloadChecked: 0, // 检查渲染条件
      subModalVisible: false,
      subModals: null,
      isOnlyShow: false, // 判断任务项是否单纯显示
      levelFourStageDatas: [],
      rightContainerWidth: '100px',
      selectedLevelFourStage: {id: null},
      levelOneStageDatas: [], // 一级工作项
      isMineTask: false, // 是否为我的任务
      presentLevelFourStageDatas: {
        id: null,
        ready: null,
        NormalTasks: [],
        FileTasks: []
      }
    };
  },
  componentDidMount() {
    this.showLevelFourStageAndTasks();
    this.showProjectStageInfo();
    this.changeWindowSize();
  },
  componentWillUpdate(nextProps, nextState) {
    // 更新组件
    let _self = this;
    if(nextState.reloadChecked != _self.state.reloadChecked) {
      _self.handleGetLevelFourStageTasks(_self.state.selectedLevelFourStage);
    }
  },
  onChildChanged(newState){
    // 监听子组件的状态变化
    this.setState({ reloadChecked: newState });
  },
  showProjectStageInfo() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.error("请先选择您参与的项目部或部门");

    getProjectStagesForIpd(projectId).then((res) => {

      let datas = res.jsonResult.project;

      _self.setState({ levelOneStageDatas: datas.LevelOneStages });

    })
  },
  showLevelFourStageAndTasks(parmas) {
    let _self = this;
    let presentUserId = Cookies.get('presentUserId');
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.error("请先选择您参与的项目部或部门");

    getLevelFourStageAndTasksForIpd(projectId).then((res) => {
      let datas = res.jsonResult.project;
      let tempLevelFourStageDatas = [];

      // 筛选出属于自己的四级工作项
      _.map(datas, (item) => {
        if(item.userId == presentUserId) {
          tempLevelFourStageDatas = item.levelFourStages;
        }
      })

      if(parmas == 'refresh') {
        // 已载入数据刷新
        let tempSelectedLevelFourStage = null;

        _.map(tempLevelFourStageDatas, (item) => {
          if(item.levelFourStageItem.id == _self.state.selectedLevelFourStage.id) {
            return tempSelectedLevelFourStage = item.levelFourStageItem;
          }
        })

        _self.setState({
          levelFourStageDatas: tempLevelFourStageDatas,
          selectedLevelFourStage: tempSelectedLevelFourStage,
          reLoading: false,
          isMineTask: true,
        });

      }else {
        // 首次加载
        _self.setState({
          levelFourStageDatas: tempLevelFourStageDatas,
          loading: false,
          isMineTask: true,
        });

      }

    })

  },
  handleSelectItemForLevelFour(tempItem) {
    // 切换四级工作项，取消右侧详情显示框
    if(this.state.selectedLevelFourStage.id && tempItem.levelFourStageItem.id != this.state.selectedLevelFourStage.id) {

      this.setState({
        selectedLevelFourStage: tempItem.levelFourStageItem,
        subModalVisible: false,
        subModals: '',
        isOnlyShow: false,
      });

    }else {

      this.setState({
        selectedLevelFourStage: tempItem.levelFourStageItem,
        isOnlyShow: false,
      });

    }

    this.handleGetLevelFourStageTasks(tempItem.levelFourStageItem);

  },
  changeWindowSize() {
    let tempClientWidth = document.body.clientWidth;
    this.setState({ rightContainerWidth: (tempClientWidth - 490) + 'px' });
  },
  handleShowNormalTask(tempItem){
    this.setState({
      subModalVisible: true,
      subModals: <ShowNormalTask taskid={tempItem.id} />
    });
  },
  handleShowFileTask(tempItem){
    this.setState({
      subModalVisible: true,
      subModals: <ShowFileTask taskid={tempItem.id} />
    });
  },
  handleCreateDefaultTasks(type) {
    if(!this.state.selectedLevelFourStage) return message.warning("请先选择四级工作项！");

    // 选择与当前同级的四级工作项（过滤opened状态）及父级
    let tempThisLevelFourArray = [];
    let tempThisLevelTwoJson = {id:null,beginTime:null,endTime:null};
    let tempThisLevelThreeJson = {id:null,beginTime:null,endTime:null};

    // 1、筛选出三级、四级工作项
    _.map(this.state.levelOneStageDatas, (item1) => {
      _.map(item1.LevelTwoStages, (item2) => {
        _.map(item2.LevelThreeStages, (item3) => {

          if(item3.id == this.state.selectedLevelFourStage.LevelThreeStageId) {

            tempThisLevelThreeJson = item3; // 该四级工作项对应的三级工作项

            _.map(item3.LevelFourStages, (list) => {
              if(list.opened) return tempThisLevelFourArray.push(list); // 同级的四级工作项
            })
          }

        })
      })
    })

    // 2、筛选出二级工作项
    _.map(this.state.levelOneStageDatas, (item1) => {
      _.map(item1.LevelTwoStages, (item2) => {

        if(item2.id == tempThisLevelThreeJson.LevelTwoStageId) return tempThisLevelTwoJson = item2;

      })
    })

    if(tempThisLevelFourArray.length == 0) return message.warning("获取同级四级工作项失败，请稍等片刻重试！");

    if(type == 'normal') {
      this.setState({
        subModalVisible: true,
        subModals: <CreateNormalTask levelTwoDatas={tempThisLevelTwoJson} levelThreeDatas={tempThisLevelThreeJson} levelFourDatas={tempThisLevelFourArray} levelFourStageId={this.state.selectedLevelFourStage.id} callbackParent={this.onChildChanged} initialChecked={this.state.reloadChecked} />
      });
    }

    if(type == 'file') {
      this.setState({
        subModalVisible: true,
        subModals: <CreateFileTask levelTwoDatas={tempThisLevelTwoJson} levelThreeDatas={tempThisLevelThreeJson} levelFourDatas={tempThisLevelFourArray} levelFourStageId={this.state.selectedLevelFourStage.id} callbackParent={this.onChildChanged} initialChecked={this.state.reloadChecked} />
      });
    }
  },
  closeModal() {
    this.setState({ subModalVisible: false });
  },
  handleCompleteMountTasksForLevelFourStage(params) {
    // 完成四级工作项任务编制
    if(params == 'completed') return message.warning("你已经完成了本工作项的任务编制，无需再确认！");

    let _self = this;
    let tempSelectedLevelFourStage = _self.state.selectedLevelFourStage;
    if(!tempSelectedLevelFourStage) return message.warning("请先选择四级工作项！");

    // 当前工作项下面不存在任务不能提交
    if(_self.state.presentLevelFourStageDatas.NormalTasks.length == 0 && _self.state.presentLevelFourStageDatas.FileTasks.length == 0) {
      return message.warning("请完善当前工作项下面的通用任务或文档任务，任务列表不能为空！");
    }

    confirm({
      title: 'dES提示',
      content: '您确定要结束对【'+tempSelectedLevelFourStage.name+'】工作项的任务编制，提交审核吗？',
      onOk() {
        // 确定任务编制
        completeLevelFourStageTrimForIpd(tempSelectedLevelFourStage.id).then((res) => {

          if(res.jsonResult.code < 0) return message.warning(res.jsonResult.msg);

          message.success("【"+ tempSelectedLevelFourStage.name + "】编制任务结束成功！");

          _self.setState({ reLoading: true });
          _self.handleLevelFourJoinItemAtLocal(res.jsonResult.levelFourStage);
          // _self.showLevelFourStageAndTasks('refresh');

        })

      },
      onCancel() {},
    });

  },
  showMineCreateTasks() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.error("请先选择您参与的项目部或部门");

    _self.setState({ reLoading: true });

    getMineCreateTasksForIpd(projectId).then((res) => {

      let datas = res.jsonResult;

      let tempSelectedLevelFourStage = {
        id: '00',
        ready: false,
        NormalTasks: datas.normalTasks,
        FileTasks: datas.fileTasks,
      };

      message.success("获取您创建的ipd任务成功！");

      _self.setState({
        isOnlyShow: true,
        selectedLevelFourStage: tempSelectedLevelFourStage,
        presentLevelFourStageDatas: tempSelectedLevelFourStage,
        subModalVisible: false,
        subModals: '',
        reLoading: false,
        isMineTask: true,
      });

    })
  },
  deleteNormalOrFileTask(params, type) {
    // 删除自己创建的任务

    let _self = this;
    let presentUserId = Cookies.get('presentUserId');

    // 关联的所有四级工作项已确认的情况下不能删除
    let tempArray = [];
    _.map(params.LevelFourStages, (item) => {
      if(item.ready) tempArray.push(item);
    })

    if(tempArray.length > 0) {
      Modal.warning({
        title: 'dES提示',
        content: (<div>
          <p>当前任务关联的四级工作项已确认的有：</p>
          {
            tempArray.map((item, key) => {
              return (
                <p key={key} style={{padding:'5px 0'}}>{key+1}、{item.name}；</p>
              )
            })
          }
          <p style={{marginTop:15,color:'red'}}>So，您不能删除本条任务！</p>
        </div>),
      });
      return false;
    }

    if(params.creatorId == presentUserId) {

      if(type == 'normal') {
        deleteNormalTaskById(params.id).then((res) => {
          message.success("删除任务成功！");
          _self.showMineCreateTasks();
          _self.showLevelFourStageAndTasks(); // 刷新我的四级工作项数据
        })
      }

      if(type == 'file') {
        deleteFileTaskById(params.id).then((res) => {
          message.success("删除任务成功！");
          _self.showMineCreateTasks();
          _self.showLevelFourStageAndTasks(); // 刷新我的四级工作项数据
        })
      }

    }else {

      message.warning("本条任务不是你创建的，无法进行删除操作！");

    }

  },
  handleGetLevelFourStageTasks(params) {
    // 获取四级工作项下的任务清单
    let _self = this;
    let tempLevelFourStageId = params.id;

    _self.setState({ subLoading: true });

    getLevelFourStageForIpd(tempLevelFourStageId).then((res) => {
      _self.setState({
        presentLevelFourStageDatas: res.jsonResult.levelFourStage,
        subLoading: false
      });
    })
  },
  handleLevelFourJoinItemAtLocal(levelFourStageData) {
    // 本地处理四级工作项，不用每次获取全部
    let _self = this;
    let tempLevelFourStageDatas = _self.state.levelFourStageDatas;
    let tempArray = [];

    _.map(tempLevelFourStageDatas, (item) => {
      if(item.levelFourStageItem.id == levelFourStageData.id) {
        let tempJson = {
          ...item,
          levelFourStageItem: levelFourStageData
        };
        tempArray.push(tempJson);
      }else {
        tempArray.push(item);
      }
    })

    _self.setState({ levelFourStageDatas: tempArray, reLoading: false });

    _self.handleGetLevelFourStageTasks(_self.state.selectedLevelFourStage); // 更新任务列表
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    //监听窗口改变大小事件
    window.onresize = this.changeWindowSize;

    if(state.loading) return <Warning datas="数据加载中，请耐心等待..." />;

    return (
      <QueueAnim type="right" className={styles['ipd-container']}>
        <div key="a" className={styles['ipd-item-container']}>
          <div className={styles['ipd-item-header']}>四级工作项</div>
          <Spin spinning={state.loading || state.reLoading}>
            <div className={styles['ipd-subitem-container']}>
              <Button type="dashed" onClick={this.showMineCreateTasks} style={{width:'100%',marginBottom:10}}>
                {
                  state.isOnlyShow ?
                    <span className="text-info">管理我创建的任务</span>
                  :
                    <span>管理我创建的任务</span>
                }
              </Button>
              <ul>

                {
                  _.size(state.levelFourStageDatas) == 0 ?
                    <div className={styles['no-content-tips']}>暂无属于你的工作项！</div>
                  :
                    null
                }

                {
                  _.map(state.levelFourStageDatas, (item, key) => {
                    let tempTipsStr = '1、'+item.levelOneStageName+' 2、'+item.levelTwoStageName+' 3、'+item.levelThreeStageName+' 4、'+item.levelFourStageItem.name;
                    return (
                      <li key={key} onClick={_self.handleSelectItemForLevelFour.bind(null, item)}>
                        <div title={item.name} className={styles['ipd-sub-container-body']}>
                          {/* 匹配成功 且 已激活 */
                            item.levelFourStageItem.id == state.selectedLevelFourStage.id ?
                              <div style={{color:'#56ABEF'}}>
                                {
                                  item.levelFourStageItem.ready ?
                                    <Tooltip title="已完成任务清单编制"><span><Icon className="text-success" type="check-circle" />&nbsp;</span></Tooltip>
                                  :
                                    null
                                }
                                <Tooltip title={tempTipsStr}><span>{item.levelFourStageItem.name}</span></Tooltip>
                                <Icon className={styles['ipd-list-icon']} type="caret-right" />
                              </div>
                            :
                              <span>
                                {
                                  item.levelFourStageItem.ready ?
                                    <Tooltip title="已完成任务编制"><span><Icon className="text-success" type="check-circle" />&nbsp;</span></Tooltip>
                                  :
                                    <Tooltip title="未完成任务编制"><span><Icon className="text-gray" type="minus-circle" />&nbsp;</span></Tooltip>
                                }
                                <Tooltip title={tempTipsStr}><span>{item.levelFourStageItem.name}</span></Tooltip>
                              </span>
                          }
                        </div>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </Spin>
        </div>

        <div key="b" className={styles['ipd-dashed-lines']}></div>

        {
          state.isOnlyShow ?
            null
          :
            <div>
              {
                state.selectedLevelFourStage.ready ?
                  <div className={styles['ipd-tabs-absolute-box']} onClick={this.handleCompleteMountTasksForLevelFourStage.bind(null, 'completed')}>
                    <div className={styles['ipd-tabs-absolute-item']}>
                      <Icon className="text-success" type="check-circle" /> 已完成本工作项任务编制
                    </div>
                    <div className={styles['ipd-tabs-absolute-layer']}></div>
                  </div>
                :
                  <div className={styles['ipd-tabs-absolute-box']} onClick={this.handleCompleteMountTasksForLevelFourStage.bind(null, 'normal')}>
                    <div className={styles['ipd-tabs-absolute-item']}>
                      <Icon type="tags"/> 结束本工作项任务编制并提交审核
                    </div>
                    <div className={styles['ipd-tabs-absolute-layer']}></div>
                  </div>
              }
            </div>
        }

        <div key="c" style={{height:'100%',overflow:'auto'}}>
          <Spin spinning={state.loading || state.reLoading || state.subLoading}>
            {
              state.selectedLevelFourStage.id ?
                <div>
                  <div className="desp-item-number">
                    <div className="desp-number-orange">{_.size(state.presentLevelFourStageDatas.NormalTasks)}</div>
                    <div className="desp-number-text">通用任务</div>
                  </div>
                  <div style={{minWidth: state.rightContainerWidth,overflow:'auto',marginBottom:15}}>
                    {
                      _.size(state.presentLevelFourStageDatas.NormalTasks) == 0 ?
                        <div className={styles['no-content-tips']}>暂无通用任务</div>
                      :
                        <div className={styles['ipd-list']}>
                          <ul>
                            {
                              _.map(state.presentLevelFourStageDatas.NormalTasks, (item, key) => {
                                return (
                                  <li key={key} title="点击任务名称查看详情">
                                    {
                                      state.isOnlyShow ?
                                        <div className={styles['task-hidden-options']}>
                                          <span onClick={_self.handleShowNormalTask.bind(null, item)}>{item.name}</span>
                                          {
                                            _.size(item.LevelFourStages) > 0 ?
                                              <span className="text-gray" style={{cursor:'default'}}>
                                                （四级工作项：
                                                  {item.LevelFourStages[0].name}
                                                  {
                                                    _.size(item.LevelFourStages) > 1 ?
                                                      <small> ... 等{_.size(item.LevelFourStages)}条</small>
                                                    :
                                                      null
                                                  }
                                                ）
                                              </span>
                                            :
                                              null
                                          }
                                          <Tooltip title="删除任务" placement="left">
                                            <span onClick={this.deleteNormalOrFileTask.bind(null, item, 'normal')} className={styles['option-box']}><Icon type="cross-circle-o" /></span>
                                          </Tooltip>
                                        </div>
                                      :
                                        <div style={{width:'100%'}} onClick={_self.handleShowNormalTask.bind(null, item)}>
                                          {item.name}
                                        </div>
                                    }

                                  </li>
                                )
                              })
                            }
                          </ul>
                        </div>
                    }

                    {
                      !state.isOnlyShow && !state.presentLevelFourStageDatas.ready ?
                        <Button type="dashed" size="small" onClick={this.handleCreateDefaultTasks.bind(null, 'normal')} style={{marginTop:10}}><Icon type="plus" />创建通用任务</Button>
                      :
                        null
                    }

                  </div>

                  <div className="desp-item-number">
                    <div className="desp-number-orange">{_.size(state.presentLevelFourStageDatas.FileTasks)}</div>
                    <div className="desp-number-text">文档任务</div>
                  </div>
                  <div style={{minWidth: state.rightContainerWidth}}>
                    {
                      _.size(state.presentLevelFourStageDatas.FileTasks) == 0 ?
                        <div className={styles['no-content-tips']}>暂无文档任务</div>
                      :
                        <div className={styles['ipd-list']}>
                          <ul>
                            {
                              _.map(state.presentLevelFourStageDatas.FileTasks, (item, key) => {
                                return (
                                  <li key={key} title="点击任务名称查看详情">
                                    {
                                      state.isOnlyShow ?
                                        <div className={styles['task-hidden-options']}>
                                          <span onClick={_self.handleShowFileTask.bind(null, item)}>{item.name}</span>
                                          {
                                            _.size(item.LevelFourStages) > 0 ?
                                              <span className="text-gray" style={{cursor:'default'}}>
                                                （四级工作项：
                                                  {item.LevelFourStages[0].name}
                                                  {
                                                    _.size(item.LevelFourStages) > 1 ?
                                                      <small> ... 等{_.size(item.LevelFourStages)}条</small>
                                                    :
                                                      null
                                                  }
                                                ）
                                              </span>
                                            :
                                              null
                                          }
                                          <Tooltip title="删除任务" placement="left">
                                            <span onClick={this.deleteNormalOrFileTask.bind(null, item, 'file')} className={styles['option-box']}><Icon type="cross-circle-o" /></span>
                                          </Tooltip>
                                        </div>
                                      :
                                        <div style={{width:'100%'}} onClick={_self.handleShowFileTask.bind(null, item)}>
                                          {item.name}
                                        </div>
                                    }
                                  </li>
                                )
                              })
                            }
                          </ul>
                        </div>
                    }

                    {
                      !state.isOnlyShow && !state.presentLevelFourStageDatas.ready ?
                        <Button type="dashed" size="small" onClick={this.handleCreateDefaultTasks.bind(null, 'file')} style={{marginTop:10}}><Icon type="plus" />创建文档任务</Button>
                      :
                        null
                    }

                  </div>
                </div>
              :
                <div style={{width:state.rightContainerWidth,textAlign:'center',marginTop:'45%',fontSize:20}}>
                  <Icon type="enter" /> 请选择左侧四级工作项！
                </div>
            }
          </Spin>
        </div>

        {
          state.subModalVisible ?
            <div key="e" className="modals-right-works-container">
              <div className="modals-right-close" onClick={this.closeModal}><Tooltip placement="left" title="关闭"><Icon type="cross" /></Tooltip></div>
              <div className="modals-right-content">
                { state.subModals }
              </div>
            </div>
          :
            null
        }

      </QueueAnim>
    )
  }
});

export default EditTasksForIpd;