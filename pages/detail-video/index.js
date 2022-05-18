// pages/detail-video/index.js
import { getMVURL, getMVDetail, getRelatedVideo } from '../../service/api_video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvURLInfo: {},
    mvDetail: {},
    danmuList: [
      {
        text: 'Hello Wrks',
        color: '#ff0000',
        time: 12
      },
      {
        text: '666666',
        color: '#00ff00',
        time: 1
      }
    ],
    relatedVideos: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取id
    const id = options.id;
    // 获取数据
    this.getPageData(id)
  },

  // 获取数据的方法
  getPageData(id) {
    // 请求播放地址
    getMVURL(id).then(res =>{
      this.setData({ mvURLInfo: res.data })
    })
    // 请求视频信息
    getMVDetail(id).then(res =>{
      this.setData({ mvDetail: res.data })
    })
    // 请求相关视频
    getRelatedVideo(id).then(res =>{ 
      this.setData({ relatedVideos: res.data })
    })
  }

})