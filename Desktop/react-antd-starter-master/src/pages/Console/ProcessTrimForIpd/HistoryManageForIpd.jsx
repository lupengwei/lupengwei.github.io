import React from 'react';
import { Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import {
  getHistoriesForIpd,
  updateHistoryForIpd,
  getHistoryForIpd
} from '../../../services/api';

import { Spin, Timeline, Modal, Form, Input, Popconfirm, Button, message } from 'antd';

import styles from '../Common.less';

import Warning from '../../Common/Warning';

// ant
const FormItem = Form.Item;

// main
let HistoryManageForIpd = React.createClass({
  getInitialState() {
    return {
      loading: true,
      visible: false,
      historyDatas: [],
      presentSelectedVersion: null, // 当前选中将要修改的版本
    };
  },
  componentDidMount() {
    this.showProcessStageHistories();
  },
  showProcessStageHistories() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');

    getHistoriesForIpd(projectId).then((res) => {
      let datas = res.jsonResult.project;

      _self.setState({
        loading: false,
        historyDatas: _.sortBy(datas.StageCutHistories, (o) => { return -o.createdAt })
      });
    })
  },
  showModal(versionId) {
    this.setState({
      visible: true,
      presentSelectedVersion: versionId
    });
  },
  handleCancel(e) {
    this.setState({ visible: false });
  },
  handleSubmit() {
    let _self = this;

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      let datas = {
        title: formDatas.title,
        version: formDatas.version,
        number: formDatas.number
      };

      let tempVersion = _self.state.presentSelectedVersion;

      if(!tempVersion) return message.warning("获取当前修改版本信息失败，请重试！");
      if(!datas.title || !datas.version || !datas.number) return message.warning("请完善填写信息，一个也不能少！");

      updateHistoryForIpd(tempVersion, JSON.stringify(datas)).then((res) => {
        if(res.jsonResult.msg == 'ok') {
          message.success("修改签署页信息成功！");
          _self.setState({ visible: false });
          _self.showProcessStageHistories();
        }else {
          message.error("修改签署页信息失败！");
        }
      })

    })
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    const { getFieldProps } = props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    };

    // 检查当前人员是否为项目经理
    let isProjectManger = Cookies.get('presentUserRolesOfProject') == '项目经理' ? true : false;

    return (
      <Spin spinning={state.loading}>
        {
          _.size(state.historyDatas) == 0 ?
            <center>暂无历史版本</center>
          :
            null
        }
        <Timeline>
          {
            _.map(state.historyDatas, (item, key) => {
              return (
                <Timeline.Item key={key}>
                  <div>
                    <span className="text-gray">{moment(item.createdAt).format('YYYY-MM-DD')}</span>
                    <span style={{paddingLeft: 10}}>发布版本：</span>
                    <Link to={"/show/ipd/version/"+ item.id +"/detail"} target="_blank">{item.version || '查看版本详情'}</Link>
                    {
                      !item.number || !item.version ?
                        <div className="text-gray" style={{paddingTop:10}}>目前尚未完善签署页信息，
                          {
                            isProjectManger ?
                              <a onClick={this.showModal.bind(null, item.id)}>点击完善信息</a>
                            :
                              "通知项目经理完善信息！"
                          }
                        </div>
                      :
                        <div style={{paddingTop:10}}>
                          <Button type="dashed" size="small"><Link to={"/show/ipd/version/"+ item.id +"/signCover"} target="_blank">查看签署页</Link></Button>
                          <Button type="dashed" size="small" style={{marginLeft: 15}}><Link to={"/show/ipd/version/"+ item.id +"/recordSheet"} target="_blank">查看记录单</Link></Button>
                        </div>
                    }
                  </div>
                </Timeline.Item>
              )
            })
          }
        </Timeline>

        {/* 填写裁剪清单 */}
        <Modal
          visible={state.visible}
          title={<span>完善ipd裁剪版本信息</span>}
          onCancel={this.handleCancel}
          footer=""
        >
          <Form horizontal form={props.form}>
            <FormItem
              label="签署页标题"
              {...formItemLayout}
            >
              <Input {...getFieldProps('title', {rules: [{required: true, message: '三级签署页标题' }]})} placeholder="请输入三级签署页标题" />
            </FormItem>
            <FormItem
              label="版本号"
              {...formItemLayout}
            >
              <Input {...getFieldProps('version', {rules: [{required: true, message: '版本号' }]})} placeholder="请输入版本号" />
            </FormItem>
            <FormItem
              label="文件编号"
              {...formItemLayout}
            >
              <Input {...getFieldProps('number', {rules: [{required: true, message: '文件编号' }]})} placeholder="请输入文件编号" />
            </FormItem>
            <FormItem style={{ marginTop:24, textAlign:'center' }}>
              <Popconfirm title="确定要提交该信息吗？" onConfirm={this.handleSubmit}>
                <Button type="primary" style={{marginLeft:15}}>提交信息</Button>
              </Popconfirm>
            </FormItem>
          </Form>
        </Modal>

      </Spin>
    )
  }
});

HistoryManageForIpd = Form.create()(HistoryManageForIpd);

export default HistoryManageForIpd;