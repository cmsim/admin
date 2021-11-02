export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/subject',
    name: 'subject',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/subject', redirect: '/subject/list' },
      {
        path: '/subject/list',
        name: 'list',
        icon: 'smile',
        component: './Subject',
        parentKeys: ['/subject/list'],
      },
      {
        hideInMenu: true,
        path: '/subject/add',
        name: 'create',
        component: './Subject/edit',
        parentKeys: ['/subject/list'],
      },
      {
        hideInMenu: true,
        path: '/subject/edit/:id',
        name: 'edit',
        component: './Subject/edit',
        parentKeys: ['/subject/list'],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
