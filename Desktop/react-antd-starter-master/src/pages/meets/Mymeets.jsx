import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import "./Common.less";

class Mymeets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }

  render() {
    return (
      <div>
        <Link to="/meets">
          <Button>myeet跳转到meets</Button>
        </Link>
      </div>
    );
  }
}

export default Mymeets;
