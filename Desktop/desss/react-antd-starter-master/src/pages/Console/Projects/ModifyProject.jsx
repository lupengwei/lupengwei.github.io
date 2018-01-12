import React from 'react';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import { Spin, Form, message, Input, Select, Button, Icon, Row, Col, Alert, DatePicker, InputNumber, Popconfirm, Switch } from 'antd';

import {
  getQiniuToken,
  showProject,
  modifyProjectInfo
} from '../../../services/api';

import styles from '../Common.less'

//ant
const FormItem = Form.Item;
const Option   = Select.Option;

//main
let ModifyProject = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState() {
    return {
      loading: true,
      allSupplierRange: ['ATP','ATO','ATS',' BDMS','DCS','MSS','正线联锁','车辆段联锁','停车场联锁','计轴','电源屏','UPS','蓄电池','LTE','安全认证','施工','设计','信号机','转辙机','光缆','电缆','轨道电路','微机监测','道岔缺口监测','TIAS','IMS（DMS、MSS、NMS）','PSCADA子系统','BAS子系统','最小平台系统','试车线联锁','培训中心联锁', '蓄电池检测', '信息安全'], //所有供货项
      projectSupplierRange: [], //项目范围
      selfSupplierRange: [], //自供货范围
      otherSupplierRange: [], //分包供货范围
      cheXing: null, // 车型
      bianZuAndNums: [], // 编组及数量
      projectDatas: {
        zbje: '',
        htje: '',
        Phases: []
      },
      zbrq: '',
      htqsrq: '',
      htkssj: '',
      htzzsj: '',
      ktsj: '', //项目开通时间
      syysj: '', //项目试运营（行）时间
      hasStage: false,
      stageCounts: 2,
      stageHtml: [],
      stageDatas: [],
    }
  },
  componentDidMount() {
    this.getProjectInfo();
  },
  getProjectInfo() {
    let projectId = Cookies.get('presentBelongProjectId'),
        _self     = this;

    showProject(projectId).then((res) => {
      // console.log(res.jsonResult.project)
      let datas = res.jsonResult.project;
      let projectSupplierRangeArray = [];
      let selfSupplierRangeArray = [];
      let otherSupplierRange = [];
      let bianZuArray = [];
      let tempBianZuArray = [];

      if(datas.xmfw) projectSupplierRangeArray = datas.xmfw.split(',');
      if(datas.zghfw) selfSupplierRangeArray = datas.zghfw.split(',');

      if(datas.Partners) {
        datas.Partners.map((item, index) => {
          let tempJson = {};

          tempJson.fbslxdh = item.contact;
          tempJson.fbsxmjl = item.manager;
          tempJson.fbs = item.name;
          tempJson.type = item.type;

          otherSupplierRange.push(tempJson);
        })
      }

      //获取分段信息
      let tempHasStage = false;
      let tempStageDatas = [];
      let tempStageCounts = 2;

      if(datas.Phases.length > 0) {
        tempHasStage = true;
        tempStageCounts = datas.Phases.length;
        _.map(datas.Phases, (item, key) => {
          let tempJson = {};

          tempJson.name = item.name;
          tempJson.ktsj = item.ktsj;
          tempJson.syxsj = item.syxsj;

          tempStageDatas.push(tempJson);
        })
      }

      // 编组
      bianZuArray = datas.bz ? datas.bz.split('|') : null;

      _.map(bianZuArray, (item) => {
        let tempSubArray = item.split(',');
        tempBianZuArray.push(tempSubArray[0]);
      })

      _self.setState({
        loading: false,
        projectDatas: datas,
        projectSupplierRange: projectSupplierRangeArray, //项目范围
        selfSupplierRange: selfSupplierRangeArray, //自供货范围
        otherSupplierRange: otherSupplierRange, //分包商信息
        zbrq: datas.zbrq,
        htqsrq: datas.htqsrq,
        htkssj: datas.htkssj,
        htzzsj: datas.htzzsj,
        ktsj: datas.ktsj,
        syysj: datas.syysj,
        hasStage: tempHasStage,
        stageCounts: tempStageCounts,
        stageDatas: tempStageDatas,
        cheXing: datas.cx,
        bianZuAndNums: bianZuArray,
        bianZu: tempBianZuArray
      });
    })
  },
  changeProjectSupplierRange(e) {
    let _self = this;
    let projectSupplierRangeTemp = e; //项目范围
    let otherSupplierRangeTemp = _.xor(e, this.state.selfSupplierRange); //其他供货范围
    let tempArray = [];

    otherSupplierRangeTemp.map((item1) => {

      let flag = false;
      let tempItem = '';

      if(_self.state.otherSupplierRange.length != 0) {
        _self.state.otherSupplierRange.map((item2) => {

          if(item1 == item2.type) {
            tempItem = item2;
          }else {
            flag = true
          }
        })

        if(tempItem) tempArray.push(tempItem);

        if(flag && tempItem == '') {
          let tempJson = {};

          tempJson.fbslxdh = '';
          tempJson.fbsxmjl = '';
          tempJson.fbs = '';
          tempJson.type = item1;

          tempArray.push(tempJson);
        }
      }else {
        let tempJson = {};

        tempJson.fbslxdh = '';
        tempJson.fbsxmjl = '';
        tempJson.fbs = '';
        tempJson.type = item1;

        tempArray.push(tempJson);
      }

    })

    this.setState({
      projectSupplierRange: projectSupplierRangeTemp,
      otherSupplierRange: _.uniqWith(tempArray, _.isEqual),
    });
  },
  changeSelfSupplierRange(e) {
    let _self = this;
    let selfSupplierRangeTemp = e; //自供货范围
    let otherSupplierRangeTemp = _.xor(this.state.projectSupplierRange, e); //其他供货范围
    let tempArray = [];

    otherSupplierRangeTemp.map((item1) => {

      let flag = false;
      let tempItem = '';

      if(_self.state.otherSupplierRange.length != 0) {
        _self.state.otherSupplierRange.map((item2) => {

          if(item1 == item2.type) {
            tempItem = item2;
          }else {
            flag = true
          }
        })

        if(tempItem) tempArray.push(tempItem);

        if(flag && tempItem == '') {
          let tempJson = {};

          tempJson.fbslxdh = '';
          tempJson.fbsxmjl = '';
          tempJson.fbs = '';
          tempJson.type = item1;

          tempArray.push(tempJson);
        }
      }else {
        let tempJson = {};

        tempJson.fbslxdh = '';
        tempJson.fbsxmjl = '';
        tempJson.fbs = '';
        tempJson.type = item1;

        tempArray.push(tempJson);
      }

    })

    this.setState({
      selfSupplierRange: selfSupplierRangeTemp, //自供货范围
      otherSupplierRange: _.uniqWith(tempArray, _.isEqual) //其他供货范围
    });
  },
  changeCheXing(e) {
    // 车型
    this.setState({ cheXing: e });
  },
  changeBianZu(e) {
    // 编组
    let tempBzArray = this.state.bianZuAndNums;
    let tempOrginArray = [];
    if(_.size(tempBzArray) > 0) {
      e.map((item1) => {
        let tempStr;
        let tempVal = 0;
        tempBzArray.map((item2) => {
          let tempkey = item2.split(',')[0];
          if(tempkey == item1) {
            // 原编组与现编组比较
            tempVal = item2.split(',')[1] || 0;
          }
        })

        // 已经找到记录
        tempStr = item1+','+tempVal;
        tempOrginArray.push(tempStr);

      })
    }else {
      tempOrginArray = e;
    }

    this.setState({ bianZuAndNums: tempOrginArray });

  },
  handleSubmit(e) {
    let projectId = Cookies.get('presentBelongProjectId'),
        _self = this;

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }

      if(_self.state.projectSupplierRange.length == 0) return message.warning("请选择项目范围");
      if(!_self.state.zbrq) return message.warning("请选择中标日期");
      if(!_self.state.htqsrq) return message.warning("请选择合同签署日期");

      if(!_self.state.hasStage && (!_self.state.ktsj || !_self.state.syysj)) return message.warning("请选择开通和试运行日期");

      // 车型及编组
      if(_self.state.cheXing) {
        if(_self.state.bianZuAndNums.length < 1) return message.warning("请选择编组");
      }else {
        return message.warning("请选择车型");
      }

      // 组装编组及数量
      let bzArray = _self.state.bianZuAndNums;
      let bzStr = ''; // bz存放（编组|数量）
      bzArray.map((item) => {
        let tempKey = item.split(',')[0];
        let temp = tempKey+','+formDatas['bz_'+tempKey.toString()]+'|';
        return bzStr += temp;
      })
      bzStr = bzStr.substr(0, bzStr.length - 1);

      //组装分包商信息
      let FBSArray = _self.state.otherSupplierRange;
      let fbsStr = '';
      FBSArray.map((item, index) => {
        let temp = formDatas['fbs'+index.toString()]+','+formDatas['fbsxmjl'+index.toString()]+','+formDatas['fbslxdh'+index.toString()]+','+item.type+'|';
        return fbsStr += temp;
      })

      fbsStr = fbsStr.substr(0, fbsStr.length - 1);

      //组装分段开通信息
      let fdktStr = '';
      if(_self.state.hasStage) {
        let FDCounts = _self.state.stageCounts;
        for (var i = 1; i <= FDCounts; i++) {
          if(formDatas['fdname'+i.toString()] != 'undefined') {
            let temp = formDatas['fdname'+i.toString()]+','+moment(formDatas['fdsyxsj'+i.toString()]).format('YYYY-MM-DD')+','+moment(formDatas['fdktsj'+i.toString()]).format('YYYY-MM-DD')+'|';
            fdktStr += temp;
          }
        }

        fdktStr = fdktStr.substr(0, fdktStr.length - 1);
      }

      //项目数据
      let datas = {
        name: formDatas.name, //项目简称
        number: formDatas.number, //项目编号
        description: formDatas.description, //项目描述
        fullname: formDatas.fullName, //项目全称
        sszgs: formDatas.sszgs, //所属子公司
        htlx: formDatas.htlx, //合同类型
        zbrq: _self.state.zbrq, //招标日期
        zbje: formDatas.zbje, //招标金额
        xsfzr: formDatas.xsfzr, //销售负责人
        htqsrq: _self.state.htqsrq, //合同签署日期
        htje: formDatas.htje, //合同金额
        xmfw: _.join(_self.state.projectSupplierRange, ','), //项目范围 *
        zghfw: _.join(_self.state.selfSupplierRange, ','), //自供货范围 *
        jsgldw: formDatas.jsgldw, //建设管理单位
        yzdb: formDatas.yzdb, //业主代表
        yzlxdh: formDatas.yzlxdh, //业主联系电话
        yydw: formDatas.yydw, //运营单位
        yyfzr: formDatas.yyfzr, //运营负责人
        yylxdh: formDatas.yylxdh, //运营联系电话
        yzsjdw: formDatas.yzsjdw, //业主设计单位
        yzsjfzr: formDatas.yzsjfzr, //业主设计负责人
        yzsjlxdh: formDatas.yzsjlxdh, //业主设计联系电话
        xhjldw: formDatas.xhjldw, //信号监理单位
        xhjlgcs: formDatas.xhjlgcs, //信号监理工程师
        xhjllxdh: formDatas.xhjllxdh, //信号监理联系电话
        sgjldw: formDatas.sgjldw, //施工监理单位
        sgjlgcs: formDatas.sgjlgcs, //施工监理工程师
        sgjllxdh: formDatas.sgjllxdh, //施工监理联系电话
        sgdw: formDatas.sgdw, //施工单位
        sgxmjl: formDatas.sgxmjl, //施工项目经理
        sglxdh: formDatas.sglxdh, //施工联系电话
        clghdw: formDatas.clghdw, //车辆供货单位
        clxmjl: formDatas.clxmjl, //车辆项目经理
        cllxdh: formDatas.cllxdh, //车辆联系电话
        htgq: formDatas.htgq, //合同工期
        htkssj: _self.state.htkssj, //合同开始时间
        htzzsj: _self.state.htzzsj, //合同终止时间
        zbq: formDatas.zbq, //质保期
        type: 'project',
        partners: fbsStr, //分包商
        phases: fdktStr, //分段开通信息
        ktsj: _self.state.ktsj, //开通时间
        syysj: _self.state.syysj, //试运行时间
        xlcd: formDatas.xlcd, //线路长度
        xtzs: formDatas.xtzs, // 系统制式
        cdcsfs: formDatas.cdcsfs, // 车地传输方式
        gdms: formDatas.gdms, // 轨道模式
        cx: _self.state.cheXing, // 车型
        bz: bzStr, // 编组,车辆数|
        cz: formDatas.cz, // 车站
        zxzcsbjzz: formDatas.zxzcsbjzz, // 正线ZC设备集中站
        zxlssbjzz: formDatas.zxlssbjzz, // 正线联锁设备集中站
        xmdd: formDatas.xmdd, // 项目地点
      };

      _self.setState({ loading: true });

      modifyProjectInfo(projectId, JSON.stringify(datas)).then((res) => {
        message.success("项目信息修改成功，准备刷新页面啦...");
        setTimeout(() => {
          location.reload();
        }, 1000)
      })

    });
  },
  handleChangeZbrq(e) {
    this.setState({ zbrq: moment(e).format('YYYY-MM-DD') });
  },
  handleChangeHtqsrq(e) {
    this.setState({ htqsrq: moment(e).format('YYYY-MM-DD') });
  },
  handleChangeHtkssj(e) {
    this.setState({ htkssj: moment(e).format('YYYY-MM-DD') });
  },
  handleChangeHtzzsj(e) {
    this.setState({ htzzsj: moment(e).format('YYYY-MM-DD') });
  },
  handleChangeKtsj(e) {
    this.setState({ ktsj: moment(e).format('YYYY-MM-DD') });
  },
  handleChangeSyysj(e) {
    this.setState({ syysj: moment(e).format('YYYY-MM-DD') });
  },
  handleChangeStage() {
    //如果是从无到有新增的情况，默认为2段
    if(this.state.projectDatas.Phases.length == 0) {

      let tempStageDatas = [];
      for (let i = 1; i < 3; i++) {
        let tempJson = {};

        tempJson.name = '';
        tempJson.ktsj = '';
        tempJson.syxsj = '';

        tempStageDatas.push(tempJson);
      }

      this.setState({
        hasStage: !this.state.hasStage,
        stageDatas: tempStageDatas
      });

    }else {
      this.setState({ hasStage: !this.state.hasStage });
    }
  },
  handleChangeStageCounts(e) {
    let counts = this.state.stageCounts;
    let tempStageDatas = this.state.stageDatas;

    if(e < counts) {
      //减少
      tempStageDatas = _.dropRight(tempStageDatas);
    }else if(e > counts) {
      //增加，分段开通增减数据处理（表单DOM不能放在methods中，那样会导致无法修改）
      let tempJson = {};

      tempJson.name = '';
      tempJson.ktsj = '';
      tempJson.syxsj = '';

      tempStageDatas.push(tempJson);
    }

    this.setState({
      stageCounts: e,
      stageDatas: tempStageDatas
    });
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    const { getFieldProps } = this.props.form;

    const formItemLayoutCenter = {
      labelCol: { span: 4 },
      wrapperCol: { span: 13 },
    };

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 12 },
    };

    //默认赋值
    let zbrq = state.projectDatas.zbrq ? moment(state.projectDatas.zbrq).format('YYYY-MM-DD') : '2017-01-01';
    let htqsrq = state.projectDatas.htqsrq ? moment(state.projectDatas.htqsrq).format('YYYY-MM-DD') : '2017-01-01';
    let htkssj = state.projectDatas.htkssj ? moment(state.projectDatas.htkssj).format('YYYY-MM-DD') : '2017-01-01';
    let htzzsj = state.projectDatas.htzzsj ? moment(state.projectDatas.htzzsj).format('YYYY-MM-DD') : '2017-01-01';
    let zbje = state.projectDatas.zbje ? state.projectDatas.zbje.toString() : '';
    let htje = state.projectDatas.htje ? state.projectDatas.htje.toString() : '';
    let syysj = state.projectDatas.syysj ? moment(state.projectDatas.syysj).format('YYYY-MM-DD') : '2017-01-01';
    let ktsj = state.projectDatas.ktsj ? moment(state.projectDatas.ktsj).format('YYYY-MM-DD') : '2017-01-01';

    return (
      <QueueAnim>
        <Spin key="a" spinning={state.loading}>
          <Form horizontal form={props.form}>

            <Alert message="1、项目信息" type="info" />

            <div style={{margin:'15px 30px',padding:15,border:'1px dashed #BABABA',borderRadius:10}}>
              <FormItem
                label="项目简称"
                {...formItemLayout}
                style={{marginTop:5}}
              >
                <Input {...getFieldProps('name', {initialValue: state.projectDatas.name || '', rules: [{required: true,message:'项目名称'}]} )} placeholder="输入项目名称" />
              </FormItem>
              <FormItem
                label="项目全称"
                {...formItemLayout}
                style={{marginTop:5}}
              >
                <Input {...getFieldProps('fullName', {initialValue: state.projectDatas.fullname || '', rules: [{required: true,message:'项目全称'}]} )} placeholder="输入项目全称" />
              </FormItem>
              <FormItem
                label="项目编号"
                {...formItemLayout}
                style={{marginTop:5}}
              >
                <Input {...getFieldProps('number', {initialValue: state.projectDatas.number || '', rules: [{required: true,message:'项目编号'}]} )} placeholder="输入项目编号" />
              </FormItem>
              <FormItem
                label="项目简介"
                {...formItemLayout}
                style={{marginTop:5}}
              >
                <Input type="textarea" {...getFieldProps('description', {initialValue: state.projectDatas.description, rules: [{required: true,message:'项目简介'}]} )} placeholder="输入项目简介" rows={4} />
              </FormItem>
              <FormItem
                label="线路长度（KM）"
                {...formItemLayout}
                style={{marginTop:5}}
              >
                <Input {...getFieldProps('xlcd', {initialValue: state.projectDatas.xlcd || '0.00', rules: [{required: true,pattern: /^(([1-9][0-9]{0,20})|([0-9]+\.[0-9]{1,3}))$/,type:'string',message:'线路长度，注意格式'}]} )} style={{width:200}} placeholder="输入线路长度" />
              </FormItem>
              <FormItem
                label="系统制式"
                {...formItemLayout}
                style={{marginTop:5}}
              >
                <Select {...getFieldProps('xtzs', { initialValue: state.projectDatas.xtzs || '', rules: [{required: true,message:'系统制式'}] })} style={{ width: 200 }} >
                  <Option value="CBTC">CBTC</Option>
                  <Option value="FAO">FAO</Option>
                  <Option value="基于CBTC的互联互通">基于CBTC的互联互通</Option>
                  <Option value="基于FAO的互联互通">基于FAO的互联互通</Option>
                  <Option value="C2\+ATO">C2+ATO</Option>
                  <Option value="其他模式">其他模式</Option>
                </Select>
              </FormItem>
              <FormItem
                label="车地传输方式"
                {...formItemLayout}
                style={{marginTop:5}}
              >
                <Select {...getFieldProps('cdcsfs', { initialValue: state.projectDatas.cdcsfs || '', rules: [{required: true,message:'车地传输方式'}] })} style={{ width: 120 }}>
                  <Option value="LTE-M">LTE-M</Option>
                  <Option value="DCS无线传输">DCS无线传输</Option>
                </Select>
              </FormItem>
              <FormItem
                label="轨道模式"
                {...formItemLayout}
                style={{marginTop:5}}
              >
                <Select {...getFieldProps('gdms', { initialValue: state.projectDatas.gdms || '', rules: [{required: true,message:'轨道模式'}] })} style={{ width: 120 }}>
                  <Option value="双轨">双轨</Option>
                  <Option value="悬挂式单轨">悬挂式单轨</Option>
                  <Option value="跨坐式单轨">跨坐式单轨</Option>
                </Select>
              </FormItem>
              <FormItem
                label="车型"
                {...formItemLayout}
                style={{marginTop:5}}
              >
                <Select
                  placeholder="请选择车型"
                  tyle={{ width: 120 }}
                  {...getFieldProps('cx', { initialValue: state.projectDatas.cx || '', onChange: this.changeCheXing })}
                >
                  <Option value="A型">A型</Option>
                  <Option value="B型">B型</Option>
                  <Option value="C型">C型</Option>
                  <Option value="L型">L型</Option>
                  <Option value="市域客车">市域客车</Option>
                </Select>
              </FormItem>
              {
                state.cheXing || state.projectDatas.cx ?
                  <FormItem
                    label="编组"
                    {...formItemLayout}
                    style={{marginTop:5}}
                  >
                    <Select
                      multiple
                      placeholder="请选择编组"
                      tyle={{ width: 120 }}
                      {...getFieldProps('bz00', { initialValue: state.bianZu || 2, onChange: this.changeBianZu })}
                    >
                      <Option value="2">2</Option>
                      <Option value="4">4</Option>
                      <Option value="6">6</Option>
                      <Option value="8">8</Option>
                      <Option value="10">10</Option>
                    </Select>
                  </FormItem>
                :
                  null
              }

              {
                _.map(state.bianZuAndNums, (item, index) => {
                  let tempInitBzArray = item.split(',');
                  let tempBzKey = tempInitBzArray[0];
                  let tempBzVal = tempInitBzArray[1];
                  let bzName = tempBzKey.toString()+'编组数量';
                  let bzKey = 'bz_'+tempBzKey.toString();
                  return (
                    <FormItem
                      key={index}
                      label={bzName}
                      {...formItemLayout}
                      style={{marginTop:5}}
                    >
                      <Input {...getFieldProps(bzKey, { initialValue: tempBzVal || 0, rules: [{required: true,pattern: /^(([1-9][0-9]{0,20})|([0-9]))$/,type:'string',message:'编组数量'}]} )} placeholder="输入编组数量" style={{ width: 120 }} />
                    </FormItem>
                  )
                })
              }

              <FormItem
                label="车站"
                {...formItemLayout}
                style={{marginTop:5}}
              >
                <Input {...getFieldProps('cz', { initialValue: (state.projectDatas.cz || 0)+'', rules: [{required: true,pattern: /^(([1-9][0-9]{0,20})|([0-9]))$/,type:'string',message:'车站数量'}]} )} placeholder="输入其数量" style={{ width: 120 }} />
              </FormItem>
              <FormItem
                label="正线ZC设备集中站"
                {...formItemLayout}
                style={{marginTop:5}}
              >
                <Input {...getFieldProps('zxzcsbjzz', { initialValue: (state.projectDatas.zxzcsbjzz || 0)+'', rules: [{required: true,pattern: /^(([1-9][0-9]{0,20})|([0-9]))$/,type:'string',message:'正线ZC设备集中站数量'}]} )} placeholder="输入其数量" style={{ width: 120 }} />
              </FormItem>
              <FormItem
                label="正线联锁设备集中站"
                {...formItemLayout}
                style={{marginTop:5}}
              >
                <Input {...getFieldProps('zxlssbjzz', { initialValue: (state.projectDatas.zxlssbjzz || 0)+'', rules: [{required: true,pattern: /^(([1-9][0-9]{0,20})|([0-9]))$/,type:'string',message:'正线联锁设备集中站数量'}]} )} placeholder="输入其数量" style={{ width: 120 }} />
              </FormItem>
              <FormItem
                label="项目地点"
                {...formItemLayout}
                style={{marginTop:5}}
              >
                <Input {...getFieldProps('xmdd', { initialValue: state.projectDatas.xmdd || '', rules: [{required: true,message:'项目地点'}]} )} placeholder="输入项目地点" />
              </FormItem>
              <FormItem
                label="所属子公司"
                {...formItemLayout}
                style={{marginTop:5}}
              >
                <Select {...getFieldProps('sszgs', {initialValue: state.projectDatas.sszgs })}>
                  <Option value="重庆子公司">重庆子公司</Option>
                  <Option value="天津子公司">天津子公司</Option>
                  <Option value="深圳子公司">深圳子公司</Option>
                </Select>
              </FormItem>
              <FormItem
                label="是否分段开通"
                {...formItemLayout}
                style={{marginTop:5}}
              >
                <Switch checked={state.hasStage} onChange={this.handleChangeStage} />
              </FormItem>

              {
                state.hasStage ?
                  <div>
                    <FormItem
                      label="分段数"
                      {...formItemLayout}
                      style={{marginTop:5}}
                    >
                      <InputNumber min={2} max={10} {...getFieldProps('fds', {initialValue: state.stageCounts, onChange: this.handleChangeStageCounts })} />
                      <span className="text-warning"><Icon type="question-circle-o" /> 建议不要手动输入</span>
                    </FormItem>
                  </div>
                :
                  <div>
                    <FormItem
                      label="开通时间"
                      {...formItemLayoutCenter}
                      style={{marginTop:5}}
                    >
                      <DatePicker {...getFieldProps('ktsj', {initialValue: ktsj, onChange: this.handleChangeKtsj} )} style={{width:200}} />
                    </FormItem>
                    <FormItem
                      label="试运行时间"
                      {...formItemLayoutCenter}
                      style={{marginTop:5}}
                    >
                      <DatePicker {...getFieldProps('syysj', {initialValue: syysj, onChange: this.handleChangeSyysj} )} style={{width:200}} />
                    </FormItem>
                  </div>
              }

              {
                state.hasStage ?
                  <div>
                    {
                      _.map(state.stageDatas, (item, key) => {
                        let i = key + 1;
                        let fdktsj = moment().format('YYYY-MM-DD');
                        let fdsyxsj = moment().format('YYYY-MM-DD');

                        if(item.ktsj) fdktsj = moment(item.ktsj).format('YYYY-MM-DD');
                        if(item.syxsj) fdsyxsj = moment(item.syxsj).format('YYYY-MM-DD');

                        return (
                          <div key={i}>
                            <FormItem
                              label={'第'+ i +'段名称'}
                              {...formItemLayoutCenter}
                              style={{marginTop:5}}
                            >
                              <Input disabled {...getFieldProps('fdname'+i.toString(), {initialValue: item.name || ('第'+ i +'段'), rules: [{required: true,pattern: /^[^\,\|]+$/,type:'string',message:'分段名称，不能包含,与|字符'}]} )} placeholder="输入分段名称" />
                            </FormItem>
                            <FormItem
                              label={'第'+ i +'段开通时间'}
                              {...formItemLayoutCenter}
                              style={{marginTop:5}}
                            >
                              <DatePicker {...getFieldProps('fdktsj'+i.toString(), {initialValue: fdktsj} )} placeholder="选择开通时间" />
                            </FormItem>
                            <FormItem
                              label={'第'+ i +'段试运行时间'}
                              {...formItemLayoutCenter}
                              style={{marginTop:5}}
                            >
                              <DatePicker {...getFieldProps('fdsyxsj'+i.toString(), {initialValue: fdsyxsj} )} placeholder="选择试运行时间" />
                            </FormItem>
                          </div>
                        )
                      })
                    }
                  </div>
                :
                  null
              }
            </div>

            <div style={{marginTop:15}}><Alert message="2、市场信息" type="success" /></div>

            <div style={{margin:'15px 30px',padding:15,border:'1px dashed #BABABA',borderRadius:10}}>
              <FormItem
                label="中标日期"
                {...formItemLayoutCenter}
                style={{marginTop:5}}
              >
                <DatePicker {...getFieldProps('zbrq', {initialValue: zbrq, onChange: this.handleChangeZbrq} )} style={{width:200}} />
              </FormItem>
              <FormItem
                label="中标金额（元）"
                {...formItemLayoutCenter}
                style={{marginTop:5}}
              >
                <Input {...getFieldProps('zbje', {initialValue: zbje, rules: [{required: true,pattern: /^(([1-9][0-9]{0,20})|([0-9]+\.[0-9]{1,2}))$/,type:'string',message:'中标金额，注意格式'}]} )} style={{width:200}} placeholder="输入中标金额" />
              </FormItem>
              <FormItem
                label="销售负责人"
                {...formItemLayoutCenter}
                style={{marginTop:5}}
              >
                <Input {...getFieldProps('xsfzr', {initialValue: state.projectDatas.xsfzr || '', rules: [{required: true,message:'输入销售负责人'}]} )} style={{width:200}} placeholder="输入销售负责人" />
              </FormItem>
            </div>

            <div style={{marginTop:15}}><Alert message="3、合同信息" type="info" /></div>

            <div style={{margin:'15px 30px',padding:15,border:'1px dashed #BABABA',borderRadius:10}}>

              <FormItem
                label="合同签署日期"
                {...formItemLayoutCenter}
                style={{marginTop:5}}
              >
                <DatePicker {...getFieldProps('htqsrq', {initialValue: htqsrq, onChange: this.handleChangeHtqsrq} )} style={{width:200}} />
              </FormItem>
              <FormItem
                label="合同金额（元）"
                {...formItemLayoutCenter}
                style={{marginTop:5}}
              >
                <Input {...getFieldProps('htje', {initialValue: htje, rules: [{required: true,pattern: /^(([1-9][0-9]{0,20})|([0-9]+\.[0-9]{1,2}))$/,type:'string',message:'合同金额，注意格式'}]} )} style={{width:200}} placeholder="输入合同金额" />
              </FormItem>
              <FormItem
                label="合同工期（月）"
                {...formItemLayoutCenter}
                style={{marginTop:5}}
              >
                <InputNumber {...getFieldProps('htgq', { initialValue: state.projectDatas.htgq || 1 })} min={1} max={60} />
              </FormItem>
              <FormItem
                label="合同类型"
                {...formItemLayoutCenter}
                style={{marginTop:5}}
              >
                <Select {...getFieldProps('htlx', { initialValue: state.projectDatas.htlx || '集成总包',  })} style={{ width: 120 }}>
                  <Option value="集成总包">集成总包</Option>
                  <Option value="分包">分包</Option>
                </Select>
              </FormItem>
              <FormItem
                label="合同开始时间"
                {...formItemLayoutCenter}
                style={{marginTop:5}}
              >
                <DatePicker {...getFieldProps('htkssj', {initialValue: htkssj, onChange: this.handleChangeHtkssj } )} style={{width:200}} />
              </FormItem>
              <FormItem
                label="合同终止时间"
                {...formItemLayoutCenter}
                style={{marginTop:5}}
              >
                <DatePicker {...getFieldProps('htzzsj', {initialValue: htzzsj, onChange: this.handleChangeHtzzsj } )} style={{width:200}} />
              </FormItem>
              <FormItem
                label="质保期（年）"
                {...formItemLayoutCenter}
                style={{marginTop:5}}
              >
                <Select {...getFieldProps('zbq', { initialValue: state.projectDatas.zbq || '3' })} style={{ width: 120 }}>
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                  <Option value="5">5</Option>
                  <Option value="6">6</Option>
                  <Option value="7">7</Option>
                  <Option value="8">8</Option>
                </Select>
              </FormItem>
            </div>

            <div style={{marginTop:15}}><Alert message="4、供货范围" type="success" /></div>

            <div style={{margin:'15px 30px',padding:15,border:'1px dashed #BABABA',borderRadius:10}}>
              <div className="bg-gray text-warning">4-1、供货范围</div>
                <FormItem
                  label="项目范围"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Select
                    multiple
                    placeholder="请选择项目范围"
                    style={{minWidth:300}}
                    {...getFieldProps('xmghfw', { initialValue: state.projectSupplierRange, onChange: this.changeProjectSupplierRange })}
                  >
                    {
                      state.allSupplierRange.map((item, index) => {
                        return (
                          <Option key={index} value={item}>{item}</Option>
                        )
                      })
                    }
                  </Select>
                </FormItem>
                <div className="bg-gray text-warning">4-2、自供货范围</div>
                <FormItem
                  label="自供货范围"
                  style={{marginTop:5}}
                  {...formItemLayout}
                >
                  <Select
                    multiple
                    placeholder="请选择自供货范围"
                    style={{minWidth:300}}
                    {...getFieldProps('zghfw', { initialValue: state.selfSupplierRange, onChange: this.changeSelfSupplierRange })}
                  >
                    {
                      state.projectSupplierRange.map((item, index) => {
                        return (
                          <Option key={index} value={item}>{item}</Option>
                        )
                      })
                    }
                  </Select>
                </FormItem>


              <div className="bg-gray text-warning">4-3、供方信息</div>
              {
                state.otherSupplierRange.length == 0 ?
                  <div className={styles["no-content-tips"]}><Icon type="like" /> 自己都把货供完了，已经没有分包的事儿啦...</div>
                :
                  null
              }
              {
                state.otherSupplierRange.map((item, index) => {
                  return (
                    <div key={index} >
                      <FormItem
                        label={item.type+"供方"}
                        {...formItemLayout}
                        style={{marginTop:5}}
                      >
                        <Input {...getFieldProps('fbs'+index.toString(), {initialValue: state.otherSupplierRange[index].fbs || '',rules: [{required: true,message:item.type+'供方名称'}]} )} placeholder="输入供方名称" />
                      </FormItem>
                      <FormItem
                        label={item.type+"供方项目经理"}
                        {...formItemLayout}
                        style={{marginTop:5}}
                      >
                        <Input {...getFieldProps('fbsxmjl'+index.toString(), {initialValue: state.otherSupplierRange[index].fbsxmjl || '',rules: [{required: true,message:item.type+'分包商项目经理'}]} )} style={{width:200}} placeholder="输入供方项目经理" />
                      </FormItem>
                      <FormItem
                        label={item.type+"供方联系电话"}
                        {...formItemLayout}
                        style={{marginTop:5}}
                      >
                        <Input {...getFieldProps('fbslxdh'+index.toString(), {initialValue: state.otherSupplierRange[index].fbslxdh || '',rules: [{required: true,type:'string',pattern: /^[1-9][0-9\-]+$/,message:item.type+'供方联系电话'}]} )} style={{width:200}} placeholder="输入供方联系电话" />
                      </FormItem>
                      {
                        state.otherSupplierRange.length == index+1 ?
                          null
                        :
                          <p style={{width:'100%',borderTop:'1px dashed #DDDEE2',marginBottom:20}}></p>
                      }
                    </div>
                  )
                })
              }
            </div>

            <div style={{marginTop:15}}><Alert message="5、对外关系" type="info" /></div>

            <div style={{margin:'15px 30px',padding:15,border:'1px dashed #BABABA',borderRadius:10}}>
              <div className="bg-gray text-warning">5-1、建管单位信息</div>

                <FormItem
                  label="建设管理单位"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('jsgldw', {initialValue: state.projectDatas.jsgldw || '', rules: [{required: true,message:'建设管理单位'}]} )} placeholder="输入建设管理单位" />
                </FormItem>
                <FormItem
                  label="业主代表"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('yzdb', {initialValue: state.projectDatas.yzdb || '', rules: [{required: true,message:'业主代表'}]} )} style={{width:200}} placeholder="输入业主代表" />
                </FormItem>
                <FormItem
                  label="业主联系电话"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('yzlxdh', {initialValue: state.projectDatas.yzlxdh || '', rules: [{required: true,pattern: /^[1-9][0-9\-]+$/,message:'业主联系电话，注意格式'}]} )} style={{width:200}} placeholder="输入业主联系电话" />
                </FormItem>

                <div className="bg-gray text-warning">5-2、运营单位信息</div>
                <FormItem
                  label="运营单位"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('yydw', {initialValue: state.projectDatas.yydw || '', rules: [{required: true,message:'运营单位'}]} )} placeholder="输入运营单位" />
                </FormItem>
                <FormItem
                  label="运营负责人"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('yyfzr', {initialValue: state.projectDatas.yyfzr || '', rules: [{required: true,message:'运营负责人'}]} )} style={{width:200}} placeholder="输入运营负责人" />
                </FormItem>
                <FormItem
                  label="运营联系电话"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('yylxdh', {initialValue: state.projectDatas.yylxdh || '', rules: [{required: true,pattern: /^[1-9][0-9\-]+$/,message:'运营联系电话，注意格式'}]} )} style={{width:200}} placeholder="输入运营联系电话" />
                </FormItem>

                <div className="bg-gray text-warning">5-3、业主设计单位信息</div>
                <FormItem
                  label="业主设计单位"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('yzsjdw', {initialValue: state.projectDatas.yzsjdw || '', rules: [{required: true,message:'业主设计单位'}]} )} placeholder="输入业主设计单位" />
                </FormItem>
                <FormItem
                  label="业主设计负责人"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('yzsjfzr', {initialValue: state.projectDatas.yzsjfzr || '', rules: [{required: true,message:'业主设计负责人'}]} )} style={{width:200}} placeholder="输入业主设计负责人" />
                </FormItem>
                <FormItem
                  label="业主设计联系电话"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('yzsjlxdh', {initialValue: state.projectDatas.yzsjlxdh || '', rules: [{required: true,pattern: /^[1-9][0-9\-]+$/,message:'业主设计联系电话，注意格式'}]} )} style={{width:200}} placeholder="输入业主设计联系电话" />
                </FormItem>

                <div className="bg-gray text-warning">5-4、监理单位信息</div>
                <FormItem
                  label="信号监理单位"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('xhjldw', {initialValue: state.projectDatas.xhjldw || '', rules: [{required: true,message:'信号监理单位'}]} )} placeholder="输入信号监理单位" />
                </FormItem>
                <FormItem
                  label="信号监理工程师"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('xhjlgcs', {initialValue: state.projectDatas.xhjlgcs || '', rules: [{required: true,message:'信号监理工程师'}]} )} style={{width:200}} placeholder="输入信号监理工程师" />
                </FormItem>
                <FormItem
                  label="信号监理联系电话"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('xhjllxdh', {initialValue: state.projectDatas.xhjllxdh || '', rules: [{required: true,pattern: /^[1-9][0-9\-]+$/,message:'信号监理联系电话，注意格式'}]} )} style={{width:200}} placeholder="输入信号监理联系电话" />
                </FormItem>
                <div style={{width:'100%'}}></div>
                <FormItem
                  label="施工监理单位"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('sgjldw', {initialValue: state.projectDatas.sgjldw || '', rules: [{required: true,message:'施工监理单位'}]} )} placeholder="输入施工监理单位" />
                </FormItem>
                <FormItem
                  label="施工监理工程师"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('sgjlgcs', {initialValue: state.projectDatas.sgjlgcs || '', rules: [{required: true,message:'施工监理工程师'}]} )} style={{width:200}} placeholder="输入施工监理工程师" />
                </FormItem>
                <FormItem
                  label="施工监理联系电话"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('sgjllxdh', {initialValue: state.projectDatas.sgjllxdh || '', rules: [{required: true,pattern: /^[1-9][0-9\-]+$/,message:'施工监理联系电话，注意格式'}]} )} style={{width:200}} placeholder="输入施工监理联系电话" />
                </FormItem>

                <div className="bg-gray text-warning">5-5、施工单位信息</div>
                <FormItem
                  label="施工单位"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('sgdw', {initialValue: state.projectDatas.sgdw || '', rules: [{required: true,message:'施工单位'}]} )} placeholder="输入施工单位" />
                </FormItem>
                <FormItem
                  label="施工项目经理"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('sgxmjl', {initialValue: state.projectDatas.sgxmjl || '', rules: [{required: true,message:'施工项目经理'}]} )} style={{width:200}} placeholder="输入施工项目经理" />
                </FormItem>
                <FormItem
                  label="施工联系电话"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('sglxdh', {initialValue: state.projectDatas.sglxdh || '', rules: [{required: true,pattern: /^[1-9][0-9\-]+$/,message:'施工联系电话，注意格式'}]} )} style={{width:200}} placeholder="输入施工联系电话" />
                </FormItem>

                <div className="bg-gray text-warning">5-6、车辆单位信息</div>
                <FormItem
                  label="车辆供货单位"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('clghdw', {initialValue: state.projectDatas.clghdw || '', rules: [{required: true,message:'车辆供货单位'}]} )} placeholder="输入车辆供货单位" />
                </FormItem>
                <FormItem
                  label="车辆项目经理"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('clxmjl', {initialValue: state.projectDatas.clxmjl || '', rules: [{required: true,message:'车辆项目经理'}]} )} style={{width:200}} placeholder="输入车辆项目经理" />
                </FormItem>
                <FormItem
                  label="车辆联系电话"
                  {...formItemLayout}
                  style={{marginTop:5}}
                >
                  <Input {...getFieldProps('cllxdh', {initialValue: state.projectDatas.cllxdh || '', rules: [{required: true,pattern: /^[1-9][0-9\-]+$/,message:'车辆联系电话，注意格式'}]} )} style={{width:200}} placeholder="输入车辆联系电话" />
                </FormItem>

              <p style={{textAlign:'center'}}>
                <Popconfirm title="确定项目信息无误吗？" onConfirm={this.handleSubmit}>
                  <Button type="primary">确定并提交</Button>
                </Popconfirm>
              </p>
            </div>
          </Form>
        </Spin>
      </QueueAnim>
    )
  }
});

ModifyProject = Form.create()(ModifyProject);

export default ModifyProject;