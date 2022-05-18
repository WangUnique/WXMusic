import { HYEventStore } from "hy-event-store"
import { getSongDetail, getSongLyric } from '../service/api_player'
import { parseLyric } from '../utils/parse-lyric'

// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
  state: {
    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],

    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",

    isPlaying: false,
    isFirstPlay: true,

    // 0 循环 1 单曲 2 随机
    playModeIndex: 0,
    playListSongs: [],
    playListIndex: 0
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      // 如果点击的是同一首歌直接返回,固定播放
      if(ctx.id == id && !isRefresh) {
        this.dispatch("changeMusicPlayStatusAction", true)
        return
      }
      ctx.id = id
      // 去除残影
      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.lyricInfos = []
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ""
      // 歌曲详情
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })
      // 歌词信息
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        const lyrics = parseLyric(lyricString)
        ctx.lyricInfos = lyrics
      })
      // 播放歌曲
      audioContext.stop() 
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = id
      audioContext.autoplay = true

      // 监听事件
      if (ctx.isFirstPlay) {
        this.dispatch("setupAudioContextListenerAction")
        ctx.isFirstPlay = false
      }
    },
    setupAudioContextListenerAction(ctx) {
      // 监听
      audioContext.onCanplay(() => {
        audioContext.play()
      }) 
  
      audioContext.onTimeUpdate(() => {
        // 获取时间
        const currentTime = audioContext.currentTime * 1000
        ctx.currentTime = currentTime

        // 根据当前时间查找播放歌词
        if (!ctx.lyricInfos.length) return
        let i = 0
        for(; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i]
          if(currentTime < lyricInfo.time) {
            break
          }
        }
  
        // 设置当前歌词index以及内容
        const currentIndex = i - 1; 
        if(ctx.currentLyricIndex !== currentIndex) {
          const currentLyricInfo = ctx.lyricInfos[currentIndex]
          ctx.currentLyricIndex = currentIndex
          ctx.currentLyricText = currentLyricInfo.text
        }
      })

      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicAction", true)
      })

      audioContext.onPlay(() => {
        ctx.isPlaying = true
      })
      audioContext.onPause(() => {
        ctx.isPlaying = false
      })
    },
    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying;
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    }, 
    changeNewMusicAction(ctx, isNext = true){
      let index = ctx.playListIndex;

      // 根据播放模式来获取下一首歌
      switch(ctx.playModeIndex) {
        case 0: //顺序播放
          index = isNext ? index + 1 : index - 1
          // 如果index等于-1时，则从结尾开始
          if(index === -1) index = ctx.playListSongs.length - 1
          // 如果index等于列表歌曲长度，则从头开始
          if(index === ctx.playListSongs.length) index = 0;
          break;
        case 1: //单曲循环
          // 保持index不变即可
          break;
        case 2: //随机播放
          index = Math.floor( Math.random() * ctx.playListSongs.length )
          console.log(index);
          break;
      }
      
      // 获取对应音乐
      let currentSong = ctx.playListSongs[index]
      if (!currentSong) {
        currentSong = ctx.currentSong
      } else {
        ctx.playListIndex = index
      }

      // 播放新歌曲
      this.dispatch("playMusicWithSongIdAction", { id: currentSong.id, isRefresh: true })
    },
  }
})

export {
  audioContext,
  playerStore
}