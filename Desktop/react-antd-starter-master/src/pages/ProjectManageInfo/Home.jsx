import React, { Component, PropTypes } from "react";
import { Menu, Icon, message } from "antd";

import LayoutDefault from "../../components/layout/Default";
import LeftBar from "./LeftBar/LeftBar";
import Welcome from "./Welcome";
// import Warning from "../Common/Warning";

import ProjectLists from "./ProjectLists";
// import CompareProjects from "./CompareProjects";
// import DynamicInfo from "./DynamicInfo";

import styles from "./Common.less";
class ProjectManage extends Component {
  render() {
    let state = this.state,
      _self = this;

    let routePrams = this.props.match.params.type,
      subComponents = <Welcome />;
    let leftBar = <LeftBar />;

    switch (routePrams) {
      case "lists":
        subComponents = <ProjectLists />;
        break;
      // case "compare":
      //   subComponents = <CompareProjects />;
      //   break;
      // case "dynamic":
      //   subComponents = <DynamicInfo showType="self" />;
      //   break;
    }

    return (
      <LayoutDefault>
        {leftBar}
        {subComponents}
      </LayoutDefault>
    );
  }
}

export default ProjectManage;
