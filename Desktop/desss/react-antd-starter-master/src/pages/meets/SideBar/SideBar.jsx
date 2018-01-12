import React, { Component } from "react";
import { Layout, Menu, Icon, Badge } from "antd";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./Common.less";
const SubMenu = Menu.SubMenu;
const { Sider } = Layout;

class SiderDemo extends Component {
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
          <Menu.Item key="1">
            <Link to="/meets/create">
              <Icon type="save" />新增会议
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/meets/mymeets">
              <Icon type="edit" />我的会议
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/meets/tracking">
              <Icon type="pushpin-o" />会议跟踪表
            </Link>
          </Menu.Item>
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />会议列表
              </span>
            }
          >
            <Menu.Item key="4">
              <Link to={"/meets/lists?type=" + 1}>
                项目例会
                <Badge count={22} />
              </Link>
            </Menu.Item>
            <Menu.Item key="5">
            <Link to={"/meets/lists?type=" + 1}>
                项目例会
                 <Badge count={42} />
            </Link>
            
            </Menu.Item>
          </SubMenu>
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

export default SiderDemo;
