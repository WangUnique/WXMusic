// pages/detail-songs/index.js
import { rankingStore, playerStore } from '../../store/index'
import { getSongDetail } from '../../service/api_music'
Page({
  data: {
    type: "",
    ranking: "",
    songInfo: {}
  },

  onLoad(options) {
    const type = options.type
    this.setData({ type })
    if(type === "menu") {
      const id = options.id;
      getSongDetail(id).then(res => {
        this.setData({ songInfo: res.playlist })
      })
    } else if(type === "rank") {
      const ranking = options.ranking
      this.setData({ ranking })
      // 获取对应数据
      rankingStore.onState(ranking, this.getRankingDataHanlder)
    }
  },

  onUnload() {
    if (this.data.ranking) {
      rankingStore.offState(this.data.ranking, this.getRankingDataHanlder)
    }
  },

  getRankingDataHanlder(res) {
    this.setData({ songInfo: res })
  },

  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index;
    // console.log(this.data.songInfo);
    playerStore.setState("playListSongs", this.data.songInfo.tracks)
    playerStore.setState("playListIndex", index)
  }

})