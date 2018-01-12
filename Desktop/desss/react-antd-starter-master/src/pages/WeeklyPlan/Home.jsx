import React, { Component, PropTypes } from "react";
import ShowWeeklyPlanTable from "./ShowWeeklyPlanTable";
import ShowWeeklyPlanTotalLists from "./ShowWeeklyPlanTotalLists";

import { Menu, Icon, message } from "antd";

import LayoutDefault from "../../components/layout/Default";
import LeftBar from "./LeftBar/LeftBar";
import Welcome from "./Welcome";
import styles from "./Common.less";
class WeeklyPlan extends Component {
  render() {
    let state = this.state,
      _self = this;

    let routePrams = this.props.match.params.type,
      subComponents = <Welcome />;
    let leftBar = <LeftBar />;

    switch (routePrams) {
      case "lists":
        subComponents = <ShowWeeklyPlanTable />;
        break;
      case "total":
        subComponents = <ShowWeeklyPlanTotalLists />;
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

export default WeeklyPlan;
