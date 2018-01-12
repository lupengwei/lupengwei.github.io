import React from 'react';
import { Form, Input, Select, Button, Icon, Row, Col, Alert, DatePicker, InputNumber } from 'antd';

import styles from './Common.less'

//ant
const FormItem = Form.Item;
const Option   = Select.Option;

//main
let ProjectInfo = React.createClass({
	handleSubmit() {
		let formDatas = this.props.form.getFieldsValue();
		console.log(formDatas)
	},
  render() {
  	const { getFieldProps } = this.props.form;
    const formItemLayoutCenter = {
      labelCol: { span: 11 },
      wrapperCol: { span: 13 },
    };
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };

  	return (
  		<div>

  			<FormItem>
        	<Button type="primary" onClick={this.handleSubmit}>提交</Button>
        </FormItem>

  			<Alert message="1、市场信息" type="info" />
        <div style={{margin:'15px 30px',padding:15,border:'1px dashed #BABABA',borderRadius:10}}>
	  			<Form horizontal>
		        <FormItem
		          label="中标日期"
		          {...formItemLayoutCenter}
		          style={{marginTop:5}}
		        >
		          <DatePicker {...getFieldProps('zbrq', { initialValue: null })} style={{width:200}} />
		        </FormItem>
		        <FormItem
		          label="中标金额（万）"
		          {...formItemLayoutCenter}
		          style={{marginTop:5}}
		        >
		          <Input {...getFieldProps('zbje', { initialValue: '' })} style={{width:200}} placeholder="输入中标金额" />
		        </FormItem>
		        <FormItem
		          label="销售负责人"
		          {...formItemLayoutCenter}
		          style={{marginTop:5}}
		        >
		          <Input {...getFieldProps('xsfzr', { initialValue: '' })} style={{width:200}} placeholder="输入销售负责人" />
		        </FormItem>
					</Form>
				</div>

        <div style={{marginTop:15}}><Alert message="2、合同信息" type="success" /></div>

        <div style={{margin:'15px 30px',padding:15,border:'1px dashed #BABABA',borderRadius:10}}>
					<Form horizontal>
		        <FormItem
		          label="合同签署日期"
		          {...formItemLayoutCenter}
		          style={{marginTop:5}}
		        >
		          <DatePicker {...getFieldProps('htqsrq', { initialValue: null })} style={{width:200}} />
		        </FormItem>
		        <FormItem
		          label="合同金额（万）"
		          {...formItemLayoutCenter}
		          style={{marginTop:5}}
		        >
		          <Input {...getFieldProps('htje', { initialValue: '' })} style={{width:200}} placeholder="输入合同金额" />
		        </FormItem>
		        <FormItem
		          label="合同工期（月）"
		          {...formItemLayoutCenter}
		          style={{marginTop:5}}
		        >
		          <InputNumber {...getFieldProps('htgq', { initialValue: '1' })} min={1} max={60} />
		        </FormItem>
		        <FormItem
		          label="合同类型"
		          {...formItemLayoutCenter}
		          style={{marginTop:5}}
		        >
		          <Select {...getFieldProps('htlx', { initialValue: '集成总包' })} style={{ width: 120 }}>
					      <Option value="集成总包">集成总包</Option>
					      <Option value="分包">分包</Option>
					    </Select>
		        </FormItem>
	        </Form>
        </div>

        <div style={{marginTop:15}}><Alert message="3、项目信息" type="info" /></div>

        <div style={{margin:'15px 30px',padding:15,border:'1px dashed #BABABA',borderRadius:10}}>
	        <Form horizontal>
	        	<FormItem
		          label="项目名称"
		          {...formItemLayout}
		          style={{marginTop:5}}
		        >
		          <Input placeholder="输入项目名称" />
		        </FormItem>
	        	<FormItem
		          label="项目全称"
		          {...formItemLayout}
		          style={{marginTop:5}}
		        >
		          <Input placeholder="输入项目全称" />
		        </FormItem>
	        	<FormItem
		          label="项目编号"
		          {...formItemLayout}
		          style={{marginTop:5}}
		        >
		          <Input placeholder="输入项目编号" />
		        </FormItem>
	        	<FormItem
		          label="所属子公司"
		          {...formItemLayout}
		          style={{marginTop:5}}
		        >
		          <Select {...getFieldProps('sszgs', { initialValue: '重庆子公司' })} style={{ width: 120 }}>
					      <Option value="重庆子公司">重庆子公司</Option>
					      <Option value="天津子公司">天津子公司</Option>
					      <Option value="深圳子公司">深圳子公司</Option>
					    </Select>
		        </FormItem>
		        <FormItem
		          label="项目范围"
		          {...formItemLayout}
		          style={{marginTop:5}}
		        >
		          <Select
		          	multiple
		          	placeholder="请选择项目范围"
		          	style={{minWidth:300}}
		          	{...getFieldProps('xmfw', { initialValue: [] })}
	          	>
					      <Option value="ATP">ATP</Option>
								<Option value="ATO">ATO</Option>
								<Option value="ATS">ATS</Option>
								<Option value="BDMS">BDMS</Option>
								<Option value="DCS ">DCS</Option>
								<Option value="MSS">MSS</Option>
								<Option value="正线联锁">正线联锁</Option>
								<Option value="车辆段">车辆段</Option>
								<Option value="停车场联锁">停车场联锁</Option>
								<Option value="计轴">计轴</Option>
								<Option value="电源屏">电源屏</Option>
								<Option value="UPS">UPS</Option>
								<Option value="蓄电池">蓄电池</Option>
								<Option value="LTE">LTE</Option>
								<Option value="安全认证">安全认证</Option>
								<Option value="施工">施工</Option>
								<Option value="设计">设计</Option>
								<Option value="信号机">信号机</Option>
								<Option value="转辙机">转辙机</Option>
								<Option value="光缆">光缆</Option>
								<Option value="电缆">电缆</Option>
								<Option value="轨道电路">轨道电路</Option>
								<Option value="微机监测">微机监测</Option>
								<Option value="道岔缺口监测">道岔缺口监测</Option>
					    </Select>
		        </FormItem>
	        </Form>
        </div>

        <div style={{marginTop:15}}><Alert message="4、供货范围" type="success" /></div>

        <div style={{margin:'15px 30px',padding:15,border:'1px dashed #BABABA',borderRadius:10}}>
	        <div className="bg-gray text-warning">4-1、自供货范围</div>
	        <Form horizontal>
		        <FormItem
		          label="自供货范围"
			        style={{marginTop:5}}
			        {...formItemLayout}
		        >
		        	<Select
		          	multiple
		          	placeholder="请选择自供货范围"
		          	style={{minWidth:300}}
		          	{...getFieldProps('zghfw', { initialValue: [] })}
	          	>
					      <Option value="ATP">ATP</Option>
								<Option value="ATO">ATO</Option>
								<Option value="ATS">ATS</Option>
								<Option value="BDMS">BDMS</Option>
								<Option value="DCS ">DCS</Option>
								<Option value="MSS">MSS</Option>
								<Option value="正线联锁">正线联锁</Option>
								<Option value="车辆段">车辆段</Option>
								<Option value="停车场联锁">停车场联锁</Option>
								<Option value="计轴">计轴</Option>
								<Option value="电源屏">电源屏</Option>
								<Option value="UPS">UPS</Option>
								<Option value="蓄电池">蓄电池</Option>
								<Option value="LTE">LTE</Option>
								<Option value="安全认证">安全认证</Option>
								<Option value="施工">施工</Option>
								<Option value="设计">设计</Option>
								<Option value="信号机">信号机</Option>
								<Option value="转辙机">转辙机</Option>
								<Option value="光缆">光缆</Option>
								<Option value="电缆">电缆</Option>
								<Option value="轨道电路">轨道电路</Option>
								<Option value="微机监测">微机监测</Option>
								<Option value="道岔缺口监测">道岔缺口监测</Option>
					    </Select>
		        </FormItem>

		        <div className="bg-gray text-warning">4-2、分包供货信息</div>

		        <FormItem
		          label="ATP分包商"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('fbs1', { initialValue: '' })} placeholder="输入分包商名称" />
		        </FormItem>
		        <FormItem
		          label="分包商项目经理"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('fbsxmjl1', { initialValue: '' })} style={{width:200}} placeholder="输入分包商项目经理" />
		        </FormItem>
		        <FormItem
		          label="联系电话"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('fbslxdh1', { initialValue: '' })} style={{width:200}} placeholder="输入分包商联系电话" />
		        </FormItem>
	        </Form>
        </div>

        <div style={{marginTop:15}}><Alert message="5、对外关系" type="info" /></div>

        <div style={{margin:'15px 30px',padding:15,border:'1px dashed #BABABA',borderRadius:10}}>
	        <div className="bg-gray text-warning">5-1、建管单位信息</div>
	        <Form horizontal>
		        <FormItem
		          label="建设管理单位"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('jsgldw', { initialValue: '' })} placeholder="输入建设管理单位" />
		        </FormItem>
		        <FormItem
		          label="业主代表"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('yzdb', { initialValue: '' })} style={{width:200}} placeholder="输入业主代表" />
		        </FormItem>
		        <FormItem
		          label="业主联系电话"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('yzlxdh', { initialValue: '' })} style={{width:200}} placeholder="输入业主联系电话" />
		        </FormItem>

		        <div className="bg-gray text-warning">5-2、运营单位信息</div>
		        <FormItem
		          label="运营单位"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('yydw', { initialValue: '' })} placeholder="输入运营单位" />
		        </FormItem>
		        <FormItem
		          label="运营负责人"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('yyfzr', { initialValue: '' })} style={{width:200}} placeholder="输入运营负责人" />
		        </FormItem>
		        <FormItem
		          label="运营联系电话"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('yylxdh', { initialValue: '' })} style={{width:200}} placeholder="输入运营联系电话" />
		        </FormItem>

		        <div className="bg-gray text-warning">5-3、业主设计单位信息</div>
		        <FormItem
		          label="业主设计单位"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('yzsjdw', { initialValue: '' })} placeholder="输入业主设计单位" />
		        </FormItem>
		        <FormItem
		          label="业主设计负责人"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('yzsjdwfzr', { initialValue: '' })} style={{width:200}} placeholder="输入业主设计负责人" />
		        </FormItem>
		        <FormItem
		          label="业主设计联系电话"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('yzsjlxdh', { initialValue: '' })} style={{width:200}} placeholder="输入业主设计联系电话" />
		        </FormItem>

		        <div className="bg-gray text-warning">5-4、监理单位信息</div>
		        <FormItem
		          label="信号监理单位"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('xhjldw', { initialValue: '' })} placeholder="输入信号监理单位" />
		        </FormItem>
		        <FormItem
		          label="信号监理工程师"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('xhjlgcs', { initialValue: '' })} style={{width:200}} placeholder="输入信号监理工程师" />
		        </FormItem>
		        <FormItem
		          label="信号监理联系电话"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('xhjllxdh', { initialValue: '' })} style={{width:200}} placeholder="输入信号监理联系电话" />
		        </FormItem>
		        <div style={{width:'100%'}}></div>
		        <FormItem
		          label="施工监理单位"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('sgjldw', { initialValue: '' })} placeholder="输入施工监理单位" />
		        </FormItem>
		        <FormItem
		          label="施工监理工程师"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('sgjlgcs', { initialValue: '' })} style={{width:200}} placeholder="输入施工监理工程师" />
		        </FormItem>
		        <FormItem
		          label="施工监理联系电话"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('sgjllxdh', { initialValue: '' })} style={{width:200}} placeholder="输入施工监理联系电话" />
		        </FormItem>

		        <div className="bg-gray text-warning">5-5、施工单位信息</div>
		        <FormItem
		          label="施工单位"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('sgdw', { initialValue: '' })} placeholder="输入施工单位" />
		        </FormItem>
		        <FormItem
		          label="施工项目经理"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('sgxmjl', { initialValue: '' })} style={{width:200}} placeholder="输入施工项目经理" />
		        </FormItem>
		        <FormItem
		          label="施工联系电话"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('sglxdh', { initialValue: '' })} style={{width:200}} placeholder="输入施工联系电话" />
		        </FormItem>

		        <div className="bg-gray text-warning">5-6、车辆单位信息</div>
		        <FormItem
		          label="车辆供货单位"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('clghdw', { initialValue: '' })} placeholder="输入车辆供货单位" />
		        </FormItem>
		        <FormItem
		          label="车辆项目经理"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('clxmjl', { initialValue: '' })} style={{width:200}} placeholder="输入车辆项目经理" />
		        </FormItem>
		        <FormItem
		          label="车辆联系电话"
		          {...formItemLayout}
			        style={{marginTop:5}}
		        >
		        	<Input {...getFieldProps('cllxdh', { initialValue: '' })} style={{width:200}} placeholder="输入车辆联系电话" />
		        </FormItem>
	  			</Form>
        </div>
  		</div>
		)
  }
});

ProjectInfo = Form.create()(ProjectInfo);

export default ProjectInfo;