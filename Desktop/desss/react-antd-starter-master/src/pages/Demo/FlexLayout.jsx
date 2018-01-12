import React from 'react';
import { Select, Button, Form, Icon } from 'antd';

let FlexLayout = React.createClass({
	render() {
		return (
			<div style={{display:'inline-flex',height:'100%'}}>
				<div style={{display:'flex',height:'100%',background:'#FF726A'}}>
					和技术的变化
				</div>
				<div style={{display:'flex',height:'100%',background:'#6EFF82'}}>
					和技术的变化
				</div>
			</div>
		)
	}
});

export default FlexLayout;