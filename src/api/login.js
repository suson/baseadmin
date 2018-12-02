import request from '@/utils/request'
let REQUEST_DATA = {
  url: '/service/urlcore/webreg.php',
  method: 'post',
  data: {
  }
}
export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(jsonstr) {
  REQUEST_DATA.data.f = 7;
  return request(REQUEST_DATA)
}

export function logout() {
  return request({
    url: '/service/urlcore/webreg.php',
    method: 'post',
    data: {
      f: 8
    }
  })
}
