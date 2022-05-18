// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest, getSearchResult } from '../../service/api_search'
import debounce from '../../utils/debounce'
import stringToNodes from '../../utils/string2nodes'

const debounceGetSearchSuggest = debounce(getSearchSuggest)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotKeywords: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    resultSongs: [],
    searchValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getPageData()
  },

  // 网络请求
  getPageData() {
    getSearchHot().then(res => {
      console.log(res);
      this.setData({ hotKeywords: res.result.hots })
    })
  },


  // 事件处理
  handleSearchChange(event) {
    // 获取关键字
    const searchValue = event.detail;
    // 保存关键字
    this.setData({ searchValue })
    // 判断关键字是否是空字符串
    if(!searchValue.length) {
      this.setData({ suggestSongs: [] })
      this.setData({ resultSongs: [] })
      // 因为防抖是闭包引用的外界上一个searchValue，所以如果没有字符串直接不请求
      debounceGetSearchSuggest.cancel()
      return
    } 
    // 根据关键字来搜索
    debounceGetSearchSuggest(searchValue).then(res => {
      // 获取建议关键字歌曲
      const suggestSongs = res.result.allMatch
      this.setData({ suggestSongs })
      if(!suggestSongs) return
      // 转成node节点
      
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for(const keyword of suggestKeywords) {
        const nodes = stringToNodes(keyword, searchValue) 
        suggestSongsNodes.push(nodes)
      }
      this.setData({ suggestSongsNodes })
    })
  },
  handleSearchAction() {
    // 根据关键字发送网络请求
    const searchValue = this.data.searchValue;
    getSearchResult(searchValue).then(res => {
      // console.log(res);
      this.setData({ resultSongs: res.result.songs })
    })
  },
  handleKeywordItemClick(event) {
    const keyword = event.currentTarget.dataset.keyword;
    // 将关键字设置到searchValue中,也就是点击后设置到输入框
    this.setData({ searchValue: keyword })
    // 发送网络请求
    this.handleSearchAction()
  }
})