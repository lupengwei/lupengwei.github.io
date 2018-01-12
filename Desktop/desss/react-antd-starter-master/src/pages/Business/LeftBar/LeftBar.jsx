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
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="pay-circle" />回款管理
              </span>
            }
          >
            <Menu.Item key="fullCycle">
              <Link to="/business/fullCycle">全周期回款计划</Link>
            </Menu.Item>
            <Menu.Item key="annual">
              <Link to="/business/annual">年度回款计划</Link>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="punishments">
            <Link to="/business/punishments">
              <Icon type="schedule" />项目罚则
            </Link>
          </Menu.Item>
          <Menu.Item key="guarantee">
            <Link to="/business/guarantee">
              <Icon type="wallet" />保函管理
            </Link>
          </Menu.Item>
          <Menu.Item key="4" disabled>
            <Icon type="ant-design" />BOM合同对应
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
