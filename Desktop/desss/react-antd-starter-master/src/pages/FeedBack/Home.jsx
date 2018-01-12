import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';

import { showProject } from '../../services/api';

import { Menu, Icon, message, } from 'antd';

import MainLayout from '../../layouts/MainLayout/MainLayout';
import LeftBar from './LeftBar/LeftBar';
import Welcome from './Welcome';
import Warning from '../Common/Warning';

import CreateFeedBackOrder from './CreateFeedBackOrder';

import styles from './Common.less';

const FeedBack = React.createClass({
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    let routePrams        = this.props.params.str,
        subComponents     = <Welcome />;

    switch(routePrams) {
      case 'create':
       subComponents = <CreateFeedBackOrder />;
      break;
    }

    return (
      <MainLayout>
        <div style={{ height: '100%' }}>
          <LeftBar />
          <div className={styles["working-container"]}>
            <div className={styles["working-container-box"]}>
              { subComponents  }
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
});

export default FeedBack;
