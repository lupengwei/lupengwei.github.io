/**
 * 设置创建项目人员
 */

import React from 'react';
import { Table, Form, Input, Button, Icon, Spin, Select, Popconfirm, message, Row, Col } from 'antd';

import {
  getAllUsers,
  updateUserInfoById
} from '../../../services/api';

import styles from '../Common.less'

//ant
const FormItem = Form.Item;
const Option = Select.Option;

//main
let SetCreateProjectPerson = React.createClass({
  getInitialState() {
    return {
      loading: true,
      allUserChildren: [],
      userDatas: [],
      dataSource: []
    };
  },
  componentDidMount() {
    this.showAllUsers();
  },
  showAllUsers() {
    let children = [],
        _self    = this;

    getAllUsers().then((res) => {
      let usersArray = res.jsonResult.users;
      usersArray.map((item, key, index) => {
        let temp = item.id +'__'+ item.pinyin + item.suoxie +'__'+ item.name;
        children.push(<Option key={key+index} value={temp}>{item.name}</Option>);
      })

      _self.setState({
        userDatas: usersArray,
        allUserChildren: children
      });

      setTimeout(() => {
        _self.showHasRoleUsers();
      }, 300)

    });
  },
  showHasRoleUsers() {
    let _self = this;
    let tempDataSource = [];
    let tempCounts = 0;

    _.map(_self.state.userDatas, (item) => {

      if(item.canCreateProject) {
        let tempJson = {};
        ++tempCounts;

        tempJson.id = tempCounts;
        tempJson.userId = item.id;
        tempJson.userName = item.name;

        tempDataSource.push(tempJson);
      }

    })

    _self.setState({
      dataSource: tempDataSource,
      loading: false
    });
  },
  handleSubmit() {
    let _self = this;

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      let userId = formDatas.user.split('__')[0];
      let datas = {
        canCreateProject: 'true'
      };

      updateUserInfoById(userId, JSON.stringify(datas)).then((res) => {
        message.success('【'+ formDatas.user.split('__')[2] +'】创建项目权限添加成功！');
        _self.showAllUsers();
        _self.props.form.resetFields();
      })

    })
  },
  handleDelete(tempUserId, tempUserName) {
    let _self = this;

    let datas = {
      canCreateProject: 'false'
    };

    updateUserInfoById(tempUserId, JSON.stringify(datas)).then((res) => {
      message.success('【'+ tempUserName +'】创建项目权限取消成功！');
      _self.showAllUsers();
    })
  },
  render() {
    let state = this.state,
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
      render: (text) => {
        return <center>{text}</center>;
      }
    }, {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
      render: (text) => {
        return <center>{text}</center>;
      }
    }, {
      title: '操作',
      dataIndex: 'options',
      key: 'options',
      render: (text, record) => {
        return (
          <center>
            <Popconfirm title="确定删除此项吗？" placement="left" onConfirm={this.handleDelete.bind(null, record.userId, record.userName)}>
              <Button type="dashed" size="small">删除</Button>
            </Popconfirm>
          </center>
        )
      }
    }];

    return (
      <Spin spinning={state.loading}>
        <div style={{borderRadius:'20px',borderBottom: '1px solid #A6A6A6',marginBottom:15}}>
          <Form horizontal form={props.form}>
            <Row gutter={16}>
              <Col sm={8}>
                <FormItem
                  {...formItemLayout}
                  label="配置人员"
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    notFoundContent="无法找到，请输入名字部分搜索"
                    style={{ width:'98%',marginBottom:5}}
                    placeholder="请选择待配置人员"
                    filterOption={desp_selectFilter}
                    {...getFieldProps('user', {rules: [{required: true,message:'配置人员'}]} )}
                  >
                    { state.allUserChildren }
                  </Select>
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem>
                  <Button onClick={this.handleSubmit} type="primary">确认提交</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>

        <Table
          dataSource={state.dataSource}
          columns={columns}
          pagination={false}
        />
        <div style={{marginTop:15,textAlign:'right'}}>当前共有记录 <span className="text-danger">{state.dataSource.length}</span> 条</div>

      </Spin>
    );
  }
});

SetCreateProjectPerson = Form.create()(SetCreateProjectPerson);

export default SetCreateProjectPerson;