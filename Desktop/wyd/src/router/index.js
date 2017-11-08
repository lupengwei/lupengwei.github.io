import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router)

/* layout */
import Layout from '../views/layout/Layout'

/**
* icon : the icon show in the sidebar
* hidden : if `hidden:true` will not show in the sidebar
* redirect : if `redirect:noredirect` will no redirct in the levelbar
* noDropdown : if `noDropdown:true` will has no submenu
* meta : { role: ['admin'] }  will control the page role
**/
export const constantRouterMap = [
    { path: '/login', component: _import('login/index'), hidden: true },
    { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
    { path: '/404', component: _import('errorPage/404'), hidden: true },
    { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{ path: 'dashboard', component: _import('dashboard/index') }]
  },
  {
    path: '/introduction',
    component: Layout,
    redirect: '/introduction/index',
    icon: 'people',
    noDropdown: true,
    children: [{ path: 'index', component: _import('introduction/index'), name: '通号维修管理平台' }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    name: '权限测试',
    icon: 'lock',
    meta: { role: ['admin'] },
    children: [{ path: 'index', component: _import('permission/index'), name: '权限测试页', meta: { role: ['admin'] }}]
  },
  {
    path: '/example',
    component: Layout,
    redirect: 'noredirect',
    name: '工作台',
    icon: 'example',
    children: [
      { path: 'table', icon: 'tab', component: _import('example/table/table'), name: '所有的', meta: { isEdit: true }},
      { path: 'form/create', icon: 'form', component: _import('example/form'), name: '我创建的' },
      { path: 'tab/index', icon: 'tab', component: _import('example/tab/index'), name: '我的待办' }
    ]
  },
  {
    path: '/components',
    component: Layout,
    redirect: '/components/index',
    name: '维修计划管理',
    icon: 'component',
    children: [
      { path: 'dropzone', component: _import('components/dropzone'), name: ' 信息录入' },
      { path: 'sticky', component: _import('components/sticky'), name: '维修计划编制 ' },
      { path: 'countto', component: _import('components/countTo'), name: '变更记录' },
      { path: 'mixin', component: _import('components/mixin'), name: '执行监控 ' },
      { path: 'backtotop', component: _import('components/backToTop'), name: '返回顶部' }
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'error',
    icon: 'chart',
    children: [
      { path: '401', component: _import('errorPage/401'), name: '' },
      { path: '404', component: _import('errorPage/404'), name: '' }
    ]
  },
  {
    path: '/errlog',
    component: Layout,
    redirect: 'noredirect',
    name: '自动派班表',
    icon: 'bug',
    noDropdown: true,
    children: [{ path: 'log', component: _import('errlog/index'), name: '自动派班表' }]
  },
  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/download',
    name: '设备数据库',
    icon: 'excel',
    children: [
      { path: 'download', component: _import('excel/index'), name: '设备数据查询' },
      { path: 'selectExcel', component: _import('excel/selectExcel'), name: '导出打印' },
      { path: 'uploadExcel', component: _import('excel/uploadExcel'), name: '设备数据导入' }
    ]
  },
  {
    path: '/charts',
    component: Layout,
    redirect: '/charts/index',
    name: '报表',
    icon: 'chart',
    children: [
      { path: 'index', component: _import('charts/index'), name: '项目报表' },
      { path: 'keyboard', component: _import('charts/keyboard'), name: '分析图表' },
      { path: 'keyboard2', component: _import('charts/keyboard2'), name: '键盘图表2' },
      { path: 'line', component: _import('charts/line'), name: '计划完成情况折线图' },
      { path: 'mixchart', component: _import('charts/mixChart'), name: '混合图表' }
    ]
  },
  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    name: '电子签章',
    icon: 'zip',
    children: [
      { path: 'download', component: _import('zip/index'), name: 'export zip' }
    ]
  },
  {
    path: '/components',
    component: Layout,
    redirect: '/components/index',
    name: '信息中心',
    icon: 'component',
    children: [
      {
        path: 'tinymce',
        component: _import('components/tinymce'),
        name: '信息通知',
        icon: 'component',
        children: [
          { path: 'index', component: _import('clipboard/index'), name: '创建' },
          { path: 'splitpane', component: _import('components/splitpane'), name: ' 接受' },
          { path: 'avatarupload', component: _import('components/avatarUpload'), name: ' 草稿箱' }
        ]
      },
      { path: 'markdown', component: _import('components/markdown'), name: '技术通报' },
      { path: 'jsoneditor', component: _import('components/jsonEditor'), name: ' 我的反馈' }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: 'noredirect',
    name: '综合实例',
    icon: 'example',
    children: [
      {
        path: '/example/table',
        component: _import('example/table/index'),
        redirect: '/example/table/table',
        name: 'Table',
        icon: 'table',
        children: [
          { path: 'dynamictable', component: _import('example/table/dynamictable/index'), name: '动态table' },
          { path: 'dragtable', component: _import('example/table/dragTable'), name: '拖拽table' },
          { path: 'inline_edit_table', component: _import('example/table/inlineEditTable'), name: 'table内编辑' },
          { path: 'table', component: _import('example/table/table'), name: '综合table' }
        ]
      },
      { path: 'form/edit', icon: 'form', component: _import('example/form'), name: '编辑Form', meta: { isEdit: true }},
      { path: 'form/create', icon: 'form', component: _import('example/form'), name: '创建Form' },
      { path: 'tab/index', icon: 'tab', component: _import('example/tab/index'), name: 'Tab' }
    ]
  },
  {
    path: '/theme',
    component: Layout,
    redirect: 'noredirect',
    name: '皮肤管理',
    icon: 'theme',
    noDropdown: true,
    children: [{ path: 'index', component: _import('theme/index'), name: '皮肤' }]
  },
  { path: '*', redirect: '/404', hidden: true }
]
