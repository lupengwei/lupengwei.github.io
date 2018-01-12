import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Icon } from "antd";
import "./Common.less";

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }
  render() {
    return (
      <div>
        <center style={{ height: "100%", paddingTop: "25%", fontSize: 20 }}>
          <div>荣誉导入</div>
        </center>
      </div>
    );
  }
}

export default Welcome;
