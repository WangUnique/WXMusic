import wkRequest from "./index";

export function getSongDetail(ids) {
  return wkRequest.get('/song/detail', {
    ids
  })
} 

export function getSongLyric(id) {
  return wkRequest.get('/lyric', {
    id
  })
}