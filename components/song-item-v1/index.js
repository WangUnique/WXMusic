// components/song-item-v1/index.js
import { playerStore } from '../../store/index'
 
Component({
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  data: {

  },
  methods: {  
    handleSongItemClick() {
      const id = this.properties.item.id;
      wx.navigateTo({
        url: '/pages/music-player/index?id=' + id,
      })

      // 对歌曲数据请求
      playerStore.dispatch("playMusicWithSongIdAction", { id })

    }
  }
})
