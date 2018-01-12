import React from 'react';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import {
  getQiniuToken,
  modifyPersonOfProject,
  getAllUsers,
  showProject, 
  addUserOfProject,
  getLogsByType
} from '../../../services/api';

import { message, Icon, Form, Select, Alert, Upload, Button, Row, Col, Spin, Popconfirm, Modal, Input, Tabs } from 'antd';

import styles from '../Common.less';

//ant
const FormItem = Form.Item;
const Option   = Select.Option;
const TabPane  = Tabs.TabPane;

//main
let ModifyProject = React.createClass({
	getInitialState() {
		return {
			loading: false,
			uploadLoading: false,
      isSubmit: false,
			qiniuToken: '',
			children: [], //选择人员 option
			projectUserItem: [], //项目人员 option
			projectUsers: [], //项目人员
			fileUrl: '',
      addPersonUserId: '', //新增人员Id
      addPersonRole: '', //新增人员角色
      changeLogs: [], // 人员变更日志
      logLoading: false,
		}
	},
	componentDidMount() {
    this.getAllUsers();
		this.getProjectInfo();
		this.getQiniuToken();
    this.handleShowChangeLogs();
	},
	getQiniuToken() {
    var _self = this;
    getQiniuToken('desp-files').then(function(res) {
      _self.setState({ qiniuToken: res.jsonResult.token });
    });
  },
	getProjectInfo() {
		var projectId     = Cookies.get('presentBelongProjectId'),
        flag          = false,
        tempRoleArray = [],
        number        = 0,
				_self         = this;

		showProject(projectId).then((res) => {

			// console.log(res.jsonResult.project.Users)
			var users = res.jsonResult.project.Users;

			//提取已在项目的人员
			users.map((item, key, index) => {
				var temp = item.id +'__'+ item.pinyin + item.suoxie + item.name + item.UserProjects.role;
				_self.state.projectUserItem.push(<Option key={key+index} value={temp}>{item.name} - {item.UserProjects.role}</Option>);
        
        //项目角色
        tempRoleArray.push(item.UserProjects.role);
			})

      //自动赋予角色
      tempRoleArray.map((item) => {
        if(item.substr(0, 5) == '项目工程师') number = parseInt(item.substr(5, item.length)) + 1;
      })

			_self.setState({
        loading: false,
        projectUsers: users,
        addPersonRole: '项目工程师'+number
      });
		})
	},
	getAllUsers() {
		var _self = this;

    getAllUsers().then((res) => {
      let usersArray = res.jsonResult.users;
      usersArray.map((item, key, index) => {
        var temp = item.id +'__'+ item.pinyin + item.suoxie + item.name;
        _self.state.children.push(<Option key={key+index} value={temp}>{item.name}</Option>);
      })
    });
	},
	handleSubmit(e) {
    e.preventDefault();

    var	projectId = Cookies.get('presentBelongProjectId'),
        _self     = this;

    if(!projectId) return message.warning('请选择待配置的项目');

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if(errors) {
        console.log(errors, 'Errors in form!!!');
      }else {

      	var user1 = values.user1Id.split('__')[0],
      			user2 = values.user2Id.split('__')[0],
      			flag  = false;

      	//新添加人员不能是项目人员
      	this.state.projectUsers.map((item) => {
      		if(item.id == user2) flag = true;
      	})

      	if(flag) return message.error("变更人员不能已经存在本项目，修改失败");

      	var datas = {
      		user1Id: user1,
      		user2Id: user2,
      		changeNumber: values.changeNumber,
      		content: values.content,
      		file: this.state.fileUrl
      	};

        _self.setState({ loading: true });

      	modifyPersonOfProject(projectId, JSON.stringify(datas)).then((res) => {
      		message.success("人员变更成功");
      		_self.getProjectInfo();
      		_self.setState({ loading: false, projectUserItem: [] }); //置空数组，保证数据刷新key唯一
      		_self.props.form.resetFields(); //重置表单
      	})
      }
    });
	},
  changeAddPersonUserId(e) {
    this.setState({ addPersonUserId: e.split('__')[0] });
  },
  handleSubmitAddPerson() {

    var projectId = Cookies.get('presentBelongProjectId'),
        flag      = false,
        _self     = this;

    if(!projectId) return message.warning('请选择待配置的项目');
    if(!this.state.addPersonUserId || !this.state.addPersonRole) return message.warning('请完善信息，一个也不能少');

    var datas = {
      userId: this.state.addPersonUserId,
      role: this.state.addPersonRole
    };

    //新添加人员不能是项目人员
    this.state.projectUsers.map((item) => {
      if(item.id == datas.userId) flag = true;
    })

    if(flag) return message.error("新增人员已经存在于本项目，新增失败");

    _self.setState({ isSubmit: true });

    addUserOfProject(projectId, JSON.stringify(datas)).then((res) => {
      message.success("新增人员成功");
      _self.getProjectInfo();
      setTimeout(() => {
        _self.setState({ isSubmit: false });
      }, 2000)
    })

  },
  handleShowChangeLogs() {
    // 获取变更日志
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning('请选择待配置的项目');

    _self.setState({ logLoading: true });

    getLogsByType(projectId, '人员变更').then((res) => {
      _self.setState({ changeLogs: res.jsonResult.logs, logLoading: false });
    })
  },
	render() {
		var props = this.props,
        state = this.state,
        _self = this;

    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 }
    };

    //上传参数
    var params = {
      name: 'file',
      action: 'http://upload.qiniu.com/',
      multiple: false,
      showUploadList: false,
      onChange(info) {
        if(info.file.status == 'error'){
          message.error(info.file.name + ' 上传失败：' + info.file.response.error);
          _self.setState({ uploadLoading: false });
          message.destroy();
        }else if(info.file.status == 'done'){
          message.success(info.file.name + ' 上传成功');
          var fileUrl = 'http://docs.cq-tct.com/' + info.file.response.key //赋值审批附件
          _self.setState({
          	fileUrl: fileUrl,
          	uploadLoading: false
          });
          message.destroy();
        }
      },
      beforeUpload(info) {
        if(info.size > 1024*1024*100){
          message.error(info.name + ' 上传失败，文件大于100M', 1);
          return false;
        }
        message.loading('文件上传中...', 0);
        _self.setState({ uploadLoading: true, fileUrl: '' });
      },
      data (info){
        return {
          token: state.qiniuToken,
          key: moment().format('YYYYMMDDHHmmss') +'_'+ info.name
        };
      }
    };

		return (
			<Spin spinning={state.loading}>
        <QueueAnim type="bottom" delay={100}>
          
          当前配置项目：{Cookies.get('presentBelongProjectName')}

          <Tabs key="a" tabPosition="left" size="small" style={{marginTop:20}}>
            <TabPane tab="1、变更项目人员" key="1">
              <Form horizontal className="ant-advanced-search-form" form={props.form}>
                <Row gutter={12}>
                  <Col sm={12}>
                    <FormItem {...formItemLayout} label="待变更人员" >
                      <Select
                        {...getFieldProps('user1Id', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                        showSearch
                        placeholder="Please select"
                      >
                        {state.projectUserItem}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col sm={12}>
                    <FormItem {...formItemLayout} label="新人员" >
                      <Select
                        {...getFieldProps('user2Id', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                        showSearch
                        placeholder="Please select"
                      >
                        {state.children}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col sm={12}>
                    <FormItem {...formItemLayout} label="变更号" >
                      <Input type="textarea" autosize placeholder="请输入变更号" {...getFieldProps('changeNumber', {rules:[{message:'请输入变更号',type:"string"}]})} />
                    </FormItem>
                  </Col>
                  <Col sm={24}>
                    <FormItem 
                      labelCol={{span:3}}
                      wrapperCol={{span:16}}
                      label="变更原因"
                    >
                      <Input type="textarea" autosize placeholder="请输入人员变更原因" {...getFieldProps('content', {rules:[{required:true,message:'请输入人员变更原因',type:"string"}]})} />
                    </FormItem>
                  </Col>
                  <Col sm={24}>
                    <FormItem 
                      labelCol={{span:3}}
                      wrapperCol={{span:16}}
                      label="附件"
                    >
                      <Upload {...params}>
                        <Button type="ghost" loading={this.state.uploadLoading}>点击上传</Button>
                      </Upload>
                      {
                        state.fileUrl ?
                          <span className="text-success" style={{marginLeft:10}}><Icon type="check-circle" />上传成功</span>
                        :
                          null
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24} style={{ textAlign: 'center',marginBottom:15 }}>
                    <FormItem>
                      <Button type="primary" onClick={this.handleSubmit}>确认并提交</Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>

              <div style={{borderTop:'1px dashed #E6E6E6',paddingTop:15}}>
                <Button onClick={this.handleShowChangeLogs} loading={state.logLoading}>刷新人员变更日志</Button>
                <Spin spinning={state.logLoading}>
                  {_.size(state.changeLogs) == 0 ? <center className="text-gray">暂无人员变更日志</center> : null}
                  <ul>
                    {
                      _.map(state.changeLogs, (item, key) => {
                        return (
                          <li key={key} style={{margin:5}}><span className="text-gray">{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span> {item.content}【变更号：<span className="text-info">{item.changeNumber || '...'}</span>】</li>
                        )
                      })
                    }
                  </ul>
                </Spin>
              </div>

            </TabPane>
            <TabPane tab="2、新增项目人员" key="2">
              <Form>
                <Row>
                  <Col sm={24}>
                    <FormItem {...formItemLayout} label="新增人员" >
                      <Select
                        showSearch
                        placeholder="请请选择新增人员"
                        onChange={this.changeAddPersonUserId}
                      >
                        {state.children}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col sm={24}>
                    <FormItem {...formItemLayout} label="赋予角色" >
                      <Input disabled defaultValue={state.addPersonRole} onChange={this.changeAddPersonRole} type="text" placeholder="请输入人员角色" />
                    </FormItem>
                  </Col>
                  <Col span={24} style={{ textAlign: 'center',marginBottom:15 }}>
                    <FormItem>
                      {
                        state.isSubmit ?
                          <Button type="primary" disabled>确认并提交</Button>
                        :
                          <Button type="primary" onClick={this.handleSubmitAddPerson}>确认并提交</Button>
                      }
                    </FormItem>
                  </Col>
                </Row>
              </Form>

              <Alert message="项目人员列表" type="success" />

              {
                state.projectUsers.map((item, key) => {
                  return (
                    <Row key={key}>
                      <Col span={3} offset={9}>{key+1}、{item.name}</Col>
                      <Col span={4}>{item.UserProjects.role}</Col>
                    </Row>
                  )
                })
              }
            </TabPane>
          </Tabs>

        </QueueAnim>
      </Spin>
		)
	}
});

ModifyProject = Form.create()(ModifyProject);

export default ModifyProject;