import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import Cookies from 'js-cookie';
import QueueAnim from 'rc-queue-anim';

import { getTasksToMine } from '../../services/api';

import { Menu, Icon, message, Spin, Button, Badge, Tabs, Tooltip } from 'antd';

import MainLayout from '../../layouts/MainLayout/MainLayout';
import Welcome from './Welcome';
import NormalTaskDetail from './Components/NormalTaskDetail';
import FileTaskDetail from './Components/FileTaskDetail';
import ShowMeetDetail from './Components/ShowMeetDetail';
import Warning from '../Common/Warning';

import styles from './Common.less';

// ant
const TabPane = Tabs.TabPane;

// main
class TaskCenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      reloadRootChecked: 0, //检查渲染条件
      selectedType: 'running', // 当前选择的状态类型（running，next，delayed，completed）
      counts: {
        doing: 0,
        active: 0,
        delayed: 0,
        completed: 0
      },
      orginTaskDatas: {}, // 原数据
      taskData: {
        normals: [],
        files: [],
        meets: []
      },
      taskDetail: <Welcome />
    };
  };

  componentWillMount() {
    this.handleGetTaskToMine();
  };

  componentWillUpdate(nextProps, nextState){
    //更新组件
    if(nextState.reloadRootChecked != this.state.reloadRootChecked) this.handleGetTaskToMine();
  };

  onChildChangedForRoot(newState){
    //监听子组件的状态变化
    this.setState({ reloadRootChecked: newState });
  };

  // 获取自己的任务（新）
  handleGetTaskToMine() {
    let _self = this;
    getTasksToMine("all", "all").then((res) => {

      let datas = {
        normalTasks: {
          active: [],
          doing: [],
          delay: [],
          completed: [],
          ...res.jsonResult.tasks.normalTasks
        },
        fileTasks: {
          active: [],
          doing: [],
          delay: [],
          completed: [],
          ...res.jsonResult.tasks.fileTasks
        },
        conferences: {
          normal: [],
          auditing: [],
          approved: [],
          ...res.jsonResult.tasks.conferences
        }
      };

      /**
       * 会议（normal，auditing；approved）分别放在进行中和已完成
       */

      let tempCounts = {
        doing: datas.normalTasks.doing.length + datas.fileTasks.doing.length + datas.conferences.normal.length +  datas.conferences.auditing.length,
        active: datas.normalTasks.active.length + datas.fileTasks.active.length,
        delayed: datas.normalTasks.delay.length + datas.fileTasks.delay.length,
        completed: datas.normalTasks.completed.length + datas.fileTasks.completed.length + datas.conferences.approved.length
      };

      _self.setState({
        counts: tempCounts,
        orginTaskDatas: datas,
        loading: false
      });

      _self.handleFilterTasks(_self.state.selectedType); // 过滤初始状态数据

    })
  };

  // 菜单
  handleMenuClick(e) {
    let tempMenuKey = e.key;
    // 切换大类时，详情关闭
    if(this.state.selectedType != tempMenuKey) {
      this.setState({
        selectedType: tempMenuKey,
        taskDetail: <Welcome />
      });
    }else {
      this.setState({ selectedType: tempMenuKey });
    }
    this.handleFilterTasks(tempMenuKey);
  };

  // 过滤选择的不同类型任务
  handleFilterTasks(type) {
    let tempDatas = this.state.orginTaskDatas;
    let tempJson;

    switch (type) {
      case 'running':
        tempJson = {
          normals: tempDatas.normalTasks.doing,
          files: tempDatas.fileTasks.doing,
          meets: tempDatas.conferences.normal.concat(tempDatas.conferences.auditing)
        };
      break;
      case 'next':
        tempJson = {
          normals: tempDatas.normalTasks.active,
          files: tempDatas.fileTasks.active,
          meets: []
        };
      break;
      case 'delayed':
        tempJson = {
          normals: tempDatas.normalTasks.delay,
          files: tempDatas.fileTasks.delay,
          meets: []
        };
      break;
      case 'completed':
        tempJson = {
          normals: tempDatas.normalTasks.completed,
          files: tempDatas.fileTasks.completed,
          meets: tempDatas.conferences.approved
        };
      break;
    }

    this.setState({ taskData: tempJson });
  };

  // 任务详情
  handleShowDetail(type, taskId) {
    let _self = this;
    switch(type){
      case 'normal':
        _self.setState({
          taskDetail: <NormalTaskDetail taskId={taskId} type={_self.state.selectedType} callbackParent={_self.onChildChangedForRoot.bind(_self)} initialChecked={_self.state.reloadRootChecked} />
        });
      break;
      case 'file':
        _self.setState({
          taskDetail: <FileTaskDetail taskId={taskId} type={_self.state.selectedType} callbackParent={_self.onChildChangedForRoot.bind(_self)} initialChecked={_self.state.reloadRootChecked} />
        });
      break;
      case 'meet':
        _self.setState({
          taskDetail: <ShowMeetDetail meetid={taskId} type={_self.state.selectedType} callbackParent={_self.onChildChangedForRoot.bind(_self)} initialChecked={_self.state.reloadRootChecked} />
        });
      break;
    }
  };

  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    if(state.loading) return <Warning datas="数据加载中，请稍等" />;

    //jsx的循环列表中不能直接绑定事件，需用变量过渡
    let normalArray = [];
    let fileArray   = []
    let meetArray   = [];
    let subComponents = '';

    // 通用任务
    if(_.size(state.taskData.normals) == 0){
      normalArray.push(<li key="0"><center className="text-gray">暂无通用型任务</center></li>);
    }else {
      _.map(state.taskData.normals, function(item, key){
        normalArray.push(<li key={key} title={item.name} onClick={_self.handleShowDetail.bind(_self,'normal', item.id)}>
            {item.conferenceTaskId ? <Tooltip placement="top" title="会议"><Icon type="team" /></Tooltip> : null}&nbsp;
            {item.isDefault || item.conferenceTaskId || item.fromDoubleWeekPlan || item.paymentTypeItemId ? null : <span className="text-danger">(新) </span>}
            {item.fromDoubleWeekPlan ? <span className="text-primary"> (双) </span> : null}
            {item.paymentTypeItemId ? <span className="text-success"> (商) </span> : null}
            {item.name}
          </li>);
      });
    }

    // 文档任务
    if(_.size(state.taskData.files) == 0){
      fileArray.push(<li key="0"><center className="text-gray">暂无文件型任务</center></li>);
    }else {
      _.map(state.taskData.files, function(item, key){
        fileArray.push(<li key={key} title={item.name} onClick={_self.handleShowDetail.bind(_self,'file', item.id)}>
            {item.conferenceTaskId ? <Tooltip placement="top" title="会议"><Icon type="team" /></Tooltip> : null}&nbsp;
            {item.isDefault || item.conferenceTaskId || item.fromDoubleWeekPlan ? null : <span className="text-danger">(新) </span>}
            {item.name}
          </li>);
      });
    }

    // 会议任务
    if(_.size(state.taskData.meets) == 0){
      meetArray.push(<li key="0"><center className="text-gray">暂无会议型任务</center></li>);
    }else {
      _.map(state.taskData.meets, function(item, key){
        meetArray.push(<li key={key} title={item.title} onClick={_self.handleShowDetail.bind(_self,'meet', item.id)}>{item.title}</li>);
      });
    }

    return (
      <MainLayout>
        <div style={{ height: '100%' }}>
          <QueueAnim delay={300} type="left" className={styles["menu-left-bar"]}>
            <Menu key="a" onClick={this.handleMenuClick.bind(this)}
              style={{ borderRight:0,padding:0 }}
              selectedKeys={[state.selectedType]}
              mode="inline"
              theme="light"
            >
              <Menu.Item key="running">
                <Icon type="unlock" />进行中 <Badge count={state.counts.doing} className="pull-right" style={{marginTop:12,boxShadow:'0 0'}}></Badge>
              </Menu.Item>
              <Menu.Item key="next">
                <Icon type="bars" />下一步 <Badge count={state.counts.active} className="pull-right" style={{marginTop:12,boxShadow:'0 0'}}></Badge>
              </Menu.Item>
              <Menu.Item key="delayed">
                <Icon type="clock-circle-o" />已延期 <Badge count={state.counts.delayed} className="pull-right" style={{marginTop:12,boxShadow:'0 0'}}></Badge>
              </Menu.Item>
              <Menu.Item key="completed">
                <Icon type="lock" />已完成 <Badge count={state.counts.completed} className="pull-right" style={{marginTop:12,boxShadow:'0 0'}}></Badge>
              </Menu.Item>
            </Menu>
          </QueueAnim>
          <div className={styles["working-container"]}>
            <div className={styles['working-container-sub-main']}>
              <div className={styles['working-container-sub-left']}>
                <Spin spinning={state.loading} size="large">
                  <Tabs defaultActiveKey="1" size="small">
                    <TabPane tab="通用型" key="1">
                      <div className={styles['text-list']}>
                        <QueueAnim component="ul" key="li" interval={5}>
                        { normalArray }
                        </QueueAnim>
                      </div>
                    </TabPane>
                    <TabPane tab="文档型" key="2">
                      <div className={styles['text-list']}>
                        <QueueAnim component="ul" key="li" interval={5}>
                        { fileArray }
                        </QueueAnim>
                      </div>
                    </TabPane>
                    <TabPane tab="会议型" key="3">
                      <div className={styles['text-list']}>
                        <QueueAnim component="ul" key="li" interval={5}>
                        { meetArray }
                        </QueueAnim>
                      </div>
                    </TabPane>
                  </Tabs>
                </Spin>
              </div>
              <div className={styles['working-container-sub-right']}>
                { state.taskDetail }
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
};

export default TaskCenter;
