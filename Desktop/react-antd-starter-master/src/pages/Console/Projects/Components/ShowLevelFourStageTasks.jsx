import React from 'react';
import Cookies from 'js-cookie';
import QueueAnim from 'rc-queue-anim';

import {
  showProject,
  getLevelFourStageForIpd
} from '../../../../services/api';

import { Tabs, Icon, message, Tooltip, Spin } from 'antd';

import Warning from '../../../Common/Warning';

import styles from './Common.less';

import ModifyNormalTask from './ModifyNormalTask';
import ModifyFileTask from './ModifyFileTask';

// ant
const TabPane = Tabs.TabPane;

// main
let ShowLevelFourStageTasks = React.createClass({
  getInitialState() {
    return {
      loading: false,
      reloadChecked: 0, // 检查渲染条件
      subModalVisible: false,
      subModals: null,
      taskDatas: {},
      levelFourStageId: this.props.levelFourStageId,
      stageNameDatas: this.props.stageNameDatas,
      levelFourDatas: this.props.levelFourDatas,
      levelThreeStage: this.props.levelThreeStage,
      levelTwoStage: this.props.levelTwoStage,
    };
  },
  componentDidMount() {
    this.showLevelFourStages();
  },
  componentWillReceiveProps(nextProps) {
    if(nextProps.initialChecked != this.props.initialChecked) this.setState({ reloadChecked: nextProps.initialChecked });
    if(nextProps.levelFourStageId != this.props.levelFourStageId) this.setState({ levelFourStageId: nextProps.levelFourStageId });
    if(nextProps.stageNameDatas != this.props.stageNameDatas) this.setState({ stageNameDatas: nextProps.stageNameDatas });
    if(nextProps.levelFourDatas != this.props.levelFourDatas) this.setState({ levelFourDatas: nextProps.levelFourDatas });
    if(nextProps.levelThreeStage != this.props.levelThreeStage) this.setState({ levelThreeStage: nextProps.levelThreeStage });
    if(nextProps.levelTwoStage != this.props.levelTwoStage) this.setState({ levelTwoStage: nextProps.levelTwoStage });
  },
  componentWillUpdate(nextProps, nextState) {
    // 更新组件
    let _self = this;
    if(nextState.reloadChecked != _self.state.reloadChecked) {
      this.showLevelFourStages(); // 重新获取任务数据
      _self.setState({ subModalVisible: false, subModals: null }); // 关闭修改界面
    }
  },
  onChildChanged(newState){
    // 监听子组件的状态变化
    this.setState({ reloadChecked: newState });
  },
  showLevelFourStages() {
    let _self = this;

    _self.setState({ loading: true });

    getLevelFourStageForIpd(_self.state.levelFourStageId).then((res) => {

      let datas = res.jsonResult.levelFourStage;

      _self.setState({
        taskDatas: datas,
        loading: false,
      });

    })
  },
  handleModifyNormalTask(tempItem){

    // 已完成无法修改
    if(tempItem.status == 'completed') return message.warning("已完成的任务不能进行修改操作！", 3);

    this.setState({
      subModalVisible: true,
      subModals: <ModifyNormalTask taskid={tempItem.id} levelTwoStage={this.state.levelTwoStage} levelThreeStage={this.state.levelThreeStage} levelFourDatas={this.state.levelFourDatas} callbackParent={this.onChildChanged} initialChecked={this.state.reloadChecked} />
    });
  },
  handleModifyFileTask(tempItem){

    // 已完成无法修改
    if(tempItem.status == 'completed') return message.warning("已完成的任务不能进行修改操作！", 3);

    this.setState({
      subModalVisible: true,
      subModals: <ModifyFileTask taskid={tempItem.id} levelTwoStage={this.state.levelTwoStage} levelThreeStage={this.state.levelThreeStage} levelFourDatas={this.state.levelFourDatas} callbackParent={this.onChildChanged} initialChecked={this.state.reloadChecked} />
    });
  },
  closeModal() {
    this.setState({ subModalVisible: false });
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    return (
      <Spin spinning={state.loading}>

        <div className={styles['task-top-tips-box']}>
          <Icon type="eye" className="text-success"/>&nbsp;
          {state.stageNameDatas[0] || '...'}
          <span className="text-gray"> / </span>
          {state.stageNameDatas[1] || '...'}
          <span className="text-gray"> / </span>
          {state.stageNameDatas[2] || '...'}
          <span className="text-gray"> / </span>
          {state.stageNameDatas[3] || '...'}
        </div>

        <br/>

        <div className="desp-item-number">
          <div className="desp-number-orange">{_.size(state.taskDatas.NormalTasks)}</div>
          <div className="desp-number-text">通用任务</div>
        </div>
        <div className="desp-list-h-30">
          {
            _.size(state.taskDatas.NormalTasks) == 0 ?
              <div className={styles['no-content-tips']}>暂无通用任务</div>
            :
              null
          }
          <ul className={styles['task-lists']}>
            {
              _.map(state.taskDatas.NormalTasks, (item, key) => {

                let text = '';
                let color = '';

                switch(item.status){
                  case 'inactive':
                    color = '#989898'; //灰色
                    text = '未激活';
                  break;
                  case 'active':
                    color = '#f50'; //红色
                    text = '进行中';
                  break;
                  case 'doing':
                    color = '#f50'; //红色
                    text = '进行中';
                  break;
                  case 'completed':
                    color = '#87d068'; //绿色
                    text = '已完成';
                  break;
                }

                let flag = (<Tooltip placement="left" title={text}><span style={{ color: color }}> ● </span></Tooltip>);

                return (
                  <li key={key} onClick={_self.handleModifyNormalTask.bind(null, item)} title={item.name}>
                    {flag}
                    {item.name}
                  </li>
                )
              })
            }
          </ul>
        </div>

        <br/>

        <div className="desp-item-number">
          <div className="desp-number-orange">{_.size(state.taskDatas.FileTasks)}</div>
          <div className="desp-number-text">文档任务</div>
        </div>
        <div className="desp-list-h-30">
          {
            _.size(state.taskDatas.FileTasks) == 0 ?
              <div className={styles['no-content-tips']}>暂无文档任务</div>
            :
              null
          }
          <ul className={styles['task-lists']}>
            {
              _.map(state.taskDatas.FileTasks, (item, key) => {

                let text = '';
                let color = '';

                switch(item.status){
                  case 'inactive':
                    color = '#989898'; //灰色
                    text = '未激活';
                  break;
                  case 'active':
                    color = '#f50'; //红色
                    text = '进行中';
                  break;
                  case 'doing':
                    color = '#f50'; //红色
                    text = '进行中';
                  break;
                  case 'completed':
                    color = '#87d068'; //绿色
                    text = '已完成';
                  break;
                }

                let flag = (<Tooltip placement="left" title={text}><span style={{ color: color }}> ● </span></Tooltip>);

                return (
                  <li key={key} onClick={_self.handleModifyFileTask.bind(null, item)} title={item.name}>
                    {flag}
                    {item.name}
                  </li>
                )
              })
            }
          </ul>
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

      </Spin>
    );
  }
});

export default ShowLevelFourStageTasks;