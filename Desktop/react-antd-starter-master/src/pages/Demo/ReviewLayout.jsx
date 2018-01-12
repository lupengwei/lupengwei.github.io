import React from 'react';
import { Select, Button, Form, Icon, Row, Col } from 'antd';

import styles from './Common.less'

let ReviewLayout = React.createClass({
  render() {
    return (
      <div style={{border:'1px solid #2D2D2D',borderBottom:0,textAlign:'center'}}>
        <center style={{padding:15}}>
          <h2>文件评审意见反馈单</h2>
        </center>
        <Row style={{borderTop:'1px solid #2D2D2D'}}>
          <Col span={3} className={styles["desp-border-rightbottom"]}>评审文件</Col>
          <Col span={9} className={styles["desp-border-rightbottom"]}>/</Col>
          <Col span={3} className={styles["desp-border-rightbottom"]}>所属项目</Col>
          <Col span={9} className={styles["desp-border-bottom"]}>/</Col>
        </Row>
        <Row>
          <Col span={3} className={styles["desp-border-rightbottom"]}>文件版本</Col>
          <Col span={9} className={styles["desp-border-rightbottom"]}>/</Col>
          <Col span={3} className={styles["desp-border-rightbottom"]}>变更号</Col>
          <Col span={9} className={styles["desp-border-bottom"]}>/</Col>
        </Row>
        <Row>
          <Col span={3} className={styles["desp-border-rightbottom"]}>组织部门</Col>
          <Col span={9} className={styles["desp-border-rightbottom"]}>/</Col>
          <Col span={3} className={styles["desp-border-rightbottom"]}>组织人</Col>
          <Col span={9} className={styles["desp-border-bottom"]}>/</Col>
        </Row>
        <Row>
          <Col span={3} className={styles["desp-border-rightbottom"]}>要求反馈日期</Col>
          <Col span={3} className={styles["desp-border-rightbottom"]}>/</Col>
          <Col span={3} className={styles["desp-border-rightbottom"]}>参评/部门人员</Col>
          <Col span={15} className={styles["desp-border-bottom"]}>/</Col>
        </Row>

        <Row style={{background:'#D9D9D9'}}>
          <Col span={1} className={styles["desp-border-rightbottom"]}>编号</Col>
          <Col span={2} className={styles["desp-border-rightbottom"]}>章节</Col>
          <Col span={3} className={styles["desp-border-rightbottom"]}>意见及建议</Col>
          <Col span={2} className={styles["desp-border-rightbottom"]}>意见提出者</Col>
          <Col span={6} className={styles["desp-border-rightbottom"]}>反馈</Col>
          <Col span={6} className={styles["desp-border-rightbottom"]}>附加说明</Col>
          <Col span={2} className={styles["desp-border-rightbottom"]}>意见反馈者</Col>
          <Col span={2} className={styles["desp-border-bottom"]}>状态</Col>
        </Row>
        <Row>
          <Col span={1} className={styles["desp-border-rightbottom"]}>/</Col>
          <Col span={2} className={styles["desp-border-rightbottom"]}>/</Col>
          <Col span={3} className={styles["desp-border-rightbottom"]}>/</Col>
          <Col span={2} className={styles["desp-border-rightbottom"]}>/</Col>
          <Col span={6} className={styles["desp-border-rightbottom"]}>/</Col>
          <Col span={6} className={styles["desp-border-rightbottom"]}>/</Col>
          <Col span={2} className={styles["desp-border-rightbottom"]}>/</Col>
          <Col span={2} className={styles["desp-border-bottom"]}>/</Col>
        </Row>

      </div>
    )
  }
});

export default ReviewLayout;