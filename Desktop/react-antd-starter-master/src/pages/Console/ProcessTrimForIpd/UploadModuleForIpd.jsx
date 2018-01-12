import React from 'react';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import {
  getAllUsers
} from '../../../services/api';

import { Upload, message, Modal, Spin, Icon, Button } from 'antd';

import styles from '../Common.less';

//ant
const Dragger = Upload.Dragger;

//main
let UploadModuleForIpd = React.createClass({
  getInitialState() {
    return {
      loading: true,
    };
  },
  handleRecordDocs(value) {
    let _self = this;

    let modal = Modal.success({
      title: 'dES提示',
      content: value.name + '上传成功！即将更新裁剪状态...',
    });

    setTimeout(() => {
      location.reload();
    }, 300)

  },
  handleLoading(value) {
    this.setState({ loading: value });
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    let projectId = Cookies.get('presentBelongProjectId');

    let presentOrigin = window.location.origin;
    switch(presentOrigin) {
      case 'http://127.0.0.1:8989':
        presentOrigin = 'http://127.0.0.1:8778';
      break;
      case 'http://staging.desp.cq-tct.com':
        presentOrigin = 'http://api.staging.desp.cq-tct.com';
      break;
      case 'http://desp.cq-tct.com':
        presentOrigin = 'http://desp.cq-tct.com';
      break;
    }

    //上传参数
    let params = {
      action: presentOrigin +'/api/projects/'+ projectId +'/upload-module',
      multiple: false,
      showUploadList: false,
      method: 'POST',
      headers: {
        'authorization': Cookies.get('authorization'),
      },
      async: true,
      crossDomain: true,
      onChange(info) {
        switch(info.file.status) {
          case 'error':
            message.error('【'+ info.file.name +'】上传文件失败，请重试！');
          break;
          case 'done':
            _self.handleRecordDocs(info.file);
          break;
        }
      },
      beforeUpload(info) {
        if(info.size > 1024*1024*10){
          return message.error(' 上传失败，文件大于10M');
        }
        message.loading('文件上传中...');
        _self.handleLoading(true);
      },
      data (info){
        // console.log('data', info)
      }
    };

    return (
      <div style={{width:'100%',height:'100%'}}>
        <div style={{ marginBottom:15 }}>
          <Dragger {...params}>
            <div style={{margin: '10px auto'}}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">点击或将文件拖拽到此区域上传</p>
              <p className="ant-upload-hint">上传前请再次确认所下载的IPD四级表格版本号和状态</p>
            </div>
          </Dragger>
        </div>
        <div>
          下载最新模板：<a target="_blank" href="http://wiki.desp.cq-tct.com/doku.php?id=过程域:过程域四级表格:过程域四级表格">下载最新ipd模板</a>
        </div>
      </div>
    );
  }
});

export default UploadModuleForIpd;