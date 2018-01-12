import React from 'react';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import Cookies from 'js-cookie';

import { getAllUsers, setProjectRoles } from '../../services/api';

import { Menu, Dropdown, Icon, message, Form, Row, Col, Alert, Button, Select, Spin } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

let SetProjectPerson = React.createClass({
  getInitialState: function() {
    return {
      loading: false,
      isRepeat: false,
      isSubmit: false,
      projects: [], //选择项目
      children: [], //选择人员
      projectId: Cookies.get('presentBelongProjectId')
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
        var temp = item.id +'__'+ item.pinyin + item.suoxie +'__'+ item.name;
        _self.state.children.push(<Option key={key+index} value={temp}>{item.name}</Option>);
      })
    });
  },
  filterPerson: function(users){
    // var personStr = '';
    // _.map(users, function(user){
    //   return personStr += ','+user.split('__')[0];
    // });
    // return personStr.substr(1, personStr.length);
    return users.split('__')[0];
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var _self = this;

    if(!_self.state.projectId) return message.warning('请选择待配置的项目', 2);

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if(errors) {
        console.log(errors, 'Errors in form!!!');
      }else {

        if(values.施工管理工程师){
          var formDatas = {
            子公司总经理: _self.filterPerson(values.子公司总经理),
            项目负责人: _self.filterPerson(values.项目负责人),
            项目经理: _self.filterPerson(values.项目经理),
            项目安全总监: _self.filterPerson(values.项目安全总监),
            安质部部长: _self.filterPerson(values.安质部部长),
            项目副经理: _self.filterPerson(values.项目副经理),
            现场测试调试经理: _self.filterPerson(values.现场测试调试经理),
            商务经理: _self.filterPerson(values.商务经理),
            项目管理工程师: _self.filterPerson(values.项目管理工程师),
            施工管理工程师: _self.filterPerson(values.施工管理工程师),
            技术经理: _self.filterPerson(values.技术经理),
            数据设计经理: _self.filterPerson(values.数据设计经理),
            研发接口人: _self.filterPerson(values.研发接口人),
            集成设计负责人: _self.filterPerson(values.集成设计负责人),
            生产接口人: _self.filterPerson(values.生产接口人),
            采购接口人: _self.filterPerson(values.采购接口人),
            IQA: _self.filterPerson(values.IQA),
            质量经理: _self.filterPerson(values.质量经理),
            配置经理: _self.filterPerson(values.配置经理),
            大测试经理: _self.filterPerson(values.大测试经理),
            室内测试经理: _self.filterPerson(values.室内测试经理),
            确认经理: _self.filterPerson(values.确认经理),
            安全经理: _self.filterPerson(values.安全经理)
          };
        }else {
          var formDatas = {
            子公司总经理: _self.filterPerson(values.子公司总经理),
            项目负责人: _self.filterPerson(values.项目负责人),
            项目经理: _self.filterPerson(values.项目经理),
            项目安全总监: _self.filterPerson(values.项目安全总监),
            安质部部长: _self.filterPerson(values.安质部部长),
            项目副经理: _self.filterPerson(values.项目副经理),
            现场测试调试经理: _self.filterPerson(values.现场测试调试经理),
            商务经理: _self.filterPerson(values.商务经理),
            项目管理工程师: _self.filterPerson(values.项目管理工程师),
            技术经理: _self.filterPerson(values.技术经理),
            数据设计经理: _self.filterPerson(values.数据设计经理),
            研发接口人: _self.filterPerson(values.研发接口人),
            集成设计负责人: _self.filterPerson(values.集成设计负责人),
            生产接口人: _self.filterPerson(values.生产接口人),
            采购接口人: _self.filterPerson(values.采购接口人),
            IQA: _self.filterPerson(values.IQA),
            质量经理: _self.filterPerson(values.质量经理),
            配置经理: _self.filterPerson(values.配置经理),
            大测试经理: _self.filterPerson(values.大测试经理),
            室内测试经理: _self.filterPerson(values.室内测试经理),
            确认经理: _self.filterPerson(values.确认经理),
            安全经理: _self.filterPerson(values.安全经理)
          };
        }

        //过滤重复人员
        var allUsers = []; //所有选择的人员
        var filterRepeatUsers = []; //去重之后的人员
        _.map(values, function(item){
          allUsers.push(item);
        })

        filterRepeatUsers = _.uniq(allUsers);

        var counts = allUsers.length - filterRepeatUsers.length;

        if(counts != 0) {
          if(_self.state.isRepeat) return message.error("当前还有"+counts+"个角色重复，真的还有重复的，请仔细再检查一遍，拜托...");
          _self.setState({ isRepeat: true });
          return message.error("当前有"+counts+"个角色重复，请仔细检查一遍");
        }

        _self.setState({ loading: true });
        setProjectRoles(_self.state.projectId, JSON.stringify(formDatas)).then(function(res) {
          message.success('项目人员配置成功');
          _self.props.form.resetFields();
          setTimeout(function(){
            _self.setState({
              isSubmit: true,
              loading: false
            });
          }, 1000)
        });

      }
    });
  },
  render: function() {
    var props = this.props,
        state = this.state,
        _self = this;

    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 }
    };

    return (
      <Spin spinning={this.state.loading}>
        <QueueAnim type="bottom" delay={100}>
          
          当前配置项目：{Cookies.get('presentBelongProjectName')}
          {
            state.isSubmit ?
              <div key="a" style={{padding:'20px auto'}}>
                <center className="text-success"><Icon type="check-circle" /> 项目人员配置成功</center>
              </div>
            :
              <div key="b" style={{ paddingTop: 20 }}>
                <Form horizontal className="ant-advanced-search-form" form={this.props.form}>
                  <Row gutter={12}>
                    <Col sm={24}>
                      <Alert message="项目管理人员配置" type="success" />
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="子公司总经理" >
                        <Select
                          {...getFieldProps('子公司总经理', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="项目负责人" >
                        <Select
                          {...getFieldProps('项目负责人', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="项目经理" >
                        <Select
                          {...getFieldProps('项目经理', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="项目安全总监" >
                        <Select
                          {...getFieldProps('项目安全总监', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="安质部部长" >
                        <Select
                          {...getFieldProps('安质部部长', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="项目副经理" >
                        <Select
                          {...getFieldProps('项目副经理', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="现场测试调试经理" >
                        <Select
                          {...getFieldProps('现场测试调试经理', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="商务经理" >
                        <Select
                          {...getFieldProps('商务经理', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="项目管理工程师" >
                        <Select
                          {...getFieldProps('项目管理工程师', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="技术经理" >
                        <Select
                          {...getFieldProps('技术经理', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="数据设计经理" >
                        <Select
                          {...getFieldProps('数据设计经理', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="研发接口人" >
                        <Select
                          {...getFieldProps('研发接口人', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="集成设计负责人" >
                        <Select
                          {...getFieldProps('集成设计负责人', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="生产接口人" >
                        <Select
                          {...getFieldProps('生产接口人', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="采购接口人" >
                        <Select
                          {...getFieldProps('采购接口人', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="大测试经理" >
                        <Select
                          {...getFieldProps('大测试经理', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="室内测试经理" >
                        <Select
                          {...getFieldProps('室内测试经理', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="质量经理" >
                        <Select
                          {...getFieldProps('质量经理', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="配置经理" >
                        <Select
                          {...getFieldProps('配置经理', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="确认经理" >
                        <Select
                          {...getFieldProps('确认经理', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="安全经理" >
                        <Select
                          {...getFieldProps('安全经理', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="IQA" >
                        <Select
                          {...getFieldProps('IQA', {rules:[{required:true,message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select"
                        >
                          {state.children}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col sm={12}>
                      <FormItem {...formItemLayout} label="施工管理工程师" >
                        <Select
                          {...getFieldProps('施工管理工程师', {rules:[{message:'请选择配置人员',type:"string"}]})}
                          showSearch
                          placeholder="Please select（可选）"
                        >
                          {state.children}
                        </Select>
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
              </div>
          }
        </QueueAnim>
      </Spin>
    );
  }
});

SetProjectPerson = Form.create()(SetProjectPerson);

export default SetProjectPerson;