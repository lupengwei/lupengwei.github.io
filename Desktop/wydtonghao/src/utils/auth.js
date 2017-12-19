import Cookies from 'js-cookie'
<<<<<<< HEAD
=======
// import { getUserToken } from '../api/login.js'
>>>>>>> 34e829211bab2ff5e527417250700d024a17f35e

const TokenKey = 'Admin-Token'

export function getToken() {
<<<<<<< HEAD
  Cookies.set('Admin-Token', 'admin');
  Cookies.set('sidebarStatus', 0);
  return Cookies.get(TokenKey)
}

export function getMyToken() {
  return Cookies.get(TokenKey)
=======
  // getUserToken()
  // getUserToken().then(data => {
  //   console.log(data)
  // })
  // Cookies.set('Admin-Token', 'admin')
  // Cookies.set('sidebarStatus', 0)
  // return Cookies.get(TokenKey)
>>>>>>> 34e829211bab2ff5e527417250700d024a17f35e
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
