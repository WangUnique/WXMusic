import wkRequest from './index'
export function getTopMV(offset, limit = 10) {
  return wkRequest.get('/top/mv', {
    offset,
    limit
  })
}

export function getMVURL(id) {
  return wkRequest.get("/mv/url", {
    id
  })
} 
export function getMVDetail(mvid) {
  return wkRequest.get("/mv/detail", {
    mvid
  })
}

export function getRelatedVideo(id) {
  return wkRequest.get("/related/allvideo", {
    id
  })
}