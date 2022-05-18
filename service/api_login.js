import { wkLoginRequest } from './index'

export function getLoginCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 1000,
      success: res => {
        const code = res.code;
        resolve(code)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

export function sendCodeToServer(code) {
  return wkLoginRequest.post("/login", { code })
}

// 检测token是否过期
export function checkToken(token) {
  return wkLoginRequest.post("/auth", {}, {
    token
  })
}

export function checkSession() {
  return new Promise((resolve) => {
    wx.checkSession({
      success: (res) => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}