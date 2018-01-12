import React, { Component } from "react";
import { Layout, Menu, Icon, Badge } from "antd";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import styles from "./LeftBar.less";
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
          <Menu.Item key="taskProgress">
            <Link to="/attemper/taskProgress">
              <Icon type="line-chart" />项目任务进度
            </Link>
          </Menu.Item>
          <Menu.Item key="reportForms">
            <Link to="/attemper/reportForms">
              <Icon type="pie-chart" />平台使用统计
            </Link>
          </Menu.Item>
          <Menu.Item key="project_dynamic_info">
            <Link to="/attemper/project_dynamic_info">
              <Icon type="bar-chart" />项目动态信息
            </Link>
          </Menu.Item>
          <Menu.Item key="project_honor">
            <Link to="/attemper/project_honor">
              <Icon type="star-o" />荣誉墙
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
