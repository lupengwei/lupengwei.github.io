import React, { Component } from "react";
import { Menu, Icon, message } from "antd";
import LayoutDefault from "../../components/layout/Default";
import LeftBar from "./LeftBar/LeftBar";
import Welcome from "./Welcome";

import TaskProgress from "./Components/TaskProgress";
import ReportForms from "./Components/ReportForms/Index";
import DynamicInfo from "../ProjectManageInfo/DynamicInfo";
import Honor from "./Components/Honor";
import styles from "./Common.less";

class Dispatch extends Component {
  getInitialState() {
    return {
      loading: true,
      isBelongOfProject: false //是否属于本项目
    };
  }
  render() {
    let state = this.state,
      props = this.props,
      _self = this;
    let routePrams = this.props.match.params.type,
      subComponents = <Welcome />;

    let urlParams = { type: routePrams };
    let leftBar = <LeftBar params={urlParams} />;
    switch (routePrams) {
      case "taskProgress":
        subComponents = <TaskProgress />;
        break;
      case "reportForms":
        subComponents = <ReportForms />;
        break;
      case "project_dynamic_info":
        subComponents = <DynamicInfo />;
        break;
      case "project_honor":
        subComponents = <Honor />;
        break;
    }

    return (
      <LayoutDefault>
        {leftBar}
        {subComponents}
      </LayoutDefault>
    );
  }
}

export default Dispatch;
