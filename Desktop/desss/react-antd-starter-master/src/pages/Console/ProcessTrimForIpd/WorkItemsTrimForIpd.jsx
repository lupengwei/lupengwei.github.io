/**
 * 结束条件：
 * 1、下级工作项开启，必须其上级已开启；
 * 2、上级关闭，下级已开启的工作项也得关闭
 * 3、已开启的工作项必须设置负责人
 * 4、二级工作项以下时间不能超越二级工作项的计划时间
 *
 * 子窗口打开开始检查其关闭状态（每隔1s）一旦关闭刷新数据并清除定时器
 */

import React from 'react';
import { Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import {
  showProject,
  getProjectStagesForIpd,
  completeTwoToFourStageTrimForIpd,
  getLevelOneStagesForIpd,
  getLevelOneStageDetailForIpd,
  getLevelTwoStageDetailForIpd,
  getLevelThreeStageDetailForIpd
} from '../../../services/api';

import { message, Spin, Icon, Button, Modal, Switch, Form, Input, DatePicker, Select, Popconfirm, Tooltip, notification } from 'antd';

import styles from '../Common.less';

// ant
const confirm = Modal.confirm;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

// components
import ModifyLevelTwoStage from './ModifyLevelTwoStage';
import ModifyLevelThreeStage from './ModifyLevelThreeStage';
import ModifyLevelFourStage from './ModifyLevelFourStage';
import CreateLevelThreeStage from './CreateLevelThreeStage';
import CreateLevelFourStage from './CreateLevelFourStage';

// main
let WorkItemsTrimForIpd = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState() {
    return {
      loading: true,
      reloadChecked: 0, // 检查渲染条件
      projectDatas: {
        Users: [],
        qpSuggestion: ''
      },
      projectUsers: [], // 项目人员
      levelOneDatas: [],
      levelTwoDatas: [],
      levelThreeDatas: [],
      levelFourDatas: [],
      isExistedSelectOfLevelOne: false,
      isExistedSelectOfLevelTwo: false,
      isExistedSelectOfLevelThree: false,
      selectedLevelOneStage: {id: null},
      selectedLevelTwoStage: {id: null},
      selectedLevelThreeStage: {id: null},
      subModals: '',
      subModalVisible: false,
      isDoingCheckChildrenWindowClosed: true, // 是否检查子窗口关闭状态
    };
  },
  componentDidMount() {
    this.showProjectInfo();
    this.handleShowLevelOneStage();
  },
  componentWillUpdate(nextProps, nextState) {
    //更新组件
    let _self = this;
    if(nextState.reloadChecked != _self.state.reloadChecked) {
      _self.setState({
        subModals: '',
        subModalVisible: false,
      });
      _self.handleUpdateStage();
    }
  },
  componentWillUnmount() {
    // 清除定时器
    clearInterval(this.state.childrenWindow);
  },
  onChildChanged(newState){
    // 监听子组件的状态变化
    this.setState({ reloadChecked: newState });
  },
  checkingChildWindowStatus() {
    // 检查子窗口关闭状态
    let _self = this;
    let tempSetInterval;

    tempSetInterval = setInterval(() => {
      if(this.state.childrenWindow.closed) {
        // 子窗口已关闭
        if(_self.state.isDoingCheckChildrenWindowClosed) {
          // 刷新数据
          _self.handleUpdateStage();
          _self.setState({ isDoingCheckChildrenWindowClosed: false });
        }else {
          // 清除setInterval方法
          clearInterval(tempSetInterval);
        }
      }
    }, 1000)
  },
  showProjectInfo() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("若需配置项目，请先选择将要配置的组织");

    showProject(projectId).then((res) => {

      let datas = res.jsonResult.project;

      _self.setState({ projectUsers: datas.Users });

    })
  },
  handleUpdateStage() {
    // 更新处理
    this.state.isExistedSelectOfLevelOne ? this.handleShowLevelTwoStage() : null; // 二级级工作项
    this.state.isExistedSelectOfLevelTwo ? this.handleShowLevelThreeStage() : null; // 三级工作项
    this.state.isExistedSelectOfLevelThree ? this.handleShowLevelFourStage() : null; // 四级工作项
  },
  handleShowLevelOneStage() {
    // 获取一级工作项
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("若需配置项目，请先选择将要配置的组织");

    let _self = this;

    getLevelOneStagesForIpd(projectId).then((res) => {

      let tempDatas = _.sortBy(res.jsonResult.project.LevelOneStages, (o) => {return parseInt(o.code);}); // code排序

      _self.setState({
        levelOneDatas: tempDatas,
        loading: false
      });

    })

  },
  handleShowLevelTwoStage(stage) {
    // 获取二级工作项
    let _self = this;
    let tempOneStageId = stage ? stage.id : _self.state.selectedLevelOneStage.id;

    getLevelOneStageDetailForIpd(tempOneStageId).then((res) => {

      let tempArray = res.jsonResult.levelOneStage.LevelTwoStages;
      let tempOpenedDatas = _.filter(tempArray, function(o) { return o.opened; }); // 筛选出已打开
      let tempUnopenedDatas = _.filter(tempArray, function(o) { return !o.opened; }); // 筛选出未打开

      tempOpenedDatas = _.sortBy(tempOpenedDatas, (o) => {return o.index;}); // 已打开排序

      let tempDatas = _.concat(tempOpenedDatas, tempUnopenedDatas); // 以上就是为了排序以及open放在前面

      if(stage) {
        _self.setState({
          levelTwoDatas: tempDatas,
          selectedLevelOneStage: stage,
          isExistedSelectOfLevelOne: true,
          isExistedSelectOfLevelTwo: false,
          isExistedSelectOfLevelThree: false,
          levelThreeDatas: [],
          levelFourDatas: [],
          selectedLevelTwoStage: {id: null}
        });
      }else {
        // 仅仅是刷新
        _self.setState({ levelTwoDatas: tempDatas });
      }

    })

  },
  handleShowLevelThreeStage(stage) {
    // 获取三级工作项
    let _self = this;
    let tempTwoStageId = stage ? stage.id : _self.state.selectedLevelTwoStage.id;

    getLevelTwoStageDetailForIpd(tempTwoStageId).then((res) => {

      let tempDatas = _.sortBy(res.jsonResult.levelTwoStage.LevelThreeStages, (o) => {return !o.opened;}); //过滤（opened）

      if(stage) {
        _self.setState({
          levelThreeDatas: tempDatas,
          selectedLevelTwoStage: stage,
          isExistedSelectOfLevelTwo: true,
          isExistedSelectOfLevelThree: false,
          levelFourDatas: [],
          selectedLevelThreeStage: {id: null}
        });
      }else {
        // 仅仅是刷新
        _self.setState({ levelThreeDatas: tempDatas });
      }

    })

  },
  handleShowLevelFourStage(stage) {
    // 获取四级工作项
    let _self = this;
    let tempThreeStageId = stage ? stage.id : _self.state.selectedLevelThreeStage.id;

    getLevelThreeStageDetailForIpd(tempThreeStageId).then((res) => {

      let tempDatas = _.sortBy(res.jsonResult.levelThreeStage.LevelFourStages, (o) => {return !o.opened;}); //过滤（opened）

      if(stage) {
        _self.setState({
          levelFourDatas: tempDatas,
          selectedLevelThreeStage: stage,
          isExistedSelectOfLevelThree: true
        });
      }else {
        // 仅仅是刷新
        _self.setState({ levelFourDatas: tempDatas });
      }

    })

  },
  handleSubmit() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("获取项目信息失败，尝试刷新页面重试！");

    let tempNoneMasterArray = []; // 下一级真正启用必须满足所有上级已经被启用
    let tempNoneNextLevelArray = []; //已启动的工作项其下级必须存在 且 有开启的工作项

    message.info('正在检测数据正确性...', 30);
    _self.setState({ loading: true });

    getProjectStagesForIpd(projectId).then((res) => {

      let tempArray = res.jsonResult.project.LevelOneStages;

      _.map(tempArray, (item1) => {

        _.map(item1.LevelTwoStages, (item2) => {

          if(item2.opened && !item2.masterId) {

            let tempSubArray = [];

            tempSubArray.push(item1.name);
            tempSubArray.push(item2.name);

            tempNoneMasterArray.push(tempSubArray);

          }

          let levelThreeFlag = false;

          _.map(item2.LevelThreeStages, (item3) => {

            if(item2.opened && item3.opened && !item3.masterId) {

              let tempSubArray = [];

              tempSubArray.push(item1.name);
              tempSubArray.push(item2.name);
              tempSubArray.push(item3.name);

              tempNoneMasterArray.push(tempSubArray);

            }

            if(item3.opened) levelThreeFlag = true;

            let levelFourFlag = false;

            _.map(item3.LevelFourStages, (item4) => {
              if(item2.opened && item3.opened && item4.opened && !item4.masterId) {

                let tempSubArray = [];

                tempSubArray.push(item1.name);
                tempSubArray.push(item2.name);
                tempSubArray.push(item3.name);
                tempSubArray.push(item4.name);

                tempNoneMasterArray.push(tempSubArray);

              }
              if(item4.opened) levelFourFlag = true;
            })

            if(item2.opened && item3.opened && (_.size(item3.LevelFourStages) == 0 || !levelFourFlag)) {
              // 已启用但四级工作项为空 或 未启用
              let tempNoneNextLevelSubArray = [];

              tempNoneNextLevelSubArray.push(item1.name);
              tempNoneNextLevelSubArray.push(item2.name);
              tempNoneNextLevelSubArray.push(item3.name);

              tempNoneNextLevelArray.push(tempNoneNextLevelSubArray);
            }

          })

          if(item2.opened && (_.size(item2.LevelThreeStages) == 0 || !levelThreeFlag)) {
            // 已启用但三级工作项为空 或 未启用
            let tempNoneNextLevelSubArray = [];

            tempNoneNextLevelSubArray.push(item1.name);
            tempNoneNextLevelSubArray.push(item2.name);

            tempNoneNextLevelArray.push(tempNoneNextLevelSubArray);
          }

        })

      })

      if(_.size(tempNoneMasterArray) > 0) {

        Modal.warning({
          title: 'dES提示',
          content: (
            <div>
              <p>已开启的工作项还<span className="text-danger"> 未设置负责人 </span>的有【<span className="text-danger"> {tempNoneMasterArray.length} </span>】条：</p>
              <ul>
                {
                  _.map(tempNoneMasterArray, (item1, key1) => {
                    return (
                      <li key={key1}>
                        <b>{key1+1}</b>、
                        {
                          _.map(item1, (item2, key2) => {
                            return (
                              <span key={key2}>
                                {item2}
                                {
                                  key2 != item1.length-1 ?
                                    <span className="text-gray"> / </span>
                                  :
                                    null
                                }
                              </span>
                            )
                          })
                        }
                        ；
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          ),
        });

      }else if(_.size(tempNoneNextLevelArray) > 0) {

        Modal.warning({
          title: 'dES提示',
          content: (
            <div>
              <p>已开启的工作项下面还<span className="text-danger"> 未完善（记录为空）</span>的工作项有【<span className="text-danger"> {tempNoneNextLevelArray.length} </span>】条：</p>
              <ul>
                {
                  _.map(tempNoneNextLevelArray, (item1, key1) => {
                    return (
                      <li key={key1}>
                        <b>{key1+1}</b>、
                        {
                          _.map(item1, (item2, key2) => {
                            return (
                              <span key={key2}>
                                {item2}
                                {
                                  key2 != item1.length-1 ?
                                    <span className="text-gray"> / </span>
                                  :
                                    null
                                }
                              </span>
                            )
                          })
                        }
                        ；
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          ),
        });

      }else {

        confirm({
          title: 'dES提示',
          content: '提交前仔细检查开启工作项是否设置相关属性，确定立即结束对本次IPD工作项（二级、三级、四级）的裁剪吗？',
          onOk() {

            _self.setState({ loading: true });

            completeTwoToFourStageTrimForIpd(projectId).then((res) => {

              let datas = res.jsonResult;

              if(datas.code < 0) return message.warning(datas.msg);

              message.success("裁剪确认成功，准备跳转至下一步！");

              Cookies.set('presentProjectStatus', datas.project.status); //重新赋值

              setTimeout(function(){
                _self.context.router.push('/console/projects/checkWorkItemsForIpd');
              }, 500)

            })

          },
          onCancel() {},
        });

      }

      message.destroy(); // 销毁
      _self.setState({ loading: false });

    })
  },
  handleTips(datas) {
    message.warning(datas);
  },
  showModifyLevelTwoStage(tempItem) {
    this.setState({
      subModalVisible: true,
      subModals: <ModifyLevelTwoStage taskDatas={tempItem} projectUsers={this.state.projectUsers} callbackParent={this.onChildChanged} initialChecked={this.state.reloadChecked} />,
    });
  },
  showModifyLevelThreeStage(tempItem) {
    this.setState({
      subModalVisible: true,
      subModals: <ModifyLevelThreeStage taskDatas={tempItem} levelTwoStage={this.state.selectedLevelTwoStage} projectUsers={this.state.projectUsers} callbackParent={this.onChildChanged} initialChecked={this.state.reloadChecked} />,
    });
  },
  showModifyLevelFourStage(tempItem) {
    this.setState({
      subModalVisible: true,
      subModals: <ModifyLevelFourStage taskDatas={tempItem} levelTwoStage={this.state.selectedLevelTwoStage} projectUsers={this.state.projectUsers} callbackParent={this.onChildChanged} initialChecked={this.state.reloadChecked} />,
    });
  },
  closeModal() {
    this.setState({
      subModalVisible: false,
      subModals: null,
    });
  },
  handleCancel(e) {
    this.setState({ commentVisible: false });
  },
  showModifyLevelTwoStageByAll() {
    let url = "#/modify/ipd/multi-work-items?type=one&stageId="+ this.state.selectedLevelOneStage.id;
    let tempNewWindow = window.open(url,'','scrollbars=no,status=no,resizable=no,location=no');

    this.setState({
      childrenWindow: tempNewWindow,
      isDoingCheckChildrenWindowClosed: true, // 启用子窗口关闭状态检查
    });

    this.checkingChildWindowStatus(); // 检查子窗口关闭状态
  },
  showModifyLevelThreeStageByAll() {
    let url = "#/modify/ipd/multi-work-items?type=two&stageId="+ this.state.selectedLevelTwoStage.id;
    let tempNewWindow = window.open(url,'','scrollbars=no,status=no,resizable=no,location=no');

    this.setState({
      childrenWindow: tempNewWindow,
      isDoingCheckChildrenWindowClosed: true, // 启用子窗口关闭状态检查
    });

    this.checkingChildWindowStatus(); // 检查子窗口关闭状态
  },
  showModifyLevelFourStageByAll() {
    let url = "#/modify/ipd/multi-work-items?type=three&stageId="+ this.state.selectedLevelThreeStage.id;
    let tempNewWindow = window.open(url,'','scrollbars=no,status=no,resizable=no,location=no');

    this.setState({
      childrenWindow: tempNewWindow,
      isDoingCheckChildrenWindowClosed: true, // 启用子窗口关闭状态检查
    });

    this.checkingChildWindowStatus(); // 检查子窗口关闭状态
  },
  handleTips(datas) {
    message.warning(datas);
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    return (
      <div className={styles['ipd-container']}>
        <div className={styles['ipd-item-container']}>
          <div className={styles['ipd-item-header']}>一级工作项</div>
          <Spin spinning={state.loading}>
            <div className={styles['ipd-subitem-container']}>
              <Link target="_blank" to="/show/ipd/qp-check-items">
                <Button style={{width:'100%',marginBottom:5}}>查看审核意见</Button>
              </Link>
              <Button onClick={this.handleSubmit} style={{width:'100%',marginBottom:5}} type="primary">提交审核</Button>
              <ul>
                {
                  _.map(state.levelOneDatas, (item, key) => {
                    return (
                      <li key={key} onClick={this.handleShowLevelTwoStage.bind(null, item)}>
                        {/* 匹配成功 且 已激活 */
                          item.id == state.selectedLevelOneStage.id ?
                            <div style={{color:'#56ABEF'}}>
                              {item.name}
                              <Icon className={styles['ipd-list-icon']} type="caret-right" />
                            </div>
                          :
                            item.name
                        }
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </Spin>
        </div>

        <div className={styles['ipd-dashed-lines']}></div>

        {
          state.isExistedSelectOfLevelOne ?
            <div className={styles['ipd-item-container']}>
              <div className={styles['ipd-item-header']}>二级工作项</div>
              <Spin spinning={state.loading}>
                <div className={styles['ipd-subitem-container']}>
                  <Button onClick={this.showModifyLevelTwoStageByAll} style={{width:'100%',marginBottom:5}} type="dashed">裁剪当前所有二级工作项</Button>
                  {
                    _.size(state.levelTwoDatas) > 0 ?
                      <ul>
                        {
                          _.map(state.levelTwoDatas, (item, key) => {
                            return (
                              <li key={key} title={item.name}>
                                <div style={{width:'10%', float:'left'}} className={styles['ipd-modify-icon-left']}>
                                  <Tooltip title="修改工作项" placement="top">
                                    <span onClick={this.showModifyLevelTwoStage.bind(null, item)}>
                                      <Icon type="edit" style={{marginRight:5}}/>
                                    </span>
                                  </Tooltip>
                                </div>
                                <div style={{width:'90%', float:'left'}} className={styles['ipd-sub-container-box']} onClick={this.handleShowLevelThreeStage.bind(null, item)}>
                                  <Tooltip title="序号" placement="top"><span>【{item.index}】</span></Tooltip>
                                  {
                                    item.opened ?
                                      <Tooltip title="已启用" placement="top"><Icon type="check-circle" style={{color:'#77CA56'}} /></Tooltip>
                                    :
                                      <Tooltip title="已关闭" placement="top"><Icon type="minus-circle" style={{color:'#CCC'}} /></Tooltip>
                                  }
                                  &nbsp;
                                  {/* 匹配成功 */
                                    item.id == state.selectedLevelTwoStage.id ?
                                      <span style={{color:'#56ABEF'}}>
                                        <span>{item.name}</span>
                                        <Icon className={styles['ipd-list-icon']} type="caret-right" />
                                      </span>
                                    :
                                      <span className={moment(item.updatedAt).isAfter(moment(item.createdAt)) ? 'text-success' : null}>{item.name}</span>
                                  }
                                </div>
                              </li>
                            )
                          })
                        }
                      </ul>
                    :
                      <div className={styles['no-content-tips']}>暂无对应的二级任务</div>
                  }

                </div>
              </Spin>
            </div>
          :
            null
        }

        {
          state.isExistedSelectOfLevelOne ?
            <div className={styles['ipd-dashed-lines']}></div>
          :
            null
        }

        {
          state.isExistedSelectOfLevelTwo ?
            <div className={styles['ipd-item-container']}>
              <div className={styles['ipd-item-header']}>三级工作项</div>
              <Spin spinning={state.loading}>
                <div className={styles['ipd-subitem-container']}>
                  <Button onClick={this.showModifyLevelThreeStageByAll} style={{width:'100%',marginBottom:5}} type="dashed">裁剪当前所有三级工作项</Button>
                  {
                    _.size(state.levelThreeDatas) > 0 ?
                      <ul>
                        {
                          _.map(state.levelThreeDatas, (item, key) => {
                            return (
                              <li key={key} title={item.name}>
                                <div style={{width:'10%', float:'left'}} className={styles['ipd-modify-icon-left']}>
                                  <Tooltip title="修改工作项" placement="top">
                                    <span onClick={this.showModifyLevelThreeStage.bind(null, item)}>
                                      <Icon type="edit" style={{marginRight:5}}/>
                                    </span>
                                  </Tooltip>
                                </div>
                                <div style={{width:'90%', float:'left'}} className={styles['ipd-sub-container-box']} onClick={this.handleShowLevelFourStage.bind(null, item)}>
                                  {
                                    item.opened ?
                                      <Tooltip title="已启用" placement="top"><Icon type="check-circle" style={{color:'#77CA56'}} /></Tooltip>
                                    :
                                      <Tooltip title="已关闭" placement="top"><Icon type="minus-circle" style={{color:'#CCC'}} /></Tooltip>
                                  }
                                  &nbsp;
                                  {/* 匹配成功 且 已激活 */
                                    item.id == state.selectedLevelThreeStage.id ?
                                      <span style={{color:'#56ABEF'}}>
                                        <span>{item.name}</span>
                                        {item.isNew ? <span className="text-danger">（新）</span> : null}
                                        <Icon className={styles['ipd-list-icon']} type="caret-right" />
                                      </span>
                                    :
                                      <span className={moment(item.updatedAt).isAfter(moment(item.createdAt)) ? 'text-success' : null}>
                                        {item.name}
                                        {item.isNew ? <span className="text-danger">（新）</span> : null}
                                      </span>
                                  }
                                </div>
                              </li>
                            )
                          })
                        }
                      </ul>
                    :
                      <div className={styles['no-content-tips']}>暂无对应的三级任务</div>
                  }

                  <CreateLevelThreeStage datas={state.selectedLevelTwoStage} projectUsers={state.projectUsers} callbackParent={_self.onChildChanged} initialChecked={state.reloadChecked} />

                </div>
              </Spin>
            </div>
          :
            null
        }

        {
          state.isExistedSelectOfLevelTwo ?
            <div className={styles['ipd-dashed-lines']}></div>
          :
            null
        }

        {
          state.isExistedSelectOfLevelThree ?
            <div className={styles['ipd-item-container']}>
              <div className={styles['ipd-item-header']}>四级工作项</div>
              <Spin spinning={state.loading}>
                <div className={styles['ipd-subitem-container']}>
                  <Button onClick={this.showModifyLevelFourStageByAll} style={{width:'100%',marginBottom:5}} type="dashed">裁剪当前所有四级工作项</Button>
                  {
                    _.size(state.levelFourDatas) > 0 ?
                      <ul>
                        {
                          _.map(state.levelFourDatas, (item, key) => {
                            return (
                              <li key={key} className={styles['ipd-sub-container-box']} title={item.name}>
                                <div style={{width:'10%', float:'left'}} className={styles['ipd-modify-icon-left']}>
                                  <Tooltip title="修改工作项" placement="top">
                                    <span onClick={this.showModifyLevelFourStage.bind(null, item)}>
                                      <Icon type="edit" style={{marginRight:5}}/>
                                    </span>
                                  </Tooltip>
                                </div>
                                <div style={{width:'90%', float:'left'}} className={styles['ipd-sub-container-body']}>
                                  {
                                    item.opened ?
                                      <Tooltip title="已启用" placement="top"><Icon type="check-circle" style={{color:'#77CA56'}} /></Tooltip>
                                    :
                                      <Tooltip title="已关闭" placement="top"><Icon type="minus-circle" style={{color:'#CCC'}} /></Tooltip>
                                  }
                                  &nbsp;
                                  <span className={moment(item.updatedAt).isAfter(moment(item.createdAt)) ? 'text-success' : null}>{item.name}</span>
                                  {item.isNew ? <span className="text-danger">（新）</span> : null}
                                </div>
                              </li>
                            )
                          })
                        }
                      </ul>
                    :
                      <div className={styles['no-content-tips']}>暂无对应的四级任务</div>
                  }

                  <CreateLevelFourStage datas={state.selectedLevelThreeStage} projectUsers={state.projectUsers} callbackParent={_self.onChildChanged} initialChecked={state.reloadChecked} />

                </div>
              </Spin>
            </div>
          :
            null
        }

        <div style={{width:15,height:'inherit'}}></div>

        {/* 子组件模态框 */
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
    );
  }
});

export default WorkItemsTrimForIpd;