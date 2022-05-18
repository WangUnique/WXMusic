// pages/home-video/index.js
// import wkRequest from '../../service/index.js'
import { getTopMV } from '../../service/api_video'

Page({
  data: {
    topMVs: {},
    // 判断是否还有新数据的参数
    hasMore: true
  },
  onLoad(options) {
    this.getTopMVData(0)
  },

  // 网络请求方法
  async getTopMVData(offset) {
    // 判断一下是否可以请求数据
    // 如果 this.data.hasMore = false 并且 offset = 0 就跳出该方法
    if(!this.data.hasMore && offset !== 0) return 
    wx.showNavigationBarLoading()
    // 请求数据
    const res = await getTopMV(offset)
    let newData = this.data.topMVs
    if(offset === 0) {
      newData = res.data
    } else {
      newData = newData.concat(res.data)
    }

    // 设置数据
    this.setData({ topMVs: newData })
    this.setData({ hasMore: res.hasMore })
    wx.hideNavigationBarLoading()
    if(offset === 0) {
      wx.stopPullDownRefresh()
    }
  },
  // 事件处理方法
  handleVideoItemClick(event) {
    // 获取当前mv的id
    const id = event.currentTarget.dataset.item.id
    // 页面跳转
    wx.navigateTo({
      url: '/pages/detail-video/index?id=' + id,
    })
  },


   onPullDownRefresh() {
     this.getTopMVData(0)
  },
  onReachBottom() {
    // if(!this.data.hasMore) return
    // const res = await getTopMV(this.data.topMVs.length)
    // this.setData({ topMVs: this.data.topMVs.concat(res.data) })
    // this.setData({ hasMore: res.hasMore })
    this.getTopMVData(this.data.topMVs.length)
  },
  onShareAppMessage() {

  }
})