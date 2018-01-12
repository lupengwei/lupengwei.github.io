import React, { Component, PropTypes } from "react";
import { Menu, Icon, message } from "antd";
import LayoutDefault from "../../components/layout/Default";
import LeftBar from "./LeftBar/LeftBar";
import Signature from "./Components/Signature";
import Honor from "./Components/Honor";
import Welcome from "./Welcome";
import styles from "./Common.less";
class Member extends Component {
  render() {
    let state = this.state,
      _self = this;

    let routePrams = this.props.match.params.type,
      subComponents = <Welcome />;
    let leftBar = <LeftBar />;

    switch (routePrams) {
      case "home":
        subComponents = <Welcome />;
      case "signature":
        subComponents = <Signature />;
        break;
      case "honor":
        subComponents = <Honor />;
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

export default Member;
