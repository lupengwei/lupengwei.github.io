import React from 'react';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import Cookies from 'js-cookie';

import { getManagerFileTaskByPerson, getManagerFileTaskByProject, comfirmManagerTaskFileList, showProject, getComfirmationFormsOfProject, managerRefusedFileTaskListByComfirmid } from '../../../services/api';

import { message, Icon, Select, Button, Form, Collapse, Popconfirm, Table, Row, Col, Input, Modal, Spin } from 'antd';

import styles from '../Common.less';

//ant
const FormItem = Form.Item;
const Panel    = Collapse.Panel;

//main
let CheckTaskFileList = React.createClass({
  getInitialState: function() {
    return {
      projectId: Cookies.get('presentBelongProjectId'),
      formDatas: [],
      formDatasBackup: '', //备份便于搜索过滤
      projectStatus: false,
      loading: false,
      confirmFileTaskListDatas: '', //职能经理清单确认信息
      visible: false, //Modal
      selectPersonItem: '',
      refusedMsg: '', //拒绝理由
    };
  },
  componentDidMount: function() {
    this.getProjectInfo();
    // this.getManagerFileTaskByPerson();
    this.getManagerFileTaskByProject();
    this.getComfirmationFormsOfProject();
  },
  getManagerFileTaskByPerson: function(){
    var _self = this;
    getManagerFileTaskByPerson(this.state.projectId).then(function(res){
      _self.setState({ formDatas: res.jsonResult.users });
    });
  },
  getManagerFileTaskByProject: function(){
    var _self = this;
    
    _self.setState({ loading: true });

    getManagerFileTaskByProject(this.state.projectId).then(function(res){
      
      var datas = [];

      _.map(res.jsonResult.project.StageNewItems, function(item1, key1){
        // console.log(item1); //阶段
        _.map(item1.DefaultTasks, function(item2, key2){
          // console.log(item2); //任务
          _.map(item2.FileTasks, function(item3, key3){
            // console.log(item3); //文件任务
            if(item3.isNecessary){
              //未删除的文件任务
              var temp = {};
              temp.key        = key1+''+key2+''+key3;
              temp.stageName  = item1.name;
              temp.taskName   = item2.name;
              temp.fileTaskName   = item3.name;
              temp.ownerRole  = item3.ownerRole || '* * *';
              temp.ownerName  = item3.Owner.name;
              datas.push(temp);
            }
          })
        })
      });

      _self.setState({ formDatas: datas, formDatasBackup: datas, loading: false });

    });
  },
  managerConfirmTaskFileList: function(){
    let _self  = this;
    let counts = 0;
    let confirmFileTaskListDatas = _self.state.confirmFileTaskListDatas;

    //判断是否所有角色都通过
    confirmFileTaskListDatas.map((item) => {
      if(item.isComfirm) return counts++;
    })

    if(confirmFileTaskListDatas.length != counts) return message.warning("还有项目人员没有确认清单，您暂时无法进行确认项目清单");

    comfirmManagerTaskFileList(_self.state.projectId).then(function(res){
      message.success("清单确认成功");
      setTimeout(function(){
        _self.getProjectInfo();
        _self.getManagerFileTaskByProject();
        _self.getComfirmationFormsOfProject();
        Cookies.set('presentProjectStatus', 'active'); //自动转到active状态
      }, 1000);
    })
  },
  getProjectInfo: function(){
    if(!this.state.projectId) return message.error("请先选择将要配置的项目", 2);
    var _self = this;

    showProject(_self.state.projectId).then(function(res){
      _self.setState({ projectStatus: res.jsonResult.project.status });
    })
  },
  handleSubmit: function(e){
    e.preventDefault();
    var datas     = this.props.form.getFieldsValue(),
        tempArray = [],
        tempKey   = [], //搜索关键词
        _self     = this;
    
    if(!datas.stageName && !datas.taskName && !datas.fileTaskName && !datas.ownerRole && !datas.ownerName) {
      _self.setState({ formDatas: _self.state.formDatasBackup });
      return message.error("请输入搜索条件");
    }
    
    //获取搜索关键词
    _.map(datas, function(value){ if(value) tempKey.push(value) });

    //筛选符合要求记录
    _.map(_self.state.formDatasBackup, function(item){
      var count = 0;
      _.map(datas, function(value, key){
        // if(value && datas[key] === item[key]) count++; //精确查询
        if(value && item[key].search(datas[key]) >= 0) count++; //模糊查询
      })

      //抓取记录全部满足 搜索关键词
      if(_.size(tempKey) === count) tempArray.push(item);

    })
    
    //去重 同一文件任务同一人不能重复
    // _self.setState({ formDatas: _.uniqWith(tempArray, _.isEqual) });
    _self.setState({ formDatas: tempArray });

  },
  getComfirmationFormsOfProject: function(){
    var _self = this;

    getComfirmationFormsOfProject(_self.state.projectId).then(function(res){
      _self.setState({ confirmFileTaskListDatas: res.jsonResult.comfirmationForms });
    })
  },
  refusedFileTaskListOfPerson: function(){
    if(!this.state.refusedMsg) return message.error("请输入拒绝理由", 2);

    var _self = this,
        datas = {
          reason: _self.state.refusedMsg
      };

    managerRefusedFileTaskListByComfirmid(_self.state.selectPersonItem.id, JSON.stringify(datas)).then(function(res){
      var msg = _self.state.selectPersonItem.role+" 提交的清单取消成功";
      message.success(msg);
      setTimeout(function(){
        _self.getManagerFileTaskByProject();
        _self.getComfirmationFormsOfProject();
      }, 1000);
    })
  },
  showRefusedModal: function(value){
    this.setState({ visible: true, selectPersonItem: value });
  },
  handleCancel: function(e){
    this.setState({ visible: false });
  },
  changeRefused: function(e){
    this.setState({refusedMsg: e.target.value});
  },
  render: function() {
    var state = this.state,
        props = this.props,
        _self = this;
    
    const { getFieldProps } = this.props.form;

    const columns = [{
      title: '项目阶段',
      dataIndex: 'stageName',
      onFilter: (value, record) => record.stageName.indexOf(value) === 0,
      sorter: (a, b) => a.stageName.length - b.stageName.length,
    }, {
      title: '任务',
      dataIndex: 'taskName',
      onFilter: (value, record) => record.taskName.indexOf(value) === 0,
      sorter: (a, b) => a.taskName.length - b.taskName.length,
    }, {
      title: '文件任务',
      dataIndex: 'fileTaskName',
      onFilter: (value, record) => record.fileTaskName.indexOf(value) === 0,
      sorter: (a, b) => a.fileTaskName.length - b.fileTaskName.length,
    }, {
      title: '角色',
      dataIndex: 'ownerRole',
      sorter: (a, b) => a.ownerRole - b.ownerRole,
    }, {
      title: '编写人',
      dataIndex: 'ownerName',
      sorter: (a, b) => a.ownerName - b.ownerName,
    }];

    const formItemLayout = {
      wrapperCol: { span: 24 },
    };

    return (
      <Spin spinning={state.loading}>

        <Modal title="拒绝文件任务清单" visible={this.state.visible}
          onOk={this.refusedFileTaskListOfPerson} onCancel={this.handleCancel}
        >
          <Input placeholder="输入拒绝理由" onChange={this.changeRefused}/>
        </Modal>

        <div style={{padding:'15px 0'}}>当前审核项目：{Cookies.get('presentBelongProjectName')}</div>

        <div style={{background:'#FCFCFC',padding:'15px 5px'}}>
          {
            state.projectStatus == 'active' ?
              <div className="text-success" style={{height:30}}>
                <Icon style={{fontSize:20}} type="check-circle" />
                <span style={{paddingLeft:5}}>所有职能经理已确认任务清单</span>
              </div>
            :
            <div>
              <p style={{margin:'0 0 5px 5px'}}>
                <span className="text-warning">职能经理清单确认状态：</span>
                <span className="text-gray">（灰色：未确认，白色：已确认）</span>
              </p>
              {
                _.map(state.confirmFileTaskListDatas, function(item, key){
                  return (
                      <span style={{padding:2}} key={key}>
                        {
                          item.isComfirm ?
                            <Button type="dashed" onClick={_self.showRefusedModal.bind(null, item)}>{item.role}</Button>
                          :
                            <Button disabled type="dashed">{item.role}</Button>
                        }
                      </span>
                    )
                })
              }
            </div>
          }

        </div>

        <Form inline onSubmit={this.handleSubmit} style={{margin:'10px 0'}}>
          <FormItem
            {...formItemLayout}
          >
            <Input placeholder="请输入阶段" {...getFieldProps('stageName', { initialValue: '' })} />
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            <Input placeholder="请输入任务" {...getFieldProps('taskName', { initialValue: '' })} />
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            <Input placeholder="请输入文件任务" {...getFieldProps('fileTaskName', { initialValue: '' })} />
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            <Input placeholder="请输入角色" {...getFieldProps('ownerRole', { initialValue: '' })} />
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            <Input placeholder="请输入编写人" {...getFieldProps('ownerName', { initialValue: '' })} />
          </FormItem>
          <FormItem
            {...formItemLayout}
          >
            <Button type="primary" htmlType="submit">搜索</Button>
          </FormItem>
        </Form>

        <Table
          columns={columns}
          pagination={{ pageSize:10 }}
          dataSource={state.formDatas} />

        <p style={{textAlign:'right'}}>共：<span className="text-warning">{state.formDatas.length}</span> 条记录</p>
        <div style={{width:'100%',margin:'15px auto',textAlign:'center'}}>
          {
            state.projectStatus == 'active' ?
              <div className="text-success" style={{height:30}}>
                <Icon style={{fontSize:20}} type="check-circle" />
                <span style={{paddingLeft:5}}>你已确认以上任务清单</span>
              </div>
            :
              <Popconfirm title="确认当前各人员的文件清单吗？" onConfirm={this.managerConfirmTaskFileList}>
                <Button type="primary">同意任务清单</Button>
              </Popconfirm>
          }
        </div>

      </Spin>
    );
  }
});

CheckTaskFileList = Form.create()(CheckTaskFileList);

export default CheckTaskFileList;