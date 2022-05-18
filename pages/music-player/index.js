// pages/music-player/index.js
import { audioContext, playerStore } from "../../store/index";

const playModeNames = ["order", "repeat", "random"]

Page({
  data: {
    id: 0,
    durationTime: 0, 
    lyricInfos: [],
    currentSong: {},

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",

    isPlaying: false,
    playingName: 'pause',

    playModeIndex: 0,
    playModeName: "order",

    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0,
    isSliderChanging: false,
    lyricScrollTop: 0
  },

  onLoad(options) {
    const id = options.id
    this.setData({ id })

    // this.getPageData(id)

    // 动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight= globalData.navBarHeight
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({ contentHeight })

    // 事件监听
    // this.setupAudioContextListener()
    this.setupPlayerStoreListener();
  },

  // // ============================== 网络请求代码 
  getPageData() {
  },

  // ============================== 事件处理 
  handleSwiperChange(event) {
    const current = event.detail.current
    this.setData({ currentPage: current })
  },
  handleSliderChange(event) {
    // 获取slider变化值  0 - 100
    const value = event.detail.value
    // 根据value计算当前播放时间
    const currentTime = this.data.durationTime * value / 100
    // 设置context播放器位置的音乐
    // audioContext.pause()  // 解决跳动bug
    audioContext.seek(currentTime / 1000)
    // 记录最新sliderValue
    this.setData({ sliderValue: value, isSliderChanging: false })
  },
  handleSliderChanging(event) {
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({ isSliderChanging: true, currentTime })
  },
  handleBackButtonClick(){
    wx.navigateBack()
  },
  handleModeBtnClick(){
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex === 3) playModeIndex = 0 

    // 设置
    playerStore.setState("playModeIndex", playModeIndex)
  }, 
  handlePlayBtnClick() {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },
  handlePrevBtnClick(){
    playerStore.dispatch("changeNewMusicAction", false)
  },
  handleNextBtnClick(){
    playerStore.dispatch("changeNewMusicAction", true)
  },

  
  // ============================== 数据监听
  setupPlayerStoreListener() {
    playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], ({
      currentSong,
      durationTime,
      lyricInfos
    }) => {
      if (currentSong) this.setData({ currentSong })
      if (durationTime) this.setData({ durationTime })
      if (lyricInfos) this.setData({ lyricInfos })
    }) 

    playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], ({
      currentTime,
      currentLyricIndex,
      currentLyricText
    }) => {
      // 时间变化的时候
      // currentTime有值并且没有滑动滑块的时候设置新值
      if(currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ currentTime, sliderValue })
      }

      // 歌词变化的时候
      if(currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      }
      if(currentLyricText) {
        this.setData({ currentLyricText })
      }

      // 监听播放数据
      playerStore.onStates(["playModeIndex", "isPlaying"], ({playModeIndex, isPlaying}) => {
        if (playModeIndex !== undefined) {
          this.setData({ 
            playModeIndex, 
            playModeName: playModeNames[playModeIndex] 
          })
        }
        if(isPlaying !== undefined){
          this.setData({ 
            isPlaying,
            playingName: isPlaying ? "pause": "resume" 
          })
        }
      })
    }) 
  },
  
  onUnload() {}
})