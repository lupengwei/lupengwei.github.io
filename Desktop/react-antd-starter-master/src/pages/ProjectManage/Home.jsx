import React from 'react';
import Cookies from 'js-cookie';

import { showProject } from '../../services/api';

import { Menu, Icon, message, } from 'antd';

import MainLayout from '../../layouts/MainLayout/MainLayout';
import LeftBar from './LeftBar/LeftBar';
import Welcome from './Welcome';
import Warning from '../Common/Warning';

import CreateProject from './CreateProject';
import SetProjectPerson from './SetProjectPerson';

import styles from './Common.less';

const ProjectManage = React.createClass({
  getInitialState() {
    return {
      projectId: Cookies.get('presentBelongProjectId') || '',
      isBelongOfProject: false, //是否属于本项目
    };
  },
  componentDidMount() {
    this.getProjectInfo();
  },
  getProjectInfo() {
    if(!this.state.projectId) return message.warning("若需配置项目，请先选择将要配置的项目部", 2);
    let t_presentUserId = Cookies.get('presentUserId'),
        falg  = false, 
        _self = this;

    showProject(_self.state.projectId).then((res) => {

      _.map(res.jsonResult.project.Users, function(item){
        if(item.id == t_presentUserId) falg = true;
      })

      //判断是否属于本项目
      if(falg) _self.setState({ isBelongOfProject: true });

    })
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    let routePrams        = this.props.params.str,
        userRoleOfProject = Cookies.get('presentUserRolesOfProject') || null,
        userDingtalkId    = Cookies.get('presentUserDingtalkId') || null,
        subComponents     = <Welcome />;

    //是否允许创建项目
    let isCreateProject = Cookies.get('presentUserCanCreateProject') || null;

    switch(routePrams) {
      case 'create':
       isCreateProject == 'true' || (state.isBelongOfProject && userRoleOfProject == '项目管理工程师') ? subComponents = <CreateProject /> : subComponents = <Warning datas="您权限不足，无法创建项目!" />;
      break;
      case 'setPerson':
        isCreateProject == 'true' || (state.isBelongOfProject && userRoleOfProject == '项目管理工程师') ? subComponents = <SetProjectPerson /> : subComponents = <Warning datas="您权限不足或不属于本项目人员，无法设置人员!" />;
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

export default ProjectManage;
