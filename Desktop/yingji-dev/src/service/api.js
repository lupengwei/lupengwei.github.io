import axios from 'axios'

// api 路径
const HOST = 'http://localhost:5581';
// const server = 'http://salesman.cq-tct.com';

export function fetch(url, method = 'GET', params) {

  $.showPreloader();

  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: HOST + url,
      headers: {
        authorization: localStorage.getItem('sales_token')
      },
      data: params
    })
    .then((response) => {
      
      $.hidePreloader();

      resolve(response.data)

    })
    .catch((error) => {

      $.hidePreloader();

      if(error.response.status == 401 || error.response.status == 500) return window.location.href = "/401";

      reject(error)
    })
  })
}

export default {

  // 根据wxId获取用户信息
  getWechatAuth(wxId) {
    return fetch('/auth/user/' + wxId)
  }

}
