import React, { Component } from "react";
import { Menu, Icon, message } from "antd";
import LayoutDefault from "../../components/layout/Default";
import LeftBar from "./LeftBar/LeftBar";
import Welcome from "./Welcome";
import FullCyclePaymentPlan from "./Components/FullCyclePaymentPlan";
import AnnualPaymentPlan from "./Components/AnnualPaymentPlan";
import Punishments from "./Components/Punishments";
import Guarantee from "./Components/Guarantee";
import styles from "./Common.less";

class meets extends Component {
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
      case "home":
        subComponents = <Welcome />;
        break;
      case "annual":
        subComponents = <AnnualPaymentPlan />;
        break;
      case "fullCycle":
        subComponents = <FullCyclePaymentPlan />;
        break;
      case "punishments":
        //罚则
        subComponents = <Punishments />;
        break;
      case "guarantee":
        //保函
        subComponents = <Guarantee />;
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

export default meets;
