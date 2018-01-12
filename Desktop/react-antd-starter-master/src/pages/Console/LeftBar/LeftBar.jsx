import React, { Component, PropTypes } from "react";
import { Link } from "react-router-dom";
import styles from "./LeftBar.less";
import { Layout, Menu, Icon, Badge } from "antd";
const SubMenu = Menu.SubMenu;
const { Sider } = Layout;

class LeftBar extends Component {
  state = {
    collapsed: false
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  render() {
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={this.state.collapsed}
        className="des-sider-content"
      >
        <div className="logo-content">
          <img
            className={this.state.collapsed ? "logo-small" : "logo"}
            src="http://docs.cq-tct.com/desp/images/logo_001.png"
            alt="des logo"
          />
        </div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        
            <Menu.Item key="me-upload">
              <Link to="/knowledge/me-upload"><Icon type="setting" />我上传的文件</Link>
            </Menu.Item>
            <Menu.Item key="wiki">
              <a target="_blank" onClick={this.redirectToWiki}><Icon type="link" />访问知识库</a>
            </Menu.Item>
          </Menu>
        <div className="des-sider-icon">
          <Icon
            className="trigger"
            type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
            onClick={this.toggle}
          />
        </div>
      </Sider>
    );
  }
}
export default LeftBar;


//main
const LeftBar = React.createClass({
  getInitialState() {
    /* 导航状态控制开始 */
    var presentURL = window.location.hash == ''? window.location.pathname: window.location.hash;
    var presentURLArray = presentURL.split('?')[0].replace(/\#/, "").split('/'); //根目录会是两个空串["",""]

    if(!presentURLArray[0] && !presentURLArray[1]){
      console.warn(presentURLArray);
    }
      console.warn(presentURLArray);
    //一级导航状态
    switch(presentURLArray[1]){
      case 'console':
        localStorage.setItem('MenuOneStage', 'console');
        break;
      default:
        localStorage.setItem('MenuOneStage', '');
    }
    //二级导航状态
    switch(presentURLArray[2]){
      case 'home':
        localStorage.setItem('MenuTwoStage', 'home');
        break;
      case 'project':
        localStorage.setItem('MenuTwoStage', 'project');
        break;
      case 'department':
        localStorage.setItem('MenuTwoStage', 'department');
        break;
      default:
        localStorage.setItem('MenuTwoStage', '');
    }
    //三级导航状态
    switch(presentURLArray[3]){
      case 'fixProject':
        localStorage.setItem('MenuThreeStage', 'fixProject');
        break;
      case 'fixPerson':
        localStorage.setItem('MenuThreeStage', 'fixPerson');
        break;
      case 'fixIpd':
        localStorage.setItem('MenuThreeStage', 'fixIpd');
        break;
      case 'setLeaders':
        localStorage.setItem('MenuThreeStage', 'setLeaders');
        break;
      case 'setCreateProjectPerson':
        localStorage.setItem('MenuThreeStage', 'setCreateProjectPerson');
        break;
      case 'uploadModuleForIpd':
        localStorage.setItem('MenuThreeStage', 'uploadModuleForIpd');
        break;
      case 'workItemsTrimForIpd':
        localStorage.setItem('MenuThreeStage', 'workItemsTrimForIpd');
        break;
      case 'qualityManagerCheckWorkItemsForIpd':
        localStorage.setItem('MenuThreeStage', 'qualityManagerCheckWorkItemsForIpd');
        break;
      case 'checkWorkItemsForIpd':
        localStorage.setItem('MenuThreeStage', 'checkWorkItemsForIpd');
        break;
      case 'editTasksForIpd':
        localStorage.setItem('MenuThreeStage', 'editTasksForIpd');
        break;
      case 'confirmTasksForIpd':
        localStorage.setItem('MenuThreeStage', 'confirmTasksForIpd');
        break;
      case 'historyManageForIpd':
        localStorage.setItem('MenuThreeStage', 'historyManageForIpd');
        break;
      default:
        localStorage.setItem('MenuThreeStage', '');
    };
    /* 导航状态控制结束 */
    return {
      current: localStorage.getItem('MenuThreeStage'),
      projectConfigStep: 0, //项目配置步骤
      params: {
        type: '',
        action: ''
      }, //URL参数判断是否重新渲染
      defaultOpenKeys: [], //菜单默认展开项
      isBelong: false,
      projectInfo: this.props.projectInfo,
    };
  },
  componentDidMount() {
    this.selectMenuItem(this.props.params);
    this.setProjectStepInfo(this.props.projectInfo);
  },
  componentWillReceiveProps(nextProps){
    if(nextProps.params != this.props.params) this.selectMenuItem(nextProps.params);
    if(nextProps.projectInfo != this.props.projectInfo) this.setState({projectInfo: nextProps.projectInfo});
    this.setProjectStepInfo(nextProps.projectInfo);
  },
  selectMenuItem(params) {
    let _self = this;

    /*
    * sub1 全局配置
    * sub2 项目管理
    * sub3 部门
    * sub4 过程域裁剪
    */

    if(params.type == 'projects') {
      //项目配置
      switch(params.action) {
        case 'fixProject':
          _self.setState({ current: 'fixProject', defaultOpenKeys: ['sub2'] });
        break;
        case 'fixPerson':
          _self.setState({ current: 'fixPerson', defaultOpenKeys: ['sub2'] });
        break;
        case 'fixIpd':
          _self.setState({ current: 'fixIpd', defaultOpenKeys: ['sub2'] });
        break;
        case 'uploadModuleForIpd':
          _self.setState({ current: 'uploadModuleForIpd', defaultOpenKeys: ['sub4'] });
        break;
        case 'workItemsTrimForIpd':
          _self.setState({ current: 'workItemsTrimForIpd', defaultOpenKeys: ['sub4'] });
        break;
        case 'qualityManagerCheckWorkItemsForIpd':
          _self.setState({ current: 'qualityManagerCheckWorkItemsForIpd', defaultOpenKeys: ['sub4'] });
        break;
        case 'checkWorkItemsForIpd':
          _self.setState({ current: 'checkWorkItemsForIpd', defaultOpenKeys: ['sub4'] });
        break;
        case 'editTasksForIpd':
          _self.setState({ current: 'editTasksForIpd', defaultOpenKeys: ['sub4'] });
        break;
        case 'confirmTasksForIpd':
          _self.setState({ current: 'confirmTasksForIpd', defaultOpenKeys: ['sub4'] });
        break;
        case 'historyManageForIpd':
          _self.setState({ current: 'historyManageForIpd', defaultOpenKeys: ['sub4'] });
        break;
      }
    }else if(params.type == 'department') {
      //部门配置
      switch(params.action) {
        case 'create':
          _self.setState({ current: 'departmentCreate', defaultOpenKeys: ['sub3'] });
        break;
        case 'setPersons':
          _self.setState({ current: 'departmentSetPerson', defaultOpenKeys: ['sub3'] });
        break;
      }
    }else {
      //全局配置
      switch(params.action) {
        case 'setLeaders':
          _self.setState({ current: 'setLeaders', defaultOpenKeys: ['sub1'] });
        break;
        case 'setCreateProjectPerson':
          _self.setState({ current: 'setCreateProjectPerson', defaultOpenKeys: ['sub1'] });
        break;
      }
    }

  },
  setProjectStepInfo(datas) {
    let _self = this;
    let t_presentUserId = Cookies.get('presentUserId');

    let tempProjectConfigStep = 0;
    let tempIsBelong = false;

    _.map(datas.Users, function(item){
      if(item.id == t_presentUserId) tempIsBelong = true;
    })

    if(datas.type == 'project') {
      switch(datas.status){
        case 'waitUploadModule':
          tempProjectConfigStep = 1;
        break;
        case 'waitCutStage':
          tempProjectConfigStep = 2;
        break;
        case 'waitQPManagerConfirm':
          tempProjectConfigStep = 3;
        break;
        case 'waitingBJQPConfirm':
          tempProjectConfigStep = 4;
        break;
        case 'waitAddTasks':
          tempProjectConfigStep = 5;
        break;
        case 'active':
          tempProjectConfigStep = 6;
        break;
      };
    }

    if(datas.type == 'department') {
      switch(datas.status){
        case 'waitSetRoles':
          tempProjectConfigStep = 21;
        break;
      }
    }

    _self.setState({
      projectConfigStep: tempProjectConfigStep,
      isBelong: tempIsBelong
    });
  },
  handleClick(e) {
    this.setState({ current: e.key });
    localStorage.setItem('MenuThreeStage', e.key);
  },
  handleRestartProcessTrim() {
    let projectStatus = Cookies.get('presentProjectStatus');
    let userRoleOfProject = Cookies.get('presentUserRolesOfProject');
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("请选择当前归属项目或部门！");
    if(projectStatus != 'active') return message.warning("项目当前阶段还没激活，不符合重启IPD流程裁剪的要求！");
    if(!this.state.isBelong || userRoleOfProject != '项目经理') return message.warning("您的权限不足，请联系本项目的项目经理！");

    confirm({
      title: 'dES提示',
      content: '您确定要重启IPD流程裁剪吗？',
      onOk() {

        restartProcessTrimForIpd(projectId).then((res) => {
          message.success("重启流程裁剪成功，即将刷新...");
          setTimeout(() => {
            location.reload();
          }, 500)
        })

      },
      onCancel() {},
    });
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    let userDingtalkId    = Cookies.get('presentUserDingtalkId') || null;
    let isSetGlobalPerson = false;
    //周建军
    userDingtalkId == '02385534465664' ? isSetGlobalPerson = true : null;

    return (
      <QueueAnim delay={300} type="left" className={styles["menu-left-bar"]}>
        <Menu key="a" onClick={this.handleClick}
          style={{ borderRight: 0, padding: 0 }}
          selectedKeys={[this.state.current]}
          defaultOpenKeys={state.defaultOpenKeys}
          mode="inline"
          theme="light"
        >

        {
          isSetGlobalPerson ?
            <SubMenu key="sub1" title={<span><i className="iconfont icon-pingtaixinxifabuchakan"></i> 全局配置</span>}>
              <Menu.Item key="setLeaders">
                <Link to="/console/global/setLeaders">● 设置领导人员</Link>
              </Menu.Item>
              <Menu.Item key="setCreateProjectPerson">
                <Link to="/console/global/setCreateProjectPerson">● 设置创建项目人员</Link>
              </Menu.Item>
            </SubMenu>
          :
            null
        }

        {
          Cookies.get('presentProjectType') == 'project' ?
            <SubMenu key="sub2" title={<span><i className="iconfont icon-xiangmu"></i> 项目管理</span>}>
              <Menu.Item key="fixProject">
                <Link to="/console/projects/fixProject"><span>●</span> 变更项目信息</Link>
              </Menu.Item>
              <Menu.Item key="fixPerson">
                <Link to="/console/projects/fixPerson"><span>●</span> 变更项目人员</Link>
              </Menu.Item>
              <Menu.Item key="fixIpd">
                <Link to="/console/projects/fixIpd"><span>●</span> ipd管理</Link>
              </Menu.Item>
            </SubMenu>
          :
            null
        }

        {
          Cookies.get('presentProjectType') == 'project' ?
            <SubMenu key="sub4" title={<span><i className="iconfont icon-yoaliucheng"></i> 项目IPD裁剪</span>}>
              <Menu.Item key="uploadModuleForIpd">
                <Link to="/console/projects/uploadModuleForIpd"><span className={state.projectConfigStep == 1 ? 'text-success': null}>●</span> 上传IPD模板</Link>
              </Menu.Item>
              <Menu.Item key="workItemsTrimForIpd">
                <Link to="/console/projects/workItemsTrimForIpd"><span className={state.projectConfigStep == 2 ? 'text-success': null}>●</span> 工作项裁剪</Link>
              </Menu.Item>
              <Menu.Item key="qualityManagerCheckWorkItemsForIpd">
                <Link to="/console/projects/qualityManagerCheckWorkItemsForIpd"><span className={state.projectConfigStep == 3 ? 'text-success': null}>●</span> 质量经理审核</Link>
              </Menu.Item>
              <Menu.Item key="checkWorkItemsForIpd">
                <Link to="/console/projects/checkWorkItemsForIpd"><span className={state.projectConfigStep == 4 ? 'text-success': null}>●</span> 安质部审批</Link>
              </Menu.Item>
              <Menu.Item key="editTasksForIpd">
                <Link to="/console/projects/editTasksForIpd"><span className={state.projectConfigStep == 5 ? 'text-success': null}>●</span> 编制任务清单</Link>
              </Menu.Item>
              <Menu.Item key="confirmTasksForIpd">
                <Link to="/console/projects/confirmTasksForIpd"><span className={state.projectConfigStep == 5 ? 'text-success': null}>●</span> 审核任务清单</Link>
              </Menu.Item>
              <Menu.Item key="restartProcessTrimForIpd">
                <div style={{position:'relative',left:'-15px'}} onClick={this.handleRestartProcessTrim}>● 重启IPD裁剪</div>
              </Menu.Item>
              <Menu.Item key="historyManageForIpd">
                <Link to="/console/projects/historyManageForIpd"><span>●</span> 历史版本管理</Link>
              </Menu.Item>
            </SubMenu>
          :
            null
        }

        {
          Cookies.get('presentProjectType') == 'department' ?
            <SubMenu key="sub3" title={<span><i className="iconfont icon-bumen"></i> 部门管理</span>}>
              <Menu.Item key="departmentCreate">
                <Link to="/console/department/create">● 创建部门</Link>
              </Menu.Item>
              <Menu.Item key="departmentSetPerson">
                <Link to="/console/department/setPersons"><span className={state.projectConfigStep == 21 ? 'text-success' : null }>●</span> 设置部门人员</Link>
              </Menu.Item>
            </SubMenu>
          :
            null
        }

        </Menu>
      </QueueAnim>
    );
  },
});

export default LeftBar;
