import React from 'react';
import Cookies from 'js-cookie';
import moment from 'moment';
import { Link } from 'react-router';

import { Menu, Icon, message, Table, Button } from 'antd';

import MainLayout from '../../layouts/MainLayout/MainLayout';

import styles from './Common.less';

import TableDemo from './TableDemo';
import DocumentCover from './DocumentCover';
import DivideStage from './DivideStage';
import SetProjectPerson from './SetProjectPerson';
import FormValidate from './FormValidate';
import FlexLayout from './FlexLayout';
import ReviewLayout from './ReviewLayout';
import RecordLayout from './RecordLayout';
import WeeklyPlan from './WeeklyPlan';
import RichText from './RichText';
import ProjectInfo from './ProjectInfo';
import ProjectCompare from './ProjectCompare';
import TableToExcel from './TableToExcel';
import NewDemo from './NewDemo';
import OpenNewWindow from './OpenNewWindow';

import { apiDemo } from '../../services/api';

//ant初始组件

const Demo = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState() {
    return {
      subComponents: '' 
    };
  },
  componentDidMount() {
    if(Cookies.get('presentUserDingtalkId') != 'manager7850') return this.context.router.push('/notFound');

    // let nowTimes = moment();
    // let addThreeMonths = moment(nowTimes).add(3, 'M').format('YYYY-MM-DD mm:ss');
    // let addSixMonths = moment(nowTimes).add(6, 'M').format('YYYY-MM-DD mm:ss');
    // let addTwelveMonths = moment(nowTimes).add(12, 'M').format('YYYY-MM-DD mm:ss');
    // let addTwentyFourMonths = moment(nowTimes).add(24, 'M').format('YYYY-MM-DD mm:ss');
    // let addSomeDays = moment(nowTimes).add(30, 'd').format('YYYY-MM-DD mm:ss');

    // console.log('当前时间：', moment(nowTimes).format('YYYY-MM-DD mm:ss'))
    // console.log('30天：', addSomeDays)
    // console.log('3月：', addThreeMonths)
    // console.log('6月：', addSixMonths)
    // console.log('12月：', addTwelveMonths)
    // console.log('24月：', addTwentyFourMonths)

  },
  // scrollToAnchor(anchorName) {
  // 单页应用中页面滚动
  //   if (anchorName) {
  //       let anchorElement = document.getElementById(anchorName);
  //       if(anchorElement) { anchorElement.scrollIntoView(); }
  //   }
  // },
  render () {
    let state = this.state,
        props = this.props,
        _self = this;

    let routePrams = props.params.str;
    let subComponents = '';

    switch(routePrams){
      case 'table':
        subComponents = <TableDemo />;
      break;
      case 'cover':
        subComponents = <DocumentCover />;
      break;
      case 'stage':
        subComponents = <DivideStage />;
      break;
      case 'person':
        subComponents = <SetProjectPerson />;
      break;
      case 'validate':
        subComponents = <FormValidate />;
      break;
      case 'flex':
        subComponents = <FlexLayout />;
      break;
      case 'review':
        subComponents = <ReviewLayout />;
      break;
      case 'record':
        subComponents = <RecordLayout />;
      break;
      case 'plan':
        subComponents = <WeeklyPlan />;
      break;
      case 'rich':
        subComponents = <RichText />;
      break;
      case 'projectInfo':
        subComponents = <ProjectInfo />;
      break;
      case 'projectCompare':
        subComponents = <ProjectCompare />;
      break;
      case 'tableToExcel':
        subComponents = <TableToExcel />;
      break;
      case 'newDemo':
        subComponents = <NewDemo />;
      break;
      case 'openNewWindow':
        subComponents = <OpenNewWindow />;
      break;
      default:
        subComponents = '';
      break;
    }

    return (
      <MainLayout>
        <div style={{ height:'100%',padding:15,overflow: 'auto' }}>
          <div style={{marginBottom:15, paddingBottom:15, borderBottom:'1px dashed #CCC'}}>
            <Button style={{margin:'5px 0 0 15px'}}><Link to="/demo/openNewWindow">打开新窗口</Link></Button>
            <Button style={{margin:'5px 0 0 15px'}}><Link to="/demo/table">基础表格</Link></Button>
            <Button style={{margin:'5px 0 0 15px'}}><Link to="/demo/cover">文档封面</Link></Button>
            <Button style={{margin:'5px 0 0 15px'}}><Link to="/demo/stage">阶段划分</Link></Button>
            <Button style={{margin:'5px 0 0 15px'}}><Link to="/demo/person">人员设置</Link></Button>
            <Button style={{margin:'5px 0 0 15px'}}><Link to="/demo/validate">表单验证</Link></Button>
            <Button style={{margin:'5px 0 0 15px'}}><Link to="/demo/flex">Flex布局</Link></Button>
            <Button style={{margin:'5px 0 0 15px'}}><Link to="/demo/review">评审反馈单</Link></Button>
            <Button style={{margin:'5px 0 0 15px'}}><Link to="/demo/record">评审记录单</Link></Button>
            <Button style={{margin:'5px 0 0 15px'}}><Link to="/demo/plan">双周计划</Link></Button>
            <Button style={{margin:'5px 0 0 15px'}}><Link to="/demo/rich">富文本</Link></Button>
            <Button style={{margin:'5px 0 0 15px'}}><Link to="/demo/projectInfo">项目信息</Link></Button>
            <Button style={{margin:'5px 0 0 15px'}}><Link to="/demo/projectCompare">项目比较</Link></Button>
            <Button style={{margin:'5px 0 0 15px'}}><Link to="/demo/tableToExcel">导出Excel</Link></Button>
            <Button style={{margin:'5px 0 0 15px'}}><a href="http://localhost:8888/Projects/ExportExcel/downloadExcel.php">PHPExcel本地导出Excel</a></Button>
            <Button style={{margin:'5px 0 0 15px'}}><Link to="/demo/newDemo">New Demo</Link></Button>
          </div>
          { subComponents }
        </div>
      </MainLayout>
    );
  }
});

export default Demo;
