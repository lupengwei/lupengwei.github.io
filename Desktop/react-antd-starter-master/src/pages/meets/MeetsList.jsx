import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import "./Common.less";

class MeetsList extends Component {
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
          列表
          <Button>跳转到meets</Button>
        </Link>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
        <span>121322414</span>
      </div>
    );
  }
}

export default MeetsList;
