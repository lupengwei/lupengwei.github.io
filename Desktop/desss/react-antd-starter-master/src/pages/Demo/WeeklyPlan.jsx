import React from 'react';

import moment from 'moment';

import { Menu, Icon, message, Table, Modal } from 'antd';
import styles from './Common.less';

//ant初始组件
const confirm = Modal.confirm;

//main
const WeeklyPlan = React.createClass({
	getInitialState() {
		return {
			dateDatas: [],
		}
	},
	componentDidMount() {

	},
	deleteConfirm() {
	  confirm({
	    title: '您是否确认要删除这项内容',
	    content: '',
	    onOk() {
	      console.log("删意已决");
	    },
	    onCancel() {},
	  });
	},
	editTask() {
		console.log("编辑");
	},
	render() {
		let state = this.state,
				props = this.props,
				_self = this;

		const columns = [
		  { title: '姓名', width: 80, dataIndex: 'name', key: 'name', fixed: 'left' },
		  { title: '2016/11/21',
			  dataIndex: 'address',
			  key: '1',
			  width: 200,
			  render: (text) => {
			  	return (
			  		<div className={styles['desp-item-container']}>
			  			{text}
			  			<span className={styles['desp-item-masklayer']}>
			  				<Icon type="edit" onClick={this.editTask} />&nbsp;&nbsp;
			  				<Icon type="cross-circle-o" onClick={this.deleteConfirm} />
		  				</span>
			  		</div>
		  		)
			  }
			},
		  { title: '2016/11/22', dataIndex: 'address', key: '2', width: 200 },
		  { title: '2016/11/23', dataIndex: 'address', key: '3', width: 200 },
		  { title: '2016/11/24', dataIndex: 'address', key: '4', width: 200 },
		  { title: '2016/11/25', dataIndex: 'address', key: '5', width: 200 },
		  { title: '2016/11/26', dataIndex: 'address', key: '6', width: 200 },
		  { title: '2016/11/27', dataIndex: 'address', key: '7', width: 200 },
		  { title: '2016/11/28', dataIndex: 'address', key: '8', width: 200 },
		];

		const data = [];
		for (let i = 0; i < 10; i++) {
		  data.push({
		    key: i,
		    name: `张三三${i}`,
		    age: 32,
		    address: `交控科技股份有限公司交控科技股份有限公司${i}`,
		  });
		}

		return (
			<div style={{width:'100%', overflow:'auto',textAlign:'center'}}>
				<Table
					columns={columns}
					dataSource={data}
					scroll={{ x: 1500, y: true }}
					pagination={false}
					bordered
				/>
			</div>
		)
	}
});

export default WeeklyPlan;