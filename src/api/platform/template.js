// 平台管理 - 模板管理
import fetch from '@/utils/fetch'
/**
 * 预置活动模板
 */
// 显示表格数据
export function selectInfo(data) {
  const result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: 'I_SCRM_INTERFACE_132.action',
    method: 'get',
    data: result
  })
}



