import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from 'antd';

const Welcome = React.createClass({
  render: function() {
    return (
      <center style={{ height:'100%',paddingTop: '25%', fontSize: 20 }}>
        <div><Icon type="enter" /> 请选择左侧管理配置项！</div>
      </center>
    );
  }
});

export default Welcome;