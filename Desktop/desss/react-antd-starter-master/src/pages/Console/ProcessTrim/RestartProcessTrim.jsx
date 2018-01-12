import React from 'react';
import { Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import {
	showProject,
	getQiniuToken,
	restartProcessTrim,
	showAllChangeLogsByType
} from '../../../services/api';

import { message, Icon, Form, Button, Row, Col, Spin, Input, Popconfirm, Upload, Alert, Table } from 'antd';

import styles from '../Common.less';

//ant
const FormItem = Form.Item;

//main
let RestartProcessTrim = React.createClass({
	contextTypes: {
    router: React.PropTypes.object
  },
	getInitialState() {
		return {
			loading: true,
			isSubmit: false,
			qiniuToken: '',
			fileUrl: '',
			logDatas: [],
		}
	},
	componentDidMount() {
		this.getQiniuToken();
		this.showLastChangeCutStagesInfo();
	},
	getUsersOfProject(){
    let projectId = Cookies.get('presentBelongProjectId'),
        _self     = this,
        children  = []; //用于中转复制，直接赋值重新渲染会有Select key重复警告

    showProject(projectId).then((res) => {
      let datas = res.jsonResult.project;
	    Cookies.set('presentProjectStatus', datas.status);
    });
  },
	getQiniuToken() {
    let _self = this;
    getQiniuToken('desp-files').then(function(res) {
      _self.setState({ qiniuToken: res.jsonResult.token, loading: false });
    });
  },
  showLastChangeCutStagesInfo() {
  	let projectId = Cookies.get('presentBelongProjectId'),
        _self     = this;

    showAllChangeLogsByType(projectId, '流程裁剪变更').then((res) => {
			let datas = res.jsonResult.logs;
			let tempArray = [];

			datas.map((item, key) => {
				let tempJson = {};
				tempJson.id = key+1;
				tempJson.change = item.changeNumber;
				tempJson.content = item.content;
				tempJson.time = moment(item.createdAt).format('YYYY-MM-DD HH:mm');
				tempJson.fileUrl = item.file;

				tempArray.push(tempJson);
			})

			_self.setState({
				logDatas: tempArray
			});
    })
  },
  recordDocs(res) {
  	let fileUrl = 'http://docs.cq-tct.com/' + res.key;
  	this.setState({ fileUrl: fileUrl });
  },
  handleSubmit() {
  	let formData  = this.props.form.getFieldsValue(),
		  	projectId = Cookies.get('presentBelongProjectId'),
  			datas = {
		  		content: formData.content,
		  		changeNumber: formData.change,
		  		file: this.state.fileUrl
		  	},
		  	_self = this;

		if(!datas.content || !datas.changeNumber || !datas.file) return message.warning("请完善信息，一个也不能少");

		_self.setState({ loading: true});

		restartProcessTrim(projectId, JSON.stringify(datas)).then((res) => {
			message.success("开启流程裁剪成功");
			_self.getUsersOfProject();
			_self.setState({ isSubmit: true, loading: false});
			setTimeout(() => {
				_self.context.router.push('/console/projects/cutStage');
			},3000)
		})
  },
	render() {
		let state = this.state,
        props = this.props,
        _self = this;

    //上传参数
    let params = {
      name: 'file',
      action: 'http://upload.qiniu.com/',
      multiple: false,
      showUploadList: false,
      onChange(info) {
        if(info.file.status == 'error'){
          message.error(info.file.name + ' 上传失败：' + info.file.response.error, 2);
          message.destroy();
          _self.setState({ loading: false });
          return false;
        }else if(info.file.status == 'done'){
          message.success(info.file.name + ' 上传成功', 2);
          message.destroy();
          _self.recordDocs(info.file.response);
          _self.setState({ loading: false });
        }
      },
      beforeUpload(info) {
        if(info.size > 1024*1024*100){
          message.error(info.name + ' 上传失败，文件大于100M', 1);
          return false;
        }
        message.loading('文件上传中...', 0);
        _self.setState({ loading: true });
      },
      data (info){
        return {
          token: state.qiniuToken,
          key: moment().format('YYYYMMDDHHmmss') +'_'+ info.name
        };
      }
    };

    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const columns = [{
		  title: '变更号',
		  dataIndex: 'change',
		  key: 'change',
		  width: '15%',
		  render: (text) => <a>{text}</a>,
		}, {
		  title: '变更内容',
		  dataIndex: 'content',
		  key: 'content',
		  width: '50%',
		}, {
		  title: '变更时间',
		  dataIndex: 'time',
		  key: 'time',
		  width: '15%',
		}, {
		  title: '附件',
		  key: 'operation',
		  width: '10%',
		  render: (text, record) => (
		    <span>
		      <Link to={'/preview/file/direct?fileUrl=' + encodeURI(record.fileUrl)} target="_blank">预览</Link>
		    </span>
		  ),
		}];

		return (
			<Spin spinning={state.loading}>
				{
					state.isSubmit ?
						<div style={{padding:'20px auto'}}>
							<center className="text-success"><Icon type="check-circle" /> 流程裁剪已成功开启</center>
						</div>
					:
						<Form key="a" horizontal onSubmit={this.handleSubmit}>
		          <FormItem
		            {...formItemLayout}
		            label="变更号"
		          >
                <Input {...getFieldProps('change', { initialValue: '' })} placeholder="请输入变更号" />
		          </FormItem>
		          <FormItem
		            {...formItemLayout}
		            label="变更内容"
		          >
                <Input type="textarea" {...getFieldProps('content', { initialValue: '' })} placeholder="请输入变更内容" />
		          </FormItem>
		          <FormItem
		            {...formItemLayout}
		            label="附件"
		          >
		          {
            		state.fileUrl ?
            			<span><Icon type="check-circle" className="text-success"/> 变更附件上传成功</span>
            		:
			          	<Upload {...params}>
			              <Button type="dashed" size="small" loading={this.state.loading}>
			              	上传变更附件
			              </Button>
			            </Upload>
            	}
		          </FormItem>
		          <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
		            <Popconfirm title="确定提交本次变更吗？" onConfirm={this.handleSubmit}>
		              <Button type="primary" htmlType="submit">确认并提交</Button>
		            </Popconfirm>
		          </FormItem>
		        </Form>
				}

				{
					_.size(state.logDatas) > 0 ?
						<div>
							<Alert message="变更记录" type="success" />
							<Table columns={columns} dataSource={state.logDatas} />
						</div>
					:
						null
				}
			</Spin>
		)
	}
});

RestartProcessTrim = Form.create()(RestartProcessTrim);

export default RestartProcessTrim;