import React from 'react';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import Cookies from 'js-cookie';

import { getProjectStage, bjQPCheckStageTask, bjQPRefuseCutStage } from '../../../services/api';

import { message, Icon, Select, Button, Row, Col, Spin, Collapse, Popconfirm, Modal, Input } from 'antd';

import styles from '../Common.less';

//ant
const Panel  = Collapse.Panel;

//main
let CheckStageTask = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      loading: false,
      visible: false,
      projectId: Cookies.get('presentBelongProjectId'),
      formDatas: {},
      refusedMsg: ''
    };
  },
  componentDidMount: function() {
    this.getProjectStage();
  },
  getProjectStage: function(){
    var _self = this;
    _self.setState({ loading: true });
    getProjectStage(this.state.projectId).then(function(res){
      _self.setState({ formDatas: res.jsonResult.StageNewItems, loading: false });
    });
  },
  qpConfirmCutStage: function(type){
    let _self = this;

    if(!this.state.projectId) return message.error("请先选择将要配置的项目", 2);

    if(type == 'accept'){
      bjQPCheckStageTask(this.state.projectId).then(function(res){
        setTimeout(function(){
          //编制文件清单
          _self.context.router.push('/console/projects/editFileList');
        }, 1000);
      });
    }else if(type == 'refused'){
      if(!this.state.refusedMsg) return message.error("请输入拒绝理由", 2);
      
      var datas = { qpSuggestion: this.state.refusedMsg };

      bjQPRefuseCutStage(this.state.projectId, JSON.stringify(datas)).then(function(res){
        setTimeout(function(){
          //拒绝 重新回到裁剪阶段
          _self.context.router.push('/console/projects/cutStage');
        }, 1000);
        _self.setState({ visible: false });
      });
    }
  },
  showModal: function(){
    this.setState({ visible: true });
  },
  handleCancel: function(e){
    this.setState({ visible: false });
  },
  changeRefused: function(e){
    console.log(e.target.value);
    this.setState({refusedMsg: e.target.value});
  },
  render: function() {
    var props = this.props,
        state = this.state,
        _self = this;

    return (
      <Spin spinning={state.loading}>
        <div style={{padding:15}}>当前审核项目：{Cookies.get('presentBelongProjectName')}</div>
        <Collapse defaultActiveKey={['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14']}>
          {
            _.map(state.formDatas, function(item1, key1){
              return (
                  <Panel header={item1.name} key={key1}>
                    <div className={styles['desp-collapse']}>
                      <ul>
                        {
                          _.size(item1.DefaultTasks) > 0 ?
                            _.map(item1.DefaultTasks, function(item2, key2){
                              return (
                                  <li key={key2}>{key2+1}、{item2.name}</li>
                                )
                            })
                          :
                            <div className={styles['no-content-tips']}>本阶段暂无关联任务</div>
                        }
                      </ul>
                    </div>
                  </Panel>
                )
            })
          }
        </Collapse>

        <div style={{width:'100%',margin:'15px auto',textAlign:'center'}}>
          <Popconfirm title="确认当前的阶段划分吗？" onConfirm={this.qpConfirmCutStage.bind(null, 'accept')}>
            <Button type="primary">同意项目划分阶段</Button>
          </Popconfirm>
          <Button type="dashed" style={{marginLeft:15}} onClick={this.showModal}>拒绝</Button>
        </div>

        <Modal title="拒绝项目划分" visible={this.state.visible}
          onOk={this.qpConfirmCutStage.bind(null, 'refused')} onCancel={this.handleCancel}
        >
          <Input placeholder="输入拒绝理由" onChange={this.changeRefused}/>
        </Modal>

      </Spin>
    );
  }
});

export default CheckStageTask;