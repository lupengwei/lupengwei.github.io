import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import QueueAnim from 'rc-queue-anim';
import Cookies from 'js-cookie';

import { Menu, Icon, message } from 'antd';
import styles from './LeftBar.less';

//ant
const SubMenu = Menu.SubMenu;

//main
const LeftBar = React.createClass({
  getInitialState() {
      /* 导航状态控制开始 */
    var presentURL = window.location.hash == ''? window.location.pathname: window.location.hash;
    var presentURLArray = presentURL.split('?')[0].replace(/\#/, "").split('/'); //根目录会是两个空串["",""]

    if(!presentURLArray[0] && !presentURLArray[1]){
      console.warn(presentURLArray);
    }
      console.warn(presentURLArray);

    //3级导航状态
    switch(presentURLArray[3]){
      case 'create':
        localStorage.setItem('MenuThreeStage', 'create');
        break;
      case 'setPerson':
        localStorage.setItem('MenuThreeStage', 'setPerson');
        break;
      default:
        localStorage.setItem('MenuThreeStage', '');
    }

    /* 导航状态控制结束 */
    return {
      current: localStorage.getItem('MenuThreeStage'),
      projectId: Cookies.get('presentBelongProjectId') || '',
      projectConfigStep: 0, //项目配置步骤
    };
  },
  handleClick(e) {
    this.setState({ current: e.key });
    localStorage.setItem('MenuThreeStage', e.key);
  },
  render() {
    var state = this.state,
        props = this.props,
        _self = this;

    return (
      <QueueAnim delay={300} type="left" className={styles["menu-left-bar"]}>
        <Menu key="a" onClick={this.handleClick}
          style={{ borderRight: 0, padding: 0 }}
          selectedKeys={[this.state.current]}
          mode="inline"
          theme="light"
        >
          <Menu.Item key="create">
            <Link to="/manage/projects/create"><Icon type="edit" />创建项目</Link>
          </Menu.Item>
          <Menu.Item key="setPerson">
            <Link to="/manage/projects/setPerson"><Icon type="setting" />设置人员</Link>
          </Menu.Item>
        </Menu>
      </QueueAnim>
    );
  },
});

export default LeftBar;
