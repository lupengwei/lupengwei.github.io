import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import "./Common.less";

class CreatemeetsTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "任务模块"
    };
  }

  render() {
    return (
      <div>
        <Link to="/meets">
          <Button>新增会议跳转到meets</Button>
        </Link>
      </div>
    );
  }
}

export default CreatemeetsTask;
