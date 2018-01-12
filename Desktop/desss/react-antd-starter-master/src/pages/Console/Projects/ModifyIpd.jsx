import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import {
  showProject,
  getProjectStagesForIpd,
  getLevelOneStagesForIpd,
  getLevelOneStageDetailForIpd,
  getLevelTwoStageDetailForIpd,
  getLevelThreeStageDetailForIpd
} from '../../../services/api';

import { message, Icon, Form, Select, Alert, Upload, Button, Row, Col, Spin, Popconfirm, Modal, Input, Tabs, Tooltip } from 'antd';

import styles from '../Common.less';

// ant
const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option   = Select.Option;
const TabPane  = Tabs.TabPane;

// components
import ModifyLevelTwoStage from '../ProcessTrimForIpd/ModifyLevelTwoStage';
import ModifyLevelThreeStage from '../ProcessTrimForIpd/ModifyLevelThreeStage';
import ModifyLevelFourStage from '../ProcessTrimForIpd/ModifyLevelFourStage';
import ShowLevelFourStageTasks from './Components/ShowLevelFourStageTasks';

// main
let ModifyIpd = React.createClass({
  getInitialState() {
    return {
      loading: true,
      reloadChecked: 0, // 检查渲染条件
      subModalVisible: false,
      subModals: null,
      projectDatas: {
        Users: [],
      },
      projectUsers: [], // 项目人员
      levelOneDatas: [],
      levelTwoDatas: [],
      levelThreeDatas: [],
      levelFourDatas: [],
      isExistedSelectOfLevelOne: false,
      isExistedSelectOfLevelTwo: false,
      isExistedSelectOfLevelThree: false,
      isExistedSelectOfLevelFour: false,
      selectedLevelOneStage: {id: null},
      selectedLevelTwoStage: {id: null},
      selectedLevelThreeStage: {id: null},
      selectedLevelFourStage: {id: null},
    };
  },
  componentDidMount() {
    this.showProjectInfo();
    this.handleShowLevelOneStage();
  },
  componentWillUpdate(nextProps, nextState) {
    // 更新组件
    let _self = this;
    if(nextState.reloadChecked != _self.state.reloadChecked) {
      _self.setState({ loading: true, subModalVisible: false });
      _self.handleUpdateStage();
    }
  },
  onChildChanged(newState){
    // 监听子组件的状态变化
    this.setState({ reloadChecked: newState });
  },
  handleUpdateStage() {
    // 更新处理
    this.state.isExistedSelectOfLevelOne ? this.handleShowLevelTwoStage() : null; // 二级级工作项
    this.state.isExistedSelectOfLevelTwo ? this.handleShowLevelThreeStage() : null; // 三级工作项
    this.state.isExistedSelectOfLevelThree ? this.handleShowLevelFourStage() : null; // 四级工作项
    this.setState({ loading: false });
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
  showProjectInfo() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("若需配置项目，请先选择将要配置的组织");

    showProject(projectId).then((res) => {

      let datas = res.jsonResult.project;

      _self.setState({ projectUsers: datas.Users });

    })
  },
  handleSelectItemForLevelFour(tempItem) {
    // 选中四级

    // 组合一至四级工作项名称
    let tempLevelOneToFourStages = [];

    tempLevelOneToFourStages.push(this.state.selectedLevelOneStage.name);
    tempLevelOneToFourStages.push(this.state.selectedLevelTwoStage.name);
    tempLevelOneToFourStages.push(this.state.selectedLevelThreeStage.name);
    tempLevelOneToFourStages.push(tempItem.name);

    // 为了修改任务的时候关联多个四级工作项准备同一级所有四级工作项（过滤出opened状态）
    let tempThisLevelFourArray = [];
    _.map(this.state.selectedLevelThreeStage.LevelFourStages, (item) => {
      if(item.opened) tempThisLevelFourArray.push(item);
    })

    this.setState({
      subModalVisible: true,
      subModals: <ShowLevelFourStageTasks levelTwoStage={this.state.selectedLevelTwoStage} levelThreeStage={this.state.selectedLevelThreeStage} levelFourStageId={tempItem.id} levelFourDatas={tempThisLevelFourArray} stageNameDatas={tempLevelOneToFourStages} />
    });
  },
  closeModal() {
    this.setState({ subModalVisible: false });
  },
  handleTips(datas) {
    message.warning(datas);
  },
  handleTrimCondition() {
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

            }) // 四级工作项结束

            if(item2.opened && item3.opened && (_.size(item3.LevelFourStages) == 0 || !levelFourFlag)) {
              // 已启用但四级工作项为空 或 未启用
              let tempNoneNextLevelSubArray = [];

              tempNoneNextLevelSubArray.push(item1.name);
              tempNoneNextLevelSubArray.push(item2.name);
              tempNoneNextLevelSubArray.push(item3.name);

              tempNoneNextLevelArray.push(tempNoneNextLevelSubArray);
            }

          }) // 三级工作项结束

          if(item2.opened && (_.size(item2.LevelThreeStages) == 0 || !levelThreeFlag)) {
            // 已启用但三级工作项为空 或 未启用
            let tempNoneNextLevelSubArray = [];

            tempNoneNextLevelSubArray.push(item1.name);
            tempNoneNextLevelSubArray.push(item2.name);

            tempNoneNextLevelArray.push(tempNoneNextLevelSubArray);
          }

        }) // 二级工作项结束

      }) // 一级工作项结束

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
                                    ' > '
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
                                    ' > '
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

        message.success("当前ipd裁剪符合发布要求！");

      }

      _self.setState({ loading: false });
      message.destroy(); // 销毁

    })

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

        <div className={styles['ipd-item-container']}>
          <div className={styles['ipd-item-header']}>二级工作项</div>
            {
              state.isExistedSelectOfLevelOne ?
                <Spin spinning={state.loading}>
                  <div className={styles['ipd-subitem-container']}>
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
                                        item.name
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
            :
              null
          }
        </div>

        <div className={styles['ipd-dashed-lines']}></div>

        <div className={styles['ipd-item-container']}>
          <div className={styles['ipd-item-header']}>三级工作项</div>
            {
              state.isExistedSelectOfLevelTwo ?
                <Spin spinning={state.loading}>
                  <div className={styles['ipd-subitem-container']}>
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
                                    {/* 匹配成功 */
                                      item.id == state.selectedLevelThreeStage.id ?
                                        <span style={{color:'#56ABEF'}}>
                                          <span>{item.name}</span>
                                          <Icon className={styles['ipd-list-icon']} type="caret-right" />
                                        </span>
                                      :
                                        item.name
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

                  </div>
                </Spin>
            :
              null
          }
        </div>

        <div className={styles['ipd-dashed-lines']}></div>

        <div className={styles['ipd-item-container']}>
          <div className={styles['ipd-item-header']}>四级工作项</div>
            {
              state.isExistedSelectOfLevelThree ?
                <Spin spinning={state.loading}>
                  <div className={styles['ipd-subitem-container']}>
                    {
                      _.size(state.levelFourDatas) > 0 ?
                        <ul>
                          {
                            _.map(state.levelFourDatas, (item, key) => {
                              return (
                                <li key={key} title={item.name}>
                                  <div style={{width:'10%', float:'left'}} className={styles['ipd-modify-icon-left']}>
                                    <Tooltip title="修改工作项" placement="top">
                                      <span onClick={this.showModifyLevelFourStage.bind(null, item)}>
                                        <Icon type="edit" style={{marginRight:5}}/>
                                      </span>
                                    </Tooltip>
                                  </div>
                                  <div style={{width:'90%', float:'left'}} className={styles['ipd-sub-container-box']} onClick={this.handleSelectItemForLevelFour.bind(null, item)}>
                                    {
                                      item.opened ?
                                        <Tooltip title="已启用" placement="top"><Icon type="check-circle" style={{color:'#77CA56'}} /></Tooltip>
                                      :
                                        <Tooltip title="已关闭" placement="top"><Icon type="minus-circle" style={{color:'#CCC'}} /></Tooltip>
                                    }
                                    &nbsp;
                                    {item.name}
                                  </div>
                                </li>
                              )
                            })
                          }
                        </ul>
                      :
                        <div className={styles['no-content-tips']}>暂无对应的四级任务</div>
                    }

                  </div>
                </Spin>
            :
              null
          }
        </div>

        {/* 检查裁剪条件 */}
        <div className={styles['ipd-confirm-tabs-absolute-box']} onClick={this.handleTrimCondition}>
          <div className={styles['ipd-confirm-tabs-absolute-item']}>
            <Icon type="info-circle-o" /> 检查ipd裁剪条件
          </div>
          <div className={styles['ipd-confirm-tabs-absolute-layer']}></div>
        </div>

        {
          state.subModalVisible ?
            <div className="modals-right-works-container">
              <div className="modals-right-close" onClick={this.closeModal}><Tooltip placement="left" title="关闭"><Icon type="cross" /></Tooltip></div>
              <div className="modals-right-content">
                { state.subModals }
              </div>
            </div>
          :
            null
        }

      </div>
    );
  }
});

export default ModifyIpd;