import React, {Component, PropTypes} from 'react';
import RichTextEditor from 'react-rte';

class MyStatefulEditor extends Component {
  static propTypes = {
    onChange: PropTypes.func
  };

  state = {
    value: RichTextEditor.createEmptyValue(),
    content: '',
  }

  onChange = (value) => {
  	console.log(value.toString('html'))
    this.setState({value,content: value.toString('html')});
    if (this.props.onChange) {
      this.props.onChange( value.toString('html') );
    }
  };

  render () {
  	const toolbarConfig = {
      display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
      INLINE_STYLE_BUTTONS: [
        {label: '加粗', style: 'BOLD', className: 'custom-css-class'},
        {label: '斜体', style: 'ITALIC'},
        {label: '下划线', style: 'UNDERLINE'}
      ],
      BLOCK_TYPE_DROPDOWN: [
        {label: '正常', style: 'unstyled'},
        {label: '标题1', style: 'header-one'},
        {label: '标题2', style: 'header-two'},
        {label: '标题3', style: 'header-three'},
        {label: '标题4', style: 'header-four'},
        {label: '标题5', style: 'header-five'},
        {label: '标题6', style: 'header-six'},
        {label: '块引用', style: 'blockquote'},
      ],
      BLOCK_TYPE_BUTTONS: [
        {label: '列表', style: 'unordered-list-item'},
        {label: '序号', style: 'ordered-list-item'}
      ]
    };

    let html = "<b>哈哈</b>";
    return (
    	<div>
    		<div dangerouslySetInnerHTML={{__html: this.state.content}}/>
	      <RichTextEditor toolbarConfig={toolbarConfig} value={this.state.value} onChange={this.onChange} />
    	</div>
    );
  }
}

export default MyStatefulEditor;