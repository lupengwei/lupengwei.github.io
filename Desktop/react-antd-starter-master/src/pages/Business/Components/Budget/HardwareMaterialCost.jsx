/**
 * 硬件材料费
 */
import React from 'react';
import { Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import _ from 'lodash';
import moment from 'moment';
import Cookies from 'js-cookie';

import { Upload, Modal, Table, Form, Input, Icon, Spin, Popconfirm, Button, message, Tooltip } from 'antd';
import styles from '../Common.less';

import {
  showProject,
  getBudgetSummaryTables,
} from '../../../../services/api';

//ant
const FormItem = Form.Item;
const confirm  = Modal.confirm;

//main
let HardwareMaterialCost = React.createClass({
  getInitialState() {
    return {
      loading: true,
      hardwareCostTableDatas: {},
      dataSource: [],
      columns: [],
      projectDatas: {
        effectiveYearArray: []
      }
    };
  },
  componentDidMount() {
    this.showProjectInfo();
    this.showBudgetSummaryTables();
  },
  showProjectInfo() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("请选择归属项目或部门！");

    showProject(projectId).then((res) => {
      let datas = res.jsonResult.project;
      let tempEffectiveYearArray = [];
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
        tempEffectiveYearArray = _.uniq(_.concat(tempHtqdnArray, tempZbqArray));
        datas.effectiveYearArray = tempEffectiveYearArray;

      }else {
        message.warning("请在项目静态信息里面完善合同起止时间与质保期！");
      }

      _self.setState({ projectDatas: datas });

      setTimeout(() => {
        _self.showTableHeader();
      }, 300)

    })
  },
  showTableHeader() {
    let _self = this;

    let tempColumns = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '物料编码',
      dataIndex: 'wlbm',
      key: 'wlbm',
    }, {
      title: '设备名称',
      dataIndex: 'sbmc',
      key: 'sbmc',
    }, {
      title: '型号规格',
      dataIndex: 'xhgg',
      key: 'xhgg',
    }, {
      title: '单位',
      dataIndex: 'dw',
      key: 'dw',
    }, {
      title: '合同数量',
      dataIndex: 'htsl',
      key: 'htsl',
    }, {
      title: '合同单价',
      dataIndex: 'htdj',
      key: 'htdj',
      className: styles.textAlignRight,
      render: (text, record) => {
        if(record.total) return false;
        return text ? '￥'+desp_toThousands(text) : '/';
      }
    }, {
      title: '合同总价',
      dataIndex: 'htzj',
      key: 'htzj',
      className: styles.textAlignRight,
      render: (text) => {
        return text ? '￥'+desp_toThousands(text) : '/';
      }
    }, {
      title: '单位成本',
      dataIndex: 'dwcb',
      key: 'dwcb',
      className: styles.textAlignRight,
      render: (text, record) => {
        if(record.total) return false;
        return text ? '￥'+desp_toThousands(text) : '/';
      }
    }, {
      title: '总成本',
      dataIndex: 'zcb',
      key: 'zcb',
      className: styles.textAlignRight,
      render: (text) => {
        return text ? '￥'+desp_toThousands(text) : '/';
      }
    }, {
      title: '单位售价',
      dataIndex: 'dwsj',
      key: 'dwsj',
      className: styles.textAlignRight,
      render: (text, record) => {
        if(record.total) return false;
        return text ? '￥'+desp_toThousands(text) : '/';
      }
    }, {
      title: '总售价',
      dataIndex: 'zsj',
      key: 'zsj',
      className: styles.textAlignRight,
      render: (text) => {
        return text ? '￥'+desp_toThousands(text) : '/';
      }
    }, {
      title: '毛利',
      dataIndex: 'ml',
      key: 'ml',
      className: styles.textAlignRight,
      render: (text) => {
        return text ? '￥'+desp_toThousands(text) : '/';
      }
    }];

    //年度交货数量 && 年度成本、售价、毛利
    let temp_ndjhsl_array = [];
    let temp_ndcb_array = [];

    _.map(_self.state.projectDatas.effectiveYearArray, (item, key) => {

      //年度交货数量
      let tempNumberJson = {
        title: item.toString() +'年交货数量',
        dataIndex: item.toString() +'年交货数量',
        key: item.toString() +'年交货数量',
        render: (text) => {
          return text ? text : '/';
        }
      };
      temp_ndjhsl_array.push(tempNumberJson);

      //年度成本
      let tempCostJson_01 = {
        title: item.toString() +'年总成本',
        dataIndex: item.toString() +'年总成本',
        key: item.toString() +'年总成本',
        className: styles.textAlignRight,
        render: (text) => {
          return text ? '￥'+desp_toThousands(text) : '/';
        }
      };
      let tempCostJson_02 = {
        title: item.toString() +'年总售价',
        dataIndex: item.toString() +'年总售价',
        key: item.toString() +'年总售价',
        className: styles.textAlignRight,
        render: (text) => {
          return text ? '￥'+desp_toThousands(text) : '/';
        }
      };
      let tempCostJson_03 = {
        title: item.toString() +'年毛利',
        dataIndex: item.toString() +'年毛利',
        key: item.toString() +'年毛利',
        className: styles.textAlignRight,
        render: (text) => {
          return text ? '￥'+desp_toThousands(text) : '/';
        }
      };
      temp_ndcb_array.push(tempCostJson_01);
      temp_ndcb_array.push(tempCostJson_02);
      temp_ndcb_array.push(tempCostJson_03);

    })

    //插入数组中，年度交货数量
    tempColumns = _.concat(tempColumns, temp_ndjhsl_array);

    let tempColumn_01 = {
      title: '交货总数量',
      dataIndex: 'jhzsl',
      key: 'jhzsl',
    };
    tempColumns.push(tempColumn_01);

    let tempColumn_02 = {
      title: '数量差',
      dataIndex: 'slc',
      key: 'slc',
    };
    tempColumns.push(tempColumn_02);

    //插入数组中，年度成本、售价、毛利
    tempColumns = _.concat(tempColumns, temp_ndcb_array);

    let tempColumn_03 = {
      title: '实现总成本',
      dataIndex: 'sxzcb',
      key: 'sxzcb',
      className: styles.textAlignRight,
      render: (text) => {
        return text ? '￥'+desp_toThousands(text) : '/';
      }
    };
    tempColumns.push(tempColumn_03);

    let tempColumn_04 = {
      title: '实现总售价',
      dataIndex: 'sxzsj',
      key: 'sxzsj',
      className: styles.textAlignRight,
      render: (text) => {
        return text ? '￥'+desp_toThousands(text) : '/';
      }
    };
    tempColumns.push(tempColumn_04);

    let tempColumn_05 = {
      title: '实现毛利',
      dataIndex: 'sxml',
      key: 'sxml',
      className: styles.textAlignRight,
      render: (text) => {
        return text ? '￥'+desp_toThousands(text) : '/';
      }
    };
    tempColumns.push(tempColumn_05);

    let tempColumn_06 = {
      title: '制造企业',
      dataIndex: 'zzqy',
      key: 'zzqy',
    };
    tempColumns.push(tempColumn_06);

    let tempColumn_07 = {
      title: '供应商',
      dataIndex: 'gys',
      key: 'gys',
    };
    tempColumns.push(tempColumn_07);

    let tempColumn_08 = {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
    };
    tempColumns.push(tempColumn_08);

    _self.setState({
      columns: tempColumns
    });

  },
  showBudgetSummaryTables() {
    let _self = this;
    let projectId = Cookies.get('presentBelongProjectId');
    if(!projectId) return message.warning("请选择归属项目或部门！");

    let tempTotalJson = {
      wlbm: '合计',
      htzj: 0,
      zcb: 0,
      zsj: 0,
      ml: 0,
      slc: 0,
      jhzsl: 0,
      sxzcb: 0,
      sxzsj: 0,
      sxml: 0,
      total: true
    };

    //完善合计字段
    _.map(_self.state.projectDatas.effectiveYearArray, (item) => {

      let tempField_01 = item.toString() +'年交货数量';
      tempTotalJson[tempField_01] = 0;

      let tempField_02 = item.toString() +'年总成本';
      tempTotalJson[tempField_02] = 0;

      let tempField_03 = item.toString() +'年总售价';
      tempTotalJson[tempField_03] = 0;

      let tempField_04 = item.toString() +'年毛利';
      tempTotalJson[tempField_04] = 0;

    })

    //获取已知数据
    getBudgetSummaryTables(projectId).then((res) => {
      let datas = res.jsonResult.budgetTable;

      let tempDataSource = [];

      _.map(datas.HardwareCostTable.HardwareCostItems, (item1, key) => {

        item1.id = key+1;

        item1.htzj ? tempTotalJson.htzj += item1.htzj : null;
        item1.zcb ? tempTotalJson.zcb += item1.zcb : null;
        item1.zsj ? tempTotalJson.zsj += item1.zsj : null;
        item1.ml ? tempTotalJson.ml += item1.ml : null;
        item1.slc ? tempTotalJson.slc += item1.slc : null;
        item1.jhzsl ? tempTotalJson.jhzsl += item1.jhzsl : null;
        item1.sxzcb ? tempTotalJson.sxzcb += item1.sxzcb : null;
        item1.sxzsj ? tempTotalJson.sxzsj += item1.sxzsj : null;
        item1.sxml ? tempTotalJson.sxml += item1.sxml : null;

        //梳理年度交货数量
        if(item1.jhslArr) {
          let temp_jhsl_array = item1.jhslArr.split(',');
          let temp_year_array = _self.state.projectDatas.effectiveYearArray;
          _.map(temp_jhsl_array, (item2, key2) => {

            let tempField = temp_year_array[key2].toString()+'年交货数量';
            item1[tempField] = item2;

            let tempSumNumbers = tempTotalJson[tempField] || 0;
            item2 ? tempSumNumbers += parseFloat(item2): null;
            tempTotalJson[tempField] = tempSumNumbers;

          })
        }

        //梳理年度总成本
        if(item1.zcbArr) {
          let temp_jhsl_array = item1.zcbArr.split(',');
          let temp_year_array = _self.state.projectDatas.effectiveYearArray;
          _.map(temp_jhsl_array, (item2, key2) => {

            let tempField = temp_year_array[key2].toString()+'年总成本';
            item1[tempField] = item2;

            let tempSumNumbers = tempTotalJson[tempField] || 0;
            item2 ? tempSumNumbers += parseFloat(item2): null;
            tempTotalJson[tempField] = tempSumNumbers;

          })
        }

        //梳理年度总售价
        if(item1.zsjArr) {
          let temp_jhsl_array = item1.zsjArr.split(',');
          let temp_year_array = _self.state.projectDatas.effectiveYearArray;
          _.map(temp_jhsl_array, (item2, key2) => {

            let tempField = temp_year_array[key2].toString()+'年总售价';
            item1[tempField] = item2;

            let tempSumNumbers = tempTotalJson[tempField] || 0;
            item2 ? tempSumNumbers += parseFloat(item2): null;
            tempTotalJson[tempField] = tempSumNumbers;

          })
        }

        //梳理年度总毛利
        if(item1.mlArr) {
          let temp_jhsl_array = item1.mlArr.split(',');
          let temp_year_array = _self.state.projectDatas.effectiveYearArray;
          _.map(temp_jhsl_array, (item2, key2) => {

            let tempField = temp_year_array[key2].toString()+'年毛利';
            item1[tempField] = item2;

            let tempSumNumbers = tempTotalJson[tempField] || 0;
            item2 ? tempSumNumbers += parseFloat(item2): null;
            tempTotalJson[tempField] = tempSumNumbers;

          })
        }

        tempDataSource.push(item1)
      })

      tempDataSource.push(tempTotalJson);

      _self.setState({
        hardwareCostTableDatas: datas.HardwareCostTable,
        dataSource: tempDataSource,
        loading: false
      });

    })
  },
  handleLoading(value) {
    this.setState({ loading: value });
  },
  handleRecordDocs(value) {
    let _self = this;

    //重新获取数据
    _self.showBudgetSummaryTables();

    let modal = Modal.success({
      title: 'dES提示',
      content: value.name + '上传成功！',
    });

  },
  render() {
    let state = this.state,
        props = this.props,
        _self = this;

    let projectId = Cookies.get('presentBelongProjectId');

    let presentOrigin = window.location.origin;
    switch(presentOrigin) {
      case 'http://127.0.0.1:8989':
        presentOrigin = 'http://127.0.0.1:8778';
      break;
      case 'http://staging.desp.cq-tct.com':
        presentOrigin = 'http://api.staging.desp.cq-tct.com';
      break;
      case 'http://desp.cq-tct.com':
        presentOrigin = 'http://desp.cq-tct.com';
      break;
    }

    //上传参数
    let params = {
      action: presentOrigin +'/api/projects/'+ projectId +'/hardwareCostItems/upload',
      multiple: false,
      showUploadList: false,
      method: 'POST',
      headers: {
        'authorization': Cookies.get('authorization')
      },
      onChange(info) {
        switch(info.file.status) {
          case 'error':
            message.error('【'+ info.file.name +'】上传文件失败！');
          break;
          case 'done':
            _self.handleRecordDocs(info.file);
          break;
        }
      },
      beforeUpload(info) {
        if(info.size > 1024*1024*10){
          return message.error(' 上传失败，文件大于10M');
        }
        message.loading('文件上传中...');
        _self.handleLoading(true);
      },
      data (info){
        // console.log('data', info)
      }
    };

    return (
      <div>

        <div style={{ marginBottom:15 }}>
          <Upload
            { ...params }
          >
            <Button type="primary"><Icon type="cloud-upload-o" /> 上传硬件成本</Button>
          </Upload>
        </div>

        <Table
          dataSource={state.dataSource}
          columns={state.columns}
          pagination={false}
          loading={state.loading}
          bordered
          scroll={{ x: state.columns.length*100 }}
        />
        <div style={{margin:'15px 0'}}>当前共有记录 <span className="text-danger">{state.dataSource.length == 0 ? 0 : state.dataSource.length - 1}</span> 条</div>

      </div>
    );
  }
});

export default HardwareMaterialCost;