import React from 'react';
import QueueAnim from 'rc-queue-anim';
import Cookies from 'js-cookie';

import {
  getAllUsers,
  setPersonsOfDepartment,
  showProject
} from '../../../services/api';

import { Form, Input, Table, Button, Select, message, Checkbox, Icon, Spin, Popconfirm } from 'antd';

//ant
const FormItem = Form.Item;
const Option   = Select.Option;

//main
let SetDepartmentPerson = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState() {
    return {
      loading: true, //提交进度
      isSubmit: false,
      userChildren: [], //选择人员
      usersOfProject: [], //项目成员
      rolesOfProject: {
        masterId: '',
        adminId: ''
      },
      selectDeprtmentUsers: [], //已选择的部门人员
    };
  },
  componentDidMount() {
  	this.getAllUsers();
    this.showProjectInfo();
  },
  showProjectInfo() {
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.error("请先选择您参与的项目部或部门");

    let t_presentUserId = Cookies.get('presentUserId');
    let _self = this;

    showProject(projectId).then((res) => {
      let datas = res.jsonResult.project;
      let tempUsers = [];
      let tempRoles = {
        masterId: '',
        adminId: ''
      };
      let tempSelectDeprtmentUsers = [];

      datas.Users.map((item, key) => {
        //获取部门已有人员，用于赋值

        if(item.UserProjects.role == '部门负责人') {

          tempRoles.masterId = item.id +'__'+ item.pinyin + item.suoxie +'__'+ item.name;

        }else if(item.UserProjects.role == '部门管理员') {

          tempRoles.adminId = item.id +'__'+ item.pinyin + item.suoxie +'__'+ item.name;

        }else {

          let tempStr = item.id +'__'+ item.pinyin + item.suoxie +'__'+ item.name;
          tempSelectDeprtmentUsers.push(tempStr);

        }

        //获取部门已有的人员列表
        let tempJson = {};

        tempJson.id = key+1;
        tempJson.name = item.name;
        tempJson.position = item.UserProjects.role;

        tempUsers.push(tempJson);

      })

      _self.setState({
        usersOfProject: tempUsers,
        selectDeprtmentUsers: tempSelectDeprtmentUsers,
        rolesOfProject: tempRoles
      });

    })
  },
  getAllUsers() {
    let children = [],
        _self    = this;

    getAllUsers().then((res) => {
      let usersArray = res.jsonResult.users;
      usersArray.map((item, key, index) => {
        let temp = item.id +'__'+ item.pinyin + item.suoxie +'__'+ item.name;
        children.push(<Option key={key+index} value={temp}>{item.name}</Option>);
      })
      _self.setState({ userChildren: children, loading: false });
    });
  },
  handleSubmit() {
    let projectId = Cookies.get('presentBelongProjectId'),
        flag      = false,
        _self     = this;

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      let tempUserIds = '';

      formDatas.userIds.map((item) => {
        tempUserIds += ',' + item.split('__')[0];
      })

      let datas = {
        masterId: formDatas.masterId.split('__')[0],
        adminId: formDatas.adminId.split('__')[0],
        userIds: tempUserIds.substr(1, tempUserIds.length)
      };

      //检查成员
      let tempUserArray = datas.userIds.split(',') || [];
      _.map(tempUserArray, (item) => {
        if(item == datas.masterId || item == datas.adminId || datas.masterId == datas.adminId) return flag = true;
      })

      if(flag) return message.warning('人员不能重复，请仔细再检查一遍！');

      _self.setState({ loading: true });

      setPersonsOfDepartment(projectId, JSON.stringify(datas)).then((res) => {
        message.success('部门人员配置成功');
        _self.showProjectInfo();
        setTimeout(function(){
          _self.setState({
            isSubmit: true,
            loading: false
          });
        }, 500)
      })

    });

  },
  render() {
    var state = this.state,
        props = this.props,
        _self = this;

    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const columns = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: '20%'
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '30%'
    }, {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      width: '50%'
    }];

    return (
      <QueueAnim delay={100} type="bottom" >
        <Spin key="a" spinning={state.loading}>
        {
          state.isSubmit ?
            <div style={{margin:'20px auto'}}>
              <center className="text-success"><Icon type="check-circle" /> 部门人员设置成功</center>
            </div>
          :
            <Form key="a" horizontal form={props.form}>
              <FormItem
                {...formItemLayout}
                label="部门主管"
              >
                <Select
                  showSearch
                  {...getFieldProps('masterId', {initialValue: state.rolesOfProject.masterId || '', rules: [{required: true,message:'部门主管'}]} )}
                  placeholder="请选择人员"
                >
                  {state.userChildren}
                </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="部门管理员"
              >
                <Select
                  showSearch
                  {...getFieldProps('adminId', {initialValue: state.rolesOfProject.adminId || '', rules: [{required: true,message:'部门管理员'}]} )}
                  placeholder="请选择人员"
                >
                  {state.userChildren}
                </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="部门成员"
              >
                <Select
                  multiple
                  {...getFieldProps('userIds', {initialValue: state.selectDeprtmentUsers, rules: [{required: true,type:'array',message:'部门成员'}]} )}
                  placeholder="请选择人员"
                >
                  {state.userChildren}
                </Select>
              </FormItem>
              <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
                <Popconfirm title="确定提交部门人员设置吗？" onConfirm={this.handleSubmit}>
                  <Button type="primary" htmlType="submit">确认并提交</Button>
                </Popconfirm>
              </FormItem>
            </Form>
        }
        </Spin>

        <div key="b">
          <Table
            dataSource={state.usersOfProject}
            columns={columns}
            pagination={false}
          />
          <div style={{marginTop:15,textAlign:'right'}}>当前共有记录 <span className="text-danger">{state.usersOfProject.length}</span> 条</div>
        </div>
      </QueueAnim>
    );
  },
});

SetDepartmentPerson = Form.create()(SetDepartmentPerson);

export default SetDepartmentPerson;