// pages/home-music/index.js
import { rankingStore, rankingMap, playerStore } from '../../store/index'
 
import { getBanners, getSongMenu } from '../../service/api_music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

// 把查询函数转换成节流查询函数，以免频繁执行相同操作
const throttleQueryRect = throttle(queryRect, 100, { trailing: true })

Page({
  data: {
    swiperHeight: 60,
    banners: [],
    recommendSongs: [],
    recommendSongMenu: [],
    hotSongMenu: [],
    rankings: { 0: {}, 2: {}, 3: {} },

    currentSong: {},
    isPlaying: false,
    playAnimState: "paused"
  },

  onLoad(options) {
    this.getPageData()
    // 共享数据的请求
    rankingStore.dispatch("getRankingDataAction")


    this.setupPlayStoreListener()
  },

  getPageData() {
    getBanners().then(res =>{
      this.setData({ banners: res.banners })
    })

    getSongMenu().then(res => {
      this.setData({ hotSongMenu: res.playlists })
    })

    getSongMenu("华语").then(res => {
      this.setData({ recommendSongMenu: res.playlists })
    })
  },
  // 点击搜索框跳转到新的页面
  handleSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },

  // 处理轮播图高度的小问题
  handleSwiperImageLoaded() {
    throttleQueryRect('.swiper-image').then(res => {
      // console.log("查询结果次数");
      const rect = res[0];
      this.setData({ swiperHeight: rect.height })
    })
  },

  getRankingHandler(idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return
      // 拿数据
      const name = res.name;
      const playCount = res.playCount;
      const coverImgUrl = res.coverImgUrl;
      const songList = res.tracks.slice(0, 3);
      // 赋值给rankings
      const rankingObj = {name, coverImgUrl, playCount, songList};
      const newRankings = {...this.data.rankings, [idx]: rankingObj};
      this.setData({ rankings: newRankings })
    }
  },

  // 处理点击更多事件
  navigateToDetailSongsPage(rankingName) {
    wx.navigateTo({
      // ranking => 获取数据name     type => 跳转页
      url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`
    })
  },


  handleMoreClick() {
    this.navigateToDetailSongsPage("hotRanking")
  },
  handleRankingItem(event) {
    const idx = event.currentTarget.dataset.idx;
    const rankingName =  rankingMap[idx];
    // console.log(event.currentTarget.dataset.idx);
    this.navigateToDetailSongsPage(rankingName)
  },
  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index;
    // console.log(index, this.data.recommendSongs);
    playerStore.setState("playListSongs", this.data.recommendSongs)
    playerStore.setState("playListIndex", index)
  },
  handlePlayBtnClick(){
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
    
  },
  handlePlayBarClick() {
    wx.navigateTo({
      url: '/pages/music-player/index?id=' + this.data.currentSong.id,
    })
  },

  setupPlayStoreListener(){
    // 获取共享数据
    rankingStore.onState("hotRanking", res => {
      if(!res.tracks) return
      const recommendSongs = res.tracks.slice(0, 6)
      this.setData({ recommendSongs })
    }) 
    rankingStore.onState("newRanking", this.getRankingHandler(0))
    rankingStore.onState("originRanking", this.getRankingHandler(2))
    rankingStore.onState("upRanking", this.getRankingHandler(3))   
    
    // 获取播放器
    playerStore.onStates(["currentSong", "isPlaying"], ({currentSong, isPlaying}) => {
      if (currentSong) this.setData({ currentSong })
      if (isPlaying !== undefined) this.setData({ isPlaying, playAnimState: isPlaying ? 'running': 'paused' })
    })
  }
})