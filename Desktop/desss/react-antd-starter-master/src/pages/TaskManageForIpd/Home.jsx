import React from 'react';
import _ from 'lodash';
import Cookies from 'js-cookie';
import QueueAnim from 'rc-queue-anim';

import { Spin, Icon, message, Tabs, Select } from 'antd';
import { Link } from 'react-router';

import {
  getProjectStagesForIpd,
  getLevelOneStagesForIpd,
  getLevelOneStageDetailForIpd
} from '../../services/api';

import MainLayout from '../../layouts/MainLayout/MainLayout';
import Welcome from './Welcome';
import Warning from '../Common/Warning';
import ShowTasksForLevelStage from './ShowTasksForLevelStage';

import styles from './Common.less';

//ant初始组件
const TabPane = Tabs.TabPane;
const Option = Select.Option;

//main
const Projects = React.createClass({
  getInitialState() {
    return {
      loading: true,
      subLoading: false,
      reloadChecked: 0, //检查渲染条件
      levelOneStageDatas: [], // 一级工作项数据
      levelTwoStageDatas: [], // 一级工作项数据
      selectedLevelOneStage: {id: ''},
      selectedLevelTwoStage: {id: ''},
    };
  },
  componentDidMount() {
    this.showProjectStageInfo();
  },
  componentWillUpdate(nextProps, nextState) {
    //更新组件
    if(nextState.reloadChecked != this.state.reloadChecked) {
      console.log('更新...')
    }
  },
  onChildChanged(newState) {
    //监听子组件的状态变化
    this.setState({ reloadChecked: newState });
  },
  showProjectStageInfo() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("若需配置项目，请先选择将要配置的组织");

    getLevelOneStagesForIpd(projectId).then((res) => {
      let datas = res.jsonResult.project;

      _self.setState({
        levelOneStageDatas: _.sortBy(datas.LevelOneStages, (o) => {return parseInt(o.code);}), // code排序
        loading: false
      });
    })
  },
  handleSelectedLevelOneStage(levelOneStage) {
    // 选择一级工作项，并过滤出二级工作项
    let _self = this;
    _self.setState({ subLoading: true });
    getLevelOneStageDetailForIpd(levelOneStage.id).then((res) => {
      let datas = res.jsonResult.levelOneStage.LevelTwoStages;

      // 筛选出已启用的二级工作项
      let tempArray = [];
      datas.map((item) => {
        if(item.opened) tempArray.push(item);
      })

      // 排序
      tempArray = _.sortBy(tempArray, function(o) {return o.index;});

      if(levelOneStage.id != _self.state.selectedLevelOneStage.id) {
        // 切换一级工作项
        _self.setState({
          selectedLevelOneStage: levelOneStage,
          levelTwoStageDatas: tempArray,
          selectedLevelTwoStage: {id: ''},
          subLoading: false
        });
      }else {
        _self.setState({
          levelTwoStageDatas: tempArray,
          selectedLevelOneStage: levelOneStage,
          subLoading: false
        });
      }

    })
  },
  handleSelectedLevelTwoStage(tempItem) {
    // 输出二级工作项
    this.setState({ selectedLevelTwoStage: tempItem });
  },
  handleClosedFilter() {
    this.setState({ isClosedFilter: !this.state.isClosedFilter });
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    let loadingHTML = (<center style={{margin:'15px 0'}}><Icon type="loading" /> 加载中...</center>);

    return (
      <MainLayout>
        <div className={styles['task-container']}>
          <div className={styles['task-left-content']}>
            <div className={styles['task-level-one-item-header']}>一级工作项</div>
            {
              state.loading ?
                loadingHTML
              :
                <div>
                  { _.size(state.levelOneStageDatas) == 0 ? <div className={styles['no-content-tips']}><Icon type="frown" /> 暂无一级工作项</div> : null }
                </div>
            }
            <ul className={styles['task-lists']}>
              {
                _.map(state.levelOneStageDatas, (item, key) => {
                  return (
                    <li key={key} onClick={_self.handleSelectedLevelOneStage.bind(null, item)} title={item.name}>
                      {
                        item.id == state.selectedLevelOneStage.id ?
                          <span style={{color:'#56ABEF'}}>
                            {item.name}
                            <Icon className={styles['task-active-list-icon']} type="caret-right" />
                          </span>
                        :
                          item.name
                      }
                    </li>
                  )
                })
              }
            </ul>
          </div>

          {
            state.selectedLevelOneStage.id ?
              <div className={styles['task-left-content']}>
                <div className={styles['task-level-one-item-header']}>二级工作项</div>
                { 
                  state.subLoading ?
                    loadingHTML
                  :
                    <div>
                      { _.size(state.levelTwoStageDatas) == 0 ? <div className={styles['no-content-tips']}>暂无可选工作项</div> : null }
                    </div>
                }

                <ul className={styles['task-lists']}>
                  {
                    _.map(state.levelTwoStageDatas, (item, key) => {
                      return (
                        <li key={key} onClick={_self.handleSelectedLevelTwoStage.bind(null, item)} title={item.name}>
                          {
                            item.id == state.selectedLevelTwoStage.id ?
                              <div style={{color:'#56ABEF'}}>
                                {item.name}
                                <Icon className={styles['task-active-list-icon']} type="caret-right" />
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
            :
              null
          }

          <div className={styles['task-right-content']} style={{width: state.selectedLevelOneStage.id ? '60%' : '80%'}}>
            {/* 已选择一级工作项 */
              state.selectedLevelOneStage.id ?
                <div style={{width:'100%',height:'100%'}}>
                  {
                    state.selectedLevelTwoStage.id ?
                      <div>
                        <ShowTasksForLevelStage key="a" levelTwoStageId={state.selectedLevelTwoStage.id} />
                      </div>
                    :
                      <Welcome datas="请先选择二级工作项！" />
                  }

                </div>
              :
                <Welcome datas="请选择左侧工作项信息！" />
            }
          </div>
        </div>
      </MainLayout>
    );
  }
});

export default Projects;
