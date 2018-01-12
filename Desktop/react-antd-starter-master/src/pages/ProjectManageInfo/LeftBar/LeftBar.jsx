import React, { Component, PropTypes } from "react";
import { Link } from "react-router-dom";
import styles from "./LeftBar.less";
import { Layout, Menu, Icon, Badge } from "antd";
const SubMenu = Menu.SubMenu;
const { Sider } = Layout;

class LeftBar extends Component {
  state = {
    collapsed: false
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  render() {
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={this.state.collapsed}
        className="des-sider-content"
      >
        <div className="logo-content">
          <img
            className={this.state.collapsed ? "logo-small" : "logo"}
            src="http://docs.cq-tct.com/desp/images/logo_001.png"
            alt="des logo"
          />
        </div>

        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
         
          <Menu.Item key="lists">
            <Link to="/manage/projects/info/lists">
              <Icon type="bars" />项目列表
            </Link>
          </Menu.Item>
          <Menu.Item key="compare">
            <Link to="/manage/projects/info/compare">
              <Icon type="bar-chart" />项目信息比对
            </Link>
          </Menu.Item>
          <Menu.Item key="dynamic">
            <Link to="/manage/projects/info/dynamic">
              <Icon type="paper-clip" />动态信息
            </Link>
          </Menu.Item>
          <Menu.Item key="honor">
            <Link to="/manage/projects/info/honor">
              <Icon type="star-o" />项目荣誉
            </Link>
          </Menu.Item>
        </Menu>

        <div className="des-sider-icon">
          <Icon
            className="trigger"
            type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
            onClick={this.toggle}
          />
        </div>
      </Sider>
    );
  }
}
export default LeftBar;