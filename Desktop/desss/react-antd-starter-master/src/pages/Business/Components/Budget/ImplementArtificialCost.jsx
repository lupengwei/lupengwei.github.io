/**
 * 实施人工费
 */
import React from 'react';
import { Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import { Modal, Table, Form, Input, Icon, Spin, Popconfirm, Button, message, Tooltip } from 'antd';
import styles from '../Common.less';

import {
  showProject,
  getBudgetSummaryTables,
  createLabourImplements,
  deleteLabourImplements,
} from '../../../../services/api';

//ant
const FormItem = Form.Item;
const confirm  = Modal.confirm;

//main
let ImplementArtificialCost = React.createClass({
  getInitialState() {
    return {
      visible: false,
      loading: true,
      projectDatas: {
        htqdnArray: [],
        zbqArray: []
      },
      dataSource: [],
      columns: [],
      budgetSummaryDatas: [], //预算汇总数据
      selectData: {
        type: '人工费（实施）预算'
      }, //当前操作的数据
      initDatas: ['项目实施团队', '工程设计中心', '研发', '测试', '安质', '重庆子公司', '天津子公司', '深圳子公司'], //初始化数据
    };
  },
  componentDidMount() {
    this.showProjectInfo();
  },
  showProjectInfo() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("请选择归属项目或部门！");

    showProject(projectId).then((res) => {
      let datas = res.jsonResult.project;
      let tempHtqdnArray = [];
      let tempZbqArray = [];

      //合同起止时间与质保期必须有
      if(datas.htkssj && datas.htzzsj && datas.zbq) {

        let startDate = moment(datas.htkssj).format('YYYY-MM-DD');
        let endDate = moment(datas.htzzsj).format('YYYY-MM-DD');
        let zbqYears = parseInt(datas.zbq); //质保期 年

        let startYear = parseInt(moment(startDate).format('YYYY'));
        let endYear = parseInt(moment(endDate).format('YYYY'));

        let yearDiffCounts = (endYear+1) - startYear; //至少保证有一年

        //组装合同签订年
        for(let i = 0; i < yearDiffCounts; i++) {
          tempHtqdnArray.push(startYear+i);
        }
        //组装质保期
        let tempEndYear = parseInt(moment(endDate).format('YYYY'));
        for(let j = 0; j <= zbqYears; j++) {
          tempZbqArray.push(tempEndYear+j);
        }

        //赋值
        datas.htqdnArray = tempHtqdnArray;
        datas.zbqArray = tempZbqArray;

      }else {
        message.warning("请在项目静态信息里面完善合同起止时间与质保期！");
        //赋空值
        datas.htqdnArray = [];
        datas.zbqArray = [];
      }

      _self.setState({ projectDatas: datas });

      //获取汇总信息
      _self.showBudgetSummaryTables();

    })
  },
  showBudgetSummaryTables() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("请选择归属项目或部门！");

    //获取已知数据
    getBudgetSummaryTables(projectId).then((res) => {
      let datas = res.jsonResult.budgetTable;

      let tempArray = [];

      datas.LabourImplements.map((l) => {

        let tempContractArr = [];
        let tempQualityArr = [];
        let tempJson = {};
        let total = 0;

        tempJson.recordId = l.id;
        tempJson.type = l.name;

        if(l.contractArr) {

          tempContractArr = l.contractArr.split(',');

          _self.state.projectDatas.htqdnArray.map((item, key) => {
            let tempCost = tempContractArr[key];
            tempJson['合同'+item.toString()] = tempCost;
            if(tempCost) total += parseFloat(tempCost);
          })

        }

        if(l.qualityArr) {

          tempQualityArr = l.qualityArr.split(',');

          _self.state.projectDatas.zbqArray.map((item, key) => {
            let tempCost = tempQualityArr[key];
            tempJson['质保'+item.toString()] = tempQualityArr[key];
            if(tempCost) total += parseFloat(tempCost);
          })

        }

        tempJson.total = total;
        tempArray.push(tempJson);
        
      })

      _self.setState({ budgetSummaryDatas: tempArray });

      //获取表信息
      _self.showTableInfo();

    })
  },
  showTableInfo() {
    let _self = this;

    //合计数据
    let totalRecord = {
      type: '合计',
      total: 0,
    };

    /****** 表列 ******/
    let tempColumns = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      className: styles.textAlignCenter
    }, {
      title: '费用类型',
      dataIndex: 'type',
      key: 'type',
      className: styles.textAlignCenter
    }, {
      title: '合计',
      dataIndex: 'total',
      key: 'total',
      render: (text, record) => {
        return (
          <center>￥
            {
              text ? <span>{desp_toThousands(text)}</span> : '0.00'
            }
          </center>
        );
      }
    }];

    //合同签署年
    _self.state.projectDatas.htqdnArray.map((item, key) => {
      let tempJson = {};
      let tempField = '合同'+item.toString();

      tempJson.title = item.toString()+'年';
      tempJson.dataIndex = tempField;
      tempJson.key = tempField;
      tempJson.className = styles.textAlignRight;
      tempJson.render = (text) => {
        return (
          <center>
            {
              text ? <span>￥{desp_toThousands(text)}</span> : '/'
            }
          </center>
        );
      }

      totalRecord[tempField] = 0; //合同每年合计

      tempColumns.push(tempJson);
    })

    //质保期
    _self.state.projectDatas.zbqArray.map((item, key) => {
      let tempJson = {};
      let tempField = '质保'+item.toString();

      tempJson.title = '质保期.'+item.toString()+'年';
      tempJson.dataIndex = tempField;
      tempJson.key = tempField;
      tempJson.className = styles.textAlignRight;
      tempJson.render = (text) => {
        return (
          <center>
            {
              text ? <span>￥{desp_toThousands(text)}</span> : '/'
            }
          </center>
        );
      }

      totalRecord[tempField] = 0; //质保期每年合计

      tempColumns.push(tempJson);
    })

    //操作
    let tempOptions = {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => {
        if(record.type == '合计') return false;
        return (
          <center>
            {
              record.total ?
                <Button disabled type="primary" size="small"><Icon type="edit" /></Button>
              :
                <Tooltip title="编辑" placement="top">
                  <Button onClick={_self.showModalForUpdate.bind(null, record)} type="primary" size="small"><Icon type="edit" /></Button>
                </Tooltip>
            }
            {
              record.total ?
                <Tooltip title="删除" placement="top">
                  <Button onClick={_self.deleteCostItem.bind(null, record)} type="dashed" size="small" style={{marginLeft:5}}><Icon type="cross-circle-o" /></Button>
                </Tooltip>
              :
                <Button disabled type="dashed" size="small" style={{marginLeft:5}}><Icon type="cross-circle-o" /></Button>
            }
          </center>
        )
      }
    };

    //表列结束
    tempColumns.push(tempOptions);

    /****** 表行 ******/
    let tempDataSource = [];

    _.map(_self.state.initDatas, (item1, key1) => {

      let totalMoneyForColumns = 0;
      let flag = false;

      _.map(_self.state.budgetSummaryDatas, (item2) => {
        if(item1 == item2.type) {
          //有则输出
          let tempJson = item2;
          tempJson.id = key1+1;

          tempDataSource.push(tempJson);

          //每年的合计
          _.map(item2, (item3, key3) => {

            flag = true;

            if(item3 && (key3.substr(0, 2) == '合同' || key3.substr(0, 2) == '质保')) {
              totalRecord[key3] += parseFloat(item3);
            }
            if(key3 == 'total') {
              totalRecord.total += parseFloat(item3);
            }
          })

        }
      })

      //如果不存在就添加空白记录
      if(!flag) {
        let tempJson = {};

        tempJson.id = key1+1;
        tempJson.type = item1;

        tempDataSource.push(tempJson);
      }

    })

    //输出新增的预算记录项（接在初始数据之后）
    let numbers = tempDataSource.length;
    _.map(_self.state.budgetSummaryDatas, (item1, key1) => {

      let flag = false;

      _.map(_self.state.initDatas, (item2) => {
        if(item1.type == item2) flag = true;
      })

      if(!flag) {
        ++numbers;
        let tempJson = item1;

        tempJson.id = numbers;

        //每年的合计
        _.map(item1, (item3, key3) => {
          if(item3 && (key3.substr(0, 2) == '合同' || key3.substr(0, 2) == '质保')) {
            totalRecord[key3] += parseFloat(item3);
          }
          if(key3 == 'total') {
            totalRecord.total += parseFloat(item3);
          }
        })

        tempDataSource.push(tempJson);
      }

    })

    tempDataSource.push(totalRecord);

    _self.setState({
      columns: tempColumns,
      dataSource: tempDataSource,
      loading: false
    });

  },
  showModalForUpdate(value) {
    this.setState({
      selectData: value,
      visible: true
    });
  },
  showModalForNew() {
    this.setState({
      selectData: {
        type: '新增'
      },
      visible: true
    });
  },
  handleCancel() {
    this.setState({ visible: false });
  },
  deleteCostItem(value) {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("获取项目失败，请切换项目！");

    confirm({
      title: 'dES提示',
      content: '您确定需要删除【'+value.type+'】的预算吗？',
      onOk() {
        deleteLabourImplements(projectId, value.recordId).then(() => {
          message.success("删除【"+value.type+"】预算成功！");
          _self.showProjectInfo();
        })
      },
      onCancel() {},
    });
  },
  handleSubmit() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("获取项目失败，请切换项目！");

    _self.props.form.validateFieldsAndScroll((errors, formDatas) => {
      if (errors) return console.log('Errors in form!!!');

      let tempContractStr = '';
      let tempQualityStr = '';

      let inputHasValueCounts = 0;

      _.map(formDatas, (item, key) => {

        switch(key.substr(0, 2)) {
          case '合同':
            if(item) ++inputHasValueCounts;
            tempContractStr += ',' + item || 'noValue';
          break;
          case '质保':
            if(item) ++inputHasValueCounts;
            tempQualityStr += ',' + item || 'noValue';
          break;
        }

      })

      //至少保证有一项费用
      if(inputHasValueCounts == 0) return message.warning("请输入合理的费用（至少存在一项）！");

      //去掉字符串首字符（逗号）
      let datas;
      if(formDatas.type) {
        //新增
        datas = {
          name: formDatas.type,
          contractArr: tempContractStr.substr(1, tempContractStr.length-1),
          qualityArr: tempQualityStr.substr(1, tempQualityStr.length-1)
        };
      }else {
        //修改
        datas = {
          name: _self.state.selectData.type,
          contractArr: tempContractStr.substr(1, tempContractStr.length-1),
          qualityArr: tempQualityStr.substr(1, tempQualityStr.length-1)
        };
      }

      //费用类型去重提示
      let hasName = false;
      _.map(_self.state.budgetSummaryDatas, (item) => {
        if(datas.name == item.type) hasName = true;
      })

      if(hasName) return message.warning("费用类型名重复，请输入其它名称！");

      _self.setState({ loading: true });

      createLabourImplements(projectId, JSON.stringify(datas)).then(() => {
        message.success("预算信息添加成功！");
        _self.setState({ visible: false, loading: false });
        _self.props.form.resetFields();
        _self.showProjectInfo();
      })

    });
  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    const { getFieldProps } = props.form;

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };

    return (
      <div>

        <Table
          dataSource={state.dataSource}
          columns={state.columns}
          loading={state.loading}
          pagination={false}
          bordered
        />
        <div style={{margin:'15px 0'}}>
          <div style={{float:'left'}}><Button onClick={this.showModalForNew} type="primary" size="small"><Icon type="plus-circle-o" />新增预算</Button></div>
          <div style={{float:'right'}}>当前共有记录 <span className="text-danger">{state.dataSource.length ? state.dataSource.length - 1: 0}</span> 条</div>
        </div>


        <Modal
          title={state.selectData.type+"预算"}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer=""
        >
          <Form horizontal form={props.form}>
            {
              state.selectData.type == '新增' ?
                <FormItem
                  key="费用类型"
                  {...formItemLayout}
                  label="费用类型"
                >
                  <Input {...getFieldProps('type', {rules:[{required:true, message:'费用类型'}]})} placeholder="请输入费用类型" />
                </FormItem>
              :
                null
            }

            {
              _.map(state.projectDatas.htqdnArray, (item, key) => {
                let field = "合同"+item.toString();
                return (
                  <FormItem
                    key={field}
                    {...formItemLayout}
                    label={field+'年'}
                  >
                    <Input {...getFieldProps(field, {initialValue: '',rules:[{pattern: /^(([1-9][0-9]{0,20})|([0-9]+\.[0-9]{1,2}))$/,type:'string',message:'合同金额(元)，注意格式'}]})} placeholder={field+'年'} />
                  </FormItem>
                )
              })
            }

            {
              state.projectDatas.zbqArray.map((item) => {
                let field = "质保"+item.toString();
                return (
                  <FormItem
                    key={field}
                    {...formItemLayout}
                    label={field+'年'}
                  >
                    <Input {...getFieldProps(field, {initialValue: '',rules:[{pattern: /^(([1-9][0-9]{0,20})|([0-9]+\.[0-9]{1,2}))$/,type:'string',message:'保函金额(元)，注意格式'}]})} placeholder={field+'年'} />
                  </FormItem>
                )
              })
            }

            <center>
              <Popconfirm title="确定立即提交信息吗？" onConfirm={this.handleSubmit}>
                <Button type="primary">确认并提交</Button>
              </Popconfirm>
            </center>
          </Form>
        </Modal>

      </div>
    );
  }
});

ImplementArtificialCost = Form.create()(ImplementArtificialCost);

export default ImplementArtificialCost;