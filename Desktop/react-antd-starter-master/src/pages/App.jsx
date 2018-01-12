import React, { Component } from "react";

import "./App.less";
import { Button } from "antd";
import { Link } from "react-router-dom";

import { getProjectStatusAtGlobal } from "../services/api";

class App extends Component {
  handleGetProjectStatus() {
    getProjectStatusAtGlobal().then(res => {
      console.log(res.jsonResult);
    });
  }

  render() {
    console.log("this is app.jsx");
    return (
      <div className="App">
        <div className="App-box">
          <Button
            className="button-item"
            type="dashed"
            onClick={this.handleGetProjectStatus}
          >
            获取项目状态
          </Button>
          <Link className="button-item" to="/taskCenter">
            <Button type="primary">taskCenter</Button>
          </Link>
          <Link className="button-item" to="/meets/create">
            <Button type="primary">meets</Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default App;
