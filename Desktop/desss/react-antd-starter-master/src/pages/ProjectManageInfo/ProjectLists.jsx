import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import "./Common.less";

class ProjectLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "任务模块"
    };
  }

  render() {
    return (
      <div>
        <Link to="/meets/create">
          <Button> 项目信息列表</Button>
        </Link>
      </div>
    );
  }
}

export default ProjectLists;
