import React from 'react';
import { Link } from 'react-router';
import Cookies from 'js-cookie';

import { showProject } from '../../services/api';

import { Menu, Icon, message } from 'antd';

// common
import MainLayout from '../../layouts/MainLayout/MainLayout';
import LeftBar from './LeftBar/LeftBar';
import Welcome from './Welcome';
import Warning from '../Common/Warning';

// project
import ModifyProject from './Projects/ModifyProject';
import ModifyPerson from './Projects/ModifyPerson';
import ModifyIpd from './Projects/ModifyIpd';

// department
import CreateDepartment from './Departments/CreateDepartment';
import SetDepartmentPerson from './Departments/SetDepartmentPerson';

// global
import SetGlobalLeaders from './GlobalSetting/SetGlobalLeaders';
import SetCreateProjectPerson from './GlobalSetting/SetCreateProjectPerson';

// Ipd ProcessTrim
import UploadModuleForIpd from './ProcessTrimForIpd/UploadModuleForIpd';
import WorkItemsTrimForIpd from './ProcessTrimForIpd/WorkItemsTrimForIpd';
import QualityManagerCheckWorkItemsForIpd from './ProcessTrimForIpd/QualityManagerCheckWorkItemsForIpd';
import CheckWorkItemsForIpd from './ProcessTrimForIpd/CheckWorkItemsForIpd';
import EditTasksForIpd from './ProcessTrimForIpd/EditTasksForIpd';
import ConfirmTasksForIpd from './ProcessTrimForIpd/ConfirmTasksForIpd';
import HistoryManageForIpd from './ProcessTrimForIpd/HistoryManageForIpd';
import ShowAllIpd from '../Common/Ipd/ShowAllIpd'; // 预览所有ipd

// less
import styles from './Common.less';

// main
const Console = React.createClass({
  getInitialState() {
    return {
      loading: true,
      isBelong: false,
      groupType: '', // 组织类型
      projectStatus: '',
      urlAction: this.props.params.str,
      projectInfo: {},
    };
  },
  componentDidMount() {
    this.showProjectInfo();
  },
  showProjectInfo() {
    let _self = this;
    let flag  = false;
    let t_presentUserId = Cookies.get('presentUserId');
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("若需配置项目，请先选择将要配置的组织");

    showProject(projectId).then((res) => {

      let datas = res.jsonResult.project;
      let tempIsBelong = false;

      _.map(datas.Users, function(item){
        if(item.id == t_presentUserId) flag = true;
      })

      // 判断是否属于本项目
      if(flag) tempIsBelong = true;

      Cookies.set('presentProjectStatus', datas.status);

      _self.setState({
        projectInfo: datas,
        isBelong: tempIsBelong,
        loading: false,
      });

    })
  },
  render() {
    let state             = this.state,
        routePramsType    = this.props.params.type,
        routePrams        = this.props.params.str,
        userRoleOfProject = Cookies.get('presentUserRolesOfProject') || null,
        userDingtalkId    = Cookies.get('presentUserDingtalkId') || null,
        desUserName       = Cookies.get('presentUserName') || null,
        projectStatus     = Cookies.get('presentProjectStatus') || state.projectInfo.status,
        subComponents     = <Welcome />,
        _self             =  this;

    /*
    * waitSetRoles: 等待管理员定角色
    * waitCutStage: 等待项目经理裁剪2，3，4级作业项
    * XXXX: 等待质量经理审核
    * waitingBJQPConfirm: 等待北京安质部审批
    * waitAddTasks: 等待4级作业项负责人添加任务
    * active: 正常激活状态
    */

    // 创建项目的权限
    let isModifyProjectInfo = Cookies.get('presentUserCanCreateProject') || null;

    // 创建部门权限设置
    let createDepartmentUsers = ['周建军','蒋卓君','王轻姿'];

    let isCreateDepartment  = false; // 是否允许创建部门

    if(_.indexOf(createDepartmentUsers, desUserName) != -1) isCreateDepartment = true;

    if(state.loading && routePrams != 'home') {
      subComponents = <Warning datas="数据正在努力加载中，请稍等片刻" />;
    }else {
      // projects
      if(routePramsType == 'projects') {
        switch(routePrams){
          case 'fixProject':
            (state.isBelong && userRoleOfProject == '项目管理工程师' && state.projectInfo.type == 'project') || isModifyProjectInfo == 'true' ? subComponents = <ModifyProject /> : subComponents = <Warning datas="您的权限不足，无法进行此项操作，请联系项目管理工程师！" type="tips" />;
          break;
          case 'fixPerson':
            state.isBelong && userRoleOfProject == '项目管理工程师' && state.projectInfo.type == 'project' ? subComponents = <ModifyPerson /> : subComponents = <Warning datas="您的权限不足，无法进行此项操作，请联系项目管理工程师！" type="tips" />;
          break;
          case 'fixIpd':
            // 修改的前提条件是阶段已激活
            if(projectStatus == 'active') {
              state.isBelong && userRoleOfProject == '项目管理工程师' && state.projectInfo.type == 'project' ? subComponents = <ModifyIpd /> : subComponents = <Warning datas="您的权限不足，无法进行此项操作，请联系项目管理工程师！" type="tips" />;
            }else {
              subComponents = <Warning datas="当前项目阶段还未激活，无法进行此项操作！" type="tips" />;
            }
          break;
          case 'uploadModuleForIpd':
            // 项目经理上传ipd模板
            if(projectStatus == 'waitUploadModule' && state.projectInfo.type == 'project'){
              state.isBelong && userRoleOfProject == '项目经理' ? subComponents = <UploadModuleForIpd /> : subComponents = <Warning datas="您的权限不足，无法进行此项操作，请联系项目经理！" type="tips" />;
            }else {
              subComponents = <Warning datas="项目当前不在本阶段，无法进行此项操作！" type="tips" />;
            }
          break;
          case 'workItemsTrimForIpd':
            // 项目经理裁剪2，3，4级工作项
            if(projectStatus == 'waitCutStage' && state.projectInfo.type == 'project'){
              state.isBelong && userRoleOfProject == '项目经理' ? subComponents = <WorkItemsTrimForIpd /> : subComponents = <Warning datas="您的权限不足，无法进行此项操作，请联系项目经理！" type="tips" />;
            }else {
              // subComponents = <Warning datas="项目当前不在本阶段，无法进行此项操作！" />;
              subComponents = <ShowAllIpd />;
            }
          break;
          case 'qualityManagerCheckWorkItemsForIpd':
            // 质量经理审核IPD裁剪
            if(projectStatus == 'waitQPManagerConfirm') {
              state.isBelong && userRoleOfProject == '质量经理' && state.projectInfo.type == 'project' ? subComponents = <QualityManagerCheckWorkItemsForIpd /> : subComponents = <Warning datas="您的权限不足，无法进行此项操作，请联系质量经理！" type="tips" />;
            }else {
              state.isBelong && userRoleOfProject == '质量经理' && state.projectInfo.type == 'project' ? subComponents = <QualityManagerCheckWorkItemsForIpd visitType="onlyView" /> : subComponents = <Warning datas="项目当前不在本阶段，无法进行此项操作！" type="tips" />;
            }
          break;
          case 'checkWorkItemsForIpd':
            // 安质部部长审批IPD裁剪
            if(projectStatus == 'waitingBJQPConfirm') {
              state.isBelong && userRoleOfProject == '安质部部长' && state.projectInfo.type == 'project' ? subComponents = <CheckWorkItemsForIpd /> : subComponents = <Warning datas="您的权限不足，无法进行此项操作，请联系安质部部长！" type="tips" />;
            }else {
              state.isBelong && userRoleOfProject == '安质部部长' && state.projectInfo.type == 'project' ? subComponents = <CheckWorkItemsForIpd visitType="onlyView" /> : subComponents = <Warning datas="项目当前不在本阶段，无法进行此项操作！" type="tips" />;
            }
          break;
          case 'editTasksForIpd':
            // 编制任务清单
            if(projectStatus == 'waitAddTasks') {
              state.isBelong ? subComponents = <EditTasksForIpd /> : subComponents = <Warning datas="您暂不是本项目人员，请联系项目管理工程师！" type="tips" />;
            }else {
              subComponents = <Warning datas="项目当前不在本阶段，无法进行此项操作！" type="tips" />;
            }
          break;
          case 'confirmTasksForIpd':
            // 项目经理确认
            if(projectStatus == 'waitAddTasks') {
              state.isBelong && userRoleOfProject == '项目经理' && state.projectInfo.type == 'project' ? subComponents = <ConfirmTasksForIpd /> : subComponents = <Warning datas="您的权限不足，无法进行此项操作，请联系项目经理！" type="tips" />;
            }else {
              subComponents = <Warning datas="项目当前不在本阶段，无法进行此项操作！" type="tips" />;
            }
          break;
          case 'historyManageForIpd':
            // ipd历史版本管理
            subComponents = <HistoryManageForIpd />;
          break;
        }
      }

      // department
      if(routePramsType == 'department') {
        switch(routePrams){
          case 'create':
            // 周建军、蒋卓君
            isCreateDepartment ? subComponents = <CreateDepartment /> : subComponents = <Warning datas="您的权限不足，无法进行此项操作，请联系周建军或蒋卓君！" type="tips" />;
          break;
          case 'setPersons':
            // 部门管理员
            if(state.projectInfo.type == 'department') {
              isCreateDepartment || (state.isBelong && (userRoleOfProject == '部门管理员' || userRoleOfProject == '部门负责人' )) ? subComponents = <SetDepartmentPerson /> : subComponents = <Warning datas="您的权限不足，无法进行此项操作，请联系部门管理员或部门负责人！" type="tips" />;
            }else {
              subComponents = <Warning datas="当前组织不是部门，请切换到部门设置人员" type="tips" />;
            }
          break;
        }
      }

      // 公共模块
      switch(routePrams){
        case 'setLeaders':
          // 周建军
          desUserName == '周建军' || desUserName == '王轻姿' ? subComponents = <SetGlobalLeaders /> : subComponents = <Warning datas="你无权限访问此项，请联系管理员！" type="tips" />;
        break;
        case 'setCreateProjectPerson':
          // 周建军
          desUserName == '周建军' || desUserName == '王轻姿' ? subComponents = <SetCreateProjectPerson /> : subComponents = <Warning datas="你无权限访问此项，请联系管理员！" type="tips" />;
        break;
      }
    }

    // 当前url参数
    let urlParams = {
      type: routePramsType,
      action: routePrams
    };

    return (
      <MainLayout>
        <div style={{ height: '100%' }}>
          <LeftBar params={urlParams} projectInfo={state.projectInfo} />
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

export default Console;
