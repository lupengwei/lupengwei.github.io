webpackJsonp([13],{"5aCZ":function(t,e,i){"use strict";function n(t){i("og3+")}var o=i("GICJ"),a=i("aSYq"),s=i("J0+h"),c=n,r=s(o.a,a.a,c,"data-v-5fe58b77",null);e.a=r.exports},"5szV":function(t,e,i){"use strict";function n(t){i("CYLf")}var o=i("uJTZ"),a=i("Zx22"),s=i("J0+h"),c=n,r=s(o.a,a.a,c,"data-v-0fb60520",null);e.a=r.exports},"6wBA":function(t,e,i){e=t.exports=i("YfG4")(!1),e.push([t.i,".tinymce-container[data-v-5fe58b77]{position:relative}.tinymce-textarea[data-v-5fe58b77]{visibility:hidden;z-index:-1}.editor-custom-btn-container[data-v-5fe58b77]{position:absolute;right:15px;top:18px}.editor-upload-btn[data-v-5fe58b77]{display:inline-block}",""])},CYLf:function(t,e,i){var n=i("nTcT");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);i("XkoO")("3efa3daa",n,!0)},E2Av:function(t,e,i){var n=i("pX4G");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);i("XkoO")("22217e8a",n,!0)},GICJ:function(t,e,i){"use strict";var n=i("5szV");e.a={name:"tinymce",components:{editorImage:n.a},props:{id:{type:String},value:{type:String,default:""},toolbar:{type:Array,required:!1,default:function(){return["removeformat undo redo |  bullist numlist | outdent indent | forecolor | fullscreen code","bold italic blockquote | h2 p  media link | alignleft aligncenter alignright"]}},menubar:{default:""},height:{type:Number,required:!1,default:360}},data:function(){return{hasChange:!1,hasInit:!1,tinymceId:this.id||"vue-tinymce-"+ +new Date}},watch:{value:function(t){var e=this;!this.hasChange&&this.hasInit&&this.$nextTick(function(){return window.tinymce.get(e.tinymceId).setContent(t)})}},mounted:function(){var t=this,e=this;window.tinymce.init({selector:"#"+this.tinymceId,height:this.height,body_class:"panel-body ",object_resizing:!1,toolbar:this.toolbar,menubar:this.menubar,plugins:"advlist,autolink,code,paste,textcolor, colorpicker,fullscreen,link,lists,media,wordcount, imagetools",end_container_on_empty_block:!0,powerpaste_word_import:"clean",code_dialog_height:450,code_dialog_width:1e3,advlist_bullet_styles:"square",advlist_number_styles:"default",block_formats:"普通标签=p;小标题=h2;",imagetools_cors_hosts:["wpimg.wallstcn.com","wallstreetcn.com"],imagetools_toolbar:"watermark",default_link_target:"_blank",link_title:!1,init_instance_callback:function(i){e.value&&i.setContent(e.value),e.hasInit=!0,i.on("NodeChange Change KeyUp",function(){t.hasChange=!0,t.$emit("input",i.getContent({format:"raw"}))})},setup:function(t){t.addButton("h2",{title:"小标题",text:"小标题",onclick:function(){t.execCommand("mceToggleFormat",!1,"h2")},onPostRender:function(){var e=this;t.on("init",function(){t.formatter.formatChanged("h2",function(t){e.active(t)})})}}),t.addButton("p",{title:"正文",text:"正文",onclick:function(){t.execCommand("mceToggleFormat",!1,"p")},onPostRender:function(){var e=this;t.on("init",function(){t.formatter.formatChanged("p",function(t){e.active(t)})})}})}})},methods:{setContent:function(t){window.tinymce.get(this.tinymceId).setContent(t)},getContent:function(){window.tinymce.get(this.tinymceId).getContent()},imageSuccessCBK:function(t){var e=this;t.forEach(function(t){window.tinymce.get(e.tinymceId).insertContent('<img class="wscnph" src="'+t.url+'" >')})}},destroyed:function(){window.tinymce.get(this.tinymceId).destroy()}}},Zx22:function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"upload-container"},[i("el-button",{style:{background:t.color,borderColor:t.color},attrs:{icon:"upload",type:"primary"},on:{click:function(e){t.dialogVisible=!0}}},[t._v("上传图片\n    ")]),t._v(" "),i("el-dialog",{model:{value:t.dialogVisible,callback:function(e){t.dialogVisible=e},expression:"dialogVisible"}},[i("el-upload",{staticClass:"editor-slide-upload",attrs:{action:"https://httpbin.org/post",multiple:!0,"file-list":t.fileList,"show-file-list":!0,"list-type":"picture-card","on-remove":t.handleRemove,"on-success":t.handleSuccess,"before-upload":t.beforeUpload}},[i("el-button",{attrs:{size:"small",type:"primary"}},[t._v("点击上传")])],1),t._v(" "),i("el-button",{on:{click:function(e){t.dialogVisible=!1}}},[t._v("取 消")]),t._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:t.handleSubmit}},[t._v("确 定")])],1)],1)},o=[],a={render:n,staticRenderFns:o};e.a=a},aSYq:function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"tinymce-container editor-container"},[i("textarea",{staticClass:"tinymce-textarea",attrs:{id:t.tinymceId}}),t._v(" "),i("div",{staticClass:"editor-custom-btn-container"},[i("editorImage",{staticClass:"editor-upload-btn",attrs:{color:"#20a0ff"},on:{successCBK:t.imageSuccessCBK}})],1)])},o=[],a={render:n,staticRenderFns:o};e.a=a},kn21:function(t,e,i){"use strict";function n(t){i("E2Av")}Object.defineProperty(e,"__esModule",{value:!0});var o=i("zz5O"),a=i("teb0"),s=i("J0+h"),c=n,r=s(o.a,a.a,c,"data-v-5c94a361",null);e.default=r.exports},nTcT:function(t,e,i){e=t.exports=i("YfG4")(!1),e.push([t.i,".upload-container .editor-slide-upload[data-v-0fb60520]{margin-bottom:20px}",""])},"og3+":function(t,e,i){var n=i("6wBA");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);i("XkoO")("77da2423",n,!0)},pX4G:function(t,e,i){e=t.exports=i("YfG4")(!1),e.push([t.i,".editor-content[data-v-5c94a361]{margin-top:20px}",""])},teb0:function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"components-container"},[t._m(0),t._v(" "),i("div",[i("tinymce",{attrs:{height:200},model:{value:t.content,callback:function(e){t.content=e},expression:"content"}})],1),t._v(" "),i("div",{staticClass:"editor-content",domProps:{innerHTML:t._s(t.content)}})])},o=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("code",[t._v("公司做的后台主要是一个cms系统，公司也是以自媒体为核心的，所以富文本是后台很核心的功能。在选择富文本的过程中也走了不少的弯路，市面上常见的富文本都基本用过了，最终选择了Tinymce"),i("a",{attrs:{target:"_blank",href:"https://segmentfault.com/a/1190000009762198#articleHeader13"}},[t._v(" 相关文章 ")]),t._v(" "),i("a",{attrs:{target:"_blank",href:"https://www.tinymce.com/"}},[t._v(" 官网 ")])])}],a={render:n,staticRenderFns:o};e.a=a},uJTZ:function(t,e,i){"use strict";var n=i("rVsN"),o=i.n(n),a=i("ZLEe"),s=i.n(a);e.a={name:"editorSlideUpload",props:{color:{type:String,default:"#20a0ff"}},data:function(){return{dialogVisible:!1,listObj:{},fileList:[]}},methods:{checkAllSuccess:function(){var t=this;return s()(this.listObj).every(function(e){return t.listObj[e].hasSuccess})},handleSubmit:function(){var t=this,e=s()(this.listObj).map(function(e){return t.listObj[e]});if(!this.checkAllSuccess())return void this.$message("请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！");console.log(e),this.$emit("successCBK",e),this.listObj={},this.fileList=[],this.dialogVisible=!1},handleSuccess:function(t,e){for(var i=e.uid,n=s()(this.listObj),o=0,a=n.length;o<a;o++)if(this.listObj[n[o]].uid===i)return this.listObj[n[o]].url=t.files.file,void(this.listObj[n[o]].hasSuccess=!0)},handleRemove:function(t){for(var e=t.uid,i=s()(this.listObj),n=0,o=i.length;n<o;n++)if(this.listObj[i[n]].uid===e)return void delete this.listObj[i[n]]},beforeUpload:function(t){var e=this,i=window.URL||window.webkitURL,n=t.uid;return this.listObj[n]={},new o.a(function(o,a){var s=new Image;s.src=i.createObjectURL(t),s.onload=function(){e.listObj[n]={hasSuccess:!1,uid:t.uid,width:this.width,height:this.height}},o(!0)})}}}},zz5O:function(t,e,i){"use strict";var n=i("5aCZ");e.a={components:{Tinymce:n.a},data:function(){return{content:"Tinymce"}}}}});