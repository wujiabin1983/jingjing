import fetch from '@/utils/fetch'

/** 
 * 图文素材 - 图文信息
 */
// 分组列表 - 显示
export function MaterialLibraryFirstShow(data) {
  const result = Base64.encode(JSON.stringify(data))
  // console.log(result);
  return fetch({
    url: '/I_SCRM_INTERFACE_730.action',
    method: 'post',
    data: result
  })
}
// 分组列表 - 添加
export function MaterialLibraryFirstAdd(data) {
  const result = Base64.encode(JSON.stringify(data))
  // console.log(result, 'result');
  return fetch({
    url: '/I_SCRM_INTERFACE_731.action',
    method: 'post',
    data: result
  })
}

// 分组列表 - 修改
export function MaterialLibraryFirstEdit(data) {
  const result = Base64.encode(JSON.stringify(data))
  // console.log(result, 'result');
  return fetch({
    url: '/I_SCRM_INTERFACE_732.action',
    method: 'post',
    data: result
  })
}

// 分组列表 - 修改
export function MaterialLibraryFirstDelete(data) {
  const result = Base64.encode(JSON.stringify(data))
//console.log(result, 'result');
  return fetch({
    url: '/I_SCRM_INTERFACE_733.action',
    method: 'post',
    data: result
  })
}








/**
 * 图文素材 - 图片
 *  分组列表 - 显示 MaterialLibraryListShow - I_SCRM_INTERFACE_254
 *  分组列表 - 添加 MaterialLibraryListAdd - I_SCRM_INTERFACE_250
 *  分组列表 - 名称重命名   MaterialLibraryListEdit - I_SCRM_INTERFACE_251
 *  分组列表 - 名称删除 MaterialLibraryListDelete - I_SCRM_INTERFACE_252
 *  分组列表 - 图片素材添加 MaterialLibraryCardAdd - I_SCRM_INTERFACE_256
 *  分组内容 - 图片素材卡片 MaterialLibraryCardShow - I_SCRM_INTERFACE_255
 *  分组内容 - 图片素材修改 MaterialLibraryCardEdit - I_SCRM_INTERFACE_257
 *  分组内容 - 图片素材移动  MaterialLibraryCardMove - I_SCRM_INTERFACE_259 (图)
 *  分组内容 - 图片素材删除 MaterialLibraryCardDelete - I_SCRM_INTERFACE_258 (图)
 *
 */

// 分组列表 - 显示
export function MaterialLibraryListShow(data) {
  const result = Base64.encode(JSON.stringify(data))
//console.log(result);
  return fetch({
    url: '/I_SCRM_INTERFACE_254.action',
    method: 'post',
    data: result
  })
}

// 分组列表 - 添加
export function MaterialLibraryListAdd(data) {
  const result = Base64.encode(JSON.stringify(data));
//console.log(result, 'result');
  return fetch({
    url: '/I_SCRM_INTERFACE_250.action',
    method: 'POST',
    data: result
  })
}

// 分组列表 - 名称重命名
export function MaterialLibraryListEdit(data) {
  const result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_251.action',
    method: 'post',
    data: result
  })
}
// 分组列表 - 名称删除
export function MaterialLibraryListDelete(data) {
  const result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_252.action',
    method: 'post',
    data: result
  })
}

// 分组内容 - 图片素材卡片 MaterialLibraryCardShow
export function MaterialLibraryCardShow(data) {
  const result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_255.action',
    method: 'post',
    data: result
  })
}
// 分组内容 - 图片素材卡片 MaterialLibraryCardShow
export function MaterialLibraryCardShow2(data) {
  const result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_255_01.action',
    method: 'post',
    data: result
  })
}

// 分组内容 - 图片素材卡片 MaterialLibraryCardAdd
export function MaterialLibraryCardAdd(data) {
  const result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_256.action',
    method: 'post',
    data: result
  })
}

// 分组内容 - 图片素材移动 MaterialLibraryCardMove
export function MaterialLibraryCardMove(data) {
  const result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_259.action',
    method: 'post',
    data: result
  })
}
// 分组内容 - 图片素材删除 MaterialLibraryCardDelete(逐一删除)
export function MaterialLibraryCardDelete(data) {
  const result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_258.action',
    method: 'post',
    data: result
  })
}

// 分组内容 - 图片素材修改
export function MaterialLibraryCardEdit(data) {
  const result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_257.action',
    method: 'post',
    data: result
  })
}

// 根据id查询
export function MaterialLibraryCardShow3(data) {
  const result = Base64.encode(JSON.stringify(data))
  return fetch({
    url: '/I_SCRM_INTERFACE_255_01.action',
    method: 'post',
    data: result
  })
}