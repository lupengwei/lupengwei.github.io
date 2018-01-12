import React from 'react';

import { Menu, Icon, message, Table } from 'antd';

//ant初始组件

 function handleClick(datas){
    console.log("message");
  }

const TableDemo = React.createClass({
  getInitialState() {
    return {
      data: [
        { key: 1, name: '胡彦斌', age: 32, address: '西湖区湖底公园1号', description: '我是胡彦斌，今年32岁，住在西湖区湖底公园1号。' },
        { key: 2, name: '吴彦祖', age: 42, address: '西湖区湖底公园2号', description: '我是吴彦祖，今年42岁，住在西湖区湖底公园2号。' },
        { key: 3, name: '李大嘴', age: 32, address: '西湖区湖底公园3号', description: '我是李大嘴，今年32岁，住在西湖区湖底公园3号。' },
      ],
      columns: [
        { title: '姓名', dataIndex: 'name', key: 'name' },
        { title: '年龄', dataIndex: 'age', key: 'age' },
        { title: '住址', dataIndex: 'address', key: 'address' },
        { title: '操作', dataIndex: '', key: 'x', render: () => <a onClick={this.handleClick.bind(this, "1234")}>删除</a> },
      ]
    };
  },
  handleClick(datas){
    console.log("message", datas);
    this.setState({
      data: [
        { key: 1, name: '胡彦斌1', age: 32, address: '西湖区湖底公园1号', description: '我是胡彦斌，今年32岁，住在西湖区湖底公园1号。' },
        { key: 2, name: '吴彦祖2', age: 42, address: '西湖区湖底公园2号', description: '我是吴彦祖，今年42岁，住在西湖区湖底公园2号。' },
        { key: 3, name: '李大嘴3', age: 32, address: '西湖区湖底公园3号', description: '我是李大嘴，今年32岁，住在西湖区湖底公园3号。' },
      ]
    });
  },
  render () {
    return (
      <Table
        columns={this.state.columns}
        expandedRowRender={
          record => <p>{record.description}</p> }
        dataSource={this.state.data}
        className="table" />
    );
  }
});

export default TableDemo;
