import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from 'antd';

const Welcome = React.createClass({
  render() {
    return (
      <center style={{ height:'100%',paddingTop: '25%', fontSize: 20 }}>
        <div><Icon type="info-circle" /> {this.props.datas}</div>
      </center>
    );
  }
});

export default Welcome;