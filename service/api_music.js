import wkRequest from './index'

// 获取轮播图
export function getBanners() {
  return wkRequest.get("/banner", {
    type: 2
  })
}

// 获取排行榜
export function getRankings(idx) {
  return wkRequest.get("/top/list", {
    idx
  })
}

// 获取歌单分类
export function getSongMenu(cat="全部", limit=6, offset=0) {
  return wkRequest.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}

// 获取歌单详情
export function getSongDetail(id) {
  return wkRequest.get("/playlist/detail/dynamic", {
    id
  })
}
