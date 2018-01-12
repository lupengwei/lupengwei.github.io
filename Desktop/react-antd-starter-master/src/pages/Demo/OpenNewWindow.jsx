import React from 'react';
import { Select, Button, Form, Icon } from 'antd';

//function
function demo2() {
  console.log("demo2...")
}

//main
let OpenNewWindow = React.createClass({
  getInitialState() {
    return {
      newWindow: ''
    };
  },
  componentDidMount() {
    windows.__yourReactComp__ = this;
    document.addEventListener('click', () => {
      console.log('show...')
    });
  },
  openNewWindow() {
    /**
     * window.open('page.html', 'newwindow', 'height=100, width=400, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')   //该句写成一行代码
      参数解释：
      window.open 弹出新窗口的命令； 
  　　'page.html' 弹出窗口的文件名； 
  　　'newwindow' 弹出窗口的名字（不是文件名），非必须，可用空''代替； 
  　　height=100 窗口高度； 
  　　width=400 窗口宽度； 
  　　top=0 窗口距离屏幕上方的象素值； 
  　　left=0 窗口距离屏幕左侧的象素值； 
  　　toolbar=no 是否显示工具栏，yes为显示； 
  　　menubar，scrollbars 表示菜单栏和滚动栏。 
  　　resizable=no 是否允许改变窗口大小，yes为允许； 
  　　location=no 是否显示地址栏，yes为允许； 
  　　status=no 是否显示状态栏内的信息（通常是文件已经打开），yes为允许
    */
    let tempNewWindow = window.open('http://127.0.0.1:8989/#/demo/newDemo?_k=abd15m','','width=700,height=500,scrollbars=no,status=no,resizable=no,location=no');
    this.setState({ newWindow: tempNewWindow });
  },
  handleChangeNewWindow(params) {
    this.state.newWindow.document.body.style.background = params ? 'red' : '#FFF';
  },
  render() {
    return (
      <div>
        <Button type="primary" style={{margin:'5px 0 0 15px'}}><a href="javascript:" onClick={this.openNewWindow}>打开新窗口</a></Button>
        <Button type="dashed" style={{margin:'5px 0 0 15px'}}><a href="javascript:" onClick={this.handleChangeNewWindow.bind(null, true)}>父向子窗口改变背景</a></Button>
        <Button type="dashed" style={{margin:'5px 0 0 15px'}}><a href="javascript:" onClick={this.handleChangeNewWindow.bind(null, false)}>父向子窗口恢复背景（恢复）</a></Button>
      </div>
    )
  }
});

export default OpenNewWindow;