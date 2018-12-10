import fetch from '@/utils/fetch'

/**
 * 工作管理  - 会员回访
 */
// 显示表格数据
export function getMemberReturnVisitList(data) {
    let result = Base64.encode(JSON.stringify(data))
    return fetch({
   	 	url: '/I_SCRM_INTERFACE_1001.action',
        method: 'post',
        data: result
    })
}

// 新增回访任务
export function addMemberReturnTask(data) {
  let result = Base64.encode(JSON.stringify(data))
  return fetch({
      url: '/I_SCRM_INTERFACE_1003.action',
      method: 'post',
      data: result
  })
}
