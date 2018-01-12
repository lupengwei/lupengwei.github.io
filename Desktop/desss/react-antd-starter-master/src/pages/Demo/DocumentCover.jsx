import React from 'react';

import { Row, Col } from 'antd';

import styles from './Common.less'

//ant初始组件

//main
const DocumentCover = React.createClass({
  render: function() {
    return (
      <div className={styles['desp-cover-container']}>
        <img style={{width:'100%'}} src="http://docs.cq-tct.com/desp/images/doc_cover_top.png" />
        <h1 className={styles['desp-cover-title']}>重庆三号线北延伸段信号系统</h1>
        <h2 className={styles['desp-cover-vice-title']}>系统操作与维护安全须知</h2>
        
        <div className={styles['desp-cover-list-box']}>
          <Row>
            <Col span={8} className={styles['left']}>项目编号</Col>
            <Col span={16} className={styles['right']}>1401-CQ-BAA</Col>
          </Row>
          <Row>
            <Col span={8} className={styles['left']}>文件编号</Col>
            <Col span={16} className={styles['right']}>CQSHX-45106</Col>
          </Row>
          <Row>
            <Col span={8} className={styles['left']}>版本号</Col>
            <Col span={16} className={styles['right']}>V1.4</Col>
          </Row>
        </div>

        <div className={styles["desp-cover-table"]}>
          <div className={styles["desp-cover-table-item"]}>
            <Row className={styles["desp-cover-table-itembox"]}>
              <Col span={3} className={styles["desp-border-rightbottom"]}>审批</Col>
              <Col span={7} className={styles["desp-border-rightbottom"]}>姓名</Col>
              <Col span={7} className={styles["desp-border-rightbottom"]}>签字</Col>
              <Col span={7} className={styles["desp-border-bottom"]}>日期</Col>
            </Row>
            <Row className={styles["desp-cover-table-itembox"]}>
              <Col span={3} className={styles["desp-border-rightbottom"]}>编写</Col>
              <Col span={7} className={styles["desp-border-rightbottom"]}>-</Col>
              <Col span={7} className={styles["desp-border-rightbottom"]}>-</Col>
              <Col span={7} className={styles["desp-border-bottom"]}>-</Col>
            </Row>
            <Row className={styles["desp-cover-table-itembox"]}>
              <Col span={3} className={styles["desp-border-rightbottom"]}>审核</Col>
              <Col span={7} className={styles["desp-border-rightbottom"]}>-</Col>
              <Col span={7} className={styles["desp-border-rightbottom"]}>-</Col>
              <Col span={7} className={styles["desp-border-bottom"]}>-</Col>
            </Row>
            <Row className={styles["desp-cover-table-itembox"]}>
              <Col span={3} className={styles["desp-border-right"]}>批准</Col>
              <Col span={7} className={styles["desp-border-right"]}>-</Col>
              <Col span={7} className={styles["desp-border-right"]}>-</Col>
              <Col span={7}>-</Col>
            </Row>
          </div>
        </div>

        <div style={{width:'100%',marginTop:60,textAlign:'center'}}>
          <img src="http://docs.cq-tct.com/desp/images/doc_cover_footer.png" />
        </div>
      </div>
    );
  }
});

export default DocumentCover;