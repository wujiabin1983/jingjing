
// 判断是否为空对象 {}
// @param obj  对象
// return: true=空对象 , false=非空对象

function isEmptyObj(obj){
  return Object.keys(obj).length == 0
}

// 深拷贝对象
// @param {obj} obj 
const deepCopyObj = (obj) => JSON.parse(JSON.stringify(obj));

// 浅拷贝对象
// @param {obj} obj 
const shallowCopyObj = (...obj) => Object.assign({}, ...obj);

const fun = {
  isEmptyObj,
  deepCopyObj,
  shallowCopyObj
}
export default fun