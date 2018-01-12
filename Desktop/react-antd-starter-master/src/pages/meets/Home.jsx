import React, { Component } from "react";
import LayoutDefault from "../../components/layout/Default";
import DesSider from "./SideBar/SideBar";
import Mymeets from "./Mymeets";
import Tracking from "./Tracking";
import Welcome from "./Welcome";
import MeetsList from "./MeetsList";
import DesmeetsDefault from "./components/Default";
import "./Common.less";
// import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
const Meets = () => ({
  // componentWillMount() {
  //   {
  //     console.log(this.props.match.params.type);
  //   }
  // },
  render() {
    let routePrams = this.props.match.params.type,
      subComponents = <Welcome />;
    console.log(this.routePrams);

    switch (routePrams) {
      case "home":
        subComponents = <Welcome />;
        break;
      case "mymeets":
        subComponents = <Mymeets />;
        break;
      case "create":
        subComponents = <DesmeetsDefault />;
        break;
      case "tracking":
        subComponents = <meetsList />;
        break;
      case "lists":
        subComponents = <DesmeetsDefault />;
    }

    return (
      <LayoutDefault>
        <DesSider />
        {subComponents}
      </LayoutDefault>
    );
  }
});

export default Meets;
