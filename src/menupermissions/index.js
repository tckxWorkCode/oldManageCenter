import Layout from '../views/layout/Layout'
/**
 * 
 * @param {*} asyncRouterMap 
 * @param {*} data 
 */
let accessedRoutersqx = []

export function filterAsyncRouterqx(qxmenudata) {
  console.info('menubackinfro', qxmenudata)
  accessedRoutersqx.splice(0, accessedRoutersqx.length)
  qxmenudata.forEach(function(value) {
    switch (value.name) {
      case 'HomePage':
        accessedRoutersqx.push({
          path: '/home',
          component: () => import('@/views/home'),
          nav: '0',
          path1: '/home', //顶部导航是否选中
          name: 'home',
          topmenu: true,
          flag: 'self',
          hidden: true,
          meta: { alias: '首页', aliaseng: 'HomePage', aliaseng2: 'HomePage', title1: 'home', roles: ['audit', 'safe', 'system', 'httcadmin']},
          children: [{
            path: '',
            component: () => import('@/views/home'),
            name: 'home',
            hidden: true,
            meta: {
              alias: '首页',
              aliaseng: 'HomePage',
              aliaseng2: 'HomePage',
              title2: '',
              roles: ['audit', 'safe', 'system', 'httcadmin']
            }
          }]
        })
        break
    }
  })
  accessedRoutersqx.push(
    {
      path: '/assetManage', component: Layout, name: 'TerminalManage', hidden: false,
      redirect: '/assetManage/TerminalManage/TerminalManage',
      children: [
        {
          path: 'TerminalManage',path1: '/assetManage/TerminalManage/TerminalManage',
          name: 'TerminalManage',hidden: true,
          component: () => import('@/views/assetManage/TerminalManage/TerminalManage'),
          meta: {alias: '终端管理', title2: '终端管理', roles: ['audit', 'safe', 'system', 'httcadmin']}
        }
      ]
    },
    {
      path: '/kxstatus',
      component: Layout,
      name: 'TpcmInfo',
      meta: {alias: 'tpcm', title1: '可信根状态', roles: ['httcadmin']},
      children: [
        {
          path: 'TpcmInfo',
          component: () => import('@/views/kxstatus/RootStatus/TpcmInfo'),
          name: 'TpcmInfo',
          hidden: true,
          meta: {alias: 'tpcm管理', title2: 'tpcm管理', roles: ['audit', 'safe', 'system', 'httcadmin']}
        },
        {
          path: 'TcmInfo',
          component: () => import('@/views/kxstatus/RootStatus/TcmInfo'),
          name: 'TcmInfo',
          hidden: true,
          meta: {alias: 'tcm管理', title2: 'tcm管理', roles: ['audit', 'safe', 'system', 'httcadmin']}
        },
      ]
    },
    {
      path: '/error',component: Layout,redirect: 'noredirect',name: 'errorPages',
      meta: { title: 'errorPages', icon: '404'},
      children: [
        {
          path: '401',name: 'page401',
          component: () => import('@/views/errorPage/401'),
          meta: { title: 'page401', noCache: true}
        },
        {
          path: '404',
          component: () => import('@/views/errorPage/404'),
          name: 'page404',
          meta: { title: 'page404',noCache: true}
        },
        {
          path: '500',
          component: () => import('@/views/errorPage/500'),
          name: 'page500',
          meta: {
            title: 'page500',
            noCache: true
          }
        }
      ]
    }, 
    {
      path: '*',
      redirect: '/404',
      hidden: false
    })
  qxmenudata.map(function(value, index) {
    switch (value.name) {
      case 'HomePage':
        filerfun(value)
        break
    }
  })
  console.info('store1', accessedRoutersqx)
  return accessedRoutersqx
}

function filerfun(param2) {
  console.info(param2)
  if (param2.children.length === 0) {
    for (var j = 0; j < accessedRoutersqx.length; j++) {
      if (accessedRoutersqx[j].meta) {
        if (param2.name === accessedRoutersqx[j].meta.aliaseng) {
          if (param2.tag === 1) {
            accessedRoutersqx[j].hidden = true
          } else if (param2.tag === 0) {
            accessedRoutersqx[j].hidden = false
          }
          if (param2.name === 'HomePage') {
              accessedRoutersqx[j].hidden = true
          }
        }
      }
    }
  }

}