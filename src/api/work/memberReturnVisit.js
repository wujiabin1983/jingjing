import fetch from '@/utils/fetch'

/**
 * 工作管理  - 会员回访
 */
// 显示表格数据
export function apiGetMemberReturnVisitList(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1001.action',
    method: 'post',
    data: result
  })
}

// 新增回访任务
export function apiAddMemberReturnTask(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1003.action',
    method: 'post',
    data: result
  })
}
// 编辑回访任务
export function apiUpdateMemberReturnTask(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1019.action',
    method: 'post',
    data: result
  })
}
// 回访任务详情列表
export function apiGetMemberReturnTaskDetailsList(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1031.action',
    method: 'post',
    data: result
  })
}
// 回访任务详情
export function apiGetMemberReturnTaskDetails(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1002.action',
    method: 'post',
    data: result
  })
}

// 删除回访任务
export function apiDeleteMemberReturnTask(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
      url: '/I_SCRM_INTERFACE_1005.action',
      method: 'post',
      data: result
    })
  }
// 停止回访任务
export function apiStopMemberReturnTask(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
      url: '/I_SCRM_INTERFACE_1006.action',
      method: 'post',
      data: result
    })
  }
// 启用回访任务
export function apiStartMemberReturnTask(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1007.action',
    method: 'post',
    data: result
  })
}

//某会员的回访内容详情
export function apiGetMemberReturnRecord(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1015.action',
    method: 'post',
    data: result
  })
}

/**
 * 工作管理  - 会员回访-回访模版
 */
// 显示表格数据
export function apiGetQuestionnaireTemplateList(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1008.action',
    method: 'post',
    data: result
  })
}

// 新增回访模版
export function apiAddQuestionnaireTemplate(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1010.action',
    method: 'post',
    data: result
  })
}
// 修改回访模版
export function apiUpdateQuestionnaireTemplate(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1011.action',
    method: 'post',
    data: result
  })
}

// 回访模版详情
export function apiGetQuestionnaireTemplateDetails(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1009.action',
    method: 'post',
    data: result
  })
}

// 删除回访模版
export function apiDeleteQuestionnaireTemplate(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
      url: '/I_SCRM_INTERFACE_1012.action',
      method: 'post',
      data: result
    })
  }
// 停止回访模版
export function apiStopQuestionnaireTemplate(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
      url: '/I_SCRM_INTERFACE_1013.action',
      method: 'post',
      data: result
    })
  }
// 启用回访模版
export function apiStartQuestionnaireTemplate(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1014.action',
    method: 'post',
    data: result
  })
}


/**
 * 工作管理  - 巡店管理-巡店模版
 */
// 显示表格数据
export function apiGetPatrolStoreTemplateList(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1024',
    method: 'post',
    data: result
  })
}

// 新增巡店模版
export function apiAddPatrolStoreTemplate(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1026.action',
    method: 'post',
    data: result
  })
}
// 修改巡店模版
export function apiUpdatePatrolStoreTemplate(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1027.action',
    method: 'post',
    data: result
  })
}

// 巡店模版详情
export function apiGetPatrolStoreTemplateDetails(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1025.action',
    method: 'post',
    data: result
  })
}

// 删除巡店模版
export function apiDeletePatrolStoreTemplate(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
      url: '/I_SCRM_INTERFACE_1028.action',
      method: 'post',
      data: result
    })
  }
// 停止巡店模版
export function apiStopPatrolStoreTemplate(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
      url: '/I_SCRM_INTERFACE_1029.action',
      method: 'post',
      data: result
    })
  }
// 启用巡店模版
export function apiStartPatrolStoreTemplate(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_1030.action',
    method: 'post',
    data: result
  })
}