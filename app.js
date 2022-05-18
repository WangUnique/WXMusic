// app.js
import { getLoginCode, sendCodeToServer, checkToken, checkSession } from './service/api_login'
import { TOKEN_KEY } from './constants/token-const'


App({
  globalData: {
    screenWidth: 0,
    screedHeight: 0,
    statusBarHeight: 0,
    navBarHeight: 44
  },
  onLaunch() {
  // 系统信息
    const info = wx.getSystemInfoSync()
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight
  // 全局设置
    // 真机调试打开
    // if(parseFloat(info.SDKVersion) > 0) {
    //   wx.setInnerAudioOption({
    //     obeyMuteSwitch: false //ios 中即使静音开关打开音频也会输出声音
    //   })
    // } else {
    //   wx.showModal({
    //     title: "提示",
    //     content: "当前微信版本过低，静音模式下可能会导致播放音频失败哦"
    //   })
    // }

    // 用户默认登陆
    this.handleLogin()
  },
  async handleLogin(){
    const token = wx.getStorageSync(TOKEN_KEY)
    console.log(token);
    // 判断token是否过期
    const checkResult = await checkToken(token)
    console.log(checkResult);
    // 判断session是否过期
    const isSessionExpire = await checkSession()

    if(!token || checkResult.errorCode || !isSessionExpire) {
      this.loginAction()
    }
  },
  async loginAction(){
    // 1- 获取code
    const code = await getLoginCode()
    // 将code发送给服务器
    const result = await sendCodeToServer(code)
    const token = result.token
    wx.setStorageSync(TOKEN_KEY, token)
  }
})
