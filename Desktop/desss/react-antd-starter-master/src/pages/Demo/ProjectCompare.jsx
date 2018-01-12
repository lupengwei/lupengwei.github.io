import React from 'react';
import { Form, Table, Select, Button, Icon, Row, Col, Checkbox } from 'antd';

import styles from './Common.less'

//ant
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

//main
let ProjectCompare = React.createClass({
  render() {

  	const columns = [{
		  title: '项目信息',
		  dataIndex: 'name0',
		  width: 150,
		  fixed: 'left'
		}, {
		  title: '重庆三号线项目部',
		  dataIndex: 'name1',
		  width: 200,
		}, {
		  title: '重庆环线项目部',
		  dataIndex: 'name2',
		  width: 200,
		}];

		const data = [
			{name0: '中标日期',name1: '2016-01-12',name2: '2016-01-12'},
			{name0: '中标金额（万）',name1: '7820',name2: '2323'},
			{name0: '销售负责人',name1: '张伟',name2: '张伟'},
			{name0: '合同签署日期',name1: '2016-12-12',name2: '2016-12-12'},
			{name0: '合同金额（万）',name1: '6002',name2: '233'},
			{name0: '合同工期（月）',name1: '48',name2: '36'},
			{name0: '合同类型',name1: '总包',name2: '总包'},
			{name0: '项目范围',name1: 'ATP、ATO、ATS、 BDMS、 DCS 、MSS、正线联锁、车辆段、停车场联锁、计轴、电源屏、UPS、蓄电池、LTE、安全认证、施工、设计、信号机、转辙机、光缆、电缆、轨道电路、微机监测、道岔缺口监测',name2: '正线联锁、车辆段、停车场联锁'},
			{name0: '自供货范围',name1: 'ATP、ATO、ATS、安全认证',name2: '正线联锁、停车场联锁'},
			{name0: '分包商',name1: '一堆分包商信息...',name2: '又是一堆分包商信息...'},
			{name0: '建设管理单位',name1: '重庆轨道集团',name2: '重庆轨道集团'},
			{name0: '业主代表',name1: '重庆轨道集团信号系统管理办公室',name2: '重庆轨道集团信号系统管理办公室'},
			{name0: '业主联系电话',name1: '023-6812379',name2: '023-6812379'},
			{name0: '运营单位',name1: '重庆轨道集团运营公司',name2: '重庆轨道集团运营公司'},
			{name0: '运营负责人',name1: '李冰',name2: '李冰'},
			{name0: '运营联系电话',name1: '023-6862368',name2: '023-6862368'},
			{name0: '业主设计单位',name1: '重庆轨道设计院',name2: '重庆轨道设计院'},
			{name0: '业主设计负责人',name1: '张合',name2: '/'},
			{name0: '业主设计联系电话',name1: '023-6823680',name2: '/'},
			{name0: '信号监理单位',name1: '武汉XX信号监理建设',name2: '/'},
			{name0: '信号监理工程师',name1: '王珂',name2: '/'},
			{name0: '信号监理联系电话',name1: '0571-98232343',name2: '/'},
			{name0: '施工监理单位',name1: '/',name2: '/'},
			{name0: '施工监理工程师',name1: '/',name2: '/'},
			{name0: '施工监理联系电话',name1: '/',name2: '/'},
			{name0: '施工单位',name1: '/',name2: '/'},
			{name0: '施工项目经理',name1: '/',name2: '/'},
			{name0: '施工联系电话',name1: '/',name2: '/'},
			{name0: '车辆供货单位',name1: '/',name2: '/'},
			{name0: '车辆项目经理',name1: '/',name2: '/'},
			{name0: '车辆联系电话',name1: '/',name2: '/'}
		];


		const plainOptions = ['重庆三号线项目部','重庆环线项目部','贵阳项目部','乌鲁木齐项目部'];

  	return (
	  	<div>
	  		<div style={{marginBottom:15,paddingBottom:15,border:'1px solid #DCDCDC',borderRadius:10}}>

  				<Row style={{margin:'15px auto'}}>
  					<Col span={2} style={{textAlign:'right'}}>您已选择：</Col>
  					<Col span={22}>
		  				<span className={styles['desp-selected-item']}>重庆环线项目部 <Icon type="cross" className={styles['closed']}/></span>
		  				<span className={styles['desp-selected-item']}>重庆三号线项目部 <Icon type="cross" className={styles['closed']}/></span>
  					</Col>
  				</Row>

  				<Row>
  					<Col span={2} style={{textAlign:'right'}}>比对项目：</Col>
  					<Col span={22}>
				    	<CheckboxGroup className="ant-checkbox-vertical" options={plainOptions} />
  					</Col>
  				</Row>

  			</div>
	  		<Table
	  			columns={columns}
	  			dataSource={data}
	  			pagination={false}
	  			scroll={{ x: 1300, y: document.body.clientHeight - 200 }}
  			/>
	  	</div>
		)
  }
});

export default ProjectCompare;