import React from 'react';
import _ from 'lodash';
import Cookies from 'js-cookie';
import QueueAnim from 'rc-queue-anim';

import { Tabs, Icon, Button, Tooltip, message, Spin } from 'antd';

import {
  showProject,
  getLevelTwoStageDetailForIpd
} from '../../services/api';

import styles from './Common.less';

import ShowNormalTask from '../Common/Tasks/ShowNormalTask';
import ShowFileTask from '../Common/Tasks/ShowFileTask';
import CreateNormalTask from './CreateNormalTask';
import CreateFileTask from './CreateFileTask';

//ant
const TabPane = Tabs.TabPane;

//main
const ShowTasksForLevelStage = React.createClass({
  getInitialState() {
    return {
      loading: false,
      reloadChecked: 0, //检查渲染条件
      subModalVisible: false,
      subModals: null,
      taskDatas: {
        NormalTasks: [],
        FileTasks: []
      },
      levelTwoStageId: this.props.levelTwoStageId
    };
  },
  componentWillMount() {
    this.handleLevelTwoStage();
  },
  onChildChanged(newState){
    //监听子组件的状态变化
    this.setState({ reloadChecked: newState });
  },
  componentWillReceiveProps(nextProps) {
    if(nextProps.levelTwoStageId != this.props.levelTwoStageId) {
      this.setState({ levelTwoStageId: nextProps.levelTwoStageId });
      this.handleLevelTwoStage(nextProps.levelTwoStageId);
    }
  },
  componentWillUpdate(nextProps, nextState) {
    //更新组件
    let _self = this;
    if(nextState.reloadChecked != _self.state.reloadChecked) {
      _self.setState({ loading: true });
      _self.handleLevelTwoStage();
    }
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
  handleCreateNewTasks(type) {

    if(type == 'normal') {
      this.setState({
        subModalVisible: true,
        subModals: <CreateNormalTask taskDatas={this.state.taskDatas} callbackParent={this.onChildChanged} initialChecked={this.state.reloadChecked} />
      });
    }

    if(type == 'file') {
      this.setState({
        subModalVisible: true,
        subModals: <CreateFileTask taskDatas={this.state.taskDatas} callbackParent={this.onChildChanged} initialChecked={this.state.reloadChecked} />
      });
    }
  },
  handleLevelTwoStage(params) {
    // 选择二级工作项，并过其下所有工作项及任务
    let _self = this;
    let tempLevelTwoStageId = params ? params : _self.state.levelTwoStageId;

    getLevelTwoStageDetailForIpd(tempLevelTwoStageId).then((res) => {
      let datas = res.jsonResult.levelTwoStage;
      let tempJson = {
        levelTwoStageId: datas.id,
        beginTime: datas.beginTime,
        endTime: datas.endTime,
      };

      let tempNormalTaskArray = [];
      let tempFileTaskArray = [];
      let tempLevelFourStageArray = [];

      _.map(datas.LevelThreeStages, (item2) => {

        if(item2.opened) {

          // opened状态的四级工作项
          tempLevelFourStageArray = _.concat(tempLevelFourStageArray, _.filter(item2.LevelFourStages, (o) => { return o.opened; }));

          _.map(item2.LevelFourStages, (item3) => {

            if(item3.opened) {

              tempJson.levelFourStageId = item3.id;

              // 通用任务
              _.map(item3.NormalTasks, (item4) => {

                // 去重
                let isAllownJoin = true;
                _.map(tempNormalTaskArray, (list) => {
                  if(list.id == item4.id) isAllownJoin = false;
                })

                if(isAllownJoin) {
                  let tempNormalTaskJson = {};

                  tempNormalTaskJson.id = item4.id;
                  tempNormalTaskJson.name = item4.name;
                  tempNormalTaskJson.createdAt = item4.createdAt;
                  tempNormalTaskJson.status = item4.status;
                  tempNormalTaskJson.levelThreeStageName = item2.name;
                  tempNormalTaskJson.levelFourStageName = item3.name;

                  tempNormalTaskArray.push(tempNormalTaskJson);
                }

              })

              // 文档任务
              _.map(item3.FileTasks, (item4) => {

                // 去重
                let isAllownJoin = true;
                _.map(tempFileTaskArray, (list) => {
                  if(list.id == item4.id) isAllownJoin = false;
                })

                let tempFileTaskJson = {};

                if(isAllownJoin) {
                  tempFileTaskJson.id = item4.id;
                  tempFileTaskJson.name = item4.name;
                  tempFileTaskJson.createdAt = item4.createdAt;
                  tempFileTaskJson.status = item4.status;
                  tempFileTaskJson.levelThreeStageName = item2.name;
                  tempFileTaskJson.levelFourStageName = item3.name;

                  tempFileTaskArray.push(tempFileTaskJson);
                }

              })

            } // item3.opened

          })

        } // item2.opened

      })

      tempJson.NormalTasks     = _.sortBy(tempNormalTaskArray, [(o) => { return -new Date(o.createdAt); }]);
      tempJson.FileTasks       = _.sortBy(tempFileTaskArray, [(o) => { return -new Date(o.createdAt); }]);
      tempJson.LevelFourStages = tempLevelFourStageArray; // 已过虑（opened）
      tempJson.OrginLevelTwoStages = datas; // 未过滤（原始状态）

      _self.setState({
        taskDatas: tempJson,
        loading: false
      });

    })
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    return (
      <Spin spinning={state.loading} style={{width:'100%',height:'100%',padding:5}}>
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
                    color = '#989898'; // 灰色
                    text  = '未激活';
                  break;
                  case 'active':
                    color = '#f50'; // 红色
                    text  = '进行中';
                  break;
                  case 'doing':
                    color = '#f50'; // 红色
                    text  = '进行中';
                  break;
                  case 'completed':
                    color = '#87d068'; // 绿色
                    text  = '已完成';
                  break;
                }

                let flag = (<Tooltip placement="left" title={text}><span style={{ color: color }}> ● </span></Tooltip>);

                return (
                  <li key={key} onClick={_self.handleShowNormalTask.bind(null, item)} title={item.name}>
                    {flag}
                    {item.name}
                    <span className={styles['remarks']}>（{item.levelThreeStageName+' / '+item.levelFourStageName}）</span>
                  </li>
                )
              })
            }
          </ul>
          <Button onClick={this.handleCreateNewTasks.bind(null, 'normal')} type="dashed" style={{marginTop:10}}><Icon type="plus" />创建通用任务</Button>
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
                    color = '#989898'; // 灰色
                    text  = '未激活';
                  break;
                  case 'active':
                    color = '#f50'; // 红色
                    text  = '进行中';
                  break;
                  case 'doing':
                    color = '#f50'; // 红色
                    text  = '进行中';
                  break;
                  case 'completed':
                    color = '#87d068'; // 绿色
                    text  = '已完成';
                  break;
                }

                let flag = (<Tooltip placement="left" title={text}><span style={{ color: color }}> ● </span></Tooltip>);

                return (
                  <li key={key} onClick={_self.handleShowFileTask.bind(null, item)} title={item.name}>
                    {flag}
                    {item.name}
                    <span className={styles['remarks']}>（{item.levelThreeStageName+' / '+item.levelFourStageName}）</span>
                  </li>
                )
              })
            }
          </ul>
          <Button onClick={this.handleCreateNewTasks.bind(null, 'file')} type="dashed" style={{marginTop:10}}><Icon type="plus" />创建文档任务</Button>
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

export default ShowTasksForLevelStage;