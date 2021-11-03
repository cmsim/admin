export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user', routes: [{ name: '登录', path: '/user/login', component: './user/Login' }] },
      { component: './404' },
    ],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/subject',
    name: '剧集',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/subject', redirect: '/subject/list' },
      {
        path: '/subject/list',
        name: '列表',
        icon: 'smile',
        component: './Subject',
        parentKeys: ['/subject/list'],
      },
      {
        hideInMenu: true,
        path: '/subject/add',
        name: '添加',
        component: './Subject/edit',
        parentKeys: ['/subject/list'],
      },
      {
        hideInMenu: true,
        path: '/subject/edit/:id',
        name: '编辑',
        component: './Subject/edit',
        parentKeys: ['/subject/list'],
      },
      { component: './404' },
    ],
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      { path: '/admin/sub-page', name: '二级管理页', icon: 'smile', component: './Welcome' },
      { component: './404' },
    ],
  },
  { name: '查询表格', icon: 'table', path: '/list', component: './TableList' },
  { path: '/', redirect: '/welcome' },
  { component: './404' },
];
