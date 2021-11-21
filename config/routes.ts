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
  { path: '/chat', name: 'chat', icon: 'smile', component: './Chat' },
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
    path: '/config',
    name: '配置',
    icon: 'smile',
    access: 'canAdmin',
    routes: [
      { path: '/config', redirect: '/config/list' },
      {
        path: '/config/list',
        name: '配置列表',
        icon: 'smile',
        component: './Config/List',
      },
      {
        path: '/config/mcat',
        name: '小分类',
        icon: 'smile',
        component: './Config/Mcat',
      },
      {
        hideInMenu: true,
        path: '/config/mcat/add',
        name: '添加',
        component: './Config/Mcat/edit',
        parentKeys: ['/config/mcat'],
      },
      {
        hideInMenu: true,
        path: '/config/mcat/edit/:id',
        name: '编辑',
        component: './Config/Mcat/edit',
        parentKeys: ['/config/mcat'],
      },
      {
        path: '/config/typelist',
        name: '栏目列表',
        component: './Config/Typelist',
        parentKeys: ['/config/typelist'],
      },
      {
        hideInMenu: true,
        path: '/config/typelist/add',
        name: '添加栏目',
        component: './Config/Typelist/edit',
        parentKeys: ['/config/typelist'],
      },
      {
        hideInMenu: true,
        path: '/config/typelist/edit/:id',
        name: '编辑栏目',
        component: './Config/Typelist/edit',
        parentKeys: ['/config/typelist'],
      },
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
