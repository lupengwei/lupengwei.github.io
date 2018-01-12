import React from 'react';
import { Select, Button, Form, Icon } from 'antd';
const Option = Select.Option;
const createForm = Form.create;
const FormItem = Form.Item;

let FormValidate = React.createClass({

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      console.log('Submit!!!');
      console.log(values);
    });
  },

  render() {

    const { getFieldProps } = this.props.form;

    const multiSelectProps = getFieldProps('multiSelect', {
      rules: [
        { required: true, message: '请选择您喜欢的颜色', type: 'array' },
      ],
    });

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    return (
      <Form horizontal form={this.props.form}>

        <FormItem
          {...formItemLayout}
          label="喜欢的颜色"
        >
          <Select {...multiSelectProps} multiple placeholder="请选择颜色" style={{ width: '100%' }}>
            <Option value="red">红色</Option>
            <Option value="orange">橙色</Option>
            <Option value="yellow">黄色</Option>
            <Option value="green">绿色</Option>
            <Option value="blue">蓝色</Option>
          </Select>
        </FormItem>

        <FormItem
          wrapperCol={{ span: 12, offset: 7 }}
        >
          <Button type="primary" onClick={this.handleSubmit}>确定</Button>
        </FormItem>
      </Form>
    );
  },
});

FormValidate = createForm()(FormValidate);

export default FormValidate;