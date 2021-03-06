export default [
  { path: '/', redirect: '/welcome' },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/content',
    name: '内容',
    icon: 'ReadOutlined',
    access: 'canAdmin',
    routes: [
      { path: '/content', redirect: '/content/subject' },
      {
        path: '/content/subject',
        name: '剧集列表',
        component: './Content/Subject',
        parentKeys: ['/content/subject']
      },
      {
        path: '/content/feed',
        name: 'feed列表',
        component: './Content/Feed',
        parentKeys: ['/content/feed']
      },
      {
        path: '/content/comment',
        name: '评论列表',
        component: './Content/Comment',
        parentKeys: ['/content/comment']
      },
      {
        path: '/content/tag',
        name: '标签列表',
        component: './Content/Tag',
        parentKeys: ['/content/tag']
      },
      {
        hideInMenu: true,
        path: '/content/tag/add',
        name: '添加标签',
        component: './Content/Tag/edit',
        parentKeys: ['/content/tag']
      },
      {
        hideInMenu: true,
        path: '/content/tag/edit/:id',
        name: '编辑标签',
        component: './Content/Tag/edit',
        parentKeys: ['/content/tag']
      },
      {
        path: '/content/attachment',
        name: '附件列表',
        component: './Content/Attachment',
        parentKeys: ['/content/attachment']
      },
      {
        path: '/content/pin',
        name: '动态列表',
        component: './Content/Pin',
        parentKeys: ['/content/pin']
      },
      {
        path: '/content/topic',
        name: '话题列表',
        component: './Content/Topic',
        parentKeys: ['/content/topic']
      },
      {
        path: '/content/link',
        name: '链接列表',
        component: './Content/Link',
        parentKeys: ['/content/link']
      }
    ]
  },
  {
    path: '/config',
    name: '配置',
    icon: 'setting',
    access: 'canAdmin',
    routes: [
      { path: '/config', redirect: '/config/list' },
      {
        path: '/config/list',
        name: '配置列表',
        icon: 'smile',
        component: './Config/List'
      },
      {
        path: '/config/typelist',
        name: '栏目列表',
        component: './Config/Typelist',
        parentKeys: ['/config/typelist']
      },
      {
        path: '/config/mcat',
        name: '小分类',
        icon: 'smile',
        component: './Config/Mcat'
      },
      {
        path: '/config/play',
        name: '播放源',
        component: './Config/Play',
        parentKeys: ['/config/play']
      }
    ]
  },
  {
    path: '/user',
    name: '用户',
    icon: 'user',
    access: 'canAdmin',
    routes: [
      { path: '/user', redirect: '/user/list' },
      {
        path: '/user/list',
        name: '用户管理',
        component: './User/List',
        parentKeys: ['/user/list']
      },
      {
        hideInMenu: true,
        path: '/user/add',
        name: '添加用户',
        component: './404',
        parentKeys: ['/user/list']
      },
      {
        hideInMenu: true,
        path: '/user/edit/:id',
        name: '编辑用户',
        component: './404',
        parentKeys: ['/content/list']
      }
    ]
  },
  { path: '/chat', name: 'chat', icon: 'smile', component: './Chat' },
  { hideInMenu: true, path: '/login', layout: false, name: '登录', component: './User/Login' },
  { path: '*', component: './404' }
]
