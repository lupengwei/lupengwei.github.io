import React from 'react';
import { Table, Form, Input, Button, Icon, Spin, Select, Popconfirm, message } from 'antd';

import {
	getAllUsers,
	getGlobalPositions,
	createGlobalPosition,
	deleteGlobalPosition
} from '../../../services/api';

import styles from '../Common.less'

//ant
const FormItem = Form.Item;
const Option = Select.Option;

//main
let SetGlobalLeaders = React.createClass({
	getInitialState() {
		return {
			loading: true,
			allUserChildren: [],
			positonDatas: [],
		};
	},
	componentDidMount() {
		this.showAllUsers();
		this.showGlobalUsers();
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

      _self.setState({ allUserChildren: children, loading: false });
    });
  },
  showGlobalUsers() {
  	let _self = this;

  	getGlobalPositions().then((res) => {
  		let datas = res.jsonResult.globalTitles;
  		let tempPositonDatas = [];

  		datas.map((item, key) => {
  			let tempJson = {};

  			tempJson.id = item.id;
  			tempJson.name = item.User.name;
  			tempJson.position = item.title;

  			tempPositonDatas.push(tempJson);
  		})

      _self.setState({ positonDatas: tempPositonDatas });
  	})
  },
  handleSubmit() {
  	let _self = this;
  	_self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      let datas = {
      	userId: formDatas.user.split('__')[0],
      	title: formDatas.position
      };

      //人员职位查重
      let flag = false;

      _.map(_self.state.positonDatas, (item) => {
      	if(item.position == formDatas.position) flag = true;
      })

      if(flag) return message.warning("该职位已经存在，如需改变，请在列表中修改！");

      _self.setState({ loading: true });

      createGlobalPosition(JSON.stringify(datas)).then((res) => {
      	_self.props.form.resetFields();
      	_self.showGlobalUsers();
      	_self.setState({ loading: false });
      	message.success("设置人员信息成功！");
      })

    });
  },
  handleDelete(positionId) {
  	let _self = this;
  	if(!positionId) return message.warning("获取职位信息失败！");

  	deleteGlobalPosition(positionId).then((res) => {
  		_self.showGlobalUsers();
    	message.success("删除职位信息成功！");
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
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			width: '30%',
      render: (text) => {
        return <center>{text}</center>;
      }
		}, {
			title: '职位',
			dataIndex: 'position',
			key: 'position',
			width: '50%',
      render: (text) => {
        return <center>{text}</center>;
      }
		}, {
			title: '操作',
			dataIndex: 'options',
			key: 'options',
			width: '20%',
			render: (text, record) => {
				return (
					<center>
						<Popconfirm title="确定删除此项吗？" placement="left" onConfirm={this.handleDelete.bind(null, record.id)}>
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
		        <FormItem
		          {...formItemLayout}
		          label="配置人员"
		        >
		        	<Select
	              showSearch
	              optionFilterProp="children"
	              notFoundContent="无法找到，请输入名字部分搜索"
	              style={{ width:'98%',marginBottom:5}}
	              placeholder="配置人员"
	              filterOption={desp_selectFilter}
	              {...getFieldProps('user', {rules: [{required: true,message:'配置人员'}]} )}
	            >
	              { state.allUserChildren }
	            </Select>
		        </FormItem>
		        <FormItem
		          {...formItemLayout}
		          label="职位"
		        >
              <Select
                showSearch
                placeholder="选择人员对应的职位"
                optionFilterProp="children"
                notFoundContent="无法找到"
                {...getFieldProps('position', {rules: [{required: true,message:'职位'}]} )}
              >
                <Option value="PMO轮值主席">PMO轮值主席</Option>
                <Option value="分管工程副总裁">分管工程副总裁</Option>
                <Option value="分管财务副总裁">分管财务副总裁</Option>
                <Option value="商务总监">商务总监</Option>
              </Select>
		        </FormItem>
		        <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 24 }}>
		          <Popconfirm title="确定要提交吗？" onConfirm={this.handleSubmit}>
								<Button type="primary">确认提交</Button>
		          </Popconfirm>
		        </FormItem>
	        </Form>
        </div>

        <Table
        	dataSource={state.positonDatas}
        	columns={columns}
        	pagination={false}
      	/>
      	<div style={{marginTop:15,textAlign:'right'}}>当前共有记录 <span className="text-danger">{state.positonDatas.length}</span> 条</div>

      </Spin>
    );
  }
});

SetGlobalLeaders = Form.create()(SetGlobalLeaders);

export default SetGlobalLeaders;