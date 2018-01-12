import React from 'react';

import moment from 'moment';

import { Menu, Icon, message, Table, Button } from 'antd';
import styles from './Common.less';

//function
function demo1() {
  console.log("demo1...")
}

//main
const NewDemoMain = React.createClass({
  getInitialState() {
    return {
      number: 12
    };
  },
  componentDidMount() {
    let bar = windows.__yourReactComp__.state.bar;
    console.log(bar)
  },
  handleChangeToFatherWindow(params) {
    if(window.opener) {
      window.opener.isClick = demo1();
      window.opener.document.body.style.background = params? 'red' : '#FFF';
    }
  },
  render() {
    return (
      <div>
        <Button type="dashed" style={{margin:'5px 0 0 15px'}}><a href="javascript:" onClick={this.handleChangeToFatherWindow.bind(null, true)}>子向父窗口通信</a></Button>
        <Button type="dashed" style={{margin:'5px 0 0 15px'}}><a href="javascript:" onClick={this.handleChangeToFatherWindow.bind(null, false)}>子向父窗口通信（恢复）</a></Button>
      </div>
    )
  }
});

export default NewDemoMain;