import React from 'react';
import ReactDOM from 'react-dom';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';

import { Transfer, Form, Input, Button, message, Radio, Row, Col, Select, Checkbox } from 'antd';

import styles from './Common.less';

//ant
const RadioGroup = Radio.Group;
const Option     = Select.Option;
const CheckboxGroup = Checkbox.Group;

var datas = [
  {
    alias: 'P1',
    name: '投标阶段',
    key: 1,
    task: [
      {value:1, label: '市场拓展/技术交流'},
      {value:2, label: '投标文件（技术册）编制'},
      {value:3, label: '投标书（除技术册）编制'},
      {value:4, label: '投标'},
      {value:5, label: '总包合同谈判'},
      {value:6, label: '总包合同签署'},
      {value:7, label: '设备需求统计'},
      {value:8, label: '分包合同谈判'},
      {value:9, label: '分包合同签署'}
    ]
  },
  {
    alias: 'P2',
    name: '项目启动',
    key: 2,
    task: [
      {value:1, label: '任命项目经理'},
      {value:2, label: '编制并审批项目章程'},
      {value:3, label: '组建项目团队'},
      {value:4, label: '召开项目启动会'}
    ]
  },
  {
    alias: 'P3',
    name: '项目策划',
    key: 3,
    task: [
      {value:1, label: '项目流程定义'},
      {value:2, label: '建立管理体系/项目整体策划(含分包商管理）'},
      {value:3, label: '产品老化管理策划'},
      {value:4, label: '制定目标计划（含分包商管理）'},
      {value:5, label: '制定项目预算'},
      {value:6, label: '项目沟通管理策划（含分包商管理）'},
      {value:7, label: '安全保证策划'},
      {value:8, label: '质量保证策划'},
      {value:9, label: '配置管理策划'},
      {value:10, label: 'V&V策划'},
      {value:11, label: '室内测试策划'},
      {value:12, label: '现场测试策划'}
    ]
  },
  {
    alias: 'PX1',
    name: '采购管理',
    key: 4,
    task: [
      {value:1, label: '分包商审核'},
      {value:2, label: 'FAI/工厂验收'}
    ]
  },
  {
    alias: 'PX2',
    name: '项目监控',
    key: 5,
    task: [
      {value:1, label: '项目例会实施'},
      {value:2, label: '项目进度管理（含分包商管理）'},
      {value:3, label: '项目范围管理'},
      {value:4, label: '项目成本管理'},
      {value:5, label: 'LCC实际费用监控'},
      {value:6, label: '项目人力资源管理'},
      {value:7, label: '项目风险管理（含分包商管理）'},
      {value:8, label: '项目问题管理'},
      {value:9, label: '现场管理（含分包商管理）'},
      {value:10, label: '文档管理（含分包商管理）'}
    ]
  },
  {
    alias: 'PX3',
    name: '安全保证',
    key: 6,
    task: [
      {value:1, label: '危险源管理'}
    ]
  },
  {
    alias: 'PX4',
    name: '质量保证',
    key: 7,
    task: [
      {value:1, label: '项目质量审核（阶段审核、生产和现场的专项审核等）'},
      {value:2, label: '分包/转包商审核'},
      {value:3, label: '项目质量度量'},
      {value:4, label: '缺陷管理、变更管理和FRACAS的跟踪和监督'}
    ]
  },
  {
    alias: 'PX5',
    name: 'VV管理',
    key: 8,
    task: [
      {value:1, label: '同行评审'},
      {value:2, label: '需求追溯的审查'},
      {value:3, label: '测试活动和结果的审查'}
    ]
  },
  {
    alias: 'PX6',
    name: '配置管理',
    key: 9,
    task: [
      {value:1, label: '建立和维护配置库'},
      {value:2, label: '配置标识'},
      {value:3, label: '配置状态纪实'},
      {value:4, label: '配置审计'},
      {value:5, label: '基线管理'},
      {value:6, label: '变更控制'}
    ]
  },
  {
    alias: 'PX7',
    name: '其他管理',
    key: 10,
    task: [
      {value:1, label: 'FRACAS流程'},
      {value:2, label: '缺陷管理流程'},
      {value:3, label: '用户需求的沟通和管理'},
      {value:4, label: '客户满意度调查和分析'}
    ]
  },
  {
    alias: 'P5',
    name: '系统要求',
    key: 11,
    task: [
      {value:1, label: 'RAM策划'},
      {value:2, label: 'LCC策划'}
    ]
  },
  {
    alias: 'P6',
    name: '系统设计',
    key: 12,
    task: [
      {value:1, label: '子系统规格描述'},
      {value:2, label: '需求偏差分析'},
      {value:3, label: '线路运营能力分析'},
      {value:4, label: '信号系统配置'},
      {value:5, label: '各技术方案设计'},
      {value:6, label: '系统接口设计'},
      {value:7, label: '平面布置图编制'},
      {value:8, label: '系统设计图纸编制'},
      {value:9, label: '设计联络'},
      {value:10, label: '系统危险源分析'}
    ]
  },
  {
    alias: 'P7-1',
    name: '工程设计',
    key: 13,
    task: [
      {value:1, label: '联锁表编制'},
      {value:2, label: '数据准备设计'},
      {value:3, label: '工程BOM搭建（包括工程类产品设计）'},
      {value:4, label: '接口码位编制'},
      {value:5, label: '系统参数编制'},
      {value:6, label: '轨旁设备信息统计'},
      {value:7, label: 'IP地址规划'},
      {value:8, label: '联锁I/O信息表编制'},
      {value:9, label: '产品手册的工程更新'},
      {value:10, label: '数据准备活动策划'},
      {value:11, label: '数据录入'},
      {value:12, label: '现场用数据表格编制'},
      {value:13, label: '现场施工设计'},
      {value:14, label: '接口危险源分析'},
      {value:15, label: '工程接口模块设计'},
      {value:16, label: '辅助工具获取'}
    ]
  },
  {
    alias: 'P7-2',
    name: '测试平台搭建',
    key: 14,
    task: [
      {value:1, label: '测试工装开发'},
      {value:2, label: '测试平台搭建'}
    ]
  },
  {
    alias: 'P7-3',
    name: '安装调试策划',
    key: 15,
    task: [
      {value:1, label: '安装督导策划'},
      {value:2, label: '项目室内测试策划'},
      {value:3, label: '现场单体调试策划'},
      {value:4, label: '现场接口调试策划'},
      {value:5, label: '现场确认测试策划'},
      {value:6, label: '产品手册的工程更新'},
      {value:7, label: '运行环境说明书获取'}
    ]
  },
  {
    alias: 'P8',
    name: '批量生产',
    key: 16,
    task: [
      {value:1, label: '生产任务下达'},
      {value:2, label: '生产实施'},
      {value:3, label: '编制硬件配置单'}
    ]
  },
  {
    alias: 'P9',
    name: '产品供货和安装',
    key: 17,
    task: [
      {value:1, label: '下达特殊包装任务'},
      {value:2, label: '订单调拨'},
      {value:3, label: '产品运输'},
      {value:4, label: '开箱检验'},
      {value:5, label: ''},
      {value:6, label: '施工技术交底'},
      {value:7, label: '首件定标'},
      {value:8, label: '安装督导'},
      {value:9, label: '安装质量检查'},
      {value:10, label: 'AP模块参数配置'},
      {value:11, label: '工程定测'},
      {value:12, label: '测试版本控制'},
      {value:13, label: '分包商测试版本控制'},
      {value:14, label: '分包商数据管理'},
      {value:15, label: '操作与维护危险源分析'},
      {value:16, label: '分包商产品发布'},
      {value:17, label: '硬件设备配置管理'}
    ]
  },
  {
    alias: 'P10',
    name: '单体调试',
    key: 18,
    task: [
      {value:1, label: '打点定测'},
      {value:2, label: '订单调拨'},
      {value:3, label: '数据变更分析/更新数据'},
      {value:4, label: '室内数据测试'},
      {value:5, label: '室内集成测试'},
      {value:6, label: '室内确认测试'},
      {value:7, label: 'RAM证明策划'},
      {value:8, label: '整理安全证明文件'},
      {value:9, label: '系统间接口调试'},
      {value:10, label: '现场确认测试'},
      {value:11, label: '见证测试'}
    ]
  },
  {
    alias: 'P11',
    name: '试运行',
    key: 19,
    task: [
      {value:1, label: '综合联调'},
      {value:2, label: '设备预验收'},
      {value:3, label: '系统维护与维护安全管理'},
      {value:4, label: '144小时验证'},
      {value:5, label: '交付管理'},
      {value:6, label: '试运行评估'},
      {value:7, label: '整理安全证明文件'}
    ]
  },
  {
    alias: 'P12',
    name: '试运营',
    key: 20,
    task: [
      {value:1, label: '跟踪系统试运营'},
      {value:2, label: '售后服务'},
      {value:3, label: '老化管理活动'},
      {value:4, label: '执行RAM证明'}
    ]
  },
  {
    alias: 'P13',
    name: '售后交接',
    key: 21,
    task: [
      {value:1, label: '售后交接'}
    ]
  },
  {
    alias: 'P14',
    name: '项目验收',
    key: 22,
    task: [
      {value:1, label: '项目验收'},
      {value:2, label: '项目结题'}
    ]
  }
];

//main
let DivideStage = React.createClass({
  getInitialState: function() {
    return {
      standardTaskTemp: [], //中间状态，搜索用
      standardTask: [], //每一次赋值都要检查是否被选中
      projectTask: []
    };
  },
  handleChange(value) {
    //清除standardTask中已被选中的任务
    this.setState({
      standardTask: datas[value].task,
      standardTaskTemp: datas[value].task
    });
  },
  handleChangeToProject(value) {
    //获取阶段任务
    var res = this.state.standardTask.find((e) => e.label == value);
    //移除选中阶段任务
    _.remove(this.state.standardTask, function(e) { return e.label == value; });
    //获取选中项目任务
    var arr = this.state.projectTask;
    arr.push(res);

    this.setState({ projectTask: arr });
  },
  handleChangeToLib(value) {
    //获取阶段任务
    var res = this.state.projectTask.find((e) => e.label == value);
    //移除选中阶段任务
    _.remove(this.state.projectTask, function(e) { return e.label == value; });
    //获取选中项目任务
    var arr = this.state.standardTask;
    arr.push(res);

    this.setState({ standardTask: arr });
  },
  searchStandardTask(event){
    if(event.target.value){
      var tempArr = [];
      this.state.standardTaskTemp.map((item) => {
        if(item.label.includes(event.target.value)) tempArr.push(item);
      });
      this.setState({ standardTask:tempArr });
    }else {
      //清除standardTask中已被选中的任务
    }
  },
  removeManyForStandardTask() {
    //返回数组
    if(_.size(state.projectTask) > 0){
      this.state.projectTask.map((item1) => {
        this.state.standardTaskTemp.map((item2) => {
          if(item1.label == item2.label){
            //
          }
        });
      });
    }
  },
  render: function() {
    var props = this.props,
        state = this.state,
        _self = this;

    return (
      <div style={{height:'100%'}}>
        <QueueAnim delay={100} type="bottom" style={{display:'inline-flex',height:'100%'}}>

          <div key="a" style={{display:'inline-flex',height:'100%',flexDirection: 'column',width:250,marginRight:15,border: '1px solid #D1D1D1',borderRadius:6}}>
            <div className={styles['desp-board-header']}>
              <div className={styles['desp-board-title']}>
                项目全周期阶段
                <Button disabled type="primary" size="small" className="pull-right" style={{marginTop:5}}>全周期任务</Button>
              </div>
              <div>
                <Select showSearch
                  style={{ width:'100%',padding:5 }}
                  placeholder="请选择阶段"
                  optionFilterProp="children"
                  notFoundContent="无法找到"
                  onChange={this.handleChange}
                >
                  {
                    datas.map((item, key) => {
                      return (<Option key={key} value={key}>{item.alias}-{item.name}</Option>);
                    })
                  }
                </Select>
              </div>
            </div>
            <div className={styles['desp-board-content']}>
            </div>
          </div>

          <div key="b" style={{display:'inline-flex',height:'100%',flexDirection: 'column',width:300,marginRight:15,border: '1px solid #D1D1D1',borderRadius:6}}>
             <div className={styles['desp-board-header']}>
              <div className={styles['desp-board-title']}>标准配置清单（阶段任务）</div>
              <div style={{padding:5}}><Input placeholder="请输入搜索内容" onChange={this.searchStandardTask} /></div>
            </div>
            <div className={styles['desp-board-content']}>
              {
                state.standardTask.map((item, key) => {
                  return (<div key={key} className={styles['desp-board-content-item']} onClick={this.handleChangeToProject.bind(this,item.label)}><Checkbox/> {item.label}<br /></div>)
                })
              }
            </div>
          </div>

          <div key="c" style={{display:'inline-flex',height:'100%',flexDirection: 'column',width:300,marginRight:15,border: '1px solid #D1D1D1',borderRadius:6}}>
             <div className={styles['desp-board-header']}>
              <div className={styles['desp-board-title']}>项目配置清单</div>
              <div style={{padding:5}}>
                <Select showSearch
                  style={{ width: '100%' }}
                  placeholder="请选择阶段"
                  optionFilterProp="children"
                  notFoundContent="无法找到"
                >
                  <Option value="jack">投标阶段</Option>
                  <Option value="lucy">项目启动</Option>
                  <Option value="tom">项目策划</Option>
                </Select>
              </div>
            </div>
            <div className={styles['desp-board-content']}>
              {
                _.map(state.projectTask, (item, key) => {
                  return (<div key={key} className={styles['desp-board-content-item']} onClick={this.handleChangeToLib.bind(this,item.label)}><Checkbox checked={true} /> {item.label}<br /></div>)
                })
              }
            </div>
          </div>

        </QueueAnim>
      </div>
    );
  }
});

export default DivideStage;