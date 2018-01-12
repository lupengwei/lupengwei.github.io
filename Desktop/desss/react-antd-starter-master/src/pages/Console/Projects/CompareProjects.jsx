import React from 'react';
import _ from 'lodash';
import moment from 'moment';

import { Form, Table, Select, Button, Icon, Row, Col, Checkbox, Spin, message } from 'antd';

import { getAllProjects } from '../../../services/api';

import styles from '../Common.less'

//ant
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

//main
let CompareProjects = React.createClass({
	getInitialState() {
		return {
			loading: true,
			projects: [],
			selectedCondition: [], //筛选条件
			selectedProjects: [], //已选中的项目
			compareDatas: [], //对比结果
			compareColumns: [], //表头
		}
	},
	componentDidMount() {
		this.getProjects();
	},
	getProjects() {
		let _self = this;
		getAllProjects().then((res) => {
			let datas = res.jsonResult.projects;
			let tempArray = [];

			datas.map((item) => {
				if(item.type == 'project') return tempArray.push(item); 
			})

			_self.setState({ projects: tempArray, loading: false });

		})
	},
	selectProjects(e) {
		let tempArray = [],
				_self = this;

		e.map((item1) => {
			_self.state.projects.map((item2) => {
				if(item1 == item2.name) return tempArray.push(item2)
			})
		})

		_self.setState({ selectedCondition: e, selectedProjects: tempArray });

	},
	beginCompare() {

		this.setState({ loading: true });

		//开始对比
		let _self = this;

		let listItems = [
			{field:'',title: '基础信息'},
			{field:'name',title: '项目简称'},
			{field:'fullname',title: '项目全称'},
			{field:'number',title: '项目编号'},
			{field:'description',title: '项目描述'},
			{field:'sszgs',title: '所属子公司'},
			{field:'htlx',title: '合同类型'},
			{field:'',title: '招标信息'},
			{field:'zbrq',title: '招标日期'},
			{field:'zbje',title: '招标金额（万）'},
			{field:'xsfzr',title: '销售负责人'},
			{field:'',title: '合同信息'},
			{field:'htqsrq',title: '合同签署日期'},
			{field:'htje',title: '合同金额（万）'},
			{field:'htgq',title: '合同工期（月）'},
			{field:'',title: '供货及分包信息'},
			{field:'xmfw',title: '项目范围'},
			{field:'zghfw',title: '自供货范围'},
			{field:'Partners',title: '分包商'},
			{field:'',title: '建设单位信息'},
			{field:'jsgldw',title: '建设管理单位'},
			{field:'yzdb',title: '业主代表'},
			{field:'yzlxdh',title: '业主联系电话'},
			{field:'',title: '运营单位信息'},
			{field:'yydw',title: '运营单位'},
			{field:'yyfzr',title: '运营负责人'},
			{field:'yylxdh',title: '运营联系电话'},
			{field:'',title: '业主设计单位信息'},
			{field:'yzsjdw',title: '业主设计单位'},
			{field:'yzsjfzr',title: '业主设计负责人'},
			{field:'yzsjlxdh',title: '业主设计联系电话'},
			{field:'',title: '监理单位信息'},
			{field:'xhjldw',title: '信号监理单位'},
			{field:'xhjlgcs',title: '信号监理工程师'},
			{field:'xhjllxdh',title: '信号监理联系电话'},
			{field:'',title: '施工单位信息'},
			{field:'sgjldw',title: '施工监理单位'},
			{field:'sgjlgcs',title: '施工监理工程师'},
			{field:'sgjllxdh',title: '施工监理联系电话'},
			{field:'sgdw',title: '施工单位'},
			{field:'sgxmjl',title: '施工项目经理'},
			{field:'sglxdh',title: '施工联系电话'},
			{field:'',title: '车辆单位信息'},
			{field:'clghdw',title: '车辆供货单位'},
			{field:'clxmjl',title: '车辆项目经理'},
			{field:'cllxdh',title: '车辆联系电话'},
		];

		let selectedDatas = _self.state.selectedProjects; //已选择项目
		let datas = [];
		let columns = [{
		  title: '项目信息',
		  dataIndex: 'name0',
		  width: 150,
		  fixed: 'left',
		  render: (text, record) => {
				let conditionDatas = ['基础信息','招标信息','合同信息','供货及分包信息','建设单位信息','运营单位信息','业主设计单位信息','监理单位信息','施工单位信息','车辆单位信息'];
		  	if(_.indexOf(conditionDatas, record.name0) == -1) {
			  	return (<span className="text-gray">{text}</span>);
		  	}else {
			  	return (<b className="text-warning">【{text}】</b>);
		  	}
		  }
		}];

		//表头
		selectedDatas.map((item, index) => {
			let tempJson = {};

			tempJson.title = item.name;
		  tempJson.dataIndex = 'name'+(index+1).toString();
		  tempJson.width = 200;
		  tempJson.render = (text, record) => {
		  	if(record.name0 == '分包商') {

		  		let fbsHtml = [];

		  		if(text.length != 0) {
			  		text.map((item, index) => {
			  			if(text.length == index+1) {
			  				//最后一个
					  		fbsHtml.push(
					  			<div key={index} style={{marginBottom:10}}>
					  				<p><span className="text-gray">分&nbsp;&nbsp;包&nbsp;&nbsp;商：</span>{item.name}</p>
					  				<p><span className="text-gray">项目经理：</span>{item.manager}</p>
					  				<p><span className="text-gray">联系电话：</span>{item.contact}</p>
					  			</div>
				  			);
			  			}else {
					  		fbsHtml.push(
					  			<div key={index} style={{marginBottom:10,paddingBottom:10,borderBottom:'1px dashed #F1F1F1'}}>
					  				<p><span className="text-gray">分&nbsp;&nbsp;包&nbsp;&nbsp;商：</span>{item.name}</p>
					  				<p><span className="text-gray">项目经理：</span>{item.manager}</p>
					  				<p><span className="text-gray">联系电话：</span>{item.contact}</p>
					  			</div>
				  			);
			  			}
			  		})
		  		}else {
		  			fbsHtml.push(<span key="0">/</span>);
		  		}

		  		return (<div>{fbsHtml}</div>);

		  	}else {
			  	return (<span>{text}</span>);
		  	}
		  };

		  columns.push(tempJson);
		})

		//数据
		listItems.map((item1, index1) => {

			let tempJson = {};

			tempJson['name0'] = item1.title;
			selectedDatas.map((item2, index2) => {

				if(item1.field == 'Partners') {
					tempJson['name'+(index2+1).toString()] = item2[item1.field];
				}else if(item1.field == 'zbrq' || item1.field == 'htqsrq') {
					tempJson['name'+(index2+1).toString()] = moment(item2[item1.field]).format('YYYY-MM-DD') || '/';
				}else if(!item1.field) {
					// tempJson['name'+(index2+1).toString()] = <Icon type="ellipsis" />;
					tempJson['name'+(index2+1).toString()] = '';
				}else {
					tempJson['name'+(index2+1).toString()] = item2[item1.field] || '/';
				}

			})

			datas.push(tempJson);

		})

		message.success("项目信息比对成功");

		_self.setState({
			compareDatas: datas,
			compareColumns: columns,
			loading: false
		});

	},
  render() {
  	let state = this.state,
  			props = this.props,
  			_self = this;

		//所有项目
		let plainOptions = [];
		state.projects.map((item) => {
			plainOptions.push(item.name);
		})

  	return (
	  	<Spin spinning={state.loading} >
	  		<div style={{marginBottom:15,paddingBottom:15,border:'1px solid #DCDCDC',borderRadius:10}}>

  				<Row style={{margin:'15px auto'}}>
  					<Col span={2} style={{textAlign:'right'}}>比对项目：</Col>
  					<Col span={22}>
				    	<CheckboxGroup className="ant-checkbox-vertical" options={plainOptions} onChange={this.selectProjects} />
  					</Col>
  				</Row>

  				<Row>
  					<Col span={2} style={{textAlign:'right'}}>您已选择：</Col>
  					<Col span={22}>
  					{
  						state.selectedCondition.map((item, index) => {
  							return (
					  				<span key={index} className={styles['desp-selected-item']}>{item}</span>
								)
  						})
  					}
  					{
  						_.size(state.selectedCondition) == 0 ?
  							<div className={styles['no-content-tips']}>请先选择项目，再进行比较 ~</div>
  						:
								<Button size="small" type="primary" onClick={this.beginCompare} style={{marginLeft:15}}>查看详情</Button>
  					}
  					</Col>
  				</Row>

  			</div>
	  		<Table
	  			columns={state.compareColumns}
	  			dataSource={state.compareDatas}
	  			pagination={false}
					size="middle"
					scroll={{ x: state.selectedProjects.length * 400, y: document.body.clientHeight - 170 }}
  			/>
	  	</Spin>
		)
  }
});

export default CompareProjects;