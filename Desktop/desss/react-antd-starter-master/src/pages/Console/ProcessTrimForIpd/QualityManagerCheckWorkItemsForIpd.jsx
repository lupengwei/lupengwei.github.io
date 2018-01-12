import React from 'react';
import { Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import {
  getProjectStagesForIpd,
  qpManagerCheckStageTrimForIpd,
  createCommentForWorkItems,
  modifyCommentByIdForWorkItems,
  deleteCommentByIdForWorkItems,
  getLevelOneStagesForIpd,
  getLevelOneStageDetailForIpd,
  getLevelTwoStageDetailForIpd,
  getLevelThreeStageDetailForIpd
} from '../../../services/api';

import { message, Spin, Icon, Button, Modal, Switch, Form, Input, DatePicker, Select, Popconfirm, Tooltip, Popover } from 'antd';

import styles from '../Common.less';

//ant
const FormItem = Form.Item;

//main
let QualityManagerCheckWorkItemsForIpd = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState() {
    return {
      visitType: this.props.visitType || null,
      loading: true,
      visible: false,
      subVisible: false,
      reloadChecked: 0, //检查渲染条件
      projectDatas: {
        users: []
      },
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
      selectModifyItem: {name: null, LevelComments: []}, // 当前选中的工作项添加审核意见
      selectModifyItemLevel: null, // 当前选中的工作项级别
      commentDatas: [],
      selectModifyCommentItem: {id: null}, // 当前选中的工作项审核意见
      commentContent: '', // 修改审核的意见
    };
  },
  componentDidMount() {
    this.handleShowLevelOneStage();
  },
  componentWillReceiveProps(nextProps) {
    if(this.props.visitType != nextProps.visitType) {
      this.setState({ visitType: nextProps.visitType });
    }
  },
  onChildChanged(newState){
    //监听子组件的状态变化
    this.setState({ reloadChecked: newState });
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
  showModal() {
    this.setState({ visible: true });
  },
  handleCancel(e) {
    this.setState({ visible: false });
  },
  handleSubCancel(e) {
    this.setState({ subVisible: false });
  },
  handleSubmit(params) {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("获取项目信息失败，尝试刷新页面重试！");

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      // 执行
      let datas = {};

      if(params == 'accept') {

        datas = {
          option: 'accept',
          managerSuggestion: formDatas.managerSuggestion
        };

      }else if(params == 'refuse') {

        if(!formDatas.managerSuggestion) return message.warning("请填写拒绝理由！");

        datas = {
          option: 'refuse',
          managerSuggestion: formDatas.managerSuggestion
        };
      }

      _self.setState({ loading: true, visible: false });

      qpManagerCheckStageTrimForIpd(projectId, JSON.stringify(datas)).then((res) => {
        
        let datas = res.jsonResult;
        if(datas.code < 0) return message.warning(datas.msg);

        Cookies.set('presentProjectStatus', datas.project.status); //重新赋值

        if(params == 'refuse') {
          //已拒绝
          message.success("审核成功，准备回退至上一步！");
          setTimeout(function(){
            _self.context.router.push('/console/projects/workItemsTrimForIpd');
          }, 500)

        }else {
          //通过
          message.success("审核成功，准备跳转至下一步！");
          setTimeout(function(){
            _self.context.router.push('/console/projects/checkWorkItemsForIpd');
          }, 500)
        }

      })

    })
  },
  handleTips(datas) {
    message.warning(datas);
  },
  createLevelStageComment(values, level) {
    this.setState({
      subVisible: true,
      selectModifyItem: values,
      selectModifyItemLevel: level,
    });
  },
  handleSubmitComments() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.error("请先选择您参与的项目部或部门");

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      let tempId = _self.state.selectModifyItem.id;
      let datas;

      if(!formDatas.comments) return message.warning("请完善审核意见！");
      if(!tempId) return message.warning("获取待审核工作项失败，请重试！");

      switch(_self.state.selectModifyItemLevel) {
        case '2级':
          datas = {
            levelTwoStageId: tempId,
            content: formDatas.comments,
            projectId: projectId
          };
        break;
        case '3级':
          datas = {
            levelThreeStageId: tempId,
            content: formDatas.comments,
            projectId: projectId
          };
        break;
        case '4级':
          datas = {
            levelFourStageId: tempId,
            content: formDatas.comments,
            projectId: projectId
          };
        break;
      }

      createCommentForWorkItems(JSON.stringify(datas)).then((res) => {
        message.success("添加审核意见成功，数据更新中...");
        _self.setState({ subVisible: false });
        _self.handleUpdateStage();
        _self.props.form.resetFields();
      })
    })
  },
  handleDeleteCommentById(value) {
    let _self = this;

    if(!value) return message.warning("获取意见记录失败！");

    deleteCommentByIdForWorkItems(value.id).then((res) => {
      message.success("删除审核意见成功，数据更新中...");
      _self.handleUpdateStage();
    })
  },
  handleChangeComment(e) {
    this.setState({
      commentContent: e.target.value
    });
  },
  handleShowLevelComment() {
    // 显示日志
    let url = '/#/show/ipd/qp-check-items';
    window.open(url,'','scrollbars=no,status=no,resizable=no,location=no');
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    };

    return (
      <div className={styles['ipd-container']}>

        <div className={styles['ipd-item-container']}>
          <div className={styles['ipd-item-header']}>一级工作项</div>
          <Spin spinning={state.loading}>
            <div className={styles['ipd-subitem-container']}>
              <Button onClick={this.showModal} style={{width:'100%',marginBottom:5,background:'#F4823C',color:'#FFF'}} type="default">立即审核</Button>
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
                  {
                    _.size(state.levelTwoDatas) > 0 ?
                      <ul>
                        {
                          _.map(state.levelTwoDatas, (item, key) => {
                            let contentHTML = (
                              <div style={{maxWidth:400}}>
                                <p><span className="text-gray">名称：</span>{item.name}</p>
                                <p><span className="text-gray">负责人：</span>{item.Master ? item.Master.name : '...'}</p>
                                <p><span className="text-gray">开始时间：</span>{moment(item.beginTime).format('YYYY-MM-DD')}</p>
                                <p><span className="text-gray">结束时间：</span>{moment(item.endTime).format('YYYY-MM-DD')}</p>
                                <p><span className="text-gray">备注：</span>{item.closeComment || '-'}</p>
                              </div>
                            );
                            return (
                              <li key={key} onClick={this.handleShowLevelThreeStage.bind(null, item)}>
                                <div style={{width:'10%', float:'left'}} className={styles['ipd-modify-icon-left']}>
                                  <Tooltip title="审核工作项" placement="top">
                                    <span onClick={this.createLevelStageComment.bind(null, item, '2级')}>
                                      <Icon type="edit" style={{marginRight:5}}/>
                                    </span>
                                  </Tooltip>
                                </div>
                                <div style={{width:'90%', float:'left'}} className={styles['ipd-sub-container-box']}>
                                  {
                                    item.opened ?
                                      <Tooltip title="已启用" placement="top"><Icon type="check-circle" style={{color:'#77CA56'}} /></Tooltip>
                                    :
                                      <Tooltip title="已关闭" placement="top"><Icon type="minus-circle" style={{color:'#CCC'}} /></Tooltip>
                                  }
                                  &nbsp;
                                  {/* 匹配成功 且 已激活 */
                                    item.id == state.selectedLevelTwoStage.id ?
                                      <span style={{color:'#56ABEF'}}>
                                        <Popover content={contentHTML}>
                                          <span className="ipd-text-trim">{item.name}</span>
                                        </Popover>
                                        <Icon className={styles['ipd-list-icon']} type="caret-right" />
                                      </span>
                                    :
                                      <Popover content={contentHTML}>
                                        <span>{item.name}</span>
                                      </Popover>
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
                  {
                    _.size(state.levelThreeDatas) > 0 ?
                      <ul>
                        {
                          _.map(state.levelThreeDatas, (item, key) => {
                            let contentHTML = (
                              <div style={{maxWidth:400}}>
                                <p><span className="text-gray">名称：</span>{item.name}</p>
                                <p><span className="text-gray">负责人：</span>{item.Master ? item.Master.name : '...'}</p>
                                <p><span className="text-gray">结束时间：</span>{moment(item.endTime).format('YYYY-MM-DD')}</p>
                                <p><span className="text-gray">备注：</span>{item.closeComment || '-'}</p>
                              </div>
                            );
                            return (
                              <li key={key} onClick={this.handleShowLevelFourStage.bind(null, item)}>
                                <div style={{width:'10%', float:'left'}} className={styles['ipd-modify-icon-left']}>
                                  <Tooltip title="审核工作项" placement="top">
                                    <span onClick={this.createLevelStageComment.bind(null, item, '3级')}>
                                      <Icon type="edit" style={{marginRight:5}}/>
                                    </span>
                                  </Tooltip>
                                </div>
                                <div style={{width:'90%', float:'left'}} className={styles['ipd-sub-container-box']}>
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
                                        <Popover content={contentHTML}>
                                          <span className="ipd-text-trim">
                                            {item.name}
                                            {item.isNew ? <span className="text-danger">（新）</span> : null}
                                          </span>
                                        </Popover>
                                        <Icon className={styles['ipd-list-icon']} type="caret-right" />
                                      </span>
                                    :
                                      <Popover content={contentHTML}>
                                        <span>
                                          {item.name}
                                          {item.isNew ? <span className="text-danger">（新）</span> : null}
                                        </span>
                                      </Popover>
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
                  {
                    _.size(state.levelFourDatas) > 0 ?
                      <ul>
                        {
                          _.map(state.levelFourDatas, (item, key) => {
                            let contentHTML = (
                              <div style={{maxWidth:400}}>
                                <p><span className="text-gray">名称：</span>{item.name}</p>
                                <p><span className="text-gray">负责人：</span>{item.Master ? item.Master.name : '...'}</p>
                                <p><span className="text-gray">备注：</span>{item.closeComment || '-'}</p>
                              </div>
                            );
                            return (
                              <li key={key}>
                                <div style={{width:'10%', float:'left'}} className={styles['ipd-modify-icon-left']}>
                                  <Tooltip title="审核工作项" placement="top">
                                    <span onClick={this.createLevelStageComment.bind(null, item, '4级')}>
                                      <Icon type="edit" style={{marginRight:5}}/>
                                    </span>
                                  </Tooltip>
                                </div>
                                <div style={{width:'90%', float:'left'}} className={styles['ipd-sub-container-box']}>
                                  {
                                    item.opened ?
                                      <Tooltip title="已启用" placement="top"><Icon type="check-circle" style={{color:'#77CA56'}} /></Tooltip>
                                    :
                                      <Tooltip title="已关闭" placement="top"><Icon type="minus-circle" style={{color:'#CCC'}} /></Tooltip>
                                  }
                                  &nbsp;
                                  <span className="ipd-text-trim" style={{cursor: 'auto'}}>
                                    <Popover content={contentHTML}>
                                      <span>
                                        {item.name}
                                        {item.isNew ? <span className="text-danger">（新）</span> : null}
                                      </span>
                                    </Popover>
                                  </span>
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
            </div>
          :
            null
        }

        <div style={{width:15,height:'inherit'}}></div>

        <Modal
          title="安质部审核IPD流程裁剪"
          visible={state.visible}
          onCancel={this.handleCancel}
          footer=""
        >

          {/* 预览模式 */
            state.visitType == 'onlyView' ?
              <div className="no-content-tips text-warning" style={{margin:15}}><Icon type="exclamation-circle" /> 预览模式，无法进行操作！</div>
            :
              <Form horizontal form={props.form}>
                <FormItem
                  label="审核意见"
                  {...formItemLayout}
                >
                  <Input type="textarea" rows={4} {...getFieldProps('managerSuggestion', {rules: [{message: '请输入审核意见' }]})} placeholder="请输入审核意见（默认为同意）" />
                </FormItem>
                <FormItem style={{ marginTop:24, textAlign:'center' }}>
                  <Popconfirm title="确定要提交该信息吗？" onConfirm={this.handleSubmit.bind(null, 'refuse')}>
                    <Button type="dashed">拒绝</Button>
                  </Popconfirm>
                  <Popconfirm title="确定要提交该信息吗？" onConfirm={this.handleSubmit.bind(null, 'accept')}>
                    <Button type="primary" style={{marginLeft:15}}>同意</Button>
                  </Popconfirm>
                </FormItem>
              </Form>
          }

          <div style={{marginBottom:5,textAlign:'center'}}>
            <span className="text-gray">审核意见列表</span>
            <Link target="_blank" to="/show/ipd/qp-check-items">
              <span className="text-info" onClick={this.handleShowLevelComment}> 查看详情</span>
            </Link>
          </div>

        </Modal>

        {/* 新增意见 */
          state.subVisible ?
            <Modal
              visible={state.subVisible}
              title={<span>添加审核意见 <span style={{fontSize:12,color:'#CCC'}}>- {state.selectModifyItem.name}</span></span>}
              onCancel={this.handleSubCancel}
              footer=""
            >

              {/* 预览模式 */
                state.visitType == 'onlyView' ?
                  <div className="no-content-tips text-warning" style={{margin:15}}><Icon type="exclamation-circle" /> 预览模式，无法进行操作！</div>
                :
                  <Form horizontal form={props.form}>
                    <FormItem
                      label="审核意见"
                      {...formItemLayout}
                    >
                      <Input type="textarea" rows={4} {...getFieldProps('comments', {rules: [{required: true, message: '请审核意见' }]})} placeholder="请输入审核意见" />
                    </FormItem>
                    <FormItem style={{ marginTop:24, textAlign:'center' }}>
                      <Popconfirm title="确定要提交该信息吗？" onConfirm={this.handleSubmitComments}>
                        <Button type="primary" style={{marginLeft:15}}>提交意见</Button>
                      </Popconfirm>
                    </FormItem>
                  </Form>
              }

              {
                _.size(state.selectModifyItem.LevelComments) == 0 ?
                  <div className="text-gray"><center>该工作项暂无审核历史记录</center></div>
                :
                  <div><b>审核意见列表：</b></div>
              }
              <ul>
                {
                  _.map(state.selectModifyItem.LevelComments, (item, key) => {
                    return (
                      <li key={key} style={{padding:5}}>{key+1}、{item.content}</li>
                    )
                  })
                }
              </ul>
            </Modal>
          :
            null
        }

      </div>
    );
  }
});

QualityManagerCheckWorkItemsForIpd = Form.create()(QualityManagerCheckWorkItemsForIpd);

export default QualityManagerCheckWorkItemsForIpd;
