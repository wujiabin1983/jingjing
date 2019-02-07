import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout'

Vue.use(Router)

/**
* icon : the icon show in the sidebar
* hidden : if `hidden:true` will not show in the sidebar
* redirect : if `redirect:noredirect` will not redirct in the levelbar
* noDropdown : if `noDropdown:true` will not has submenu in the sidebar
* meta : `{ role: ['admin'] }`  will control the page role
**/
export const constantRouterMap = [
  { path: '/login', name: '登录', component: _import('login/index'), hidden: true },
  {
    id: 6,
    path: '/work',
    component: Layout,
    redirect: 'clearCenter',
    icon: 'tubiao',
    noDropdown: true,
    children: [
      { path: 'clearCenter', name: '清算中心', component: _import('WebRoot/work/clearCenter') },
      { path: 'clearCenter/show', name: '清算中心-查看', component: _import('WebRoot/work/operate/clearCenter'), hidden: true },
      { path: 'clearCenter/other', name: '清算中心-手工调账', component: _import('WebRoot/work/operate/clearCenterOther'), hidden: true }
    ]
  },
  {
    id: 3,
    path: '/base',
    component: Layout,
    icon: 'improt',
    name: '数据导入',
    noDroupDown: false,
    meta: { role: ['SELLER'] },
    children: [
      { path: 'shopInfo/detail', name: '数据导入店铺信息查看详情', component: _import('WebRoot/base/operate/storeManagement'), hidden: true },
      { path: 'storeGroup/info', name: '数据导入店组信息查看详情', component: _import('WebRoot/base/operate/storeGroupManagement'), hidden: true },
      { path: 'regional/info', name: '数据导入区域信息查看详情', component: _import('WebRoot/base/operate/regionalInfo'), hidden: true },
      { path: 'memberInfo/showInfo', name: '数据导入会员信息查看详情', component: _import('WebRoot/base/operate/memberInfoData'), hidden: true },
      { path: 'orderInfo/showInfo', name: '数据导入订单信息查看详情', component: _import('WebRoot/base/operate/orderInfoData'), hidden: true },
    ]
  },
  
  {
    id: 1,
    path: '/member',
    component: Layout,
    icon: 'yingxiaohuodong',
    name: '营销活动',
    noDroupDown: false,
    children: [
      { path: 'activityManageInfo', name: '营销活动活动监控查询', component: _import('WebRoot/member/operate/activityManage') },
    ]
  },
  {
    id: 1,
    path: '/member',
    component: Layout,
    icon: 'store',
    name: '优惠券',
    noDroupDown: false,
    children: [
      { path: 'showInfo', name: '使用统计-查看详情', component: _import('WebRoot/member/operate/statisticsInfo'), hidden: true }
    ]
  },
  {
    id: 1,
    path: '/member',
    component: Layout,
    icon: 'yingxiaohuodong',
    name: '营销活动',
    noDroupDown: false,
    children: [
      { path: 'shortMessageStatistics/info', name: '营销活动短信统计查看详情', component: _import('WebRoot/member/operate/shortMessageInfo'), hidden: true }
    ]
  },
  {
    id: 1,
    path: '/member',
    component: Layout,
    icon: 'yingxiaohuodong',
    name: '会员分组',
    noDropDown: false,
    children: [
      { path: 'allGroup/groupInfo', name: '所有分组-分组详情', component: _import('WebRoot/member/groupInfo'), hidden: true },
      { path: 'allGroup/marketingActivities', name: '所有分组-营销活动', component: _import('WebRoot/member/marketingActivities'), hidden: true },
      { path: 'allGroup/sysMemberGroupInfo', name: '所有分组-系统分析', component: _import('WebRoot/member/sysMemberGroupInfo'), hidden: true },

      { path: 'initGroup/groupInfo', name: '预置分组-分组详情', component: _import('WebRoot/member/groupInfo'), hidden: true },
      { path: 'initGroup/marketingActivities', name: '预置分组-营销活动', component: _import('WebRoot/member/marketingActivities'), hidden: true },
      { path: 'initGroup/sysMemberGroupInfo', name: '预置分组-系统分析', component: _import('WebRoot/member/sysMemberGroupInfo'), hidden: true },
      
      { path: 'brandGroup/groupInfo', name: '品牌分组-分组详情', component: _import('WebRoot/member/groupInfo'), hidden: true },
      { path: 'brandGroup/marketingActivities', name: '品牌分组-营销活动', component: _import('WebRoot/member/marketingActivities'), hidden: true },
      { path: 'brandGroup/sysMemberGroupInfo', name: '品牌分组-系统分析', component: _import('WebRoot/member/sysMemberGroupInfo'), hidden: true },
      
      { path: 'shareGroup/groupInfo', name: '共享分组-分组详情', component: _import('WebRoot/member/groupInfo'), hidden: true },
      { path: 'shareGroup/marketingActivities', name: '品牌分组-营销活动', component: _import('WebRoot/member/marketingActivities'), hidden: true },
      { path: 'shareGroup/sysMemberGroupInfo', name: '品牌分组-系统分析', component: _import('WebRoot/member/sysMemberGroupInfo'), hidden: true },

      { path: 'mineGroup/groupInfo', name: '我的分组-分组详情', component: _import('WebRoot/member/groupInfo'), hidden: true },
      { path: 'mineGroup/marketingActivities', name: '我的分组-营销活动', component: _import('WebRoot/member/marketingActivities'), hidden: true },
      { path: 'mineGroup/sysMemberGroupInfo', name: '我的分组-系统分析', component: _import('WebRoot/member/sysMemberGroupInfo'), hidden: true },
    ]
  },
  {
    id: 'mobile',
    path: '/mobile',
    component: Layout,
    icon: 'store',
    name: '页面设置 ',
    noDroupDown: false,
    hidden: true,
    children: [
      { path: 'ruleSet', name: '页面设置邀请有礼设置会员奖励制度', component: _import('WebRoot/mobile/operate/ruleSetinvitation'), hidden: true },
    ]
  },
  // { path: '/qrcode', component: _import('WebRoot/mobile/PublicNumberBindingQrcode'), hidden: true },
  // { path: '/qrcode', component: _import('Qrcode'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{ path: 'dashboard', component: _import('dashboard/index') }]
  },
  {
    "id": "work",
    "path": "/work",
    "component": Layout,
    "icon": "",
    "redirect": "",
    "noDropdown": true,
    "meta": {
      "roleBtn": [ "addMemberReturnTask","updateMemberReturnTask", "forbiddenMemberReturnTask", "deleteMemberReturnTask"]
    },
    "children": [{
      "path": "work-memberReturnVisit",
      "name": "会员回访",
      "component": _import('WebRoot/work/memberReturnVisit/memberReturnVisit')
    },
    {
      "path": "work-addUpdateMemberReturnTask",
      "name": "会员回访-新增/编辑回访任务",
      "component": _import('WebRoot/work/memberReturnVisit/addUpdateMemberReturnTask')
    },
    {
      "path": "work-memberReturnTaskDetails/:id",
      "name": "会员回访-任务详情",
      "component": _import('WebRoot/work/memberReturnVisit/memberReturnTaskDetails')
    },{
      "path": "work-memberReturnVisit/questionnaireTemplate",
      "name": "会员回访-问卷模版",
      "component": _import('WebRoot/work/memberReturnVisit/questionnaireTemplate')
    },{
      "path": "work-memberReturnVisit/addUpdateQuestionnaireTemplate/:id?",
      "name": "会员回访-新增/编辑问卷模版",
      "component": _import('WebRoot/work/memberReturnVisit/addUpdateQuestionnaireTemplate')
    }]
  },
]
export const asyncRouterMap = [
//{
//  id: 1,
//  path: '/member',
//  component: Layout,
//  icon: 'yingxiaohuodong',
//  name: '会员设置',
//  noDroupDown: false,
//  children: [{ path: 'memberAnalysis', name: '会员分析', component: _import('WebRoot/member/memberAnalysis') },
//      { path: 'memberSelect', name: '会员查询', component: _import('WebRoot/member/memberSelect') },
//      { path: 'memberSelect/info', name: '会员查询详情', component: _import('WebRoot/member/operate/memberSelectInfo'), hidden: true },
//      { path: 'WeChatFans', name: '微信粉丝', component: _import('WebRoot/member/WeChatFans') },
//      { path: 'memberDataModification', name: '会员资料修改', component: _import('WebRoot/member/memberDataModification') },
//      { path: 'memberDataModification/edit', name: '会员资料修改-会员信息调整', component: _import('WebRoot/member/operate/memberDataModification'), hidden: true },
//      { path: 'automaticMarking', name: '自动打标签', component: _import('WebRoot/member/automaticMarking') },
//    { path: 'automaticMarking/add', name: '自动打标签-添加', component: _import('WebRoot/member/operate/automaticMarking'), hidden: true },
//    { path: 'automaticMarking/edit', name: '自动打标签-修改', component: _import('WebRoot/member/operate/automaticMarking'), hidden: true }
//  ]
//},
//{
//  id: 1,
//  path: '/member',
//  component: Layout,
//  icon: 'yingxiaohuodong',
//  name: '会员分组',
//  noDropDown: false,
//  children: [
//    { path: 'allGroup', name: '所有分组', component: _import('WebRoot/member/allGroup') },
//    { path: 'initGroup', name: '预置分组', component: _import('WebRoot/member/initGroup') },
//    { path: 'brandGroup', name: '品牌分组', component: _import('WebRoot/member/brandGroup') },
//    { path: 'shareGroup', name: '共享分组', component: _import('WebRoot/member/shareGroup') },
//    { path: 'mineGroup', name: '我的分组', component: _import('WebRoot/member/mineGroup') }
//  ]
//},
//{
//  id: 1,
//  path: '/member',
//  component: Layout,
//  icon: 'store',
//  name: '优惠券',
//  noDroupDown: false,
//  children: [
//    { path: 'couponTemplate', name: '优惠券模板', component: _import('WebRoot/member/couponTemplate') },
//    { path: 'couponTemplate/add', name: '优惠券优惠券模板添加', component: _import('WebRoot/member/operate/couponTemplate'), hidden: true },
//    { path: 'couponLibrary', name: '优惠券库', component: _import('WebRoot/member/couponLibrary') },
//    { path: 'couponLibrary/show', name: '优惠券优惠券库查询', component: _import('WebRoot/member/operate/couponLibrary'), hidden: true },
//    { path: 'couponLibrary/edit', name: '优惠券优惠券库修改', component: _import('WebRoot/member/operate/couponLibrary'), hidden: true },
//    { path: 'couponLibrary/add', name: '优惠券优惠券库新建优惠券', component: _import('WebRoot/member/operate/couponLibrary'), hidden: true },
//    { path: 'couponLibrary/copy', name: '优惠券优惠券库复制', component: _import('WebRoot/member/operate/couponLibrary'), hidden: true },
//    { path: 'couponPackage', name: '优惠券礼包', component: _import('WebRoot/member/couponPackage') },
//    { path: 'couponPackage/show', name: '优惠券优惠券礼包查询', component: _import('WebRoot/member/operate/couponPackage'), hidden: true },
//    { path: 'couponPackage/add', name: '优惠券优惠券礼包新建', component: _import('WebRoot/member/operate/couponPackage'), hidden: true },
//    { path: 'couponPackage/edit', name: '优惠券优惠券礼包修改', component: _import('WebRoot/member/operate/couponPackage'), hidden: true },
//    { path: 'storeVoucherLibrary', name: '门店券库', component: _import('WebRoot/member/storeVoucherLibrary') },
//    { path: 'storeVoucherLibrary/show', name: '优惠券门店券库查询', component: _import('WebRoot/member/operate/storeVoucherLibrary'), hidden: true },
//    { path: 'storeVoucherLibrary/add', name: '优惠券门店券库新建门店券', component: _import('WebRoot/member/operate/storeVoucherLibrary'), hidden: true },
//    { path: 'statistics', name: '使用统计', component: _import('WebRoot/member/statistics') },
//    { path: 'statistics/show', name: '使用统计-查看', component: _import('WebRoot/member/operate/statistics'), hidden: true },
//    { path: 'statisticsInfo/showInfo', name: '使用统计-查看详情', component: _import('WebRoot/member/operate/statisticsInfo'), hidden: true }
//  ]
//},
//{
//  id: 1,
//  path: '/member',
//  component: Layout,
//  icon: 'yingxiaohuodong',
//  name: '营销活动',
//  noDroupDown: false,
//  children: [
//    { path: 'activityManage', name: '活动监控', component: _import('WebRoot/member/activityManage') },
//    { path: 'activityManagement', name: '活动管理', component: _import('WebRoot/member/activityManagement') },
//    { path: 'activityManagement/show', name: '营销活动活动管理查询', component: _import('WebRoot/member/operate/activityManagement'), hidden: true },
//    { path: 'activityManagement/add', name: '营销活动活动管理添加', component: _import('WebRoot/member/operate/activityManagement'), hidden: true },
//    { path: 'activityManagement/edit', name: '营销活动活动管理修改', component: _import('WebRoot/member/operate/activityManagement'), hidden: true },
//    { path: 'activeTemplate', name: '活动模板', component: _import('WebRoot/member/activeTemplate') },
//    { path: 'activeTemplate/show', name: '营销活动活动模板查询', component: _import('WebRoot/member/operate/activeTemplate'), hidden: true },
//    { path: 'activeTemplate/add', name: '营销活动活动模板添加', component: _import('WebRoot/member/operate/activeTemplate'), hidden: true },
//    { path: 'activeTemplate/edit', name: '营销活动活动模板修改', component: _import('WebRoot/member/operate/activeTemplate'), hidden: true },
//    { path: 'activeTemplate/copy', name: '营销活动活动模板复制', component: _import('WebRoot/member/operate/activeTemplate'), hidden: true },
//    { path: 'activeTemplate/create', name: '活动模板-创建活动', component: _import('WebRoot/member/operate/activityManagement'), hidden: true },
//    { path: 'shortMessageStatistics', name: '短信统计', component: _import('WebRoot/member/shortMessageStatistics') },
//    { path: 'shortMessageStatistics/show', name: '营销活动短信统计查看', component: _import('WebRoot/member/operate/shortMessageStatistics'), hidden: true },
//    { path: 'shortMessageStatistics/info', name: '营销活动短信统计查看详情', component: _import('WebRoot/member/operate/shortMessageInfo'), hidden: true }
//  ]
//},
//// 移动管理
//{
//  id: 'mobile',
//  path: '/mobile',
//  component: Layout,
//  redirect: '/mobile/PublicNumberBinding',
//  icon: 'jichushezhi',
//  noDropdown: true,
//  children: [{ path: 'PublicNumberBinding', name: '公众号绑定', component: _import('WebRoot/mobile/PublicNumberBinding') }]
//},
//{
//  id: 'mobile',
//  path: '/mobile',
//  component: Layout,
//  redirect: '/mobile/customizeMenu',
//  icon: 'jichushezhi',
//  noDropdown: true,
//  children: [{ path: 'customizeMenu', name: '自定义菜单', component: _import('WebRoot/mobile/customizeMenu') }]
//},
//{
//  id: 'mobile',
//  path: '/mobile',
//  component: Layout,
//  redirect: '/mobile/groupMsgMaster',
//  icon: 'jichushezhi',
//  noDropdown: true,
//  children: [{ path: 'groupMsgMaster', name: '群发消息', component: _import('WebRoot/mobile/groupMsgMaster') }]
//},
//{
//  id: 'mobile',
//  path: '/mobile',
//  component: Layout,
//  redirect: '/mobile/graphicMaterial',
//  icon: 'jichushezhi',
//  noDropdown: true,
//  children: [
//    { path: 'graphicMaterial', name: '图文素材', component: _import('WebRoot/mobile/graphicMaterial') },
//    { path: 'add', name: '图文素材图文素材新增', component: _import('WebRoot/mobile/operate/graphicMaterialAdd') }
//  ]
//},
//{
//  id: 'mobile',
//  path: '/mobile',
//  component: Layout,
//  redirect: '/mobile/autoRespond',
//  icon: 'jichushezhi',
//  noDropdown: true,
//  children: [
//    { path: 'autoRespond', name: '自动回复', component: _import('WebRoot/mobile/autoRespond') }
//  ]
//},
//{
//  id: 'mobile',
//  path: '/mobile',
//  component: Layout,
//  icon: 'store',
//  name: '页面设置 ',
//  noDroupDown: false,
//  children: [
//    { path: 'homePageSet', name: '会员首页', component: _import('WebRoot/mobile/homePageSet') },
//    { path: 'perfectInformation', name: '完善资料', component: _import('WebRoot/mobile/perfectInformation') },
//    { path: 'ruleSet', name: '页面设置完善资料设置会员奖励制度', component: _import('WebRoot/mobile/operate/ruleSet'), hidden: true },
//    { path: 'member', name: '会员特权', component: _import('WebRoot/mobile/member') },
//    { path: 'bindMembershipCard', name: '绑定会员卡', component: _import('WebRoot/mobile/bindMembershipCard') },
//    { path: 'ruleSet', name: '页面设置绑定会员卡设置会员奖励制度', component: _import('WebRoot/mobile/operate/ruleSetBindCard'), hidden: true },
//    { path: 'activePhone', name: '激活手机', component: _import('WebRoot/mobile/activePhone') },
//    { path: 'inviteGift', name: '邀请有礼', component: _import('WebRoot/mobile/inviteGift') },
//    { path: 'add', name: '页面设置邀请有礼新建活动', component: _import('WebRoot/mobile/operate/inviteGiftAdd'), hidden: true },
//    { path: 'show', name: '页面设置邀请有礼查看邀请记录', component: _import('WebRoot/mobile/operate/inviteGiftInfo'), hidden: true },
//    { path: 'WeChatMembershipCard', name: '微信会员卡', component: _import('WebRoot/mobile/WeChatMembershipCard') },
//    // { path: 'test', name: '测试表格排序', component: _import('WebRoot/mobile/test') }
//  ]
//},
//{
//  id: 'mobile',
//  path: '/mobile',
//  component: Layout,
//  redirect: '/mobile/msnmodel',
//  icon: 'jichushezhi',
//  noDropdown: true,
//  children: [{ path: 'msnmodel', name: '模板消息', component: _import('WebRoot/mobile/msnmodel') }]
//},
//// 基础设置
//{
//  id: 3,
//  path: '/base',
//  component: Layout,
//  redirect: '/base/brandInfo',
//  icon: 'brand',
//  noDropdown: true,
//  children: [
//    { path: 'brandInfo', name: '品牌信息', component: _import('WebRoot/base/brandInfo') },
//    { path: 'show', name: '品牌信息查询', component: _import('WebRoot/base/operate/brandInfo'), hidden: true },
//    { path: 'add', name: '品牌信息新增', component: _import('WebRoot/base/operate/brandInfo'), hidden: true },
//    { path: 'edit', name: '品牌信息修改', component: _import('WebRoot/base/operate/brandInfo'), hidden: true },
//  ]
//},
//{
//  id: 3,
//  path: '/base',
//  component: Layout,
//  redirect: '/base/merchantBase',
//  icon: 'jichushezhi',
//  noDropdown: true,
//  children: [{ path: 'merchantBase', name: '商户基本设置', component: _import('WebRoot/base/merchantBase') }]
//},
//{
//  id: 3,
//  path: '/base',
//  component: Layout,
//  icon: 'store',
//  name: '门店管理 ',
//  noDroupDown: false,
//  children: [
//    {
//      path: 'storeManagement', name: '门店管理', component: _import('WebRoot/base/storeManagement') },
//    { path: 'storeManagement/show', name: '门店管理门店管理查询', component: _import('WebRoot/base/operate/storeManagement'), hidden: true },
//    { path: 'storeManagement/add', name: '门店管理门店管理新增', component: _import('WebRoot/base/operate/storeManagement'), hidden: true },
//    { path: 'storeManagement/edit', name: '门店管理门店管理修改', component: _import('WebRoot/base/operate/storeManagement'), hidden: true },
//    { path: 'storeGroupManagement', name: '店组管理', component: _import('WebRoot/base/storeGroupManagement') },
//    { path: 'storeGroupManagement/show', name: '门店管理店组管理查询', component: _import('WebRoot/base/operate/storeGroupManagement'), hidden: true },
//    { path: 'storeGroupManagement/add', name: '门店管理店组管理新增', component: _import('WebRoot/base/operate/storeGroupManagement'), hidden: true },
//    { path: 'storeGroupManagement/edit', name: '门店管理店组管理修改', component: _import('WebRoot/base/operate/storeGroupManagement'), hidden: true },
//    { path: 'regionalManagement', name: '区域管理', component: _import('WebRoot/base/regionalManagement') },
//    { path: 'regionalManagement/show', name: '门店管理区域管理查询', component: _import('WebRoot/base/operate/regionalManagement'), hidden: true },
//    { path: 'regionalManagement/add', name: '门店管理区域管理新增', component: _import('WebRoot/base/operate/regionalManagement'), hidden: true },
//    { path: 'regionalManagement/edit', name: '门店管理区域管理修改', component: _import('WebRoot/base/operate/regionalManagement'), hidden: true }
//  ]
//},
//{
//  id: 3,
//  path: '/base',
//  component: Layout,
//  icon: 'user',
//  name: '员工管理 ',
//  noDroupDown: false,
//  meta: { role: ['SELLER'] },
//  children: [
//    { path: 'staffManagement', name: '员工管理', component: _import('WebRoot/base/staffManagement') },
//    { path: 'staffManagement/show', name: '员工管理员工管理查询', component: _import('WebRoot/base/operate/staffManagement'), hidden: true },
//    { path: 'staffManagement/add', name: '员工管理员工管理新增员工', component: _import('WebRoot/base/operate/staffManagement'), hidden: true },
//    { path: 'staffManagement/edit', name: '员工管理员工管理修改', component: _import('WebRoot/base/operate/staffManagement'), hidden: true },
//    { path: 'rolePrivileges', name: '角色权限', component: _import('WebRoot/base/rolePrivileges') },
//    { path: 'rolePrivileges/show', name: '员工管理角色权限查询', component: _import('WebRoot/base/operate/rolePrivileges'), hidden: true },
//    { path: 'rolePrivileges/add', name: '员工管理角色权限新增角色', component: _import('WebRoot/base/operate/rolePrivileges'), hidden: true },
//    { path: 'rolePrivileges/edit', name: '员工管理角色权限修改', component: _import('WebRoot/base/operate/rolePrivileges'), hidden: true },
//    { path: 'rolePrivileges/edit', name: '员工管理角色权限设置', component: _import('WebRoot/base/operate/rolePrivileges'), hidden: true },
//    { path: 'rolePrivileges/set', name: '员工管理权限设置', component: _import('WebRoot/base/operate/rolePrivilegesSet'), hidden: true }
//  ]
//},
//{
//  id: 3,
//  path: '/base',
//  component: Layout,
//  icon: 'improt',
//  name: '数据导入',
//  noDroupDown: false,
//  meta: { role: ['SELLER'] },
//  children: [
//    { path: 'shopInfo', name: '店铺信息', component: _import('WebRoot/base/shopInfo') },
//    { path: 'shopInfo/show', name: '数据导入店铺信息查询', component: _import('WebRoot/base/operate/shopInfo'), hidden: true },
//    { path: 'shopInfo/detail', name: '数据导入店铺信息查看详情', component: _import('WebRoot/base/operate/storeManagement'), hidden: true },
//    { path: 'storeGroup', name: '店组信息', component: _import('WebRoot/base/storeGroup') },
//    { path: 'storeGroup/show', name: '数据导入店组信息查询', component: _import('WebRoot/base/operate/storeGroup'), hidden: true },
//    { path: 'storeGroup/info', name: '数据导入店组信息查看详情', component: _import('WebRoot/base/operate/storeGroupManagement'), hidden: true },
//    { path: 'regional', name: '区域信息', component: _import('WebRoot/base/regionalInfo') },
//    { path: 'regional/show', name: '数据导入区域信息查询', component: _import('WebRoot/base/operate/regional'), hidden: true },
//    { path: 'regional/info', name: '数据导入区域信息查看详情', component: _import('WebRoot/base/operate/regionalInfo'), hidden: true },
//    { path: 'staffInfo', name: '员工信息', component: _import('WebRoot/base/staffInfo') },
//    { path: 'staffInfo/show', name: '数据导入员工信息查询', component: _import('WebRoot/base/operate/staffInfo'), hidden: true },
//    { path: 'memberInfo', name: '会员信息', component: _import('WebRoot/base/memberInfo') },
//    { path: 'memberInfo/show', name: '数据导入会员信息查询', component: _import('WebRoot/base/operate/memberInfo'), hidden: true },
//    { path: 'memberInfo/showInfo', name: '数据导入会员信息查看详情', component: _import('WebRoot/base/operate/memberInfoData'), hidden: true },
//    { path: 'memberLabelData', name: '员工积分', component: _import('WebRoot/base/memberLabelData') },
//    { path: 'memberLabelData/show', name: '数据导入员工积分查询', component: _import('WebRoot/base/operate/memberLabelData'), hidden: true },
//    { path: 'orderInfo', name: '订单信息', component: _import('WebRoot/base/orderInfo') },
//    { path: 'orderInfo/show', name: '数据导入订单信息查询', component: _import('WebRoot/base/operate/orderInfo'), hidden: true },
//    { path: 'orderInfo/showInfo', name: '数据导入订单信息查看详情', component: _import('WebRoot/base/operate/orderInfoData'), hidden: true },
//    { path: 'salesSummary', name: '销售汇总', component: _import('WebRoot/base/salesSummary') },
//    { path: 'salesSummary/show', name: '数据导入销售汇总查询', component: _import('WebRoot/base/operate/salesSummary'), hidden: true }
//  ]
//},
//{
//  id: 3,
//  path: '/base',
//  component: Layout,
//  icon: 'rule',
//  name: '业务规则',
//  noDroupDown: false,
//  children: [
//    { path: 'merchantManagerUser', name: '会员权益', component: _import('WebRoot/base/merchantManagerUser') },
//    { path: 'dataDefine', name: '数据定义', component: _import('WebRoot/base/dataDefine') },
//    { path: 'memberLabel', name: '会员标签', component: _import('WebRoot/base/operate/memberLabel') },
//    { path: 'electronicVoucher', name: '电子券维护', component: _import('WebRoot/base/electronicVoucher') },
//    { path: 'messageTemplate', name: '短信模板', component: _import('WebRoot/base/messageTemplate') },
//    { path: 'messageTemplate/add', name: '业务规则短信模板新增', component: _import('WebRoot/base/operate/smsInfoHandle'), hidden: true },
//    { path: 'messageTemplate/edit', name: '业务规则短信模板修改', component: _import('WebRoot/base/operate/smsInfoHandle'), hidden: true },
//    { path: 'messageTemplate/show', name: '业务规则短信模板查询', component: _import('WebRoot/base/operate/smsInfoHandle'), hidden: true }
//  ]
//},
//// 平台统一认证管理
//
//{
//  id: 'sys',
//  path: '/account',
//  component: Layout,
//  icon: 'yingxiaohuodong',
//  name: '平台系统管理',
//  noDroupDown: false,
//  children: [
//    { path: 'organizational', name: '组织架构', component: _import('WebRoot/platform/organization') },
//    { path: 'organizational/add', name: '平台系统管理组织架构新增', component: _import('WebRoot/platform/operate/actOrganizational'), hidden: true },
//    { path: 'userGroup', name: '用户组', component: _import('WebRoot/platform/userGroup') },
//    { path: 'userGroup/Add', name: '平台系统管理用户组新增', component: _import('WebRoot/platform/operate/userGroupAdd'), hidden: true },
//    { path: 'userGroup/userOwn', name: '平台系统管理用户组所属用户', component: _import('WebRoot/platform/operate/userOwn'), hidden: true },
//    { path: 'role', name: '角色管理', component: _import('WebRoot/platform/roleManage') },
//    { path: 'role/add', name: '平台系统管理角色管理新增', component: _import('WebRoot/platform/operate/roleManageAdd'), hidden: true },
//    { path: 'role/edit', name: '平台系统管理角色管理修改', component: _import('WebRoot/platform/operate/roleManageAdd'), hidden: true },
//    { path: 'userManage', name: '用户管理', component: _import('WebRoot/platform/userManage') },
//    { path: 'userManage/add', name: '平台系统管理用户管理新增', component: _import('WebRoot/platform/operate/userAdd'), hidden: true },
//    { path: 'limitManage', name: '权限管理', component: _import('WebRoot/platform/limitManage') },
//    { path: 'logManage', name: '日志管理', component: _import('WebRoot/platform/logManage') }
//  ]
//},
//{
//  id: 'sys',
//  path: '/commerc',
//  component: Layout,
//  icon: 'yingxiaohuodong',
//  name: '商户管理',
//  noDroupDown: false,
//  children: [
//    { path: 'commercRegisterManage', name: '商户注册管理', component: _import('WebRoot/platform/commercRegisterManage'), meta: { role: ['SELLER', 'SYSTEM'] }},
//    { path: 'commercRegisterManage/Add', name: '商户管理商户注册管理新增', component: _import('WebRoot/platform/operate/commercRegisterAdd'), hidden: true },
//    { path: 'commercGroupManage', name: '商户组管理', component: _import('WebRoot/platform/commercGroupManage') },
//    { path: 'commercGroupManage/add', name: '商户管理商户组管理新增', component: _import('WebRoot/platform/operate/commercGroupAdd'), hidden: true },
//    { path: 'commercGroupManage/user', name: '商户管理商户组管理所属用户', component: _import('WebRoot/platform/operate/userGroupInfo'), hidden: true },
//    { path: 'commercRoleManage', name: '商户角色管理', component: _import('WebRoot/platform/commercRoleManage'), meta: { role: ['SELLER', 'SYSTEM'] }},
//    { path: 'commercRoleManage/add', name: '商户管理商户角色管理新增', component: _import('WebRoot/platform/operate/commercRoleAct'), hidden: true, params: { pageType: '添加' }},
//    { path: 'commercRoleManage/edit', name: '商户管理商户角色管理修改', component: _import('WebRoot/platform/operate/commercRoleAct'), hidden: true, params: { pageType: '修改' }},
//    { path: 'commercUserHandle', name: '商户用户管理', component: _import('WebRoot/platform/commercUserManage'), meta: { role: ['SELLER', 'SYSTEM'] }},
//    { path: 'commercUserHandle/show', name: '商户管理商户用户管理查询', component: _import('WebRoot/platform/operate/commercUserHandle'), hidden: true },
//    { path: 'commercUserHandle/add', name: '商户管理商户用户管理新增', component: _import('WebRoot/platform/operate/commercUserHandle'), hidden: true },
//    { path: 'commercUserHandle/edit', name: '商户管理商户用户管理修改', component: _import('WebRoot/platform/operate/commercUserHandle'), hidden: true },
//    { path: 'toAllocate', name: '权限分配', component: _import('WebRoot/platform/toAllocate'), meta: { role: ['SELLER', 'SYSTEM'] }},
//    { path: 'toAllocate/show', name: '商户管理权限分配查询', component: _import('WebRoot/platform/operate/toAllocateHandle'), hidden: true },
//    { path: 'toAllocate/edit', name: '商户管理权限分配设置', component: _import('WebRoot/platform/operate/toAllocateHandle'), hidden: true }
//  ]
//},
//{
//  id: 'sys',
//  path: '/sys',
//  component: Layout,
//  icon: 'tubiao',
//  noDropdown: true,
//  children: [
//    { path: 'templateActive', name: '预置活动模板', component: _import('WebRoot/platform/templateActive') },
//    { path: 'templateSms', name: '短信模板', component: _import('WebRoot/platform/templateSms') },
//    { path: 'templateGroup', name: '会员分组模板', component: _import('WebRoot/platform/templateGroup') },
//    { path: 'index/activeShow', name: '模板管理预置活动模板查询', component: _import('WebRoot/platform/operate/activiteInfoHandle'), hidden: true },
//    { path: 'index/activeAdd', name: '模板管理预置活动模板新增', component: _import('WebRoot/platform/operate/activiteInfoHandle'), hidden: true },
//    { path: 'index/activeEdit', name: '模板管理预置活动模板修改', component: _import('WebRoot/platform/operate/activiteInfoHandle'), hidden: true },
//    { path: 'index/smsShow', name: '模板管理短信模板查询', component: _import('WebRoot/platform/operate/smsInfoHandle'), hidden: true },
//    { path: 'index/smsAdd', name: '模板管理短信模板新增', component: _import('WebRoot/platform/operate/smsInfoHandle'), hidden: true },
//    { path: 'index/smsEdit', name: '模板管理短信模板修改', component: _import('WebRoot/platform/operate/smsInfoHandle'), hidden: true },
//    { path: 'index/groupShow', name: '模板管理会员分组模板查询', component: _import('WebRoot/platform/operate/groupInfoHandle'), hidden: true },
//    { path: 'index/groupAdd', name: '模板管理会员分组模板新增', component: _import('WebRoot/platform/operate/groupInfoHandle'), hidden: true },
//    { path: 'index/groupEdit', name: '模板管理会员分组模板修改', component: _import('WebRoot/platform/operate/groupInfoHandle'), hidden: true }
//  ]
//},
//{
//  id: 'sys',
//  path: '/common',
//  component: Layout,
//  redirect: '/common/index',
//  icon: 'tubiao',
//  noDropdown: true,
//  children: [
//    { path: 'index', name: '常量管理', component: _import('WebRoot/platform/commonManage'), meta: { role: ['SELLER', 'SYSTEM'] }},
//    { path: 'index/show', name: '常量管理查询', component: _import('WebRoot/platform/operate/commonHandle'), hidden: true },
//    { path: 'index/add', name: '常量管理新增', component: _import('WebRoot/platform/operate/commonHandle'), hidden: true },
//    { path: 'index/edit', name: '常量管理修改', component: _import('WebRoot/platform/operate/commonHandle'), hidden: true }
//  ]
//},
//{
//  id: 'sys',
//  path: '/log',
//  component: Layout,
//  redirect: '/log/index',
//  icon: 'tubiao',
//  noDropdown: true,
//  children: [{ path: 'index', name: '日志管理 ', component: _import('WebRoot/platform/log'), meta: { role: ['SELLER', 'SYSTEM'] }}]
//},
//{
//  id: 5,
//  path: '/tool',
//  component: Layout,
//  icon: 'yingxiaohuodong',
//  name: '门店摇一摇',
//  noDroupDown: false,
//  children: [
//    { path: 'activityManagement', name: '活动管理', component: _import('WebRoot/tool/activityManagement') },
//    { path: 'activityManagement/add', name: '门店摇一摇活动管理新增', component: _import('WebRoot/tool/operate/activityManagement'), hidden: true },
//    { path: 'activityManagement/set', name: '门店摇一摇活动管理修改', component: _import('WebRoot/tool/operate/activityManagement'), hidden: true },
//    { path: 'deviceBinding', name: '设备绑定', component: _import('WebRoot/tool/deviceBinding') },
//    { path: 'deviceBinding/add', name: '门店摇一摇设备绑定新增', component: _import('WebRoot/tool/operate/deviceBinding'), hidden: true },
//    { path: 'deviceBinding/edit', name: '门店摇一摇设备绑定修改', component: _import('WebRoot/tool/operate/deviceBinding'), hidden: true }
//  ]
//},
//{
//  id: 5,
//  path: '/tool',
//  component: Layout,
//  redirect: '/tool/index',
//  icon: 'tubiao',
//  noDropdown: true,
//  children: [
//    { path: 'scavengingVoucher', name: '扫码领券', component: _import('WebRoot/tool/scavengingVoucher') },
//    { path: 'scavengingVoucher/add', name: '扫码领券新增', component: _import('WebRoot/tool/operate/scavengingVoucher') },
//    { path: 'scavengingVoucher/edit', name: '扫码领券修改', component: _import('WebRoot/tool/operate/scavengingVoucher') }
//  ]
//},
//{
//  id: 5,
//  path: '/tool',
//  component: Layout,
//  icon: 'yingxiaohuodong',
//  name: '门店活动详情',
//  noDroupDown: false,
//  children: [
//    { path: 'shopActivities', name: '门店活动', component: _import('WebRoot/tool/shopActivities') },
//    { path: 'shopActivities/add', name: '门店活动门店活动新增', component: _import('WebRoot/tool/operate/shopActivities'), hidden: true },
//    { path: 'shopActivities/edit', name: '门店活动门店活动修改', component: _import('WebRoot/tool/operate/shopActivities'), hidden: true },
//    { path: 'shortMessageStatistics', name: '短信统计', component: _import('WebRoot/tool/shortMessageStatistics') },
//    { path: 'shortMessageStatistics/show', name: '活动短信统计 -查看', component: _import('WebRoot/tool/operate/shortMessageStatistics'), hidden: true }
//
//  ]
//},
//{
//  id: 5,
//  path: '/tool',
//  component: Layout,
//  redirect: '/tool/index',
//  icon: 'tubiao',
//  noDropdown: true,
//  children: [
//    { path: 'storeVoucher', name: '门店送券', component: _import('WebRoot/tool/storeVoucher') },
//    { path: 'storeVoucher/edit', name: '门店送券修改', component: _import('WebRoot/tool/operate/storeVoucher') },
//    { path: 'storeVoucher/add', name: '门店送券新增', component: _import('WebRoot/tool/operate/storeVoucher') }
//  ]
//},
//{
//  id: 5,
//  path: '/tool',
//  component: Layout,
//  icon: 'yingxiaohuodong',
//  name: '积分商城',
//  noDroupDown: false,
//  children: [
//    { path: 'voucher', name: '积分兑券', component: _import('WebRoot/tool/voucher') },
//    { path: 'voucher/add', name: '积分商城积分兑礼新增', component: _import('WebRoot/tool/operate/voucher'), hidden: true },
//    { path: 'voucher/show', name: '积分兑券 - 查看', component: _import('WebRoot/tool/operate/voucher'), hidden: true },
//    { path: 'voucher/edit', name: '积分商城积分兑礼修改', component: _import('WebRoot/tool/operate/voucher'), hidden: true },
//    { path: 'voucher/copy', name: '积分兑券 - 复制', component: _import('WebRoot/tool/operate/voucher'), hidden: true },
//    { path: 'ritualOfIntegration', name: '积分兑礼', component: _import('WebRoot/tool/ritualOfIntegration') },
//    { path: 'ritualOfIntegration/add', name: '积分商城积分兑礼新增', component: _import('WebRoot/tool/operate/ritualOfIntegration'), hidden: true },
//    { path: 'ritualOfIntegration/show', name: '积分兑礼- 查看', component: _import('WebRoot/tool/operate/ritualOfIntegration'), hidden: true },
//    { path: 'ritualOfIntegration/edit', name: '积分商城积分兑礼修改', component: _import('WebRoot/tool/operate/ritualOfIntegration'), hidden: true }
//  ]
//},
//{
//  id: 6,
//  path: '/work',
//  component: Layout,
//  icon: 'yingxiaohuodong',
//  name: '营销助手',
//  noDroupDown: false,
//  children: [
//    { path: 'ShopManagement', name: '导购管理', component: _import('WebRoot/work/ShopManagement') },
//    { path: 'cardProduction', name: '工牌制作', component: _import('WebRoot/work/cardProduction') },
//    { path: 'cardProduction/buy', name: '工牌制作-导购二维码', component: _import('WebRoot/work/operate/cardProductionbuy'), hidden: true },
//    { path: 'cardProduction/store', name: '工牌制作-门店二维码', component: _import('WebRoot/work/operate/cardProductionStore'), hidden: true },
//    { path: 'distributeShop', name: '分配专属导购', component: _import('WebRoot/work/distributeShop') },
//    { path: 'distributeStore', name: '分配服务门店', component: _import('WebRoot/work/distributeStore') }
//  ]
//},
//{
//  id: 6,
//  path: '/work',
//  component: Layout,
//  redirect: 'clearCenter',
//  icon: 'tubiao',
//  noDropdown: true,
//  children: [
//    { path: 'clearCenter', name: '清算中心', component: _import('WebRoot/work/clearCenter') },
//    { path: 'clearCenter/show', name: '清算中心-查看', component: _import('WebRoot/work/operate/clearCenter'), hidden: true },
//    { path: 'clearCenter/other', name: '清算中心-手工调账', component: _import('WebRoot/work/operate/clearCenterOther'), hidden: true }
//  ]
//},
//{
//  id: 6,
//  path: '/work',
//  component: Layout,
//  redirect: 'serveManage',
//  icon: 'fuwuguanli',
//  noDropdown: true,
//  children: [
//    { path: 'serveManage', name: '服务管理', component: _import('WebRoot/work/serveManage') },
//  ]
//},
//{ path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
