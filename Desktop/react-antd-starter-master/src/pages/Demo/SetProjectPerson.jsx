import React from 'react';
import ReactDOM from 'react-dom';
import QueueAnim from 'rc-queue-anim';
import Cookies from 'js-cookie';

import { getAllUsers, setProjectRoles } from '../../services/api';

import { Menu, Dropdown, Icon, message, Form, Row, Col, Alert, Button, Select, Popconfirm, Spin } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const SetProjectPerson = React.createClass({
  getInitialState: function() {
    return {
      loading: false,
      projects: [], //选择项目
      children: [], //选择人员
      projectId: Cookies.get('presentBelongProjectId'),
      formDatas: {
        项目负责人: '',
        项目经理: '',
        项目副经理: '',
        技术经理: '',
        技术负责人: '',
        商务经理: '',
        施工管理工程师: '',
        项目管理工程师: '',
        大测试经理: '',
        室内测试经理: '',
        现场测试调试经理: '',
        安全总监: '',
        配置经理: '',
        确认经理: '',
        质量验证经理: '',
        安全工程师: '',
        数据设计经理: '',
        生产接口人: '',
        采购接口人: '',
        研发接口人: '',
        集成设计负责人: ''
      }
    };
  },
  componentDidMount: function() {
    this.getAllUsers();
  },
  getAllUsers: function(){
    var _self = this;
    getAllUsers().then(function(res) {
      let usersArray = res.jsonResult.users;
      usersArray.map(function(item, key, index){
        var temp = item.id +'__'+ item.pinyin + item.suoxie + item.name;
        _self.state.children.push(<Option key={key+index} value={temp}>{item.name}</Option>);
      })
    });
  },
  filterPerson: function(users){
    var personStr = '';
    users.map(function(user){
      personStr += ',' + user.split('__')[0];
    });
    return personStr.substr(1, personStr.length);
  },
  handleChange: function(role, name) {
    switch(role){
      case '项目负责人':
        this.state.formDatas.项目负责人 = this.filterPerson(name);
        break;
      case '项目经理':
        this.state.formDatas.项目经理 = this.filterPerson(name);
        break;
      case '项目副经理':
        this.state.formDatas.项目副经理 = this.filterPerson(name);
        break;
      case '技术经理':
        this.state.formDatas.技术经理 = this.filterPerson(name);
        break;
      case '技术负责人':
        this.state.formDatas.技术负责人 = this.filterPerson(name);
        break;
      case '商务经理':
        this.state.formDatas.商务经理 = this.filterPerson(name);
        break;
      case '施工管理工程师':
        this.state.formDatas.施工管理工程师 = this.filterPerson(name);
        break;
      case '项目管理工程师':
        this.state.formDatas.项目管理工程师 = this.filterPerson(name);
        break;
      case '大测试经理':
        this.state.formDatas.大测试经理 = this.filterPerson(name);
        break;
      case '室内测试经理':
        this.state.formDatas.室内测试经理 = this.filterPerson(name);
        break;
      case '现场测试调试经理':
        this.state.formDatas.现场测试调试经理 = this.filterPerson(name);
        break;
      case '安全总监':
        this.state.formDatas.安全总监 = this.filterPerson(name);
        break;
      case '配置经理':
        this.state.formDatas.配置经理 = this.filterPerson(name);
        break;
      case '确认经理':
        this.state.formDatas.确认经理 = this.filterPerson(name);
        break;
      case '质量验证经理':
        this.state.formDatas.质量验证经理 = this.filterPerson(name);
        break;
      case '安全工程师':
        this.state.formDatas.安全工程师 = this.filterPerson(name);
        break;
      case '数据设计经理':
        this.state.formDatas.数据设计经理 = this.filterPerson(name);
        break;
      case '生产接口人':
        this.state.formDatas.生产接口人 = this.filterPerson(name);
        break;
      case '采购接口人':
        this.state.formDatas.采购接口人 = this.filterPerson(name);
        break;
      case '研发接口人':
        this.state.formDatas.研发接口人 = this.filterPerson(name);
        break;
      case '集成设计负责人':
        this.state.formDatas.研发接口人 = this.filterPerson(name);
        break;
    }
  },
  submit: function(){
    var _self = this;
    if(!_self.state.projectId){
      message.warning('请选择待配置的项目', .5);
      return false;
    }
    _self.setState({ loading: true });
    setProjectRoles(_self.state.projectId, JSON.stringify(_self.state.formDatas)).then(function(res) {
      message.success('项目人员配置成功', .5);
      _self.setState({ loading: false });
    });
  },
  render: function() {
    var props = this.props,
        state = this.state,
        _self = this;

    return (
      <Spin spinning={this.state.loading}>
        <QueueAnim type="bottom" delay={100}>
          
          当前配置项目：{Cookies.get('presentBelongProjectName')}

          <div key="a" style={{ paddingTop: 20 }}>
            <Form horizontal className="ant-advanced-search-form">
              <Row gutter={12}>
                <Col sm={24}>
                  <Alert message="A、项目管理" type="success" />
                </Col>
                <Col sm={12}>
                  <FormItem
                    label="项目负责人"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '项目负责人')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem
                    label="项目经理"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '项目经理')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem
                    label="项目副经理"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '项目副经理')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>

                <Col sm={24}>
                  <Alert message="B、技术、商务及实施人员" type="info" />
                </Col>

                <Col sm={12}>
                  <FormItem
                    label="技术经理"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '技术经理')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem
                    label="技术负责人"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '技术负责人')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem
                    label="商务经理"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '商务经理')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem
                    label="施工管理工程师"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '施工管理工程师')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem
                    label="项目管理工程师"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '项目管理工程师')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>

                <Col sm={24}>
                  <Alert message="C、测试、调试人员" type="success" />
                </Col>

                <Col sm={12}>
                  <FormItem
                    label="大测试经理"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '大测试经理')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem
                    label="室内测试经理"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '室内测试经理')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem
                    label="现场测试调试经理"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '现场测试调试经理')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>

                <Col sm={24}>
                  <Alert message="D、质量、安全人员" type="info" />
                </Col>

                <Col sm={12}>
                  <FormItem
                    label="安全总监"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '安全总监')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem
                    label="配置经理"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '配置经理')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem
                    label="确认经理"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '确认经理')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem
                    label="质量验证经理"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '质量验证经理')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem
                    label="安全工程师"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '安全工程师')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>

                <Col sm={24}>
                  <Alert message="E、外部支持对接人员" type="success" />
                </Col>

                <Col sm={12}>
                  <FormItem
                    label="数据设计经理"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '数据设计经理')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem
                    label="生产接口人"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '生产接口人')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem
                    label="采购接口人"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '采购接口人')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem
                    label="研发接口人"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '研发接口人')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem
                    label="集成设计负责人"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <Select
                      multiple
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      defaultValue={[]}
                      onChange={this.handleChange.bind(null, '集成设计负责人')}
                    >
                      {state.children}
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'center',marginBottom:15 }}>
                  <Popconfirm title="确定要提交该项目人员配置吗？" onConfirm={this.submit}>
                    <Button type="primary">确认并提交</Button>
                  </Popconfirm>
                </Col>
              </Row>
            </Form>
          </div>
        </QueueAnim>
      </Spin>
    );
  }
});

export default SetProjectPerson;