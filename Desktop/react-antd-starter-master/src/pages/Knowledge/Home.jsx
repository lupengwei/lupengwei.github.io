import React, { Component } from "react";
import { Menu, Icon, message } from "antd";
import { Link } from "react-router-dom";
import LeftBar from "./LeftBar/LeftBar";
import Welcome from "./Welcome";
import MyUploadFiles from "./MyUploadFiles";

import styles from "./Common.less";

import LayoutDefault from "../../components/layout/Default";

class Knowledge extends Component {
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
      case "me-upload":
        subComponents = <MyUploadFiles />;
        break;
      default:
        subComponents = <Welcome />;
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

export default Knowledge;
