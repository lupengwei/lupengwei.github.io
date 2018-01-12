import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import "./global";

import App from "../pages/App";
import TaskCenter from "../pages/taskCenter/Home";
import meets from "../pages/meets/Home";
import WeeklyPlan from "../pages/WeeklyPlan/Home";
import ProjectManageInfo from "../pages/ProjectManageInfo/Home";
// import taskCenter from "../pages/TaskCenter/Home";
import Business from "../pages/Business/Home";
import Knowledge from "../pages/Knowledge/Home";
// import TaskManageForIpd from "../pages/TaskManageForIpd/Home";
// import ProjectManage from "../pages/ProjectManage/Home";
import Member from "../pages/Member/Home";

import Attemper from "../pages/Attemper/Home";
import NoMatch from "../pages/common/NoMatch";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/taskCenter" component={TaskCenter} />
      <Route path="/taskcenter/index" component={TaskCenter} />
      {/* <Route path="/weeklyPlan/home" component={WeeklyPlan} /> */}
      {/* <Route path="/meets" component={meets} /> */}
      <Route path="/meets/:type" component={meets} />
      <Route path="/member/:type" component={Member} />
      <Route path="/weeklyPlan/:type" component={WeeklyPlan} />
      <Route path="/knowledge/:type" component={Knowledge} /> */}
      {/* <Route path="/ipdTasks/:type" component={TaskManageForIpd} /> */}
      <Route path="/taskcenter/index" component={TaskCenter} />
      {/* <Route path="/weeklyPlan/:type" component={WeeklyPlan} /> */}
      {/* <Route path="/manage/projects/:type" component={ProjectManage} /> */}
      <Route path="/manage/projects/info/:type" component={ProjectManageInfo} />
      <Route path="/business/:type" component={Business} />
      <Route path="/attemper/:type" component={Attemper} />
      />
      <Route component={NoMatch} />
    </Switch>
  </BrowserRouter>
);

Routes.propTypes = {
  text: PropTypes.any
};

export default Routes;
