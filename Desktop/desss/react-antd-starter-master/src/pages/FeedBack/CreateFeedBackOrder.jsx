import React from 'react';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import { Button, Icon, message, Spin, Form, Input, Popconfirm, Row, Col, Alert, Table } from 'antd';

import { createFeedBackOrder, getFeedBackOrders } from '../../services/api';

import styles from './Common.less';

//ant初始组件
const FormItem = Form.Item;

//main
let CreateFeedBackOrder = React.createClass({
	getInitialState() {
		return {
			loading: true,
			taskDatas: [],
		}
	},
	componentDidMount() {
		this.showFeedBack();
	},
	showFeedBack() {
		let _self = this;
		getFeedBackOrders().then((res) => {
			let datas = res.jsonResult.feedbacks;
			datas = _.sortBy(datas, [function(o) { return -o.createdAt; }]);
			let tempArray = [];

			datas.map((item, key) => {
				let tempJson = {};

				tempJson.id = key+1;
				tempJson.content = item.content;
				tempJson.reply = item.reply || '/';
				tempJson.name = item.User.name;

				tempArray.push(tempJson);
			})

			_self.setState({ taskDatas: tempArray, loading: false });
		})
	},
	handleSubmit() {
		let formData  = this.props.form.getFieldsValue();

		if(!formData.content) return message.warning('请输入必要的反馈信息，Thx！');

		let datas = {
				content: formData.content
			},
			_self = this;

		_self.setState({ loading: true });

		createFeedBackOrder(JSON.stringify(datas)).then((res) => {
			message.success("反馈意见提交成功，感谢您的参与！");
			_self.setState({ loading: false });
			setTimeout(() => {
				_self.showFeedBack();
				_self.props.form.resetFields();
			}, 1000)
		})
	},
	render() {
		let state = this.state;

		const { getFieldProps } = this.props.form;

		const columns = [{
		  title: '序号',
		  dataIndex: 'id',
		  width: '5%'
		}, {
		  title: '留言者',
		  dataIndex: 'name',
		  width: '5%'
		}, {
		  title: '意见',
		  dataIndex: 'content',
		  width: '40%'
		}, {
		  title: '反馈',
		  dataIndex: 'reply',
		  width: '40%'
		}];

		return (
			<div>
				<Form horizontal>
			    <Row>
			    	<Col span={16} offset={3}>
				      <Input {...getFieldProps('content', { initialValue: '' })} type="textarea" rows={4} placeholder="请输入您的意见反馈信息" />
			    	</Col>
		    	</Row>
			    <Row style={{margin:'15px auto',textAlign:'right'}}>
			    	<Col span={3} offset={16}>
				    	<Popconfirm title="确定要提交此反馈吗？" onConfirm={this.handleSubmit}>
				    		<Button type="primary">提交反馈</Button>
				    	</Popconfirm>
				    </Col>
			    </Row>
			  </Form>

			  <div>
				  <div className="bg-gray"><i className="iconfont icon-wenjuandiaoyanfuwu"></i> 反馈意见列表</div>
				  <Table
				  	columns={columns}
				  	dataSource={state.taskDatas}
				  	pagination={{ pageSize:10 }}
			  	/>
			  </div>
			</div>
		)
	}
});

CreateFeedBackOrder = Form.create()(CreateFeedBackOrder);

export default CreateFeedBackOrder;