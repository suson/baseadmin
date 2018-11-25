import request from '@/utils/request'

/**
 * 获取列表数据
 * @param {*} jsonstr i的值
 */
export function getList(jsonstr) {
  return request({
    url: '/service/urlcore/webreg.php',
    method: 'post',
    data: {
      f: 36,
      i: jsonstr
    }
  })
}


export function del(jsonstr) {
  return request({
    url: '/service/urlcore/webreg.php',
    method: 'post',
    data: {
      f: 38,
      i: jsonstr
    }
  })
}

export function operate(jsonstr) {
  return request({
    url: '/service/urlcore/webreg.php',
    method: 'post',
    data: {
      f: 37,
      i: jsonstr
    }
  })
}