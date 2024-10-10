import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout/Layout'
Vue.use(Router)
export const constantRouterMap = [
  // 登录页和错误页
  {path:'/',redirect:'/login'},
  {path: '/layout', component: Layout, name: 'Layout', hidden: false},
  {path: '/login', component: () => import('@/views/login/Login'), name: 'login', hidden: false},
  {path: '/home',component: () => import('@/views/home/index'),name: 'home',hidden: false},
  {
    path: '/assetManage',  name: 'assetManage',component: Layout,
    meta: {alias: '资产管理', icon:require('@/assets/NavMenu/zcgl.png'),roles: ["httcadmin",'system','safe']},
    children: [
      {
        path: '/assetManage/TerminalManage/TerminalManage',
        component: () => import('@/views/assetManage/TerminalManage/TerminalManage'),
        meta: {alias: '资产管理', title1: '资产列表',keepAlive: true},
      },
      {
        path: '/kxstatus/credentials/CredentialsManage',
        component: () => import('@/views/kxstatus/credentials/CredentialsManage'),
        meta: {alias: '资产管理', title1: '平台身份证书',keepAlive: true},
      }
    ]
  },
  {
    path: '/benchmarkManage',  name: 'benchmarkManage',component: Layout,
    meta: {alias: '基准管理', icon:require('@/assets/NavMenu/jzgl.png'),roles: ["httcadmin",'safe']},
    children: [
      {
        path: '/benchmarkManage/BenchmarkManage/BenchmarkLibrary',
        meta: {alias: '基准管理', title1: '白名单',keepAlive: true},
        component: () => import('@/views/benchmarkManage/BenchmarkManage/BenchmarkLibrary'),
      },
      // {
      //   path: '/benchmarkManage/DynamicMeasure/EnvDynamicMeasure',
      //   meta: {alias: '基准管理', title1: '环境动态度量'},
      //   component: () => import('@/views/benchmarkManage/DynamicMeasure/EnvDynamicMeasure'),
      // },
      // {
      //   path: '/benchmarkManage/ProcessDynamic/ProcessDynamic',
      //   meta: {alias: '基准管理', title1: '进程动态度量'},
      //   component: () => import('@/views/benchmarkManage/ProcessDynamic/ProcessDynamic'),
      // },
      // {
      //   path: '/benchmarkManage/KeyDocument/KeyDocumentMetrics',
      //   meta: {alias: '基准管理', title1: '关键文件度量'},
      //   component: () => import('@/views/benchmarkManage/KeyDocument/KeyDocumentMetrics'),
      // },
      {
        path: '/benchmarkManage/StartMetrics/StartMetrics',
        meta: {alias: '基准管理', title1: '启动度量',keepAlive: true},
        component: () => import('@/views/benchmarkManage/StartMetrics/StartMetrics'),
      },
    ]
  },
  {
    path: '/kxstatus', component: Layout, name: 'kxstatus',
    meta: {alias: '可信验证', icon:require('@/assets/NavMenu/kxzt.png'),roles: ["httcadmin",'safe']},
    children: [
      {
        path: '/kxstatus/RootStatus/TpcmInfo',
        component: () => import('@/views/kxstatus/RootStatus/TpcmInfo'),
        meta: {alias: '可信验证', title1: 'TPCM管理',keepAlive: true},
      },
      {
        path: '/kxstatus/RootStatus/TcmInfo',
        meta: {alias: '可信验证', title1: 'TCM管理',keepAlive: true},
        component: () => import('@/views/kxstatus/RootStatus/TcmInfo'),
      },
      {
        path: '/kxstatus/CredibleReport/Report',
        component: () => import('@/views/kxstatus/CredibleReport/Report'),
        meta: {alias: '可信验证', title1: '可信报告',keepAlive: true},
      },
      {
        path: '/kxstatus/StartMetrics/StartMetrics',
        meta: {alias: '可信验证', title1: '启动度量',keepAlive: true},
        component: () => import('@/views/kxstatus/StartMetrics/StartMetrics'),
      },
      {
        path: '/kxstatus/DynamicMeasureManage/DynamicMeasure',
        component: () => import('@/views/kxstatus/DynamicMeasureManage/DynamicMeasure'),
        meta: {alias: '可信验证', title1: '环境动态度量',keepAlive: true},
      },
      // {
      //   path: '/kxstatus/DynamicMeasureManage/ProcessDynamicMeasure',
      //   meta: {alias: '可信验证', title1: '进程动态度量',keepAlive: true},
      //   component: () => import('@/views/kxstatus/DynamicMeasureManage/ProcessDynamicMeasure'),
      // },
      // {
      //   path: '/kxstatus/IllegalProcedure/IllegalProcedure',
      //   meta: {alias: '可信验证', title1: '非法程序展示'},
      //   component: () => import('@/views/kxstatus/IllegalProcedure/IllegalProcedure'),
      // },
    ]
  },
  {
    path: '/trustedPolicy', component: Layout, name: 'trustedPolicy',
    meta: {alias: '策略管理', icon:require('@/assets/NavMenu/kxcl.png'),roles: ["httcadmin",'safe']},
    children: [
      {
        path: '/benchmarkManage/softwareManage',
        meta: {alias: '策略管理', title1: '软件包管理',roles: ["httcadmin",'safe']},
        component: () => import('@/views/page/MultiLevelMenu'),
        children: [
          {
            path: 'SoftwareImport',
            component: () => import('@/views/benchmarkManage/softwareManage/SoftwareImport'),
            name: 'SoftwareImport',
            meta: {title2: '软件包导入',roles: ["httcadmin",'safe'],keepAlive: true}
          },{
            path: 'SoftwareDistribution',
            component: () => import('@/views/benchmarkManage/softwareManage/SoftwareDistribution'),
            name: 'SoftwareDistribution',
            meta: {title2: '软件包下发',roles: ["httcadmin",'safe'],keepAlive: true}
          }
        ]
      },
      {
        path: '/benchmarkManage/ProgramWhiteList',
        component: () => import('@/views/page/MultiLevelMenu'),
        meta: {alias: '策略管理', title1: '程序白名单',roles: ["httcadmin",'safe']},
        children: [
          {
            path: 'WhiteLearn',
            component: () => import('@/views/benchmarkManage/ProgramWhiteList/WhiteLearn'),
            name: 'WhiteLearn',
            meta: {title2: '白名单学习',roles: ["httcadmin",'safe'],keepAlive: true}
          },
          {
            path: 'PackageTemplate',
            component: () => import('@/views/benchmarkManage/ProgramWhiteList/PackageTemplate'),
            name: 'PackageTemplate',
            meta: {title2: '程序包模板',roles: ["httcadmin",'safe'],keepAlive: true}
          },
          {
            path: 'PackageDistribution',
            component: () => import('@/views/benchmarkManage/ProgramWhiteList/PackageDistribution'),
            name: 'PackageDistribution',
            meta: {title2: '程序包下发',roles: ["httcadmin",'safe'],keepAlive: true}
          }
        ]
      },
      {
        path: '/trustedPolicy/StartMeasure/StartMeasurement',
        component: () => import('@/views/trustedPolicy/StartMeasure/StartMeasurement'),
        name: 'StartMeasurement',
        meta: {alias: '策略管理', title1: '启动度量',keepAlive: true}
      },
      {
        path: '/trustedPolicy/DynamicMeasureManage',
        component: () => import('@/views/page/MultiLevelMenu'),
        meta: {alias: '策略管理', title1: '动态度量管理'},
        children: [
          {
            path: 'DynamicMeasure',
            component: () => import('@/views/trustedPolicy/DynamicMeasureManage/DynamicMeasure'),
            name: 'DynamicMeasure',
            meta: {title2: '环境动态度量',keepAlive: true}
          },
          // {
          //   path: 'ProcessDynamicMeasure',
          //   component: () => import('@/views/trustedPolicy/DynamicMeasureManage/ProcessDynamicMeasure'),
          //   name: 'ProcessDynamicMeasure',
          //   meta: {title2: '进程动态度量',keepAlive: true}
          // },
        ]
      },
      {
        path: '/trustedPolicy/KeyDocument/KeyDocumentMetrics',
        meta: {alias: '策略管理', title1: '关键文件度量',keepAlive: true},
        component: () => import('@/views/trustedPolicy/KeyDocument/KeyDocumentMetrics'),
      },
      {
        path: '/trustedPolicy/FileAccessControl/FileAccessControl',
        meta: {alias: '策略管理', title1: '文件访问控制'},
        component: () => import('@/views/trustedPolicy/FileAccessControl/FileAccessControl'),
      },
      {
        path: '/trustedPolicy/PeripheralControl',
        component: () => import('@/views/page/MultiLevelMenu'),
        meta: {alias: '策略管理', title1: '外设控制'},
        children: [
          {
            path: 'UsbPolicy',
            component: () => import('@/views/trustedPolicy/PeripheralControl/UsbPolicy'),
            name: 'UsbPolicy',
            meta: {title2: 'U盘策略',keepAlive: true}
          },
          {
            path: 'CdControl',
            component: () => import('@/views/trustedPolicy/PeripheralControl/CdControl'),
            name: 'CdControl',
            meta: {title2: '光驱控制',keepAlive: true}
          },
        ]
      },
      {
        path: '/trustedPolicy/NetworkControl/NetworkManage',
        meta: {alias: '策略管理', title1: '网络管理'},
        component: () => import('@/views/trustedPolicy/NetworkControl/NetworkManage'),
      },
    ]
  },
  // {
  //   // path: '/KeyManage', 
  //   path: '/trustedPolicy/KeyManage/KeyManagement',name: 'KeyManage',component: Layout,hidden:false,
  //   meta: {alias: '可信密钥', icon:require('@/assets/NavMenu/kxmy.png'),roles: ["httcadmin",'safe']},
  //   children: [
  //     {
  //       path: '/trustedPolicy/KeyManage/KeyManagement',
  //       component: () => import('@/views/trustedPolicy/KeyManage/KeyManagement'),
  //       meta: {alias: '可信密钥', title1: '密钥树管理',keepAlive: true},
  //     },
  //   ]
  // },
  // {
  //   // path: '/StorageManage',
  //   path: '/trustedPolicy/PlatformManage/StorageManage',  name: 'StorageManage',component: Layout,hidden:false,
  //   meta: {alias: '可信存储', icon:require('@/assets/NavMenu/kxcc.png'),roles: ["httcadmin",'safe']},
  //   children: [
  //     {
  //       path: '/trustedPolicy/PlatformManage/StorageManage',
  //       component: () => import('@/views/trustedPolicy/PlatformManage/StorageManage'),
  //       meta: {alias: '可信存储', title1: '可信存储管理',roles: ["httcadmin",'safe'],keepAlive: true},
  //     },
  //   ]
  // },
  // {
  //   path: '/trustedConnection', component: Layout, name: 'trustedConnection',
  //   meta: {alias: '可信连接', icon:require('@/assets/NavMenu/kxlj.png'), roles: ["httcadmin",'safe']},
  //   children: [
  //     {
  //       path: '/trustedPolicy/TrustConnectionManage/TrustedConnection',
  //       component: () => import('@/views/trustedPolicy/TrustConnectionManage/TrustedConnection'),
  //       name: 'TrustedConnection',
  //       meta: { alias:"可信连接", title1: '可信配置',keepAlive: true}
  //     },
  //     {
  //       path: '/trustedPolicy/TrustConnectionManage/SessionManage',
  //       component: () => import('@/views/trustedPolicy/TrustConnectionManage/SessionManage'),
  //       name: 'SessionManage',
  //       meta: { alias:"可信连接",title1: '会话信息',keepAlive: true}
  //     },
  //     {
  //       path: '/trustedPolicy/TrustConnectionManage/RemoteCertificateManage',
  //       component: () => import('@/views/trustedPolicy/TrustConnectionManage/RemoteCertificateManage'),
  //       name: 'RemoteCertificateManage',
  //       meta: { alias:"可信连接",title1: '远程证书',keepAlive: true}
  //     },
  //   ]
  // },
  {
    path: '/PlatformManagement', component: Layout, name: 'PlatformManagement',
    meta: {alias: '平台管理', icon:require('@/assets/NavMenu/ptgl.png'),roles: ["httcadmin",'system']},
    children: [
      {
        path: '/trustedPolicy/GlobalStrategy/GlobalStrategy',
        component: () => import('@/views/trustedPolicy/GlobalStrategy/GlobalStrategy'),
        meta: {alias: '平台管理', title1: '全局策略',keepAlive: true},
      },
      {
        path: '/trustedPolicy/ProcessIdentity',
        component: () => import('@/views/page/MultiLevelMenu'),
        meta: {alias: '平台管理', title1: '进程身份'},
        children: [
          {
            path: 'ProcessIdentity',
            component: () => import('@/views/trustedPolicy/ProcessIdentity/ProcessIdentity'),
            name: 'ProcessIdentity',
            meta: {title2: '进程身份',keepAlive: true}
          },
          {
            path: 'ProcessRole',
            component: () => import('@/views/trustedPolicy/ProcessIdentity/ProcessRole'),
            name: 'ProcessRole',
            meta: {title2: '进程角色',keepAlive: true}
          }
        ]
      },
      {
        path: '/trustedPolicy/PolicyAuthorization',
        component: () => import('@/views/page/MultiLevelMenu'),
        meta: {alias: '平台管理', title1: '策略授权'},
        children: [
          {
            path: 'PolicyAuthorization',
            component: () => import('@/views/trustedPolicy/PolicyAuthorization/PolicyAuthorization'),
            name: 'PolicyAuthorization',
            meta: {title2: '启动度量',keepAlive: true}
          },
          {
            path: 'StaticMeasureStrategy',
            component: () => import('@/views/trustedPolicy/PolicyAuthorization/StaticMeasureStrategy'),
            name: 'StaticMeasureStrategy',
            meta: {title2: '白名单度量',keepAlive: true}
          }
        ]
      },
      {
        path: '/trustedPolicy/PlatformManage/ProcessTrace',
        component: () => import('@/views/trustedPolicy/PlatformManage/ProcessTrace'),
        name: 'ProcessTrace',
        meta: { alias:"平台管理",title1: '进程防跟踪',keepAlive: true}
      },
      {
        path: '/trustedPolicy/PlatformManage/PasswordManage',
        component: () => import('@/views/trustedPolicy/PlatformManage/PasswordManage'),
        name: 'PasswordManage',
        meta: { alias:"平台管理",title1: '可信根密码',keepAlive: true}
      },
      {
        path: '/trustedPolicy/PlatformManage/AlarmInfo',
        component: () => import('@/views/trustedPolicy/PlatformManage/AlarmInfo'),
        name: 'AlarmInfo',
        meta: { alias:"平台管理",title1: '失败日志',keepAlive: true}
      },
    ]
  },
  {
    path: '/auditManage', component: Layout, name: 'auditManage',
    meta: {alias: '审计管理', icon:require('@/assets/NavMenu/sjgl.png'),roles: ["httcadmin",'audit']},
    children: [
      {
        path: '/auditManage/AuditStrategy/AuditStrategy',
        component: () => import('@/views/auditManage/AuditStrategy/AuditStrategy'),
        meta:{alias:"审计管理",title1:"审计策略",keepAlive: true},
      },
      {
        path: '/auditManage/TerminalAudit',
        component: () => import('@/views/page/MultiLevelMenu'),
        meta:{alias:"审计管理",title1:"终端审计"},
        children: [
          {
            path: 'DynamicMeasureLog',
            component: () => import('@/views/auditManage/TerminalAudit/DynamicMeasureLog'),
            name: 'DynamicMeasureLog',
            meta: { title2: '动态度量日志',keepAlive: true}
          },
          {
            path: 'StartMeasureLog',
            component: () => import('@/views/auditManage/TerminalAudit/StartMeasureLog'),
            name: 'StartMeasureLog',
            meta: { title2: '启动度量日志',keepAlive: true}
          },
          {
            path: 'WhiteListLog',
            component: () => import('@/views/auditManage/TerminalAudit/WhiteListLog'),
            name: 'WhiteListLog',
            meta: { title2: '白名单日志',keepAlive: true}
          },
          // {
          //   path: 'TrustedConnectionLog',
          //   component: () => import('@/views/auditManage/TerminalAudit/TrustedConnectionLog'),
          //   name: 'TrustedConnectionLog',
          //   meta: { title2: '可信连接日志',keepAlive: true}
          // },
          {
            path: 'AlarmLog',
            component: () => import('@/views/auditManage/TerminalAudit/AlarmLog'),
            name: 'AlarmLog',
            meta: { title2: '告警',keepAlive: true}
          },
          {
            path: 'FileAccessControlLog',
            component: () => import('@/views/auditManage/TerminalAudit/FileAccessControlLog'),
            name: 'FileAccessControlLog',
            meta: { title2: '文件访问控制日志'}
          },
          {
            path: 'PeripheralLog',
            component: () => import('@/views/auditManage/TerminalAudit/PeripheralLog'),
            name: 'PeripheralLog',
            meta: { title2: '外设控制日志'}
          },
          {
            path: 'NetworkLog',
            component: () => import('@/views/auditManage/TerminalAudit/NetworkLog'),
            name: 'NetworkLog',
            meta: { title2: '网络管理日志'}
          },
        ]
      },
      {
        path: '/auditManage/SystemAudit',
        component: () => import('@/views/page/MultiLevelMenu'),
        meta:{alias:"审计管理",title1:"系统审计"},
        children: [
          {
            path: 'OperationLog',
            component: () => import('@/views/auditManage/SystemAudit/OperationLog'),
            name: 'OperationLog',
            meta: { title2: '操作日志',keepAlive: true}
          }
        ]
      },
      // {
      //   path: '/auditManage/AlarmInformation/AlarmInformation',
      //   component: () => import('@/views/auditManage/AlarmInformation/AlarmInformation'),
      //   meta:{alias:"审计管理",title1:"告警信息"},
      // },
    ]
  },
  {
    path: '/sysManage', component: Layout, name: 'sysManage',
    meta: {alias: '系统设置', icon:require('@/assets/NavMenu/xtgl.png'),roles: ["httcadmin",'system']},
    children: [
      {
        path: '/sysManage/UserManage/UserManage',
        component: () => import('@/views/sysManage/UserManage/UserManage'),
        name: 'UserManage',
        meta: { alias:"系统设置",title1: '管理员信息',keepAlive: true}
      },
      {
        path: '/assetManage/LicenseManage/LicenseAuthorize', 
        meta: {alias: '系统设置', title1: 'License授权',keepAlive: true},
        component: () => import('@/views/assetManage/LicenseManage/LicenseAuthorize'),
      },
      {
        path: '/sysManage/UserManage/LoginSetting',
        component: () => import('@/views/sysManage/UserManage/LoginSetting'),
        name: 'LoginSetting',
        meta: { alias:"系统设置",title1: '登录设置'}
      },
      {
        path: '/sysManage/ThirdPartyManage',
        component: () => import('@/views/page/MultiLevelMenu'),
        meta:{alias:"系统设置",title1:"管理员证书"},
        children: [
          {
            path: 'CertificateImport',
            component: () => import('@/views/sysManage/ThirdPartyManage/CertificateImport'),
            name: 'CertificateImport',
            meta: { title2: '证书导入',keepAlive: true}
          },
          {
            path: 'CertificateIssue',
            component: () => import('@/views/sysManage/ThirdPartyManage/CertificateIssue'),
            name: 'CertificateIssue',
            meta: { title2: '证书下发',keepAlive: true}
          }
        ]
      },
    ]
  },
  
  // {path: '/404', component: () => import('@/views/errorPage/404'), hidden: false},
  // {path: '/401', component: () => import('@/views/errorPage/401'), hidden: false},
  // {path: '/500', component: () => import('@/views/errorPage/500'), hidden: false},
  // 验证码
  {path: '/common/identify', component: () => import('@/components/common/identify'), hidden: false}
]
export default new Router({
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'errorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {path: '401', component: () => import('@/views/errorPage/401'), name: 'page401', meta: {title: 'page401', noCache: true}},
      {path: '404', component: () => import('@/views/errorPage/404'), name: 'page404', meta: {title: 'page404', noCache: true}},
      {path: '404', component: () => import('@/views/errorPage/500'), name: 'page500', meta: {title: 'page500', noCache: true}}
    ]
  },
  {path: '*', redirect: '/404', hidden: false}
]
