/**
 * Todo:稍后把布局改一下（√）
 */

import React from 'react';
import { Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import {
  getLevelFourStageAndTasksForIpd,
  refuseLevelFourStageTrimForIpd,
  acceptAllStagesTrimForIpd,
  getLevelFourStageForIpd
} from '../../../services/api';

import { message, Spin, Icon, Button, Modal, Switch, Form, Input, DatePicker, Select, Popconfirm, Tooltip, Tabs } from 'antd';

import styles from '../Common.less';

import ShowNormalTask from '../../Common/Tasks/ShowNormalTask';
import ShowFileTask from '../../Common/Tasks/ShowFileTask';

// ant
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

// main
let ConfirmTasksForIpd = React.createClass({
  getInitialState() {
    return {
      loading: true,
      reLoading: false,
      subModalVisible: false,
      subModals: null,
      stageDatas: [],
      selectedUserDatas: {
        userId: '00',
        levelFourStages: []
      },
      selectedUserDatasBackup: {}, //备份用于切换用户
      rightContainerWidth: (document.body.clientWidth - 510) + 'px',
      rightContainerHeight: (document.body.clientHeight - 120) + 'px',
      selectedLevelFourStage: '',
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
  },
  showLevelFourStageAndTasks(parmas) {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.error("请先选择您参与的项目部或部门");

    getLevelFourStageAndTasksForIpd(projectId).then((res) => {
      let datas = res.jsonResult.project;

      if(parmas == 'refresh') {
        //已载入数据刷新
        let tempSelectedUserDatas = null;
        _.map(datas, (item) => {
          if(item.userId == _self.state.selectedUserDatasBackup.userId) {
            return tempSelectedUserDatas = item;
          }
        })

        _self.setState({
          stageDatas: datas,
          selectedUserDatas: tempSelectedUserDatas,
          selectedUserDatasBackup: tempSelectedUserDatas,
          selectedLevelFourStage: '',
          reLoading: false
        });

      }else {
        //首次加载
        _self.setState({
          stageDatas: datas,
          selectedUserDatas: datas[0],
          selectedUserDatasBackup: datas[0],
          loading: false
        });
      }

      _self.changeWindowSize();

    })

  },
  handleSelectStage(tempItem) {
    if(tempItem.userId != this.state.selectedUserDatasBackup.userId) {
      //切换责任人的时候取消任务显示
      this.setState({
        selectedUserDatas: tempItem,
        selectedUserDatasBackup: tempItem,
        selectedLevelFourStage: ''
      });
    }
    this.setState({ selectedUserDatas: tempItem });
  },
  handleSelectItemForLevelFour(tempItem) {
    // 切换四级工作项，取消右侧详情显示框
    if(this.state.selectedLevelFourStage.id && tempItem.levelFourStageItem.id != this.state.selectedLevelFourStage.id) {

      this.setState({
        selectedLevelFourStage: tempItem.levelFourStageItem,
        subModalVisible: false,
        subModals: ''
      });

    }else {

      this.setState({ selectedLevelFourStage: tempItem.levelFourStageItem });

    }

    this.handleGetLevelFourStageTasks(tempItem.levelFourStageItem);

  },
  changeWindowSize() {
    let tempClientWidth = document.body.clientWidth;
    let tempClientHeight = document.body.clientHeight;
    let tempIpdConfirmHeader = document.getElementById('ipd-confirm-header').offsetHeight;

    this.setState({
      rightContainerHeight: (tempClientHeight - tempIpdConfirmHeader - 95) + 'px',
      rightContainerWidth: (tempClientWidth - 510) + 'px'
    });
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
  closeModal() {
    this.setState({ subModalVisible: false });
  },
  handleRefuseLevelFourStage(params) {
    let _self = this;

    if(params == 'unconfirm') return message.warning("当前工作项负责人还未确认提交！");

    let tempSelectedLevelFourStage = _self.state.selectedLevelFourStage;
    if(!tempSelectedLevelFourStage) return message.warning("请先选择四级工作项！");

    confirm({
      title: 'dES提示',
      content: '您确定要退回【'+tempSelectedLevelFourStage.name+'】的工作项吗？',
      onOk() {
        //确定退回工作项
        _self.setState({ reLoading: true });
        refuseLevelFourStageTrimForIpd(tempSelectedLevelFourStage.id).then((res) => {
          if(res.jsonResult.msg == 'ok') {
            message.success("【"+ tempSelectedLevelFourStage.name + "】编制任务退回成功！");
            _self.handleLevelFourJoinItemAtLocal(_self.state.selectedUserDatasBackup, res.jsonResult.levelFourStage);
          }else {
            message.info("【"+ tempSelectedLevelFourStage.name + "】编制任务退回失败！");
          }
        })

      },
      onCancel() {},
    });

  },
  handleSubmit() {
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.error("请先选择您参与的项目部或部门");

    acceptAllStagesTrimForIpd(projectId).then((res) => {
      if(res.jsonResult.code < 0) return message.warning(res.jsonResult.msg);
      message.success("流程裁剪已全部结束，即将刷新...");
      setTimeout(() => {
        location.reload();
      }, 500)
    })
  },
  showAllIpd() {
    let url = "#/show/allIpd";
    window.open(url,'','scrollbars=no,status=no,resizable=no,location=no');
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
  handleLevelFourJoinItemAtLocal(user, levelFourStageData) {
    // 本地处理四级工作项，不用每次获取全部
    let _self = this;
    let tempStageDatas = _self.state.stageDatas;
    let tempArray = [];

    // 处理当前选择的四级工作项
    let tempSelectedUserDatas = {
      userId: '00',
      levelFourStages: []
    };

    _.map(tempStageDatas, (item1, key1) => {
      if(item1.userId == user.userId) {

        let tempJson = {
          userName: item1.userName,
          userId: item1.userId,
          hasReady: false, // 当前人员确认状态置为初始
        };

        let tempSubArray = [];

        _.map(item1.levelFourStages, (item2, key2) => {
          if(item2.levelFourStageItem.id == levelFourStageData.id) {

            let tempSubJson = {
              levelOneStageName: item2.levelOneStageName,
              levelTwoStageName: item2.levelTwoStageName,
              levelThreeStageName: item2.levelThreeStageName,
              levelFourStageItem: levelFourStageData
            };
            tempSubArray.push(tempSubJson);
          }else {
            tempSubArray.push(item2);
          }
        })

        tempJson.levelFourStages = tempSubArray;

        tempArray.push(tempJson);

        // 处理当前选择的四级工作项
        tempSelectedUserDatas = {
          userId: user.userId,
          levelFourStages: tempSubArray
        };

      }else {
        tempArray.push(item1);
      }
    })

    // 当前工作项确认状态置为初始
    let tempPresentLevelFourStageDatas = {
      ..._self.state.presentLevelFourStageDatas,
      ready: false
    };

    _self.setState({
      stageDatas: tempArray,
      presentLevelFourStageDatas: tempPresentLevelFourStageDatas,
      selectedUserDatas: tempSelectedUserDatas,
      selectedLevelFourStage: levelFourStageData,
      reLoading: false
    });

  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    //监听窗口改变大小事件
    window.onresize = this.changeWindowSize;

    return (
      <div className={styles['ipd-confirm-container']}>
        <div style={{marginBottom:15}} id="ipd-confirm-header">
          工作项责任人：
          {
            _.map(state.stageDatas, (item, key) => {
              return (
                <span key={key}>
                  <Button type="dashed" size="small" onClick={_self.handleSelectStage.bind(null, item)} style={{marginTop:5}}>
                    {
                      item.hasReady ?
                        <Tooltip title="已完成任务编制"><Icon className="text-success" type="check-circle" /></Tooltip>
                      :
                        <Tooltip title="未完成任务编制"><Icon className="text-gray" type="minus-circle" /></Tooltip>
                    }
                    {
                      state.selectedUserDatas.userId == item.userId ?
                        <span style={{color:'#56ABEF'}}>{item.userName}</span>
                      :
                        item.userName
                    }
                  </Button>&nbsp;
                </span>
              )
            })
          }

          {/* 暂无数据加载 */
            state.loading ?
              <span><Icon type="loading" /> 加载中... </span>
            :
              null
          }
          <div style={{marginTop:5}}>
            <Popconfirm title="确定要提交该信息吗？" onConfirm={this.handleSubmit}>
              <Button style={{background:'#74CC50'}} type="primary" size="small">确认全部工作项</Button>
            </Popconfirm>
            <a onClick={this.showAllIpd} style={{marginLeft:10}}>查看所有ipd工作项</a>
          </div>
        </div>

        <div className={styles['ipd-confirm-item-container']} style={{height: state.rightContainerHeight,borderRight:'1px dashed #CCC'}}>
          <div className={styles['ipd-confirm-item-header']}>四级工作项</div>
          <div className={styles['ipd-confirm-subitem-container']}>
            <Spin spinning={state.loading || state.reLoading}>
              <ul>
                {
                  _.map(state.selectedUserDatas.levelFourStages, (item, key) => {
                    let tempTipsStr = '1、'+item.levelOneStageName+' 2、'+item.levelTwoStageName+' 3、'+item.levelThreeStageName+' 4、'+item.levelFourStageItem.name;
                    return (
                      <li title={item.name} key={key} onClick={_self.handleSelectItemForLevelFour.bind(null, item)}>
                        <div className={styles['ipd-confirm-sub-container-body']}>
                          {
                            item.levelFourStageItem.id == state.selectedLevelFourStage.id ?
                              <div style={{color:'#56ABEF'}}>
                                {
                                  item.levelFourStageItem.ready ?
                                    <Tooltip title="已确认"><span><Icon className="text-success" type="check-circle" />&nbsp;</span></Tooltip>
                                  :
                                    <Tooltip title="未确认"><span><Icon className="text-gray" type="minus-circle" />&nbsp;</span></Tooltip>
                                }
                                <Tooltip title={tempTipsStr}><span>{item.levelFourStageItem.name}</span></Tooltip>
                                <Icon className={styles['ipd-confirm-list-icon']} type="caret-right" />
                              </div>
                            :
                              <span>
                                {
                                  item.levelFourStageItem.ready ?
                                    <Tooltip title="已确认"><span><Icon className="text-success" type="check-circle" />&nbsp;</span></Tooltip>
                                  :
                                    <Tooltip title="未确认"><span><Icon className="text-gray" type="minus-circle" />&nbsp;</span></Tooltip>
                                }
                                <Tooltip title={tempTipsStr}><span>{item.levelFourStageItem.name}</span></Tooltip>
                              </span>
                          }
                        </div>
                      </li>
                    )
                  })
                }

                {/* 暂无数据加载 */
                  state.loading ?
                    <li><Icon type="loading" /> 加载中...</li>
                  :
                    null
                }
              </ul>
            </Spin>
          </div>
        </div>

        <div style={{minWidth: state.rightContainerWidth,float:'left',paddingLeft:15}}>
          {
            state.selectedLevelFourStage ?
              <div style={{overflow:'auto'}}>

                {
                  state.selectedLevelFourStage.ready ?
                    <div className={styles['ipd-confirm-tabs-absolute-box']} onClick={this.handleRefuseLevelFourStage} >
                      <div className={styles['ipd-confirm-tabs-absolute-item']}>
                        <Icon type="rollback" /> 退回本工作项任务编制
                      </div>
                      <div className={styles['ipd-confirm-tabs-absolute-layer']}></div>
                    </div>
                  :
                    <div className={styles['ipd-confirm-tabs-absolute-box']} onClick={this.handleRefuseLevelFourStage.bind(null, 'unconfirm')} >
                      <div className={styles['ipd-confirm-tabs-absolute-item']}>
                        <Icon type="tags" /> 本工作项负责人未确认
                      </div>
                      <div className={styles['ipd-confirm-tabs-absolute-layer']}></div>
                    </div>
                }

                <div className="desp-item-number">
                  <div className="desp-number-orange">{_.size(state.presentLevelFourStageDatas.NormalTasks)}</div>
                  <div className="desp-number-text">通用任务</div>
                </div>
                <div style={{minWidth: state.rightContainerWidth,overflow:'auto',marginBottom:15}}>
                  {
                    _.size(state.presentLevelFourStageDatas.NormalTasks) ==0 ?
                      <div className={styles['no-content-tips']}>暂无通用任务</div>
                    :
                      <div className={styles['ipd-list']}>
                        <ul>
                          {
                            _.map(state.presentLevelFourStageDatas.NormalTasks, (item, key) => {
                              return (
                                <li key={key} onClick={_self.handleShowNormalTask.bind(null, item)}>
                                  {item.name}
                                  <span className="text-gray">（负责人：{item.Owner.name}）</span>
                                </li>
                              )
                            })
                          }
                        </ul>
                      </div>
                  }

                </div>

                <div className="desp-item-number">
                  <div className="desp-number-orange">{_.size(state.presentLevelFourStageDatas.FileTasks)}</div>
                  <div className="desp-number-text">文档任务</div>
                </div>
                <div style={{minWidth: state.rightContainerWidth}}>
                  {
                    _.size(state.presentLevelFourStageDatas.FileTasks) ==0 ?
                      <div className={styles['no-content-tips']}>暂无文档任务</div>
                    :
                      <div className={styles['ipd-list']}>
                        <ul>
                          {
                            _.map(state.presentLevelFourStageDatas.FileTasks, (item, key) => {
                              return (
                                <li key={key} onClick={_self.handleShowFileTask.bind(null, item)}>
                                  {item.name}
                                  <span className="text-gray">（负责人：{item.Owner.name}）</span>
                                </li>
                              )
                            })
                          }
                        </ul>
                      </div>
                  }

                </div>
              </div>
            :
              <div style={{textAlign:'center',marginTop:'25%',fontSize:20}}>
                <Icon type="enter" /> 请选择左侧四级工作项！
              </div>
          }
        </div>

        {
          state.subModalVisible ?
            <QueueAnim type="right">
              <div key="a" className="modals-right-works-container">
                <div className="modals-right-close" onClick={this.closeModal}><Tooltip placement="left" title="关闭"><Icon type="cross" /></Tooltip></div>
                <div className="modals-right-content">
                  { state.subModals }
                </div>
              </div>
            </QueueAnim>
          :
            null
        }

      </div>
    )
  }
});

export default ConfirmTasksForIpd;