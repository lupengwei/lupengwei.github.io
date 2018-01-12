import React from 'react';
import { Menu, Icon, message, Table } from 'antd';

//ant

//main
const TableToExcel = React.createClass({
	componentDidMount() {
		this.exportToExcel();
	},
	exportToExcel() {
/**
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css">
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/1.2.4/css/buttons.dataTables.min.css">

<script type="text/javascript" src="http://code.jquery.com/jquery-1.12.4.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/1.2.4/js/dataTables.buttons.min.js"></script>
<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js"></script>
<script type="text/javascript" src="http://cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/pdfmake.min.js"></script>
<script type="text/javascript" src="http://cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/vfs_fonts.js"></script>
<script type="text/javascript" src="http://cdn.datatables.net/buttons/1.2.4/js/buttons.html5.min.js"></script>
*/
	  $(document).ready(function() {
	    $('#example table').DataTable( {
	      dom: 'Bfrtip',
	      searching: false,
	      select: true,
	      // ordering: false,
	      // paging: false,
	      buttons: [
	        'excelHtml5',
	        'pdfHtml5'
	      ]
	    });
	  });
	},
	render() {

		const dataSource = [{
		  key: '1',
		  name: '胡彦斌',
		  age: 32,
		  address: '西湖区湖底公园1号'
		}, {
		  key: '2',
		  name: '胡彦祖',
		  age: 42,
		  address: '西湖区湖底公园1号'
		}];

		const columns = [{
		  title: '姓名',
		  dataIndex: 'name',
		  key: 'name',
		}, {
		  title: '年龄',
		  dataIndex: 'age',
		  key: 'age',
		}, {
		  title: '住址',
		  dataIndex: 'address',
		  key: 'address',
		}];

		return (
			<div id="example">
				<Table
					dataSource={dataSource}
					columns={columns}
					pagination={false}
				/>
			</div>
		)
	}
});

export default TableToExcel;