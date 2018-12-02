import request from '@/utils/request'
let REQUEST_DATA = {
  url: '/service/urlcore/webreg.php',
  method: 'post',
  data: {
  }
}
/**
 * 获取列表数据
 * @param {*} jsonstr i的值
 */
export function getList(jsonstr) {
  REQUEST_DATA.data.f = 36;
  REQUEST_DATA.data.i = jsonstr;
  return request(REQUEST_DATA)
}


export function del(jsonstr) {
  REQUEST_DATA.data.f = 38;
  REQUEST_DATA.data.i = jsonstr;
  return request(REQUEST_DATA)
}
// 开启停止分享
export function operate(jsonstr) {
  REQUEST_DATA.data.f = 37;
  REQUEST_DATA.data.i = jsonstr;
  return request(REQUEST_DATA)
}

export function getInfo(jsonstr) {
  REQUEST_DATA.data.f = 39;
  REQUEST_DATA.data.i = jsonstr;
  return request(REQUEST_DATA)
}

export function save(jsonstr) {
  REQUEST_DATA.data.f = 35;
  REQUEST_DATA.data.i = jsonstr;
  return request(REQUEST_DATA)
}

// 获取代挂
export function getService(jsonstr) {
  REQUEST_DATA.data.f = 31;
  REQUEST_DATA.data.i = jsonstr;
  return request(REQUEST_DATA)
}

// 开通代挂
export function openService(jsonstr) {
  REQUEST_DATA.data.f = 32;
  REQUEST_DATA.data.i = jsonstr;
  return request(REQUEST_DATA)
}
// 退订代挂
export function closeService(jsonstr) {
  REQUEST_DATA.data.f = 33;
  REQUEST_DATA.data.i = jsonstr;
  return request(REQUEST_DATA)
}

// 开通优化
// export function openOptimize(jsonstr) {
//   REQUEST_DATA.data.f = 33;
//   REQUEST_DATA.data.i = jsonstr;
//   return request(REQUEST_DATA)
// }