import React from 'react';
import { Select, Button, Form, Icon, Row, Col } from 'antd';

import styles from './Common.less'

let RecordLayout = React.createClass({
	render() {
		return (
			<div>
				<center style={{paddingBottom:10,fontSize:24,fontWeight:600}}>文件评审记录单</center>
				<div style={{textAlign:'center',border:'1px solid #5A5A5A',width:780,minHeight:1024,margin:'0 auto'}}>
					<Row>
						<Col span={2} style={{padding:10}} className={styles["desp-border-rightbottom"]}>编号</Col>
						<Col span={10} style={{padding:10}} className={styles["desp-border-rightbottom"]}>TCT-RT-PR-SP004-01</Col>
						<Col span={2} style={{padding:10}} className={styles["desp-border-rightbottom"]}>变更号</Col>
						<Col span={10} style={{padding:10}} className={styles["desp-border-bottom"]}>/</Col>
	        </Row>
	        <Row>
						<Col span={3} style={{padding:10}} className={styles["desp-border-rightbottom"]}>文件编号</Col>
						<Col span={5} style={{padding:10}} className={styles["desp-border-rightbottom"]}>/</Col>
						<Col span={3} style={{padding:10}} className={styles["desp-border-rightbottom"]}>文件名称</Col>
						<Col span={6} style={{padding:10}} className={styles["desp-border-rightbottom"]}>/</Col>
						<Col span={2} style={{padding:10}} className={styles["desp-border-rightbottom"]}>版本号</Col>
						<Col span={5} style={{padding:10}} className={styles["desp-border-bottom"]}>/</Col>
	        </Row>
	        <Row>
						<Col span={3} style={{padding:10}} className={styles["desp-border-rightbottom"]}>评审时间</Col>
						<Col span={5} style={{padding:10}} className={styles["desp-border-rightbottom"]}>2016-10-31</Col>
						<Col span={3} style={{padding:10}} className={styles["desp-border-rightbottom"]}>评审地点</Col>
						<Col span={13} style={{padding:10}} className={styles["desp-border-bottom"]}>重庆子公司小会议室</Col>
	        </Row>
	        <Row>
						<Col span={3} style={{padding:10}} className={styles["desp-border-rightbottom"]}>评审结论</Col>
						<Col span={21} style={{padding:10,textAlign:'left'}} className={styles["desp-border-bottom"]}>
							<Icon type="check-circle" className="text-success"/> 通过；<Icon type="exclamation-circle-o"/> 有条件通过；<Icon type="exclamation-circle-o"/> 不通过。
						</Col>
	        </Row>

	        <Row style={{background:'#D9D9D9'}}>
						<Col span={2} style={{padding:10}} className={styles["desp-border-bottom"]}>序号</Col>
						<Col span={10} style={{padding:10}} className={styles["desp-border-leftrightbottom"]}>问题描述</Col>
						<Col span={6} style={{padding:10}} className={styles["desp-border-rightbottom"]}>建议措施</Col>
						<Col span={3} style={{padding:10}} className={styles["desp-border-rightbottom"]}>负责人</Col>
						<Col span={3} style={{padding:10}} className={styles["desp-border-bottom"]}>完成时间</Col>
	        </Row>
	        <Row>
						<Col span={2} style={{padding:10}} className={styles["desp-border-bottom"]}>1</Col>
						<Col span={10} style={{padding:10}} className={styles["desp-border-leftrightbottom"]}>/</Col>
						<Col span={6} style={{padding:10}} className={styles["desp-border-rightbottom"]}>/</Col>
						<Col span={3} style={{padding:10}} className={styles["desp-border-rightbottom"]}>/</Col>
						<Col span={3} style={{padding:10}} className={styles["desp-border-bottom"]}>/</Col>
	        </Row>
	        <Row>
						<Col span={2} style={{padding:10}} className={styles["desp-border-bottom"]}>1</Col>
						<Col span={10} style={{padding:10}} className={styles["desp-border-leftrightbottom"]}>/</Col>
						<Col span={6} style={{padding:10}} className={styles["desp-border-rightbottom"]}>/</Col>
						<Col span={3} style={{padding:10}} className={styles["desp-border-rightbottom"]}>/</Col>
						<Col span={3} style={{padding:10}} className={styles["desp-border-bottom"]}>/</Col>
	        </Row>
	        <Row>
						<Col span={2} style={{padding:10}} className={styles["desp-border-bottom"]}>1</Col>
						<Col span={10} style={{padding:10}} className={styles["desp-border-leftrightbottom"]}>/</Col>
						<Col span={6} style={{padding:10}} className={styles["desp-border-rightbottom"]}>/</Col>
						<Col span={3} style={{padding:10}} className={styles["desp-border-rightbottom"]}>/</Col>
						<Col span={3} style={{padding:10}} className={styles["desp-border-bottom"]}>/</Col>
	        </Row>

	        <Row style={{background:'#D9D9D9'}}>
						<Col span={2} style={{padding:10}} className={styles["desp-border-bottom"]}>序号</Col>
						<Col span={10} style={{padding:10}} className={styles["desp-border-leftrightbottom"]}>单位</Col>
						<Col span={6} style={{padding:10}} className={styles["desp-border-rightbottom"]}>职务/职称</Col>
						<Col span={3} style={{padding:10}} className={styles["desp-border-rightbottom"]}>姓名</Col>
						<Col span={3} style={{padding:10}} className={styles["desp-border-bottom"]}>签字</Col>
	        </Row>
	        <Row>
						<Col span={2} style={{padding:10}} className={styles["desp-border-bottom"]}>1</Col>
						<Col span={10} style={{padding:10}} className={styles["desp-border-leftrightbottom"]}>重庆交控科技有限公司</Col>
						<Col span={6} style={{padding:10}} className={styles["desp-border-rightbottom"]}>总经理</Col>
						<Col span={3} style={{height:39,lineHeight:3}} className={styles["desp-border-rightbottom"]}>张扬</Col>
						<Col span={3} style={{padding:10}} className={styles["desp-border-bottom"]}>/</Col>
	        </Row>
	        <Row>
						<Col span={2} style={{padding:10}} className={styles["desp-border-bottom"]}>/</Col>
						<Col span={10} style={{padding:10}} className={styles["desp-border-leftrightbottom"]}>/</Col>
						<Col span={6} style={{padding:10}} className={styles["desp-border-rightbottom"]}>/</Col>
						<Col span={3} style={{height:39,lineHeight:3}} className={styles["desp-border-rightbottom"]}>/</Col>
						<Col span={3} style={{padding:10}} className={styles["desp-border-bottom"]}>/</Col>
	        </Row>

				</div>
			</div>
		)
	}
})

export default RecordLayout;